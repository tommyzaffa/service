# HANDOFF — Redesign sito Atto (per la prossima sessione)

> AGGIORNAMENTO 2026-07-03 (sessione 4) — **REDESIGN COMPLETATO.** Tutti e tre i
> macro-task sono stati eseguiti coi soli file tool (Bash ancora KO per ENOSPC):
> 1) dati: `js/data.js` riscritto dal CSV verificato (`VERIFICA-DATI.md`, 9 dubbi
> risolti da Tommy); 2) flusso: nuovo `service.html` + `js/service.js` (linea →
> tier → add-on a fisarmonica con "Seleziona tutto" −10% solo una tantum →
> riepilogo sticky CHF/EUR → form Formspree), home con griglia 8 servizi,
> `start.html`/`member.html` ridotte a redirect, `flow.js`/`configurator.js`
> svuotati (da eliminare a mano); 3) restyle: `style.css` nuovo design system
> (carta calda #F2EFE9, inchiostro #16232E, verde pino #28503F, Fraunces+Geist,
> hairline, niente aurora/cursore/kinetic), `app.js` ridotto a engine essenziale,
> i18n IT/EN/DE/FR in `js/i18n.js`. README aggiornato. RESTANO: Formspree ID,
> conferma prezzo Personal Brand Premium (proposto 4'000–7'000/mese), nome
> definitivo al posto di "Atto", portfolio in `work.html`, test in browser
> (impossibile in sandbox).

> AGGIORNAMENTO 2026-07-03 (sessione 3): il riavvio dell'app NON ha risolto — stesso
> ENOSPC su Bash fin dal primo comando, la VM sandbox persiste tra sessioni e riavvii.
> I file tool (Read/Write/Edit) sulla cartella progetto funzionano regolarmente.
> Da tentare: chiudere completamente l'app Claude (quit, non solo riavvio finestra),
> oppure contattare il supporto/segnalare col pulsante feedback. In alternativa il
> parsing xlsx può essere fatto senza sandbox se Tommy esporta il foglio in CSV
> (File → Salva come → CSV da Excel/Numbers) dentro docs/: i CSV sono leggibili
> direttamente con i file tool. Nessun lavoro sul codice ancora fatto.

> AGGIORNAMENTO 2026-07-03 (sessione 2): anche questa sessione ha trovato il disco del
> sandbox pieno (ENOSPC) — Bash e Write inutilizzabili fin dall'inizio, il problema è a
> livello di VM e persiste tra le sessioni. Tommy riavvia l'app per ottenere un sandbox
> pulito. Prima azione della prossima sessione: verificare che Bash funzioni (`df -h`);
> se sì, procedere col piano qui sotto dal punto 1 (parsing xlsx). Nessun lavoro sul
> codice è ancora stato fatto.

> Scritto il 2026-07-03. La sessione precedente ha esaurito lo spazio disco del sandbox
> (ENOSPC): impossibile usare Bash/Python. Tutto il lavoro di analisi è stato fatto con i
> file tool. Questo documento contiene il contesto completo, le decisioni prese con Tommy
> e il piano operativo. **Leggere tutto prima di toccare il codice.**

---

## 1. Obiettivo del lavoro

Tre macro-task, in quest'ordine:

1. **Implementare i dati aggiornati** (prezzi, pacchetti, tier, add-on) dal file
   `docs/++ Pacchetti (con specifiche).xlsx` — è la NUOVA fonte di verità.
   I dati attuali in `js/data.js` sono la versione bozza e vanno sostituiti.
2. **Ristrutturare il flusso del sito**: il sito attuale è "troppo vuoto ma anche
   dispersivo". Obiettivo: percorso più breve e intuitivo possibile (modello Apple Store
   come UX, NON come estetica), con granularità di scelta solo nella fase finale del
   preventivo.
3. **Restyle grafico completo** coerente col brief branding (sezione 4): identità
   sobria, elegante, "Montblanc" — non un semplice cleanup. Va rimosso l'attuale look
   giocoso (aurora, cursore custom, kinetic type) e costruita una direzione visiva con
   carattere: più attraente della pulizia piatta di Apple, ma mai fluo/frufru. Questo
   task ha lo stesso peso degli altri due, non è rifinitura opzionale.

## 2. Fonte dati — `docs/++ Pacchetti (con specifiche).xlsx`

- Parsare con Python (openpyxl/pandas) — usare la skill xlsx. Il PDF omonimo
  (`docs/++ Pacchetti (con specifiche) - Foglio1.pdf`) è lo stesso contenuto ma
  appiattito e inaffidabile: usarlo solo come controllo incrociato visivo.
- Struttura del foglio: colonne raggruppate per macro-categoria di pacchetti:
  Branding/Identità (Brand Identity Start/Pro/Premium, Rebranding, Rebranding Pro),
  Web/Digital (Website Start/Pro/Premium, E-commerce Start/Pro/Premium, Landing
  Campaign, Landing Campaign Pro), Social (Start/Pro/Premium), Video ×4 verticali
  (Eventi, Fashion-Music, Corporate, Commercial/ADV — ognuno Start/Pro/Premium/Luxury),
  Podcast (Start/Pro/Premium), Personal Branding, Sport/Team/Atleti, Artisti/Musica.
- Ogni colonna-pacchetto contiene: le feature del tier (sezioni tipo ANALISI, IDENTITÀ,
  PRODUZIONE, DELIVERABLES…), il range di prezzo in fondo, e i blocchi "+" compatibili
  (WEB+, SOCIAL+, AI+, MERCH+, GRAPHICS+, VIDEO+, PHOTO+, LINKEDIN+, DESIGN+) con le
  singole voci prezzate (es. "AI Intro Video 500 CHF", "Pacchetto 3 Reel 800 CHF",
  "Gestione Instagram 700 CHF/mese").
- ATTENZIONE alle unità: alcuni pacchetti sono una tantum (CHF), altri ricorrenti
  (CHF/mese: Social, Personal, Sport, Artist) o per episodio (Podcast CHF/episodio).
  Il preventivo deve distinguere chiaramente una tantum vs ricorrente.
- **Dopo l'estrazione, produrre per Tommy una tabella di verifica**
  pacchetto → prezzo → famiglie add-on → voci, prima di considerare i dati definitivi.

## 3. Decisioni già prese con Tommy (confermate, non richiedere)

1. **Flusso**: Home → servizio → tier → add-on. La home mostra direttamente i servizi
   (i pacchetti macro). Clic su un servizio → pagina/vista dedicata con scelta guidata
   stile Apple (una decisione alla volta, scroll): scegli il tier → poi gli add-on →
   riepilogo → form. Il wizard attuale a 6 step ("chi sei? / che tipo? / …" in
   `start.html` + `js/flow.js`) viene eliminato; il "chi sei" diventa al massimo un
   campo del form finale.
2. **Add-on**: dopo la scelta del pacchetto base, mostrare SOLO le famiglie add-on
   compatibili con quel pacchetto (matrice dal foglio xlsx). Esempi dati da Tommy:
   - Website Start / Pro / Premium → **nessun** pacchetto aggiuntivo
   - E-commerce → Video+
   - Landing Campaign → Video+ / AI+ / Design+
   UI: riquadri delle famiglie CHIUSI; clic → il riquadro si apre con la lista di voci,
   ognuna con checkbox e prezzo; in cima "Spunta tutto".
3. **Sconto**: "spunta tutto" su una famiglia = **−10% sul totale di quella famiglia**
   (non sull'intero preventivo). Percentuale come costante configurabile.
4. **Estetica**: gli screenshot Apple erano SOLO reference tecnica/UX. L'estetica Apple
   è "banale e priva di significato" (parole di Tommy): creare qualcosa di più
   attraente e con carattere, ma coerente col brief branding (v. sotto).
5. Tommy ha dato **carta bianca** per rivisitare il sito quanto serve.

## 4. Brief branding (da `docs/Branding Service .pdf` — letto integralmente)

- Tre parole: **affidabile, elegante, visionario**. Posizionamento tipo **Montblanc**:
  status, qualità percepita, fiducia. Target: imprenditori, hotel, enti, PMI ticinesi
  (ma senza chiudere a creator/sportivi/piccole realtà). 30–60 anni.
- Valori: eccellenza, affidabilità, solidità, cura del dettaglio, eleganza sobria,
  discrezione. Il sito è "la vetrina principale": il 99% della comunicazione passa da lì.
- **Evitare**: tutto ciò che è giocoso, infantile, ironico, disordinato, eccessivo,
  "frufru". Niente colori fluo o appariscenti.
- Palette suggerita (da far emergere, non imposta): **blu, verde, grigio** — tonalità
  eleganti, quasi "old school", leggermente ruvide, come tessuti di lana; senso di
  aristocrazia/qualità. Tipografia: carta bianca ma coerente (eleganza, chiarezza,
  solidità).
- Tono di voce: professionale, raffinato, sobrio, accogliente con calore misurato.
- Implicazione concreta sul codice attuale: l'estetica esistente (aurora canvas,
  cursore custom, kinetic type "giocoso", font Anton/Quicksand) va ripensata in
  direzione sobria/elegante. Fraunces può restare in valutazione, Anton/Quicksand
  probabilmente no.

## 5. Stato attuale del codice (tutto in questa cartella)

- Sito statico vanilla HTML/CSS/JS, nessuna build. Pagine: `index.html` (home
  cinematica a scene pinned), `start.html` (wizard 6 step), `work.html`, `about.html`,
  `contact.html`, `member.html`.
- `js/data.js` — data layer BOZZA da sostituire: CURRENCIES (CHF/EUR), SECTORS,
  PACKAGES (prezzi vecchi), CATEGORIES+MATRIX (categoria cliente→settori, legata al
  wizard che eliminiamo), ADDONS (6 famiglie flat con range, senza voci singole),
  SERVICES, TEAM. Espone `window.ATTO_DATA`.
- `js/i18n.js` — traduzioni IT/EN/DE/FR con chiavi `pkg.*`, `addon.*`, `sec.*`,
  `cat.*`, `flow.*`, `quote.*`. Andrà aggiornato con le nuove voci (nomi pacchetti,
  voci add-on). IT è la lingua di lavoro; EN/DE/FR possono ereditare in prima battuta.
- `js/flow.js` — wizard 6 step, da sostituire col nuovo flusso.
- `js/configurator.js` — configuratore attuale: base + add-on flat + servizi, totale
  live, valuta CHF/EUR, sync campi nascosti Formspree. Buona base concettuale ma va
  riscritto per: famiglie add-on apribili con voci singole spuntabili, "spunta tutto"
  con −10% per famiglia, distinzione una tantum/mensile nel totale.
- `app.js` + `style.css` (root) — UI condivisa e stile. NB: il README descrive una
  struttura `css/` e `js/ui.js js/main.js` che NON esiste più; la realtà è
  `style.css` + `app.js` a root. Aggiornare il README a fine lavoro.
- Form: Formspree, endpoint placeholder `[FORMSPREE_FORM_ID]` in start/contact.
- "Atto" è nome provvisorio. Email placeholder `hello@atto.studio`.
- Repo git presente. Non committare senza che Tommy lo chieda.

## 6. Piano operativo suggerito

1. Parsare l'xlsx → generare la nuova struttura dati (proposta):
   `SERVICES_CATALOG` = servizi macro → pacchetti/tier (id, nome, range prezzo, unità,
   feature raggruppate per sezione) + `ADDON_FAMILIES` (id famiglia, voci con prezzo e
   unità) + `COMPAT` (pacchetto id → [famiglie add-on]) + `BUNDLE_DISCOUNT = 0.10`.
2. Scrivere la tabella di verifica dati per Tommy (md o direttamente a schermo).
3. Nuova home: hero sobrio + griglia servizi (il cuore della pagina, subito visibile).
4. Pagina servizio unica parametrica (es. `service.html?id=web` o sezioni generate):
   scroll guidato tier → add-on → riepilogo sticky → form.
5. Restyle globale coerente col brief (palette blu/verde/grigio sobria, tipografia
   elegante, rimozione effetti giocosi).
6. Verifica: servire con `python3 -m http.server`, screenshot/controllo di ogni step
   del flusso, test add-on/sconto/valuta/lingue, mobile.
7. Aggiornare README.

## 7. Note operative

- Cartella progetto = cartella selezionata dall'utente (persiste). I `docs/` originali
  restano lì come riferimento.
- Utente: Tommy (thomas.zaffalon@icloud.com), lavora al sito con un socio; scrive in
  italiano — rispondere in italiano.
- Gli altri PDF in docs/ (Abbonamenti, Costo Lavori Singoli, Tutti i pacchetti, Sito
  service) sono materiale precedente: il "++" xlsx li supera per pacchetti/add-on, ma
  possono servire per i servizi singoli/abbonamenti se l'xlsx non li copre.
