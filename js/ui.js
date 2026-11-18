// Shared helpers: areas, formatting, icons, header, toasts.
(function () {
  const AREAS = {
    SL: { code: "SL", name: "Service Learning", short: "Service" },
    OA: { code: "OA", name: "Outdoor Appreciation", short: "Outdoor" },
    HL: { code: "HL", name: "Healthy Living", short: "Healthy" },
    CL: { code: "CL", name: "Community Leadership", short: "Leadership" },
  };

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // One stroke icon set on a 24px grid.
  const PATHS = {
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    people: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.9M17.5 14.8c1.9.6 3.1 2.2 3.5 4.7"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    back: '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    chat: '<path d="M4.5 18.5 6 15a7 7 0 1 1 3 3z"/>',
    retry: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4"/>',
    logout: '<path d="M14.5 4.5h4a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-4M10 16.5 5.5 12 10 7.5M5.5 12H15"/>',
    user: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.8-3.8 3.6-5.8 7-5.8s6.2 2 7 5.8"/>',
  };
  const icon = (name, cls = "") =>
    `<svg class="icon ${cls}" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATHS[name]}</svg>`;

  const pill = (code, size = "") => `<span class="code code-${code} ${size}" title="${esc(AREAS[code]?.name)}">${code}</span>`;

  // ---- dates ----------------------------------------------------------------
  const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const dayDiff = (a, b) => Math.round((startOfDay(a) - startOfDay(b)) / 86400000);
  const time = (d) => new Date(d).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: false });
  const weekday = (d) => new Date(d).toLocaleDateString("en-SG", { weekday: "short" });
  const dayNum = (d) => new Date(d).getDate();
  const month = (d) => new Date(d).toLocaleDateString("en-SG", { month: "short" });
  const longDate = (d) => new Date(d).toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" });

  // Arrival-board countdown: { big, small, live }
  function countdown(a, now = new Date()) {
    const start = new Date(a.startsAt), end = new Date(a.endsAt);
    if (now >= start && now < end) return { big: "Now", small: `until ${time(end)}`, live: true };
    if (now >= end) return { big: "Ended", small: "", live: false };
    const mins = Math.round((start - now) / 60000);
    const days = dayDiff(start, now);
    if (days === 0 && mins < 180) {
      const h = Math.floor(mins / 60), m = mins % 60;
      return { big: h ? `${h} h ${m} min` : `${m} min`, small: `at ${time(start)}`, live: true };
    }
    if (days === 0) return { big: "Today", small: time(start), live: true };
    if (days === 1) return { big: "Tomorrow", small: time(start) };
    return { big: `${days}`, unit: "days", small: `${weekday(start)} ${time(start)}` };
  }

  // Sign-up status for an activity, from the viewer's point of view.
  function status(a, now = new Date()) {
    const left = Math.max(0, a.spotsTotal - a.spotsTaken);
    const closes = new Date(a.signupClosesAt);
    const ended = now >= new Date(a.endsAt);
    const closed = now >= closes;
    const closesInDays = dayDiff(closes, now);
    let closesText;
    if (closesInDays <= 0) closesText = `Closes today ${time(closes)}`;
    else if (closesInDays === 1) closesText = `Closes tomorrow ${time(closes)}`;
    else closesText = `Closes ${weekday(closes)} ${dayNum(closes)} ${month(closes)}`;
    return {
      left,
      full: left === 0,
      ended,
      closed,
      closingSoon: !closed && closesInDays <= 1,
      fewLeft: left > 0 && left <= 3,
      closesText,
      joined: !!a.joined,
    };
  }

  // "Tomorrow · 08:00–11:00"
  function whenLine(a, now = new Date()) {
    const start = new Date(a.startsAt), end = new Date(a.endsAt);
    const range = `${time(start)}–${time(end)}`;
    if (now >= start && now < end) return `On now · until ${time(end)}`;
    if (now >= end) return `Ended · ${range}`;
    const days = dayDiff(start, now);
    if (days === 0) return `Today · ${range}`;
    if (days === 1) return `Tomorrow · ${range}`;
    return `In ${days} days · ${range}`;
  }

  // Poster date line: ["MON", "23 NOV"]
  const posterDate = (d) => [weekday(d).toUpperCase(), `${dayNum(d)} ${month(d).toUpperCase()}`];

  const spotsText = (st, a) =>
    st.full ? "Full" : `${st.left} of ${a.spotsTotal} ${st.left === 1 ? "spot" : "spots"} left`;

  // ---- header -----------------------------------------------------------------
  function renderHeader({ page = "", going = 0 } = {}) {
    const el = document.querySelector("[data-header]");
    if (!el) return;
    const s = window.api.session.get();
    const name = esc(window.APP_CONFIG.appName);
    const back = encodeURIComponent(location.pathname.split("/").pop() + location.search);
    el.innerHTML = `
      <div class="top-inner">
        <a class="brand" href="index.html"><span class="brand-name">${name}</span></a>
        <nav class="nav" aria-label="Main">
          <a href="index.html" ${page === "browse" ? 'aria-current="page"' : ""}>Browse</a>
          <a href="${s ? "index.html?mine=1" : `signin.html?next=${encodeURIComponent("index.html?mine=1")}`}" ${page === "mine" ? 'aria-current="page"' : ""}>Going${s && going ? `<span class="nav-count">${going}</span>` : ""}</a>
        </nav>
        <div class="who">
          ${s
            ? `<span class="who-name">${icon("user")}<span>${esc(s.name)}</span></span>
               <button class="btn btn-quiet btn-sm btn-signout" type="button" data-signout aria-label="Sign out">${icon("logout")}<span class="signout-text">Sign out</span></button>`
            : `<a class="btn btn-sm" href="signin.html?next=${back}">Sign in</a>`}
        </div>
      </div>`;
    el.querySelector("[data-signout]")?.addEventListener("click", () => {
      window.api.signOut();
      location.reload();
    });
  }

  // ---- toast with optional action -----------------------------------------------
  let toastTimer;
  function toast(message, action) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.append(el);
    }
    el.innerHTML = `<span>${esc(message)}</span>${action ? `<button type="button" class="toast-action">${esc(action.label)}</button>` : ""}`;
    if (action) el.querySelector(".toast-action").addEventListener("click", () => { hide(); action.run(); });
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    const hide = () => el.classList.remove("is-on");
    toastTimer = setTimeout(hide, action ? 6000 : 3500);
  }

  // Shows "waking up the server" if a request takes a while.
  function slowNotice(target) {
    const t = setTimeout(() => target.classList.add("is-slow"), window.APP_CONFIG.slowAfterMs);
    return () => { clearTimeout(t); target.classList.remove("is-slow"); };
  }

  // Signs in from the Telegram bot's personal link (?token=...), then cleans the URL.
  async function consumeLinkToken() {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) return;
    params.delete("token");
    history.replaceState(null, "", location.pathname + (params.toString() ? `?${params}` : "") + location.hash);
    try {
      const s = await window.api.signInWithToken(token);
      toast(`Signed in as ${s.name}.`);
    } catch {
      toast("That sign-in link has expired. Ask the bot for a new one, or sign in with your email.");
    }
  }

  window.ui = {
    AREAS, esc, icon, pill, countdown, status, spotsText, whenLine, posterDate,
    time, weekday, dayNum, month, longDate, dayDiff, startOfDay,
    renderHeader, toast, slowNotice, consumeLinkToken,
  };
})();
