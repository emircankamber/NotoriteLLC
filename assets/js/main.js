/* NOTORITE LLC — site behavior. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var cfg = window.NOTORITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function val(key) {
    var v = cfg[key];
    return typeof v === "string" ? v.trim() : "";
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Config-driven contact details (shown only when filled in) ---------- */
  document.querySelectorAll("[data-config-field]").forEach(function (el) {
    var key = el.getAttribute("data-config-field");
    var value = val(key);
    if (!value) return;
    var target = el.querySelector("[data-config-value]");
    if (target) {
      target.textContent = value;
      if (target.tagName === "A") {
        if (key === "CONTACT_EMAIL") target.href = "mailto:" + value;
        if (key === "PHONE") target.href = "tel:" + value.replace(/[^\d+]/g, "");
      }
    }
    el.hidden = false;
  });
  document.querySelectorAll("[data-config-group]").forEach(function (group) {
    if (group.querySelector("[data-config-field]:not([hidden])")) group.hidden = false;
  });

  /* Add known contact fields to the Organization JSON-LD */
  var ld = document.getElementById("org-jsonld");
  if (ld) {
    try {
      var data = JSON.parse(ld.textContent);
      if (val("CONTACT_EMAIL")) data.email = val("CONTACT_EMAIL");
      if (val("PHONE")) data.telephone = val("PHONE");
      if (val("ADDRESS")) data.address = val("ADDRESS").replace(/\s*\n\s*/g, ", ");
      ld.textContent = JSON.stringify(data);
    } catch (e) { /* leave static data as is */ }
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("nav-panel");
  if (toggle && panel) {
    var label = toggle.querySelector(".nav-toggle-label");
    var icon = toggle.querySelector("use");
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
      if (label) label.textContent = open ? "Close" : "Menu";
      if (icon) icon.setAttribute("href", open ? "#i-x" : "#i-menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings that enter together; major elements wait slightly longer
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); });
        var index = Math.max(0, siblings.indexOf(el));
        var step = el.getAttribute("data-reveal") === "major" ? 120 : 80;
        el.style.transitionDelay = Math.min(index * step, 480) + "ms";
        el.classList.add("is-visible");
        el.addEventListener("transitionend", function clear() {
          el.style.transitionDelay = "";
          el.removeEventListener("transitionend", clear);
        });
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Quote form ---------- */
  var form = document.getElementById("quote-form");
  if (!form) return;
  var success = document.getElementById("form-success");
  var statusEl = form.querySelector(".form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.querySelector(".btn-label");
  var catBoxes = form.querySelectorAll('input[name="categories"]');
  var catErr = document.getElementById("f-cats-err");

  /* "Ask about this category" links pre-select the category */
  document.querySelectorAll("[data-category]").forEach(function (link) {
    link.addEventListener("click", function () {
      var box = form.querySelector('input[data-cat="' + link.getAttribute("data-category") + '"]');
      if (!box) return;
      if (success && !success.hidden) resetForm();
      box.checked = true;
      clearError(catErr, null);
      var chip = box.closest(".check");
      if (chip && !reduceMotion) {
        chip.classList.remove("is-flash");
        void chip.offsetWidth;
        chip.classList.add("is-flash");
      }
      setTimeout(function () {
        document.getElementById("f-name").focus({ preventScroll: true });
      }, reduceMotion ? 0 : 600);
    });
  });

  var rules = {
    name: function (v) { return v ? "" : "Please enter your name."; },
    company: function (v) { return v ? "" : "Please enter your company name."; },
    email: function (v) {
      if (!v) return "Please enter your business email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Please enter a valid email address, like name@company.com.";
    },
    phone: function (v) {
      if (!v) return "";
      return /^[+()\d\s.\-]{7,}$/.test(v) ? "" : "Please use digits, spaces, +, - or parentheses only.";
    },
    business_type: function (v) { return v ? "" : "Please choose your business type."; }
  };

  function setError(input, errEl, msg) {
    if (input) input.setAttribute("aria-invalid", "true");
    errEl.textContent = msg;
  }
  function clearError(errEl, input) {
    if (input) input.removeAttribute("aria-invalid");
    errEl.textContent = "";
  }

  function validateField(name) {
    var input = form.elements[name];
    var errEl = document.getElementById(input.getAttribute("aria-describedby"));
    var msg = rules[name](input.value.trim());
    if (msg) setError(input, errEl, msg); else clearError(errEl, input);
    return !msg;
  }

  function validateCategories() {
    var any = Array.prototype.some.call(catBoxes, function (b) { return b.checked; });
    if (!any) setError(null, catErr, "Please choose at least one category.");
    else clearError(catErr, null);
    return any;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener("blur", function () { if (input.value.trim() || input.hasAttribute("aria-invalid")) validateField(name); });
    input.addEventListener("input", function () { if (input.hasAttribute("aria-invalid")) validateField(name); });
  });
  catBoxes.forEach(function (b) { b.addEventListener("change", function () { if (catErr.textContent) validateCategories(); }); });

  function collect() {
    var cats = Array.prototype.filter.call(catBoxes, function (b) { return b.checked; }).map(function (b) { return b.value; });
    return {
      name: form.elements.name.value.trim(),
      company: form.elements.company.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      business_type: form.elements.business_type.value,
      categories: cats.join(", "),
      quantities: form.elements.quantities.value.trim(),
      message: form.elements.message.value.trim()
    };
  }

  function showSuccess(title, text) {
    success.querySelector(".success-title").textContent = title;
    success.querySelector(".success-text").textContent = text;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  function resetForm() {
    form.reset();
    form.hidden = false;
    success.hidden = true;
    statusEl.textContent = "";
  }

  document.getElementById("form-reset").addEventListener("click", function () {
    resetForm();
    document.getElementById("f-name").focus();
  });

  function buildMailto(d) {
    var subject = "Quote request — " + d.company;
    var lines = [
      "Name: " + d.name,
      "Company: " + d.company,
      "Business email: " + d.email,
      "Phone: " + (d.phone || "—"),
      "Business type: " + d.business_type,
      "Categories of interest: " + d.categories,
      "Quantities or target budget: " + (d.quantities || "—"),
      "",
      "Message:",
      d.message || "—"
    ];
    return "mailto:" + encodeURIComponent(val("CONTACT_EMAIL")) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.textContent = "";

    var ok = true;
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name)) { ok = false; firstBad = firstBad || form.elements[name]; }
    });
    if (!validateCategories()) { ok = false; firstBad = firstBad || catBoxes[0]; }
    if (!ok) { firstBad.focus(); return; }

    // Honeypot filled: pretend success, send nothing
    if (form.elements.website.value) {
      showSuccess("Thank you. Your request is in.", "We will reply by email with pricing and terms.");
      return;
    }

    var d = collect();
    var endpoint = val("FORM_ENDPOINT");

    if (!endpoint) {
      if (!val("CONTACT_EMAIL")) {
        statusEl.textContent = "The quote form is not connected yet. Please try again later.";
        return;
      }
      window.location.href = buildMailto(d);
      showSuccess("Almost done: send the email.", "Your email app should open with your request filled in. Press send there to complete it.");
      return;
    }

    var payload = Object.assign({}, cfg.FORM_EXTRA_FIELDS || {}, d, {
      subject: "Quote request — " + d.company,
      from_name: "NOTORITE website"
    });

    submitBtn.disabled = true;
    submitLabel.textContent = "Sending…";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      showSuccess("Thank you. Your request is in.", "We will reply by email with pricing and terms.");
    }).catch(function () {
      statusEl.textContent = val("CONTACT_EMAIL")
        ? "Your request could not be sent. Please try again, or email " + val("CONTACT_EMAIL") + "."
        : "Your request could not be sent. Please try again in a moment.";
    }).finally(function () {
      submitBtn.disabled = false;
      submitLabel.textContent = "Send quote request";
    });
  });
})();
