/* =============================================================
   ATTO — ui.js
   Theme toggle, language switching, full-screen menu,
   scroll reveal, header state, cookie banner.
   Exposes a tiny shared app state + i18n applier.
   ============================================================= */
(function () {
  const { t, setLang, I18N_STATE } = window.ATTO_I18N;

  /* ---- Shared app state (single source of truth) ---------- */
  const state = {
    who: null,
    category: null,
    sectors: [],
    selectedPackage: null,
    addons: new Set(),
    services: new Set(),
    currency: "CHF",
    get lang() { return I18N_STATE.lang; }
  };
  window.ATTO_APP = { state };

  /* ---- i18n applier --------------------------------------- */
  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.documentElement.lang = I18N_STATE.lang;
    // current language chip
    const cur = document.getElementById("langCurrent");
    if (cur) cur.textContent = I18N_STATE.lang.toUpperCase();
    // language buttons aria-current
    document.querySelectorAll("[data-lang]").forEach(b => {
      b.setAttribute("aria-current", b.dataset.lang === I18N_STATE.lang ? "true" : "false");
    });
  }
  window.ATTO_APP.applyI18n = applyI18n;

  function changeLanguage(lang) {
    setLang(lang);
    applyI18n();
    document.dispatchEvent(new CustomEvent("atto:langchange", { detail: { lang } }));
  }

  /* ---- Build language buttons ----------------------------- */
  function buildLangButtons() {
    const langs = [
      { id: "en", label: "EN" }, { id: "it", label: "IT" },
      { id: "de", label: "DE" }, { id: "fr", label: "FR" }
    ];
    ["footerLangs", "menuLangs"].forEach(containerId => {
      const c = document.getElementById(containerId);
      if (!c) return;
      c.innerHTML = "";
      langs.forEach(l => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.lang = l.id;
        b.textContent = l.label;
        b.addEventListener("click", () => changeLanguage(l.id));
        c.appendChild(b);
      });
    });
  }

  /* ---- Language cycle via header pill --------------------- */
  function cycleLanguage() {
    const order = ["en", "it", "de", "fr"];
    const idx = order.indexOf(I18N_STATE.lang);
    changeLanguage(order[(idx + 1) % order.length]);
  }

  /* ---- Theme --------------------------------------------- */
  function currentTheme() {
    const set = document.documentElement.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyThemeIcon() {
    const dark = currentTheme() === "dark";
    const sun = document.querySelector(".icon-sun");
    const moon = document.querySelector(".icon-moon");
    if (sun && moon) { sun.classList.toggle("hidden", dark); moon.classList.toggle("hidden", !dark); }
  }
  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.body.classList.add("theme-fade");
    setTimeout(() => document.body.classList.remove("theme-fade"), 400);
    applyThemeIcon();
  }

  /* ---- Menu overlay -------------------------------------- */
  function openMenu() {
    const ov = document.getElementById("navOverlay");
    ov.classList.add("open"); ov.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    document.getElementById("menuToggle").setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    const ov = document.getElementById("navOverlay");
    ov.classList.remove("open"); ov.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  /* ---- Scroll reveal ------------------------------------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.14 });
    els.forEach(e => io.observe(e));
  }
  window.ATTO_APP.observeReveal = function (root) {
    (root || document).querySelectorAll(".reveal:not(.in)").forEach(e => e.classList.add("in"));
  };

  /* ---- Header scrolled state ----------------------------- */
  function initHeader() {
    const header = document.getElementById("header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Cookie banner ------------------------------------- */
  function initCookie() {
    const c = document.getElementById("cookie");
    let dismissed = false; // session-only (no storage by design)
    setTimeout(() => { if (!dismissed) c.classList.add("show"); }, 1400);
    document.getElementById("cookieOk").addEventListener("click", () => { dismissed = true; c.classList.remove("show"); });
  }

  /* ---- Smooth nav link + close menu ---------------------- */
  function initNavLinks() {
    document.querySelectorAll("[data-nav-link]").forEach(a => {
      a.addEventListener("click", () => closeMenu());
    });
  }

  /* ---- Lucide icons -------------------------------------- */
  window.ATTO_APP.renderIcons = function () {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  };

  /* ---- Init ---------------------------------------------- */
  function init() {
    buildLangButtons();
    applyI18n();
    applyThemeIcon();
    initHeader();
    initReveal();
    initCookie();
    initNavLinks();

    document.getElementById("themeToggle").addEventListener("click", toggleTheme);
    document.getElementById("langToggle").addEventListener("click", cycleLanguage);
    document.getElementById("menuToggle").addEventListener("click", openMenu);
    document.getElementById("menuClose").addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  window.ATTO_UI = { init, closeMenu, changeLanguage };
})();
