# Atto — Sito Service (v2, redesign 2026-07)

> **Atto** è un *nome provvisorio*.

Sito statico (HTML/CSS/JS vanilla, nessun build) per lo studio creativo Atto
(Lugano & Zürich). Flusso in stile Apple Store (come UX, non come estetica):
**Home → servizio → linea → livello → complementi → riepilogo → invio**.
Direzione visiva sobria ed elegante ("Montblanc"): carta calda, inchiostro
blu-notte, verde pino, Fraunces + Geist, hairline, nessun effetto giocoso.

## Struttura

```
index.html         Home: hero + griglia degli 8 servizi
service.html       Pagina servizio parametrica (?id=branding|web|social|video|podcast|personal|sport|artist)
work.html          Lavori (placeholder "in preparazione")
about.html         Studio + team
contact.html       Contatti (form Formspree)
start.html         DEPRECATA → redirect a index.html#servizi
member.html        DEPRECATA → redirect a about.html
style.css          Design system completo (tokens in :root)
app.js             Engine condiviso: i18n, lingua, valuta, nav, reveal, render griglia/team
js/data.js         Catalogo: SERVICES, ADDON_FAMILIES, TEAM, helpers (window.ATTO_DATA)
js/i18n.js         Chrome UI in IT/EN/DE/FR, IT fallback (window.ATTO_I18N)
js/service.js      Configuratore della pagina servizio
js/flow.js         DEPRECATO (svuotato, eliminabile)
js/configurator.js DEPRECATO (svuotato, eliminabile)
docs/              Fonte dati: "++ Pacchetti (con specifiche).xlsx" (+ export CSV)
VERIFICA-DATI.md   Tabella di verifica dati approvata da Tommy
HANDOFF-REDESIGN.md Contesto e decisioni del redesign
```

## Dati e regole di prezzo

- Fonte di verità: `docs/++ Pacchetti (con specifiche).xlsx` (estratto e
  verificato in `VERIFICA-DATI.md`).
- Prezzi in CHF; EUR calcolato con `rateFromCHF = 1.05` (in `js/data.js`).
- Unità: `once` (una tantum), `month` (/mese), `episode` (/episodio, Podcast
  minimo 4 episodi).
- Add-on: mostrati **solo** se compatibili col pacchetto scelto; famiglie
  chiuse di default (fisarmonica). Nessuno sconto automatico.
- Totali una tantum e ricorrenti sempre separati.
- "Personal Brand Premium" ha prezzo proposto (refuso nel foglio), marcato
  `proposed: true` → da confermare.

## i18n

Chrome UI in 4 lingue (IT/EN/DE/FR), IT è fallback. Il catalogo (nomi,
tagline, highlights, add-on) è tradotto via `js/catalog-i18n.js`
(`window.ATTO_CT`, dizionario stringa IT → [EN, DE, FR]).
Attributi `data-i18n` / `data-i18n-html`; lingua
persistita in `localStorage("atto-lang")`, valuta in
`localStorage("atto-currency")`. Eventi: `atto:langchange`,
`atto:currencychange`.

## Da fare prima del lancio

1. Sostituire `[FORMSPREE_FORM_ID]` in `service.html` e `contact.html`.
2. Confermare il prezzo di Personal Brand Premium (proposto 4'000–7'000/mese).
3. Sostituire il nome provvisorio "Atto" ovunque (titoli, meta, footer, brand).
4. Aggiungere i progetti reali in `work.html`.
5. Eliminare i file deprecati: `js/flow.js`, `js/configurator.js`.
6. Test in browser (nessun server necessario: aprire `index.html`, ma per i
   fetch Formspree servirà il dominio pubblicato).
