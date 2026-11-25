// Front-end settings. Change these in one place.
window.APP_CONFIG = {
  // Shown in the header and page titles until the team picks a name.
  appName: "Working title",

  // true: use the sample data in js/sample-data.js (no back end needed).
  // false: call the n8n API at apiBaseUrl (see docs/api.md).
  useSampleData: true,

  // Real activities scraped by the n8n workflow (committed daily to data/activities.json).
  // Set this to "" to go back to the made-up activities in js/sample-data.js.
  // Joining, sign-in and the Journal still use sample mode until the n8n API exists.
  activitiesUrl: "data/activities.json",

  // The project's Telegram bot, without @.
  botUsername: "RPVolunteerBuddyDemoBot",

  // Base URL of the n8n webhooks, without a trailing slash,
  // e.g. "https://your-n8n-host/webhook/c295"
  apiBaseUrl: "",

  // After this many milliseconds, loading screens say the server is waking up.
  slowAfterMs: 3500,
};
