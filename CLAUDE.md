# ellaresearch.com — az Ella bemutatkozó oldala

Statikus, kétnyelvű oldal két lappal. **Nem az Ella része:** külön kódtár, külön Railway-projekt —
a döntés az Ella kódtárában áll (`dokumentumok/PANEL-MEGOSZTAS-DONTESEK.md`, D17 és 8/e szakasz).

**Kommunikáció magyarul**, természetes nyelven. A felhasználónak **nincs terminálja** — a szervert az
asszisztens indítja, háttérben.

## Mi ez, és mi NEM

Két lap, két nyelven:

| Lap | Magyar | Angol |
|---|---|---|
| Az Ella bemutatkozása (**elsődleges**) | `/hu/` | `/en/` |
| Csatlakozz a panelhez (**másodlagos**) | `/hu/csatlakozz-a-panelhez/` | `/en/join-the-panel/` |

- A gyökér (`/`) nem lap: a szerver az `Accept-Language` szerint irányít, nyelv-fejléc nélkül az
  `x-default` nyelvválasztó lapot adja.
- **A paneles lap MEGGYŐZ és ÁTAD, de nem vállal.** Az adatkezelési tájékoztató és a részvételi
  feltételek a panel **GAZDÁJÁÉ**, és a portál nyitólapján állnak, a regisztráció előtt. Ide ilyen
  szöveg nem kerül. Egy szabály köti a lapot: **valótlant nem állíthat** — amit a rendszer nem tud
  (ma: a díjazás), az helykitöltő marad.
- **Itt nincs űrlap, adatbázis és személyes adat.** A regisztráció a portálon történik; ez az oldal
  csak egy linket ad át. Ha ide űrlap kerülne, az egész „statikus, adatot nem tároló oldal" érvelés
  elesik — előbb beszéljük meg.

## A gépen

```
node epit.mjs              # ellenőriz, és kiírja a dist/-et
node epit.mjs --ellenoriz  # csak ellenőriz és jelent, fájlt nem ír
node szerver.mjs           # kiszolgálja a dist/-et (PORT, alapértelmezés 4100)
```

**A dev-port 4100** — szándékosan kívül az Ella portjain (4000 a shell, 3001–3019 a backendek,
5173–5199 a felületek). A `dist/` nincs a kódtárban: a telepítés maga építi.

## Négy szabály, amit némán el lehet rontani

1. **NULLA npm-FÜGGŐSÉG.** Nem takarékosság: így a licenc- és az ellátási-lánc kérdés fel sem merül
   egy négylapos statikus oldalon. Ha egy függőség mégis kellene, az **kimondott döntés** — előbb
   beszéljük meg, és utána a licencét is meg kell nézni.
2. **KÜLSŐ ERŐFORRÁS TILOS** (betű, ikon, szkript, stíluslap, kép). Házszabály: a külső CDN a
   látogató IP-címét harmadik félnek adja ki. Az `epit.mjs` **hibával megáll**, ha a kimenetben
   bármely `src=`, `url(`, `@import` vagy betöltő `<link rel>` külső címre mutat.
   ⚠ A `<a href>`, a `canonical` és a `hreflang` **szándékosan** kimarad a tiltásból: azok
   hivatkozások és fejrész-adatok, nem betöltések.
3. **BEÉGETETT FELIRAT NINCS.** Minden szöveg a `szovegek/<nyelv>.mjs`-ben él, és a nyelvek
   **kulcs-szerkezetének egyeznie kell** — az építő ezen is megáll. Visszaesés a másik nyelvre
   nincs: egy félig lefordított lap rosszabb, mint egy hiba az építésnél.
4. **SZÍNT ÉS MÉRETET CSAK TOKENBŐL.** A `statikus/stilus/tokens.css` az egyetlen forrás.

## Helykitöltők — a bemutatkozó lap ma SZÁNDÉKOSAN üres

A `§`-sal kezdődő szöveg helykitöltő: az építő levágja a jelet, a lapon **láthatóan megjelöli**
(sárga alapon), és megszámolja. A bemutatkozó lap tartalmát a Works adja meg; most a **szakaszok
helye** épült meg.

⚠ **Amíg akár egy helykitöltő van, minden lap `noindex`-et kap, és a `robots.txt` mindent zár.**
Ez a kapu szándékosan nem megkerülhető kézzel: az `INDEXELHETO=1` is csak nulla helykitöltő mellett
engedi az indexelést. Indok: egy félkész oldal keresőbe kerülése nem vonható vissza.

## Környezeti változók

| Változó | Mire | Alapérték |
|---|---|---|
| `PORTAL_REGISZTRACIO` | a „Csatlakozz a panelhez" gomb célja | a HELYI shell címe — **élesben kötelező beállítani** |
| `ELLARESEARCH_ALAP` | az oldal saját alap-címe (`canonical`, `hreflang`) | `https://ellaresearch.com` |
| `INDEXELHETO` | `1` engedi az indexelést (csak nulla helykitöltő mellett) | nincs (zárva) |
| `PORT` | a szerver portja | `4100` |

⚠ **A regisztráció címe a portálon állandó legyen** (`/paneltag/regisztracio`): ez az oldal arra
linkel, egy átnevezés némán egy 404-re vinné a kampányt. Az építő jelentése kiírja, ha a helyi
alapérték fut.

## A kampány-jelölő

A toborzó kampányok a paneles lapra érkeznek, a regisztráció a portálon történik. A
`statikus/js/utm.js` a `data-reg` linkekre ráteszi a lap címében kapott `utm_*` jelölőket — **szűk
listából**, hogy az oldalunk ne legyen továbbító bármilyen paraméternek. Szkript nélkül a gomb
működik, csak jelölő nélkül.

## Ami ide NEM ér el

Az Ella őrei (`preflight.cjs`, kitettség-őr, séma-őr, token-lint, Autotest) **ehhez a kódtárhoz nem
nyúlnak**. Ami itt kapu, az az `epit.mjs` három ellenőrzése — ezért ha az építőhöz nyúlsz, a
kapukat mérd vissza: rontsd el szándékosan mindhármat, és nézd meg, hogy PIROS.

## Ami még nincs meg

- **A valódi szövegek és képek** a bemutatkozó lapon (a Works adja).
- **A jogi szövegek** a láblécben (tájékoztató, impresszum) — ma jelölt helykitöltő, nem link.
- **Google Analytics + sütisáv.** A GA **kimondott kivétel** a „nincs külső szolgáltató" szabály
  alól, és **csak erre az oldalra** szól (D17/8e): a tesztelő-toborzás Google Ads kampányokkal megy.
  A feltételek: sütisáv elutasítási lehetőséggel, és a mérés **csak beleegyezés után** indul
  (Consent Mode). Amíg nincs bekötve, a `szerver.mjs` CSP-je is zárja — azt is módosítani kell.
  A portálon és az Ella többi felületén **nincs** mérés.
- **A GitHub-kódtár és a Railway-projekt** (a felhasználó hozza létre), a Dockerfile, és az
  `ellaresearch.com` / `.hu` rákötése. Addig a Railway generált `*.up.railway.app` címe elég.
- **Sitemap** (csak akkor lesz értelme, ha az oldal indexelhető).
