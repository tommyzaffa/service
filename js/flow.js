/* =============================================================
   ATTO — flow.js
   Full wizard, one screen at a time (no page scroll):
   who → category → sector → packages → configurator → form.
   Single selection throughout. Filters via MATRIX. Selecting a
   package hands off to the configurator (custom event
   "atto:packageselected") and advances to its screen.
   ============================================================= */
(function () {
  const D = window.ATTO_DATA;
  const { t, pkgName, pkgDesc, pkgFeatures } = window.ATTO_I18N;
  const app = window.ATTO_APP;
  const state = app.state;

  const TOTAL_STEPS = 6;
  let current = 1;

  /* ---- helpers ------------------------------------------- */
  function icon(name) { return `<svg data-lucide="${name}"></svg>`; }
  // Each service family has a "soul": its own colour + typographic/shape identity.
  // data-soul drives the per-category styling of the package cards (see style.css).
  function soulOf(sid) {
    if (sid === "web") return { soul: "web", c: "#2E6E6E" };
    if (sid === "branding") return { soul: "graphic", c: "#B5552B" };
    if (sid === "social") return { soul: "social", c: "#3A5A8C" };
    if (sid === "podcast") return { soul: "podcast", c: "#C0492F" };
    if (sid.indexOf("video") === 0) return { soul: "video", c: "#A33159" };
    return { soul: "generic", c: (D.SECTORS[sid] || {}).color || "#2F7E72" };
  }
  function check() { return `<span class="choice__check">${icon("check")}</span>`; }
  // Centre the last row: 1-3 → n cols, 4 → 2, 5-6 → 3, 7-8 → 4, else 4.
  function balance(grid) {
    if (!grid) return;
    const n = grid.children.length;
    const cols = n <= 3 ? Math.max(n, 1) : n === 4 ? 2 : n <= 6 ? 3 : 4;
    grid.style.setProperty("--cols", cols);
  }

  function setStep(n) {
    current = n;
    document.querySelectorAll(".flow-step").forEach(s => {
      s.classList.toggle("active", Number(s.dataset.step) === n);
    });
    const fill = document.getElementById("flowFill");
    const label = document.getElementById("flowStepLabel");
    fill.style.width = (n / TOTAL_STEPS * 100) + "%";
    label.textContent = `${t("flow.step")} ${n} ${t("flow.of")} ${TOTAL_STEPS}`;
    document.getElementById("flow").scrollIntoView({ block: "start" });
    app.renderIcons();
  }

  /* ---- Step 1: who --------------------------------------- */
  function renderStep1() {
    const grid = document.getElementById("step1Grid");
    const opts = [
      { id: "private",  icon: "user",      titleKey: "who.private",  descKey: "who.private.desc" },
      { id: "business", icon: "building-2", titleKey: "who.business", descKey: "who.business.desc" }
    ];
    grid.innerHTML = opts.map(o => `
      <button class="choice" type="button" data-who="${o.id}" aria-pressed="${state.who === o.id}">
        <span class="choice__icon">${icon(o.icon)}</span>
        <span class="choice__title">${t(o.titleKey)}</span>
        <span class="choice__desc">${t(o.descKey)}</span>
        ${check()}
      </button>`).join("");
    balance(grid);
    grid.querySelectorAll("[data-who]").forEach(b => {
      b.addEventListener("click", () => {
        state.who = b.dataset.who;
        state.category = null; state.sectors = [];
        renderStep1(); renderStep2();
        setStep(2);
      });
    });
  }

  /* ---- Step 2: category (single) ------------------------- */
  function renderStep2() {
    const grid = document.getElementById("step2Grid");
    if (!state.who) { grid.innerHTML = ""; return; }
    const cats = Object.values(D.CATEGORIES).filter(c =>
      state.who === "business" ? c.type === "business" : c.type === "private"
    );
    grid.innerHTML = cats.map(c => `
      <button class="choice" type="button" data-cat="${c.id}" aria-pressed="${state.category === c.id}">
        <span class="choice__icon">${icon(c.icon)}</span>
        <span class="choice__title">${t("cat." + c.id + ".name")}</span>
        <span class="choice__desc">${t("cat." + c.id + ".desc")}</span>
        ${check()}
      </button>`).join("");
    balance(grid);
    grid.querySelectorAll("[data-cat]").forEach(b => {
      b.addEventListener("click", () => {
        state.category = b.dataset.cat;
        state.sectors = [];
        renderStep2(); renderStep3();
        setStep(3);
      });
    });
    app.renderIcons();
  }

  /* ---- Step 3: sector (single) --------------------------- */
  function renderStep3() {
    const grid = document.getElementById("step3Grid");
    if (!state.category) { grid.innerHTML = ""; return; }
    const sectorIds = D.MATRIX[state.category] || [];
    grid.innerHTML = sectorIds.map(sid => {
      const sec = D.SECTORS[sid];
      const on = state.sectors.includes(sid);
      return `
      <button class="choice" type="button" data-sector="${sid}" aria-pressed="${on}" style="--sector:${sec.color}">
        <span class="choice__icon">${icon(sec.icon)}</span>
        <span class="choice__title">${t("sec." + sid + ".name")}</span>
        <span class="choice__desc">${t("sec." + sid + ".desc")}</span>
        ${check()}
      </button>`;
    }).join("");
    balance(grid);
    grid.querySelectorAll("[data-sector]").forEach(b => {
      b.addEventListener("click", () => {
        // Single selection: pick exactly one area, then see packages.
        state.sectors = [b.dataset.sector];
        renderResult();
        setStep(4);
      });
    });
    app.renderIcons();
  }

  /* ---- Step 4: packages for the chosen sector ------------ */
  function renderResult() {
    const wrap = document.getElementById("resultGroups");
    if (!state.sectors.length) {
      wrap.innerHTML = `<div class="result-empty">${t("flow.result.empty")}</div>`;
      return;
    }
    const sid = state.sectors[0];
    const sec = D.SECTORS[sid];
    const soul = soulOf(sid);
    const pkgs = D.PACKAGES[sid] || [];
    const cards = pkgs.map(p => {
      const feats = pkgFeatures(p.id);
      const featList = feats.length
        ? `<ul class="pkg-card__feats">${feats.map(f => `<li>${f}</li>`).join("")}</ul>`
        : "";
      return `
      <button class="pkg-card" type="button" data-pkg="${p.id}" data-soul="${soul.soul}"
              aria-pressed="${state.selectedPackage === p.id}" style="--sector:${soul.c}">
        <span class="pkg-card__name">${pkgName(p.id)}</span>
        <span class="pkg-card__desc">${pkgDesc(p.id)}</span>
        ${featList}
        <span class="pkg-card__price">
          <span class="pkg-card__from">${t("flow.from")}</span>
          <span class="pkg-card__amount">${D.formatPrice(p.from, state.currency)}</span>
        </span>
        <span class="pkg-card__cta">
          <span>${t("flow.configure")}</span>
        </span>
      </button>`;
    }).join("");
    wrap.innerHTML = `
      <div class="result-group" data-soul="${soul.soul}" style="--sector:${soul.c}">
        <div class="result-group__head">
          <span class="result-group__dot"></span>
          <span class="result-group__title">${t("sec." + sid + ".name")}</span>
        </div>
        <div class="pkg-grid">${cards}</div>
      </div>`;
    balance(wrap.querySelector(".pkg-grid"));

    wrap.querySelectorAll("[data-pkg]").forEach(b => {
      b.addEventListener("click", () => {
        state.selectedPackage = b.dataset.pkg;
        document.dispatchEvent(new CustomEvent("atto:packageselected", { detail: { pkgId: b.dataset.pkg } }));
        setStep(5);
      });
    });
    app.renderIcons();
  }

  /* ---- Navigation ---------------------------------------- */
  function back() {
    if (current > 1) setStep(current - 1);
  }

  function restart() {
    state.who = null; state.category = null; state.sectors = [];
    state.selectedPackage = null; state.addons.clear(); state.services.clear();
    renderStep1();
    document.getElementById("step2Grid").innerHTML = "";
    document.getElementById("step3Grid").innerHTML = "";
    document.dispatchEvent(new CustomEvent("atto:packageselected", { detail: { pkgId: null } }));
    setStep(1);
  }

  /* ---- Init ---------------------------------------------- */
  function init() {
    renderStep1();
    setStep(1);
    document.querySelectorAll("[data-flow-back]").forEach(b => b.addEventListener("click", back));
    document.getElementById("flowRestart").addEventListener("click", restart);

    // Configurator → contact form
    const cont = document.getElementById("quoteContinue");
    if (cont) cont.addEventListener("click", () => setStep(6));

    // Re-render visible dynamic content on language/currency change
    document.addEventListener("atto:langchange", () => {
      renderStep1(); renderStep2(); renderStep3();
      if (state.sectors.length) renderResult();
      setStep(current);
    });
    document.addEventListener("atto:currencychange", () => {
      if (state.sectors.length) renderResult();
    });
  }

  window.ATTO_FLOW = { init };
})();
