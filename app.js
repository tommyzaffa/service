/* ===================================================================
   ATTO — concept shared engine (motion direction, multi-page)
   Depends on ../js/data.js (window.ATTO_DATA) + ../js/i18n.js (window.ATTO_I18N).
   Handles: i18n + language switch, custom cursor, per-page interactive
   background, overlay menu, kinetic title, marquee, floating photos,
   scroll reveals, work/team/member renders, and the quote wizard.
   =================================================================== */
(function () {
  "use strict";
  const D = window.ATTO_DATA;
  const I = window.ATTO_I18N;

  /* ============ concept-only copy (en + it + de + fr) ===== */
  const CC = {
    en: {
      "cc.nav.home": "Home",
      "cc.nav.studio": "Studio",
      "cc.brand.tag": "Ideas in action",
      "cc.lead.tag": "Branding, web, video &amp; content<br>for those who want to <b>truly stand out</b>.",
      "cc.lead.build": "Build the project",
      "cc.lead.work": "See the work",
      "cc.mani.1": "We give", "cc.mani.2": "form", "cc.mani.3": "to ideas.",
      "cc.mani.sub": "Brand, web, video and content for those who want to <b>truly stand out</b>. Answer three questions and we build your project together.",
      "cc.svc.tag": "Services",
      "cc.svc.title": "Everything you need<br>to <em>really be there</em>.",
      "cc.svc.1.n": "Branding &amp; Identity", "cc.svc.1.d": "Logo, visual system, guidelines",
      "cc.svc.2.n": "Web design &amp; build", "cc.svc.2.d": "Sites, e-commerce, experiences",
      "cc.svc.3.n": "Photo &amp; Video", "cc.svc.3.d": "Reels, spots, portrait, events",
      "cc.svc.4.n": "Social &amp; content", "cc.svc.4.d": "Strategy, editorial plans",
      "cc.svc.5.n": "Photography", "cc.svc.5.d": "Portrait, product, events",
      "cc.svc.6.n": "Podcast", "cc.svc.6.d": "Format, recording, post",
      "cc.svc.ai.n": "AI &amp; innovation", "cc.svc.ai.d": "Generative tools, automation, custom flows",
      "cc.svc.by": "Led by",
      "cc.studio.tag": "Studio",
      "cc.studio.txt": "A small creative collective in Switzerland. We turn ideas into <em>brands that last</em> — with care, rhythm and a small obsession for detail.",
      "cc.studio.base": "Based in", "cc.studio.basev": "Lugano · Zürich",
      "cc.studio.found": "Founded", "cc.studio.team": "Team", "cc.studio.teamv": "6 people",
      "cc.studio.langs": "Languages",
      "cc.reel.title": "Selected<br>work",
      "cc.reel.sub": "Hover each project<br>to watch it take colour.",
      "cc.cta.1": "Let's start", "cc.cta.2": "your <em>atto</em>.",
      "cc.cta.btn": "Build the project →",
      "cc.work.tag": "Selected work",
      "cc.work.title": "Proof,<br>not <em>promises</em>.",
      "cc.work.sub": "A few projects across branding, web, social, video and more. Real work, real results.",
      "cc.about.tag": "The studio",
      "cc.about.title": "A young team<br>that <em>gets it done</em>.",
      "cc.contact.tag": "Get in touch",
      "cc.contact.title": "Let's<br><em>talk</em>.",
      "cc.contact.sub": "Tell us about your project. We reply fast — in your language.",
      "cc.foot.rights": "All rights reserved"
    },
    it: {
      "cc.nav.home": "Home",
      "cc.nav.studio": "Studio",
      "cc.brand.tag": "Idee in azione",
      "cc.lead.tag": "Branding, web, video &amp; contenuti<br>per chi vuole <b>distinguersi davvero</b>.",
      "cc.lead.build": "Costruisci il progetto",
      "cc.lead.work": "Guarda i lavori",
      "cc.mani.1": "Diamo", "cc.mani.2": "forma", "cc.mani.3": "alle idee.",
      "cc.mani.sub": "Brand, web, video e contenuti per chi vuole <b>distinguersi davvero</b>. Rispondi a tre domande e costruiamo il tuo progetto insieme.",
      "cc.svc.tag": "Servizi",
      "cc.svc.title": "Tutto quello che serve<br>per <em>esserci davvero</em>.",
      "cc.svc.1.n": "Branding &amp; Identity", "cc.svc.1.d": "Logo, sistema visivo, linee guida",
      "cc.svc.2.n": "Web design &amp; sviluppo", "cc.svc.2.d": "Siti, e-commerce, esperienze",
      "cc.svc.3.n": "Foto &amp; Video", "cc.svc.3.d": "Reel, spot, ritratti, eventi",
      "cc.svc.4.n": "Social &amp; contenuti", "cc.svc.4.d": "Strategia, piani editoriali",
      "cc.svc.5.n": "Fotografia", "cc.svc.5.d": "Ritratti, prodotto, eventi",
      "cc.svc.6.n": "Podcast", "cc.svc.6.d": "Format, registrazione, post",
      "cc.svc.ai.n": "AI &amp; innovazione", "cc.svc.ai.d": "Strumenti generativi, automazioni, flussi su misura",
      "cc.svc.by": "A cura di",
      "cc.studio.tag": "Studio",
      "cc.studio.txt": "Un piccolo collettivo creativo in Svizzera. Trasformiamo idee in <em>marchi che restano</em> — con cura, ritmo e una piccola ossessione per i dettagli.",
      "cc.studio.base": "Base", "cc.studio.basev": "Lugano · Zürich",
      "cc.studio.found": "Fondato", "cc.studio.team": "Team", "cc.studio.teamv": "6 persone",
      "cc.studio.langs": "Lingue",
      "cc.reel.title": "Lavori<br>selezionati",
      "cc.reel.sub": "Passa sopra ogni progetto<br>per vederlo prendere colore.",
      "cc.cta.1": "Iniziamo", "cc.cta.2": "il tuo <em>atto</em>.",
      "cc.cta.btn": "Costruisci il progetto →",
      "cc.work.tag": "Lavori selezionati",
      "cc.work.title": "Fatti,<br>non <em>promesse</em>.",
      "cc.work.sub": "Una selezione di progetti tra branding, web, social, video e altro. Lavori veri, risultati veri.",
      "cc.about.tag": "Lo studio",
      "cc.about.title": "Un team giovane<br>che <em>fa sul serio</em>.",
      "cc.contact.tag": "Mettiti in contatto",
      "cc.contact.title": "Parliamo<br><em>di te</em>.",
      "cc.contact.sub": "Raccontaci il tuo progetto. Rispondiamo in fretta — nella tua lingua.",
      "cc.foot.rights": "Tutti i diritti riservati"
    },
    de: {
      "cc.nav.home": "Home",
      "cc.nav.studio": "Studio",
      "cc.brand.tag": "Ideen in Aktion",
      "cc.lead.tag": "Branding, Web, Video &amp; Content<br>für alle, die <b>wirklich auffallen</b> wollen.",
      "cc.lead.build": "Projekt starten",
      "cc.lead.work": "Arbeiten ansehen",
      "cc.mani.1": "Wir geben", "cc.mani.2": "Form", "cc.mani.3": "den Ideen.",
      "cc.mani.sub": "Brand, Web, Video und Content für alle, die <b>wirklich auffallen</b> wollen. Beantworte drei Fragen und wir bauen dein Projekt gemeinsam.",
      "cc.svc.tag": "Leistungen",
      "cc.svc.title": "Alles, was du brauchst,<br>um <em>wirklich präsent zu sein</em>.",
      "cc.svc.1.n": "Branding &amp; Identität", "cc.svc.1.d": "Logo, visuelles System, Guidelines",
      "cc.svc.2.n": "Webdesign &amp; Entwicklung", "cc.svc.2.d": "Websites, E-Commerce, Experiences",
      "cc.svc.3.n": "Foto &amp; Video", "cc.svc.3.d": "Reels, Spots, Porträt, Events",
      "cc.svc.4.n": "Social &amp; Content", "cc.svc.4.d": "Strategie, Redaktionspläne",
      "cc.svc.5.n": "Fotografie", "cc.svc.5.d": "Porträt, Produkt, Events",
      "cc.svc.6.n": "Podcast", "cc.svc.6.d": "Format, Aufnahme, Post",
      "cc.svc.ai.n": "KI &amp; Innovation", "cc.svc.ai.d": "Generative Tools, Automatisierung, individuelle Workflows",
      "cc.svc.by": "Betreut von",
      "cc.studio.tag": "Studio",
      "cc.studio.txt": "Ein kleines Kreativkollektiv in der Schweiz. Wir verwandeln Ideen in <em>Marken, die bleiben</em> — mit Sorgfalt, Rhythmus und einer kleinen Obsession fürs Detail.",
      "cc.studio.base": "Sitz in", "cc.studio.basev": "Lugano · Zürich",
      "cc.studio.found": "Gegründet", "cc.studio.team": "Team", "cc.studio.teamv": "6 Personen",
      "cc.studio.langs": "Sprachen",
      "cc.reel.title": "Ausgewählte<br>Arbeiten",
      "cc.reel.sub": "Fahre über jedes Projekt,<br>um es Farbe annehmen zu sehen.",
      "cc.cta.1": "Starten wir", "cc.cta.2": "dein <em>atto</em>.",
      "cc.cta.btn": "Projekt starten →",
      "cc.work.tag": "Ausgewählte Arbeiten",
      "cc.work.title": "Beweise,<br>keine <em>Versprechen</em>.",
      "cc.work.sub": "Einige Projekte aus Branding, Web, Social, Video und mehr. Echte Arbeit, echte Ergebnisse.",
      "cc.about.tag": "Das Studio",
      "cc.about.title": "Ein junges Team,<br>das <em>liefert</em>.",
      "cc.contact.tag": "Kontakt aufnehmen",
      "cc.contact.title": "Lass uns<br><em>reden</em>.",
      "cc.contact.sub": "Erzähl uns von deinem Projekt. Wir antworten schnell — in deiner Sprache.",
      "cc.foot.rights": "Alle Rechte vorbehalten"
    },
    fr: {
      "cc.nav.home": "Accueil",
      "cc.nav.studio": "Studio",
      "cc.brand.tag": "Des idées en action",
      "cc.lead.tag": "Branding, web, vidéo &amp; contenu<br>pour ceux qui veulent <b>vraiment se démarquer</b>.",
      "cc.lead.build": "Construire le projet",
      "cc.lead.work": "Voir les projets",
      "cc.mani.1": "Nous donnons", "cc.mani.2": "forme", "cc.mani.3": "aux idées.",
      "cc.mani.sub": "Marque, web, vidéo et contenu pour ceux qui veulent <b>vraiment se démarquer</b>. Réponds à trois questions et nous construisons ton projet ensemble.",
      "cc.svc.tag": "Services",
      "cc.svc.title": "Tout ce qu'il faut<br>pour <em>vraiment exister</em>.",
      "cc.svc.1.n": "Branding &amp; Identité", "cc.svc.1.d": "Logo, système visuel, guidelines",
      "cc.svc.2.n": "Web design &amp; développement", "cc.svc.2.d": "Sites, e-commerce, expériences",
      "cc.svc.3.n": "Photo &amp; Vidéo", "cc.svc.3.d": "Reels, spots, portrait, événements",
      "cc.svc.4.n": "Social &amp; contenu", "cc.svc.4.d": "Stratégie, plans éditoriaux",
      "cc.svc.5.n": "Photographie", "cc.svc.5.d": "Portrait, produit, événements",
      "cc.svc.6.n": "Podcast", "cc.svc.6.d": "Format, enregistrement, post",
      "cc.svc.ai.n": "IA &amp; innovation", "cc.svc.ai.d": "Outils génératifs, automatisation, flux sur mesure",
      "cc.svc.by": "Confié à",
      "cc.studio.tag": "Studio",
      "cc.studio.txt": "Un petit collectif créatif en Suisse. Nous transformons les idées en <em>marques qui durent</em> — avec soin, rythme et une petite obsession du détail.",
      "cc.studio.base": "Basé à", "cc.studio.basev": "Lugano · Zürich",
      "cc.studio.found": "Fondé", "cc.studio.team": "Équipe", "cc.studio.teamv": "6 personnes",
      "cc.studio.langs": "Langues",
      "cc.reel.title": "Projets<br>sélectionnés",
      "cc.reel.sub": "Survole chaque projet<br>pour le voir prendre couleur.",
      "cc.cta.1": "Commençons", "cc.cta.2": "ton <em>atto</em>.",
      "cc.cta.btn": "Construire le projet →",
      "cc.work.tag": "Projets sélectionnés",
      "cc.work.title": "Des preuves,<br>pas des <em>promesses</em>.",
      "cc.work.sub": "Quelques projets en branding, web, social, vidéo et plus. Du vrai travail, de vrais résultats.",
      "cc.about.tag": "Le studio",
      "cc.about.title": "Une équipe jeune<br>qui <em>fait le travail</em>.",
      "cc.contact.tag": "Prendre contact",
      "cc.contact.title": "Parlons-<br><em>en</em>.",
      "cc.contact.sub": "Parle-nous de ton projet. On répond vite — dans ta langue.",
      "cc.foot.rights": "Tous droits réservés"
    }
  };
  // merge into the shared dict so t() can resolve cc.* in every language
  if (I && I.I18N) {
    Object.assign(I.I18N.en, CC.en);
    Object.assign(I.I18N.it, CC.it);
    Object.assign(I.I18N.de, CC.de);
    Object.assign(I.I18N.fr, CC.fr);
  }

  const t = (k) => (I ? I.t(k) : k);

  /* ============ i18n apply + language switch ============ */
  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
  }
  function setLang(lang) {
    if (!I || !I.I18N_STATE.supported.includes(lang)) return;
    I.setLang(lang);
    try { localStorage.setItem("atto-lang", lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang]").forEach(b =>
      b.setAttribute("aria-current", b.dataset.lang === lang ? "true" : "false"));
    applyI18n();
    // re-run renders that build text from i18n
    renderWork(); renderTeam(); renderMember();
    observeReveals(); // re-observe freshly rendered nodes so they reveal (not blank)
    splitKinetic(); sweepKinetic();
    document.dispatchEvent(new CustomEvent("atto:langchange", { detail: { lang } }));
  }

  /* ============ ATTO_APP (consumed by flow.js / configurator.js) ===== */
  const state = {
    who: null, category: null, sectors: [],
    selectedPackage: null, addons: new Set(), services: new Set(),
    currency: "CHF"
  };

  /* lucide-like inline icon set (concept ships no CDN libs) */
  const ICONS = {
    check: '<polyline points="20 6 9 17 4 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    "building-2": '<path d="M4 22V6l8-3 8 3v16"/><path d="M9 22v-5h6v5"/><path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M16 13h.01"/>',
    "pen-tool": '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="M2 2l7.6 7.6"/>',
    monitor: '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8M12 17v4"/>',
    "share-2": '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    video: '<path d="M15 10l6-3v10l-6-3z"/><rect x="3" y="6" width="12" height="12" rx="1"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M7 4v16M17 4v16M3 9h18M3 15h18"/>',
    briefcase: '<rect x="3" y="8" width="18" height="12" rx="1"/><path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"/>',
    megaphone: '<path d="M3 11l14-6v14L3 13z"/><path d="M3 11v3M7 19l-1-5.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 01-8 0z"/><path d="M12 13v3M9 20h6"/><path d="M8 5H5v1a3 3 0 003 3M16 5h3v1a3 3 0 01-3 3"/>',
    music: '<path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>'
  };
  function renderIcons() {
    document.querySelectorAll("svg[data-lucide]").forEach(svg => {
      if (svg.dataset.done) return;
      const p = ICONS[svg.getAttribute("data-lucide")];
      if (!p) return;
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "1.6");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.innerHTML = p;
      svg.dataset.done = "1";
    });
  }
  window.ATTO_APP = { state, renderIcons, setLang };

  /* ============ custom cursor ============ */
  function initCursor() {
    const cur = document.getElementById("cursor"), dot = document.getElementById("cursorDot");
    if (!cur) return;
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function loop() { cx += (mx - cx) * .16; cy += (my - cy) * .16; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
    const hot = () => cur.classList.add("is-hot"), cold = () => cur.classList.remove("is-hot");
    document.addEventListener("mouseover", e => { if (e.target.closest("[data-hot],a,button")) hot(); });
    document.addEventListener("mouseout", e => { if (e.target.closest("[data-hot],a,button")) cold(); });
  }

  /* ============ per-page interactive background ============ */
  function initBackground() {
    const c = document.getElementById("aurora"); if (!c) return;
    const x = c.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W, H, mx = -9999, my = -9999;
    function size() { W = c.width = innerWidth * DPR; H = c.height = innerHeight * DPR; c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px"; x.fillStyle = "#0c0e0f"; x.fillRect(0, 0, W, H); }
    addEventListener("resize", size); size();
    addEventListener("mousemove", e => { mx = e.clientX * DPR; my = e.clientY * DPR; });
    addEventListener("mouseout", () => { mx = my = -9999; });
    const cols = ["#5FB3A6", "#2F7E72", "#A7D8CF", "#3E8C80"];
    const mode = document.body.dataset.bg || "field";

    if (mode === "field") {                       /* HOME — drifting embers / sparks (like a campfire) */
      const N = Math.round(Math.min(820, Math.max(340, W * H / (12000 * DPR))));
      const P = [];
      const spawn = (p, init) => {
        p.x = Math.random() * W;
        p.y = init ? Math.random() * H : H + Math.random() * 60 * DPR;   // rise up from below
        p.vx = (Math.random() - .5) * .22 * DPR;
        p.vy = -(.18 + Math.random() * .5) * DPR;
        p.r = (.55 + Math.random() * 1.5) * DPR;
        p.life = init ? Math.random() * 200 : 0; p.max = 240 + Math.random() * 380;
        p.fr = .03 + Math.random() * .06; p.ph = Math.random() * 6.28; p.wob = Math.random() * 6.28;
        p.col = Math.random() < .14 ? "#FF8A5E" : cols[(Math.random() * cols.length) | 0];
      };
      for (let i = 0; i < N; i++) { const p = {}; spawn(p, true); P.push(p); }
      const R = 150 * DPR;
      (function frame() {
        x.globalCompositeOperation = "source-over"; x.fillStyle = "rgba(12,14,15,.20)"; x.fillRect(0, 0, W, H);
        x.globalCompositeOperation = "lighter";
        for (const p of P) {
          p.wob += .024;
          let vx = p.vx + Math.sin(p.wob) * .16 * DPR, vy = p.vy;
          const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
          if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 1.3; vx += dx / d * f; vy += dy / d * f; }
          p.x += vx; p.y += vy; p.life++;
          const lk = Math.min(1, p.life / 36) * Math.max(0, 1 - p.life / p.max);
          const flick = .5 + .5 * Math.sin(p.ph + p.life * p.fr);
          x.globalAlpha = Math.max(0, lk * flick * .9);
          x.fillStyle = p.col;
          x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill();
          if (p.life > p.max || p.y < -12 * DPR || p.x < -12 * DPR || p.x > W + 12 * DPR) spawn(p);
        }
        x.globalAlpha = 1; requestAnimationFrame(frame);
      })();

    } else if (mode === "grid") {                 /* WORK — warping dot grid */
      let t = 0;
      (function frame() {
        t += .01; x.globalCompositeOperation = "source-over"; x.fillStyle = "#0c0e0f"; x.fillRect(0, 0, W, H);
        const gap = 46 * DPR, R = 230 * DPR;
        x.globalCompositeOperation = "lighter";
        for (let gx = gap; gx < W; gx += gap) for (let gy = gap; gy < H; gy += gap) {
          const wob = Math.sin(gx * .01 + t) * Math.cos(gy * .01 - t) * 4 * DPR;
          let px = gx + wob, py = gy + wob, r = 1.1 * DPR, a = .14;
          const dx = px - mx, dy = py - my, d = Math.hypot(dx, dy);
          let warm = 0;
          if (d < R) { const f = 1 - d / R; px += dx / (d || 1) * f * 26 * DPR; py += dy / (d || 1) * f * 26 * DPR; r += f * 2.6 * DPR; a += f * .6; warm = f; }
          x.fillStyle = warm > .35 ? `rgba(255,138,94,${a})` : `rgba(95,179,166,${a})`; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
        }
        requestAnimationFrame(frame);
      })();

    } else if (mode === "orbs") {                 /* ABOUT — drifting soft orbs */
      const orbs = Array.from({ length: 5 }, (_, i) => ({ h: i === 0 ? "#FF8A5E" : cols[i % cols.length], ox: Math.random(), oy: Math.random(), sx: (.4 + Math.random()) * .0002, sy: (.4 + Math.random()) * .0002, ph: Math.random() * 9, r: .3 + Math.random() * .3 }));
      let tm = 0;
      (function frame() {
        tm += 16; x.globalCompositeOperation = "source-over"; x.fillStyle = "#0c0e0f"; x.fillRect(0, 0, W, H);
        x.globalCompositeOperation = "lighter"; x.globalAlpha = .08;
        orbs.forEach((b, i) => { const gx = (b.ox + Math.sin(tm * b.sx + b.ph) * .18 + (mx > 0 ? (mx / W - .5) * .08 : 0)) * W, gy = (b.oy + Math.cos(tm * b.sy + b.ph) * .18 + (my > 0 ? (my / H - .5) * .08 : 0)) * H, rad = b.r * Math.min(W, H), g = x.createRadialGradient(gx, gy, 0, gx, gy, rad); g.addColorStop(0, b.h); g.addColorStop(1, b.h + "00"); x.fillStyle = g; x.beginPath(); x.arc(gx, gy, rad, 0, 7); x.fill(); });
        x.globalAlpha = 1; requestAnimationFrame(frame);
      })();

    } else if (mode === "waves") {                /* CONTACT — flowing line waves */
      let t = 0;
      (function frame() {
        t += .012; x.globalCompositeOperation = "source-over"; x.fillStyle = "#0c0e0f"; x.fillRect(0, 0, W, H);
        x.globalCompositeOperation = "lighter"; x.lineWidth = 1.2 * DPR;
        const lines = 26, my0 = my > 0 ? my : H / 2;
        for (let i = 0; i < lines; i++) {
          const baseY = (i + 1) / (lines + 1) * H;
          const prox = 1 - Math.min(1, Math.abs(baseY - my0) / (H * .5));
          x.beginPath();
          for (let px = 0; px <= W; px += 14 * DPR) {
            const amp = (16 + prox * 60) * DPR;
            const y = baseY + Math.sin(px * .006 + t + i * .5) * amp + Math.cos(px * .013 - t) * amp * .4;
            px === 0 ? x.moveTo(px, y) : x.lineTo(px, y);
          }
          x.strokeStyle = `rgba(${prox > .55 ? "255,138,94" : "95,179,166"},${.05 + prox * .22})`; x.stroke();
        }
        requestAnimationFrame(frame);
      })();

    } else {                                      /* START — constellation network */
      const N = Math.round(Math.min(140, Math.max(50, W * H / (26000 * DPR))));
      const P = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35 * DPR, vy: (Math.random() - .5) * .35 * DPR, sp: Math.random() < .12 }));
      const LINK = 140 * DPR, RM = 150 * DPR;
      (function frame() {
        x.globalCompositeOperation = "source-over"; x.fillStyle = "#0c0e0f"; x.fillRect(0, 0, W, H);
        x.globalCompositeOperation = "lighter";
        for (const p of P) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
          const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
          if (d < RM) { p.x += dx / (d || 1) * (1 - d / RM) * 1.4; p.y += dy / (d || 1) * (1 - d / RM) * 1.4; }
        }
        for (let i = 0; i < P.length; i++) {
          for (let j = i + 1; j < P.length; j++) {
            const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d = Math.hypot(dx, dy);
            if (d < LINK) { x.strokeStyle = `rgba(95,179,166,${(1 - d / LINK) * .16})`; x.lineWidth = 1 * DPR; x.beginPath(); x.moveTo(P[i].x, P[i].y); x.lineTo(P[j].x, P[j].y); x.stroke(); }
          }
        }
        for (const p of P) { x.fillStyle = p.sp ? "rgba(255,138,94,.7)" : "rgba(95,179,166,.5)"; x.beginPath(); x.arc(p.x, p.y, (p.sp ? 2 : 1.5) * DPR, 0, 7); x.fill(); }
        requestAnimationFrame(frame);
      })();
    }
  }

  /* ============ overlay menu (close X + esc + link close) ============ */
  function initMenu() {
    const btn = document.getElementById("menuBtn"), ov = document.getElementById("overlay");
    if (!btn || !ov) return;
    const close = document.getElementById("menuClose");
    function set(open) {
      document.body.classList.toggle("nav-open", open);
      ov.setAttribute("aria-hidden", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? t("nav.close") : t("nav.menu"));
    }
    btn.addEventListener("click", () => set(!document.body.classList.contains("nav-open")));
    if (close) close.addEventListener("click", () => set(false));
    ov.querySelectorAll(".overlay__nav a").forEach(a => a.addEventListener("click", () => set(false)));
    addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
    // language buttons (overlay + header)
    document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  }

  /* ============ kinetic headline (outline→fill by proximity) ============ */
  let kineticChars = [];
  function splitKinetic() {
    document.querySelectorAll("[data-word]").forEach(w => {
      const accent = w.hasAttribute("data-accent");
      // prefer fresh i18n text so the split updates on language change
      const text = w.dataset.i18n ? t(w.dataset.i18n) : w.textContent;
      w.innerHTML = [...text].map(ch => ch === " " ? " " : `<span class="ch${accent ? " ch--accent" : ""}">${ch}</span>`).join("");
    });
    kineticChars = [...document.querySelectorAll(".hero__title .ch, .phero__title .ch")];
  }
  // PROFESSIONAL-PLUS: continuous cursor-proximity ink-fill (outline→fill as the
  // cursor nears each glyph) — the same kinetic the user liked.
  function initKinetic() {
    if (!document.querySelector("[data-word]")) return;
    splitKinetic();
    let tx = -9999, ty = -9999;
    addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; });
    addEventListener("mouseout", () => { tx = ty = -9999; });
    (function loop() {
      for (const ch of kineticChars) {
        const r = ch.getBoundingClientRect();
        const f = Math.max(0, 1 - Math.hypot(tx - (r.left + r.width / 2), ty - (r.top + r.height / 2)) / 300);
        ch.style.setProperty("--f", f.toFixed(3));
      }
      requestAnimationFrame(loop);
    })();
  }
  function sweepKinetic() {}   // no-op: proximity loop drives --f live (kept for setLang call)

  /* ============ steady marquee (PROFESSIONAL-PLUS) ============ */
  // Constant, measured speed — no scroll-velocity skew/acceleration.
  function initMarquee() {
    const track = document.getElementById("marquee"); if (!track) return;
    const seg = track.firstElementChild;
    const clone = seg.cloneNode(true); clone.setAttribute("aria-hidden", "true"); track.appendChild(clone);
    const GAP = parseFloat(getComputedStyle(track).gap) || 0;
    let period = seg.offsetWidth + GAP; addEventListener("resize", () => period = seg.offsetWidth + GAP);
    let px = 0;
    (function loop() { px -= .45; if (px <= -period) px += period; track.style.transform = `translateX(${px}px)`; requestAnimationFrame(loop); })();
  }

  /* ============ composed lead photos (PROFESSIONAL-PLUS) ============ */
  const GRADS = [
    "linear-gradient(135deg,#172825,#2f6357 60%,#5fb3a6)",
    "linear-gradient(160deg,#13201e,#356f62,#a7d8cf)",
    "linear-gradient(120deg,#15201d,#3d8072,#74c4b7)",
    "linear-gradient(150deg,#101817,#2b5a51,#5fb3a6)",
    "linear-gradient(135deg,#16241f,#39786a,#8ed0c4)"
  ];
  // Stable, intentional frame — no idle floating bob; only a faint mouse parallax.
  function initLeadPhotos() {
    const wrap = document.getElementById("leadPhotos"); if (!wrap) return;
    const phs = [...wrap.querySelectorAll(".ph")];
    phs.forEach((p, i) => p.style.backgroundImage = GRADS[i % GRADS.length]);
    let mx = .5, my = .5, cx = .5, cy = .5;
    addEventListener("mousemove", e => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; });
    (function loop() { cx += (mx - cx) * .045; cy += (my - cy) * .045; phs.forEach(p => { const d = +p.dataset.depth; p.style.transform = `translate(-50%,-50%) translate(${(cx - .5) * d}px,${(cy - .5) * d}px)`; }); requestAnimationFrame(loop); })();
  }

  /* ============ cinematic pinned-scroll stage (PROFESSIONAL-PLUS) ====
     Each .scene pins (CSS sticky) while its slot scrolls; here we read the
     scroll progress per scene and write --in/--out/--vis (0..1) so content
     fades + lifts on a constant dark stage. One scene is .is-active at a
     time (drives staggered list/plate reveals + the index rail). */
  function initCine() {
    const cine = document.getElementById("cine"); if (!cine) return;
    const scenes = [...cine.querySelectorAll("[data-scene]")]; if (!scenes.length) return;
    const curEl = document.getElementById("sceneCur"),
          nameEl = document.getElementById("sceneName"),
          progEl = document.getElementById("cineProg"),
          totEl = document.getElementById("sceneTot");
    if (totEl) totEl.textContent = String(scenes.length).padStart(2, "0");
    const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
    let activeIdx = -1;
    (function frame() {
      const vh = innerHeight; let active = 0, best = Infinity;
      scenes.forEach((s, idx) => {
        const r = s.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) / vh;   // 0 = centred, ±1 = a screen away
        const vis = clamp(1 - Math.abs(off) * 1.3, 0, 1);
        s.style.setProperty("--off", off.toFixed(3));
        s.style.setProperty("--vis", vis.toFixed(3));
        const d = Math.abs(off);
        if (d < best) { best = d; active = idx; }
      });
      if (active !== activeIdx) {
        activeIdx = active;
        scenes.forEach((s, idx) => s.classList.toggle("is-active", idx === active));
        if (curEl) curEl.textContent = String(active + 1).padStart(2, "0");
        if (nameEl) nameEl.textContent = scenes[active].dataset.name || "";
      }
      if (progEl) {
        const max = document.documentElement.scrollHeight - vh;
        progEl.style.width = (clamp(scrollY / Math.max(1, max), 0, 1) * 100).toFixed(1) + "%";
      }
      requestAnimationFrame(frame);
    })();
  }

  /* ============ intro / preloader — favicon mark, once per session ============ */
  function initIntro() {
    if (!document.body) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let played = false;
    try { played = sessionStorage.getItem("atto-intro") === "1"; } catch (e) {}
    if (played) return;
    try { sessionStorage.setItem("atto-intro", "1"); } catch (e) {}
    const el = document.createElement("div");
    el.className = "intro";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<div class="intro__mark"><span class="intro__lock"><span class="intro__a">a</span><span class="intro__dot"></span></span></div>';
    document.body.appendChild(el);
    const dismiss = () => el.classList.add("is-done");
    const done = setTimeout(dismiss, 2200);
    el.addEventListener("click", () => { clearTimeout(done); dismiss(); });   // tap/click to skip
    el.addEventListener("transitionend", () => { if (el.classList.contains("is-done")) el.remove(); });
  }

  /* ============ home scenes — light cursor parallax ============ */
  // Uses the independent CSS `translate` property so it composes with the
  // reveal/hover `transform` instead of overriding it.
  function initHomeMotion() {
    if (!document.getElementById("cine")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = [...document.querySelectorAll(".cgal__ph, .cstudio__ph span, .cplate")];
    if (!layers.length) return;
    let tx = 0, ty = 0;
    addEventListener("mousemove", e => { tx = (e.clientX - innerWidth / 2) / innerWidth; ty = (e.clientY - innerHeight / 2) / innerHeight; });
    addEventListener("mouseout", () => { tx = ty = 0; });
    (function loop() {
      for (let i = 0; i < layers.length; i++) {
        const el = layers[i];
        const base = el.classList.contains("cplate") ? 9 : el.classList.contains("cgal__ph") ? 13 : 20;
        const d = base * (1 + (i % 4) * .14);
        el.style.translate = (tx * d).toFixed(1) + "px " + (ty * d).toFixed(1) + "px";
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ============ scroll reveals ============ */
  let revealIO = null;
  function initReveals() {
    revealIO = new IntersectionObserver(es => es.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add("in"), (e.target.dataset.stagger ? i * 80 : 0)); revealIO.unobserve(e.target); } }), { threshold: .15 });
    observeReveals();
  }
  // (re)observe any not-yet-revealed nodes — call after re-renders (e.g. language
  // switch rebuilds work/team/member, whose fresh nodes must be re-observed or
  // they stay hidden and leave blank space until a page refresh).
  function observeReveals() {
    if (!revealIO) return;
    document.querySelectorAll(".reveal:not(.in),.card:not(.in),.mcard:not(.in)").forEach(el => revealIO.observe(el));
  }

  /* ============ project + render helpers ============ */
  const PROJECTS = [
    { name: "Riviera Studio", sec: "web", size: "wide" },
    { name: "Forma Festival", sec: "social", size: "tall" },
    { name: "Atelier Nord", sec: "branding", size: "half" },
    { name: "Lago Sessions", sec: "podcast", size: "half" },
    { name: "Vertige", sec: "video_fashion", size: "tall" },
    { name: "Monte Verde", sec: "video_corporate", size: "wide" },
    { name: "Eco Collettivo", sec: "branding", size: "half" },
    { name: "Nuvola", sec: "video_commercial", size: "half" },
    { name: "Aurora Run", sec: "sport", size: "tall" },
    { name: "Polaris", sec: "personal", size: "wide" },
    { name: "Suono", sec: "artist", size: "tall" },
    { name: "Capsule", sec: "video_events", size: "half" }
  ];
  function cardHTML(p, i) {
    const cls = p.size === "wide" ? "card--wide" : p.size === "tall" ? "card--tall" : "card--half";
    const num = String(i + 1).padStart(2, "0");
    return `<a class="card ${cls}" href="#" data-hot>
      <span class="card__idx"><b>Atto ${num}</b> · ${p.sec.split("_")[0]}</span>
      <div class="card__img" style="background-image:${GRADS[i % GRADS.length]}"></div>
      <div class="card__wash"></div><div class="card__sweep"></div>
      <div class="card__meta"><div class="card__name">${p.name}</div><div class="card__tag">${t("sec." + p.sec + ".name")}</div></div>
    </a>`;
  }
  function renderWork() {
    const grid = document.getElementById("workGrid"); if (!grid) return;
    grid.innerHTML = PROJECTS.map(cardHTML).join("");
  }
  function memberName(m) { return m.initials[0] + ". " + m.id.charAt(0).toUpperCase() + m.id.slice(1); }
  function renderTeam() {
    const grid = document.getElementById("teamGrid"); if (!grid) return;
    grid.innerHTML = D.TEAM.map((m, i) => `
      <a class="mcard" href="member.html?id=${m.id}" data-hot style="--sector:${D.SECTORS[m.sector].color}">
        <div class="mcard__img" style="background-image:${GRADS[i % GRADS.length]}"></div>
        <div class="mcard__wash"></div>
        <span class="mcard__initials">${m.initials}</span>
        <div class="mcard__meta">
          <div class="mcard__name">${memberName(m)}</div>
          <span class="mcard__role">${t("about.role." + m.id)}</span>
          <span class="mcard__view">${t("member.view")}</span>
        </div>
      </a>`).join("");
  }
  function renderMember() {
    const hero = document.getElementById("memberHero"); if (!hero) return;
    const id = new URLSearchParams(location.search).get("id");
    const m = D.getMember(id) || D.TEAM[0];
    hero.innerHTML = `
      <div class="mhero__plate" style="--sector:${D.SECTORS[m.sector].color}">
        <div class="mcard__img" style="background-image:${GRADS[0]}"></div>
        <div class="mcard__wash"></div>
        <span class="mcard__initials">${m.initials}</span>
      </div>
      <div class="mhero__body">
        <span class="mhero__role">${t("about.role." + m.id)}</span>
        <h1 class="mhero__name">${memberName(m)}</h1>
        <p class="mhero__intro">${t("member.intro")}</p>
        <a class="btn btn--ghost mback" href="about.html" data-hot><span>← ${t("member.back")}</span></a>
      </div>`;
    const work = document.getElementById("memberWork");
    if (work) work.innerHTML = m.work.map((sid, i) =>
      cardHTML({ name: t("sec." + sid + ".name"), sec: sid, size: i === 0 ? "wide" : "half" }, i)).join("");
  }

  /* ============ wizard (reuses ATTO_FLOW + ATTO_CONFIG) ============ */
  function initWizard() {
    if (!document.getElementById("step1Grid")) return;
    if (window.ATTO_FLOW) window.ATTO_FLOW.init();
    if (window.ATTO_CONFIG) window.ATTO_CONFIG.init();
    renderIcons();
    const form = document.getElementById("contactForm");
    if (form) form.addEventListener("submit", onSubmit);
  }
  function onSubmit(e) {
    const form = e.currentTarget;
    const status = document.getElementById("formStatus");
    if (!form.checkValidity()) return;            // let native validation show
    e.preventDefault();
    if (form.action.includes("[FORMSPREE_FORM_ID]")) {
      e.stopPropagation();
      if (status) status.textContent = t("form.success") || "Thanks — we'll be in touch.";
      form.reset();
    }
  }

  /* ============ boot ============ */
  function boot() {
    let lang = "it";
    try { lang = localStorage.getItem("atto-lang") || "it"; } catch (e) {}
    if (I) I.setLang(lang);
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-current", b.dataset.lang === lang ? "true" : "false"));

    initIntro();
    renderWork(); renderTeam(); renderMember();
    applyI18n();
    renderIcons();

    initCursor();
    initBackground();
    initMenu();
    initKinetic();
    initMarquee();
    initLeadPhotos();
    initWizard();
    initReveals();
    initCine();
    initHomeMotion();

    document.querySelectorAll("#year").forEach(y => y.textContent = new Date().getFullYear());
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
