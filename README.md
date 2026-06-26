# Atto — Sito Service (v1)

> **Atto** è un *nome provvisorio*. Vedi la checklist di sostituzione in fondo.

Un sito incentrato sul cliente: il visitatore risponde a **3 domande**, riceve **pacchetti su misura**, ne configura uno in stile Apple (pacchetto base + add-on che fanno salire il prezzo) e invia la richiesta via **Formspree**.

Costruito secondo il *Brief Sito Service - Planning Completo*.

## Struttura della repo

```
atto-site/
├── index.html              # Markup completo, sezioni + form
├── css/
│   ├── base.css            # Reset, design token, temi chiaro/scuro, tipografia
│   ├── layout.css          # Header, footer, hero, bottoni
│   ├── components.css      # Flusso, card, configuratore, form, team, portfolio
│   └── animations.css      # Keyframe, scroll reveal, hero, micro-interazioni
├── js/
│   ├── data.js             # Settori, pacchetti, prezzi, matrice, add-on, servizi
│   ├── i18n.js             # Traduzioni EN/IT/DE/FR + runtime t()
│   ├── ui.js               # Tema, lingua, menu overlay, scroll reveal, header, cookie
│   ├── flow.js             # Flusso 3 domande → pacchetti
│   ├── configurator.js     # Preventivo stile Apple + valuta + riepilogo
│   └── main.js             # Bootstrap, team, portfolio, invio Formspree
└── README.md
```

## Avvio locale

Nessuna build necessaria — è un sito statico. Per evitare problemi di CORS con i moduli, servilo da un server locale:

```bash
cd atto-site
python3 -m http.server 8080
# poi apri http://localhost:8080
```

Oppure apri direttamente `index.html` nel browser (le icone e i font richiedono connessione internet via CDN).

## Funzionalità incluse

- **Flusso a 3 domande** (Chi sei? → Che tipo? → Di cosa hai bisogno?) con barra di avanzamento e filtro tramite matrice categoria→settori.
- **Pacchetti consigliati** raggruppati per settore, con colore dedicato e prezzo "a partire da".
- **Configuratore preventivo stile Apple**: pacchetto base + add-on (filtrati per settore) + servizi extra/ricorrenti, totale live con animazione, **switch valuta CHF ⇄ EUR**, somma dei settori.
- **Form Formspree** con campi nascosti precompilati (categoria, settori, pacchetto, add-on, totale stimato), honeypot anti-spam, stati di successo/errore.
- **Multilingua** EN (default) / IT / DE / FR con switch in header, menu e footer.
- **Dark mode** con toggle (rispetta anche la preferenza di sistema).
- **Animazioni**: menu overlay full-screen, hero con gradienti animati, scroll reveal, micro-interazioni, totale che "scorre". Rispetta `prefers-reduced-motion`.
- **Responsive** desktop/tablet/mobile.
- **SEO base** + OpenGraph, accessibilità (focus, aria, contrasto).

## Note sui prezzi

I prezzi base sono in **CHF** (valori "Basso" dal brief, usati come "a partire da"). La conversione EUR usa un tasso indicativo in `js/data.js` → `CURRENCIES.EUR.rateFromCHF` (attuale: 1.04). **Aggiorna il tasso** o collega un cambio reale prima del go-live.

## Checklist materiali da sostituire (brief §12)

- [ ] **Nome definitivo** → cerca `Atto` e `working name` / `[WORKING NAME]` / `[NOME PROVVISORIO]`
- [ ] **Logo** (header + footer + favicon) → blocco `.brand__mark` in `index.html`
- [ ] **Icone settori** → ora placeholder Lucide; sostituibili con set custom (attributi `data-lucide`)
- [ ] **Endpoint Formspree** → in `index.html`, sostituisci `[FORMSPREE_FORM_ID]` nell'`action` del form
- [ ] **Email di contatto** → `hello@example.com` nel footer
- [ ] **Portfolio** (Web, Grafica, Social, Video, Branding) → sezione `#work`, ora placeholder colorati
- [ ] **Foto + bio team** → sezione `#about` (`renderTeam` in `main.js`)
- [ ] **Traduzioni DE / FR** → revisione madrelingua in `js/i18n.js` (descrizioni pacchetti DE/FR attualmente ereditano l'inglese: vedi `PKG_DESC.de/fr`)
- [ ] **Tasso di cambio CHF→EUR** → `js/data.js`
- [ ] **Conferma matrice** categoria→settori → `MATRIX` in `js/data.js`
- [ ] **Pagina/blocco Privacy** reale + comportamento cookie banner

## Decisioni applicate (dal §13 del brief)

1. Prezzo mostrato = **"a partire da"** (valore Basso). ✔
2. Settori multipli = mostrati come gruppi separati; il preventivo **somma** i pacchetti scelti. ✔
3. Abbonamenti = inseriti come **servizi ricorrenti** opzionali (mensili/annuali) nel configuratore. ✔
4. Dark mode = **toggle** attivo. ✔
5. Stack = **sito statico** HTML/CSS/JS vanilla, repo ordinata, facilmente ospitabile. ✔
