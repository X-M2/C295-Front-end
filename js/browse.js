// Browse page: a wall of activity posters, soonest first.
// ?mine=1 shows only the activities the signed-in student is going to.
document.addEventListener("DOMContentLoaded", async () => {
  const { esc, icon, status, spotsText, AREAS } = window.ui;
  const api = window.api;

  const $ = (s) => document.querySelector(s);
  const wall = $("[data-wall]");
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
  if (state.mine) $("[data-title]").textContent = "Going";

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
          ${code === "all" ? "" : `<i class="ink-dot ink-${code}" aria-hidden="true"></i>`}<span>${esc(name)}</span>
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
      searchTimer = setTimeout(() => { state.q = form.q.value.trim(); render(true); }, 200);
    }
  });
  form.addEventListener("change", (e) => {
    if (e.target.name === "when") { state.when = form.when.value; render(true); }
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

  function filtered() {
    const q = state.q.toLowerCase();
    const weekEnd = endOfWeek(now());
    const monthEnd = new Date(now().getTime() + 31 * 86400000);
    return upcoming().filter((a) => {
      if (state.mine && !a.joined) return false;
      if (state.area !== "all" && a.area !== state.area) return false;
      const s = new Date(a.startsAt);
      if (state.when === "week" && s >= weekEnd) return false;
      if (state.when === "month" && s >= monthEnd) return false;
      if (q && !`${a.title} ${a.location} ${a.organiser}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  // ---- posters ------------------------------------------------------------------
  function going(a) {
    const n = a.spotsTaken;
    if (!n) return "Be the first to join";
    const friends = (a.friendsGoing || []).slice(0, 2);
    if (friends.length) {
      const more = n - friends.length;
      return `<b>${friends.map(esc).join(", ")}</b>${more > 0 ? ` +${more}` : ""} going`;
    }
    return `${n} going`;
  }

  function action(a, st) {
    if (st.joined) {
      return `<span class="going-tag">${icon("check")}Going</span>
        <button type="button" class="btn btn-sm btn-on-ink-quiet" data-leave="${esc(a.id)}">Leave</button>`;
    }
    if (st.full) return `<button type="button" class="btn btn-on-ink" disabled>Full</button>`;
    if (st.closed) return `<button type="button" class="btn btn-on-ink" disabled>Closed</button>`;
    return `<button type="button" class="btn btn-on-ink" data-join="${esc(a.id)}">Join</button>`;
  }

  function poster(a, i, lead) {
    const st = status(a);
    const s = new Date(a.startsAt);
    const [wd, dm] = window.ui.posterDate(s);
    const stamp = st.joined ? "Going" : st.full ? "Full" : st.closed ? "Closed" : "";
    return `
      <li class="poster ink-${a.area}${lead ? " poster-lead" : ""}${a.photoUrl ? " has-photo" : ""}" style="--i:${i}">
        ${stamp ? `<span class="stamp" aria-hidden="true">${stamp}</span>` : ""}
        ${a.photoUrl ? `<div class="poster-photo" aria-hidden="true"><img src="${esc(a.photoUrl)}" alt="" loading="lazy" decoding="async"></div>` : ""}
        <p class="poster-date" aria-hidden="true"><span>${wd}</span> <span>${dm}</span></p>
        <p class="poster-when"><span class="visually-hidden">${window.ui.longDate(s)}. </span>${window.ui.whenLine(a)}</p>
        <h4 class="poster-title"><a href="activity.html?id=${encodeURIComponent(a.id)}">${esc(a.title)}</a></h4>
        <p class="poster-where">${esc(a.location)}</p>
        <div class="poster-foot">
          <ul class="poster-facts">
            <li class="fact-spots">${st.full ? "<b>Full</b>" : `<b>${st.left} of ${a.spotsTotal}</b> ${st.left === 1 ? "spot" : "spots"} left`}</li>
            <li${st.closingSoon ? ' class="fact-soon"' : ""}>${st.closed ? "Sign-up closed" : esc(st.closesText)}</li>
            <li>${going(a)}</li>
            <li class="fact-area">${esc(AREAS[a.area].name)}</li>
          </ul>
          <div class="poster-act">${action(a, st)}</div>
        </div>
      </li>`;
  }

  function groupName(a) {
    const s = new Date(a.startsAt);
    const weekEnd = endOfWeek(now());
    const nextWeekEnd = new Date(weekEnd.getTime() + 7 * 86400000);
    if (s < weekEnd) return "This week";
    if (s < nextWeekEnd) return "Next week";
    return "Later";
  }

  function emptyMessage() {
    const areaName = state.area === "all" ? "" : `${AREAS[state.area].name} `;
    const when = state.when === "week" ? " this week" : state.when === "month" ? " in the next 31 days" : "";
    if (state.mine) return { h: `You haven't joined any ${areaName}activities yet`, p: "Join something from Browse and it shows up here." };
    if (state.q) return { h: `No ${areaName}activities match “${esc(state.q)}”${when}`, p: "Check the spelling, or search for a place or organiser instead." };
    if (!upcoming().length) return { h: "No activities are listed yet", p: "New activities are added every week. Check back soon." };
    return { h: `No ${areaName}activities${when}`, p: "New activities are added every week. Try a wider date range or another area." };
  }

  function renderList(animate) {
    const list = filtered();
    const areaName = state.area === "all" ? null : AREAS[state.area].name;
    const n = list.length;
    resultLine.innerHTML = n
      ? `${n} ${n === 1 ? "activity" : "activities"}${areaName ? ` in ${esc(areaName)}` : ""}${state.mine ? " you're going to" : ""}${api.isSample ? ` <span class="badge-sample" title="Made-up demo data">Sample data</span>` : ""}`
      : "";
    if (!n) {
      const m = emptyMessage();
      groupsEl.innerHTML = `
        <div class="empty">
          <h3>${m.h}</h3>
          <p>${m.p}</p>
          <div class="empty-actions">
            ${state.mine ? `<a class="btn btn-solid" href="index.html">Browse activities</a>` : ""}
            ${state.when !== "all" ? `<button type="button" class="btn" data-reset="when">Show any date</button>` : ""}
            ${state.area !== "all" ? `<button type="button" class="btn" data-reset="area">Show all areas</button>` : ""}
            ${state.q ? `<button type="button" class="btn" data-reset="q">Clear search</button>` : ""}
          </div>
        </div>`;
      return;
    }
    const groups = new Map();
    list.forEach((a) => {
      const g = groupName(a);
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(a);
    });
    let i = 0;
    groupsEl.innerHTML = [...groups]
      .map(([name, items], gi) => {
        const gid = `g-${name.replace(/\s/g, "")}`;
        return `
        <section class="group" aria-labelledby="${gid}">
          <h3 class="group-h" id="${gid}">${name}<span class="group-n">${items.length}</span></h3>
          <ol class="wall${animate ? " paste" : ""}">${items.map((a, j) => poster(a, i++, gi === 0 && j === 0)).join("")}</ol>
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
      render(true);
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
  function render(animate) {
    syncUrl();
    renderList(animate);
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
    resultLine.textContent = "Loading activities…";
    groupsEl.innerHTML = `<ol class="wall">${Array.from({ length: 4 }, (_, i) =>
      `<li class="poster poster-skeleton${i === 0 ? " poster-lead" : ""}"><span></span><span></span><span></span></li>`).join("")}</ol>`;
  }

  function showError(err) {
    resultLine.textContent = "";
    groupsEl.innerHTML = `
      <div class="empty empty-error" role="alert">
        <h3>Couldn't load activities</h3>
        <p>${esc(err.message)} The list will come back as soon as the server answers.</p>
        <div class="empty-actions"><button type="button" class="btn btn-solid" data-retry>${icon("retry")}Try again</button></div>
      </div>`;
    groupsEl.querySelector("[data-retry]").addEventListener("click", load);
  }

  async function load() {
    showSkeleton();
    const stopSlow = window.ui.slowNotice(wall);
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
  setInterval(() => { if (activities.length) renderList(false); }, 60000);
  load();
});
