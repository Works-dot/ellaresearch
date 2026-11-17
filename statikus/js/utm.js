// A KAMPÁNY-JELÖLŐ TOVÁBBADÁSA — a regisztráció gombjára.
//
// MIÉRT: a toborzó kampányok a „Csatlakozz a panelhez" lapra érkeznek, a regisztráció viszont a
// portálon történik. A portál a kampány-forrást a SAJÁT adatbázisába írja, harmadik fél nélkül
// (8/e, „A mérés") — de csak akkor, ha a jelölő eljut hozzá. Enélkül némán elveszne: a kampány
// futna, a Panelben meg nem látszana, melyik hozta a tagot.
//
// ⚠ SZŰK LISTA, nem „minden paramétert". Ha mindent átvinnénk, a lap címébe írt bármilyen paraméter
// (pl. `?email=…`) bekerülne a portál linkjébe — az oldalunk lenne a továbbító.
//
// ⚠ SZKRIPT NÉLKÜL IS MŰKÖDIK a gomb, csak jelölő nélkül: a link a HTML-ben kész, ez csak kiegészíti.

(function () {
  "use strict";
  var ENGEDETT = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  try {
    var innen = new URLSearchParams(window.location.search);
    var atadando = [];
    for (var i = 0; i < ENGEDETT.length; i++) {
      var ertek = innen.get(ENGEDETT[i]);
      if (ertek) atadando.push([ENGEDETT[i], ertek.slice(0, 120)]);
    }
    if (!atadando.length) return;

    var linkek = document.querySelectorAll("a[data-reg]");
    for (var j = 0; j < linkek.length; j++) {
      var cel = new URL(linkek[j].getAttribute("href"), window.location.href);
      for (var k = 0; k < atadando.length; k++) {
        if (!cel.searchParams.has(atadando[k][0])) cel.searchParams.set(atadando[k][0], atadando[k][1]);
      }
      linkek[j].setAttribute("href", cel.toString());
    }
  } catch (hiba) {
    // Fail-open: a gomb a jelölő nélkül is működik. Nem némán — a napló megmondja, mi és miért.
    if (window.console && console.warn) {
      console.warn("ellaresearch: a kampany-jelolo atadasa kimaradt —", hiba && hiba.message);
    }
  }
})();
