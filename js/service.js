/* ===================================================================
   ATTO — pagina servizio v2 (service.html?id=...)
   Flusso guidato: linea → livello → complementi → riepilogo → form.
   Regole:
   - famiglie add-on mostrate SOLO se compatibili col pacchetto scelto
   - famiglie chiuse di default, si aprono a fisarmonica
   - totali una tantum e ricorrenti separati, CHF/EUR
   - stringhe di catalogo tradotte via window.ATTO_CT (js/catalog-i18n.js)
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

  /* ---------- stato ---------- */
  var state = {
    lineId: service.lines[0].id,
    pkgId: null,
    sel: {},   // famId -> { items:{id:true} } | { active:true } | { tier:id }
    open: {}   // famId -> true (fisarmonica aperta)
  };

  /* ---------- helpers ---------- */
  function t(k) { return I ? I.t(k) : k; }
  function ct(s) { return window.ATTO_CT ? window.ATTO_CT(s) : s; }
  function cur() { return APP ? APP.getCurrency() : "CHF"; }
  function fmt(x) { return D.formatPrice(x, cur()); }
  /* range prezzo con suffisso unità localizzato (/mese, /episodio…) */
  function fmtRange(p) {
    var s = D.formatRange(p, cur());
    if (p.unit === "month") return s.replace("/mese", t("quote.permonth"));
    if (p.unit === "episode") return s.replace("/episodio", t("quote.perepisode"));
    return s;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function getLine() {
    return service.lines.find(function (l) { return l.id === state.lineId; }) || service.lines[0];
  }
  function getPkg() {
    if (!state.pkgId) return null;
    var line = getLine();
    return line.packages.find(function (p) { return p.id === state.pkgId; }) || null;
  }
  function itemPriceLabel(it) {
    var s = "";
    if (it.from) s += t("svc.from") + " ";
    if (it.approx) s += "~";
    s += fmt(it.price);
    if (it.unit === "month") s += t("quote.permonth");
    else if (it.suffix) s += ct(it.suffix);
    else if (it.unit === "each") s += t("quote.each");
    return s;
  }
  function scrollToEl(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- riferimenti DOM ---------- */
  var $name = document.querySelector("[data-service-name]");
  var $tagline = document.querySelector("[data-service-tagline]");
  var $lines = document.querySelector("[data-line-cards]");
  var $lineBlock = document.getElementById("step-line");
  var $tiers = document.querySelector("[data-tier-cards]");
  var $fams = document.querySelector("[data-addon-families]");
  var $rows = document.querySelector("[data-quote-rows]");
  var $steps = document.querySelectorAll("[data-step-ind]");

  document.title = service.name + " — Atto";

  /* =================================================
     RENDER
     ================================================= */
  function renderHead() {
    if ($name) $name.textContent = ct(service.name);
    if ($tagline) $tagline.textContent = ct(service.tagline || "");
  }

  function renderSteps() {
    var stage = state.pkgId ? "addons" : "tier";
    var order = ["line", "tier", "addons", "summary"];
    var stageIx = order.indexOf(stage);
    $steps.forEach(function (el) {
      var ix = order.indexOf(el.dataset.stepInd);
      el.classList.toggle("done", ix < stageIx);
      el.classList.toggle("active", ix === stageIx);
    });
  }

  function renderLines() {
    if (!$lines) return;
    if (service.lines.length < 2) {
      if ($lineBlock) $lineBlock.style.display = "none";
      return;
    }
    $lines.innerHTML = service.lines.map(function (l) {
      var lo = Infinity;
      l.packages.forEach(function (p) { if (p.from < lo) lo = p.from; });
      return (
        '<button type="button" class="line-card" data-line="' + l.id + '" aria-pressed="' + (l.id === state.lineId) + '">' +
          '<span class="line-name">' + esc(ct(l.name)) + "</span>" +
          '<span class="line-sub">' + t("svc.from") + " " + fmt(lo) + " · " + l.packages.length + " " + t("svc.packages") + "</span>" +
        "</button>"
      );
    }).join("");
    $lines.querySelectorAll("[data-line]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (state.lineId === b.dataset.line) return;
        state.lineId = b.dataset.line;
        state.pkgId = null;
        state.sel = {};
        state.open = {};
        animateTiers = true;
        renderAll();
        scrollToEl("step-tier");
      });
    });
  }

  var animateTiers = true; /* anima solo al primo render / cambio linea */
  function renderTiers() {
    if (!$tiers) return;
    var line = getLine();
    $tiers.innerHTML = line.packages.map(function (p, i) {
      var selected = p.id === state.pkgId;
      var hl = (p.highlights || []).map(function (h) { return "<li>" + esc(ct(h)) + "</li>"; }).join("");
      return (
        '<article class="tier-card' + (selected ? " selected" : "") + (animateTiers ? " anim-rise" : "") + '" style="--d:' + (i * 0.07) + 's">' +
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
    }).join("");
    animateTiers = false;
    $tiers.querySelectorAll("[data-pkg]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (state.pkgId !== b.dataset.pkg) {
          state.pkgId = b.dataset.pkg;
          state.sel = {};
          state.open = {};
          renderAll();
          scrollToEl("step-addons");
        }
      });
    });
  }

  /* ---- famiglie add-on ---- */
  function famSelection(famId) {
    if (!state.sel[famId]) {
      var fam = D.getFamily(famId);
      state.sel[famId] = fam.type === "items" ? { items: {} } :
                         fam.type === "block" ? { active: false } : { tier: null };
    }
    return state.sel[famId];
  }
  function famSelectedCount(fam) {
    var s = state.sel[fam.id];
    if (!s) return 0;
    if (fam.type === "items") return Object.keys(s.items).filter(function (k) { return s.items[k]; }).length;
    if (fam.type === "block") return s.active ? 1 : 0;
    return s.tier ? 1 : 0;
  }
  function renderAddons() {
    if (!$fams) return;
    var pkg = getPkg();
    if (!pkg) {
      $fams.innerHTML = '<div class="addons-empty">' + t("quote.empty") + "</div>";
      return;
    }
    var famIds = pkg.addons || [];
    if (!famIds.length) {
      $fams.innerHTML = '<div class="addons-empty">' + t("srv.addons.none") + "</div>";
      return;
    }
    $fams.innerHTML = famIds.map(function (famId, fi) {
      var fam = D.getFamily(famId);
      if (!fam) return "";
      var count = famSelectedCount(fam);
      var open = !!state.open[famId];
      var body = "";

      if (fam.type === "items") {
        var sel = famSelection(famId);
        body += fam.items.map(function (it) {
          if (it.section) return '<p class="fam-section">' + esc(ct(it.section)) + "</p>";
          var checked = !!sel.items[it.id];
          return (
            '<label class="addon-item">' +
              '<input type="checkbox" data-fam="' + famId + '" data-item="' + it.id + '"' + (checked ? " checked" : "") + " />" +
              '<span class="ai-name">' + esc(ct(it.name)) + (it.note ? ' <span class="ai-unit">(' + esc(ct(it.note)) + ")</span>" : "") + "</span>" +
              '<span class="ai-price">' + itemPriceLabel(it) + "</span>" +
            "</label>"
          );
        }).join("");
      } else if (fam.type === "block") {
        var sb = famSelection(famId);
        body += '<p class="fam-note">' + t("srv.included") + ": " + esc((fam.feats || []).map(ct).join(" · ")) + "</p>";
        body += (
          '<label class="addon-item">' +
            '<input type="checkbox" data-block="' + famId + '"' + (sb.active ? " checked" : "") + " />" +
            '<span class="ai-name">' + esc(ct(fam.label)) + "</span>" +
            '<span class="ai-price">' + (fam.from ? t("svc.from") + " " : "") + fmt(fam.price) + "</span>" +
          "</label>"
        );
      } else { /* tiers */
        var st = famSelection(famId);
        body += fam.tiers.map(function (tr) {
          var checked = st.tier === tr.id;
          return (
            '<label class="addon-item">' +
              '<input type="checkbox" data-famtier="' + famId + '" data-tier="' + tr.id + '"' + (checked ? " checked" : "") + " />" +
              '<span class="ai-name">' + esc(ct(tr.name)) +
                ' <span class="ai-unit">' + esc((tr.feats || []).map(ct).join(" · ")) + "</span></span>" +
              '<span class="ai-price">' + (tr.from ? t("svc.from") + " " : "") + fmt(tr.price) + "</span>" +
            "</label>"
          );
        }).join("");
      }

      return (
        '<div class="addon-family anim-rise' + (open ? " open" : "") + (count ? " has-selection" : "") + '" data-family="' + famId + '" style="--d:' + (fi * 0.06) + 's">' +
          '<button type="button" class="fam-head" data-famhead="' + famId + '" aria-expanded="' + open + '">' +
            '<span class="fam-name">' + esc(ct(fam.label)) + "</span>" +
            '<span class="fam-count"' + (count ? "" : ' style="display:none"') + ">" + count + "</span>" +
            '<span class="fam-chevron">▾</span>' +
          "</button>" +
          '<div class="fam-body"><div class="fam-inner">' + body + "</div></div>" +
        "</div>"
      );
    }).join("");

    /* --- aggiornamenti in place (niente re-render: le transizioni vivono) --- */
    function refreshFamily(famId) {
      var box = $fams.querySelector('[data-family="' + famId + '"]');
      if (!box) return;
      var fam = D.getFamily(famId);
      var count = famSelectedCount(fam);
      var badge = box.querySelector(".fam-count");
      if (badge) {
        badge.textContent = count;
        badge.style.display = count ? "" : "none";
      }
      box.classList.toggle("has-selection", count > 0);
    }

    /* eventi */
    $fams.querySelectorAll("[data-famhead]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.dataset.famhead;
        state.open[id] = !state.open[id];
        var box = $fams.querySelector('[data-family="' + id + '"]');
        if (box) box.classList.toggle("open", state.open[id]);
        b.setAttribute("aria-expanded", String(!!state.open[id]));
      });
    });
    $fams.querySelectorAll("input[data-item]").forEach(function (c) {
      c.addEventListener("change", function () {
        var sel = famSelection(c.dataset.fam);
        sel.items[c.dataset.item] = c.checked;
        refreshFamily(c.dataset.fam);
        renderQuote();
      });
    });
    $fams.querySelectorAll("input[data-block]").forEach(function (c) {
      c.addEventListener("change", function () {
        famSelection(c.dataset.block).active = c.checked;
        refreshFamily(c.dataset.block);
        renderQuote();
      });
    });
    $fams.querySelectorAll("input[data-famtier]").forEach(function (c) {
      c.addEventListener("change", function () {
        var famId = c.dataset.famtier;
        var sel = famSelection(famId);
        sel.tier = c.checked ? c.dataset.tier : null;
        $fams.querySelectorAll('input[data-famtier="' + famId + '"]').forEach(function (box) {
          if (box !== c) box.checked = false;
        });
        refreshFamily(famId);
        renderQuote();
      });
    });
  }

  /* =================================================
     CALCOLO E RIEPILOGO
     ================================================= */
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

    /* add-on */
    (pkg.addons || []).forEach(function (famId) {
      var fam = D.getFamily(famId);
      var s = state.sel[famId];
      if (!fam || !s) return;

      if (fam.type === "items") {
        var chosen = fam.items.filter(function (it) { return !it.section && s.items[it.id]; });
        if (!chosen.length) return;
        var famOnce = 0, famMonthly = 0;
        chosen.forEach(function (it) {
          if (it.unit === "month") famMonthly += it.price;
          else famOnce += it.price;
        });
        out.once += famOnce;
        out.monthly += famMonthly;
        var val = [];
        if (famOnce) val.push(fmt(famOnce));
        if (famMonthly) val.push(fmt(famMonthly) + t("quote.permonth"));
        out.lines.push({
          label: ct(fam.label),
          sub: chosen.length + " × " + chosen.map(function (it) { return ct(it.name); }).slice(0, 3).join(", ") + (chosen.length > 3 ? "…" : ""),
          val: val.join(" + ")
        });
      } else if (fam.type === "block" && s.active) {
        out.once += fam.price;
        out.lines.push({ label: ct(fam.label), sub: (fam.feats || []).slice(0, 3).map(ct).join(", ") + "…", val: t("svc.from") + " " + fmt(fam.price) });
      } else if (fam.type === "tiers" && s.tier) {
        var tr = fam.tiers.find(function (x) { return x.id === s.tier; });
        if (tr) {
          out.once += tr.price;
          out.lines.push({ label: ct(tr.name), sub: ct(fam.label), val: (tr.from ? t("svc.from") + " " : "") + fmt(tr.price) });
        }
      }
    });

    return out;
  }

  function renderQuote() {
    if (!$rows) return;
    var q = compute();
    if (!q) {
      $rows.innerHTML = '<p class="quote-empty">' + t("quote.empty") + "</p>";
      syncHiddenFields(null);
      renderSteps();
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
    renderSteps();
  }

  /* =================================================
     FORM
     ================================================= */
  function summaryText(q) {
    var out = [];
    out.push("Servizio: " + service.name);
    out.push("Pacchetto: " + q.base.label + " (" + q.base.sub + ")");
    q.lines.forEach(function (r) { out.push("Add-on: " + r.label + " — " + r.sub + " — " + r.val); });
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
  function renderAll() {
    renderHead();
    renderLines();
    renderTiers();
    renderAddons();
    renderQuote();
  }
  document.addEventListener("DOMContentLoaded", renderAll);
  document.addEventListener("atto:langchange", renderAll);
  document.addEventListener("atto:currencychange", renderAll);
})();
