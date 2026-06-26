/* =============================================================
   ATTO — flow.js
   The 3-question flow: who → category → sectors → packages.
   Filters via MATRIX. Selecting a package hands off to the
   configurator (custom event "atto:packageselected").
   ============================================================= */
(function () {
  const D = window.ATTO_DATA;
  const { t, pkgName, pkgDesc } = window.ATTO_I18N;
  const app = window.ATTO_APP;
  const state = app.state;

  const TOTAL_STEPS = 3;
  let current = 1;

  /* ---- helpers ------------------------------------------- */
  function icon(name) { return `<svg data-lucide="${name}"></svg>`; }
  function check() { return `<span class="choice__check">${icon("check")}</span>`; }

  function setStep(n) {
    current = n;
    document.querySelectorAll(".flow-step").forEach(s => {
      s.classList.toggle("active", Number(s.dataset.step) === n);
    });
    const shown = Math.min(n, TOTAL_STEPS);
    const fill = document.getElementById("flowFill");
    const label = document.getElementById("flowStepLabel");
    fill.style.width = (shown / TOTAL_STEPS * 100) + "%";
    label.textContent = `${t("flow.step")} ${shown} ${t("flow.of")} ${TOTAL_STEPS}`;
    document.getElementById("flowProgress").style.display = n > TOTAL_STEPS ? "none" : "";
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
    grid.querySelectorAll("[data-who]").forEach(b => {
      b.addEventListener("click", () => {
        state.who = b.dataset.who;
        state.category = null; state.sectors = [];
        renderStep1(); renderStep2();
        setStep(2);
      });
    });
  }

  /* ---- Step 2: category ---------------------------------- */
  function renderStep2() {
    const grid = document.getElementById("step2Grid");
    if (!state.who) { grid.innerHTML = ""; return; }
    const cats = Object.values(D.CATEGORIES).filter(c =>
      state.who === "business" ? c.type === "business" : c.type === "private"
    );
    grid.innerHTML = cats.map(c => `
      <button class="choice" type="button" data-cat="${c.id}" aria-pressed="${state.category === c.id}">
        <span class="choice__title">${t("cat." + c.id + ".name")}</span>
        <span class="choice__desc">${t("cat." + c.id + ".desc")}</span>
        ${check()}
      </button>`).join("");
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

  /* ---- Step 3: sectors (multi) --------------------------- */
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
    grid.querySelectorAll("[data-sector]").forEach(b => {
      b.addEventListener("click", () => {
        const sid = b.dataset.sector;
        const i = state.sectors.indexOf(sid);
        if (i >= 0) state.sectors.splice(i, 1); else state.sectors.push(sid);
        b.setAttribute("aria-pressed", state.sectors.includes(sid));
      });
    });
    app.renderIcons();
  }

  /* ---- Result: packages grouped by sector ---------------- */
  function renderResult() {
    const wrap = document.getElementById("resultGroups");
    if (!state.sectors.length) {
      wrap.innerHTML = `<div class="result-empty">${t("flow.result.empty")}</div>`;
      return;
    }
    wrap.innerHTML = state.sectors.map(sid => {
      const sec = D.SECTORS[sid];
      const pkgs = D.PACKAGES[sid] || [];
      const cards = pkgs.map(p => `
        <button class="pkg-card" type="button" data-pkg="${p.id}"
                aria-pressed="${state.selectedPackage === p.id}" style="--sector:${sec.color}">
          <span class="pkg-card__name">${pkgName(p.id)}</span>
          <span class="pkg-card__desc">${pkgDesc(p.id)}</span>
          <span class="pkg-card__price">
            <span class="pkg-card__from">${t("flow.from")}</span>
            <span class="pkg-card__amount">${D.formatPrice(p.from, state.currency)}</span>
          </span>
          <span class="pkg-card__cta">
            <span>${t("flow.configure")}</span>
          </span>
        </button>`).join("");
      return `
      <div class="result-group" style="--sector:${sec.color}">
        <div class="result-group__head">
          <span class="result-group__dot"></span>
          <span class="result-group__title">${t("sec." + sid + ".name")}</span>
        </div>
        <div class="pkg-grid">${cards}</div>
      </div>`;
    }).join("");

    wrap.querySelectorAll("[data-pkg]").forEach(b => {
      b.addEventListener("click", () => {
        state.selectedPackage = b.dataset.pkg;
        wrap.querySelectorAll("[data-pkg]").forEach(x =>
          x.setAttribute("aria-pressed", x.dataset.pkg === state.selectedPackage));
        document.dispatchEvent(new CustomEvent("atto:packageselected", { detail: { pkgId: b.dataset.pkg } }));
        document.getElementById("quote").scrollIntoView({ behavior: "smooth" });
      });
    });
    app.renderIcons();
  }

  /* ---- Navigation ---------------------------------------- */
  function back() {
    if (current === 4) { setStep(3); return; }
    if (current > 1) setStep(current - 1);
  }

  function restart() {
    state.who = null; state.category = null; state.sectors = [];
    state.selectedPackage = null; state.addons.clear(); state.services.clear();
    renderStep1();
    document.getElementById("step2Grid").innerHTML = "";
    document.getElementById("step3Grid").innerHTML = "";
    setStep(1);
    document.dispatchEvent(new CustomEvent("atto:packageselected", { detail: { pkgId: null } }));
    document.getElementById("flow").scrollIntoView({ behavior: "smooth" });
  }

  /* ---- Init ---------------------------------------------- */
  function init() {
    renderStep1();
    setStep(1);
    document.querySelectorAll("[data-flow-back]").forEach(b => b.addEventListener("click", back));
    document.getElementById("flowSeeResults").addEventListener("click", () => {
      renderResult(); setStep(4);
    });
    document.getElementById("flowRestart").addEventListener("click", restart);

    // Re-render visible dynamic content on language/currency change
    document.addEventListener("atto:langchange", () => {
      renderStep1(); renderStep2(); renderStep3();
      if (current === 4) renderResult();
      setStep(current);
    });
    document.addEventListener("atto:currencychange", () => {
      if (current === 4) renderResult();
    });
  }

  window.ATTO_FLOW = { init };
})();
