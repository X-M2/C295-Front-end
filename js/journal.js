// Journal: to-log tickets, a month calendar of entries, and the chosen day's entries.
document.addEventListener("DOMContentLoaded", async () => {
  const { esc, icon, AREAS, posterDate, hoursBetween, hoursText, longDate, time } = window.ui;
  const api = window.api;
  const $ = (s) => document.querySelector(s);

  document.title = `Journal · ${window.APP_CONFIG.appName}`;
  await window.ui.consumeLinkToken();
  if (!api.session.get()) {
    location.replace(`signin.html?next=${encodeURIComponent("journal.html")}`);
    return;
  }
  window.ui.renderHeader({ page: "journal" });

  const root = $("[data-journal]");
  const tologBody = $("[data-tolog-body]");
  const calEl = $("[data-cal]");
  const dayEl = $("[data-day]");
  $("[data-prev]").innerHTML = icon("back");
  $("[data-next]").innerHTML = icon("back", "flip");

  const isoOf = (d) => d.toLocaleDateString("en-CA");          // YYYY-MM-DD in local time
  const dateOf = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const todayIso = isoOf(new Date());

  const params = new URLSearchParams(location.search);
  let entries = [];
  let toLog = [];
  let selected = params.get("day") || todayIso;
  let month = (() => { const d = dateOf(selected); return new Date(d.getFullYear(), d.getMonth(), 1); })();

  // What is "incomplete" for an entry (all four parts are required).
  function missing(e) {
    const m = [];
    if (!e.photos || !e.photos.length) m.push("a photo");
    if (hoursBetween(e.start, e.end) === null) m.push("the times");
    if (!e.did || !e.did.trim()) m.push("what you did");
    if (!e.learned || !e.learned.trim()) m.push("what you learned");
    return m;
  }
  const joinList = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

  // ---- to log ---------------------------------------------------------------
  function renderToLog() {
    $("[data-tolog-n]").textContent = toLog.length || "";
    if (!toLog.length) {
      tologBody.innerHTML = `<p class="caught-up">${icon("check")}You're all caught up. Activities you go to will show up here afterwards.</p>`;
      return;
    }
    tologBody.innerHTML = `<ol class="tickets paste">${toLog.map((a, i) => {
      const [wd, dm] = posterDate(new Date(a.startsAt));
      return `
        <li class="ticket ink-${a.area}" style="--i:${i}">
          <p class="ticket-date" aria-hidden="true">${wd} ${dm}</p>
          <h3 class="ticket-title"><span class="visually-hidden">${esc(longDate(a.startsAt))}: </span>${esc(a.title)}</h3>
          <p class="ticket-where">${esc(a.location)} · ${hoursText(hoursBetween(time(a.startsAt), time(a.endsAt)))}</p>
          <div class="ticket-foot"><a class="btn btn-on-ink ticket-act" href="entry.html?activity=${encodeURIComponent(a.id)}">Write entry</a></div>
        </li>`;
    }).join("")}</ol>`;
  }

  // ---- calendar -----------------------------------------------------------------
  const entriesOn = (iso) => entries.filter((e) => e.date === iso);
  const toLogOn = (iso) => toLog.filter((a) => isoOf(new Date(a.startsAt)) === iso);

  function renderCalendar() {
    $("[data-month]").textContent = month.toLocaleDateString("en-SG", { month: "long", year: "numeric" });
    const first = new Date(month);
    const lead = (first.getDay() + 6) % 7;                       // Monday first
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);
    $("[data-next]").disabled = month >= thisMonth;

    const heads = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      .map((d) => `<span class="cal-wd" aria-hidden="true">${d}</span>`).join("");
    let cells = "";
    for (let i = 0; i < lead; i++) cells += `<span class="cal-pad" aria-hidden="true"></span>`;
    for (let n = 1; n <= days; n++) {
      const iso = isoOf(new Date(month.getFullYear(), month.getMonth(), n));
      const es = entriesOn(iso);
      const tl = toLogOn(iso);
      const areas = [...new Set(es.map((e) => e.area))].slice(0, 2);
      const photo = es.find((e) => e.photos && e.photos.length)?.photos[0]?.url;
      const incomplete = es.some((e) => missing(e).length);
      const future = iso > todayIso;
      const label = [
        longDate(dateOf(iso)),
        es.length ? `${es.map((e) => e.title).join(", ")}, logged${incomplete ? ", incomplete" : ""}` : "",
        tl.length ? `${tl.map((a) => a.title).join(", ")}, not logged yet` : "",
        iso === todayIso ? "today" : "",
      ].filter(Boolean).join(". ");
      const cls = ["day",
        es.length ? "has-entry" : "",
        incomplete ? "is-incomplete" : "",
        tl.length && !es.length ? "is-tolog" : "",
        iso === todayIso ? "is-today" : "",
        future ? "is-future" : "",
      ].filter(Boolean).join(" ");
      cells += `
        <button type="button" class="${cls}" data-iso="${iso}" aria-pressed="${iso === selected}" aria-label="${esc(label)}"${future ? " disabled" : ""}>
          ${areas.length ? `<span class="day-ink" aria-hidden="true">${areas.map((a) => `<span class="ink-${a}"></span>`).join("")}</span>` : ""}
          ${photo ? `<span class="day-photo duotone ink-${areas[0]}" aria-hidden="true"><img src="${esc(photo)}" alt="" loading="lazy" decoding="async"></span>` : ""}
          <span class="day-n" aria-hidden="true">${n}</span>
          ${tl.length && !es.length ? `<span class="day-mark" aria-hidden="true">Log</span>` : ""}
          ${incomplete ? `<span class="day-flag" aria-hidden="true">${icon("flag")}</span>` : ""}
        </button>`;
    }
    calEl.innerHTML = `<div class="cal-grid">${heads}${cells}</div>`;
  }

  calEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-iso]");
    if (!b) return;
    selected = b.dataset.iso;
    calEl.querySelectorAll("[data-iso]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderDay();
    if (window.matchMedia("(max-width: 760px)").matches) dayEl.scrollIntoView({ block: "start" });
  });
  calEl.addEventListener("keydown", (e) => {
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in steps)) return;
    const btns = [...calEl.querySelectorAll("[data-iso]:not(:disabled)")];
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    btns[Math.max(0, Math.min(btns.length - 1, i + steps[e.key]))]?.focus();
  });

  $("[data-prev]").addEventListener("click", () => { month = new Date(month.getFullYear(), month.getMonth() - 1, 1); renderCalendar(); });
  $("[data-next]").addEventListener("click", () => { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); renderCalendar(); });

  // ---- the chosen day -----------------------------------------------------------
  function entryHtml(e) {
    const m = missing(e);
    const h = hoursBetween(e.start, e.end);
    return `
      <article class="entry">
        ${e.photos && e.photos.length ? `<div class="entry-photos">${e.photos.map((p) => `<img src="${esc(p.url)}" alt="Photo from ${esc(e.title)}" loading="lazy" decoding="async">`).join("")}</div>
          ${e.photos.some((p) => p.sample) ? `<p class="entry-note">Sample photo, not of this activity.</p>` : ""}` : ""}
        <header class="entry-head">
          <h4 class="entry-title"><i class="ink-dot ink-${e.area}" aria-hidden="true"></i>${esc(e.title)}</h4>
          <p class="entry-meta">${esc(AREAS[e.area]?.name || "")}${h !== null ? ` · ${e.start}–${e.end} · <b>${hoursText(h)}</b>` : ""}${e.source === "telegram" ? " · from Telegram" : ""}</p>
        </header>
        ${m.length ? `<p class="entry-incomplete">${icon("flag")}Incomplete: add ${joinList(m)}.</p>` : ""}
        ${e.did ? `<div class="entry-block"><h5>What I did</h5><p>${esc(e.did)}</p></div>` : ""}
        ${e.learned ? `<div class="entry-block"><h5>What I learned</h5><p>${esc(e.learned)}</p></div>` : ""}
        <a class="btn btn-sm${m.length ? " btn-solid" : ""}" href="entry.html?id=${encodeURIComponent(e.id)}">${m.length ? "Finish entry" : "Edit"}</a>
      </article>`;
  }

  function renderDay() {
    const d = dateOf(selected);
    const es = entriesOn(selected);
    const tl = toLogOn(selected);
    const [wd, dm] = posterDate(d);
    let body = "";
    body += tl.map((a) => `
      <div class="day-tolog">
        <p>You went to <b>${esc(a.title)}</b> but haven't logged it yet.</p>
        <a class="btn btn-solid btn-sm" href="entry.html?activity=${encodeURIComponent(a.id)}">Write entry</a>
      </div>`).join("");
    body += es.map(entryHtml).join("");
    if (!es.length && !tl.length) {
      body = `<p class="muted">${selected === todayIso ? "Nothing logged today yet." : "Nothing logged on this day."}</p>
        <a class="btn btn-sm" href="entry.html?new=1&date=${selected}">Log something for this day</a>`;
    }
    dayEl.innerHTML = `<h3 class="day-h"><span class="visually-hidden">${esc(longDate(d))}</span><span aria-hidden="true">${wd} ${dm}</span></h3>${body}`;
  }

  // ---- summary line ----------------------------------------------------------------
  function renderLede() {
    const monthIso = isoOf(new Date()).slice(0, 7);
    const mine = entries.filter((e) => e.date.startsWith(monthIso));
    const done = mine.filter((e) => !missing(e).length);
    const unfinished = mine.filter((e) => missing(e).length);
    const hours = done.reduce((t, e) => t + (hoursBetween(e.start, e.end) || 0), 0);
    const parts = [];
    if (toLog.length) parts.push(`${toLog.length} to log`);
    if (unfinished.length) parts.push(`${unfinished.length} unfinished`);
    parts.push(`${hoursText(hours) || "0 h"} logged this month`);
    $("[data-lede]").textContent = `${parts.join(" · ")}. What you did, what you learned, and the photos to prove it.`;
  }

  // ---- load -------------------------------------------------------------------------
  function showSkeleton() {
    root.classList.remove("has-error");
    tologBody.innerHTML = `<ol class="tickets">${Array.from({ length: 2 }, () => `<li class="ticket ticket-skeleton"><span></span><span></span></li>`).join("")}</ol>`;
    calEl.innerHTML = `<div class="cal-grid cal-skeleton">${Array.from({ length: 35 }, () => "<span></span>").join("")}</div>`;
    dayEl.innerHTML = "";
  }

  function showError(err) {
    $("[data-tolog]").hidden = true;
    $(".cal-head").hidden = true;
    root.classList.add("has-error");
    dayEl.hidden = true;
    calEl.innerHTML = `
      <div class="empty empty-error" role="alert">
        <h3>Couldn't load your journal</h3>
        <p>${esc(err.message)} Nothing you've written is lost; it will show again once the server answers.</p>
        <div class="empty-actions"><button type="button" class="btn btn-solid" data-retry>${icon("retry")}Try again</button></div>
      </div>`;
    calEl.querySelector("[data-retry]").addEventListener("click", () => {
      $("[data-tolog]").hidden = false; $(".cal-head").hidden = false; dayEl.hidden = false; load();
    });
  }

  async function load() {
    showSkeleton();
    const stopSlow = window.ui.slowNotice(root);
    try {
      [entries, toLog] = await Promise.all([api.listJournal(), api.listToLog()]);
      stopSlow();
      // Pick a day worth showing: the requested one, else the latest day with something on it.
      if (!params.get("day") && !entriesOn(selected).length && !toLogOn(selected).length) {
        const days = [...entries.map((e) => e.date), ...toLog.map((a) => isoOf(new Date(a.startsAt)))].sort();
        if (days.length) selected = days[days.length - 1];
        const d = dateOf(selected); month = new Date(d.getFullYear(), d.getMonth(), 1);
      }
      renderLede();
      renderToLog();
      renderCalendar();
      renderDay();
      if (params.get("saved")) {
        window.ui.toast(params.get("saved") === "deleted" ? "Entry deleted." : "Entry saved.");
        params.delete("saved");
        history.replaceState(null, "", `${location.pathname}${params.toString() ? `?${params}` : ""}`);
      }
    } catch (err) {
      stopSlow();
      if (err.status === 401) { location.replace(`signin.html?next=${encodeURIComponent("journal.html")}`); return; }
      showError(err);
    }
  }

  load();
});
