/* =============================================================
   ATTO — Data layer
   Single source of truth for sectors, packages, prices,
   client categories, the category→sector matrix, add-ons and
   recurring services. All prices come from the internal /docs.
   Currency base values are in CHF (low–high range).
   Text labels live in js/i18n.js, referenced here by i18n key.
   ============================================================= */

/* ---- Currency config -------------------------------------- */
const CURRENCIES = {
  CHF: { code: "CHF", rateFromCHF: 1,    symbol: "CHF", thousands: "'", prefix: true  },
  EUR: { code: "EUR", rateFromCHF: 1.04, symbol: "€",   thousands: ".", prefix: true  }
};

/* ---- Sectors ---------------------------------------------- */
/* color = brand accent for the sector (see brief §7.3)        */
const SECTORS = {
  branding:        { id: "branding",        color: "#9E4567", icon: "pen-tool" },
  web:             { id: "web",             color: "#667547", icon: "monitor" },
  social:          { id: "social",          color: "#785BA3", icon: "share-2" },
  video_events:    { id: "video_events",    color: "#9C3B5C", icon: "video" },
  video_fashion:   { id: "video_fashion",   color: "#9C3B5C", icon: "film" },
  video_corporate: { id: "video_corporate", color: "#9C3B5C", icon: "briefcase" },
  video_commercial:{ id: "video_commercial",color: "#9C3B5C", icon: "megaphone" },
  podcast:         { id: "podcast",         color: "#A85A4F", icon: "mic" },
  personal:        { id: "personal",        color: "#8E5F69", icon: "user" },
  sport:           { id: "sport",           color: "#737A45", icon: "trophy" },
  artist:          { id: "artist",          color: "#8A6A3E", icon: "music" }
};

/* ---- Packages --------------------------------------------- */
/* from / to in CHF. name + features resolved via i18n key.    */
const PACKAGES = {
  branding: [
    { id: "brand_start",     from: 500,   to: 1000 },
    { id: "brand_pro",       from: 1500,  to: 2500 },
    { id: "brand_premium",   from: 3000,  to: 4000 },
    { id: "rebranding",      from: 500,   to: 1000 },
    { id: "rebranding_pro",  from: 1500,  to: 2500 }
  ],
  web: [
    { id: "website_start",   from: 500,   to: 1000 },
    { id: "website_pro",     from: 1500,  to: 2500 },
    { id: "website_premium", from: 3000,  to: 5000 },
    { id: "ecom_start",      from: 8000,  to: 10000 },
    { id: "ecom_growth",     from: 12000, to: 15000 },
    { id: "landing_campaign",from: 2500,  to: 3500 }
  ],
  social: [
    { id: "social_start",    from: 1000,  to: 1500 },
    { id: "social_pro",      from: 2000,  to: 2500 },
    { id: "social_premium",  from: 3500,  to: 4000 },
    { id: "linkedin_biz",    from: 1000,  to: 1500 }
  ],
  video_events: [
    { id: "vid_ev_start",    from: 750,   to: 1000 },
    { id: "vid_ev_pro",      from: 1500,  to: 2500 },
    { id: "vid_ev_premium",  from: 3000,  to: 4000 },
    { id: "vid_ev_luxury",   from: 4000,  to: 5000 }
  ],
  video_fashion: [
    { id: "vid_fa_start",    from: 1000,  to: 1250 },
    { id: "vid_fa_pro",      from: 1750,  to: 2750 },
    { id: "vid_fa_premium",  from: 3500,  to: 4500 },
    { id: "vid_fa_luxury",   from: 5000,  to: 6000 },
    { id: "vid_fa_social",   from: 1750,  to: 2750 }
  ],
  video_corporate: [
    { id: "vid_co_start",    from: 1000,  to: 1250 },
    { id: "vid_co_pro",      from: 1750,  to: 2750 },
    { id: "vid_co_premium",  from: 3500,  to: 4500 },
    { id: "vid_co_luxury",   from: 5000,  to: 6000 },
    { id: "vid_co_social",   from: 1750,  to: 2750 }
  ],
  video_commercial: [
    { id: "vid_cm_start",    from: 1250,  to: 1500 },
    { id: "vid_cm_pro",      from: 2000,  to: 3000 },
    { id: "vid_cm_premium",  from: 3500,  to: 4750 },
    { id: "vid_cm_luxury",   from: 5500,  to: 6500 },
    { id: "vid_cm_social",   from: 1750,  to: 2750 }
  ],
  podcast: [
    { id: "pod_start",       from: 1000,  to: 1250 },
    { id: "pod_pro",         from: 1750,  to: 2750 },
    { id: "pod_premium",     from: 3500,  to: 4500 }
  ],
  personal: [
    { id: "pers_start",      from: 750,   to: 1000 },
    { id: "pers_premium",    from: 1500,  to: 2500 },
    { id: "pers_professional",from: 1500, to: 2500 },
    { id: "pers_political",  from: 1500,  to: 2500 }
  ],
  sport: [
    { id: "sport_start",     from: 750,   to: 1000 },
    { id: "sport_premium",   from: 1500,  to: 2500 },
    { id: "sport_team",      from: 2000,  to: 2500 }
  ],
  artist: [
    { id: "artist_start",    from: 750,   to: 1000 },
    { id: "artist_premium",  from: 1500,  to: 2500 },
    { id: "artist_team",     from: 2000,  to: 2500 }
  ]
};

/* ---- Client categories ------------------------------------ */
/* type = "business" | "private"                               */
const CATEGORIES = {
  // Business
  startup:        { id: "startup",        type: "business", icon: "rocket" },
  small_business: { id: "small_business", type: "business", icon: "store" },
  pmi:            { id: "pmi",            type: "business", icon: "factory" },
  corporate:      { id: "corporate",      type: "business", icon: "landmark" },
  // Private
  freelancer:     { id: "freelancer",     type: "private",  icon: "laptop" },
  creator:        { id: "creator",        type: "private",  icon: "camera" },
  artist_cat:     { id: "artist_cat",     type: "private",  icon: "palette" },
  athlete:        { id: "athlete",        type: "private",  icon: "trophy" },
  public_figure:  { id: "public_figure",  type: "private",  icon: "star" },
  podcast_cat:    { id: "podcast_cat",    type: "private",  icon: "mic" }
};

/* ---- Matrix: category → sectors shown (brief §5) ---------- */
const MATRIX = {
  startup:        ["branding","web","social","video_events","video_corporate","video_commercial","video_fashion"],
  small_business: ["branding","web","social","video_events","video_corporate","video_commercial","video_fashion"],
  pmi:            ["branding","web","social","video_events","video_corporate","video_commercial","video_fashion"],
  corporate:      ["web","social","video_events","video_corporate","video_commercial","personal"],
  freelancer:     ["branding","web","social","video_events","video_corporate","video_commercial","video_fashion"],
  creator:        ["web","social","video_events","video_corporate","video_commercial","personal"],
  artist_cat:     ["web","social","video_events","video_corporate","video_commercial","artist","video_fashion"],
  athlete:        ["web","social","video_events","sport"],
  public_figure:  ["web","social","video_events","video_corporate","video_commercial","personal"],
  podcast_cat:    ["web","social","podcast","personal"]
};

/* ---- Add-ons "+" (brief §6) ------------------------------- */
/* perMonth / perYear flag drives label suffix in i18n         */
const ADDONS = [
  { id: "web_plus",      from: 2000, to: 3000, sectors: ["social","video_events","video_fashion","video_corporate","video_commercial","podcast","personal","sport","artist"] },
  { id: "social_plus",   from: 1750, to: 2750, sectors: ["branding","web","video_events","video_fashion","video_corporate","video_commercial","podcast","personal","sport","artist"] },
  { id: "graphic_plus",  from: 500,  to: 1000, sectors: ["web","social","video_events","video_fashion","video_corporate","video_commercial","podcast","personal","sport","artist"] },
  { id: "merch_plus",    from: 500,  to: 1000, sectors: ["video_events","video_fashion","podcast","personal","sport","artist"] },
  { id: "ai_plus",       from: 1000, to: 1000, sectors: ["branding","web","social","video_events","video_fashion","video_corporate","video_commercial","podcast","personal","sport","artist"] },
  { id: "linkedin_plus", from: 1000, to: 1500, sectors: ["social","personal","web"] }
];

/* ---- Recurring / single works (brief §6 + §10) ------------ */
const SERVICES = [
  { id: "site_mgmt",   price: 250, unit: "month" },
  { id: "content_upd", price: 100, unit: "each" },
  { id: "backup",      price: 100, unit: "month" },
  { id: "hosting",     price: 200, unit: "year" },
  { id: "domain",      price: 40,  unit: "year" },
  { id: "seo_base",    price: 800, unit: "once" },
  { id: "seo_adv",     price: 1500,unit: "once" }
];

/* ---- Team (brief §9) -------------------------------------- */
const TEAM = [
  { id: "macchi",       initials: "DM", sector: "branding", work: ["branding", "video_corporate", "web", "podcast"] },
  { id: "cirrincione",  initials: "DC", sector: "web",      work: ["web", "video_commercial", "social", "artist"] },
  { id: "benedetti",    initials: "FB", sector: "social",   work: ["social", "video_fashion", "personal", "podcast"] },
  { id: "zaffalon",     initials: "TZ", sector: "web",      work: ["web", "branding", "video_events", "social"] },
  { id: "agueci",       initials: "MA", sector: "branding", work: ["branding", "social", "personal", "web"] }
];

function getMember(id) { return TEAM.find(m => m.id === id) || null; }

/* ---- Helpers ---------------------------------------------- */
function formatPrice(amountCHF, currencyCode) {
  const c = CURRENCIES[currencyCode] || CURRENCIES.CHF;
  const value = Math.round(amountCHF * c.rateFromCHF);
  const grouped = value.toLocaleString("en-US").replace(/,/g, c.thousands);
  return c.prefix ? `${c.symbol} ${grouped}` : `${grouped} ${c.symbol}`;
}

function getPackage(pkgId) {
  for (const sector in PACKAGES) {
    const found = PACKAGES[sector].find(p => p.id === pkgId);
    if (found) return { ...found, sector };
  }
  return null;
}

function getAddon(addonId) {
  return ADDONS.find(a => a.id === addonId) || null;
}

function getService(serviceId) {
  return SERVICES.find(s => s.id === serviceId) || null;
}

/* Expose globally (no bundler — plain script tags) */
window.ATTO_DATA = {
  CURRENCIES, SECTORS, PACKAGES, CATEGORIES, MATRIX,
  ADDONS, SERVICES, TEAM,
  formatPrice, getPackage, getAddon, getService, getMember
};
