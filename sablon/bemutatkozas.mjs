// AZ ELLA BEMUTATKOZÓ LAPJA — a SZAKASZOK HELYE, nem a tartalma.
//
// A D17/8e kimondja: a tartalomról még nincs iránymutatás, most a szerkezet épül meg. Ezért itt a
// szakaszok sorrendje és aránya a lényeg; a szöveg a `szovegek/*.mjs`-ből jön, és ott jelölt
// helykitöltő. A valódi szöveget és a képeket a Works adja meg.

import { UTAK, esc } from "./lap.mjs";

export function bemutatkozasHtml({ t, sz, nyers }) {
  const b = t.bemutatkozas;
  const hol = `${t.kod}/bemutatkozas`;
  const panelUt = UTAK[t.kod].panel;

  return `    <section class="hero">
      <div class="sav">
        <p class="felcim">${sz(b.hero.felcim, `${hol}/hero`)}</p>
        <h1>${sz(b.hero.cim, `${hol}/hero`)}</h1>
        <p class="vezeto">${sz(b.hero.szoveg, `${hol}/hero`)}</p>
        <p class="gombok">
          <span class="gomb gomb-tiltott" aria-disabled="true" title="${esc(nyers("§A gomb célja még nincs eldöntve", `${hol}/hero-gomb`))}">${sz(b.hero.gomb, `${hol}/hero-gomb`)}</span>
          <a class="gomb gomb-masodik" href="${panelUt}">${sz(b.atjaro.gomb, `${hol}/hero-masodik`)}</a>
        </p>
      </div>
    </section>

    <section class="szakasz">
      <div class="sav">
        <h2>${sz(b.kepessegek.cim, `${hol}/kepessegek`)}</h2>
        <p class="szakasz-jegyzet">${sz(b.kepessegek.jegyzet, `${hol}/kepessegek`)}</p>
        <div class="kartyak negy">
${b.kepessegek.elemek
  .map(
    (e, i) => `          <article class="kartya">
            <h3>${sz(e.cim, `${hol}/kepesseg-${i + 1}`)}</h3>
            <p>${sz(e.szoveg, `${hol}/kepesseg-${i + 1}`)}</p>
            <div class="kep-helye" role="img" aria-label="${esc(nyers("§Ide kerül egy kép", `${hol}/kepesseg-${i + 1}-kep`))}"></div>
          </article>`,
  )
  .join("\n")}
        </div>
      </div>
    </section>

    <section class="szakasz halvany">
      <div class="sav">
        <h2>${sz(b.menet.cim, `${hol}/menet`)}</h2>
        <ol class="lepesek">
${b.menet.lepesek
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
      <div class="sav keskeny">
        <h2>${sz(b.kinek.cim, `${hol}/kinek`)}</h2>
        <p>${sz(b.kinek.szoveg, `${hol}/kinek`)}</p>
        <ul class="pontok">
${b.kinek.elemek.map((e, i) => `          <li>${sz(e, `${hol}/kinek-${i + 1}`)}</li>`).join("\n")}
        </ul>
      </div>
    </section>

    <section class="atjaro">
      <div class="sav keskeny">
        <p class="felcim">${sz(b.atjaro.felcim, `${hol}/atjaro`)}</p>
        <h2>${sz(b.atjaro.cim, `${hol}/atjaro`)}</h2>
        <p>${sz(b.atjaro.szoveg, `${hol}/atjaro`)}</p>
        <p class="gombok"><a class="gomb gomb-elso" href="${panelUt}">${sz(b.atjaro.gomb, `${hol}/atjaro`)}</a></p>
      </div>
    </section>
`;
}
