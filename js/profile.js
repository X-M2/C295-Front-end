// Profile: four stubs stamped with their state (buddy matching, reminders, Telegram, my data).
// Tap a stub to open its settings below. Every change saves at once.
document.addEventListener("DOMContentLoaded", async () => {
  const { esc, icon, AREAS } = window.ui;
  const api = window.api;
  const $ = (s) => document.querySelector(s);

  document.title = `Profile · ${window.APP_CONFIG.appName}`;
  await window.ui.consumeLinkToken();
  const me = api.session.get();
  if (!me) {
    location.replace(`signin.html?next=${encodeURIComponent("profile.html")}`);
    return;
  }
  window.ui.renderHeader({ page: "profile" });

  const root = $("[data-profile]");
  const stubsEl = $("[data-stubs]");
  const panel = $("[data-panel]");
  $("[data-name]").textContent = me.name || "Profile";
  if ((me.name || "").length > 18) $("[data-name]").classList.add("is-long");
  $("[data-mail]").textContent = me.email || "No email linked";
  $("[data-signout-page]").addEventListener("click", () => { api.signOut(); location.href = "index.html"; });

  const params = new URLSearchParams(location.search);
  const STUBS = ["buddy", "reminders", "telegram", "data"];
  // Reminders opens by default so the page never starts with an empty half.
  let open = STUBS.includes(params.get("open")) ? params.get("open") : "reminders";
  let settings = null;
  let busy = false;

  // ---- what each stub says -------------------------------------------------------------
  const REMINDER_KEYS = ["before", "afterwards", "newInAreas", "closing"];
  const remindersOn = () => REMINDER_KEYS.filter((k) => settings.reminders[k]?.on).length;

  function stubState(id) {
    const tg = settings.telegram?.linked;
    if (id === "buddy") {
      return settings.buddyMatching
        ? { title: "Buddy matching", sub: "First name shown", stamp: "On", off: false }
        : { title: "Buddy matching", sub: "Hidden", stamp: "Off", off: true };
    }
    if (id === "reminders") {
      if (!tg) return { title: "Reminders", sub: "Needs Telegram", stamp: "Off", off: true };
      const n = remindersOn();
      return n ? { title: "Reminders", sub: `${n} of 4 on`, stamp: "On", off: false }
        : { title: "Reminders", sub: "All off", stamp: "Off", off: true };
    }
    if (id === "telegram") {
      return tg ? { title: "Telegram", sub: settings.telegram.username ? `@${settings.telegram.username}` : "Linked", stamp: "Linked", off: false }
        : { title: "Telegram", sub: "Not linked", stamp: "Off", off: true };
    }
    return { title: "My data", sub: "Download or delete", stamp: "", off: true };
  }

  let lastStamps = {};
  function renderStubs() {
    stubsEl.innerHTML = STUBS.map((id, i) => {
      const s = stubState(id);
      const pressed = lastStamps[id] !== undefined && lastStamps[id] !== s.stamp && s.stamp;
      return `
        <button type="button" class="stub${s.off ? " is-off" : ""}" data-stub="${id}" aria-expanded="${open === id}" aria-controls="stub-panel" style="--i:${i}">
          <span class="stub-h">${esc(s.title)}</span>
          ${s.stamp ? `<span class="stamp stub-stamp${pressed ? " stamp-in" : ""}" aria-hidden="true">${esc(s.stamp)}</span>` : ""}
          <span class="stub-sub">${esc(s.sub)}</span>
          <span class="visually-hidden">${s.stamp ? `: ${esc(s.stamp)}` : ""}</span>
        </button>`;
    }).join("");
    lastStamps = Object.fromEntries(STUBS.map((id) => [id, stubState(id).stamp]));
  }

  stubsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-stub]");
    if (!b || !settings) return;
    open = open === b.dataset.stub ? null : b.dataset.stub;
    const p = new URLSearchParams(location.search);
    if (open && open !== "reminders") p.set("open", open); else p.delete("open");
    history.replaceState(null, "", `${location.pathname}${p.toString() ? `?${p}` : ""}`);
    renderStubs();
    renderPanel();
    stubsEl.querySelector(`[data-stub="${b.dataset.stub}"]`)?.focus();
    if (open && matchMedia("(max-width: 760px)").matches) {
      const r = panel.getBoundingClientRect();
      if (r.top > innerHeight * 0.75) panel.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  });

  // ---- shared pieces ---------------------------------------------------------------------
  const sw = (key, on, label, opts = {}) => `
    <button type="button" class="switch" role="switch" aria-checked="${on}" data-set="${key}" aria-labelledby="${key}-l"${opts.disabled ? " disabled" : ""}><span></span></button>`;

  function settingRow(key, on, label, desc, extra = "", opts = {}) {
    return `
      <div class="set-row${opts.disabled ? " is-disabled" : ""}" data-row="${key}">
        <div class="set-text">
          <p class="set-label" id="${key}-l">${label}<span class="saved" data-saved="${key}" role="status"></span></p>
          ${desc ? `<p class="set-desc">${desc}</p>` : ""}
        </div>
        ${sw(key, on, label, opts)}
        ${extra ? `<div class="set-extra">${extra}</div>` : ""}
      </div>`;
  }

  // ---- the open stub's settings --------------------------------------------------------------
  function renderPanel() {
    if (!open || !settings) { panel.innerHTML = ""; return; }
    const r = settings.reminders;
    const tg = settings.telegram?.linked;
    let body = "";
    if (open === "buddy") {
      body = settingRow("buddyMatching", settings.buddyMatching, "Show my first name to buddies",
        `Students going to the same activity can see “${esc((me.name || "").split(" ")[0] || "your first name")}”. Nothing else. Contact details are shared only if you both accept. Turning this off removes your name everywhere straight away.`);
    } else if (open === "reminders") {
      const dis = { disabled: !tg };
      const when = `
        <div class="pills" role="group" aria-label="When to remind me">
          <button type="button" class="tab tab-sm" data-pick="dayBefore" aria-pressed="${tg && !!r.before.dayBefore}"${!tg || !r.before.on ? " disabled" : ""}>Day before</button>
          <button type="button" class="tab tab-sm" data-pick="twoHours" aria-pressed="${tg && !!r.before.twoHours}"${!tg || !r.before.on ? " disabled" : ""}>2 h before</button>
        </div>`;
      const areas = `
        <div class="pills" role="group" aria-label="Your areas">
          ${Object.values(AREAS).map((a) => `<button type="button" class="tab tab-sm" data-area="${a.code}" aria-pressed="${tg && r.newInAreas.areas.includes(a.code)}"${!tg ? " disabled" : ""}><i class="ink-dot ink-${a.code}" aria-hidden="true"></i>${esc(a.short)}</button>`).join("")}
        </div>`;
      body = `
        ${tg ? `<p class="panel-note">The Telegram bot sends these to @${esc(settings.telegram.username || "you")}.</p>`
          : `<div class="panel-warn"><p>Reminders come from the Telegram bot, so they are all off until you link it. The choices you saved come back once Telegram is linked.</p><button type="button" class="btn btn-sm btn-solid" data-link>Link Telegram</button></div>`}
        ${settingRow("before", tg && r.before.on, "Before an activity", "For activities you joined.", when, dis)}
        ${settingRow("afterwards", tg && r.afterwards.on, "Log it afterwards", "When something you joined has ended, a nudge to write the entry.", "", dis)}
        ${settingRow("newInAreas", tg && r.newInAreas.on, "New in my areas", "When an activity is posted in your areas.", "", dis)}
        ${settingRow("closing", tg && r.closing.on, "Sign-up closing", "A day before sign-up closes, for activities in your areas.", "", dis)}
        <div class="set-row set-areas${!tg ? " is-disabled" : ""}">
          <div class="set-text"><p class="set-label" id="areas-l">Your areas<span class="saved" data-saved="areas" role="status"></span></p>
          <p class="set-desc">${r.newInAreas.areas.length ? "Used by New in my areas and Sign-up closing." : "Pick at least one, or those two reminders have nothing to send."}</p></div>
          <div class="set-extra">${areas}</div>
        </div>`;
    } else if (open === "telegram") {
      body = tg
        ? `<p class="panel-text">Linked as <b>@${esc(settings.telegram.username || "")}</b>. The bot can send your reminders and sign you in here with a link.</p>
           <div class="panel-actions" data-unlink-area><button type="button" class="btn btn-sm" data-unlink-ask>Unlink Telegram</button></div>`
        : `<p class="panel-text">Link your Telegram so the bot can send reminders and sign you in with a link. It opens @${esc(window.APP_CONFIG.botUsername)}; press Start there.</p>
           <div class="panel-actions"><button type="button" class="btn btn-sm btn-solid" data-link>Link Telegram</button></div>`;
    } else if (open === "data") {
      body = `
        <div class="data-block">
          <h3 class="data-h">Download my data</h3>
          <p class="panel-text">One file with everything kept about you: your journal entries, the activities you joined and these settings.</p>
          <div class="panel-actions"><button type="button" class="btn btn-sm" data-export>${icon("download")}Download my data</button></div>
        </div>
        <div class="data-block danger" data-delete-area>
          <h3 class="data-h">Delete my account</h3>
          <p class="panel-text">This deletes your journal entries and their photos, your sign-ups and your settings, and unlinks Telegram. It can't be undone.</p>
          <div class="panel-actions"><button type="button" class="btn btn-sm btn-danger" data-delete-ask>${icon("trash")}Delete my account</button></div>
        </div>`;
    }
    const s = stubState(open);
    panel.innerHTML = `<h2 class="group-h panel-h">${esc(s.title)}</h2>${body}`;
  }

  // ---- saving ------------------------------------------------------------------------------------------
  function flashSaved(key) {
    const el = panel.querySelector(`[data-saved="${key}"]`);
    if (!el) return;
    el.textContent = "Saved";
    el.classList.remove("is-shown"); void el.offsetWidth; el.classList.add("is-shown");
    clearTimeout(el._t); el._t = setTimeout(() => { el.classList.remove("is-shown"); el.textContent = ""; }, 1800);
  }

  async function save(change, key, focusSel) {
    const before = structuredClone(settings);
    // Optimistic: show the change now, put it back if the server says no.
    settings = { ...settings, ...change, reminders: { ...settings.reminders, ...(change.reminders || {}) } };
    renderStubs(); renderPanel();
    panel.querySelector(focusSel)?.focus();
    try {
      settings = await api.saveSettings(change);
      renderStubs(); renderPanel();
      panel.querySelector(focusSel)?.focus();
      flashSaved(key);
    } catch (err) {
      settings = before;
      renderStubs(); renderPanel();
      panel.querySelector(focusSel)?.focus();
      window.ui.toast(err.message);
    }
  }

  panel.addEventListener("click", async (e) => {
    const t = e.target.closest("button");
    if (!t || t.disabled || busy) return;
    const r = settings.reminders;

    if (t.dataset.set) {
      const k = t.dataset.set, on = t.getAttribute("aria-checked") !== "true";
      const sel = `[data-set="${k}"]`;
      if (k === "buddyMatching") return save({ buddyMatching: on }, k, sel);
      return save({ reminders: { [k]: { ...r[k], on } } }, k, sel);
    }
    if (t.dataset.pick) {
      const k = t.dataset.pick, next = { ...r.before, [k]: !r.before[k] };
      if (!next.dayBefore && !next.twoHours) { window.ui.toast("Keep at least one, or turn this reminder off."); return; }
      return save({ reminders: { before: next } }, "before", `[data-pick="${k}"]`);
    }
    if (t.dataset.area) {
      const c = t.dataset.area, list = r.newInAreas.areas;
      const areas = list.includes(c) ? list.filter((x) => x !== c) : [...list, c];
      return save({ reminders: { newInAreas: { ...r.newInAreas, areas } } }, "areas", `[data-area="${c}"]`);
    }
    if (t.hasAttribute("data-link")) {
      busy = true; t.setAttribute("aria-busy", "true"); t.textContent = "Opening Telegram…";
      try {
        const res = await api.startTelegramLink();
        if (res.linkedNow) {
          settings = await api.getSettings();
          window.ui.toast(api.isSample ? "Sample mode: linked without opening Telegram." : "Telegram linked.");
        } else {
          window.open(res.url, "_blank", "noopener");
          window.ui.toast("Press Start in Telegram, then come back and refresh this page.");
        }
      } catch (err) { window.ui.toast(err.message); }
      busy = false; renderStubs(); renderPanel();
      return;
    }
    if (t.hasAttribute("data-unlink-ask")) {
      panel.querySelector("[data-unlink-area]").innerHTML = `
        <p class="confirm-text">Unlink Telegram? Reminders stop until you link it again.</p>
        <button type="button" class="btn btn-sm btn-danger" data-unlink>Unlink</button>
        <button type="button" class="btn btn-sm btn-quiet" data-unlink-cancel>Cancel</button>`;
      panel.querySelector("[data-unlink-cancel]").focus();
      return;
    }
    if (t.hasAttribute("data-unlink-cancel")) { renderPanel(); panel.querySelector("[data-unlink-ask]")?.focus(); return; }
    if (t.hasAttribute("data-unlink")) {
      busy = true; t.textContent = "Unlinking…";
      try { await api.unlinkTelegram(); settings = await api.getSettings(); window.ui.toast("Telegram unlinked."); }
      catch (err) { window.ui.toast(err.message); }
      busy = false; renderStubs(); renderPanel();
      return;
    }
    if (t.hasAttribute("data-export")) {
      busy = true; const label = t.innerHTML; t.textContent = "Preparing…";
      try {
        const data = await api.exportData();
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
        const a = Object.assign(document.createElement("a"), { href: url, download: `my-data-${new Date().toLocaleDateString("en-CA")}.json` });
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        window.ui.toast("Your data is downloading.");
      } catch (err) { window.ui.toast(err.message); }
      busy = false; t.innerHTML = label;
      return;
    }
    if (t.hasAttribute("data-delete-ask")) {
      const area = panel.querySelector("[data-delete-area] .panel-actions");
      area.outerHTML = `
        <form class="delete-confirm" data-delete-form>
          <label for="confirm-delete">Type <b>DELETE</b> to confirm</label>
          <input id="confirm-delete" name="confirm" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false">
          <div class="panel-actions">
            <button type="submit" class="btn btn-sm btn-danger" data-delete disabled>Delete everything</button>
            <button type="button" class="btn btn-sm btn-quiet" data-delete-cancel>Cancel</button>
          </div>
        </form>`;
      const f = panel.querySelector("[data-delete-form]");
      f.confirm.addEventListener("input", () => { f.querySelector("[data-delete]").disabled = f.confirm.value.trim() !== "DELETE"; });
      f.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        if (f.confirm.value.trim() !== "DELETE") return;
        const b = f.querySelector("[data-delete]"); b.disabled = true; b.textContent = "Deleting…";
        try { await api.deleteAccount(); location.href = "index.html"; }
        catch (err) { window.ui.toast(err.message); b.disabled = false; b.textContent = "Delete everything"; }
      });
      f.confirm.focus();
      return;
    }
    if (t.hasAttribute("data-delete-cancel")) { renderPanel(); panel.querySelector("[data-delete-ask]")?.focus(); }
  });

  // ---- load -----------------------------------------------------------------------------------------------
  function showSkeleton() {
    root.classList.remove("has-error");
    stubsEl.innerHTML = STUBS.map(() => `<span class="stub stub-skeleton"><span></span><span></span></span>`).join("");
    panel.innerHTML = "";
  }

  function showError(err) {
    root.classList.add("has-error");
    stubsEl.innerHTML = "";
    panel.innerHTML = `
      <div class="empty empty-error" role="alert">
        <h3>Couldn't load your settings</h3>
        <p>${esc(err.message)} Nothing has changed; your settings stay as they were.</p>
        <div class="empty-actions"><button type="button" class="btn btn-solid" data-retry>${icon("retry")}Try again</button></div>
      </div>`;
    panel.querySelector("[data-retry]").addEventListener("click", load);
  }

  async function load() {
    showSkeleton();
    const stopSlow = window.ui.slowNotice(root);
    try {
      settings = await api.getSettings();
      stopSlow();
      renderStubs();
      renderPanel();
    } catch (err) {
      stopSlow();
      if (err.status === 401) { location.replace(`signin.html?next=${encodeURIComponent("profile.html")}`); return; }
      showError(err);
    }
  }

  load();
});
