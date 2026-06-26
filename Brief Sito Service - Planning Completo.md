# Brief & Planning — Sito "Service"
### Documento di lavoro per la sessione di creazione del sito

> **Come usare questo documento.** Questo file contiene tutto il necessario per costruire il sito nella prossima sessione: obiettivi, architettura, flusso, contenuti, pacchetti con prezzi, logica del preventivo, estetica e specifiche tecniche. È pensato per essere letto e seguito passo-passo da chi (o cosa) costruirà il sito. Tutti i testi segnati come placeholder sono da rifinire; tutti i prezzi provengono dai documenti interni nella cartella `/docs`.

---

## 0. Sintesi in una frase

Un portale **incentrato sul cliente** dove un visitatore (privato o azienda) risponde a **3 domande**, riceve dei **pacchetti su misura**, ne seleziona uno, costruisce un **preventivo stimato in stile Apple** (pacchetto base + opzioni che fanno salire il prezzo) e infine invia la richiesta tramite **un form collegato a Formspree**, così da farci arrivare via mail il contatto e le sue esigenze.

---

## 1. Obiettivi e principi guida

**Obiettivo primario.** Trasformare un visitatore in un *lead qualificato*: capire chi è, cosa gli serve, e farci arrivare una richiesta con un preventivo indicativo già impostato.

**Principi da rispettare (in ordine di priorità):**

1. **Il cliente al centro, non l'occhio.** Il cuore del sito è il flusso delle 3 domande → pacchetti → preventivo. Tutto il resto è di supporto e non deve distrarre.
2. **Credibilità prima di tutto.** Serve comunque una presenza "su di noi" solida (chi siamo + portfolio), altrimenti non sembriamo nessuno. Deve trasmettere: *ragazzi giovani, con la testa sulle spalle, professionisti, con voglia di fare.*
3. **Professionale e minimal, con un tocco pop.** Pulito ed elegante, ma con momenti di colore, movimento e personalità che ci distinguano dalle 300 agenzie tutte uguali.
4. **Deve stupire.** Menu di navigazione affascinante, animazioni curate, micro-interazioni, transizioni fluide. L'effetto "wow" è un requisito, non un extra.
5. **Impeccabile su tutti i dispositivi.** Desktop, tablet e mobile devono essere tutti di livello, non solo "responsive" ma pensati per ciascun formato.
6. **Multilingua.** Inglese di default, con switch verso Italiano, Tedesco e Francese.

**Stato attuale del brand:** *nessun nome e nessun logo definitivi.* Useremo un nome provvisorio e un placeholder per il logo, segnalati chiaramente e facili da sostituire (vedi §8).

---

## 2. Architettura del sito (mappa pagine)

Il sito può essere realizzato come **single-page con scroll a sezioni** oppure **multipagina leggera**. Raccomandazione: **single-page (o app a step) per il flusso principale**, con sezioni informative raggiungibili dal menu. Il flusso delle 3 domande + preventivo è il protagonista.

```
HOME / LANDING
│
├─ HERO  ──────────────  effetto wow + CTA "Inizia" che porta al flusso
│
├─ IL FLUSSO (cuore del sito)
│    ├─ Step 1 — Chi sei?            (Privato / Azienda)
│    ├─ Step 2 — Che tipo sei?       (sotto-categoria, dipende dallo Step 1)
│    ├─ Step 3 — Di cosa hai bisogno? (settori: web, social, video, grafica, ...)
│    ├─ RISULTATO — Pacchetti consigliati per quel profilo
│    ├─ DETTAGLIO PACCHETTO — specifiche + "configura" stile Apple
│    └─ PREVENTIVO — riepilogo + add-on opzionali + totale stimato
│
├─ FORM DI CONTATTO (Formspree)  ──  invio richiesta + contatti
│
├─ CHI SIAMO          (la squadra + il perché)
│
├─ PORTFOLIO / LAVORI (3–4 esempi per settore, vedi §9)
│
└─ FOOTER             (contatti, lingue, social, privacy)
```

**Menu di navigazione.** Deve essere uno degli elementi "wow": un menu a tendina / overlay animato e affascinante (es. full-screen overlay con transizione fluida, voci che entrano in sequenza, eventuale anteprima visiva). Voci minime: *Inizia* (il flusso), *Chi siamo*, *Lavori*, *Lingua*, *Contatti*.

---

## 3. Il flusso a 3 domande (cuore del sito)

L'utente arriva e viene guidato in 3 step. Ogni risposta filtra la successiva. Deve essere **velocissimo, chiaro, quasi un gioco**, con transizioni fluide tra gli step e una barra/indicatore di avanzamento.

### Step 1 — "Chi sei?"
Due grandi scelte:

| Scelta | Significato |
|---|---|
| **Privato** | Persona singola / professionista individuale |
| **Azienda** | Realtà strutturata / organizzazione |

### Step 2 — "Che tipo sei?" (dipende dallo Step 1)

**Se PRIVATO**, le sotto-categorie sono:

- **Freelancer**
- **Creator**
- **Artista / Musicista**
- **Atleta**
- **Public figure**
- **Podcast** *(chi ha o vuole un podcast)*

**Se AZIENDA**, le sotto-categorie (per dimensione/maturità) sono:

- **Start Up**
- **Piccola attività**
- **PMI** (piccola-media impresa)
- **Corporate** (grande azienda)

> Nota: queste 10 categorie corrispondono esattamente alle "Home cards" del documento *Pacchetti (con specifiche)*. Ogni categoria sblocca un set di settori e pacchetti diverso (vedi §5, matrice).

### Step 3 — "Di cosa hai bisogno?" (i settori)

Selezione di uno o più **settori di servizio**. Ognuno ha **colore + icona** dedicati (icone = placeholder per ora, vedi §8). I settori sono:

| Settore | A cosa risponde | Colore (vedi §7) |
|---|---|---|
| **Branding / Identità** | logo, identità visiva, rebranding | verde |
| **Web / Digital** | siti, e-commerce, landing | teal |
| **Social Media** | gestione e crescita social | blu |
| **Eventi** (video) | riprese e aftermovie di eventi | rosa/magenta |
| **Fashion / Music** (video) | videoclip, fashion film | rosa/magenta |
| **Corporate** (video) | video aziendali e istituzionali | rosa/magenta |
| **Commercial / ADV** (video) | spot pubblicitari | rosa/magenta |
| **Podcast** | produzione e distribuzione podcast | rosso |
| **Personal Branding** | immagine personale | arancione |
| **Sport / Team / Atleti** | brand sportivi e di squadra | arancione |
| **Artisti / Musica / Creator** | brand per artisti e creator | arancione |

> **Importante:** non tutti i settori sono mostrati a tutte le categorie. Es. un *Atleta* vede Web/Social/Eventi + Sport Brand; un *Podcast* vede Web/Social/Podcast/Personal Branding. La matrice completa è nel §5.

**Output dello Step 3 → pacchetti.** Combinando categoria (Step 2) + bisogni (Step 3), il sito mostra i **pacchetti consigliati**, raggruppati per settore e con il loro colore, ciascuno con specifiche e prezzo "a partire da".

---

## 4. Catalogo pacchetti, specifiche e prezzi

> **Fonte:** documenti `Tutti i pacchetti.pdf`, `Pacchetti (con specifiche) - Foglio1.pdf`, `Abbonamenti - Foglio1.pdf`.
> I prezzi hanno un **range "Basso–Alto"**: nel sito useremo il valore **Basso come "a partire da"** e l'Alto come riferimento massimo del pacchetto base. Il preventivo finale parte dal "da" e sale con le opzioni.
> **Valuta:** mostrare in **CHF di default con switch a EUR** (richiesta confermata). Formattazione CHF con apostrofo (es. CHF 1'500), EUR con punto (es. € 1.500).

### 4.1 Branding / Identità  *(referente: Martina)*

| Pacchetto | Per chi | Cosa offriamo | Prezzo (da–a) |
|---|---|---|---|
| Brand Identity START | Piccole attività | Logo base, motion graphic, palette, font, template social iniziali | 500 – 1'000 |
| Brand Identity PRO | Piccole attività + strategia | Quanto sopra + Manuale Brand + Strategia | 1'500 – 2'500 |
| Brand Strategy PREMIUM | Aziende grandi | Full Strategia + Full Visual | 3'000 – 4'000 |
| Rebranding | Chi deve riposizionarsi | Restyling logo, nuova identità, revisione comunicazione | 500 – 1'000 |
| Rebranding PRO | Aziende con immagine datata | Logo, motion, palette, font, template, Manuale Brand, Strategia | 1'500 – 2'500 |

### 4.2 Web / Digital  *(referente: Tommy)*

| Pacchetto | Cosa offriamo | Prezzo (da–a) |
|---|---|---|
| Website START | Sito one-page / vetrina semplice (landing) | 500 – 1'000 |
| Website PRO | Sito completo: home, servizi, chi siamo, contatti, SEO base, mobile | 1'500 – 2'500 |
| Website PREMIUM | Sito aziendale avanzato: SEO, analytics, funnel, newsletter, automazioni | 3'000 – 5'000 |
| E-commerce START | Shop essenziale: catalogo, checkout, descrizioni | 8'000 – 10'000 |
| E-commerce GROWTH | E-commerce + strategia vendita: foto/video prodotto, ads, email mktg, retargeting | 12'000 – 15'000 |
| Landing CAMPAIGN | Landing per campagna: pagina vendita, form, tracking, copy, grafiche | 2'500 – 3'500 |

### 4.3 Social Media  *(referente: Fedone)*

| Pacchetto | Per chi | Cosa offriamo | Prezzo (da–a) |
|---|---|---|---|
| Social START | Presenza ordinata (1 solo social) | Servizio foto, editing, piano editoriale, programmazione, reel base, gestione community, ottimizzazione profilo | 1'000 – 1'500 |
| Social PRO | Chi vuole crescere regolarmente | Quanto sopra + report mensile + graphic design | 2'000 – 2'500 |
| Social PREMIUM | Gestione completa | Strategia, shooting, reel, ads, report, community | 3'500 – 4'000 |
| LinkedIn Business + | Add-on a uno dei precedenti | Post LinkedIn, articoli brevi, positioning personale/aziendale | 1'000 – 1'500 |

> Nota: i Social hanno anche una logica di **abbonamento** (es. Social START indicato come 18'000–20'000 su base annua / continuativa nel doc). Da chiarire con Fedone come presentarli (one-shot vs mensile). Vedi §6 "abbonamenti".

### 4.4 Video — Eventi

| Pacchetto | Persone | Prezzo (da–a) |
|---|---|---|
| Video START | 1 persona | 750 – 1'000 |
| Video PRO | 2 persone | 1'500 – 2'500 |
| Video PREMIUM | 3–4 persone | 3'000 – 4'000 |
| Video LUXURY | 3–5 persone | 4'000 – 5'000 |

### 4.5 Video — Fashion / Music

| Pacchetto | Persone | Prezzo (da–a) |
|---|---|---|
| Video START | 1 | 1'000 – 1'250 |
| Video PRO | 2 | 1'750 – 2'750 |
| Video PREMIUM | 3–4 | 3'500 – 4'500 |
| Video LUXURY | 3–5 | 5'000 – 6'000 |
| Social + | 3–5 | 1'750 – 2'750 |

### 4.6 Video — Corporate

| Pacchetto | Persone | Prezzo (da–a) |
|---|---|---|
| Video START | 1 | 1'000 – 1'250 |
| Video PRO | 2 | 1'750 – 2'750 |
| Video PREMIUM | 3–4 | 3'500 – 4'500 |
| Video LUXURY | 3–5 | 5'000 – 6'000 |
| Social + | 1 | 1'750 – 2'750 |

### 4.7 Video — Commercial / ADV

| Pacchetto | Persone | Prezzo (da–a) |
|---|---|---|
| Video START | 1 | 1'250 – 1'500 |
| Video PRO | 2 | 2'000 – 3'000 |
| Video PREMIUM | 3–4 | 3'500 – 4'750 |
| Video LUXURY | 3–5 | 5'500 – 6'500 |
| Social + | 1 | 1'750 – 2'750 |

### 4.8 Podcast

| Pacchetto | Setup | Cosa offriamo | Prezzo (da–a) |
|---|---|---|---|
| Podcast START | 2 camere, 1 persona | Registrazione audio/video, montaggio semplice, pubblicazione | 1'000 – 1'250 |
| Podcast PRO | 3 camere, 2 persone | 2 camere, grafiche base, clip social, distribuzione | 1'750 – 2'750 |
| Podcast PREMIUM | 4 camere, 3 persone + Live | Regia, grafiche, sigla, clip, strategia editoriale, LIVE | 3'500 – 4'500 |

### 4.9 Personal Branding

| Pacchetto | Prezzo (da–a) |
|---|---|
| Personal Brand START | 750 – 1'000 |
| Personal Brand PREMIUM | 1'500 – 2'500 |
| Professional Pack | 1'500 – 2'500 |
| Political Pack | 1'500 – 2'500 |

### 4.10 Sport / Team / Atleti

| Pacchetto | Prezzo (da–a) |
|---|---|
| Sport Brand START | 750 – 1'000 |
| Sport Brand PREMIUM | 1'500 – 2'500 |
| Team PREMIUM | 2'000 – 2'500 |

### 4.11 Artisti / Musica / Creator

| Pacchetto | Prezzo (da–a) |
|---|---|
| Artist Brand START | 750 – 1'000 |
| Artist Brand PREMIUM | 1'500 – 2'500 |
| Team PREMIUM | 2'000 – 2'500 |

---

## 5. Matrice categoria cliente → settori e pacchetti disponibili

> Ricostruita dalla mappa "Home" del documento *Pacchetti (con specifiche)*. Indica, per ogni categoria di cliente, quali settori/pacchetti mostrare nel flusso. I livelli disponibili crescono con la dimensione/maturità del cliente.

| Categoria cliente | Settori mostrati | Livelli pacchetto tipici |
|---|---|---|
| **Start Up** (azienda) | Branding, Web, Social, Eventi, Corporate, Commercial-ADV, Fashion-Music | START → PRO (alcuni PREMIUM); add-on Web/Social/Graphic/Merch/AI |
| **Piccola attività** (azienda) | Branding, Web, Social, Eventi, Corporate, Commercial-ADV, Fashion-Music | START → PRO → PREMIUM; Rebranding; E-commerce START/PRO; Landing |
| **PMI** (azienda) | Branding, Web, Social, Eventi, Corporate, Commercial-ADV, Fashion-Music | gamma completa fino a PREMIUM / LUXURY; E-commerce PREMIUM |
| **Corporate** (azienda) | Web, Social, Eventi, Corporate, Commercial-ADV, Personal Branding | gamma completa, focus PRO/PREMIUM/LUXURY + Personal Brand |
| **Freelancer** (privato) | Branding, Web, Social, Eventi, Corporate, Commercial-ADV, Fashion-Music | START → PRO (+PREMIUM su web/social) |
| **Creator** (privato) | Web, Social, Eventi, Corporate, Commercial-ADV, Personal Branding | START → PRO |
| **Artista / Musicista** (privato) | Web, Social, Eventi, Corporate, Commercial-ADV, Artist Brand | START → PRO → PREMIUM; Fashion-Music video |
| **Atleta** (privato) | Web, Social, Eventi, Sport Brand | START → PRO → PREMIUM; Video LUXURY |
| **Public figure** (privato) | Web, Social, Eventi, Corporate, Commercial-ADV, Personal Branding | gamma ampia fino a PREMIUM/LUXURY |
| **Podcast** (privato) | Web, Social, Podcast, Personal Branding | START → PRO → PREMIUM |

> Da confermare nei dettagli con il team (le combinazioni esatte possono cambiare). La logica di base: **più la realtà è strutturata, più livelli alti e settori vengono sbloccati.**

---

## 6. Add-on, abbonamenti e add-on "+"

### Add-on "+" (componenti aggiuntivi a un pacchetto base) — usati nel preventivo

| Add-on | A cosa serve | Prezzo (da–a) |
|---|---|---|
| **Web +** | Aggiunge una presenza web (landing/sito) al pacchetto | 2'000 – 3'000 |
| **Social +** | Aggiunge gestione/contenuti social | 1'750 – 2'750 |
| **Graphic +** | Aggiunge grafiche dedicate (locandine, copertine) | 500 – 1'000 |
| **Merch +** | Aggiunge linea merchandising | 500 – 1'000 |
| **AI +** | Contenuti/automazioni AI (per minuto/uso) | 1'000 |
| **LinkedIn +** | Positioning su LinkedIn | 1'000 – 1'500 |

> Nota: quali "+" sono disponibili dipende dal settore (es. *Graphic+* e *Merch+* compaiono soprattutto su Eventi/Fashion/Artisti). Nei doc, ogni cella pacchetto elenca i suoi "+" disponibili.

### Abbonamenti / servizi continuativi (Web Management)

Dal documento *Costo Lavori Singoli*, da proporre come voci ricorrenti opzionali:

| Servizio | Prezzo |
|---|---|
| Gestione sito mensile | 250 / mese |
| Aggiornamento contenuti | 100 / a consumo |
| Backup | 100 / mese |
| Gestione hosting | 200 / anno |
| Dominio | 40 / anno |

---

## 7. Estetica e design (direzione confermata: "decidi tu")

> Tommy mi ha dato carta bianca. Ecco la direzione che propongo. È **una guida, non una gabbia**: nella sessione di build si potrà rifinire.

### 7.1 Mood generale
**Editoriale minimal + accenti pop + animazioni eleganti.** Base pulita e luminosa, tanta aria e spazio negativo, tipografia grande e di carattere, accenti di colore usati con intenzione (non ovunque). Personalità giovane e sicura, mai caotica. Effetto "studio creativo di alto livello" più che "agenzia generica".

- **Tema:** chiaro di default, con possibilità di **dark mode** (toggle). Il dark valorizza i colori delle categorie e dà il tocco "cinematico/premium".
- **Tono visivo:** professionale e affidabile, ma con momenti pop (un blocco colorato, una transizione sorprendente, una micro-interazione giocosa) che dicono "siamo ragazzi con voglia di fare".

### 7.2 Tipografia
- **Display / titoli:** un sans-serif geometrico e moderno con personalità (es. famiglia tipo *Clash Display*, *General Sans*, *Satoshi* o equivalenti). Titoli grandi, decisi.
- **Testo:** sans-serif neutro e leggibile (es. *Inter*) per massima chiarezza e leggibilità multilingua.
- Gerarchia netta: titoli molto grandi, sottotitoli medi, corpo arioso con interlinea generosa.

### 7.3 Palette colori per settore
Parto dai colori dei documenti interni, **raffinati per armonia ed eleganza**, mantenendo la riconoscibilità immediata di ogni settore. Valori indicativi (da rifinire in fase di build):

| Settore | Colore | Hex indicativo |
|---|---|---|
| Branding / Identità | Verde | `#2E8B6E` |
| Web / Digital | Teal | `#1FA2A6` |
| Social Media | Blu | `#3B6FE0` |
| Video (Eventi/Fashion/Corporate/Commercial) | Rosa / Magenta | `#E8487E` |
| Podcast | Rosso | `#E0453B` |
| Personal Branding | Arancione | `#F2922E` |
| Sport / Team / Atleti | Arancione (variante) | `#F2792E` |
| Artisti / Musica / Creator | Arancione (variante) | `#F2A63E` |

- **Neutri di base:** off-white (`#FAFAF8`), inchiostro (`#15161A`), grigi morbidi per testi secondari.
- **Uso del colore:** la card/sezione di ogni settore prende il suo colore (bordo, accento, icona, sfondo tenue). Nel preventivo, ogni voce mantiene il colore del suo settore così il cliente "legge" a colpo d'occhio cosa sta comprando.

### 7.4 Animazioni e "effetto wow" (requisito)
- **Menu:** overlay/tendina full-screen animato, voci che entrano in sequenza, transizione fluida.
- **Hero:** elemento d'impatto (gradient animato, testo che si compone, o forma/3D leggero) — deve fermare lo scroll.
- **Scroll:** reveal progressivo degli elementi, parallax leggero, numeri/contatori animati dove ha senso.
- **Flusso 3 domande:** transizioni morbide tra gli step, feedback immediato alla selezione, barra di avanzamento.
- **Preventivo:** il totale si aggiorna con animazione (numero che "scorre") ogni volta che si aggiunge/toglie un'opzione — proprio come Apple.
- **Micro-interazioni:** hover su card/pulsanti, stati attivi, cursori, piccoli dettagli che danno cura.
- **Regola d'oro:** animazioni fluide ma **mai a scapito delle performance o della chiarezza**. Rispettare `prefers-reduced-motion` per accessibilità.

### 7.5 Responsive (requisito su tutti i device)
- **Mobile-first** nel ragionamento, ma curato in modo "pixel perfect" su desktop, tablet e mobile.
- Il flusso a step su mobile diventa a schermo intero, una domanda per volta, con pulsanti grandi e comodi al pollice.
- Le tabelle pacchetti diventano card scrollabili su mobile.
- Menu hamburger elegante su mobile, coerente con l'overlay desktop.

### 7.6 Componenti chiave (da progettare con cura estetica)
- **Card pacchetto:** colore del settore, nome, prezzo "da", 3–5 bullet di specifiche, CTA "Configura / Seleziona". Belle, chiare, intuibili.
- **Selettori Step 1/2/3:** grandi, tattili, con icona (placeholder) e colore.
- **Configuratore preventivo:** lista add-on con toggle/checkbox, totale sticky sempre visibile, switch valuta CHF/EUR.
- **Riepilogo:** scheda finale leggibile prima dell'invio.

---

## 8. Nome e logo provvisori (placeholder)

- **Nome provvisorio scelto:** **"Atto"** (corto, astratto, internazionale, brandizzabile — *atto* come "azione/fare", coerente col vostro spirito). Va usato **ovunque marcato come `[NOME PROVVISORIO]`** così è banale trovarlo e sostituirlo.
- **Logo:** placeholder testuale/segnaposto (es. quadrato con iniziale o testo "Atto"). Predisporre lo slot logo in header e footer con dimensioni e spazi pronti per il logo vero.
- **Icone settori:** placeholder coerenti (es. set di icone neutre tipo Lucide) con nota "da sostituire con icone custom". Predisporre uno slot icona per ogni settore.

> Tutto ciò che è provvisorio sarà elencato in fondo (§11) come checklist di sostituzione.

---

## 9. Sezione "Chi siamo" + Portfolio

### 9.1 Chi siamo
Breve, sicura, umana. Racconta: chi siamo (squadra giovane di professionisti, ognuno con la sua specialità), come lavoriamo (un unico punto di accesso a tutti i servizi), e perché fidarsi. Tono: competente ma con voglia di fare.

**Il team e i ruoli** (dai documenti — utili per la sezione e per associare i lavori al portfolio):

| Persona | Ruolo |
|---|---|
| D. Macchi | Responsabile Servizi |
| D. Cirrincione | Referente AI |
| F. Benedetti ("Fedone") | Referente Social |
| T. Zaffalon ("Tommy") | Referente Informatico / Web |
| M. Agueci | Referente Grafica |
| Martina | Branding / Identità |

> Da confermare nomi pubblici, foto e bio brevi di ciascuno.

### 9.2 Portfolio — formato dei lavori da raccogliere
Mostriamo **3–4 lavori per settore** come prova concreta. Per ogni settore una mini-galleria curata con il colore del settore.

**Formato richiesto a ciascun referente** (questa è la lista che Tommy può girare al team):

- **Web (Tommy):** 3–4 siti realizzati → per ognuno: screenshot/mockup desktop+mobile (immagine 16:9 + verticale), nome progetto, link, 1 riga di descrizione.
- **Grafica (M. Agueci):** 3–4 lavori → immagini ad alta risoluzione (loghi, identità, locandine), 1 riga di contesto.
- **Social (Fedone):** 3–4 post/reel migliori → screenshot o export verticale (9:16), eventuale numero/risultato, 1 riga.
- **Video (team riprese):** 3–4 video → copertina/thumbnail + link (YouTube/Vimeo), titolo, tipo (evento/corporate/music...), durata.
- **Branding (Martina):** 3–4 progetti di identità → board visiva (logo + palette + applicazioni), nome cliente/settore.
- **Podcast / Personal / Sport / Artisti:** 3–4 esempi se disponibili, stesso schema (immagine + 1 riga).

**Specifiche immagini consigliate:** orizzontali 1920×1080, verticali 1080×1920, peso ottimizzato (<300KB), formato `.webp`/`.jpg`. Per ora useremo **placeholder** con il colore del settore.

---

## 10. Logica del preventivo (stile Apple) + Formspree

### 10.1 Comportamento "configuratore"
Esattamente come configurare un iPhone:

1. L'utente **seleziona un pacchetto** (es. *Website PRO* → da CHF 1'500).
2. Vede il **prezzo base** ("a partire da").
3. Aggiunge **opzioni/add-on** (es. *Social +*, *Graphic +*, *SEO avanzata*, *Gestione mensile*, ...). Ogni opzione mostra il suo prezzo.
4. Il **totale si aggiorna in tempo reale** con animazione del numero.
5. Switch **CHF ⇄ EUR** sempre disponibile (default CHF).
6. Messaggio chiaro: *"Preventivo indicativo — il prezzo finale verrà confermato dopo un primo contatto."*

**Opzioni aggiuntive selezionabili** = gli add-on "+" (§6) pertinenti al settore + eventuali voci dei "lavori singoli" sensate (es. SEO base 800, SEO avanzata 1'500, Gestione mensile 250/mese, Hosting 200/anno, Dominio 40/anno, Backup 100/mese, ecc., dal doc *Costo Lavori Singoli*).

### 10.2 Form e invio (Formspree)
- Alla fine del preventivo, l'utente compila un **form** collegato a **Formspree** (`https://formspree.io`).
- **Campi del form:**
  - Nome / Cognome
  - Email *(obbligatoria)*
  - Telefono *(opzionale)*
  - Azienda / progetto *(opzionale)*
  - **Riepilogo automatico** della selezione: categoria cliente, settore/i, pacchetto scelto, add-on, **totale stimato** (campi nascosti precompilati dal configuratore).
  - Messaggio libero ("raccontaci di più")
  - Lingua preferita per il contatto
  - Consenso privacy (checkbox)
- **Risultato:** a noi arriva una **mail** con tutti i dati + il preventivo impostato, così sappiamo già chi è e cosa vuole prima di richiamarlo.
- **Note tecniche Formspree:** serve l'endpoint `https://formspree.io/f/{ID}` (placeholder `[FORMSPREE_FORM_ID]` da inserire); gestire stato di successo/errore, anti-spam (honeypot), e messaggio di conferma elegante.

---

## 11. Specifiche tecniche & multilingua

- **Multilingua:** **EN default**, + **IT, DE, FR**. Switch lingua sempre accessibile (header/footer). Tutti i testi gestiti come stringhe traducibili (oggetto/i18n), così aggiungere/rivedere traduzioni è semplice. *Per la prima versione: EN e IT completi, DE e FR possono partire come bozza da rifinire.*
- **Performance:** caricamento veloce, immagini ottimizzate (webp, lazy-load), animazioni performanti (CSS/Framer-Motion-like), attenzione ai Core Web Vitals.
- **Accessibilità:** contrasto adeguato, navigazione da tastiera, `prefers-reduced-motion`, alt text.
- **SEO base:** title/description, struttura semantica, sitemap, OpenGraph per condivisione.
- **Stack suggerito:** sito statico moderno (HTML/CSS/JS o React) — single-file o progetto leggero — facilmente ospitabile. Il configuratore può essere tutto client-side; il form va a Formspree. *(La scelta finale dello stack si fa in sessione di build.)*
- **Privacy:** pagina/blocco privacy + cookie banner se servono analytics.

---

## 12. Checklist materiali da raccogliere (placeholder da sostituire)

- [ ] **Nome definitivo** del service (ora placeholder "Atto" → `[NOME PROVVISORIO]`)
- [ ] **Logo** (header + footer + favicon)
- [ ] **Icone** per gli 11 settori (custom, a sostituzione dei placeholder)
- [ ] **Portfolio Web** — 3–4 progetti (Tommy)
- [ ] **Portfolio Grafica** — 3–4 lavori (M. Agueci)
- [ ] **Portfolio Social** — 3–4 post/reel (Fedone)
- [ ] **Portfolio Video** — 3–4 video + link (team riprese)
- [ ] **Portfolio Branding** — 3–4 identità (Martina)
- [ ] **Foto + bio** del team per "Chi siamo"
- [ ] **Endpoint Formspree** (`[FORMSPREE_FORM_ID]`)
- [ ] **Traduzioni DE e FR** rifinite (revisione madrelingua)
- [ ] **Conferma valuta** e formati prezzo (CHF default + EUR)
- [ ] **Conferma matrice** categoria→settori→pacchetti (§5) con il team
- [ ] **Conferma logica abbonamenti Social** (one-shot vs mensile) con Fedone

---

## 13. Domande aperte / decisioni da prendere in sessione

1. **Prezzo mostrato:** confermo "a partire da" (valore Basso) come scelta di default — ok?
2. **Settori multipli:** se l'utente sceglie più settori, mostriamo più gruppi di pacchetti e il preventivo li somma — confermare se desiderato.
3. **Abbonamenti Social:** come presentarli (mensile/annuale) senza confondere il preventivo one-shot.
4. **Dark mode:** la teniamo come toggle o partiamo solo chiaro per la v1?
5. **Stack tecnico** finale e hosting.

---

*Documento generato a partire dai materiali in `/docs`. Tutti i prezzi e le categorie provengono dai file interni; i testi marcati come placeholder e il nome/logo sono provvisori e da sostituire.*
