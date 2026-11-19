// Journal entry form.
//   entry.html?activity=<id>   log an activity the student went to (times prefilled)
//   entry.html?id=<id>         edit an existing entry
//   entry.html?new=1[&date=]   log something that isn't in the app
// Every entry needs: at least one photo, start and end time, what I did, what I learned.
document.addEventListener("DOMContentLoaded", async () => {
  const { esc, icon, AREAS, posterDate, hoursBetween, hoursText, longDate, time } = window.ui;
  const api = window.api;
  const $ = (s, r = document) => r.querySelector(s);
  const root = $("[data-entry]");
  const MAX_PHOTOS = 6;

  document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
  const params = new URLSearchParams(location.search);
  const mode = params.get("id") ? "edit" : params.get("activity") ? "activity" : "other";
  const draftKey = `c295.draft.${mode}.${params.get("id") || params.get("activity") || "new"}`;

  await window.ui.consumeLinkToken();
  if (!api.session.get()) {
    location.replace(`signin.html?next=${encodeURIComponent(`entry.html${location.search}`)}`);
    return;
  }
  window.ui.renderHeader({ page: "journal" });

  const todayIso = new Date().toLocaleDateString("en-CA");
  let entry = null;      // what we're editing
  let activity = null;   // the activity it belongs to, if any
  let photos = [];       // [{ url, sample? }]

  // ---- drafts kept on this phone until saved ------------------------------------
  const readDraft = () => { try { return JSON.parse(localStorage.getItem(draftKey)); } catch { return null; } };
  const clearDraft = () => { try { localStorage.removeItem(draftKey); } catch {} };
  function writeDraft() {
    const f = $("[data-form]");
    if (!f) return;
    const d = { ...collect(f), savedAt: Date.now() };
    try { localStorage.setItem(draftKey, JSON.stringify(d)); }
    catch { try { localStorage.setItem(draftKey, JSON.stringify({ ...d, photos: [] })); } catch {} }
  }

  // ---- photos: shrink before upload so they send quickly on mobile data -----------
  function shrink(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, 1280 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.78));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("unreadable")); };
      img.src = url;
    });
  }

  function renderPhotos() {
    const list = $("[data-photo-list]");
    list.innerHTML = photos.map((p, i) => `
      <li class="thumb">
        <img src="${esc(p.url)}" alt="Photo ${i + 1}">
        <button type="button" class="thumb-remove" data-remove="${i}" aria-label="Remove photo ${i + 1}">${icon("x")}</button>
      </li>`).join("");
    const add = $("[data-add-photo]");
    add.hidden = photos.length >= MAX_PHOTOS;
    $("[data-photo-count]").textContent = photos.length ? `${photos.length} of ${MAX_PHOTOS}` : "";
  }

  // ---- form ------------------------------------------------------------------------
  function collect(f) {
    return {
      area: f.area ? f.area.value : entry?.area || activity?.area || "",
      title: f.title ? f.title.value.trim() : entry?.title || activity?.title || "",
      date: f.date.value,
      start: f.start.value,
      end: f.end.value,
      did: f.did.value,
      learned: f.learned.value,
      photos,
    };
  }

  function updateHours() {
    const f = $("[data-form]");
    const h = hoursBetween(f.start.value, f.end.value);
    $("[data-hours]").textContent = h === null ? (f.start.value && f.end.value ? "End must be after start" : "") : hoursText(h);
    $("[data-hours]").classList.toggle("is-bad", h === null && !!(f.start.value && f.end.value));
  }

  function header() {
    const area = entry?.area || activity?.area;
    if (mode === "other" && !entry?.activityId) {
      return `<h1 class="display entry-h1">${entry ? "Edit entry" : "Log an activity"}</h1>
        <p class="lede">For something you did that isn't listed in the app.</p>`;
    }
    const src = activity || entry;
    const d = activity ? new Date(activity.startsAt) : new Date(`${entry.date}T00:00`);
    const [wd, dm] = posterDate(d);
    return `
      <header class="entry-poster ink-${area}">
        <p class="poster-date" aria-hidden="true"><span>${wd}</span> <span>${dm}</span></p>
        <h1 class="poster-title"><span class="visually-hidden">${esc(longDate(d))}: </span>${esc(src.title)}</h1>
        <p class="poster-where">${activity ? `${esc(activity.location)} · ` : ""}${esc(AREAS[area]?.name || "")}</p>
      </header>`;
  }

  function render(values, restored) {
    root.innerHTML = `
      ${header()}
      ${restored ? `<p class="notice">${icon("retry")}We kept your unsaved entry on this phone. Carry on where you left off.</p>` : ""}
      <div class="error-summary" data-summary tabindex="-1" hidden></div>
      <form class="entry-form" data-form novalidate>
        <fieldset class="field-block">
          <legend class="block-h">Photos <span class="block-n" data-photo-count></span></legend>
          <p class="hint">At least one. They're shrunk before sending, so they upload fast on mobile data.</p>
          <ul class="thumbs" data-photo-list></ul>
          <label class="photo-add" data-add-photo>
            <input type="file" accept="image/*" multiple data-photo-input>
            ${icon("camera")}<span>Add photo</span>
          </label>
          <p class="field-error" data-err="photos"></p>
        </fieldset>

        ${mode === "other" && !entry?.activityId ? `
        <div class="field-block">
          <div class="field">
            <label for="title">What was it?</label>
            <input id="title" name="title" type="text" maxlength="120" value="${esc(values.title || "")}" placeholder="e.g. Beach clean-up with my CCA">
            <p class="field-error" data-err="title"></p>
          </div>
          <fieldset class="field">
            <legend>Area</legend>
            <div class="area-pick">${Object.values(AREAS).map((a) => `
              <label class="tab area-opt"><input type="radio" name="area" value="${a.code}"${values.area === a.code ? " checked" : ""}><i class="ink-dot ink-${a.code}" aria-hidden="true"></i><span>${esc(a.name)}</span></label>`).join("")}
            </div>
            <p class="field-error" data-err="area"></p>
          </fieldset>
        </div>` : ""}

        <fieldset class="field-block">
          <legend class="block-h">When</legend>
          <div class="time-row">
            <div class="field field-date">
              <label for="date">Date</label>
              <input id="date" name="date" type="date" max="${todayIso}" value="${esc(values.date || "")}">
            </div>
            <div class="field">
              <label for="start">Start</label>
              <input id="start" name="start" type="time" value="${esc(values.start || "")}">
            </div>
            <div class="field">
              <label for="end">End</label>
              <input id="end" name="end" type="time" value="${esc(values.end || "")}">
            </div>
            <p class="hours" data-hours aria-live="polite"></p>
          </div>
          <p class="field-error" data-err="time"></p>
        </fieldset>

        <div class="field-block field">
          <label class="block-h" for="did">What I did</label>
          <p class="hint" id="did-hint">The tasks, who you worked with, anything that happened.</p>
          <textarea id="did" name="did" rows="4" maxlength="1500" aria-describedby="did-hint">${esc(values.did || "")}</textarea>
          <p class="field-error" data-err="did"></p>
        </div>

        <div class="field-block field">
          <label class="block-h" for="learned">What I learned</label>
          <p class="hint" id="learned-hint">One thing that surprised you, a skill you used, or what you'd do differently.</p>
          <textarea id="learned" name="learned" rows="4" maxlength="1500" aria-describedby="learned-hint">${esc(values.learned || "")}</textarea>
          <p class="field-error" data-err="learned"></p>
        </div>

        <div class="form-actions">
          <button class="btn btn-solid btn-lg btn-block" type="submit" data-save>${entry ? "Save changes" : "Save entry"}</button>
          ${entry ? `<button class="btn btn-quiet btn-block" type="button" data-delete>${icon("trash")}Delete entry</button>` : ""}
        </div>
      </form>`;

    photos = values.photos || [];
    renderPhotos();
    updateHours();
    wire();
  }

  // ---- validation -------------------------------------------------------------------
  function validate(v) {
    const errs = {};
    if (!v.photos.length) errs.photos = "Add at least one photo.";
    if (mode === "other" && !entry?.activityId) {
      if (!v.title) errs.title = "Say what the activity was.";
      if (!v.area) errs.area = "Choose the area it belongs to.";
    }
    if (!v.date) errs.time = "Add the date.";
    else if (v.date > todayIso) errs.time = "The date can't be in the future.";
    else if (!v.start || !v.end) errs.time = "Add the start and end time.";
    else if (hoursBetween(v.start, v.end) === null) errs.time = "The end time must be after the start time.";
    if (!v.did.trim()) errs.did = "Write a line or two about what you did.";
    if (!v.learned.trim()) errs.learned = "Write a line or two about what you learned.";
    return errs;
  }

  function showErrors(errs) {
    root.querySelectorAll("[data-err]").forEach((p) => (p.textContent = errs[p.dataset.err] || ""));
    $("[data-add-photo]")?.classList.toggle("is-invalid", !!errs.photos);
    ["did", "learned", "title", "date", "start", "end"].forEach((n) => {
      const el = root.querySelector(`[name="${n}"]`);
      if (!el) return;
      const key = ["date", "start", "end"].includes(n) ? "time" : n;
      el.setAttribute("aria-invalid", String(!!errs[key]));
    });
    const sum = $("[data-summary]");
    const n = Object.keys(errs).length;
    if (!n) { sum.hidden = true; return; }
    sum.hidden = false;
    sum.innerHTML = `<p><b>${n === 1 ? "One thing is" : `${n} things are`} missing.</b> ${Object.values(errs).join(" ")}</p>`;
    sum.focus();
  }

  // Once errors are showing, clear each one as soon as it's fixed (never add new ones while typing).
  function refreshErrors() {
    const sum = $("[data-summary]");
    if (!sum || sum.hidden) return;
    const now = validate(collect($("[data-form]")));
    const shown = {};
    root.querySelectorAll("[data-err]").forEach((p) => { if (p.textContent && now[p.dataset.err]) shown[p.dataset.err] = now[p.dataset.err]; });
    root.querySelectorAll("[data-err]").forEach((p) => (p.textContent = shown[p.dataset.err] || ""));
    $("[data-add-photo]")?.classList.toggle("is-invalid", !!shown.photos);
    ["did", "learned", "title", "date", "start", "end"].forEach((n) => {
      const el = root.querySelector(`[name="${n}"]`);
      if (el) el.setAttribute("aria-invalid", String(!!shown[["date", "start", "end"].includes(n) ? "time" : n]));
    });
    const n = Object.keys(shown).length;
    if (!n) { sum.hidden = true; return; }
    sum.innerHTML = `<p><b>${n === 1 ? "One thing is" : `${n} things are`} missing.</b> ${Object.values(shown).join(" ")}</p>`;
  }

  // ---- events ------------------------------------------------------------------------
  function wire() {
    const f = $("[data-form]");
    f.addEventListener("input", (e) => {
      if (["start", "end"].includes(e.target.name)) updateHours();
      refreshErrors();
      writeDraft();
    });
    $("[data-photo-input]").addEventListener("change", async (e) => {
      const files = [...e.target.files].slice(0, MAX_PHOTOS - photos.length);
      e.target.value = "";
      const err = root.querySelector('[data-err="photos"]');
      err.textContent = "";
      for (const file of files) {
        try { photos.push({ url: await shrink(file) }); }
        catch { err.textContent = `“${file.name}” couldn't be read. Try a JPG or PNG photo.`; }
      }
      renderPhotos();
      refreshErrors();
      writeDraft();
    });
    $("[data-photo-list]").addEventListener("click", (e) => {
      const b = e.target.closest("[data-remove]");
      if (!b) return;
      photos.splice(Number(b.dataset.remove), 1);
      renderPhotos();
      writeDraft();
      ($("[data-photo-list] [data-remove]") || $("[data-photo-input]")).focus();
    });
    f.addEventListener("submit", save);
    $("[data-delete]")?.addEventListener("click", remove);
  }

  async function save(e) {
    e.preventDefault();
    const f = $("[data-form]");
    const v = collect(f);
    const errs = validate(v);
    showErrors(errs);
    if (Object.keys(errs).length) return;
    const btn = $("[data-save]");
    btn.disabled = true;
    btn.textContent = "Saving…";
    writeDraft();
    try {
      // Upload new photos (data URLs) first; keep ones that already have a URL.
      const uploaded = [];
      for (const p of v.photos) uploaded.push(p.url.startsWith("data:") && !api.isSample ? { url: (await api.uploadPhoto(p.url)).url } : p);
      const saved = await api.saveEntry({
        ...(entry || {}),
        activityId: entry?.activityId ?? activity?.id ?? null,
        area: v.area || entry?.area || activity?.area,
        title: v.title || entry?.title || activity?.title,
        date: v.date, start: v.start, end: v.end,
        did: v.did.trim(), learned: v.learned.trim(),
        photos: uploaded,
      });
      clearDraft();
      location.href = `journal.html?day=${encodeURIComponent(saved.date)}&saved=1`;
    } catch (err) {
      btn.disabled = false;
      btn.textContent = entry ? "Save changes" : "Save entry";
      const sum = $("[data-summary]");
      sum.hidden = false;
      sum.innerHTML = err.status === 0
        ? `<p><b>Couldn't send your entry.</b> It's kept on this phone; press Save again when you're back online.</p>`
        : `<p><b>Couldn't save.</b> ${esc(err.message)} Your entry is kept on this phone.</p>`;
      sum.focus();
    }
  }

  async function remove() {
    if (!window.confirm("Delete this entry and its photos? This can't be undone.")) return;
    try {
      await api.deleteEntry(entry.id);
      clearDraft();
      location.href = `journal.html?day=${encodeURIComponent(entry.date)}&saved=deleted`;
    } catch (err) {
      window.ui.toast(err.message);
    }
  }

  // ---- load --------------------------------------------------------------------------
  async function load() {
    root.innerHTML = `<div class="skeleton-detail"><span></span><span></span><span></span></div>`;
    try {
      let values;
      if (mode === "edit") {
        entry = await api.getEntry(params.get("id"));
        if (entry.activityId) { try { activity = await api.getPastActivity(entry.activityId); } catch { activity = null; } }
        values = { ...entry };
      } else if (mode === "activity") {
        activity = await api.getPastActivity(params.get("activity"));
        values = {
          date: new Date(activity.startsAt).toLocaleDateString("en-CA"),
          start: time(activity.startsAt), end: time(activity.endsAt),
          did: "", learned: "", photos: [],
        };
      } else {
        values = { date: params.get("date") || todayIso, start: "", end: "", did: "", learned: "", photos: [], title: "", area: "" };
      }
      document.title = `${entry ? "Edit entry" : "New entry"} · ${window.APP_CONFIG.appName}`;
      const draft = readDraft();
      render(draft ? { ...values, ...draft } : values, !!draft);
    } catch (err) {
      if (err.status === 401) { location.replace(`signin.html?next=${encodeURIComponent(`entry.html${location.search}`)}`); return; }
      root.innerHTML = `
        <div class="empty empty-error" role="alert">
          <h1 class="h3">${err.status === 404 ? "We couldn't find that" : "Couldn't open the entry"}</h1>
          <p>${esc(err.message)}</p>
          <div class="empty-actions">
            ${err.status === 404 ? "" : `<button type="button" class="btn btn-solid" data-retry>${icon("retry")}Try again</button>`}
            <a class="btn" href="journal.html">Back to Journal</a>
          </div>
        </div>`;
      $("[data-retry]")?.addEventListener("click", load);
    }
  }

  load();
});
