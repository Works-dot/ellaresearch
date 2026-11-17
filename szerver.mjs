#!/usr/bin/env node
// A STATIKUS KISZOLGÁLÓ — a `dist/` mappát szolgálja ki. Nulla függőség.
//
// MIÉRT SAJÁT SZERVER, ÉS MIÉRT UGYANEZ FUT ÉLESEN IS: a gyökér (`/`) nyelv-választása SZERVER-OLDALI,
// az `Accept-Language` fejlécből. Nem süti és nem szkript dönti el (8/e indoka): a kereső és az
// AI-keresők robotja egy címet nyelvi beállítás nélkül, egyszer olvas be — ha a nyelvet a böngésző
// beállítása váltaná ugyanazon a címen, csak az egyik nyelv kerülne a találatok közé. Ha helyben más
// szerver futna, mint élesen, ez a viselkedés pont ott derülne ki, ahol már nem lehet kipróbálni.
//
// NYELV-FEJLÉC NÉLKÜL (tipikusan robotoknál) NEM irányítunk, hanem a gyökér `x-default` lapját adjuk:
// egy robotot nem szabad véletlenül az egyik nyelvre terelni.
//
// Használat: `node szerver.mjs` — a port a `PORT`-ból (alapértelmezés 4200).

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { NYELVEK, UTAK } from "./sablon/lap.mjs";

const GYOKER = path.join(import.meta.dirname, "dist");
const PORT = Number(process.env.PORT || 4200);

const TIPUSOK = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

// A lap maga külső erőforrást nem tölt (ezt az építő is kapuzza) — a CSP ezt ki is kényszeríti.
// ⚠ Ha egyszer bekerül a Google Analytics (8/e, kimondott kivétel), EZT a sort is módosítani kell;
// addig egy véletlenül bemásolt külső szkript a böngészőben is elhasal, nem csak az építésnél.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data:",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");

/** Az `Accept-Language` legjobb egyezése. Visszaad: nyelv-kód vagy `null` (ha nincs értelmezhető). */
export function nyelvValasztas(fejlec) {
  if (!fejlec) return null;
  const tetelek = String(fejlec)
    .split(",")
    .map((r) => {
      const [nyers, ...parok] = r.trim().split(";");
      const q = parok.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const suly = q ? Number(q.slice(2)) : 1;
      return { kod: nyers.trim().toLowerCase(), suly: Number.isFinite(suly) ? suly : 0 };
    })
    .filter((t) => t.kod && t.suly > 0)
    .sort((a, b) => b.suly - a.suly);
  for (const t of tetelek) {
    if (t.kod === "*") return null; // a "bármi" nem döntés — maradjon az x-default lap
    const alap = t.kod.split("-")[0];
    if (NYELVEK.includes(alap)) return alap;
  }
  return null;
}

function fejlecek(tipus, allo) {
  return {
    "content-type": tipus,
    "content-security-policy": CSP,
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "cache-control": allo ? "public, max-age=31536000, immutable" : "no-cache",
  };
}

/** A kért út leképezése fájlra. `null`, ha kilépne a `dist`-ből (útvonal-bejárás). */
function fajlUtja(utvonal) {
  const tiszta = path.normalize(decodeURIComponent(utvonal)).replace(/^(\.\.[/\\])+/, "");
  const cel = path.join(GYOKER, tiszta);
  if (!cel.startsWith(GYOKER)) return null;
  return cel.endsWith(path.sep) || !path.extname(cel) ? path.join(cel, "index.html") : cel;
}

const szerver = http.createServer((keres, valasz) => {
  const u = new URL(keres.url, `http://${keres.headers.host || "localhost"}`);

  if (keres.method !== "GET" && keres.method !== "HEAD") {
    valasz.writeHead(405, { allow: "GET, HEAD" }).end();
    return;
  }

  // A gyökér: nyelv szerint irányítunk; fejléc nélkül az x-default lap jön (l. a fájl fejlécét).
  if (u.pathname === "/") {
    const nyelv = nyelvValasztas(keres.headers["accept-language"]);
    if (nyelv) {
      valasz.writeHead(302, { location: UTAK[nyelv].bemutatkozas + u.search, vary: "Accept-Language" }).end();
      return;
    }
  }

  // Zárójel nélküli lap-cím (`/hu`) → a mappa alakjára irányítunk, hogy egy cím egy lap legyen.
  if (!path.extname(u.pathname) && !u.pathname.endsWith("/")) {
    valasz.writeHead(301, { location: u.pathname + "/" + u.search }).end();
    return;
  }

  const cel = fajlUtja(u.pathname);
  if (!cel || !fs.existsSync(cel) || !fs.statSync(cel).isFile()) {
    const tipus = TIPUSOK[".html"];
    valasz.writeHead(404, fejlecek(tipus, false));
    valasz.end(keres.method === "HEAD" ? undefined : "<!doctype html><meta charset=utf-8><title>404</title><p>Nincs ilyen lap.");
    return;
  }

  const kit = path.extname(cel).toLowerCase();
  const allo = kit === ".woff2" || kit === ".png" || kit === ".jpg" || kit === ".webp" || kit === ".svg";
  const fej = fejlecek(TIPUSOK[kit] || "application/octet-stream", allo);
  if (u.pathname === "/") fej.vary = "Accept-Language";
  valasz.writeHead(200, fej);
  if (keres.method === "HEAD") {
    valasz.end();
    return;
  }
  fs.createReadStream(cel).pipe(valasz);
});

if (!fs.existsSync(GYOKER)) {
  console.error("A dist/ nincs meg — eloszor: node epit.mjs");
  process.exitCode = 1;
} else {
  szerver.listen(PORT, () => console.log(`ellaresearch: http://localhost:${PORT}`));
}
