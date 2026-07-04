/* =============================================================
   ATTO — Data layer (v2)
   Fonte di verità: docs/++ Pacchetti (con specifiche).xlsx
   (estratto e verificato con Tommy — vedi VERIFICA-DATI.md).
   Prezzi in CHF. unit: "once" | "month" | "episode".
   Le feature elencate sono highlights curati; il dettaglio
   completo resta nel foglio xlsx.
   ============================================================= */

/* ---- Valute ------------------------------------------------ */
const CURRENCIES = {
  CHF: { code: "CHF", rateFromCHF: 1,    symbol: "CHF", thousands: "'" },
  EUR: { code: "EUR", rateFromCHF: 1.05, symbol: "€",   thousands: "." }
};

/* ============================================================
   FAMIGLIE ADD-ON
   type:
     "items" — voci singole con checkbox
     "block" — blocco unico attivabile, prezzo "da X"
     "tiers" — scelta di un livello (es. Photo+ e-commerce)
   unit voce: "once" (default) | "month" | "each"
   ============================================================ */
const ADDON_FAMILIES = {

  /* --- Add-on sito (Website Start/Pro/Premium) --------------- */
  web_site: {
    id: "web_site", label: "Add-on sito", type: "items",
    items: [
      { id: "blog",            name: "Blog",                    price: 1000 },
      { id: "blog_adv",        name: "Blog avanzato",           price: 1500 },
      { id: "area_riservata",  name: "Area riservata",          price: 2000 },
      { id: "prenotazioni",    name: "Prenotazioni",            price: 1500 },
      { id: "crm",             name: "CRM",                     price: 1500 },
      { id: "crm_premium",     name: "CRM Premium",             price: 2500 },
      { id: "multilingua",     name: "Multilingua",             price: 500, unit: "each", suffix: "/lingua" },
      { id: "area_download",   name: "Area download",           price: 500 },
      { id: "chat_live",       name: "Chat Live",               price: 1000 },
      { id: "whatsapp",        name: "WhatsApp Business",       price: 300 },
      { id: "gmaps",           name: "Google Maps",             price: 200 },
      { id: "pixel_meta",      name: "Pixel Meta",              price: 250 },
      { id: "ganalytics",      name: "Google Analytics",        price: 300 },
      { id: "gtm",             name: "Google Tag Manager",      price: 500 },
      { id: "dash_kpi",        name: "Dashboard KPI",           price: 800 },
      { id: "automazioni",     name: "Automazioni",             price: 800,  from: true },
      { id: "newsletter",      name: "Newsletter Setup",        price: 600 },
      { id: "email_mkt",       name: "Email Marketing",         price: 900,  from: true },
      { id: "funnel",          name: "Funnel",                  price: 2500, from: true }
    ]
  },

  /* --- Photo+ per E-commerce (a livelli) ---------------------- */
  photo_ecom: {
    id: "photo_ecom", label: "Photo+", type: "tiers",
    tiers: [
      { id: "photo_start",   name: "Photo+ Start",   price: 500,  from: true,
        feats: ["Shooting prodotti", "Fondo bianco", "Color correction base", "Esportazione web", "JPG HD"] },
      { id: "photo_pro",     name: "Photo+ Pro",     price: 900,  from: true,
        feats: ["Tutto Start", "Color grading accurato", "Ritocco professionale", "Scontorno prodotti", "Ombre realistiche", "Compressione web", "Alta risoluzione"] },
      { id: "photo_premium", name: "Photo+ Premium", price: 1800, from: true,
        feats: ["Tutto Pro", "Illuminotecnica professionale", "Set fotografico dedicato", "Foto ambientate (lifestyle)", "Dettagli macro", "Foto 360° (se richieste)", "Ottimizzazione e-commerce", "Archivio organizzato", "Backup cloud"] }
    ]
  },

  /* --- Video+ (Landing Campaign & E-commerce) — blocco -------- */
  video_landing: {
    id: "video_landing", label: "Video+", type: "block", price: 1500, from: true,
    feats: ["Hero video", "Video prodotto", "Video servizio", "Video testimonial", "Montaggio", "Color grading"]
  },

  /* --- Photo+ per Landing Campaign Pro — blocco ---------------- */
  photo_landing: {
    id: "photo_landing", label: "Photo+", type: "block", price: 900, from: true,
    feats: ["Shooting dedicato", "Foto prodotto", "Foto ambiente", "Color grading", "Ritocco"]
  },

  /* --- Design+ (Landing Campaign) — blocco --------------------- */
  design_landing: {
    id: "design_landing", label: "Design+", type: "block", price: 500, from: true,
    feats: ["Grafica personalizzata", "Icone", "Infografiche", "Illustrazioni", "Mockup"]
  },

  /* --- AI+ (varianti per gruppo) -------------------------------- */
  ai_landing: {
    id: "ai_landing", label: "AI+", type: "items",
    items: [
      { id: "ai_images", name: "AI Images", price: 400 },
      { id: "ai_ads",    name: "AI Ads",    price: 600 },
      { id: "ai_copy",   name: "AI Copy",   price: 500 },
      { id: "ai_video",  name: "AI Video",  price: 900 },
      { id: "ai_voice",  name: "AI Voice",  price: 300 }
    ]
  },
  ai_social: {
    id: "ai_social", label: "AI+", type: "items",
    items: [
      { id: "ai_images",   name: "AI Images",   price: 400 },
      { id: "ai_ads",      name: "AI Ads",      price: 600 },
      { id: "ai_carousel", name: "AI Carousel", price: 500 },
      { id: "ai_video",    name: "AI Video",    price: 900 },
      { id: "ai_voice",    name: "AI Voice",    price: 300 }
    ]
  },
  ai_video: {
    id: "ai_video", label: "AI+", type: "items",
    items: [
      { id: "ai_poster",     name: "AI Poster evento",        price: 500 },
      { id: "ai_visual",     name: "AI Visual campagne",      price: 700 },
      { id: "ai_trailer",    name: "AI Trailer",              price: 900 },
      { id: "ai_reel",       name: "AI Reel",                 price: 400 },
      { id: "ai_voiceover",  name: "AI Voice Over",           price: 300 },
      { id: "ai_avatar",     name: "AI Avatar presentatore",  price: 800 },
      { id: "ai_trad",       name: "AI Traduzioni",           price: 300 },
      { id: "ai_subs",       name: "AI Sottotitoli",          price: 250 },
      { id: "ai_repurpose",  name: "AI Repurposing contenuti",price: 700 },
      { id: "ai_clips",      name: "AI Clip automatiche",     price: 500 },
      { id: "ai_photo_enh",  name: "AI Foto enhancement",     price: 300 },
      { id: "ai_upscale",    name: "AI Video upscaling",      price: 500 }
    ]
  },
  ai_podcast: {
    id: "ai_podcast", label: "AI+", type: "items",
    items: [
      { id: "ai_intro",     name: "AI Intro Video",       price: 500 },
      { id: "ai_outro",     name: "AI Outro",             price: 300 },
      { id: "ai_voiceover", name: "AI Voice Over",        price: 300 },
      { id: "ai_avatar",    name: "AI Avatar host",       price: 800 },
      { id: "ai_clips",     name: "AI Clip automatiche",  price: 500 },
      { id: "ai_subs",      name: "AI Sottotitoli",       price: 250 },
      { id: "ai_trad",      name: "AI Traduzioni",        price: 300 },
      { id: "ai_repurpose", name: "AI Repurposing",       price: 700 },
      { id: "ai_thumb",     name: "AI Thumbnail",         price: 300 },
      { id: "ai_trailer",   name: "AI Trailer Podcast",   price: 700 }
    ]
  },
  ai_personal: {
    id: "ai_personal", label: "AI+", type: "items",
    items: [
      { id: "ai_intro",     name: "AI Intro Video",       price: 500 },
      { id: "ai_outro",     name: "AI Outro",             price: 300 },
      { id: "ai_voiceover", name: "AI Voice Over",        price: 300 },
      { id: "ai_avatar",    name: "AI Avatar host",       price: 800 },
      { id: "ai_clips",     name: "AI Clip automatiche",  price: 500 },
      { id: "ai_subs",      name: "AI Sottotitoli",       price: 250 },
      { id: "ai_trad",      name: "AI Traduzioni",        price: 300 },
      { id: "ai_repurpose", name: "AI Repurposing",       price: 700 },
      { id: "ai_thumb",     name: "AI Thumbnail",         price: 300 }
    ]
  },

  /* --- LinkedIn+ (Social) --------------------------------------- */
  linkedin: {
    id: "linkedin", label: "LinkedIn+", type: "items",
    items: [
      { id: "li_profilo",   name: "Ottimizzazione profilo",  price: 400 },
      { id: "li_azienda",   name: "Profilo aziendale",       price: 700 },
      { id: "li_piano",     name: "Piano editoriale",        price: 600 },
      { id: "li_gestione",  name: "Gestione LinkedIn",       price: 900,  unit: "month" },
      { id: "li_ceo",       name: "Personal branding CEO",   price: 1500, unit: "month" },
      { id: "li_leadgen",   name: "Lead generation",         price: 1500, from: true },
      { id: "li_employer",  name: "Employer branding",       price: 2500, from: true }
    ]
  },

  /* --- Web+ (varianti per gruppo) -------------------------------- */
  web_social: {
    id: "web_social", label: "Web+", type: "items",
    items: [
      { id: "landing",      name: "Landing page",      price: 1500 },
      { id: "website",      name: "Website",           price: 2500, approx: true },
      { id: "website_prem", name: "Website Premium",   price: 5000, approx: true },
      { id: "funnel",       name: "Funnel",            price: 2500 },
      { id: "seo",          name: "SEO",               price: 1000 },
      { id: "crm",          name: "CRM",               price: 2000 },
      { id: "newsletter",   name: "Newsletter",        price: 500 },
      { id: "automazioni",  name: "Automazioni",       price: 1000 }
    ]
  },
  web_video_eventi: {
    id: "web_video_eventi", label: "Web+", type: "items",
    items: [
      { id: "landing_ev",   name: "Landing page evento",  price: 1500 },
      { id: "sito_ev",      name: "Sito evento",          price: 3000 },
      { id: "iscrizioni",   name: "Pagina iscrizioni",    price: 500 },
      { id: "sponsor",      name: "Pagina sponsor",       price: 500 },
      { id: "programma",    name: "Programma online",     price: 500 },
      { id: "form_iscr",    name: "Form iscrizione",      price: 500 },
      { id: "biglietteria", name: "Biglietteria online",  price: 2500 },
      { id: "accrediti",    name: "Accrediti stampa",     price: 500 },
      { id: "gallery",      name: "Gallery post-evento",  price: 700 },
      { id: "download",     name: "Area download media",  price: 500 },
      { id: "streaming",    name: "Streaming integrato",  price: 2500 }
    ]
  },
  web_video_std: {
    id: "web_video_std", label: "Web+", type: "items",
    items: [
      { id: "landing_ev",   name: "Landing page evento",  price: 1500 },
      { id: "sito_ev",      name: "Sito evento",          price: 3500 },
      { id: "iscrizioni",   name: "Pagina iscrizioni",    price: 500 },
      { id: "sponsor",      name: "Pagina sponsor",       price: 500 },
      { id: "programma",    name: "Programma online",     price: 500 },
      { id: "form_iscr",    name: "Form iscrizione",      price: 500 },
      { id: "biglietteria", name: "Biglietteria online",  price: 2500 },
      { id: "accrediti",    name: "Accrediti stampa",     price: 500 },
      { id: "gallery",      name: "Gallery post-evento",  price: 700 },
      { id: "download",     name: "Area download media",  price: 500 },
      { id: "streaming",    name: "Streaming integrato",  price: 2500 }
    ]
  },
  web_video_corp: {
    id: "web_video_corp", label: "Web+", type: "items",
    items: [
      { id: "landing_ev",   name: "Landing page evento",  price: 1500 },
      { id: "sito_ev",      name: "Sito evento",          price: 3500 },
      { id: "iscrizioni",   name: "Pagina iscrizioni",    price: 700 },
      { id: "sponsor",      name: "Pagina sponsor",       price: 500 },
      { id: "programma",    name: "Programma online",     price: 500 },
      { id: "form_iscr",    name: "Form iscrizione",      price: 500 },
      { id: "biglietteria", name: "Biglietteria online",  price: 2500 },
      { id: "accrediti",    name: "Accrediti stampa",     price: 500 },
      { id: "gallery",      name: "Gallery post-evento",  price: 700 },
      { id: "download",     name: "Area download media",  price: 500 },
      { id: "streaming",    name: "Streaming integrato",  price: 2500 }
    ]
  },
  web_podcast: {
    id: "web_podcast", label: "Web+", type: "items",
    items: [
      { id: "landing_pod",  name: "Landing podcast",   price: 1500 },
      { id: "sito_pod",     name: "Sito podcast",      price: 3500 },
      { id: "archivio",     name: "Archivio episodi",  price: 1000, note: "il costo della banda cresce con il pubblico del podcast" },
      { id: "blog_pod",     name: "Blog podcast",      price: 1500 },
      { id: "newsletter",   name: "Newsletter",        price: 500 },
      { id: "seo_pod",      name: "SEO podcast",       price: 1000 },
      { id: "area_premium", name: "Area premium",      price: 2000 },
      { id: "crm",          name: "CRM",               price: 1500 }
    ]
  },
  web_personal: {
    id: "web_personal", label: "Web+", type: "items",
    items: [
      { id: "landing",      name: "Landing web",   price: 1500 },
      { id: "complex",      name: "Complex web",   price: 3500 },
      { id: "blog",         name: "Blog",          price: 1500 },
      { id: "newsletter",   name: "Newsletter",    price: 500 },
      { id: "seo",          name: "SEO",           price: 1000 },
      { id: "area_premium", name: "Area premium",  price: 2000 },
      { id: "crm",          name: "CRM",           price: 1500 }
    ]
  },

  /* --- Social+ (varianti) ----------------------------------------- */
  social_video: {
    id: "social_video", label: "Social+", type: "items",
    sections: true,
    items: [
      { section: "Strategia" },
      { id: "piano_ed",   name: "Piano editoriale evento",           price: 700 },
      { id: "piano_pub",  name: "Piano pubblicazione",               price: 500 },
      { id: "strat_lan",  name: "Strategia lancio",                  price: 900 },
      { section: "Produzione" },
      { id: "reel_extra", name: "Reel aggiuntivi",                   price: 1500 },
      { id: "stories",    name: "Stories live",                      price: 900 },
      { id: "backstage",  name: "Backstage",                         price: 1200 },
      { id: "interviste", name: "Interviste",                        price: 400 },
      { id: "sponsor",    name: "Contenuti sponsor",                 price: 300, unit: "each", suffix: "/reel" },
      { id: "speaker",    name: "Contenuti speaker",                 price: 1200 },
      { id: "espositori", name: "Contenuti espositori",              price: 1800 },
      { section: "Gestione" },
      { id: "gest_acc",   name: "Gestione account durante l'evento", price: 600 },
      { id: "community",  name: "Community management",              price: 400, unit: "each" },
      { id: "moderaz",    name: "Moderazione commenti",              price: 600 },
      { id: "copertura",  name: "Copertura live",                    price: 600 },
      { section: "Post evento" },
      { id: "recap",      name: "Recap social",                      price: 700 },
      { id: "carousel",   name: "Carousel fotografici",              price: 300 },
      { id: "ringraz",    name: "Ringraziamenti",                    price: 800 }
    ]
  },
  social_video_adv: {
    id: "social_video_adv", label: "Social+", type: "items",
    sections: true,
    items: [
      { section: "Strategia" },
      { id: "piano_ed",   name: "Piano editoriale evento",           price: 700 },
      { id: "piano_pub",  name: "Piano pubblicazione",               price: 500 },
      { id: "strat_lan",  name: "Strategia lancio",                  price: 900 },
      { section: "Produzione" },
      { id: "reel_extra", name: "Reel aggiuntivi",                   price: 1500 },
      { id: "stories",    name: "Stories live",                      price: 900 },
      { id: "backstage",  name: "Backstage",                         price: 1200 },
      { id: "interviste", name: "Interviste",                        price: 400 },
      { id: "sponsor",    name: "Contenuti sponsor",                 price: 300, unit: "each", suffix: "/reel" },
      { id: "speaker",    name: "Contenuti speaker",                 price: 1200 },
      { id: "espositori", name: "Contenuti espositori",              price: 1800 },
      { section: "Gestione" },
      { id: "gest_acc",   name: "Gestione account durante l'evento", price: 600 },
      { id: "community",  name: "Community management",              price: 400, unit: "each" },
      { id: "moderaz",    name: "Moderazione commenti",              price: 600 },
      { id: "copertura",  name: "Copertura live",                    price: 600 },
      { section: "Post evento" },
      { id: "recap",      name: "Recap social",                      price: 700 },
      { id: "carousel",   name: "Carousel fotografici",              price: 300 },
      { id: "highlight",  name: "Highlight reel",                    price: 800 }
    ]
  },
  social_podcast: {
    id: "social_podcast", label: "Social+", type: "items",
    items: [
      { id: "calendario",  name: "Calendario pubblicazioni", price: 500 },
      { id: "gest_yt",     name: "Gestione YouTube",         price: 700, unit: "month" },
      { id: "gest_ig",     name: "Gestione Instagram",       price: 700, unit: "month" },
      { id: "gest_sp",     name: "Gestione Spotify",         price: 400, unit: "month" },
      { id: "grafiche",    name: "Grafiche stories",         price: 300 },
      { id: "copertine",   name: "Copertine reel",           price: 250 },
      { id: "reel_promo",  name: "1 reel promozionale",      price: 300 },
      { id: "reel3",       name: "Pacchetto 3 reel",         price: 800 },
      { id: "reel5",       name: "Pacchetto 5 reel",         price: 1250 },
      { id: "shorts",      name: "Shorts YouTube",           price: 250, unit: "each" },
      { id: "carousel",    name: "Carousel",                 price: 300 }
    ]
  },

  /* --- Merch+ ------------------------------------------------------ */
  merch_social: {
    id: "merch_social", label: "Merch+", type: "items",
    items: [
      { id: "magliette",  name: "Magliette",     price: 500 },
      { id: "felpe",      name: "Felpe",         price: 600 },
      { id: "cappellini", name: "Cappellini",    price: 400 },
      { id: "shopper",    name: "Shopper",       price: 400 },
      { id: "packaging",  name: "Packaging",     price: 900 },
      { id: "rollup",     name: "Roll-up",       price: 450 },
      { id: "banner",     name: "Banner",        price: 300 },
      { id: "gadget",     name: "Gadget",        price: 600 },
      { id: "kit",        name: "Kit completo",  price: 2500, from: true }
    ]
  },
  merch_full: {
    id: "merch_full", label: "Merch+", type: "items",
    items: [
      { id: "magliette",  name: "Magliette",            price: 500 },
      { id: "felpe",      name: "Felpe",                price: 600 },
      { id: "cappellini", name: "Cappellini",           price: 400 },
      { id: "shopper",    name: "Shopper",              price: 400 },
      { id: "packaging",  name: "Packaging",            price: 900 },
      { id: "rollup",     name: "Roll-up",              price: 450 },
      { id: "banner",     name: "Banner",               price: 300 },
      { id: "gadget",     name: "Gadget",               price: 600 },
      { id: "lanyard",    name: "Lanyard",              price: 400 },
      { id: "badge",      name: "Badge personalizzati", price: 350 },
      { id: "braccialetti", name: "Braccialetti",       price: 300 },
      { id: "totem",      name: "Totem",                price: 900 },
      { id: "bandiere",   name: "Bandiere",             price: 700 },
      { id: "giftbag",    name: "Gift bag",             price: 900 },
      { id: "kit",        name: "Kit completo",         price: 2500, from: true }
    ]
  },

  /* --- Graphics+ (video) -------------------------------------------- */
  graphics_video: {
    id: "graphics_video", label: "Graphics+", type: "items",
    sections: true,
    items: [
      { section: "Comunicazione" },
      { id: "logo_ev",    name: "Logo evento",                 price: 800 },
      { id: "identita",   name: "Identità grafica evento",     price: 2000 },
      { id: "brandkit",   name: "Brand kit evento",            price: 1500 },
      { section: "Promozione" },
      { id: "locandina",  name: "Locandina",                   price: 500 },
      { id: "flyer",      name: "Flyer",                       price: 350 },
      { id: "manifesto",  name: "Manifesto",                   price: 450 },
      { id: "banner_web", name: "Banner web",                  price: 250 },
      { id: "banner_st",  name: "Banner stampa",               price: 350 },
      { id: "adv_social", name: "ADV social",                  price: 300 },
      { section: "Social" },
      { id: "tpl_post",   name: "Template post",               price: 250 },
      { id: "tpl_story",  name: "Template stories",            price: 250 },
      { id: "carousel",   name: "Carousel",                    price: 300 },
      { id: "countdown",  name: "Countdown",                   price: 200 },
      { id: "speaker",    name: "Speaker card",                price: 250 },
      { id: "sponsor",    name: "Sponsor card",                price: 250 },
      { section: "Evento" },
      { id: "accrediti",  name: "Accrediti",                   price: 300 },
      { id: "badge",      name: "Badge",                       price: 300 },
      { id: "pass_staff", name: "Pass staff",                  price: 250 },
      { id: "pass_vip",   name: "Pass VIP",                    price: 300 },
      { id: "programma",  name: "Programma evento",            price: 500 },
      { id: "mappa",      name: "Mappa evento",                price: 400 },
      { id: "segnaletica",name: "Segnaletica",                 price: 700 },
      { id: "totem",      name: "Totem",                       price: 500 },
      { id: "slide",      name: "Slide palco",                 price: 600 },
      { id: "ledwall",    name: "Grafiche LED wall",           price: 900 },
      { id: "overlay",    name: "Overlay streaming",           price: 800 },
      { section: "Post evento" },
      { id: "report",     name: "Report grafico",              price: 600 },
      { id: "album",      name: "Album fotografico",           price: 700 },
      { id: "ringraz_sp", name: "Ringraziamenti sponsor",      price: 300 },
      { id: "certificati",name: "Certificati partecipazione",  price: 250 }
    ]
  }
};

/* ============================================================
   CATALOGO SERVIZI
   Ogni servizio ha una o più "linee"; ogni linea ha i tier.
   Package: { id, name, tier, from, to, unit, highlights, addons }
   ============================================================ */
const HL_VIDEO = {
  start: ["Brief e pianificazione riprese", "1 operatore video, riprese monocamera", "Montaggio professionale", "Color correction e ottimizzazione audio", "Titolazione base", "Versione HD e web"],
  pro: ["Pre-produzione completa con shot list", "2 operatori, riprese multicamera", "Interviste e backstage", "Color correction accurata", "Motion graphics base", "Aftermovie / highlight video", "Versioni social"],
  premium: ["Scrittura creativa e storyboard", "Fotografo dedicato, drone (ove consentito)", "Montaggio cinematografico", "Color grading professionale", "Sound design e mix audio", "Motion graphics e logo animation", "VFX base e sottotitoli", "Formati 16:9 · 9:16 · 1:1, file master"],
  luxury: ["Concept creativo e location scouting", "Regista dedicato e direttore della fotografia", "Fino a 3 operatori, fino a 2 fotografi", "Interviste premium, backstage completo", "Color grading avanzato, sound design professionale", "Motion graphics premium, VFX", "Sottotitoli multilingua", "Aftermovie premium, highlight film, trailer e teaser", "Archivio completo delle riprese e backup"]
};

const SERVICES = [
  {
    id: "branding", name: "Branding & Identità", icon: "pen-tool",
    tagline: "Identità visive costruite per durare: logo, sistema, strategia.",
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
    id: "web", name: "Web & Digital", icon: "monitor",
    tagline: "Siti, e-commerce e landing progettati per convertire con eleganza.",
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
    id: "social", name: "Social Media", icon: "share-2",
    tagline: "Presenza continua, contenuti curati, crescita misurabile.",
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
    id: "video", name: "Video", icon: "video",
    tagline: "Produzioni su misura: eventi, fashion, corporate, commercial.",
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
    id: "podcast", name: "Podcast", icon: "mic",
    tagline: "Dallo studio alla distribuzione: il tuo podcast, fatto bene.",
    note: "Prezzi per episodio · minimo 4 episodi",
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
    id: "personal", name: "Personal Branding", icon: "user",
    tagline: "La tua immagine pubblica, gestita con metodo e discrezione.",
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
    id: "sport", name: "Sport & Team", icon: "trophy",
    tagline: "Atleti, squadre e società: comunicazione all'altezza del campo.",
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
    id: "artist", name: "Artisti & Musica", icon: "music",
    tagline: "Release, live e immagine: una direzione artistica coerente.",
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

/* Esposizione globale (script tag, nessun bundler) */
window.ATTO_DATA = {
  CURRENCIES, SERVICES, ADDON_FAMILIES, TEAM,
  formatPrice, formatRange, getService, getPackage, getFamily, UNIT_SUFFIX
};
