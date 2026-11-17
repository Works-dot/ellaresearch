// A KÖZÖS LAP-KERET — fejléc, lábléc, fejrész. Minden lap ezen át készül.
//
// MIÉRT EGY HELYEN: négy lap van (két lap × két nyelv). Ha a keretet laponként írnánk, a negyedik
// lapon némán elcsúszna a nyelvváltó vagy a fejrész — pont az a fajta hiba, amit senki nem néz meg.
//
// A NYELVVÁLTÓ A LAP PÁRJÁRA VISZ, nem a kezdőlapra (D17/8e): az `UTAK` tábla a megfeleltetés. A
// `hreflang` ugyanebből a táblából jön, tehát a kettő nem tud széttartani.
//
// ⚠ SZÖVEGET CSAK A `sz` / `nyers` FÜGGVÉNNYEL írj ki (az `epit.mjs` adja át) — azok escape-elnek ÉS
// számolják a helykitöltőket. A keret saját, külön megjelenítője korábban kimaradt a számlálásból:
// a lábléc három helykitöltője nem szerepelt a jelentésben.

/** Az utak nyelvenként — EZ a megfeleltető tábla (a nyelvváltó és a `hreflang` forrása). */
export const UTAK = {
  hu: { bemutatkozas: "/hu/", panel: "/hu/csatlakozz-a-panelhez/" },
  en: { bemutatkozas: "/en/", panel: "/en/join-the-panel/" },
};

export const NYELVEK = Object.keys(UTAK);

/** HTML-escape. Minden szöveg ezen megy át — a szövegfájl tartalma is adat, nem jelölés. */
export function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * A lap kerete.
 * `indexelheto`: amíg helykitöltő szöveg van a lapon, NEM indexelhető (l. `epit.mjs`) — a félkész
 * oldal keresőbe kerülése visszafordíthatatlan.
 */
export function lapHtml({ t, oldal, cim, leiras, tartalom, indexelheto, alap, sz, nyers }) {
  const sajatUt = UTAK[t.kod][oldal];
  const parNyelv = NYELVEK.find((n) => n !== t.kod);
  const parUt = UTAK[parNyelv][oldal];
  const k = t.keret;
  const aktiv = (o) => (o === oldal ? ' aria-current="page" class="akt"' : "");
  const hol = `${t.kod}/${oldal}`;

  const hreflangok = NYELVEK.map(
    (n) => `  <link rel="alternate" hreflang="${n}" href="${alap}${UTAK[n][oldal].slice(1)}">`,
  ).join("\n");

  return `<!doctype html>
<html lang="${t.kod}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(nyers(cim, `${hol}/fejcim`))}</title>
  <meta name="description" content="${esc(nyers(leiras, `${hol}/leiras`))}">
${indexelheto ? "" : '  <meta name="robots" content="noindex, nofollow">\n'}  <link rel="canonical" href="${alap}${sajatUt.slice(1)}">
${hreflangok}
  <link rel="alternate" hreflang="x-default" href="${alap}">
  <link rel="stylesheet" href="/stilus/tokens.css">
  <link rel="stylesheet" href="/stilus/oldal.css">
</head>
<body>
  <a class="ugras" href="#tartalom">${sz(k.ugras, `${hol}/ugras`)}</a>
  <header class="fej">
    <div class="sav fej-sav">
      <a class="marka" href="${UTAK[t.kod].bemutatkozas}"><span>${sz(k.markaNev, `${hol}/marka`)}</span><i class="pont" aria-hidden="true"></i></a>
      <nav class="menu" aria-label="${esc(nyers(k.markaNev, `${hol}/marka`))}">
        <a href="${UTAK[t.kod].bemutatkozas}"${aktiv("bemutatkozas")}>${sz(k.menu.bemutatkozas, `${hol}/menu`)}</a>
        <a href="${UTAK[t.kod].panel}"${aktiv("panel")}>${sz(k.menu.panel, `${hol}/menu`)}</a>
      </nav>
      <a class="nyelv" href="${parUt}" lang="${parNyelv}" hreflang="${parNyelv}" title="${esc(nyers(k.nyelvvaltoCim, `${hol}/nyelvvalto`))}">${sz(k.nyelvvalto, `${hol}/nyelvvalto`)}</a>
    </div>
  </header>
  <main id="tartalom">
${tartalom}
  </main>
  <footer class="lab">
    <div class="sav">
      <p class="lab-sor">${sz(k.lablec.sor, `${hol}/lablec`)}</p>
      <p class="lab-linkek">${k.lablec.linkek.map((l) => jogiLink(l, sz, nyers, hol)).join('<span class="kozep" aria-hidden="true"></span>')}</p>
      <p class="lab-jegyzet">${sz(k.lablec.jegyzet, `${hol}/lablec-jegyzet`)}</p>
    </div>
  </footer>
  <script src="/js/utm.js" defer></script>
</body>
</html>
`;
}

/**
 * Jogi link a láblécben. ⚠ Amíg nincs valódi cím (`ut` üres), NEM linket írunk, hanem jelölt
 * helykitöltőt: egy `href="#"` link úgy néz ki, mintha működne, és némán sehova nem vinne.
 */
function jogiLink(l, sz, nyers, hol) {
  if (!l.ut) return sz(l.cimke, `${hol}/lablec-link`);
  return `<a href="${esc(nyers(l.ut, `${hol}/lablec-ut`))}">${sz(l.cimke, `${hol}/lablec-link`)}</a>`;
}
