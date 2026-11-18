# ellaresearch.com — a bemutatkozo oldal Railway-kepfajlja. Nulla npm-fuggoseg, statikus kiszolgalo.
# A sajat szerverunk fut elesen is (a gyoker nyelv-valasztasa szerver-oldali) — l. szerver.mjs fejlece.

FROM node:24-slim
WORKDIR /app
COPY . .

# KAPU AZ EPITESNEL: a tartalmi hibak (hianyzo forditas, kulso eroforras, kulcs-elteres a nyelvek kozott)
# ITT bukjanak el, ne a konteneren belul indulaskor. Fajlt nem ir, csak ellenoriz.
RUN node epit.mjs --ellenoriz

# ⚠ A LAPOK INDULASKOR EPULNEK, NEM A KEPFAJL EPITESEKOR (2026-11-18).
# MIERT: a harom valtozo (PORTAL_REGISZTRACIO, ELLARESEARCH_ALAP, INDEXELHETO) a KESZ HTML-be eg bele
# (epit.mjs 38-39., 220. sor). A kepfajl epitesekor ezek nem biztosan vannak ott — a Railway a
# szolgaltatas valtozoit csak kimondott `ARG`-gal adja at a buildnek. Egy ilyen nema kimaradas nem allit
# meg semmit: a lap felepul, es a kampany gombja a HELYI shell cimere mutat. Indulaskor a kornyezet
# mindig teljes, es ha megsem, az `epit.mjs` hibaval megall — a konteneren ez latszik.
ENV NODE_ENV=production
RUN chown -R node:node /app
# NEM ROOT (a haz szabalya, l. az Ella Dockerfile-jait): ha egy tamado bejutna, rendszergazda-jog nelkul
# kevesebbet tehet. Az `exec` miatt a node marad a PID 1, tehat a SIGTERM hozza jut.
USER node
CMD ["sh","-c","node epit.mjs && exec node szerver.mjs"]
