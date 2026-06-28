# Handoff: bug footer ultima sezione (HOME mobile)

Documento per la prossima sessione di Claude Code. Scritto perché il bug NON è
ancora risolto dopo molti tentativi. **Leggi tutto prima di toccare il codice.**

## Il bug (parole dell'utente)
HOME (`index.html`, `body[data-bg="field"]`), snap-scroll cinematografico a 6
sezioni. **Solo su MOBILE.** Arrivando all'ULTIMA sezione (`.scene--cta`, che
contiene il `<footer class="foot">`):
- appena arrivi il footer è "metà dentro metà fuori" (tagliato sotto);
- dopo ~1 secondo il contenuto "scatta" e si sposta più in alto per far entrare
  il footer.
Deve invece essere come su DESKTOP: il footer è parte integrante dell'ultima
sezione, **già visibile e fermo appena arrivi**, senza scatti.

Succede sia su Chrome che su Safari mobile (quindi non è un bug di un solo
browser). Su desktop tutto funziona — NON toccare il desktop.

## Stato attuale del codice (ripristinato al baseline v17)
Ho appena RIMOSSO tutti i miei tentativi falliti. Adesso il blocco mobile in
`style.css` (`@media (max-width:760px)`, ~riga 832) è il baseline che funzionava
per le sezioni 1–5:
```css
@media (max-width:760px){
  html:has(body[data-bg="field"]){scroll-snap-type:y mandatory}
  .scene{height:100svh}
  .scene__pin{padding:84px clamp(20px,6vw,40px) 60px}
  .scene__c{max-height:none;
    opacity:calc(.42 + var(--vis,0)*.58);
    transform:translateY(calc(var(--off,0)*22px)) scale(calc(.99 + var(--vis,0)*.01))}
  .scene__bg{opacity:calc(.3 + var(--vis,0)*.7)}
  .scene--work .cwork__h{font-size:clamp(1.8rem,7vw,2.4rem);margin-bottom:14px}
  .cwork__strip{gap:10px}
  .cwork__strip .cplate{aspect-ratio:1/1}
  .clink{margin-top:16px}
  .cine__rail{bottom:14px;left:16px}
}
```
Niente più override CSS specifici per `.scene--cta` su mobile. Il footer usa la
regola DESKTOP (`.scene--cta .scene__c{flex:1}` → footer spinto in fondo).

## Struttura rilevante
- `index.html` ~riga 176-190: la `.scene--cta` contiene `.scene__pin` >
  `.scene__bg.sb-6` + `.scene__c` (CTA: kicker, `h2.ccta__h`, `a.ccta__btn`) +
  `<footer class="foot">`. **Il footer è GIÀ dentro la sezione** — la struttura
  HTML non è mai stata il problema.
- `style.css`:
  - DESKTOP: `html:has(body[data-bg="field"]){scroll-snap-type:y mandatory}`,
    `.scene{height:100vh;scroll-snap-align:start;scroll-snap-stop:always}`.
  - `.scene--cta .scene__pin{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-bottom:0}`
  - `.scene--cta .scene__c{flex:1;display:flex;flex-direction:column;justify-content:center;max-height:none}`
  - `.scene--cta .foot{width:100%;pointer-events:auto}`
  - `.scene__bg{display:none}` (i tint per-scena sono superseded dal glow JS;
    questo conta: la `.scene--cta` ha sfondo TRASPARENTE).
- `app.js` `initCine()`: loop rAF che scrive `--off`/`--vis` per sezione +
  blend del `#sceneGlow`. Nessun ruolo nel layout del footer.

## La causa radice (la mia diagnosi, da verificare SU DISPOSITIVO)
È la guerra dei dynamic-viewport units di iOS/Android contro lo scroll-snap:
- `100vh` = large viewport (barra nascosta) → troppo alto quando la barra è
  visibile → "seam" tra sezioni.
- `100svh` = small viewport (barra visibile), STABILE, non si ridimensiona →
  sezioni 1–5 OK, ma quando la barra si nasconde il viewport diventa più alto di
  svh e la sezione non lo riempie.
- `100dvh` = viewport corrente → si ridimensiona a OGNI toggle della barra →
  scatti su TUTTE le sezioni.
Con `flex:1` il footer è ancorato al FONDO ESATTO del viewport; su mobile quel
fondo si muove quando la barra appare/scompare → footer tagliato all'arrivo poi
scatto.

## Cosa ho GIÀ provato e che NON funziona (NON ripeterli)
1. `.scene--cta{height:100dvh}` mentre le 1–5 restano svh → mismatch svh/dvh al
   confine 5→6: footer tagliato poi scatto. **Lezione: mai mischiare svh e dvh
   tra scene snap.**
2. TUTTE le scene `100dvh` → si ridimensionano ad ogni toggle barra → scatti su
   ogni sezione (peggio). **Lezione: mai dvh su scene snap.**
3. svh ovunque + `.scene--cta{scroll-snap-align:end}` → le 1–5 stabili ma
   l'ultima sezione fa ancora lo stacco.
4. `proximity` su mobile + CTA compatta → non risolve; e `proximity` rischia di
   rompere la sensazione snap.
5. **Ultimo tentativo (sembrava giusto in headless ma ha ROTTO su device):**
   togliere il pin e impilare contenuto+footer dall'ALTO:
   `.scene--cta .scene__pin{justify-content:flex-start;padding-top:96px}` +
   `.scene--cta .scene__c{flex:0 0 auto}`. In preview headless il footer era a
   ~309px dall'alto, fisso, sempre visibile. MA SU DEVICE l'utente dice che il
   footer è SPARITO e il contenuto è più in alto del solito e fa lo stesso
   scatto. **Quindi il modello mentale "stack dall'alto" è sbagliato o c'è
   altro in gioco che il preview non mostra.** RIMOSSO.

## Limite critico del tooling
Il preview Claude (`python http.server` headless) **NON può simulare la barra
indirizzi reale di iOS/Android** che appare/scompare. Tutte le mie verifiche con
`preview_eval`/`preview_resize` misurano viewport STATICI → non riproducono il
bug → mi hanno dato falsi positivi. **Questo bug va testato SOLO su un telefono
vero.** Non fidarti delle misurazioni headless per dichiararlo risolto.
Altri quirk: l'istanza eval/screenshot è separata da quella resize e riporta
larghezze stale; lo screenshot è bloccato a scroll-top (non scrolla all'ultima
sezione); `app.js` spesso servito da cache (304) → ricarica con `?cb=Date.now()`.

## Idee NON ancora provate (per la prossima sessione)
- **Misurare il viewport in JS e bloccare l'altezza delle scene** con
  `--vh` calcolato da `window.innerHeight` aggiornato su `resize`/`scroll`
  (tecnica classica `--vh: innerHeight*0.01`), invece di affidarsi a svh/dvh.
  Possibile listener che fissa l'altezza solo quando lo scroll è fermo.
- **Togliere lo scroll-snap SOLO sull'ultima sezione** e farla scorrere normale
  così il footer non dipende dallo snap.
- **Footer FUORI dalle scene snap:** rendere le 6 scene `height:100svh` snap, e
  mettere il footer come blocco normale DOPO il container snap (non dentro la
  cta), così è semplicemente sotto, raggiungibile scrollando, senza snap.
  (Attenzione: un tentativo simile in passato dava "bounce" — ma combinato con
  un'ultima sezione più corta potrebbe funzionare.)
- **`@supports` / test reale**: verificare con DevTools mobile su device fisico,
  non emulatore, registrando un video dello scatto per capire l'altezza esatta
  al frame dell'arrivo.
- Considerare di **rinunciare allo snap su mobile** del tutto (l'utente lo
  amava, ma è la fonte del conflitto col dynamic viewport) e usare scroll
  normale con sezioni `min-height:100svh`.

## Regole da rispettare (preferenze utente, da MEMORY.md)
- NON usare `proximity` su DESKTOP (l'utente: "lo snap è rotto su pc, viaggi in
  mezzo alle sezioni"). Desktop = `mandatory`, intoccabile.
- L'utente AMA lo snap su mobile (idea da preservare se possibile).
- Tutti i link interni sono RELATIVI, no bundler, `<script>` globali su window.
- Verifica sempre con l'utente su device — il preview headless mente su questo bug.
