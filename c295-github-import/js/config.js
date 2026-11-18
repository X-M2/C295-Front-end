// Front-end settings. Change these in one place.
window.APP_CONFIG = {
  // Shown in the header and page titles until the team picks a name.
  appName: "Working title",

  // Where activities come from:
  //   "sample": the made-up data in js/sample-data.js
  //   "static": data/activities.json, rebuilt every day by GitHub Actions
  //             (.github/workflows/import-activities.yml). Browse only: joining and sign-in are off.
  //   "api":    the n8n API at apiBaseUrl (see docs/api.md)
  dataSource: "static",

  // Used when dataSource is "static". Relative to the site, so it works on GitHub Pages and localhost.
  staticDataUrl: "data/activities.json",

  // Kept for older code: true means the same as dataSource "sample".
  useSampleData: false,

  // The project's Telegram bot, without @. Placeholder until the bot exists.
  botUsername: "your_bot_username",

  // Base URL of the n8n webhooks, without a trailing slash,
  // e.g. "https://your-n8n-host/webhook/c295"
  apiBaseUrl: "",

  // After this many milliseconds, loading screens say the server is waking up.
  slowAfterMs: 3500,
};
