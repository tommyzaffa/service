# Atto — Sito Service (v3, wizard 2026-07)

> **Atto** è un *nome provvisorio*.

Sito statico (HTML/CSS/JS vanilla, nessun build) per lo studio creativo Atto
(Lugano & Zürich). Il preventivo si compone con un **wizard a step singoli**:
**Home → servizio (icona in header) → chi sei / che tipo → livello →
complementi a bundle → riepilogo → invio**, con indietro sempre disponibile
(bottone e indicatore di percorso cliccabile).
Direzione visiva sobria ed elegante ("Montblanc"): carta calda, inchiostro
blu-notte, verde pino, Fraunces + Geist, hairline, nessun effetto giocoso.
La home è a 5 pannelli full-screen con scroll-snap `proximity` (classe
`snap` su `<html>` solo in `index.html`).

## Struttura

```
index.html         Home: 5 pannelli full-screen (hero animato, servizi, studio, lavori, CTA)
service.html       Pagina servizio parametrica (?id=branding|web|social|video|podcast|personal|sport|artist)
work.html          Lavori (placeholder "in preparazione")
about.html         Studio + team
contact.html       Contatti (form Formspree)
start.html         DEPRECATA → redirect a index.html#servizi
member.html        DEPRECATA → redirect a about.html
style.css          Design system completo (tokens in :root)
app.js             Engine condiviso: i18n, lingua, valuta, nav servizi in header ([data-services-nav]), hero loop, reveal, griglia/team
js/data.js         Catalogo v3: SERVICES (con wizard), ADDON_FAMILIES (bundle), TEAM, helpers (window.ATTO_DATA)
js/i18n.js         Chrome UI in IT/EN/DE/FR, IT fallback (window.ATTO_I18N)
js/catalog-i18n.js Traduzioni del catalogo: stringa IT → [EN, DE, FR] (window.ATTO_CT)
js/service.js      Wizard del preventivo (un passo alla volta, stato in memoria)
js/flow.js         DEPRECATO (svuotato, eliminabile)
js/configurator.js DEPRECATO (svuotato, eliminabile)
docs/              Fonte dati: "++ Pacchetti (con specifiche).xlsx" (+ export CSV)
VERIFICA-DATI.md   Tabella di verifica dati approvata da Tommy
VERIFICA-BUNDLE.md Tabella di verifica prezzi bundle (somma voci −10%) — DA VERIFICARE
HANDOFF-REDESIGN.md Contesto e decisioni del redesign
```

## Header con icone servizi

Su ogni pagina l'header ha `<nav data-services-nav>`: `app.js` vi renderizza
le 8 icone servizio con etichetta breve (`SERVICES[].short`, tradotta via
`ATTO_CT`). Su desktop la nav è inline tra il brand e gli switch valuta/lingua;
sotto i 1120px diventa un menu a tendina (bottone "Servizi", chiusura con
click fuori o Escape). Il servizio corrente è evidenziato via `aria-current`.

## Wizard del preventivo (service.html)

Sequenza step costruita da `js/service.js`: le domande `wizard` del servizio
(0–2, es. "Chi sei?") → livello → complementi → form. Le risposte impostano
la linea (`opt.line`) e il tier consigliato (`opt.tier`, badge "Consigliato",
tutti i pacchetti restano selezionabili). Cambiare una risposta a monte
resetta pacchetto e bundle scelti. Il riepilogo sticky e i campi nascosti
del form (incluso `data-hidden-persona`) si aggiornano a ogni scelta.

## Dati e regole di prezzo

- Fonte di verità: `docs/++ Pacchetti (con specifiche).xlsx` (estratto e
  verificato in `VERIFICA-DATI.md`).
- Prezzi in CHF; EUR calcolato con `rateFromCHF = 1.05` (in `js/data.js`).
- Unità: `once` (una tantum), `month` (/mese), `episode` (/episodio, Podcast
  minimo 4 episodi).
- Complementi solo a **bundle** ("gruppetti"): prezzo unico = somma delle
  voci **−10%** (`BUNDLE_DISCOUNT`), già precalcolato in `js/data.js` e
  documentato voce per voce in `VERIFICA-BUNDLE.md`. Famiglie `exclusive`
  (es. Photo+ e-commerce) → al massimo un bundle.
- Bundle mostrati **solo** se la famiglia è compatibile col pacchetto scelto.
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
2b. Verificare i prezzi bundle in `VERIFICA-BUNDLE.md` (incluse le note in
    fondo: sconto sui ricorrenti, blocchi già prezzati, voci escluse).
3. Sostituire il nome provvisorio "Atto" ovunque (titoli, meta, footer, brand).
4. Aggiungere i progetti reali in `work.html`.
5. Eliminare i file deprecati: `js/flow.js`, `js/configurator.js`.
6. Test in browser (nessun server necessario: aprire `index.html`, ma per i
   fetch Formspree servirà il dominio pubblicato).
