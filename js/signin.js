// Sign-in page: email + one-time code. The Telegram link signs in on any page via ?token=.
document.addEventListener("DOMContentLoaded", () => {
  const api = window.api;
  const $ = (s) => document.querySelector(s);
  const emailForm = $("[data-email-form]");
  const codeForm = $("[data-code-form]");
  let email = "";

  document.title = `Sign in · ${window.APP_CONFIG.appName}`;
  window.ui.renderHeader({ page: "" });
  $("[data-sample-hint]").hidden = !api.isSample;
  const bot = window.APP_CONFIG.botUsername;
  $("[data-bot-link]").href = `https://t.me/${encodeURIComponent(bot)}`;
  $("[data-bot-handle]").textContent = `@${bot}`;

  const next = (() => {
    const n = new URLSearchParams(location.search).get("next") || "index.html";
    // Only allow returning to pages on this site.
    return /^[a-z-]+\.html(\?.*)?$/i.test(n) ? n : "index.html";
  })();

  if (api.session.get()) location.replace(next);

  function busy(form, on, label) {
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = on;
    if (label) btn.textContent = label;
  }

  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("[data-email-error]");
    email = emailForm.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      err.textContent = "Enter an email address like you@myrp.edu.sg.";
      emailForm.email.setAttribute("aria-invalid", "true");
      emailForm.email.focus();
      return;
    }
    err.textContent = "";
    emailForm.email.removeAttribute("aria-invalid");
    busy(emailForm, true, "Sending…");
    try {
      await api.startEmailSignIn(email);
      $("[data-code-sent]").innerHTML = `We sent a code to <strong>${window.ui.esc(email)}</strong>. It works for 10 minutes.`;
      emailForm.hidden = true;
      codeForm.hidden = false;
      codeForm.code.focus();
    } catch (ex) {
      err.textContent = ex.message;
    } finally {
      busy(emailForm, false, "Email me a sign-in code");
    }
  });

  codeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("[data-code-error]");
    const code = codeForm.code.value.trim();
    if (!/^\d{6}$/.test(code)) {
      err.textContent = "The code has 6 digits.";
      codeForm.code.setAttribute("aria-invalid", "true");
      codeForm.code.focus();
      return;
    }
    busy(codeForm, true, "Signing in…");
    try {
      await api.verifyEmailCode(email, code);
      location.replace(next);
    } catch (ex) {
      err.textContent = ex.message;
      codeForm.code.setAttribute("aria-invalid", "true");
      busy(codeForm, false, "Sign in");
    }
  });

  $("[data-change-email]").addEventListener("click", () => {
    codeForm.hidden = true;
    emailForm.hidden = false;
    codeForm.code.value = "";
    $("[data-code-error]").textContent = "";
    emailForm.email.focus();
  });
});
