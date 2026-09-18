/* =========================================================
   Anna University, Trichy — Alumni Portal
   REUSABLE COMPONENT BEHAVIOR
   Include after the DOM; no build step required.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ----------
     Button needs [data-nav-toggle="navId"]; the nav element
     needs the matching id and toggles a .is-open class. */
  document.querySelectorAll("[data-nav-toggle]").forEach((btn) => {
    const nav = document.getElementById(btn.dataset.navToggle);
    if (!nav) return;
    btn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  });

  /* ---------- Password show/hide toggle ----------
     Add data-toggle-visibility="inputId" to any button
     placed inside a .input-group next to a password field. */
  document.querySelectorAll("[data-toggle-visibility]").forEach((btn) => {
    const targetId = btn.getAttribute("data-toggle-visibility");
    const input = document.getElementById(targetId);
    if (!input) return;
    btn.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      btn.classList.toggle("is-visible", isHidden);
    });
  });

  /* ---------- Simple required-field + pattern validation ----------
     Add data-validate to a <form>. Fields opt in with
     `required`, `type="email"`, or a custom `data-match="otherId"`
     (handy for confirm-password fields). Errors render into a
     sibling element with class .field-hint inside the same .field. */
  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      let valid = true;

      form.querySelectorAll(".field").forEach((field) => {
        const input = field.querySelector("input, select");
        const hint = field.querySelector(".field-hint");
        if (!input || !hint) return;

        let message = "";

        if (input.hasAttribute("required") && !input.value.trim()) {
          message = "This field is required.";
        } else if (input.type === "email" && input.value && !/^\S+@\S+\.\S+$/.test(input.value)) {
          message = "Enter a valid email address.";
        } else if (input.dataset.match) {
          const other = document.getElementById(input.dataset.match);
          if (other && input.value !== other.value) {
            message = "Passwords don't match.";
          }
        }

        hint.textContent = message;
        field.classList.toggle("has-error", Boolean(message));
        if (message) valid = false;
      });

      if (!valid) e.preventDefault();
    });

    // Clear a field's error as soon as the person edits it.
    form.querySelectorAll(".field input, .field select").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.closest(".field");
        const hint = field && field.querySelector(".field-hint");
        if (hint) hint.textContent = "";
        if (field) field.classList.remove("has-error");
      });
    });
  });

  /* ---------- Password strength meter ----------
     Add [data-strength-for="passwordId"] to a wrapper with
     class="strength-meter" containing 4 <span> bars in
     .strength-meter__bars and a .strength-label element. */
  document.querySelectorAll("[data-strength-for]").forEach((meter) => {
    const input = document.getElementById(meter.dataset.strengthFor);
    const label = meter.querySelector(".strength-label");
    if (!input) return;

    const scoreOf = (value) => {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
      if (/\d/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      return score;
    };
    const labels = ["", "Weak", "Fair", "Good", "Strong"];

    input.addEventListener("input", () => {
      const score = input.value ? Math.max(1, scoreOf(input.value)) : 0;
      meter.dataset.level = String(input.value ? score : 0);
      if (label) label.textContent = input.value ? labels[score] : "";
    });
  });

  /* ---------- User menu dropdown ----------
     Wrap trigger + panel in [data-dropdown]; trigger needs
     [data-dropdown-trigger], panel needs [data-dropdown-panel]. */
  document.querySelectorAll("[data-dropdown]").forEach((wrapper) => {
    const trigger = wrapper.querySelector("[data-dropdown-trigger]");
    const panel = wrapper.querySelector("[data-dropdown-panel]");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        panel.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });
})();
