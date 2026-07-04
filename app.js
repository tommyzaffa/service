/* ===================================================================
   ATTO — engine condiviso v2 (redesign 2026-07)
   Dipende da js/i18n.js (window.ATTO_I18N) e, dove serve,
   js/data.js (window.ATTO_DATA).
   Gestisce: i18n + switch lingua, switch valuta, reveal on
   scroll, anno footer, render team (about).
   Navigazione: nessun menu — la home è l'unico hub, le
   sottopagine hanno solo "Torna alla home". Nessun effetto
   decorativo.
   =================================================================== */
(function () {
  "use strict";
  var I = window.ATTO_I18N;
  var D = window.ATTO_DATA || null;

  /* ---------- icone servizi (line-art, si "disegnano" in hover) ----------
     pathLength="1" permette l'animazione stroke-dashoffset in CSS. */
  var SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ICONS = {
    branding:
      SVG_OPEN +
      '<path pathLength="1" d="M15.7 6.4 4.3 17.8 2 22l4.2-2.3L17.6 8.3"/>' +
      '<path pathLength="1" d="M14.5 4.5 19.5 9.5 22 7 17 2z"/>' +
      '<circle pathLength="1" cx="6.8" cy="17.2" r="1.4"/></svg>',
    web:
      SVG_OPEN +
      '<rect pathLength="1" x="2" y="4" width="20" height="14" rx="2"/>' +
      '<path pathLength="1" d="M2 8h20"/>' +
      '<path pathLength="1" d="M5 6.1h.01M7.5 6.1h.01M10 6.1h.01"/>' +
      '<path pathLength="1" d="M8 21h8M12 18v3"/></svg>',
    social:
      SVG_OPEN +
      '<circle pathLength="1" cx="18" cy="5" r="2.6"/>' +
      '<circle pathLength="1" cx="6" cy="12" r="2.6"/>' +
      '<circle pathLength="1" cx="18" cy="19" r="2.6"/>' +
      '<path pathLength="1" d="M8.4 13.3l7.2 4.2M15.6 6.5 8.4 10.7"/></svg>',
    video:
      SVG_OPEN +
      '<rect pathLength="1" x="2" y="6" width="14" height="12" rx="2"/>' +
      '<path pathLength="1" d="m22 8-6 4 6 4V8Z"/></svg>',
    podcast:
      SVG_OPEN +
      '<rect pathLength="1" x="9" y="2" width="6" height="12" rx="3"/>' +
      '<path pathLength="1" d="M19 10v1a7 7 0 0 1-14 0v-1"/>' +
      '<path pathLength="1" d="M12 18v4M8 22h8"/></svg>',
    personal:
      SVG_OPEN +
      '<circle pathLength="1" cx="12" cy="7" r="4"/>' +
      '<path pathLength="1" d="M5 21v-1a7 7 0 0 1 14 0v1"/></svg>',
    sport:
      SVG_OPEN +
      '<path pathLength="1" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>' +
      '<path pathLength="1" d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>' +
      '<path pathLength="1" d="M6 2h12v7a6 6 0 0 1-12 0V2Z"/>' +
      '<path pathLength="1" d="M12 15v3M8 22h8M12 18c-2.5 0-3 2-3 4M12 18c2.5 0 3 2 3 4"/></svg>',
    artist:
      SVG_OPEN +
      '<path pathLength="1" d="M9 18V5l12-2v13"/>' +
      '<circle pathLength="1" cx="6" cy="18" r="3"/>' +
      '<circle pathLength="1" cx="18" cy="16" r="3"/></svg>'
  };

  /* ---------- valuta (condivisa tra pagine) ---------- */
  var CURRENCY_KEY = "atto-currency";
  function getCurrency() {
    try {
      var c = localStorage.getItem(CURRENCY_KEY);
      if (c === "CHF" || c === "EUR") return c;
    } catch (e) {}
    return "CHF";
  }
  function setCurrency(code) {
    try { localStorage.setItem(CURRENCY_KEY, code); } catch (e) {}
    markCurrencyButtons();
    document.dispatchEvent(new CustomEvent("atto:currencychange", { detail: { currency: code } }));
  }
  function markCurrencyButtons() {
    var cur = getCurrency();
    document.querySelectorAll("[data-currency]").forEach(function (b) {
      b.setAttribute("aria-current", b.dataset.currency === cur ? "true" : "false");
    });
  }
  window.ATTO_APP = { getCurrency: getCurrency, setCurrency: setCurrency };

  document.addEventListener("DOMContentLoaded", function () {
    /* ---------- i18n ---------- */
    if (I) {
      I.apply();
      document.querySelectorAll("[data-lang]").forEach(function (b) {
        b.addEventListener("click", function () { I.setLang(b.dataset.lang); });
      });
    }

    /* ---------- valuta ---------- */
    markCurrencyButtons();
    document.querySelectorAll("[data-currency]").forEach(function (b) {
      b.addEventListener("click", function () { setCurrency(b.dataset.currency); });
    });

    /* ---------- reveal on scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------- anno footer ---------- */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    /* ---------- tiles servizi nell'hero (home) ---------- */
    var grid = document.querySelector("[data-services-grid]");
    if (grid && D) {
      var firstRender = true;
      var renderTiles = function () {
        var cur = getCurrency();
        grid.innerHTML = D.SERVICES.map(function (s, i) {
          var min = Infinity;
          s.lines.forEach(function (l) {
            l.packages.forEach(function (p) { if (p.from < min) min = p.from; });
          });
          return (
            '<a class="tile' + (firstRender ? " anim-rise" : "") + '" href="service.html?id=' + s.id + '" style="--d:' + (0.25 + i * 0.06) + 's">' +
              '<span class="tile-icon">' + (ICONS[s.id] || "") + "</span>" +
              '<span class="tile-name">' + (window.ATTO_CT ? window.ATTO_CT(s.name) : s.name) + "</span>" +
              '<span class="tile-from">' + (I ? I.t("svc.from") : "da") + " " + D.formatPrice(min, cur) + "</span>" +
              '<span class="tile-arrow" aria-hidden="true">→</span>' +
            "</a>"
          );
        }).join("");
        firstRender = false;
      };
      renderTiles();
      document.addEventListener("atto:langchange", renderTiles);
      document.addEventListener("atto:currencychange", renderTiles);
    }

    /* ---------- render team (about) ---------- */
    var teamGrid = document.querySelector("[data-team-grid]");
    if (teamGrid && D && D.TEAM) {
      var renderTeam = function () {
        teamGrid.innerHTML = D.TEAM.map(function (m) {
          var role = window.ATTO_CT ? window.ATTO_CT(m.role) : m.role;
          return (
            '<div class="team-card reveal in">' +
              '<span class="avatar">' + m.initials + "</span>" +
              '<span class="t-name">' + m.name + "</span>" +
              '<span class="t-role">' + role + "</span>" +
            "</div>"
          );
        }).join("");
      };
      renderTeam();
      document.addEventListener("atto:langchange", renderTeam);
    }
  });
})();
