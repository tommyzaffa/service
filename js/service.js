/* ===================================================================
   ATTO — pagina servizio v3 (service.html?id=...)
   Wizard a step singoli: chi sei → (linea via wizard) → livello →
   complementi a bundle → form. Un passo alla volta, con indietro.
   Regole:
   - le risposte del wizard indirizzano linea e livello consigliato,
     ma tutti i pacchetti restano visibili e selezionabili
   - add-on solo a "gruppetti" (bundle) con prezzo unico
     (= somma voci −10%, già precalcolato in js/data.js)
   - famiglie exclusive → al massimo un bundle
   - totali una tantum e ricorrenti separati, CHF/EUR
   - stringhe di catalogo tradotte via window.ATTO_CT
   =================================================================== */
(function () {
  "use strict";
  var D = window.ATTO_DATA;
  var I = window.ATTO_I18N;
  var APP = window.ATTO_APP;
  if (!D) return;

  /* ---------- servizio dalla query string ---------- */
  var params = new URLSearchParams(location.search);
  var service = D.getService(params.get("id"));
  if (!service) { location.replace("index.html#servizi"); return; }

  /* ---------- sequenza step ---------- */
  var wizardQs = service.wizard || [];
  var steps = wizardQs.map(function (q) { return { type: "wizard", q: q }; });
  steps.push({ type: "tier" });
  steps.push({ type: "addons" });
  steps.push({ type: "form" });

  /* ---------- stato ---------- */
  var state = {
    ix: 0,
    answers: {},                       // qid -> optionId
    lineId: service.lines[0].id,
    recTier: null,                     // tier consigliato ("Start"/"Pro"/…)
    pkgId: null,
    sel: {}                            // famId -> { bundleId: true }
  };

  /* ---------- helpers ---------- */
  function t(k) { return I ? I.t(k) : k; }
  function ct(s) { return window.ATTO_CT ? window.ATTO_CT(s) : s; }
  function cur() { return APP ? APP.getCurrency() : "CHF"; }
  function fmt(x) { return D.formatPrice(x, cur()); }
  function fmtRange(p) {
    var s = D.formatRange(p, cur());
    if (p.unit === "month") return s.replace("/mese", t("quote.permonth"));
    if (p.unit === "episode") return s.replace("/episodio", t("quote.perepisode"));
    return s;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function applyAnswers() {
    state.lineId = service.lines[0].id;
    state.recTier = null;
    wizardQs.forEach(function (q) {
      var optId = state.answers[q.id];
      if (!optId) return;
      var opt = q.options.find(function (o) { return o.id === optId; });
      if (!opt) return;
      if (opt.line) state.lineId = opt.line;
      if (opt.tier) state.recTier = opt.tier;
    });
  }
  function getLine() {
    return service.lines.find(function (l) { return l.id === state.lineId; }) || service.lines[0];
  }
  function getPkg() {
    if (!state.pkgId) return null;
    return getLine().packages.find(function (p) { return p.id === state.pkgId; }) || null;
  }
  function bundlePriceLabel(b) {
    var s = "";
    if (b.from) s += t("svc.from") + " ";
    if (b.approx) s += "~";
    if (b.monthly) s += fmt(b.monthly) + t("quote.permonth");
    else s += fmt(b.once);
    return s;
  }

  /* ---------- riferimenti DOM ---------- */
  var $name = document.querySelector("[data-service-name]");
  var $tagline = document.querySelector("[data-service-tagline]");
  var $flow = document.querySelector("[data-flow-steps]");
  var $wiz = document.querySelector("[data-wizard]");
  var $formBlock = document.getElementById("step-form");
  var $rows = document.querySelector("[data-quote-rows]");
  var $panelCta = document.querySelector("[data-quote-panel] .btn");

  document.title = service.name + " — Atto";

  function renderHead() {
    if ($name) $name.textContent = ct(service.name);
    if ($tagline) $tagline.textContent = ct(service.tagline || "");
  }

  /* =================================================
     INDICATORE DI PERCORSO
     ================================================= */
  function stepLabel(s) {
    if (s.type === "wizard") return ct(s.q.question).replace(/\s*\?$/, "");
    if (s.type === "tier") return t("srv.step.tier");
    if (s.type === "addons") return t("srv.step.addons");
    return t("srv.step.summary");
  }
  function renderFlowSteps() {
    if (!$flow) return;
    $flow.innerHTML = steps.map(function (s, i) {
      var cls = i < state.ix ? "done" : i === state.ix ? "active" : "";
      return '<span class="' + cls + '" data-goto="' + i + '" role="button">' + esc(stepLabel(s)) + "</span>";
    }).join("");
    $flow.querySelectorAll("[data-goto]").forEach(function (el) {
      el.addEventListener("click", function () {
        var ix = +el.dataset.goto;
        if (ix < state.ix) go(ix);
      });
    });
  }

  /* =================================================
     NAVIGAZIONE
     ================================================= */
  function go(ix) {
    state.ix = Math.max(0, Math.min(ix, steps.length - 1));
    renderStep();
    var hero = document.querySelector("[data-flow-steps]");
    if (hero) {
      var top = hero.getBoundingClientRect().top + window.scrollY - 80;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    }
  }
  function backBtnHtml() {
    if (state.ix === 0) return "";
    return (
      '<button type="button" class="wiz-back" data-wiz-back>' +
        '<span aria-hidden="true">←</span>&nbsp;' + t("srv.back") +
      "</button>"
    );
  }
  function bindBack() {
    var b = $wiz.querySelector("[data-wiz-back]");
    if (b) b.addEventListener("click", function () { go(state.ix - 1); });
  }

  /* =================================================
     STEP: WIZARD (chi sei / che tipo)
     ================================================= */
  function renderWizardStep(q) {
    var chosen = state.answers[q.id] || null;
    $wiz.innerHTML =
      backBtnHtml() +
      '<section class="step-block step-anim">' +
        '<p class="kicker">' + esc(ct(service.name)) + "</p>" +
        '<h2 class="step-question">' + esc(ct(q.question)) + "</h2>" +
        '<p class="step-hint">' + t("srv.wizard.hint") + "</p>" +
        '<div class="opt-cards">' +
          q.options.map(function (o, i) {
            return (
              '<button type="button" class="opt-card anim-rise" style="--d:' + (i * 0.06) + 's" data-opt="' + o.id + '" aria-pressed="' + (o.id === chosen) + '">' +
                '<span class="opt-label">' + esc(ct(o.label)) + "</span>" +
                (o.desc ? '<span class="opt-desc">' + esc(ct(o.desc)) + "</span>" : "") +
                '<span class="opt-arrow" aria-hidden="true">→</span>' +
              "</button>"
            );
          }).join("") +
        "</div>" +
      "</section>";
    bindBack();
    $wiz.querySelectorAll("[data-opt]").forEach(function (b) {
      b.addEventListener("click", function () {
        var changed = state.answers[q.id] !== b.dataset.opt;
        state.answers[q.id] = b.dataset.opt;
        if (changed) { state.pkgId = null; state.sel = {}; }
        go(state.ix + 1);
      });
    });
  }

  /* =================================================
     STEP: LIVELLO (tutti visibili, consigliato evidenziato)
     ================================================= */
  function renderTierStep() {
    applyAnswers();
    var line = getLine();
    var hint = state.recTier ? t("srv.tier.reco.hint") : t("srv.tier.hint");
    $wiz.innerHTML =
      backBtnHtml() +
      '<section class="step-block step-anim">' +
        '<p class="kicker">' + t("srv.step.tier") + "</p>" +
        (service.lines.length > 1 ? '<h2 class="step-question">' + esc(ct(line.name)) + "</h2>" : "") +
        '<p class="step-hint">' + hint + "</p>" +
        '<div class="tier-cards">' +
          line.packages.map(function (p, i) {
            var selected = p.id === state.pkgId;
            var reco = state.recTier && p.tier === state.recTier;
            var hl = (p.highlights || []).map(function (h) { return "<li>" + esc(ct(h)) + "</li>"; }).join("");
            return (
              '<article class="tier-card anim-rise' + (selected ? " selected" : "") + (reco ? " recommended" : "") + '" style="--d:' + (i * 0.07) + 's">' +
                (reco ? '<span class="tier-reco">' + t("srv.recommended") + "</span>" : "") +
                '<span class="tier-tag">' + esc(p.tier) + "</span>" +
                "<h3>" + esc(ct(p.name)) + (p.proposed ? '<span class="tag-proposed" title="' + t("srv.proposed") + '">*</span>' : "") + "</h3>" +
                '<p class="tier-price">' + fmtRange(p) + "</p>" +
                '<p class="tier-unit">' +
                  (p.minUnits ? t("srv.min.episodes") : (p.unit === "month" ? t("quote.monthly") : t("quote.once"))) +
                  (p.proposed ? " · * " + t("srv.proposed") : "") +
                "</p>" +
                "<ul>" + hl + "</ul>" +
                '<button type="button" class="btn' + (selected ? " btn-pine" : " btn-ghost") + '" data-pkg="' + p.id + '">' +
                  (selected ? t("srv.selected") : t("srv.select")) +
                "</button>" +
              "</article>"
            );
          }).join("") +
        "</div>" +
      "</section>";
    bindBack();
    $wiz.querySelectorAll("[data-pkg]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (state.pkgId !== b.dataset.pkg) { state.pkgId = b.dataset.pkg; state.sel = {}; }
        go(state.ix + 1);
      });
    });
  }

  /* =================================================
     STEP: COMPLEMENTI A BUNDLE
     ================================================= */
  function isBundleSelected(famId, bundleId) {
    return !!(state.sel[famId] && state.sel[famId][bundleId]);
  }
  function toggleBundle(fam, bundleId) {
    if (!state.sel[fam.id]) state.sel[fam.id] = {};
    var on = !state.sel[fam.id][bundleId];
    if (fam.exclusive) state.sel[fam.id] = {};
    state.sel[fam.id][bundleId] = on;
    if (!on) delete state.sel[fam.id][bundleId];
  }
  function renderAddonStep() {
    applyAnswers();
    var pkg = getPkg();
    if (!pkg) { go(steps.length - 3); return; } /* torna al tier */
    var famIds = (pkg.addons || []).filter(function (id) { return D.getFamily(id); });
    var body;
    if (!famIds.length) {
      body = '<div class="addons-empty">' + t("srv.addons.none") + "</div>";
    } else {
      body = famIds.map(function (famId, fi) {
        var fam = D.getFamily(famId);
        return (
          '<div class="bundle-group anim-rise" style="--d:' + (fi * 0.06) + 's">' +
            '<p class="bundle-fam">' + esc(ct(fam.label)) +
              (fam.exclusive ? ' <span class="bundle-excl">' + t("srv.exclusive") + "</span>" : "") +
            "</p>" +
            '<div class="bundle-cards">' +
              fam.bundles.map(function (b) {
                var on = isBundleSelected(famId, b.id);
                return (
                  '<button type="button" class="bundle-card" data-fam="' + famId + '" data-bundle="' + b.id + '" aria-pressed="' + on + '">' +
                    '<span class="b-check" aria-hidden="true"></span>' +
                    '<span class="b-main">' +
                      '<span class="b-name">' + esc(ct(b.name)) + "</span>" +
                      '<span class="b-items">' + esc(b.items.map(ct).join(" · ")) + "</span>" +
                      (b.note ? '<span class="b-note">' + esc(ct(b.note)) + "</span>" : "") +
                    "</span>" +
                    '<span class="b-price">' + bundlePriceLabel(b) + "</span>" +
                  "</button>"
                );
              }).join("") +
            "</div>" +
          "</div>"
        );
      }).join("");
    }
    $wiz.innerHTML =
      backBtnHtml() +
      '<section class="step-block step-anim">' +
        '<p class="kicker">' + t("srv.step.addons") + "</p>" +
        '<h2 class="step-question">' + t("srv.addons.title") + "</h2>" +
        '<p class="step-hint">' + t("srv.addons.hint") + "</p>" +
        body +
        '<p class="wiz-actions"><button type="button" class="btn btn-pine" data-continue>' + t("srv.continue") + "</button></p>" +
      "</section>";
    bindBack();
    $wiz.querySelectorAll("[data-bundle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var fam = D.getFamily(b.dataset.fam);
        toggleBundle(fam, b.dataset.bundle);
        /* aggiorna in place, senza re-render (le transizioni vivono) */
        if (fam.exclusive) {
          $wiz.querySelectorAll('[data-fam="' + fam.id + '"]').forEach(function (el) {
            el.setAttribute("aria-pressed", String(isBundleSelected(fam.id, el.dataset.bundle)));
          });
        } else {
          b.setAttribute("aria-pressed", String(isBundleSelected(fam.id, b.dataset.bundle)));
        }
        renderQuote();
      });
    });
    var cont = $wiz.querySelector("[data-continue]");
    if (cont) cont.addEventListener("click", function () { go(state.ix + 1); });
  }

  /* =================================================
     STEP: FORM (riepilogo + contatti)
     ================================================= */
  function renderFormStep() {
    $wiz.innerHTML = backBtnHtml();
    bindBack();
  }

  /* =================================================
     RENDER STEP CORRENTE
     ================================================= */
  function renderStep() {
    applyAnswers();
    renderHead();
    renderFlowSteps();
    var s = steps[state.ix];
    if ($formBlock) $formBlock.hidden = s.type !== "form";
    if (s.type === "wizard") renderWizardStep(s.q);
    else if (s.type === "tier") renderTierStep();
    else if (s.type === "addons") renderAddonStep();
    else renderFormStep();
    renderQuote();
  }

  /* =================================================
     CALCOLO E RIEPILOGO
     ================================================= */
  function personaLines() {
    var out = [];
    wizardQs.forEach(function (q) {
      var optId = state.answers[q.id];
      if (!optId) return;
      var opt = q.options.find(function (o) { return o.id === optId; });
      if (opt) out.push({ q: q.question, a: opt.label });
    });
    return out;
  }
  function compute() {
    var pkg = getPkg();
    if (!pkg) return null;
    var out = { pkg: pkg, once: 0, monthly: 0, lines: [] };

    /* base */
    var base = { label: ct(pkg.name), sub: fmtRange(pkg), val: "" };
    if (pkg.unit === "month") {
      out.monthly += pkg.from;
      base.val = t("svc.from") + " " + fmt(pkg.from) + t("quote.permonth");
    } else if (pkg.unit === "episode") {
      var units = pkg.minUnits || 1;
      out.once += pkg.from * units;
      base.val = t("svc.from") + " " + fmt(pkg.from) + t("quote.perepisode");
      base.sub += " · " + t("srv.min.episodes");
    } else {
      out.once += pkg.from;
      base.val = t("svc.from") + " " + fmt(pkg.from);
    }
    out.base = base;

    /* bundle scelti */
    (pkg.addons || []).forEach(function (famId) {
      var fam = D.getFamily(famId);
      var s = state.sel[famId];
      if (!fam || !s) return;
      fam.bundles.forEach(function (b) {
        if (!s[b.id]) return;
        if (b.monthly) out.monthly += b.monthly;
        else out.once += b.once || 0;
        out.lines.push({
          label: ct(fam.label) + " · " + ct(b.name),
          sub: b.items.slice(0, 3).map(ct).join(", ") + (b.items.length > 3 ? "…" : ""),
          val: bundlePriceLabel(b)
        });
      });
    });

    return out;
  }

  function renderQuote() {
    if (!$rows) return;
    var q = compute();
    if (!q) {
      $rows.innerHTML = '<p class="quote-empty">' + t("quote.empty") + "</p>";
      syncHiddenFields(null);
      return;
    }
    var html = "";
    html += '<div class="quote-row"><span class="q-label">' + esc(q.base.label) +
            '<span class="q-sub">' + esc(q.base.sub) + '</span></span><span class="q-val">' + q.base.val + "</span></div>";
    q.lines.forEach(function (r) {
      html += '<div class="quote-row"><span class="q-label">' + esc(r.label) +
              '<span class="q-sub">' + esc(r.sub) + '</span></span><span class="q-val">' + r.val + "</span></div>";
    });
    if (q.once > 0) {
      html += '<div class="quote-row q-total"><span class="q-label">' + t("quote.total.once") + '</span><span class="q-val q-flash">' + fmt(q.once) + "</span></div>";
    }
    if (q.monthly > 0) {
      html += '<div class="quote-row q-total"><span class="q-label">' + t("quote.total.monthly") + '</span><span class="q-val q-flash">' + fmt(q.monthly) + t("quote.permonth") + "</span></div>";
    }
    $rows.innerHTML = html;
    syncHiddenFields(q);
  }

  /* CTA del pannello: porta all'ultimo step, poi al form */
  if ($panelCta) {
    $panelCta.addEventListener("click", function (ev) {
      if (steps[state.ix].type !== "form") {
        ev.preventDefault();
        go(steps.length - 1);
        var f = document.getElementById("step-form");
        if (f) f.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* =================================================
     FORM
     ================================================= */
  function summaryText(q) {
    var out = [];
    out.push("Servizio: " + service.name);
    personaLines().forEach(function (p) { out.push(p.q + " " + p.a); });
    out.push("Pacchetto: " + q.base.label + " (" + q.base.sub + ")");
    q.lines.forEach(function (r) { out.push("Bundle: " + r.label + " — " + r.val); });
    if (q.once > 0) out.push("Totale una tantum (da): " + fmt(q.once));
    if (q.monthly > 0) out.push("Totale mensile (da): " + fmt(q.monthly) + "/mese");
    out.push("Valuta: " + cur());
    return out.join("\n");
  }
  function syncHiddenFields(q) {
    var set = function (selector, value) {
      var el = document.querySelector(selector);
      if (el) el.value = value;
    };
    set("[data-hidden-service]", service.name);
    set("[data-hidden-persona]", personaLines().map(function (p) { return p.a; }).join(" · "));
    set("[data-hidden-package]", q ? q.base.label : "");
    set("[data-hidden-currency]", cur());
    set("[data-hidden-lang]", I ? I.getLang() : "it");
    set("[data-hidden-summary]", q ? summaryText(q) : "");
  }

  var form = document.querySelector("[data-quote-form]");
  var status = document.querySelector("[data-form-status]");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (status) { status.textContent = "…"; status.className = "form-status"; }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          if (status) { status.textContent = t("form.success"); status.className = "form-status ok"; }
          form.reset();
        } else { throw new Error("send failed"); }
      }).catch(function () {
        if (status) { status.textContent = t("form.error"); status.className = "form-status err"; }
      });
    });
  }

  /* =================================================
     BOOT + eventi globali
     ================================================= */
  document.addEventListener("DOMContentLoaded", renderStep);
  document.addEventListener("atto:langchange", renderStep);
  document.addEventListener("atto:currencychange", renderStep);
})();
