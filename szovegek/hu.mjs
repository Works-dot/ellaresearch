// MAGYAR SZÖVEGEK — ellaresearch.com
//
// SZABÁLY (D18): beégetett felirat nincs, minden szöveg itt él. Egy új nyelv egy új fájl.
// A kulcs-szerkezetnek bájtra egyeznie kell a többi nyelvével — az építő hibával megáll, ha nem.
//
// HELYKITÖLTŐ: a "§"-sal kezdődő szöveg helykitöltő. Az építő levágja a jelet, LÁTHATÓAN megjelöli a
// lapon, és megszámolja. Így nem lehet véletlenül kiadni egy "majd beírjuk" szöveget.
//
// ⚠ A BETŰKÉSZLET MIATT: csak a Latin1 és Latin2 tartomány jeleit használd (a magyar ékezetek, az
// idézőjelek, a gondolatjel és a középpont rendben van). Nyíl és pipa NINCS kiszolgálva — azokat a
// stíluslap rajzolja.

export default {
  kod: "hu",
  cimke: "Magyar",
  iranyitoCimke: "Magyar nyelven",

  keret: {
    markaNev: "Ella",
    menu: { bemutatkozas: "Az Ella", panel: "Csatlakozz a panelhez" },
    nyelvvalto: "English",
    nyelvvaltoCim: "Switch to English",
    ugras: "Tovább a tartalomra",
    lablec: {
      sor: "Ella — a Works kutatási munkaeszköze",
      linkek: [
        { cimke: "§Adatkezelési tájékoztató", ut: "" },
        { cimke: "§Impresszum", ut: "" },
      ],
      jegyzet: "§Ide kerül a jogi lábjegyzet, amikor a szövegek megvannak.",
    },
  },

  bemutatkozas: {
    fejcim: "Ella — kutatási munkaeszközök",
    leiras: "§Ide kerül az oldal egymondatos leírása, amit a keresők és a megosztások mutatnak.",
    hero: {
      felcim: "Ella",
      cim: "§Ide kerül az Ella egymondatos ígérete",
      szoveg: "§Ide kerül két-három mondat arról, mi az Ella, kinek szól, és mitől más. A szöveget és a képeket később adjuk meg.",
      gomb: "§Elsődleges gomb",
    },
    kepessegek: {
      cim: "§Mit tud az Ella",
      jegyzet: "§A szakaszok helye megvan, a tartalmuk még nem.",
      elemek: [
        { cim: "§Első képesség", szoveg: "§Ide kerül két mondat az első képességről." },
        { cim: "§Második képesség", szoveg: "§Ide kerül két mondat a második képességről." },
        { cim: "§Harmadik képesség", szoveg: "§Ide kerül két mondat a harmadik képességről." },
        { cim: "§Negyedik képesség", szoveg: "§Ide kerül két mondat a negyedik képességről." },
      ],
    },
    menet: {
      cim: "§Hogyan működik",
      lepesek: [
        { cim: "§Első lépés", szoveg: "§Ide kerül az első lépés leírása." },
        { cim: "§Második lépés", szoveg: "§Ide kerül a második lépés leírása." },
        { cim: "§Harmadik lépés", szoveg: "§Ide kerül a harmadik lépés leírása." },
      ],
    },
    kinek: {
      cim: "§Kinek szól",
      szoveg: "§Ide kerül egy rövid bevezető arról, kiknek készült az Ella.",
      elemek: ["§Első célcsoport", "§Második célcsoport", "§Harmadik célcsoport"],
    },
    atjaro: {
      felcim: "Kutatásban vennél részt?",
      cim: "Csatlakozz a Works kutatói paneljéhez",
      szoveg: "Ha nem kutatóként, hanem résztvevőként érdekel a dolog: a panelbe bárki jelentkezhet, és te döntöd el, melyik kutatásban veszel részt.",
      gomb: "Csatlakozz a panelhez",
    },
  },

  panel: {
    fejcim: "Csatlakozz a Works kutatói paneljéhez",
    leiras: "Jelentkezz a Works kutatói paneljébe: kutatásokban vehetsz részt, és te döntöd el, melyikben.",
    hero: {
      felcim: "Kutatói panel",
      cim: "Mondd el a véleményed, és alakítsd a terméket, amit mások használni fognak",
      szoveg: "A Works kutatói panelje olyan embereket keres, akik szívesen kipróbálnak egy-egy weboldalt, alkalmazást vagy szolgáltatást, és elmondják róla, mit gondolnak. A jelentkezés ingyenes, és bármikor kiléphetsz.",
      gomb: "Jelentkezem a panelbe",
    },
    miert: {
      cim: "Miért érdemes",
      elemek: [
        { cim: "Te döntöd el, mibe szállsz be", szoveg: "Minden kutatásról külön kapsz meghívót, a részletekkel: mi lesz a dolgod, mennyi ideig tart, és hol zajlik. Bármelyiket visszautasíthatod — ennek nincs következménye." },
        { cim: "Számít, amit mondasz", szoveg: "A visszajelzésed valódi, fejlesztés alatt álló termékekről szól, és eljut azokhoz, akik a döntéseket meghozzák." },
        { cim: "Nem kell szakértőnek lenned", szoveg: "A legtöbb kutatáshoz nem kell semmilyen előképzettség: pont az átlagos használó szemére van szükség." },
        { cim: "§Díjazás", szoveg: "§Ide kerül, hogy milyen díjazásra lehet számítani, és az mitől függ. A szöveget a Works adja meg." },
      ],
    },
    menet: {
      cim: "Hogyan működik",
      lepesek: [
        { cim: "Jelentkezel", szoveg: "Megadod az e-mail-címedet. Jelszót nem kell kitalálnod: minden belépéshez egy egyszer használható linket küldünk e-mailben." },
        { cim: "Kitöltöd a profilodat", szoveg: "Néhány kérdés rólad, hogy a hozzád illő kutatásokat tudjuk ajánlani. Amit nem akarsz megadni, azt kihagyhatod." },
        { cim: "Meghívót kapsz", szoveg: "Ha egy kutatás célcsoportjába illesz, e-mailben hívunk. Ha elfogadod, kiválasztod a neked megfelelő időpontot." },
      ],
    },
    szamits: {
      cim: "Mire számíthatsz",
      elemek: [
        "Nem minden meghívásból lesz részvétel: egy kutatásba korlátozott számú résztvevő kerül be, és a célcsoport dönt.",
        "A kutatások nagy része online zajlik, videóhívásban vagy a böngészőben, otthonról.",
        "A részvétel mindig önkéntes: a megkezdett kutatást is abbahagyhatod.",
        "A fiókodban bármikor megnézheted, mihez járultál hozzá, visszavonhatod, kikérheted az adataidat, vagy kiléphetsz a panelből.",
      ],
    },
    nem: {
      cim: "Amit viszont nem ígérünk",
      szoveg: "Jobb most tisztázni, mint utólag:",
      elemek: [
        "Ez nem állás és nem munkaviszony: nincs rendszeres feladat és nincs beosztás.",
        "Nem tudjuk megígérni, hogy kapsz meghívót: ez attól függ, milyen kutatások indulnak, és kiket keresnek.",
        "Nem adunk tanácsot és nem közvetítünk munkát.",
      ],
    },
    gyik: {
      cim: "Gyakori kérdések",
      elemek: [
        { kerdes: "Kerül valamibe?", valasz: "Nem. A jelentkezés és a részvétel is ingyenes." },
        { kerdes: "Miért nem kapok jelszót?", valasz: "Mert nem kell: minden belépéshez egy egyszer használható linket küldünk az e-mail-címedre. Így nincs jelszó, amit elfelejthetnél vagy ami kiszivároghat." },
        { kerdes: "Mi lesz az adataimmal?", valasz: "Az adataidat a panel gazdája kezeli. A pontos tájékoztató és a részvételi feltételek a jelentkezés lapján olvashatók — a jelentkezés előtt." },
        { kerdes: "Kiléphetek?", valasz: "Igen, bármikor, a fiókodban, egy kérés nélküli indoklás nélkül. A kilépéssel a profilod törlésre kerül." },
        { kerdes: "Mennyi időt vesz el?", valasz: "Kutatásonként változó, és a meghívóban mindig ott áll, mennyi időre számíts. Ha nem illik a naptáradba, nem kell elfogadnod." },
      ],
    },
    zaras: {
      cim: "Jelentkezz a panelbe",
      szoveg: "Egy e-mail-cím elég hozzá. A következő lépésen a Works tájékoztatóját és a részvételi feltételeket is elolvashatod.",
      gomb: "Jelentkezem a panelbe",
      jegyzet: "A jelentkezés a Works paneljének oldalán folytatódik.",
    },
  },
};
