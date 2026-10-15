/* Shared behavior for the simple pages (privacy, 404). */
(function () {
  "use strict";
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  var cfg = window.NOTORITE_CONFIG || {};
  var email = typeof cfg.CONTACT_EMAIL === "string" ? cfg.CONTACT_EMAIL.trim() : "";
  var slot = document.querySelector("[data-privacy-email]");
  if (slot && email) {
    var a = slot.querySelector("[data-config-value]");
    a.textContent = email;
    a.href = "mailto:" + email;
    slot.hidden = false;
    var fallback = document.querySelector("[data-privacy-fallback]");
    if (fallback) fallback.hidden = true;
  }
})();
