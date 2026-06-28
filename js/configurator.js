/* =============================================================
   ATTO — configurator.js
   Apple-style quote builder: base package + add-ons + services.
   Live total (low "from" values, sectors summed), currency
   switch (CHF/EUR), sticky summary, hidden-field sync for form.
   ============================================================= */
(function () {
  const D = window.ATTO_DATA;
  const { t, pkgName, pkgDesc } = window.ATTO_I18N;
  const app = window.ATTO_APP;
  const state = app.state;

  const el = {
    empty:    () => document.getElementById("quoteEmpty"),
    layout:   () => document.getElementById("quoteLayout"),
    base:     () => document.getElementById("quoteBase"),
    addons:   () => document.getElementById("quoteAddons"),
    services: () => document.getElementById("quoteServices"),
    servicesBlock: () => document.getElementById("quoteServicesBlock"),
    rows:     () => document.getElementById("summaryRows"),
    total:    () => document.getElementById("summaryTotal"),
    formSummary: () => document.getElementById("formSummary")
  };

  /* Extra & recurring services only make sense for web work:
     show the block when the base package is a Website/E-commerce
     or when the "Web +" add-on has been added. */
  function servicesApply() {
    const pkg = D.getPackage(state.selectedPackage);
    const webPackage = pkg && pkg.sector === "web";
    return webPackage || state.addons.has("web_plus");
  }
  function updateServicesVisibility() {
    const block = el.servicesBlock();
    if (!block) return;
    const show = servicesApply();
    block.classList.toggle("hidden", !show);
    // Drop any selected services that no longer apply, so the total stays correct.
    if (!show && state.services.size) { state.services.clear(); }
  }

  function unitLabel(unit) {
    if (unit === "month") return t("quote.month");
    if (unit === "year")  return t("quote.year");
    if (unit === "each")  return " " + t("quote.each");
    return "";
  }
  function icon(name) { return `<svg data-lucide="${name}"></svg>`; }

  /* ---- Compute one-off total (CHF) ----------------------- */
  function computeTotal() {
    let total = 0;
    const pkg = state.selectedPackage ? D.getPackage(state.selectedPackage) : null;
    if (pkg) total += pkg.from;
    state.addons.forEach(id => { const a = D.getAddon(id); if (a) total += a.from; });
    state.services.forEach(id => {
      const s = D.getService(id);
      if (s && (s.unit === "once" || s.unit === "each")) total += s.price;
    });
    return total;
  }

  /* ---- Render base package ------------------------------- */
  function renderBase() {
    const pkg = D.getPackage(state.selectedPackage);
    if (!pkg) return;
    const sec = D.SECTORS[pkg.sector];
    el.base().innerHTML = `
      <div class="quote-base-card" style="--sector:${sec.color}">
        <div>
          <div class="quote-base-card__name">${pkgName(pkg.id)}</div>
          <div class="quote-base-card__meta">${t("sec." + pkg.sector + ".name")} · ${pkgDesc(pkg.id)}</div>
        </div>
        <div class="quote-base-card__price">${D.formatPrice(pkg.from, state.currency)}</div>
      </div>`;
  }

  /* ---- Render add-ons (filtered by package sector) ------- */
  function renderAddons() {
    const pkg = D.getPackage(state.selectedPackage);
    const sector = pkg ? pkg.sector : null;
    const list = D.ADDONS.filter(a => !sector || a.sectors.includes(sector));
    el.addons().innerHTML = list.map(a => {
      const on = state.addons.has(a.id);
      return `
      <div class="option" data-on="${on}" data-addon="${a.id}">
        <div class="option__info">
          <div class="option__name">${t("addon." + a.id + ".name")}</div>
          <div class="option__desc">${t("addon." + a.id + ".desc")}</div>
        </div>
        <div class="option__right">
          <span class="option__price">+ ${D.formatPrice(a.from, state.currency)}</span>
          <button class="opt-toggle" type="button" aria-pressed="${on}" aria-label="${on ? t("quote.remove") : t("quote.add")}">
            ${icon(on ? "check" : "plus")}
          </button>
        </div>
      </div>`;
    }).join("");
    el.addons().querySelectorAll("[data-addon]").forEach(row => {
      row.querySelector(".opt-toggle").addEventListener("click", () => {
        const id = row.dataset.addon;
        if (state.addons.has(id)) state.addons.delete(id); else state.addons.add(id);
        renderAddons(); updateServicesVisibility(); renderServices(); updateSummary(true);
      });
    });
    app.renderIcons();
  }

  /* ---- Render extra & recurring services ----------------- */
  function renderServices() {
    el.services().innerHTML = D.SERVICES.map(s => {
      const on = state.services.has(s.id);
      const suffix = unitLabel(s.unit);
      return `
      <div class="option" data-on="${on}" data-service="${s.id}">
        <div class="option__info">
          <div class="option__name">${t("svc." + s.id + ".name")}</div>
        </div>
        <div class="option__right">
          <span class="option__price">${D.formatPrice(s.price, state.currency)}${suffix}</span>
          <button class="opt-toggle" type="button" aria-pressed="${on}" aria-label="${on ? t("quote.remove") : t("quote.add")}">
            ${icon(on ? "check" : "plus")}
          </button>
        </div>
      </div>`;
    }).join("");
    el.services().querySelectorAll("[data-service]").forEach(row => {
      row.querySelector(".opt-toggle").addEventListener("click", () => {
        const id = row.dataset.service;
        if (state.services.has(id)) state.services.delete(id); else state.services.add(id);
        renderServices(); updateSummary(true);
      });
    });
    app.renderIcons();
  }

  /* ---- Summary rows + total ------------------------------ */
  function buildSummaryRows() {
    const rows = [];
    const pkg = D.getPackage(state.selectedPackage);
    if (pkg) {
      const sec = D.SECTORS[pkg.sector];
      rows.push({ color: sec.color, label: pkgName(pkg.id), price: D.formatPrice(pkg.from, state.currency) });
    }
    state.addons.forEach(id => {
      const a = D.getAddon(id);
      if (a) rows.push({ color: null, label: t("addon." + id + ".name"), price: "+ " + D.formatPrice(a.from, state.currency) });
    });
    state.services.forEach(id => {
      const s = D.getService(id);
      if (s) rows.push({ color: null, label: t("svc." + id + ".name"), price: D.formatPrice(s.price, state.currency) + unitLabel(s.unit) });
    });
    return rows;
  }

  function renderSummaryInto(container, rows) {
    if (!rows.length) {
      container.innerHTML = `<div class="summary-empty">${t("quote.empty")}</div>`;
      return;
    }
    container.innerHTML = rows.map(r => `
      <div class="summary-row">
        <span class="summary-row__label">
          ${r.color ? `<span class="summary-row__dot" style="background:${r.color}"></span>` : ""}
          ${r.label}
        </span>
        <span class="summary-row__price">${r.price}</span>
      </div>`).join("");
  }

  function updateSummary(bump) {
    const rows = buildSummaryRows();
    renderSummaryInto(el.rows(), rows);
    renderSummaryInto(el.formSummary(), rows.length ? rows : []);
    if (!rows.length) el.formSummary().innerHTML = `<div class="summary-empty">${t("form.no_quote")}</div>`;

    const total = computeTotal();
    const tEl = el.total();
    tEl.textContent = total > 0 ? D.formatPrice(total, state.currency) : "—";
    if (bump) { tEl.classList.remove("bump"); void tEl.offsetWidth; tEl.classList.add("bump"); }

    syncHiddenFields(total);
  }

  /* ---- Sync hidden form fields --------------------------- */
  function syncHiddenFields(total) {
    const g = (id) => document.getElementById(id);
    const pkg = D.getPackage(state.selectedPackage);
    g("hf-category").value = state.category ? t("cat." + state.category + ".name") : "";
    g("hf-sectors").value = state.sectors.map(s => t("sec." + s + ".name")).join(", ");
    g("hf-package").value = pkg ? `${pkgName(pkg.id)} (${t("sec." + pkg.sector + ".name")})` : "";
    g("hf-addons").value = [...state.addons].map(a => t("addon." + a + ".name")).join(", ");
    g("hf-services").value = [...state.services].map(s => t("svc." + s + ".name")).join(", ");
    g("hf-total").value = total > 0 ? D.formatPrice(total, state.currency) : "";
    g("hf-currency").value = state.currency;
  }

  /* ---- Load a selected package --------------------------- */
  function loadPackage(pkgId) {
    state.selectedPackage = pkgId;
    if (!pkgId) {
      el.layout().classList.add("hidden");
      el.empty().classList.remove("hidden");
      updateSummary(false);
      return;
    }
    el.empty().classList.add("hidden");
    el.layout().classList.remove("hidden");
    renderBase(); renderAddons(); updateServicesVisibility(); renderServices(); updateSummary(true);
  }

  /* ---- Currency switch ----------------------------------- */
  function setCurrency(cur) {
    state.currency = cur;
    document.querySelectorAll("#currencySwitch button").forEach(b =>
      b.setAttribute("aria-current", b.dataset.cur === cur ? "true" : "false"));
    if (state.selectedPackage) { renderBase(); renderAddons(); renderServices(); }
    updateSummary(true);
    document.dispatchEvent(new CustomEvent("atto:currencychange", { detail: { currency: cur } }));
  }

  /* ---- Init ---------------------------------------------- */
  function init() {
    document.querySelectorAll("#currencySwitch button").forEach(b =>
      b.addEventListener("click", () => setCurrency(b.dataset.cur)));

    document.addEventListener("atto:packageselected", (e) => loadPackage(e.detail.pkgId));

    document.addEventListener("atto:langchange", () => {
      if (state.selectedPackage) { renderBase(); renderAddons(); renderServices(); }
      updateSummary(false);
    });

    updateSummary(false);
  }

  window.ATTO_CONFIG = { init, loadPackage, setCurrency };
})();
