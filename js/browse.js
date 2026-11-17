// Browse page: Next up board, area tabs, filters and the activity list.
// ?mine=1 shows only the activities the signed-in student is going to.
document.addEventListener("DOMContentLoaded", async () => {
  const { esc, icon, pill, countdown, status, spotsText, AREAS } = window.ui;
  const api = window.api;

  const $ = (s) => document.querySelector(s);
  const board = $("[data-board]");
  const boardRows = $("[data-board-rows]");
  const groupsEl = $("[data-groups]");
  const resultLine = $("[data-result-line]");
  const form = $("[data-filters]");
  const tabsEl = $("[data-tabs]");

  document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));

  // ---- state, kept in the URL so links and the back button work -------------
  const params = new URLSearchParams(location.search);
  const state = {
    area: AREAS[params.get("area")] ? params.get("area") : "all",
    when: ["week", "month", "all"].includes(params.get("when")) ? params.get("when") : "all",
    q: params.get("q") || "",
    mine: params.get("mine") === "1" && !!api.session.get(),
  };
  let activities = [];

  form.when.value = state.when;
  form.q.value = state.q;
  document.title = `${state.mine ? "Going" : "What's on"} · ${window.APP_CONFIG.appName}`;
  if (state.mine) {
    $("h1").textContent = "Going";
    board.hidden = true;
  }

  function syncUrl() {
    const p = new URLSearchParams(location.search);
    ["area", "when", "q"].forEach((k) => p.delete(k));
    if (state.area !== "all") p.set("area", state.area);
    if (state.when !== "all") p.set("when", state.when);
    if (state.q) p.set("q", state.q);
    history.replaceState(null, "", `${location.pathname}${p.toString() ? `?${p}` : ""}`);
  }

  // ---- tabs -----------------------------------------------------------------
  function renderTabs() {
    const tabs = [["all", "All areas"], ...Object.values(AREAS).map((a) => [a.code, a.name])];
    tabsEl.innerHTML = tabs
      .map(([code, name]) => `
        <button type="button" role="tab" class="tab" data-area="${code}" aria-selected="${state.area === code}">
          ${code === "all" ? "" : pill(code, "code-sm")}<span>${esc(name)}</span>
        </button>`)
      .join("");
  }
  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-area]");
    if (!btn) return;
    state.area = btn.dataset.area;
    renderTabs();
    render(true);
  });
  tabsEl.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const btns = [...tabsEl.querySelectorAll("[data-area]")];
    const i = btns.indexOf(document.activeElement);
    const next = btns[(i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length];
    next.focus();
    next.click();
  });

  let searchTimer;
  form.addEventListener("input", (e) => {
    if (e.target.name === "q") {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { state.q = form.q.value.trim(); render(false); }, 200);
    }
  });
  form.addEventListener("change", (e) => {
    if (e.target.name === "when") { state.when = form.when.value; render(false); }
  });
  form.addEventListener("submit", (e) => e.preventDefault());

  // ---- filtering ------------------------------------------------------------
  const now = () => new Date();
  function endOfWeek(d) {
    const x = window.ui.startOfDay(d);
    x.setDate(x.getDate() + ((7 - x.getDay()) % 7) + 1);
    return x; // midnight after Sunday
  }

  function upcoming() {
    return activities
      .filter((a) => new Date(a.endsAt) > now())
      .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  }

  const inArea = (a) => state.area === "all" || a.area === state.area;
  const boardItems = () => (state.mine ? [] : upcoming().filter(inArea).slice(0, 4));
  // The board already lists the soonest few, so the list starts after them,
  // unless the student is searching or narrowing the dates.
  const listSkipsBoard = () => !state.mine && !state.q && state.when === "all";

  function filtered() {
    const q = state.q.toLowerCase();
    const weekEnd = endOfWeek(now());
    const monthEnd = new Date(now().getTime() + 31 * 86400000);
    const skip = listSkipsBoard() ? new Set(boardItems().map((a) => a.id)) : new Set();
    return upcoming().filter((a) => {
      if (skip.has(a.id)) return false;
      if (state.mine && !a.joined) return false;
      if (!inArea(a)) return false;
      const s = new Date(a.startsAt);
      if (state.when === "week" && s >= weekEnd) return false;
      if (state.when === "month" && s >= monthEnd) return false;
      if (q && !`${a.title} ${a.location} ${a.organiser}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  // ---- board ------------------------------------------------------------------
  function boardFlags(a) {
    const st = status(a);
    const flags = [];
    if (st.joined) flags.push(`<span class="flag flag-joined">${icon("check")}You're going</span>`);
    if (st.full) flags.push(`<span class="flag">Full</span>`);
    else if (st.closed) flags.push(`<span class="flag">Sign-up closed</span>`);
    else if (st.closingSoon) flags.push(`<span class="flag flag-warn">${esc(st.closesText)}</span>`);
    if (st.fewLeft && !st.closed) flags.push(`<span class="flag flag-warn">${st.left} ${st.left === 1 ? "spot" : "spots"} left</span>`);
    return flags.join("");
  }

  function renderBoard(animate) {
    if (state.mine) return;
    const list = boardItems();
    board.hidden = !upcoming().length;
    if (!list.length) {
      boardRows.innerHTML = `<li class="board-empty">No ${esc(AREAS[state.area]?.name || "")} activities coming up yet.</li>`;
      return;
    }
    boardRows.innerHTML = list
      .map((a, i) => {
        const c = countdown(a);
        return `
        <li class="board-row${animate ? " tick" : ""}" style="--i:${i}">
          ${pill(a.area)}
          <div class="board-main">
            <a class="board-title" href="activity.html?id=${encodeURIComponent(a.id)}">${esc(a.title)}</a>
            <span class="board-meta">${esc(a.location)}<span class="flags">${boardFlags(a)}</span></span>
          </div>
          <div class="board-eta" aria-label="${esc(c.big)}${c.unit ? " " + c.unit : ""}, ${esc(c.small)}">
            <span class="eta-big">${esc(c.big)}${c.unit ? `<span class="eta-unit">${c.unit}</span>` : ""}</span>
            <span class="eta-small">${esc(c.small)}</span>
          </div>
        </li>`;
      })
      .join("");
  }

  function tickClock() {
    $("[data-clock]").textContent = window.ui.time(new Date());
  }

  // ---- list ---------------------------------------------------------------------
  function going(a) {
    const n = a.spotsTaken;
    if (!n) return `<span class="going muted">Be the first to join</span>`;
    const friends = (a.friendsGoing || []).slice(0, 2);
    if (friends.length) {
      const more = n - friends.length;
      return `<span class="going">${icon("people")}<span><strong>${friends.map(esc).join(", ")}</strong>${more > 0 ? ` +${more}` : ""}</span></span>`;
    }
    return `<span class="going">${icon("people")}<span>${n} going</span></span>`;
  }

  function actionButton(a) {
    const st = status(a);
    if (st.joined) {
      return `<div class="act-joined"><span class="joined-tag">${icon("check")}Going</span>
        <button type="button" class="btn btn-quiet btn-sm" data-leave="${esc(a.id)}">Leave</button></div>`;
    }
    if (st.full) return `<button type="button" class="btn btn-block" disabled>Full</button>`;
    if (st.closed) return `<button type="button" class="btn btn-block" disabled>Closed</button>`;
    return `<button type="button" class="btn btn-primary btn-block" data-join="${esc(a.id)}">Join</button>`;
  }

  function row(a) {
    const st = status(a);
    const pct = Math.min(100, Math.round((a.spotsTaken / a.spotsTotal) * 100));
    return `
      <li class="row" data-id="${esc(a.id)}" style="--stop: var(--${a.area.toLowerCase()})">
        <div class="row-date" aria-hidden="true">
          <span class="row-wd">${window.ui.weekday(a.startsAt)}</span>
          <span class="row-dn">${window.ui.dayNum(a.startsAt)}</span>
          <span class="row-mo">${window.ui.month(a.startsAt)}</span>
        </div>
        <span class="stop" aria-hidden="true"></span>
        <div class="row-main">
          <h4 class="row-title"><a href="activity.html?id=${encodeURIComponent(a.id)}">${esc(a.title)}</a></h4>
          <p class="row-meta">
            ${pill(a.area, "code-sm")}
            <span class="visually-hidden">${window.ui.longDate(a.startsAt)},</span>
            <span>${window.ui.time(a.startsAt)}–${window.ui.time(a.endsAt)}</span>
            <span>${esc(a.location)}</span>
          </p>
        </div>
        <div class="row-going">${going(a)}</div>
        <div class="row-spots${st.full ? " is-full" : ""}${st.fewLeft ? " is-few" : ""}">
          <span class="spots-text">${spotsText(st, a)}</span>
          <span class="meter" aria-hidden="true"><span style="width:${pct}%"></span></span>
          <span class="closes${st.closingSoon ? " is-soon" : ""}">${st.closed ? "Sign-up closed" : esc(st.closesText)}</span>
        </div>
        <div class="row-act">${actionButton(a)}</div>
      </li>`;
  }

  function groupName(a, skipped) {
    const s = new Date(a.startsAt);
    const weekEnd = endOfWeek(now());
    const nextWeekEnd = new Date(weekEnd.getTime() + 7 * 86400000);
    if (s < weekEnd) return skipped ? "Later this week" : "This week";
    if (s < nextWeekEnd) return "Next week";
    return "Later";
  }

  function emptyMessage() {
    const areaName = state.area === "all" ? "" : `${AREAS[state.area].name} `;
    const when = state.when === "week" ? " this week" : state.when === "month" ? " in the next 31 days" : "";
    if (state.mine) {
      return { h: `You haven't joined any ${areaName}activities yet`, p: "Join something from Browse and it shows up here, with a countdown to the day." };
    }
    if (state.q) return { h: `No ${areaName}activities match “${esc(state.q)}”${when}`, p: "Check the spelling, or search for a place or organiser instead." };
    if (!upcoming().length) return { h: "No activities are listed yet", p: "New activities are added every week. Check back soon, or ask the Telegram bot to tell you when one is added." };
    if (listSkipsBoard() && boardItems().length) return { h: `That's everything ${areaName ? `in ${areaName.trim()} ` : ""}for now`, p: "The board above has all the upcoming activities. More are added every week." };
    return { h: `No ${areaName}activities${when}`, p: "New activities are added every week. Try a wider date range or another area." };
  }

  function renderList() {
    const list = filtered();
    const areaName = state.area === "all" ? null : AREAS[state.area].name;
    const n = list.length;
    const skipped = listSkipsBoard() && boardItems().length > 0;
    resultLine.innerHTML = n
      ? `${skipped ? `${n} more` : n} ${n === 1 ? "activity" : "activities"}${areaName ? ` in ${esc(areaName)}` : ""}${state.mine ? " you're going to" : ""}${api.isSample ? ` <span class="badge-sample" title="Made-up demo data">Sample data</span>` : ""}`
      : "";
    if (!n) {
      const m = emptyMessage();
      groupsEl.innerHTML = `
        <div class="empty">
          <h3>${m.h}</h3>
          <p>${m.p}</p>
          <div class="empty-actions">
            ${state.mine ? `<a class="btn btn-primary" href="index.html">Browse activities</a>` : ""}
            ${state.when !== "all" ? `<button type="button" class="btn" data-reset="when">Show any date</button>` : ""}
            ${state.area !== "all" ? `<button type="button" class="btn" data-reset="area">Show all areas</button>` : ""}
            ${state.q ? `<button type="button" class="btn" data-reset="q">Clear search</button>` : ""}
          </div>
        </div>`;
      return;
    }
    const groups = new Map();
    list.forEach((a) => {
      const g = groupName(a, skipped);
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(a);
    });
    groupsEl.innerHTML = [...groups]
      .map(([name, items]) => {
        const gid = `g-${name.replace(/\s/g, "")}`;
        return `
        <section class="group" aria-labelledby="${gid}">
          <h3 class="group-h" id="${gid}">${name}<span class="group-n">${items.length}</span></h3>
          <ol class="rows">${items.map(row).join("")}</ol>
        </section>`;
      })
      .join("");
  }

  groupsEl.addEventListener("click", async (e) => {
    const reset = e.target.closest("[data-reset]");
    if (reset) {
      const k = reset.dataset.reset;
      if (k === "when") { state.when = "all"; form.when.value = "all"; }
      if (k === "area") { state.area = "all"; renderTabs(); }
      if (k === "q") { state.q = ""; form.q.value = ""; }
      render(k === "area");
      return;
    }
    const joinBtn = e.target.closest("[data-join]");
    const leaveBtn = e.target.closest("[data-leave]");
    if (joinBtn) join(joinBtn.dataset.join, joinBtn);
    if (leaveBtn) leave(leaveBtn.dataset.leave, leaveBtn);
  });

  function replace(updated) {
    activities = activities.map((a) => (a.id === updated.id ? updated : a));
    render(false);
  }

  async function join(id, btn) {
    if (!api.session.get()) {
      location.href = `signin.html?next=${encodeURIComponent(`index.html?join=${encodeURIComponent(id)}`)}`;
      return;
    }
    if (btn) { btn.disabled = true; btn.setAttribute("aria-busy", "true"); btn.textContent = "Joining…"; }
    try {
      const updated = await api.join(id);
      replace(updated);
      window.ui.toast(`You're going to ${updated.title}.`, { label: "Undo", run: () => leave(id) });
    } catch (err) {
      window.ui.toast(err.message);
      render(false);
    }
  }

  async function leave(id, btn) {
    if (btn) { btn.disabled = true; btn.textContent = "Leaving…"; }
    try {
      const updated = await api.leave(id);
      replace(updated);
      window.ui.toast(`You've left ${updated.title}.`);
    } catch (err) {
      window.ui.toast(err.message);
      render(false);
    }
  }

  // ---- render / load ------------------------------------------------------------
  function render(animateBoard) {
    syncUrl();
    renderBoard(animateBoard);
    renderList();
    renderLede();
    window.ui.renderHeader({ page: state.mine ? "mine" : "browse", going: upcoming().filter((a) => a.joined).length });
  }

  function renderLede() {
    const s = api.session.get();
    const lede = $("[data-lede]");
    if (!s) return;
    const mine = upcoming().filter((a) => a.joined);
    const first = s.name.split(" ")[0];
    if (state.mine) {
      lede.textContent = mine.length ? "Everything you've joined, soonest first." : "";
      return;
    }
    lede.textContent = mine.length
      ? `Hi ${first}. You're going to ${mine.length} ${mine.length === 1 ? "activity" : "activities"}. Next: ${mine[0].title}, ${window.ui.longDate(mine[0].startsAt)}.`
      : `Hi ${first}. Pick something to join this week.`;
  }

  function showSkeleton() {
    boardRows.innerHTML = Array.from({ length: 3 }, () => `<li class="board-row skeleton"><span></span><span></span><span></span></li>`).join("");
    groupsEl.innerHTML = `<ol class="rows">${Array.from({ length: 4 }, () => `<li class="row skeleton"><span></span><span></span><span></span></li>`).join("")}</ol>`;
    resultLine.textContent = "Loading activities…";
  }

  function showError(err) {
    board.hidden = true;
    resultLine.textContent = "";
    groupsEl.innerHTML = `
      <div class="empty empty-error" role="alert">
        <h3>Couldn't load activities</h3>
        <p>${esc(err.message)} The list will come back as soon as the server answers.</p>
        <div class="empty-actions"><button type="button" class="btn btn-primary" data-retry>${icon("retry")}Try again</button></div>
      </div>`;
    groupsEl.querySelector("[data-retry]").addEventListener("click", () => { board.hidden = state.mine; load(); });
  }

  async function load() {
    showSkeleton();
    const stopSlow = window.ui.slowNotice(board);
    try {
      activities = await api.listActivities();
      stopSlow();
      render(true);
      const pending = new URLSearchParams(location.search).get("join");
      if (pending && api.session.get()) {
        const p = new URLSearchParams(location.search);
        p.delete("join");
        history.replaceState(null, "", `${location.pathname}${p.toString() ? `?${p}` : ""}`);
        const a = activities.find((x) => x.id === pending);
        if (a && !a.joined) join(pending);
      }
    } catch (err) {
      stopSlow();
      showError(err);
    }
  }

  await window.ui.consumeLinkToken();
  window.ui.renderHeader({ page: state.mine ? "mine" : "browse" });
  renderTabs();
  tickClock();
  setInterval(() => { tickClock(); if (activities.length) renderBoard(false); }, 30000);
  load();
});
