#!/usr/bin/env node
// AZ ÉPÍTŐ — a szövegfájlokból és a sablonokból kiírja a négy lapot a `dist/`-be.
//
// NULLA FÜGGŐSÉG, szándékosan: egy statikus, négylapos oldalhoz az építő-gépezet és a függőség-fa
// fölösleges, és így a licenc- meg az ellátási-lánc kérdés fel sem merül.
//
// HÁROM DOLGOT KAPUZ (mindhárom némán romlana el):
//   1) KULCS-EGYEZÉS a nyelvek között → hibával megáll. Visszaesés a másik nyelvre NINCS: egy félig
//      lefordított lap rosszabb, mint egy hibajelzés az építésnél.
//   2) HELYKITÖLTŐK: a "§"-sal kezdődő szövegeket megszámolja, a lapon LÁTHATÓAN megjelöli, és amíg
//      van akár egy is, a lapok `noindex`-et kapnak — a félkész oldal keresőbe kerülése nem vonható
//      vissza.
//   3) KÜLSŐ ERŐFORRÁS: ha a kimenetben bármely betű, kép, szkript vagy stíluslap külső címről jönne,
//      hibával megáll (házszabály: a külső CDN a látogató IP-címét harmadik félnek adja ki).
//      ⚠ A LINKEK (`<a href>`) SZÁNDÉKOSAN kimaradnak a tiltásból: a regisztráció gombja a portál
//      címére visz. Erőforrás-betöltés és hivatkozás nem ugyanaz.
//
// Használat:
//   node epit.mjs              — ellenőriz, és kiírja a `dist/`-et
//   node epit.mjs --ellenoriz  — csak ellenőriz és jelent, nem ír fájlt
//
// Környezeti változók:
//   PORTAL_REGISZTRACIO — a panel regisztrációjának CÍME (a gomb célja). Alapérték a helyi shell.
//                         ⚠ Élesben KÖTELEZŐ beállítani; a jelentés kiírja, ha az alapérték fut.
//   ELLARESEARCH_ALAP   — az oldal saját alap-címe (a `canonical` és a `hreflang` ebből épül).
//   INDEXELHETO=1       — engedi az indexelést, DE csak ha nulla helykitöltő van.

import fs from "node:fs";
import path from "node:path";
import { UTAK, NYELVEK, esc, lapHtml } from "./sablon/lap.mjs";
import { bemutatkozasHtml } from "./sablon/bemutatkozas.mjs";
import { panelHtml } from "./sablon/panel.mjs";

const GYOKER = import.meta.dirname;
const CSAK_ELLENORIZ = process.argv.includes("--ellenoriz");

const REG_ALAP = "http://localhost:4000/paneltag/regisztracio";
const REG_LINK = process.env.PORTAL_REGISZTRACIO || REG_ALAP;
const ALAP_CIM = (process.env.ELLARESEARCH_ALAP || "https://ellaresearch.com").replace(/\/+$/, "") + "/";

// ——— szövegek ———————————————————————————————————————————————————————————————

const szovegek = {};
for (const n of NYELVEK) {
  szovegek[n] = (await import(`./szovegek/${n}.mjs`)).default;
}

/** A kulcs-szerkezet útjai (a tömbök indexe is út) — a nyelvek összevetéséhez. */
function kulcsUtak(ertek, elotag = "") {
  if (Array.isArray(ertek)) return ertek.flatMap((e, i) => kulcsUtak(e, `${elotag}[${i}]`));
  if (ertek && typeof ertek === "object") {
    return Object.keys(ertek)
      .sort()
      .flatMap((k) => kulcsUtak(ertek[k], elotag ? `${elotag}.${k}` : k));
  }
  return [elotag];
}

function kulcsEgyezes() {
  const [elso, ...tobbi] = NYELVEK;
  const alap = kulcsUtak(szovegek[elso]);
  const alapKeszlet = new Set(alap);
  const hibak = [];
  for (const n of tobbi) {
    const mas = new Set(kulcsUtak(szovegek[n]));
    for (const u of alap) if (!mas.has(u)) hibak.push(`${n}: hianyzik — ${u}`);
    for (const u of mas) if (!alapKeszlet.has(u)) hibak.push(`${n}: folosleges — ${u}`);
  }
  return hibak;
}

// ——— helykitöltők ———————————————————————————————————————————————————————————

/** Megjelenítő + számláló. EGY betartató pont: minden szöveg ezen megy át. */
function jeloloKeszito() {
  const talalatok = [];
  return {
    talalatok,
    /** Lapra írt szöveg: a helykitöltő LÁTHATÓ jelölést kap. */
    sz(ertek, hol) {
      const s = String(ertek);
      if (!s.startsWith("§")) return esc(s);
      talalatok.push({ hol, szoveg: s.slice(1) });
      return `<span class="hk" title="helykitöltő">${esc(s.slice(1))}</span>`;
    },
    /** Attribútumba vagy fejrészbe írt szöveg: jelölés nem lehet benne, de SZÁMOL. */
    nyers(ertek, hol) {
      const s = String(ertek);
      if (!s.startsWith("§")) return s;
      talalatok.push({ hol, szoveg: s.slice(1) });
      return s.slice(1);
    },
  };
}

// ——— lapok ——————————————————————————————————————————————————————————————————

const OLDALAK = [
  { kulcs: "bemutatkozas", keszit: bemutatkozasHtml },
  { kulcs: "panel", keszit: panelHtml },
];

function lapokat(indexelheto) {
  const jelolo = jeloloKeszito();
  const lapok = [];
  for (const n of NYELVEK) {
    const t = szovegek[n];
    for (const o of OLDALAK) {
      const tartalom = o.keszit({ t, sz: jelolo.sz, nyers: jelolo.nyers, regLink: REG_LINK });
      lapok.push({
        ut: UTAK[n][o.kulcs],
        html: lapHtml({
          t,
          oldal: o.kulcs,
          cim: t[o.kulcs].fejcim,
          leiras: t[o.kulcs].leiras,
          tartalom,
          indexelheto,
          alap: ALAP_CIM,
          sz: jelolo.sz,
          nyers: jelolo.nyers,
        }),
      });
    }
  }
  return { lapok, talalatok: jelolo.talalatok };
}

/**
 * A GYÖKÉR LAPJA — `x-default`. Csak akkor látszik, ha a kérésben nincs értelmezhető nyelv-fejléc
 * (tipikusan robotoknál): a böngészőt a szerver a nyelve szerint irányítja. Ezért nincs benne
 * szkript és süti — a nyelvet nem a látogató beállítása dönti el ugyanazon a címen (8/e indoka).
 */
function gyokerHtml(indexelheto) {
  const linkek = NYELVEK.map((n) => {
    const t = szovegek[n];
    return `      <li><a lang="${n}" hreflang="${n}" href="${UTAK[n].bemutatkozas}">${esc(t.iranyitoCimke)}</a></li>`;
  }).join("\n");
  const hreflangok = NYELVEK.map(
    (n) => `  <link rel="alternate" hreflang="${n}" href="${ALAP_CIM}${UTAK[n].bemutatkozas.slice(1)}">`,
  ).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ella</title>
${indexelheto ? "" : '  <meta name="robots" content="noindex, nofollow">\n'}  <link rel="canonical" href="${ALAP_CIM}">
${hreflangok}
  <link rel="alternate" hreflang="x-default" href="${ALAP_CIM}">
  <link rel="stylesheet" href="/stilus/tokens.css">
  <link rel="stylesheet" href="/stilus/oldal.css">
</head>
<body class="gyoker">
  <main>
    <p class="marka"><span>Ella</span><i class="pont" aria-hidden="true"></i></p>
    <ul class="nyelv-lista">
${linkek}
    </ul>
  </main>
</body>
</html>
`;
}

// ——— külső erőforrás ————————————————————————————————————————————————————————

// Erőforrás-betöltés külső címről.
//
// ⚠ AMI SZÁNDÉKOSAN KIMARAD, ÉS MIÉRT — mindkettő teljes, külső cím, de egyik sem betöltés:
//   • `<a href>`: hivatkozás. A regisztráció gombja a portál címére visz.
//   • `<link rel="canonical">` és `rel="alternate" hreflang`: fejrész-adat a keresőnek. DEFINÍCIÓ
//     SZERINT absztolút cím — a saját domainünk, és a böngésző nem tölt le róla semmit.
// Ezért a `<link>`-nél a `rel` dönt, nem a cím alakja. A `preconnect` és a `dns-prefetch` IS
// betöltés-szerű: önmagában felveszi a kapcsolatot a külső hosttal, tehát kiadja a látogató címét.
const BETOLTO_REL = new Set([
  "stylesheet",
  "preload",
  "modulepreload",
  "prefetch",
  "preconnect",
  "dns-prefetch",
  "icon",
  "shortcut icon",
  "apple-touch-icon",
  "manifest",
]);

const MINTAK = [
  { nev: "src=", re: /\b(?:src|srcset)\s*=\s*["'](?:https?:)?\/\//gi },
  { nev: "url(", re: /url\(\s*["']?(?:https?:)?\/\//gi },
  { nev: "@import", re: /@import\s+(?:url\()?\s*["'](?:https?:)?\/\//gi },
];

function kulsoErroforrasok(nev, tartalom) {
  const talalt = [];
  for (const m of MINTAK) {
    const db = (tartalom.match(m.re) || []).length;
    if (db) talalt.push(`${nev}: ${db} db kulso eroforras — ${m.nev}`);
  }
  for (const cimke of tartalom.match(/<link\b[^>]*>/gi) || []) {
    const rel = (cimke.match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1] || "").trim().toLowerCase();
    const cim = cimke.match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1] || "";
    if (BETOLTO_REL.has(rel) && /^(?:https?:)?\/\//i.test(cim)) {
      talalt.push(`${nev}: kulso eroforras — <link rel="${rel}">`);
    }
  }
  return talalt;
}

// ——— futás ——————————————————————————————————————————————————————————————————

const hibak = [];
const kulcsHibak = kulcsEgyezes();
hibak.push(...kulcsHibak);

// Első kör: a helykitöltők megszámolása (az indexelhetőség ettől függ).
const elso = lapokat(false);
const hk = elso.talalatok;
const indexelheto = process.env.INDEXELHETO === "1" && hk.length === 0;

// Második kör: a végleges lapok, a helyes `noindex`-szel.
const { lapok } = lapokat(indexelheto);

// Külső erőforrás a lapokban és a kézzel írt statikus fájlokban.
const kulso = [];
for (const l of lapok) kulso.push(...kulsoErroforrasok(l.ut, l.html));
kulso.push(...kulsoErroforrasok("/", gyokerHtml(indexelheto)));
for (const f of ["stilus/tokens.css", "stilus/oldal.css", "js/utm.js"]) {
  const p = path.join(GYOKER, "statikus", f);
  if (fs.existsSync(p)) kulso.push(...kulsoErroforrasok(f, fs.readFileSync(p, "utf8")));
}
hibak.push(...kulso);

if (hibak.length) {
  console.error("AZ EPITES MEGALLT:");
  for (const h of hibak) console.error(`  - ${h}`);
  if (kulcsHibak.length) console.error("  (a nyelvek kulcs-szerkezetenek egyeznie kell)");
  if (kulso.length) console.error("  (kulso eroforras nem engedett — a betut es a szkriptet magunk szolgaljuk ki)");
  process.exitCode = 1;
} else if (CSAK_ELLENORIZ) {
  jelentes();
} else {
  const dist = path.join(GYOKER, "dist");
  fs.rmSync(dist, { recursive: true, force: true });
  for (const l of lapok) {
    const cel = path.join(dist, l.ut.replace(/^\//, ""), "index.html");
    fs.mkdirSync(path.dirname(cel), { recursive: true });
    fs.writeFileSync(cel, l.html, "utf8");
  }
  fs.writeFileSync(path.join(dist, "index.html"), gyokerHtml(indexelheto), "utf8");
  fs.writeFileSync(
    path.join(dist, "robots.txt"),
    indexelheto
      ? `User-agent: *\nAllow: /\nSitemap: ${ALAP_CIM}sitemap.xml\n`
      : "# Helykitolto tartalom — az oldal meg nem indexelheto.\nUser-agent: *\nDisallow: /\n",
    "utf8",
  );
  fs.cpSync(path.join(GYOKER, "statikus"), dist, { recursive: true });
  jelentes();
}

function jelentes() {
  const helyek = [...new Set(hk.map((h) => h.hol))];
  console.log(CSAK_ELLENORIZ ? "ELLENORZES (fajl nem irodott)" : "EPITES KESZ");
  console.log(`  lapok: ${lapok.length} (+ gyoker) — ${lapok.map((l) => l.ut).join(" · ")}`);
  console.log("  kulcs-egyezes a nyelvek kozott: rendben");
  console.log("  kulso eroforras: 0");
  console.log(`  helykitolto: ${hk.length} db, ${helyek.length} helyen`);
  const miert = hk.length ? " (helykitolto van)" : process.env.INDEXELHETO === "1" ? "" : " (INDEXELHETO nincs beallitva)";
  console.log(`  indexelheto: ${indexelheto ? "IGEN" : "NEM"}${miert}`);
  if (REG_LINK === REG_ALAP) {
    console.log("  FIGYELEM: a regisztracio gombja a HELYI cimre visz (PORTAL_REGISZTRACIO nincs beallitva)");
  }
  if (hk.length) {
    console.log("  a helykitoltok helye:");
    for (const h of helyek.sort()) console.log(`    ${h} — ${hk.filter((x) => x.hol === h).length} db`);
  }
}
