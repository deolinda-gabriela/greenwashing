(function () {
  "use strict";

  const toggle = document.querySelector("#accessibilityToggle");
  const panel = document.querySelector("#accessibilityPanel");
  const contrast = document.querySelector("#a11yContrast");

  function closePanel() {
    if (!panel) return;
    panel.hidden = true;
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.focus();
  }

  toggle?.addEventListener("click", () => {
    const open = panel?.hidden !== false;
    if (panel) panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || panel?.hidden !== false) return;
    closePanel();
  });

  document.addEventListener("click", (event) => {
    if (panel?.hidden !== false) return;
    if (event.target.closest("#accessibilityPanel, #accessibilityToggle")) return;
    closePanel();
  });

  contrast?.addEventListener("click", () => {
    const active = document.documentElement.classList.toggle("high-contrast");
    contrast.setAttribute("aria-pressed", String(active));
    try { localStorage.setItem("gw-contrast", active ? "1" : "0"); } catch { /* ignore */ }
  });

  try {
    if (localStorage.getItem("gw-contrast") === "1") {
      document.documentElement.classList.add("high-contrast");
      contrast?.setAttribute("aria-pressed", "true");
    }
  } catch { /* ignore */ }
})();
