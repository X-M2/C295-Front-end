// Activity detail page: activity.html?id=...
document.addEventListener("DOMContentLoaded", async () => {
  const { esc, icon, pill, countdown, status, spotsText, AREAS, longDate, time } = window.ui;
  const api = window.api;
  const content = document.querySelector("[data-content]");
  const id = new URLSearchParams(location.search).get("id");
  let activity = null;

  document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));

  function draftMessage(a) {
    const s = api.session.get();
    const who = s ? s.name : "[your name]";
    return [
      "Hi,",
      "",
      `I'm ${who}, a student at Republic Polytechnic. I've signed up for ${a.title} on ${longDate(a.startsAt)}, ${time(a.startsAt)}.`,
      "Is there anything I should bring or prepare?",
      "",
      "Thank you,",
      who,
    ].join("\n");
  }

  function going(a) {
    const s = api.session.get();
    const n = a.spotsTaken;
    if (!n) return `<p class="muted">Nobody has joined yet. Be the first.</p>`;
    if (!s) {
      return `<p><strong>${n} RP ${n === 1 ? "student" : "students"}</strong> going.</p>
        <p class="muted small">Sign in to see which of your friends are going.</p>`;
    }
    const friends = a.friendsGoing || [];
    const others = n - friends.length - (a.joined ? 1 : 0);
    return `
      ${friends.length ? `<ul class="people">${friends.map((f) => `<li><span class="avatar" aria-hidden="true">${esc(f[0])}</span>${esc(f)}</li>`).join("")}</ul>` : ""}
      <p class="muted small">${a.joined ? "You, " : ""}${friends.length ? `${friends.length} ${friends.length === 1 ? "friend" : "friends"}` : ""}${friends.length && others > 0 ? " and " : ""}${others > 0 ? `${others} other RP ${others === 1 ? "student" : "students"}` : ""}. Only students who turned on buddy matching are named.</p>`;
  }

  function action(a, st) {
    if (st.ended) return `<p class="muted">This activity has ended.</p>`;
    if (st.joined) {
      return `<p class="going-yes">${icon("check")}You're going</p>
        <button type="button" class="btn btn-block" data-leave>Leave this activity</button>`;
    }
    if (st.full) return `<button type="button" class="btn btn-block" disabled>Full</button><p class="muted small">All ${a.spotsTotal} spots are taken.</p>`;
    if (st.closed) return `<button type="button" class="btn btn-block" disabled>Sign-up closed</button>`;
    const signedIn = !!api.session.get();
    return `<button type="button" class="btn btn-primary btn-block btn-lg" data-join>Join</button>
      ${signedIn ? "" : `<p class="muted small">You'll sign in first, then come straight back here.</p>`}`;
  }

  function render() {
    const a = activity;
    const st = status(a);
    const c = countdown(a);
    const area = AREAS[a.area];
    const pct = Math.min(100, Math.round((a.spotsTaken / a.spotsTotal) * 100));
    const mail = `mailto:${encodeURIComponent(a.contact?.value || "")}?subject=${encodeURIComponent(`${a.title} (${longDate(a.startsAt)})`)}&body=${encodeURIComponent(draftMessage(a))}`;
    document.title = `${a.title} · ${window.APP_CONFIG.appName}`;

    content.innerHTML = `
      <article class="detail">
        <header class="detail-head">
          <h1>${esc(a.title)}</h1>
          <p class="lede">${esc(a.organiser)}${a.isSample ? `<span class="badge-sample" title="Made-up demo data">Sample</span>` : ""}</p>
        </header>

        <div class="detail-grid">
          <div class="detail-main">
            <div class="eta-strip">
              <div class="eta-strip-when">
                <span class="eta-strip-area">${pill(a.area)}<span>${esc(area.name)}</span></span>
                <span class="eta-strip-day">${esc(longDate(a.startsAt))}</span>
                <span class="eta-strip-time">${time(a.startsAt)}–${time(a.endsAt)}</span>
              </div>
              <div class="board-eta${c.live ? " is-live" : ""}">
                <span class="eta-big">${esc(c.full || c.big)}${c.unit ? `<span class="eta-unit">${c.unit}</span>` : ""}</span>
                ${c.unit || c.full ? "" : `<span class="eta-small">${esc(c.small)}</span>`}
              </div>
            </div>

            <dl class="facts">
              <div><dt>${icon("pin")}Where</dt><dd>${esc(a.location)}</dd></div>
              <div><dt>${icon("flag")}Organiser</dt><dd>${esc(a.organiser)}</dd></div>
            </dl>

            ${a.photoUrl ? `<img class="detail-photo" src="${esc(a.photoUrl)}" alt="" loading="lazy">` : ""}

            <section class="detail-section" aria-labelledby="about-h">
              <h2 id="about-h">About</h2>
              <p class="prose">${esc(a.description)}</p>
            </section>

            <section class="detail-section" aria-labelledby="going-h">
              <h2 id="going-h">Who's going</h2>
              ${going(a)}
            </section>
          </div>

          <aside class="detail-side" aria-label="Sign up">
            <div class="side-panel">
              <div class="row-spots${st.full ? " is-full" : ""}${st.fewLeft ? " is-few" : ""}">
                <span class="spots-text spots-lg">${spotsText(st, a)}</span>
                <span class="meter" aria-hidden="true"><span style="width:${pct}%"></span></span>
                <span class="closes${st.closingSoon ? " is-soon" : ""}">${st.closed ? "Sign-up closed" : esc(st.closesText)}</span>
              </div>
              <div class="side-action">${action(a, st)}</div>
              <a class="side-link" href="${mail}">${icon("mail")}Email the organiser</a>
            </div>
          </aside>
        </div>
      </article>`;
  }

  content.addEventListener("click", async (e) => {
    const joinBtn = e.target.closest("[data-join]");
    const leaveBtn = e.target.closest("[data-leave]");
    if (!joinBtn && !leaveBtn) return;
    if (joinBtn && !api.session.get()) {
      location.href = `signin.html?next=${encodeURIComponent(`activity.html?id=${encodeURIComponent(id)}&join=1`)}`;
      return;
    }
    const btn = joinBtn || leaveBtn;
    btn.disabled = true;
    btn.textContent = joinBtn ? "Joining…" : "Leaving…";
    try {
      activity = joinBtn ? await api.join(id) : await api.leave(id);
      render();
      window.ui.toast(joinBtn ? `You're going to ${activity.title}.` : `You've left ${activity.title}.`,
        joinBtn ? { label: "Undo", run: () => content.querySelector("[data-leave]")?.click() } : undefined);
    } catch (err) {
      window.ui.toast(err.message);
      render();
    }
  });

  async function load() {
    content.innerHTML = `<div class="detail skeleton-detail"><span></span><span></span><span></span></div>
      <p class="slow-note">Waking up the server. This can take up to a minute the first time.</p>`;
    const stopSlow = window.ui.slowNotice(document.querySelector("[data-detail]"));
    try {
      if (!id) throw new api.ApiError("No activity was chosen.", 400);
      activity = await api.getActivity(id);
      stopSlow();
      render();
      const p = new URLSearchParams(location.search);
      if (p.get("join") === "1") {
        p.delete("join");
        history.replaceState(null, "", `${location.pathname}?${p}`);
        content.querySelector("[data-join]")?.click();
      }
    } catch (err) {
      stopSlow();
      document.title = `Activity not found · ${window.APP_CONFIG.appName}`;
      content.innerHTML = `
        <div class="empty empty-error" role="alert">
          <h1 class="h3">${err.status === 404 || err.status === 400 ? "We couldn't find that activity" : "Couldn't load this activity"}</h1>
          <p>${esc(err.message)}</p>
          <div class="empty-actions">
            ${err.status === 404 || err.status === 400 ? "" : `<button type="button" class="btn btn-primary" data-retry>${icon("retry")}Try again</button>`}
            <a class="btn" href="index.html">See all activities</a>
          </div>
        </div>`;
      content.querySelector("[data-retry]")?.addEventListener("click", load);
    }
  }

  await window.ui.consumeLinkToken();
  window.ui.renderHeader({ page: "browse" });
  load();
});
