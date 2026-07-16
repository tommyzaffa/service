/* =============================================================
   ATTO — Data layer (v3)
   Fonte di verità: docs/++ Pacchetti (con specifiche).xlsx
   (estratto e verificato con Tommy — vedi VERIFICA-DATI.md).
   Prezzi in CHF. unit: "once" | "month" | "episode".

   v3 (2026-07-16):
   - Add-on riorganizzati in BUNDLE ("gruppetti"): ogni famiglia
     ha 1–6 bundle con voci raggruppate e prezzo unico =
     somma delle voci −10% (BUNDLE_DISCOUNT). Prezzi da
     verificare: vedi VERIFICA-BUNDLE.md.
   - Ogni servizio ha un "wizard": domande iniziali (chi sei /
     che tipo) che indirizzano linea e livello consigliato.
   ============================================================= */

/* ---- Valute ------------------------------------------------ */
const CURRENCIES = {
  CHF: { code: "CHF", rateFromCHF: 1,    symbol: "CHF", thousands: "'" },
  EUR: { code: "EUR", rateFromCHF: 1.05, symbol: "€",   thousands: "." }
};

/* sconto applicato ai bundle (documentazione: i prezzi sotto
   sono già calcolati con questo sconto sulla somma delle voci) */
const BUNDLE_DISCOUNT = 0.10;

/* ============================================================
   FAMIGLIE ADD-ON → BUNDLE
   Ogni famiglia: { id, label, exclusive?, bundles:[...] }
   Bundle: { id, name, items:[nomi voce], once?, monthly?,
             from?, approx?, note? }
   exclusive:true → si sceglie al massimo un bundle (es. Photo+
   e-commerce, che è a livelli).
   ============================================================ */
const ADDON_FAMILIES = {

  /* --- Add-on sito (Website Start/Pro/Premium) --------------- */
  web_site: {
    id: "web_site", label: "Add-on sito",
    bundles: [
      { id: "ws_presenza", name: "Presenza & Dati",
        items: ["Google Maps", "Pixel Meta", "Google Analytics", "Google Tag Manager", "Dashboard KPI"],
        once: 1845 },
      { id: "ws_clienti", name: "Clienti & Prenotazioni",
        items: ["WhatsApp Business", "Chat Live", "Prenotazioni", "CRM"],
        once: 3870 },
      { id: "ws_contenuti", name: "Contenuti & Aree riservate",
        items: ["Blog avanzato", "Area download", "Multilingua (1 lingua)", "Area riservata"],
        once: 4050 },
      { id: "ws_marketing", name: "Marketing & Automazioni",
        items: ["Newsletter Setup", "Email Marketing", "Automazioni", "Funnel"],
        once: 4320, from: true }
    ]
  },

  /* --- Photo+ per E-commerce (a livelli, esclusivo) ----------- */
  photo_ecom: {
    id: "photo_ecom", label: "Photo+", exclusive: true,
    bundles: [
      { id: "photo_start", name: "Photo+ Start", once: 500, from: true,
        items: ["Shooting prodotti", "Fondo bianco", "Color correction base", "Esportazione web", "JPG HD"] },
      { id: "photo_pro", name: "Photo+ Pro", once: 900, from: true,
        items: ["Tutto Start", "Color grading accurato", "Ritocco professionale", "Scontorno prodotti", "Ombre realistiche", "Compressione web", "Alta risoluzione"] },
      { id: "photo_premium", name: "Photo+ Premium", once: 1800, from: true,
        items: ["Tutto Pro", "Illuminotecnica professionale", "Set fotografico dedicato", "Foto ambientate (lifestyle)", "Dettagli macro", "Foto 360° (se richieste)", "Ottimizzazione e-commerce", "Archivio organizzato", "Backup cloud"] }
    ]
  },

  /* --- Video+ (Landing Campaign & E-commerce) ------------------ */
  video_landing: {
    id: "video_landing", label: "Video+",
    bundles: [
      { id: "vl_campaign", name: "Video Campaign", once: 1500, from: true,
        items: ["Hero video", "Video prodotto", "Video servizio", "Video testimonial", "Montaggio", "Color grading"] }
    ]
  },

  /* --- Photo+ per Landing Campaign Pro ------------------------- */
  photo_landing: {
    id: "photo_landing", label: "Photo+",
    bundles: [
      { id: "pl_campaign", name: "Photo Campaign", once: 900, from: true,
        items: ["Shooting dedicato", "Foto prodotto", "Foto ambiente", "Color grading", "Ritocco"] }
    ]
  },

  /* --- Design+ (Landing Campaign) ------------------------------ */
  design_landing: {
    id: "design_landing", label: "Design+",
    bundles: [
      { id: "dl_kit", name: "Design Kit", once: 500, from: true,
        items: ["Grafica personalizzata", "Icone", "Infografiche", "Illustrazioni", "Mockup"] }
    ]
  },

  /* --- AI+ (varianti per gruppo) -------------------------------- */
  ai_landing: {
    id: "ai_landing", label: "AI+",
    bundles: [
      { id: "ai_visual",  name: "AI Visual",    items: ["AI Images", "AI Ads"],              once: 900 },
      { id: "ai_content", name: "AI Contenuti", items: ["AI Copy", "AI Video", "AI Voice"],  once: 1530 }
    ]
  },
  ai_social: {
    id: "ai_social", label: "AI+",
    bundles: [
      { id: "ai_visual",  name: "AI Visual",    items: ["AI Images", "AI Ads"],                 once: 900 },
      { id: "ai_content", name: "AI Contenuti", items: ["AI Carousel", "AI Video", "AI Voice"], once: 1530 }
    ]
  },
  ai_video: {
    id: "ai_video", label: "AI+",
    bundles: [
      { id: "ai_promo",   name: "AI Promo",         items: ["AI Poster evento", "AI Visual campagne", "AI Trailer", "AI Reel"],          once: 2250 },
      { id: "ai_lingue",  name: "AI Voce & Lingue", items: ["AI Voice Over", "AI Traduzioni", "AI Sottotitoli"],                          once: 765 },
      { id: "ai_extra",   name: "AI Contenuti extra", items: ["AI Avatar presentatore", "AI Repurposing contenuti", "AI Clip automatiche"], once: 1800 },
      { id: "ai_qualita", name: "AI Qualità",       items: ["AI Foto enhancement", "AI Video upscaling"],                                 once: 720 }
    ]
  },
  ai_podcast: {
    id: "ai_podcast", label: "AI+",
    bundles: [
      { id: "ai_branding", name: "AI Branding episodio", items: ["AI Intro Video", "AI Outro", "AI Thumbnail"],                              once: 990 },
      { id: "ai_distr",    name: "AI Distribuzione",     items: ["AI Clip automatiche", "AI Repurposing", "AI Trailer Podcast"],             once: 1710 },
      { id: "ai_voce",     name: "AI Voce & Lingue",     items: ["AI Voice Over", "AI Sottotitoli", "AI Traduzioni", "AI Avatar host"],      once: 1485 }
    ]
  },
  ai_personal: {
    id: "ai_personal", label: "AI+",
    bundles: [
      { id: "ai_branding", name: "AI Branding",      items: ["AI Intro Video", "AI Outro", "AI Thumbnail"],                            once: 990 },
      { id: "ai_distr",    name: "AI Distribuzione", items: ["AI Clip automatiche", "AI Repurposing"],                                 once: 1080 },
      { id: "ai_voce",     name: "AI Voce & Lingue", items: ["AI Voice Over", "AI Sottotitoli", "AI Traduzioni", "AI Avatar host"],    once: 1485 }
    ]
  },

  /* --- LinkedIn+ (Social) --------------------------------------- */
  linkedin: {
    id: "linkedin", label: "LinkedIn+",
    bundles: [
      { id: "li_setup",    name: "LinkedIn Setup",    items: ["Ottimizzazione profilo", "Profilo aziendale", "Piano editoriale"], once: 1530 },
      { id: "li_gestione", name: "LinkedIn Gestione", items: ["Gestione LinkedIn", "Personal branding CEO"],                      monthly: 2160 },
      { id: "li_business", name: "LinkedIn Business", items: ["Lead generation", "Employer branding"],                            once: 3600, from: true }
    ]
  },

  /* --- Web+ (varianti per gruppo) -------------------------------- */
  web_social: {
    id: "web_social", label: "Web+",
    bundles: [
      { id: "wb_base",     name: "Base web",         items: ["Landing page", "SEO", "Newsletter"],        once: 2700 },
      { id: "wb_completo", name: "Sito completo",    items: ["Website", "CRM", "Automazioni"],            once: 4950, approx: true },
      { id: "wb_funnel",   name: "Vendita & Funnel", items: ["Website Premium", "Funnel"],                once: 6750, approx: true }
    ]
  },
  web_video_eventi: {
    id: "web_video_eventi", label: "Web+",
    bundles: [
      { id: "wv_presenza",   name: "Presenza evento",       items: ["Landing page evento", "Programma online", "Pagina sponsor"],       once: 2250 },
      { id: "wv_sito",       name: "Sito evento completo",  items: ["Sito evento", "Gallery post-evento", "Area download media"],       once: 3780 },
      { id: "wv_iscrizioni", name: "Iscrizioni & Biglietti", items: ["Pagina iscrizioni", "Form iscrizione", "Biglietteria online"],    once: 3150 },
      { id: "wv_media",      name: "Media & Streaming",     items: ["Accrediti stampa", "Streaming integrato"],                         once: 2700 }
    ]
  },
  web_video_std: {
    id: "web_video_std", label: "Web+",
    bundles: [
      { id: "wv_presenza",   name: "Presenza evento",       items: ["Landing page evento", "Programma online", "Pagina sponsor"],       once: 2250 },
      { id: "wv_sito",       name: "Sito evento completo",  items: ["Sito evento", "Gallery post-evento", "Area download media"],       once: 4230 },
      { id: "wv_iscrizioni", name: "Iscrizioni & Biglietti", items: ["Pagina iscrizioni", "Form iscrizione", "Biglietteria online"],    once: 3150 },
      { id: "wv_media",      name: "Media & Streaming",     items: ["Accrediti stampa", "Streaming integrato"],                         once: 2700 }
    ]
  },
  web_video_corp: {
    id: "web_video_corp", label: "Web+",
    bundles: [
      { id: "wv_presenza",   name: "Presenza evento",       items: ["Landing page evento", "Programma online", "Pagina sponsor"],       once: 2250 },
      { id: "wv_sito",       name: "Sito evento completo",  items: ["Sito evento", "Gallery post-evento", "Area download media"],       once: 4230 },
      { id: "wv_iscrizioni", name: "Iscrizioni & Biglietti", items: ["Pagina iscrizioni", "Form iscrizione", "Biglietteria online"],    once: 3330 },
      { id: "wv_media",      name: "Media & Streaming",     items: ["Accrediti stampa", "Streaming integrato"],                         once: 2700 }
    ]
  },
  web_podcast: {
    id: "web_podcast", label: "Web+",
    bundles: [
      { id: "wp_presenza",  name: "Presenza podcast",      items: ["Landing podcast", "SEO podcast", "Newsletter"],          once: 2700 },
      { id: "wp_sito",      name: "Sito podcast completo", items: ["Sito podcast", "Archivio episodi", "Blog podcast"],      once: 5400,
        note: "il costo della banda dell'archivio cresce con il pubblico del podcast" },
      { id: "wp_community", name: "Community & Premium",   items: ["Area premium", "CRM"],                                   once: 3150 }
    ]
  },
  web_personal: {
    id: "web_personal", label: "Web+",
    bundles: [
      { id: "wpe_presenza",  name: "Presenza online",      items: ["Landing web", "SEO", "Newsletter"],   once: 2700 },
      { id: "wpe_sito",      name: "Sito completo",        items: ["Complex web", "Blog"],                once: 4500 },
      { id: "wpe_community", name: "Community & Premium",  items: ["Area premium", "CRM"],                once: 3150 }
    ]
  },

  /* --- Social+ (varianti) ----------------------------------------- */
  social_video: {
    id: "social_video", label: "Social+",
    bundles: [
      { id: "sv_strategia",  name: "Strategia",         items: ["Piano editoriale evento", "Piano pubblicazione", "Strategia lancio"],                              once: 1890 },
      { id: "sv_produzione", name: "Produzione live",   items: ["Reel aggiuntivi", "Stories live", "Backstage", "Interviste"],                                      once: 3600 },
      { id: "sv_partner",    name: "Contenuti partner", items: ["Contenuti speaker", "Contenuti espositori", "Contenuti sponsor (1 reel)"],                          once: 2970 },
      { id: "sv_gestione",   name: "Gestione evento",   items: ["Gestione account durante l'evento", "Community management", "Moderazione commenti", "Copertura live"], once: 1980 },
      { id: "sv_post",       name: "Post evento",       items: ["Recap social", "Carousel fotografici", "Ringraziamenti"],                                          once: 1620 }
    ]
  },
  social_video_adv: {
    id: "social_video_adv", label: "Social+",
    bundles: [
      { id: "sv_strategia",  name: "Strategia",         items: ["Piano editoriale evento", "Piano pubblicazione", "Strategia lancio"],                              once: 1890 },
      { id: "sv_produzione", name: "Produzione live",   items: ["Reel aggiuntivi", "Stories live", "Backstage", "Interviste"],                                      once: 3600 },
      { id: "sv_partner",    name: "Contenuti partner", items: ["Contenuti speaker", "Contenuti espositori", "Contenuti sponsor (1 reel)"],                          once: 2970 },
      { id: "sv_gestione",   name: "Gestione evento",   items: ["Gestione account durante l'evento", "Community management", "Moderazione commenti", "Copertura live"], once: 1980 },
      { id: "sv_post",       name: "Post campagna",     items: ["Recap social", "Carousel fotografici", "Highlight reel"],                                          once: 1620 }
    ]
  },
  social_podcast: {
    id: "social_podcast", label: "Social+",
    bundles: [
      { id: "sp_gestione", name: "Gestione canali",     items: ["Gestione YouTube", "Gestione Instagram", "Gestione Spotify"],                    monthly: 1620 },
      { id: "sp_kit",      name: "Kit grafico social",  items: ["Calendario pubblicazioni", "Grafiche stories", "Copertine reel", "Carousel"],    once: 1215 },
      { id: "sp_promo",    name: "Promo Reel & Shorts", items: ["Pacchetto 5 reel", "2 Shorts YouTube"],                                          once: 1575 }
    ]
  },

  /* --- Merch+ ------------------------------------------------------ */
  merch_social: {
    id: "merch_social", label: "Merch+",
    bundles: [
      { id: "me_abbigliamento", name: "Abbigliamento",      items: ["Magliette", "Felpe", "Cappellini"],                            once: 1350 },
      { id: "me_stampa",        name: "Immagine & Stampa",  items: ["Shopper", "Packaging", "Roll-up", "Banner", "Gadget"],         once: 2385 },
      { id: "me_kit",           name: "Kit completo",       items: ["Merchandising completo su misura"],                            once: 2500, from: true }
    ]
  },
  merch_full: {
    id: "merch_full", label: "Merch+",
    bundles: [
      { id: "me_abbigliamento", name: "Abbigliamento",      items: ["Magliette", "Felpe", "Cappellini"],                                            once: 1350 },
      { id: "me_stampa",        name: "Immagine & Stampa",  items: ["Shopper", "Packaging", "Roll-up", "Banner", "Gadget"],                         once: 2385 },
      { id: "me_evento",        name: "Kit evento",         items: ["Lanyard", "Badge personalizzati", "Braccialetti", "Totem", "Bandiere", "Gift bag"], once: 3195 },
      { id: "me_kit",           name: "Kit completo",       items: ["Merchandising completo su misura"],                                            once: 2500, from: true }
    ]
  },

  /* --- Graphics+ (video) -------------------------------------------- */
  graphics_video: {
    id: "graphics_video", label: "Graphics+",
    bundles: [
      { id: "gr_identita",  name: "Identità evento",   items: ["Logo evento", "Identità grafica evento", "Brand kit evento"],                                                          once: 3870 },
      { id: "gr_promo",     name: "Promozione",        items: ["Locandina", "Flyer", "Manifesto", "Banner web", "Banner stampa", "ADV social"],                                        once: 1980 },
      { id: "gr_socialkit", name: "Social kit",        items: ["Template post", "Template stories", "Carousel", "Countdown", "Speaker card", "Sponsor card"],                          once: 1350 },
      { id: "gr_materiali", name: "Materiali evento",  items: ["Accrediti", "Badge", "Pass staff", "Pass VIP", "Programma evento", "Mappa evento", "Segnaletica", "Totem"],            once: 2925 },
      { id: "gr_palco",     name: "Palco & Digitale",  items: ["Slide palco", "Grafiche LED wall", "Overlay streaming"],                                                               once: 2070 },
      { id: "gr_post",      name: "Post evento",       items: ["Report grafico", "Album fotografico", "Ringraziamenti sponsor", "Certificati partecipazione"],                          once: 1665 }
    ]
  }
};

/* ============================================================
   CATALOGO SERVIZI
   Ogni servizio ha una o più "linee"; ogni linea ha i tier.
   Package: { id, name, tier, from, to, unit, highlights, addons }
   wizard: domande iniziali. Option: { id, label, desc?,
     line? (imposta la linea), tier? (livello consigliato) }
   ============================================================ */
const HL_VIDEO = {
  start: ["Brief e pianificazione riprese", "1 operatore video, riprese monocamera", "Montaggio professionale", "Color correction e ottimizzazione audio", "Titolazione base", "Versione HD e web"],
  pro: ["Pre-produzione completa con shot list", "2 operatori, riprese multicamera", "Interviste e backstage", "Color correction accurata", "Motion graphics base", "Aftermovie / highlight video", "Versioni social"],
  premium: ["Scrittura creativa e storyboard", "Fotografo dedicato, drone (ove consentito)", "Montaggio cinematografico", "Color grading professionale", "Sound design e mix audio", "Motion graphics e logo animation", "VFX base e sottotitoli", "Formati 16:9 · 9:16 · 1:1, file master"],
  luxury: ["Concept creativo e location scouting", "Regista dedicato e direttore della fotografia", "Fino a 3 operatori, fino a 2 fotografi", "Interviste premium, backstage completo", "Color grading avanzato, sound design professionale", "Motion graphics premium, VFX", "Sottotitoli multilingua", "Aftermovie premium, highlight film, trailer e teaser", "Archivio completo delle riprese e backup"]
};

const SERVICES = [
  {
    id: "branding", name: "Branding & Identità", short: "Branding", icon: "pen-tool",
    tagline: "Identità visive costruite per durare: logo, sistema, strategia.",
    wizard: [
      { id: "who", question: "Chi sei?",
        options: [
          { id: "privato",  label: "Privato / libero professionista", desc: "Un'identità personale o una nuova attività individuale.", tier: "Start" },
          { id: "piccola",  label: "Piccola attività",                desc: "Negozio, ristorante, studio, realtà locale.",             tier: "Start" },
          { id: "pmi",      label: "PMI",                             desc: "Azienda con un team e un mercato da presidiare.",         tier: "Pro" },
          { id: "grande",   label: "Azienda strutturata",             desc: "Più sedi, più reparti, esigenze complesse.",              tier: "Premium" }
        ]},
      { id: "goal", question: "Da dove partiamo?",
        options: [
          { id: "nuovo",      label: "Parto da zero",              desc: "Serve un'identità nuova, costruita da capo.",              line: "identity" },
          { id: "rebranding", label: "Ho già un brand da rinnovare", desc: "Rivedere e rilanciare un'identità esistente.",           line: "rebranding" }
        ]}
    ],
    lines: [
      { id: "identity", name: "Brand Identity", packages: [
        { id: "brand_start", name: "Brand Identity Start", tier: "Start", from: 1500, to: 3000, unit: "once",
          highlights: ["Analisi dell'attività e del settore", "Logo principale con varianti complete", "Palette colori e tipografia", "Visual identity base ed elementi grafici", "Social kit essenziale", "Consegna file completa (PNG, SVG, AI, PDF…)", "Mini guida all'utilizzo del logo"],
          addons: [] },
        { id: "brand_pro", name: "Brand Identity Pro", tier: "Pro", from: 3500, to: 7000, unit: "once",
          highlights: ["Tutto Start", "Analisi competitor e target", "Logo system completo", "Visual system completo: pattern, icone, libreria grafica", "Brand assets: biglietti, carta intestata, template", "Mockup professionali", "Brand guidelines e brand manual (10–20 pagine)", "Motion logo premium"],
          addons: [] },
        { id: "brand_premium", name: "Brand Identity Premium", tier: "Premium", from: 8000, to: 18000, unit: "once",
          highlights: ["Tutto Pro", "Workshop strategico con il team", "Strategia di brand: mission, vision, valori, tone of voice", "Strategia di comunicazione e piano editoriale iniziale", "Direzione creativa: moodboard, linea fotografica, video e ADV", "Materiale corporate: presentazione, pitch deck, company profile", "Brand manual completo (30–50 pagine)", "Piano di evoluzione del brand a 12 mesi"],
          addons: [] }
      ]},
      { id: "rebranding", name: "Rebranding", packages: [
        { id: "rebranding", name: "Rebranding", tier: "Base", from: 5000, to: 12000, unit: "once",
          highlights: ["Audit completo: brand, comunicazione, materiali, social, sito", "Nuova identità e nuovo posizionamento", "Restyling del logo e logo system", "Nuova palette, tipografia e visual system", "Template social e materiali aggiornati", "Brand guidelines e brand manual aggiornati", "Cartella rebranding completa"],
          addons: [] },
        { id: "rebranding_pro", name: "Rebranding Pro", tier: "Pro", from: 12000, to: 30000, unit: "once",
          highlights: ["Tutto Rebranding", "Nuova strategia, storytelling e tone of voice", "Change management: piano di transizione e cronoprogramma", "Comunicazione interna, clienti e partner", "Aggiornamento completo dei materiali", "Lancio: motion logo premium, video, shooting, campagna social e ADV", "Supervisione creativa e controllo coerenza", "Supporto 30 giorni (60/90 opzionali)"],
          addons: [] }
      ]}
    ]
  },
  {
    id: "web", name: "Web & Digital", short: "Web", icon: "monitor",
    tagline: "Siti, e-commerce e landing progettati per convertire con eleganza.",
    wizard: [
      { id: "who", question: "Chi sei?",
        options: [
          { id: "privato", label: "Privato / libero professionista", desc: "Un sito personale o per la tua attività individuale.", tier: "Start" },
          { id: "piccola", label: "Piccola attività",                desc: "Negozio, ristorante, studio, realtà locale.",           tier: "Start" },
          { id: "pmi",     label: "PMI",                             desc: "Azienda con un team e un mercato da presidiare.",       tier: "Pro" },
          { id: "grande",  label: "Azienda strutturata",             desc: "Più sedi, più reparti, esigenze complesse.",            tier: "Premium" }
        ]},
      { id: "need", question: "Cosa ti serve?",
        options: [
          { id: "sito",    label: "Un sito",                  desc: "Presentare l'attività e farsi trovare.",            line: "website" },
          { id: "ecom",    label: "Vendere online",           desc: "Un e-commerce con catalogo e pagamenti.",           line: "ecommerce" },
          { id: "landing", label: "Una campagna",             desc: "Landing page e funnel per una campagna.",           line: "landing" }
        ]}
    ],
    lines: [
      { id: "website", name: "Website", packages: [
        { id: "web_start", name: "Website Start", tier: "Start", from: 1500, to: 3500, unit: "once",
          highlights: ["Landing / one-page responsive", "Struttura e navigazione essenziali", "Dominio, hosting, SSL e backup", "Inserimento testi e immagini", "SEO base e indicizzazione Google", "Analytics", "Consegna con manuale d'uso"],
          addons: ["web_site"] },
        { id: "web_pro", name: "Website Pro", tier: "Pro", from: 3500, to: 5000, unit: "once",
          highlights: ["Tutto Start", "Analisi competitor e architettura del sito", "Sito multipagina: blog, FAQ, portfolio, team", "SEO completo", "Newsletter e automazioni email", "CRM e prenotazioni base", "Sicurezza avanzata", "Accessi amministratore e video tutorial"],
          addons: ["web_site"] },
        { id: "web_premium", name: "Website Premium", tier: "Premium", from: 5000, to: 10000, unit: "once",
          highlights: ["Tutto Pro", "Workshop iniziale e UX/UI dedicati: wireframe e prototipo", "Sito multipagina avanzato", "Multilingua e area riservata", "Funzionalità su misura: prenotazioni, chat, lead magnet", "SEO avanzata e tecnica (Schema.org, Core Web Vitals)", "Performance: CDN, cache, speed optimization", "Dashboard, heatmap e analytics avanzate"],
          addons: ["web_site"] }
      ]},
      { id: "ecommerce", name: "E-commerce", packages: [
        { id: "ecom_start", name: "E-commerce Start", tier: "Start", from: 4000, to: 7000, unit: "once",
          highlights: ["Catalogo prodotti e schede", "Checkout e pagamenti: Stripe, PayPal, bonifico", "Dominio, hosting, SSL e sicurezza", "SEO base", "Newsletter e automazioni", "Analytics"],
          addons: ["photo_ecom", "video_landing"] },
        { id: "ecom_pro", name: "E-commerce Pro", tier: "Pro", from: 8000, to: 14000, unit: "once",
          highlights: ["Tutto Start", "Analisi del catalogo", "Filtri, tag e varianti prodotto", "Checkout avanzato, coupon e gift card", "CRM e recupero carrello", "Email automatiche e pixel Meta", "Blog aziendale", "Dashboard vendite"],
          addons: ["photo_ecom", "video_landing"] },
        { id: "ecom_premium", name: "E-commerce Premium", tier: "Premium", from: 15000, to: 30000, unit: "once",
          highlights: ["Tutto Pro", "UX analysis e customer journey", "Catalogo avanzato con ricerca intelligente", "Cross-selling, upselling e prodotti correlati", "Loyalty program e segmentazione clienti", "SEO avanzata, CDN e speed optimization", "Dashboard completa con KPI e report", "Backup cloud"],
          addons: ["photo_ecom", "video_landing"] }
      ]},
      { id: "landing", name: "Landing Campaign", packages: [
        { id: "landing", name: "Landing Campaign", tier: "Base", from: 1000, to: 2500, unit: "once",
          highlights: ["Landing page con copywriting", "CTA e form", "SEO base", "Pixel Meta e Google Analytics", "Newsletter", "Tracciamento conversioni"],
          addons: ["video_landing", "ai_landing", "design_landing"] },
        { id: "landing_pro", name: "Landing Campaign Pro", tier: "Pro", from: 3000, to: 6500, unit: "once",
          highlights: ["Workshop e strategia di lead generation", "Funnel design: landing, thank you page, upsell e downsell", "Email marketing e automazioni", "Lead magnet e CRM", "A/B test e CRO", "Heatmap e report conversioni"],
          addons: ["photo_landing", "ai_landing", "design_landing"] }
      ]}
    ]
  },
  {
    id: "social", name: "Social Media", short: "Social", icon: "share-2",
    tagline: "Presenza continua, contenuti curati, crescita misurabile.",
    wizard: [
      { id: "who", question: "Chi sei?",
        options: [
          { id: "privato", label: "Privato / creator",    desc: "Un profilo personale da far crescere con metodo.",   tier: "Start" },
          { id: "piccola", label: "Piccola attività",     desc: "Negozio, ristorante, studio, realtà locale.",        tier: "Start" },
          { id: "pmi",     label: "PMI",                  desc: "Azienda con un team e un mercato da presidiare.",    tier: "Pro" },
          { id: "grande",  label: "Azienda strutturata",  desc: "Più canali, più mercati, presenza continua.",        tier: "Premium" }
        ]}
    ],
    lines: [
      { id: "social", name: "Gestione Social", packages: [
        { id: "social_start", name: "Social Start", tier: "Start", from: 900, to: 1800, unit: "month",
          highlights: ["Analisi attività e competitor", "Strategia e piano editoriale base", "Ottimizzazione profili: bio, link, highlight", "Produzione contenuti: reel, carousel, stories, foto", "Copywriting, caption e hashtag", "Pubblicazione e programmazione", "Report mensile base"],
          addons: ["linkedin", "ai_social", "merch_social", "web_social"] },
        { id: "social_pro", name: "Social Pro", tier: "Pro", from: 2000, to: 3500, unit: "month",
          highlights: ["Tutto Start", "Analisi competitor avanzata e benchmark", "Piano editoriale completo e content pillars", "Funnel social", "Shooting professionale", "TikTok, shorts e behind the scenes", "Community management: commenti, messaggi, moderazione", "Analytics e report avanzato"],
          addons: ["linkedin", "ai_social", "merch_social", "web_social"] },
        { id: "social_premium", name: "Social Premium", tier: "Premium", from: 4000, to: 8000, unit: "month",
          highlights: ["Tutto Pro", "Workshop e strategia annuale", "Customer journey e posizionamento", "Strategie dedicate per video, stories e reels", "Produzione premium: reel premium, video corporate, UGC, testimonial", "Community management premium e gestione crisi", "Gestione recensioni e customer care social", "Dashboard KPI e report dettagliato", "Consulenza strategica e call mensile"],
          addons: ["linkedin", "ai_social", "merch_social", "web_social"] }
      ]}
    ]
  },
  {
    id: "video", name: "Video", short: "Video", icon: "video",
    tagline: "Produzioni su misura: eventi, fashion, corporate, commercial.",
    wizard: [
      { id: "who", question: "Chi sei?",
        options: [
          { id: "privato", label: "Privato",              desc: "Un progetto personale o un evento privato.",        tier: "Start" },
          { id: "azienda", label: "Azienda",              desc: "Una produzione per la tua impresa.",                tier: "Pro" },
          { id: "ente",    label: "Ente / organizzazione", desc: "Istituzione, associazione, organizzatore.",        tier: "Pro" }
        ]},
      { id: "type", question: "Per cosa ti serve il video?",
        options: [
          { id: "evento",     label: "Un evento",               desc: "Copertura completa di un evento.",                line: "eventi" },
          { id: "fashion",    label: "Fashion & musica",        desc: "Editoriali, sfilate, live, videoclip.",           line: "fashion" },
          { id: "corporate",  label: "Comunicazione aziendale", desc: "Video istituzionali, interviste, presentazioni.", line: "corporate" },
          { id: "commercial", label: "Campagna pubblicitaria",  desc: "Spot e contenuti ADV per una campagna.",          line: "commercial" }
        ]}
    ],
    lines: [
      { id: "eventi", name: "Eventi", packages: [
        { id: "ev_start",   name: "Video Start · Eventi",   tier: "Start",   from: 900,  to: 1500,  unit: "once", highlights: HL_VIDEO.start,   addons: ["web_video_eventi", "social_video", "ai_video", "merch_full", "graphics_video"] },
        { id: "ev_pro",     name: "Video Pro · Eventi",     tier: "Pro",     from: 1800, to: 3000,  unit: "once", highlights: HL_VIDEO.pro,     addons: ["web_video_eventi", "social_video", "ai_video", "merch_full", "graphics_video"] },
        { id: "ev_premium", name: "Video Premium · Eventi", tier: "Premium", from: 3500, to: 6500,  unit: "once", highlights: HL_VIDEO.premium, addons: ["web_video_eventi", "social_video", "ai_video", "merch_full", "graphics_video"] },
        { id: "ev_luxury",  name: "Video Luxury · Eventi",  tier: "Luxury",  from: 7000, to: 15000, unit: "once", highlights: HL_VIDEO.luxury,  addons: ["web_video_eventi", "social_video", "ai_video", "merch_full", "graphics_video"] }
      ]},
      { id: "fashion", name: "Fashion & Music", packages: [
        { id: "fm_start",   name: "Video Start · Fashion & Music",   tier: "Start",   from: 900,  to: 1500,  unit: "once", highlights: HL_VIDEO.start,   addons: ["web_video_std", "social_video", "ai_video", "merch_full", "graphics_video"] },
        { id: "fm_pro",     name: "Video Pro · Fashion & Music",     tier: "Pro",     from: 1800, to: 3000,  unit: "once", highlights: HL_VIDEO.pro,     addons: ["web_video_std", "social_video", "ai_video", "merch_full", "graphics_video"] },
        { id: "fm_premium", name: "Video Premium · Fashion & Music", tier: "Premium", from: 3500, to: 6500,  unit: "once", highlights: HL_VIDEO.premium, addons: ["web_video_std", "social_video", "ai_video", "merch_full", "graphics_video"] },
        { id: "fm_luxury",  name: "Video Luxury · Fashion & Music",  tier: "Luxury",  from: 7000, to: 15000, unit: "once", highlights: HL_VIDEO.luxury,  addons: ["web_video_std", "social_video", "ai_video", "merch_full", "graphics_video"] }
      ]},
      { id: "corporate", name: "Corporate", packages: [
        { id: "corp_start",   name: "Video Start · Corporate",   tier: "Start",   from: 900,  to: 1500,  unit: "once", highlights: HL_VIDEO.start,   addons: ["web_video_corp", "social_video", "ai_video", "merch_full", "graphics_video"] },
        { id: "corp_pro",     name: "Video Pro · Corporate",     tier: "Pro",     from: 1800, to: 3000,  unit: "once", highlights: HL_VIDEO.pro,     addons: ["web_video_corp", "social_video", "ai_video", "merch_full", "graphics_video"] },
        { id: "corp_premium", name: "Video Premium · Corporate", tier: "Premium", from: 3500, to: 6500,  unit: "once", highlights: HL_VIDEO.premium, addons: ["web_video_corp", "social_video", "ai_video", "merch_full", "graphics_video"] },
        { id: "corp_luxury",  name: "Video Luxury · Corporate",  tier: "Luxury",  from: 7000, to: 15000, unit: "once", highlights: HL_VIDEO.luxury,  addons: ["web_video_corp", "social_video", "ai_video", "merch_full", "graphics_video"] }
      ]},
      { id: "commercial", name: "Commercial / ADV", packages: [
        { id: "adv_start",   name: "Video Start · Commercial",   tier: "Start",   from: 900,  to: 1500,  unit: "once", highlights: HL_VIDEO.start,   addons: ["web_video_std", "social_video_adv", "ai_video", "merch_full", "graphics_video"] },
        { id: "adv_pro",     name: "Video Pro · Commercial",     tier: "Pro",     from: 1800, to: 3000,  unit: "once", highlights: HL_VIDEO.pro,     addons: ["web_video_std", "social_video_adv", "ai_video", "merch_full", "graphics_video"] },
        { id: "adv_premium", name: "Video Premium · Commercial", tier: "Premium", from: 3500, to: 6500,  unit: "once", highlights: HL_VIDEO.premium, addons: ["web_video_std", "social_video_adv", "ai_video", "merch_full", "graphics_video"] },
        { id: "adv_luxury",  name: "Video Luxury · Commercial",  tier: "Luxury",  from: 7000, to: 15000, unit: "once", highlights: HL_VIDEO.luxury,  addons: ["web_video_std", "social_video_adv", "ai_video", "merch_full", "graphics_video"] }
      ]}
    ]
  },
  {
    id: "podcast", name: "Podcast", short: "Podcast", icon: "mic",
    tagline: "Dallo studio alla distribuzione: il tuo podcast, fatto bene.",
    note: "Prezzi per episodio · minimo 4 episodi",
    wizard: [
      { id: "who", question: "Chi sei?",
        options: [
          { id: "creator", label: "Privato / creator",  desc: "Un progetto personale da avviare o far crescere.",  tier: "Start" },
          { id: "azienda", label: "Azienda",            desc: "Un podcast di brand o di settore.",                 tier: "Pro" },
          { id: "media",   label: "Media / ente",       desc: "Produzione editoriale o istituzionale.",            tier: "Premium" }
        ]}
    ],
    lines: [
      { id: "podcast", name: "Podcast", packages: [
        { id: "pod_start", name: "Podcast Start", tier: "Start", from: 700, to: 1200, unit: "episode", minUnits: 4,
          highlights: ["Pianificazione puntata e scaletta", "Studio podcast, multicamera (2 camere)", "Registrazione audio e video", "Pulizia audio e color correction", "Montaggio professionale", "Copertina episodio", "Distribuzione: YouTube e Spotify"],
          addons: ["web_podcast", "social_podcast", "ai_podcast", "merch_full"] },
        { id: "pod_pro", name: "Podcast Pro", tier: "Pro", from: 1300, to: 2500, unit: "episode", minUnits: 4,
          highlights: ["Pianificazione della stagione", "Studio podcast, multicamera (3 camere)", "Registrazione audio professionale", "Grafiche personalizzate", "Color correction e audio ottimizzato", "Motion graphics, intro e outro", "Upload YouTube, Spotify, Apple Podcast, Amazon Music", "RSS feed e thumbnail YouTube"],
          addons: ["web_podcast", "social_podcast", "ai_podcast", "merch_full"] },
        { id: "pod_premium", name: "Podcast Premium", tier: "Premium", from: 2800, to: 5000, unit: "episode", minUnits: 4,
          highlights: ["Concept creativo e production design", "Scenografia e studio podcast premium", "Multicamera (4 camere) con regia dedicata", "Illuminotecnica professionale e operatori dedicati", "Streaming Twitch / YouTube e registrazione live", "Post-produzione completa: color grading, sound design, mix", "Motion graphics premium, intro e outro animate", "Distribuzione completa e thumbnail personalizzate"],
          addons: ["web_podcast", "social_podcast", "ai_podcast", "merch_full"] }
      ]}
    ]
  },
  {
    id: "personal", name: "Personal Branding", short: "Personal", icon: "user",
    tagline: "La tua immagine pubblica, gestita con metodo e discrezione.",
    wizard: [
      { id: "who", question: "Chi sei?",
        options: [
          { id: "emergente",     label: "Creator / figura emergente",        desc: "Stai costruendo la tua presenza pubblica.",            tier: "Start" },
          { id: "professionista", label: "Imprenditore / professionista",    desc: "La tua immagine sostiene la tua attività.",            tier: "Pro" },
          { id: "pubblica",      label: "Figura pubblica",                   desc: "Esposizione alta, serve gestione completa.",           tier: "Premium" }
        ]}
    ],
    lines: [
      { id: "personal", name: "Personal Brand", packages: [
        { id: "pers_start", name: "Personal Brand Start", tier: "Start", from: 900, to: 1800, unit: "month",
          highlights: ["Analisi del profilo e definizione obiettivi", "Strategia e posizionamento personale", "Tone of voice e piano editoriale base", "Shooting fotografico e video", "2 reel professionali e foto profilo", "Ottimizzazione Instagram e LinkedIn", "Bio professionale e link in bio", "Call strategica iniziale"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] },
        { id: "pers_pro", name: "Personal Brand Pro", tier: "Pro", from: 2000, to: 3500, unit: "month",
          highlights: ["Tutto Start", "Analisi competitor e audience", "Content pillars e storytelling personale", "Shooting mensile foto e video", "6 reel, carousel e stories", "Script per reel e podcast", "Gestione profilo, messaggi e community", "Newsletter e articoli LinkedIn", "Call mensile"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] },
        { id: "pers_premium", name: "Personal Brand Premium", tier: "Premium", from: 4000, to: 7000, unit: "month", proposed: true,
          highlights: ["Tutto Pro", "Workshop e strategia annuale", "Brand identity personale", "Piano media e collaborazioni", "Shooting premium", "12 reel, video premium, podcast clip, mini documentario", "Lifestyle content", "Community premium e crisis management", "Coaching personale e supervisione creativa"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] }
      ]}
    ]
  },
  {
    id: "sport", name: "Sport & Team", short: "Sport", icon: "trophy",
    tagline: "Atleti, squadre e società: comunicazione all'altezza del campo.",
    wizard: [
      { id: "who", question: "Chi sei?",
        options: [
          { id: "atleta", label: "Atleta",             desc: "La tua immagine sportiva, gestita da professionisti.", line: "atleta" },
          { id: "team",   label: "Società / squadra",  desc: "La comunicazione del club, dentro e fuori dal campo.", line: "team" }
        ]},
      { id: "level", question: "A che livello?",
        options: [
          { id: "emergente",   label: "Emergente",        desc: "Stai costruendo il tuo percorso.",                 tier: "Start" },
          { id: "competitivo", label: "Competitivo",      desc: "Livello alto, sponsor e visibilità in crescita.",  tier: "Pro" },
          { id: "pro",         label: "Professionistico", desc: "Massima esposizione, gestione completa.",          tier: "Premium" }
        ]}
    ],
    lines: [
      { id: "atleta", name: "Atleta", packages: [
        { id: "sport_start", name: "Sport Brand Start", tier: "Start", from: 900, to: 1500, unit: "month",
          highlights: ["Analisi dell'atleta e definizione obiettivi", "Strategia e posizionamento", "Piano editoriale base", "Shooting sportivo", "3 reel e foto allenamento", "Contenuti, copywriting e stories", "Highlights", "Media kit base e consulenza"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] },
        { id: "sport_pro", name: "Sport Brand Pro", tier: "Pro", from: 2000, to: 4000, unit: "month",
          highlights: ["Tutto Start", "Analisi sponsor e competitor", "Content pillars e strategia contenuti", "Shooting mensile", "8 reel, video allenamenti e interviste", "Script video e reel", "Newsletter e articoli LinkedIn", "Media kit e presentazione sponsor", "Call strategica"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] },
        { id: "sport_premium", name: "Sport Brand Premium", tier: "Premium", from: 4500, to: 9000, unit: "month",
          highlights: ["Tutto Pro", "Strategia annuale e piano media", "Piano PR e collaborazioni", "Shooting mensile premium", "8 reel, video premium e interviste", "Crisis management", "Coaching personale", "Media kit completo e presentazione sponsor", "Supervisione creativa"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] }
      ]},
      { id: "team", name: "Team & Società", packages: [
        { id: "team_start", name: "Team Brand Start", tier: "Start", from: 2000, to: 3500, unit: "month",
          highlights: ["Analisi società, squadra e tifoseria", "Piano di comunicazione base", "Tone of voice e piano social", "Calendario stagione", "Shooting squadra, foto ufficiali e individuali", "Video presentazione squadra", "4 reel, grafiche partita e stories match day", "Media kit base"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] },
        { id: "team_pro", name: "Team Brand Pro", tier: "Pro", from: 4500, to: 7000, unit: "month",
          highlights: ["Tutto Start", "Analisi competitor e sponsor", "Strategia stagione e piano sponsor", "Video partita e match coverage", "Interviste e backstage", "8 reel", "Community management", "Newsletter e sponsor deck", "Call strategica iniziale e consulenza"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] },
        { id: "team_premium", name: "Team Brand Premium", tier: "Premium", from: 8000, to: 15000, unit: "month",
          highlights: ["Tutto Pro", "Workshop società e piano comunicazione annuale", "Strategia sponsor e piano merchandising", "Shooting premium, mini serie e documentary di stagione", "Drone, streaming e live coverage", "Highlight professionali e 15 reel", "Community premium", "Sponsor management e press office", "Investor deck"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] }
      ]}
    ]
  },
  {
    id: "artist", name: "Artisti & Musica", short: "Musica", icon: "music",
    tagline: "Release, live e immagine: una direzione artistica coerente.",
    wizard: [
      { id: "stage", question: "A che punto sei?",
        options: [
          { id: "emergente", label: "Emergente",          desc: "Le prime release, la prima immagine coerente.",       tier: "Start" },
          { id: "crescita",  label: "In crescita",        desc: "Pubblico in aumento, serve una direzione artistica.", tier: "Pro" },
          { id: "affermato", label: "Affermato / team",   desc: "Progetto strutturato, gestione completa.",            tier: "Premium" }
        ]}
    ],
    lines: [
      { id: "artist", name: "Artist Brand", packages: [
        { id: "artist_start", name: "Artist Brand Start", tier: "Start", from: 1200, to: 2000, unit: "month",
          highlights: ["Analisi del progetto artistico e delle piattaforme", "Posizionamento e definizione del pubblico", "Direzione immagine e moodboard", "Visual identity base", "Shooting fotografico", "Live session e performance video", "4 reel, stories e cover release", "Bio e link in bio"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] },
        { id: "artist_pro", name: "Artist Brand Pro", tier: "Pro", from: 2800, to: 5000, unit: "month",
          highlights: ["Tutto Start", "Analisi competitor e piano release", "Direzione artistica e concept visuale", "Videoclip e behind the scenes", "Shooting premium", "8 reel", "Gestione social e piano editoriale", "EPK, press kit e media kit", "Call mensile"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] },
        { id: "artist_premium", name: "Artist Team Premium", tier: "Premium", from: 6000, to: 12000, unit: "month",
          highlights: ["Tutto Pro", "Workshop creativo e strategia annuale", "Direzione artistica e supervisione creativa", "Concept album e videoclip cinematico", "Live session premium e documentary", "15 reel", "Gestione completa social e community", "Ufficio stampa, PR e pitch festival / label", "Piani Spotify, YouTube, TikTok, Instagram", "Campagna di lancio e coaching artistico"],
          addons: ["web_personal", "social_podcast", "ai_personal", "merch_full"] }
      ]}
    ]
  }
];

/* ---- Team (pagina studio) ---------------------------------- */
const TEAM = [
  { id: "poloni",      initials: "FP", name: "F. Poloni",      role: "Direzione" },
  { id: "macchi",      initials: "DM", name: "D. Macchi",      role: "Branding & Video" },
  { id: "cirrincione", initials: "DC", name: "D. Cirrincione", role: "Web & AI" },
  { id: "benedetti",   initials: "FB", name: "F. Benedetti",   role: "Social & Contenuti" },
  { id: "zaffalon",    initials: "TZ", name: "T. Zaffalon",    role: "Web & Digital" },
  { id: "agueci",      initials: "MA", name: "M. Agueci",      role: "Branding & Design" }
];

/* ---- Helpers ------------------------------------------------ */
function formatPrice(amountCHF, currencyCode) {
  const c = CURRENCIES[currencyCode] || CURRENCIES.CHF;
  const value = Math.round(amountCHF * c.rateFromCHF);
  const grouped = value.toLocaleString("en-US").replace(/,/g, c.thousands);
  return `${grouped} ${c.symbol}`;
}

const UNIT_SUFFIX = { once: "", month: "/mese", episode: "/episodio" };

function formatRange(pkg, currencyCode) {
  const c = CURRENCIES[currencyCode] || CURRENCIES.CHF;
  const lo = Math.round(pkg.from * c.rateFromCHF).toLocaleString("en-US").replace(/,/g, c.thousands);
  const hi = Math.round(pkg.to * c.rateFromCHF).toLocaleString("en-US").replace(/,/g, c.thousands);
  return `${lo} – ${hi} ${c.symbol}${UNIT_SUFFIX[pkg.unit] || ""}`;
}

function getService(serviceId) {
  return SERVICES.find(s => s.id === serviceId) || null;
}

function getPackage(pkgId) {
  for (const s of SERVICES) for (const l of s.lines) {
    const p = l.packages.find(p => p.id === pkgId);
    if (p) return { ...p, service: s.id, line: l.id };
  }
  return null;
}

function getFamily(famId) { return ADDON_FAMILIES[famId] || null; }

function getBundle(famId, bundleId) {
  const fam = ADDON_FAMILIES[famId];
  if (!fam) return null;
  return fam.bundles.find(b => b.id === bundleId) || null;
}

/* Esposizione globale (script tag, nessun bundler) */
window.ATTO_DATA = {
  CURRENCIES, SERVICES, ADDON_FAMILIES, TEAM, BUNDLE_DISCOUNT,
  formatPrice, formatRange, getService, getPackage, getFamily, getBundle, UNIT_SUFFIX
};
