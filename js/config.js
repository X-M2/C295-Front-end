// Front-end settings. Change these in one place.
window.APP_CONFIG = {
  // Shown in the header and page titles until the team picks a name.
  appName: "Working title",

  // true: use the sample data in js/sample-data.js (no back end needed).
  // false: call the n8n API at apiBaseUrl (see docs/api.md).
  useSampleData: true,

  // The project's Telegram bot, without @.
  botUsername: "RPVolunteerBuddyDemoBot",

  // Base URL of the n8n webhooks, without a trailing slash,
  // e.g. "https://your-n8n-host/webhook/c295"
  apiBaseUrl: "",

  // After this many milliseconds, loading screens say the server is waking up.
  slowAfterMs: 3500,
};
