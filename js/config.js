// Front-end settings. Change these in one place.
window.APP_CONFIG = {
  // Shown in the header and page titles until the team picks a name.
  appName: "Working title",

  // true: use the sample data in js/sample-data.js (no back end needed).
  // false: call the n8n API at apiBaseUrl (see docs/api.md).
  useSampleData: true,

  // The project's Telegram bot, without @. Placeholder until the bot exists.
  botUsername: "your_bot_username",

  // Base URL of the n8n webhooks, without a trailing slash,
  // e.g. "https://your-n8n-host/webhook/c295"
  apiBaseUrl: "",

  // School terms, for the Summary's "This term" range (YYYY-MM-DD, inclusive).
  // PLACEHOLDER dates: replace with RP's real semester dates and remove `placeholder: true`
  // (while it's there, the Summary says "placeholder dates").
  terms: [
    { name: "Semester 1", start: "2026-04-13", end: "2026-09-26", placeholder: true },
    { name: "Semester 2", start: "2026-10-12", end: "2027-03-27", placeholder: true },
  ],

  // After this many milliseconds, loading screens say the server is waking up.
  slowAfterMs: 3500,
};
