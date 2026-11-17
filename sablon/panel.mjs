// A „CSATLAKOZZ A PANELHEZ" LAP — ez a lap MEGGYŐZ és ÁTAD, de nem vállal.
//
// ⚠ A VÁLLALÁSOKAT (adatkezelési tájékoztató, részvételi feltételek) NEM EZ A LAP TESZI: azok a panel
// GAZDÁJÁÉ, és a portál nyitólapján állnak, a regisztráció ELŐTT (D17/8e). Itt csak odamutatunk.
// Egy szabály köti a lapot: valótlant nem állíthat (8/h 4.) — amit a rendszer nem tud, az helykitöltő
// (így a díjazás is, amiről ma nincs döntés).
//
// A REGISZTRÁCIÓ CÍME env-ből jön (`PORTAL_REGISZTRACIO`), és a `data-reg` jelöli a linket: az
// `utm.js` ezekre teszi rá a kampány-jelölőket. Jelölés nélkül a kampány némán elveszne.

import { esc } from "./lap.mjs";

export function panelHtml({ t, sz, nyers, regLink }) {
  const p = t.panel;
  const hol = `${t.kod}/panel`;
  const reg = (cimke, hely, osztaly) =>
    `<a class="gomb ${osztaly}" href="${esc(regLink)}" data-reg>${sz(cimke, hely)}</a>`;

  return `    <section class="hero">
      <div class="sav">
        <p class="felcim">${sz(p.hero.felcim, `${hol}/hero`)}</p>
        <h1>${sz(p.hero.cim, `${hol}/hero`)}</h1>
        <p class="vezeto">${sz(p.hero.szoveg, `${hol}/hero`)}</p>
        <p class="gombok">${reg(p.hero.gomb, `${hol}/hero-gomb`, "gomb-elso")}</p>
      </div>
    </section>

    <section class="szakasz">
      <div class="sav">
        <h2>${sz(p.miert.cim, `${hol}/miert`)}</h2>
        <div class="kartyak negy">
${p.miert.elemek
  .map(
    (e, i) => `          <article class="kartya">
            <h3>${sz(e.cim, `${hol}/miert-${i + 1}`)}</h3>
            <p>${sz(e.szoveg, `${hol}/miert-${i + 1}`)}</p>
          </article>`,
  )
  .join("\n")}
        </div>
      </div>
    </section>

    <section class="szakasz halvany">
      <div class="sav">
        <h2>${sz(p.menet.cim, `${hol}/menet`)}</h2>
        <ol class="lepesek">
${p.menet.lepesek
  .map(
    (l, i) => `          <li>
            <span class="szam" aria-hidden="true">${i + 1}</span>
            <h3>${sz(l.cim, `${hol}/lepes-${i + 1}`)}</h3>
            <p>${sz(l.szoveg, `${hol}/lepes-${i + 1}`)}</p>
          </li>`,
  )
  .join("\n")}
        </ol>
      </div>
    </section>

    <section class="szakasz">
      <div class="sav ket-hasab">
        <div>
          <h2>${sz(p.szamits.cim, `${hol}/szamits`)}</h2>
          <ul class="pontok">
${p.szamits.elemek.map((e, i) => `            <li>${sz(e, `${hol}/szamits-${i + 1}`)}</li>`).join("\n")}
          </ul>
        </div>
        <div>
          <h2>${sz(p.nem.cim, `${hol}/nem`)}</h2>
          <p>${sz(p.nem.szoveg, `${hol}/nem`)}</p>
          <ul class="pontok pontok-nem">
${p.nem.elemek.map((e, i) => `            <li>${sz(e, `${hol}/nem-${i + 1}`)}</li>`).join("\n")}
          </ul>
        </div>
      </div>
    </section>

    <section class="szakasz halvany">
      <div class="sav keskeny">
        <h2>${sz(p.gyik.cim, `${hol}/gyik`)}</h2>
        <div class="gyik">
${p.gyik.elemek
  .map(
    (e, i) => `          <details>
            <summary>${sz(e.kerdes, `${hol}/gyik-${i + 1}`)}</summary>
            <p>${sz(e.valasz, `${hol}/gyik-${i + 1}`)}</p>
          </details>`,
  )
  .join("\n")}
        </div>
      </div>
    </section>

    <section class="atjaro">
      <div class="sav keskeny">
        <h2>${sz(p.zaras.cim, `${hol}/zaras`)}</h2>
        <p>${sz(p.zaras.szoveg, `${hol}/zaras`)}</p>
        <p class="gombok">${reg(p.zaras.gomb, `${hol}/zaras-gomb`, "gomb-elso")}</p>
        <p class="jegyzet">${sz(p.zaras.jegyzet, `${hol}/zaras-jegyzet`)}</p>
      </div>
    </section>
`;
}
