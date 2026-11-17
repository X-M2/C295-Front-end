// The only file that talks to the back end.
// With useSampleData on, it answers from js/sample-data.js and stores joins in this browser.
// With it off, it calls the n8n endpoints described in docs/api.md.
// Every function returns a Promise and throws an ApiError on failure.
(function () {
  const cfg = window.APP_CONFIG;
  const SESSION_KEY = "c295.session";
  const JOINED_KEY = "c295.sample.joined";

  class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }

  // ---- session (both modes) ---------------------------------------------

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode: session lasts this page only */ }
  }

  const session = {
    get() { return readJSON(SESSION_KEY, null); },
    set(s) { writeJSON(SESSION_KEY, s); },
    clear() { try { localStorage.removeItem(SESSION_KEY); } catch {} },
  };

  // ---- test switches: ?simulate=slow | error | empty ----------------------
  const simulate = new URLSearchParams(location.search).get("simulate");

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function sample(fn) {
    await wait(simulate === "slow" ? 6000 : 350);
    if (simulate === "error") throw new ApiError("Couldn't reach the server.", 503);
    return fn();
  }

  // ---- real API -----------------------------------------------------------

  async function request(path, { method = "GET", body } = {}) {
    if (!cfg.apiBaseUrl) throw new ApiError("The API address isn't set in js/config.js.", 0);
    const headers = { "Content-Type": "application/json" };
    const s = session.get();
    if (s?.token) headers.Authorization = `Bearer ${s.token}`;
    let res;
    try {
      res = await fetch(cfg.apiBaseUrl + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    } catch {
      throw new ApiError("Couldn't reach the server. Check your connection and try again.", 0);
    }
    let data = null;
    try { data = await res.json(); } catch { /* empty body */ }
    if (!res.ok) throw new ApiError(data?.message || `The server answered with an error (${res.status}).`, res.status);
    return data;
  }

  // ---- sample-mode state ----------------------------------------------------

  const joinedIds = () => new Set(readJSON(JOINED_KEY, []));
  function withViewer(a) {
    const s = session.get();
    const joined = !!s && joinedIds().has(a.id);
    const copy = { ...a, joined, spotsTaken: a.spotsTaken + (joined ? 1 : 0) };
    // Signed-out visitors only get a count, never names (PDPA).
    if (!s) copy.friendsGoing = [];
    return copy;
  }

  // ---- public API ------------------------------------------------------------

  const api = {
    ApiError,
    session,
    isSample: cfg.useSampleData,

    async listActivities() {
      if (cfg.useSampleData) {
        return sample(() => (simulate === "empty" ? [] : window.SAMPLE_DATA.activities.map(withViewer)));
      }
      return (await request("/activities")).activities;
    },

    async getActivity(id) {
      if (cfg.useSampleData) {
        return sample(() => {
          const a = window.SAMPLE_DATA.activities.find((x) => x.id === id);
          if (!a) throw new ApiError("This activity doesn't exist or was removed.", 404);
          return withViewer(a);
        });
      }
      return (await request(`/activities/${encodeURIComponent(id)}`)).activity;
    },

    async join(id) {
      if (cfg.useSampleData) {
        return sample(() => {
          const a = window.SAMPLE_DATA.activities.find((x) => x.id === id);
          const current = withViewer(a);
          if (new Date(current.signupClosesAt) < new Date()) throw new ApiError("Sign-up for this activity has closed.", 409);
          if (current.spotsTaken >= current.spotsTotal) throw new ApiError("Sorry, this activity just filled up.", 409);
          const ids = joinedIds(); ids.add(id); writeJSON(JOINED_KEY, [...ids]);
          return withViewer(a);
        });
      }
      return (await request(`/activities/${encodeURIComponent(id)}/join`, { method: "POST" })).activity;
    },

    async leave(id) {
      if (cfg.useSampleData) {
        return sample(() => {
          const ids = joinedIds(); ids.delete(id); writeJSON(JOINED_KEY, [...ids]);
          return withViewer(window.SAMPLE_DATA.activities.find((x) => x.id === id));
        });
      }
      return (await request(`/activities/${encodeURIComponent(id)}/leave`, { method: "POST" })).activity;
    },

    async startEmailSignIn(email) {
      if (cfg.useSampleData) return sample(() => ({ sent: true }));
      return request("/auth/email/start", { method: "POST", body: { email } });
    },

    async verifyEmailCode(email, code) {
      if (cfg.useSampleData) {
        return sample(() => {
          if (code.trim() !== window.SAMPLE_DATA.signInCode) throw new ApiError("That code isn't right. Check the latest email and try again.", 401);
          const s = { ...window.SAMPLE_DATA.student, email, token: "sample" };
          session.set(s);
          return s;
        });
      }
      const data = await request("/auth/email/verify", { method: "POST", body: { email, code } });
      session.set({ ...data.student, token: data.token });
      return data.student;
    },

    // The Telegram bot's personal link opens the site with ?token=...
    async signInWithToken(token) {
      if (cfg.useSampleData) {
        return sample(() => {
          const s = { ...window.SAMPLE_DATA.student, token: "sample" };
          session.set(s);
          return s;
        });
      }
      const data = await request("/auth/token", { method: "POST", body: { token } });
      session.set({ ...data.student, token: data.token });
      return data.student;
    },

    signOut() { session.clear(); },
  };

  window.api = api;
})();
