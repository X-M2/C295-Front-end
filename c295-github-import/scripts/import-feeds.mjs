#!/usr/bin/env node
// Builds data/activities.json for the website.
//
// 1. Downloads each organisation's public calendar feed (iCal / .ics) listed in data/feed-sources.json
// 2. Turns every upcoming event into an Activity (the shape in docs/api.md)
// 3. Adds the hand-entered activities from data/manual-activities.json
// 4. Writes data/activities.json, which GitHub Pages serves next to the website
//
// Runs every day on GitHub Actions (.github/workflows/import-activities.yml).
// To try it on your own computer: node scripts/import-feeds.mjs   (needs Node 20 or newer)

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES_FILE = process.env.SOURCES_FILE || path.join(ROOT, "data/feed-sources.json");
const MANUAL_FILE = process.env.MANUAL_FILE || path.join(ROOT, "data/manual-activities.json");
const OUT_FILE = process.env.OUT_FILE || path.join(ROOT, "data/activities.json");

const AREAS = ["SL", "OA", "HL", "CL"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const PLUS8 = /^(Asia\/(Singapore|Shanghai|Kuala_Lumpur|Hong_Kong|Manila|Taipei)|Singapore)$/;
const SG_MS = 8 * 3600 * 1000;

// ---- iCal parsing ------------------------------------------------------------

const unfold = (t) => t.replace(/\r\n?/g, "\n").replace(/\n[ \t]/g, "");
const unesc = (v) => v.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");
const clean = (v, max) =>
  unesc(v || "").replace(/<[^>]*>/g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);

function splitProp(line) {
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') inQuotes = !inQuotes;
    else if (line[i] === ":" && !inQuotes) return [line.slice(0, i), line.slice(i + 1)];
  }
  return null;
}

function parseEvents(text) {
  const events = [];
  let cur = null;
  for (const line of unfold(text).split("\n")) {
    if (line === "BEGIN:VEVENT") { cur = {}; continue; }
    if (line === "END:VEVENT") { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const parts = splitProp(line);
    if (!parts) continue;
    const [name, ...rawParams] = parts[0].split(";");
    const params = {};
    for (const p of rawParams) {
      const [k, ...rest] = p.split("=");
      params[k.toUpperCase()] = rest.join("=").replace(/^"|"$/g, "");
    }
    cur[name.toUpperCase()] = { params, value: parts[1] };
  }
  return events;
}

function parseDate(prop) {
  if (!prop) return null;
  const m = prop.value.trim().match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h = "00", mi = "00", s = "00", z] = m;
  let offset;
  if (z) offset = "Z";
  else if (!prop.params.TZID || PLUS8.test(prop.params.TZID)) offset = "+08:00";
  else return null; // unknown time zone: skip the event instead of guessing
  const t = new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}${offset}`);
  return isNaN(t) ? null : t;
}

// "Closing Date 12 Sep, Friday" -> 23:59 that day, Singapore time
function closingDate(text, start) {
  const m = text.match(/Closing Date\s*[:\-]?\s*(\d{1,2})\s+([A-Za-z]{3,9})/i);
  if (!m) return null;
  const month = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase());
  if (month < 0) return null;
  const sg = new Date(start.getTime() + SG_MS);
  let year = sg.getUTCFullYear();
  if (month > sg.getUTCMonth()) year -= 1; // e.g. closes in December for a January event
  const t = new Date(`${year}-${String(month + 1).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}T23:59:00+08:00`);
  return isNaN(t) || t > start ? null : t;
}

// 23:59 the day before the activity, Singapore time
function dayBefore(start) {
  const sg = new Date(start.getTime() + SG_MS);
  return new Date(Date.UTC(sg.getUTCFullYear(), sg.getUTCMonth(), sg.getUTCDate()) - SG_MS - 60 * 1000);
}

// Same event -> same id every day, so links to activity.html?id=... keep working
const stableId = (sourceKey, uid) => `${sourceKey}-${createHash("sha1").update(uid).digest("hex").slice(0, 10)}`;

function toActivities(icsText, source, now, skipped) {
  const out = [];
  for (const ev of parseEvents(icsText)) {
    const title = clean(ev.SUMMARY?.value, 200);
    const start = parseDate(ev.DTSTART);
    if (!title || !start) { skipped.push(`${source.key}: ${title || "(no title)"} (no usable date)`); continue; }
    let end = parseDate(ev.DTEND);
    if (!end || end <= start) end = new Date(start.getTime() + 2 * 3600 * 1000);
    if (end.getTime() <= now) continue; // already over

    const description = clean(ev.DESCRIPTION?.value, 1500);
    const text = `${title}\n${description}`;
    const rule = (source.areaRules || []).find((r) => new RegExp(r.pattern, "i").test(text));
    const area = rule ? rule.area : source.defaultArea;

    const spotsMatch = description.match(/Maximum No\.? of Participants\s*[:\-]?\s*(\d+)/i);
    const spotsTotal = spotsMatch && Number(spotsMatch[1]) > 0 ? Number(spotsMatch[1]) : source.defaultSpots;

    const organiserEmail = (ev.ORGANIZER?.value || "").replace(/^mailto:/i, "").trim();
    const textEmail = (description.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [])[0];
    const email = /@/.test(organiserEmail) ? organiserEmail : textEmail || source.fallbackEmail;
    if (!email) { skipped.push(`${source.key}: ${title} (no contact email)`); continue; }

    const location =
      [...new Set(clean(ev.LOCATION?.value, 300).split(",").map((s) => s.trim()).filter(Boolean))].join(", ") ||
      "See the organiser's page";
    const uid = (ev.UID?.value || ev.URL?.value || `${title}-${start.toISOString()}`).trim();

    out.push({
      id: stableId(source.key, uid),
      area,
      title,
      organiser: source.name,
      location,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      spotsTotal,
      spotsTaken: 0,
      signupClosesAt: (closingDate(description, start) || dayBefore(start)).toISOString(),
      description,
      photoUrl: null,
      contact: { type: "email", value: email },
      joined: false,
      friendsGoing: [],
      source: source.key,
      externalUrl: (ev.URL?.value || "").trim() || null,
    });
  }
  return out;
}

// ---- helpers -------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function monthKeys(monthsAhead, now) {
  const sg = new Date(now + SG_MS);
  const keys = [];
  for (let i = 0; i <= monthsAhead; i++) {
    const d = new Date(Date.UTC(sg.getUTCFullYear(), sg.getUTCMonth() + i, 1));
    keys.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return fallback;
    throw new Error(`${path.relative(ROOT, file)} is not valid JSON: ${e.message}`);
  }
}

function checkSource(s) {
  const problems = [];
  if (!/^[a-z0-9]+$/.test(s.key || "")) problems.push("key must be lowercase letters/numbers");
  if (!s.name) problems.push("name is missing");
  if (!/^https:\/\//.test(s.feedUrl || "")) problems.push("feedUrl must start with https://");
  if (!AREAS.includes(s.defaultArea)) problems.push(`defaultArea must be one of ${AREAS.join(", ")}`);
  for (const r of s.areaRules || []) if (!AREAS.includes(r.area)) problems.push(`areaRules area "${r.area}" is not valid`);
  if (!(s.defaultSpots > 0)) problems.push("defaultSpots must be a number above 0");
  if (problems.length) throw new Error(`Source "${s.key || s.name || "?"}": ${problems.join("; ")}`);
}

// ---- main ----------------------------------------------------------------------

async function main() {
  const now = Date.now();
  const config = await readJson(SOURCES_FILE, null);
  if (!config) throw new Error(`Missing ${path.relative(ROOT, SOURCES_FILE)}`);
  const sources = config.sources || [];
  sources.forEach(checkSource);

  const userAgent = config.userAgent || "C295-RP-student-project";
  const delayMs = config.requestDelayMs ?? 3000;
  const months = monthKeys(config.monthsAhead ?? 2, now);

  const byId = new Map();
  const skipped = [];
  const failed = [];
  let fetched = 0;

  for (const source of sources) {
    const urls = source.feedUrl.includes("{month}") ? months.map((m) => source.feedUrl.replace("{month}", m)) : [source.feedUrl];
    for (const url of urls) {
      if (fetched++ > 0) await sleep(delayMs); // be polite: one request at a time
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": userAgent, Accept: "text/calendar" },
          signal: AbortSignal.timeout(30000),
        });
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (!text.includes("BEGIN:VCALENDAR")) throw new Error("not an iCal feed");
        for (const a of toActivities(text, source, now, skipped)) byId.set(a.id, a);
      } catch (e) {
        failed.push(`${url} (${e.message})`);
      }
    }
  }

  const feedCount = fetched;
  if (feedCount > 0 && failed.length === feedCount) {
    // Every feed failed: keep yesterday's file rather than wiping the website
    console.error("Every feed failed, so data/activities.json was left unchanged:\n  " + failed.join("\n  "));
    process.exit(1);
  }

  const manual = await readJson(MANUAL_FILE, []);
  if (!Array.isArray(manual)) throw new Error("data/manual-activities.json must be a list: [ {...}, {...} ]");
  let manualCount = 0;
  for (const a of manual) {
    if (!a.id || !a.title || !a.startsAt || !a.endsAt || !AREAS.includes(a.area)) {
      skipped.push(`manual: ${a.title || a.id || "(no title)"} (needs id, title, area, startsAt, endsAt)`);
      continue;
    }
    if (new Date(a.endsAt).getTime() <= now) continue;
    byId.set(a.id, { spotsTaken: 0, joined: false, friendsGoing: [], photoUrl: null, externalUrl: null, ...a, source: "manual" });
    manualCount++;
  }

  const activities = [...byId.values()].sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

  // Only rewrite the file when the activities changed, so there's no daily commit for nothing
  const previous = await readJson(OUT_FILE, null);
  const changed = JSON.stringify(previous?.activities ?? null) !== JSON.stringify(activities);
  if (changed) {
    await writeFile(OUT_FILE, JSON.stringify({ generatedAt: new Date(now).toISOString(), activities }, null, 2) + "\n");
  }

  const summary = [
    `Activities written: ${activities.length} (${activities.length - manualCount} from feeds, ${manualCount} manual)`,
    `File changed: ${changed ? "yes" : "no"}`,
    `Feeds downloaded: ${feedCount - failed.length} of ${feedCount}`,
    ...(failed.length ? ["Failed feeds:", ...failed.map((f) => `  - ${f}`)] : []),
    ...(skipped.length ? ["Skipped events:", ...skipped.map((s) => `  - ${s}`)] : []),
  ].join("\n");
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    await writeFile(process.env.GITHUB_STEP_SUMMARY, "```\n" + summary + "\n```\n", { flag: "a" });
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
