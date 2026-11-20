// Summary: the four areas billed like a gig poster's line-up, hours by month, and the entries behind each area.
document.addEventListener("DOMContentLoaded", async () => {
  const { esc, icon, AREAS, hoursBetween, hoursText } = window.ui;
  const api = window.api;
  const $ = (s) => document.querySelector(s);

  document.title = `Summary · ${window.APP_CONFIG.appName}`;
  await window.ui.consumeLinkToken();
  if (!api.session.get()) {
    location.replace(`signin.html?next=${encodeURIComponent("summary.html")}`);
    return;
  }
  window.ui.renderHeader({ page: "summary" });

  const root = $("[data-summary]");
  const rangeEl = $("[data-range]");
  const lineupEl = $("[data-lineup]");
  const monthsEl = $("[data-months]");
  const byAreaEl = $("[data-by-area]");

  const isoOf = (d) => d.toLocaleDateString("en-CA");
  const dateOf = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayIso = isoOf(today);
  const shortDate = (iso) => dateOf(iso).toLocaleDateString("en-SG", { weekday: "short", day: "numeric", month: "short" });
  const monthName = (d, long) => d.toLocaleDateString("en-SG", { month: long ? "long" : "short" });
  const dayMonth = (iso) => dateOf(iso).toLocaleDateString("en-SG", { day: "numeric", month: "short" }).replace(" ", "\u00a0");
  const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

  const term = (window.APP_CONFIG.terms || []).find((t) => t.start <= todayIso && todayIso <= t.end);
  const RANGES = [
    { id: "all", label: "All time" },
    ...(term ? [{ id: "term", label: "This term" }] : []),
    { id: "month", label: "This month" },
  ];
  const params = new URLSearchParams(location.search);
  let range = RANGES.some((r) => r.id === params.get("range")) ? params.get("range") : "all";
  let entries = [];
  let loaded = false;
  const expanded = new Set();

  // An entry counts only when all four parts are there (same rule as the Journal).
  const isComplete = (e) => e.photos?.length && hoursBetween(e.start, e.end) !== null && e.did?.trim() && e.learned?.trim();

  function bounds() {
    if (range === "month") return [isoOf(new Date(today.getFullYear(), today.getMonth(), 1)), todayIso];
    if (range === "term") return [term.start, term.end < todayIso ? term.end : todayIso];
    return ["0000-01-01", todayIso];
  }
  const inRange = () => { const [a, b] = bounds(); return entries.filter((e) => e.date >= a && e.date <= b); };

  // ---- range switch -------------------------------------------------------------
  function renderRange() {
    rangeEl.innerHTML = RANGES.map((r) =>
      `<button type="button" class="tab" data-r="${r.id}" aria-pressed="${r.id === range}">${r.label}</button>`).join("");
  }
  rangeEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-r]");
    if (!b || !loaded || b.dataset.r === range) return;
    range = b.dataset.r;
    const p = new URLSearchParams(location.search);
    if (range === "all") p.delete("range"); else p.set("range", range);
    history.replaceState(null, "", `${location.pathname}${p.toString() ? `?${p}` : ""}`);
    render(true);
  });

  // ---- totals ----------------------------------------------------------------------
  function totals(list) {
    const t = Object.fromEntries(Object.keys(AREAS).map((c) => [c, { code: c, hours: 0, count: 0, entries: [], unfinished: [] }]));
    list.forEach((e) => {
      const a = t[e.area];
      if (!a) return;
      if (isComplete(e)) { a.hours += hoursBetween(e.start, e.end); a.count += 1; a.entries.push(e); } else a.unfinished.push(e);
    });
    return t;
  }

  // Billing order: most hours first. Size is by rank, ties share a size, and empty areas are always smallest.
  function billing(t) {
    const rows = Object.values(t).sort((a, b) => b.hours - a.hours || b.count - a.count);
    let size = 0;
    rows.forEach((r, i) => {
      if (i > 0 && r.hours !== rows[i - 1].hours) size = i;
      r.size = r.hours ? size + 1 : 4;
    });
    return rows;
  }

  // ---- lede ----------------------------------------------------------------------------
  function renderLede(t) {
    const all = Object.values(t);
    const hours = all.reduce((s, a) => s + a.hours, 0);
    const count = all.reduce((s, a) => s + a.count, 0);
    const unfinished = all.flatMap((a) => a.unfinished);
    const when = range === "month" ? `in ${monthName(today, true)}`
      : range === "term" ? `this term (${dayMonth(term.start)} to ${dayMonth(term.end)}${term.placeholder ? ", placeholder dates" : ""})`
      : "so far";
    let html = count
      ? `${hoursText(hours)} across ${plural(count, "activity", "activities")} ${when}.`
      : `Nothing logged ${range === "all" ? "" : `${when} `}yet.`;
    if (unfinished.length) {
      const first = unfinished[0];
      html += ` ${plural(unfinished.length, "unfinished entry", "unfinished entries")} not counted. <a href="entry.html?id=${encodeURIComponent(first.id)}">Finish ${unfinished.length === 1 ? "it" : "the first"}</a>.`;
    }
    $("[data-lede]").innerHTML = html;
  }

  // ---- the line-up ------------------------------------------------------------------------
  function renderLineup(rows, animate) {
    const anyHours = rows.some((r) => r.hours);
    lineupEl.innerHTML = `<ol class="lineup${animate ? " paste" : ""}${anyHours ? "" : " is-empty"}">${rows.map((r, i) => {
      const area = AREAS[r.code];
      const facts = r.hours
        ? `<span class="act-hours">${hoursText(r.hours)}</span><span class="act-count">${plural(r.count, "activity", "activities")}</span>`
        : `<span class="act-hours">0 h</span>`;
      const name = r.hours
        ? `<a class="act-name" href="#area-${r.code}">${esc(area.name)}</a>`
        : `<span class="act-name">${esc(area.name)}</span>`;
      return `
        <li class="act ink-${r.code} size-${r.size}${r.hours ? "" : " is-zero"}" style="--i:${i}">
          ${name}
          <p class="act-facts">${facts}</p>
          ${r.hours ? "" : `<p class="act-find">Nothing yet. <a href="index.html?area=${r.code}">Find one${icon("back", "flip")}</a></p>`}
        </li>`;
    }).join("")}</ol>
    ${anyHours ? "" : emptyActions()}`;
    lineupEl.querySelector("[data-r-all]")?.addEventListener("click", () => rangeEl.querySelector('[data-r="all"]').click());
  }

  function emptyActions() {
    const hasAny = entries.some(isComplete);
    if (range !== "all" && hasAny) {
      return `<div class="lineup-empty"><button type="button" class="btn btn-solid" data-r-all>See all time</button><a class="btn" href="journal.html">Log an activity</a></div>`;
    }
    return `<div class="lineup-empty"><a class="btn btn-solid" href="index.html">Browse activities</a><a class="btn" href="journal.html">${entries.length ? "Log an activity" : "Log your first activity"}</a></div>`;
  }

  // ---- hours by month (or by week for one month) ------------------------------------------------
  function buckets(list) {
    const out = [];
    if (range === "month") {
      // Monday-start weeks of this month, up to today.
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      let s = new Date(first);
      while (s <= today) {
        const e = new Date(s); e.setDate(e.getDate() + (7 - ((e.getDay() + 6) % 7)) - 1);
        const end = e > today ? today : e;
        const from = isoOf(s), to = isoOf(end);
        out.push({ from, to, label: `${s.getDate()} ${monthName(s)}`, long: `Week of ${s.getDate()} ${monthName(s, true)}` });
        s = new Date(end); s.setDate(s.getDate() + 1);
      }
    } else {
      let start;
      if (range === "term") start = dateOf(term.start);
      else {
        const earliest = list.length ? dateOf(list.map((e) => e.date).sort()[0]) : today;
        start = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
        const minStart = new Date(today.getFullYear(), today.getMonth() - 5, 1);   // at least six months
        const maxStart = new Date(today.getFullYear(), today.getMonth() - 11, 1);  // at most twelve
        if (start > minStart) start = minStart;
        if (start < maxStart) start = maxStart;
      }
      let m = new Date(start.getFullYear(), start.getMonth(), 1);
      while (m <= today) {
        const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);
        out.push({ from: isoOf(m), to: isoOf(end), label: monthName(m), long: `${monthName(m, true)} ${m.getFullYear()}` });
        m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
      }
    }
    return out.map((b) => ({ ...b, t: totals(list.filter((e) => e.date >= b.from && e.date <= b.to)) }));
  }

  function renderMonths(list) {
    const bs = buckets(list);
    const sum = (t) => Object.values(t).reduce((s, a) => s + a.hours, 0);
    const max = Math.max(...bs.map((b) => sum(b.t)));
    $("[data-months-wrap]").hidden = !max;
    if (!max) return;
    $("[data-months-h]").textContent = range === "month" ? "By week" : "By month";
    const codes = Object.keys(AREAS);
    monthsEl.innerHTML = `<ol class="bars" style="--n:${bs.length}">${bs.map((b) => {
      const total = sum(b.t);
      const parts = codes.filter((c) => b.t[c].hours);
      const said = parts.length ? parts.map((c) => `${AREAS[c].name} ${hoursText(b.t[c].hours)}`).join(", ") : "nothing logged";
      return `
        <li class="bar${b.to >= todayIso && b.from <= todayIso ? " is-now" : ""}">
          <span class="visually-hidden">${esc(b.long)}: ${total ? `${hoursText(total)}. ` : ""}${said}.</span>
          <span class="bar-total" aria-hidden="true">${total ? hoursText(total).replace(" h", "") : ""}</span>
          <span class="bar-stack" aria-hidden="true" style="--h:${total / max}">${parts.map((c) =>
            `<span class="ink-${c}" style="flex-grow:${b.t[c].hours}"></span>`).join("")}</span>
          <span class="bar-label" aria-hidden="true">${esc(b.label)}</span>
        </li>`;
    }).join("")}</ol>`;
  }

  // ---- entries behind each area ----------------------------------------------------------------
  const SHOW = 5;
  function renderByArea(rows) {
    const shown = rows.filter((r) => r.hours || r.unfinished.length);
    $("[data-by-area-wrap]").hidden = !shown.length;
    byAreaEl.innerHTML = shown.map((r) => {
      const area = AREAS[r.code];
      const list = [...r.entries, ...r.unfinished].sort((a, b) => b.date.localeCompare(a.date) || (b.start || "").localeCompare(a.start || ""));
      const open = expanded.has(r.code);
      const visible = open ? list : list.slice(0, SHOW);
      return `
        <section class="area-block ink-${r.code}" id="area-${r.code}" aria-labelledby="area-h-${r.code}">
          <h3 class="area-h" id="area-h-${r.code}"><i class="ink-dot" aria-hidden="true"></i>${esc(area.name)}<span class="area-n">${r.hours ? hoursText(r.hours) : "0 h"}</span></h3>
          <ul class="area-list">${visible.map((e) => {
            const done = isComplete(e);
            const h = hoursBetween(e.start, e.end);
            return `
            <li>
              <a class="area-row" href="${done ? `journal.html?day=${encodeURIComponent(e.date)}` : `entry.html?id=${encodeURIComponent(e.id)}`}">
                <span class="row-date">${esc(shortDate(e.date))}</span>
                <span class="row-title">${esc(e.title)}</span>
                <span class="row-h">${done ? esc(hoursText(h)) : `<span class="row-unfinished">${icon("flag")}Unfinished</span>`}</span>
              </a>
            </li>`;
          }).join("")}</ul>
          ${list.length > SHOW ? `<button type="button" class="btn btn-sm btn-quiet area-more" data-more="${r.code}" aria-expanded="${open}">${open ? "Show fewer" : `Show all ${list.length}`}</button>` : ""}
        </section>`;
    }).join("");
  }
  byAreaEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-more]");
    if (!b) return;
    const c = b.dataset.more;
    if (expanded.has(c)) expanded.delete(c); else expanded.add(c);
    renderByArea(billing(totals(inRange())));
    byAreaEl.querySelector(`[data-more="${c}"]`)?.focus();
  });

  // ---- render / load ---------------------------------------------------------------------------
  function render(animate) {
    const list = inRange();
    const t = totals(list);
    const rows = billing(t);
    renderRange();
    renderLede(t);
    renderLineup(rows, animate);
    renderMonths(list);
    renderByArea(rows);
  }

  function showSkeleton() {
    root.classList.remove("has-error");
    lineupEl.innerHTML = `<ol class="lineup lineup-skeleton">${[1, 2, 3, 4].map((n) => `<li class="size-${n}"><span></span></li>`).join("")}</ol>`;
    $("[data-months-wrap]").hidden = true;
    $("[data-by-area-wrap]").hidden = true;
  }

  function showError(err) {
    root.classList.add("has-error");
    rangeEl.hidden = true;
    lineupEl.innerHTML = `
      <div class="empty empty-error" role="alert">
        <h3>Couldn't load your summary</h3>
        <p>${esc(err.message)} Your entries are safe; they will show again once the server answers.</p>
        <div class="empty-actions"><button type="button" class="btn btn-solid" data-retry>${icon("retry")}Try again</button></div>
      </div>`;
    lineupEl.querySelector("[data-retry]").addEventListener("click", () => { rangeEl.hidden = false; load(); });
  }

  async function load() {
    renderRange();
    showSkeleton();
    const stopSlow = window.ui.slowNotice(root);
    try {
      entries = await api.listJournal();
      loaded = true;
      stopSlow();
      render(true);
      if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    } catch (err) {
      stopSlow();
      if (err.status === 401) { location.replace(`signin.html?next=${encodeURIComponent("summary.html")}`); return; }
      showError(err);
    }
  }

  load();
});
