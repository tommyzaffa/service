/* =============================================================
   ATTO — main.js
   Bootstraps modules, builds team + portfolio, wires the
   Formspree submission with graceful states.
   ============================================================= */
(function () {
  const D = window.ATTO_DATA;
  const { t } = window.ATTO_I18N;
  const app = window.ATTO_APP;
  const state = app.state;

  /* ---- Team (About) -------------------------------------- */
  function renderTeam() {
    const grid = document.getElementById("teamGrid");
    grid.innerHTML = D.TEAM.map(m => `
      <div class="team-card reveal">
        <div class="team-card__avatar">${m.initials}</div>
        <div class="team-card__name" data-team-name="${m.id}">${memberName(m.id)}</div>
        <div class="team-card__role">${t("about.role." + m.id)}</div>
      </div>`).join("");
    app.observeReveal(grid);
  }
  function memberName(id) {
    const names = {
      macchi: "D. Macchi", cirrincione: "D. Cirrincione", benedetti: 'F. Benedetti "Fedone"',
      zaffalon: 'T. Zaffalon "Tommy"', agueci: "M. Agueci", martina: "Martina"
    };
    return names[id] || id;
  }

  /* ---- Portfolio (placeholders by sector) ---------------- */
  function renderWork() {
    const grid = document.getElementById("workGrid");
    const featured = ["web", "branding", "social", "video_events", "podcast", "artist"];
    grid.innerHTML = featured.map((sid, i) => {
      const sec = D.SECTORS[sid];
      return `
      <div class="work-card reveal" style="--sector:${sec.color}" data-delay="${(i % 4)}">
        <span class="work-card__tag">${t("sec." + sid + ".name")}</span>
        <div>
          <div class="work-card__num">0${i + 1}</div>
          <div class="work-card__ph">${t("work.placeholder")}</div>
        </div>
      </div>`;
    }).join("");
    app.observeReveal(grid);
  }

  /* ---- Re-render i18n-dependent dynamic content ---------- */
  function refreshDynamic() {
    document.querySelectorAll("[data-team-name]").forEach(elm => {
      elm.textContent = memberName(elm.getAttribute("data-team-name"));
    });
    // roles + work tags refresh via re-render
    renderTeam(); renderWork();
    app.renderIcons();
  }

  /* ---- Formspree form ------------------------------------ */
  function initForm() {
    const form = document.getElementById("contactForm");
    const statusEl = document.getElementById("formStatus");
    const submitBtn = document.getElementById("formSubmit");
    const submitLabel = submitBtn.querySelector("span");

    function showStatus(kind, msgKey) {
      statusEl.className = "form-status show " + (kind === "ok" ? "form-status--ok" : "form-status--err");
      statusEl.textContent = t(msgKey);
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("f-email");
      const privacy = document.getElementById("f-privacy");
      if (!email.value || !privacy.checked) {
        showStatus("err", "form.required");
        return;
      }

      const action = form.getAttribute("action");
      if (action.includes("[FORMSPREE_FORM_ID]")) {
        // Endpoint not configured yet — show success-style notice for demo.
        showStatus("ok", "form.success");
        console.warn("[Atto] Formspree endpoint not set. Replace [FORMSPREE_FORM_ID] in index.html.");
        return;
      }

      submitBtn.disabled = true;
      submitLabel.textContent = t("form.sending");
      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (res.ok) {
          form.reset();
          showStatus("ok", "form.success");
        } else {
          showStatus("err", "form.error");
        }
      } catch (err) {
        showStatus("err", "form.error");
      } finally {
        submitBtn.disabled = false;
        submitLabel.textContent = t("form.submit");
      }
    });

    // Preselect language dropdown to current site language
    document.addEventListener("atto:langchange", () => {
      const map = { en: "English", it: "Italiano", de: "Deutsch", fr: "Français" };
      const sel = document.getElementById("f-lang");
      if (sel && map[state.lang]) sel.value = map[state.lang];
    });
  }

  /* ---- Boot ---------------------------------------------- */
  function boot() {
    window.ATTO_UI.init();
    window.ATTO_FLOW.init();
    window.ATTO_CONFIG.init();
    renderTeam();
    renderWork();
    initForm();
    app.renderIcons();

    document.addEventListener("atto:langchange", refreshDynamic);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Re-run icon creation once Lucide's deferred script has loaded
  window.addEventListener("load", () => app.renderIcons());
})();
