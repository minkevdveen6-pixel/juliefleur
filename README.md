> Actuele release-instructies: zie [PUBLICATIE-2026-11-10.md](docs/PUBLICATIE-2026-11-10.md). De expliciete live-catalogusvrijgave vervangt de eerdere Preview-only blokkade; online betalen en noindex blijven afzonderlijk beschermd.

# Julie Fleur — openbare beoordelingsversie

Bestaande Next.js 16.4.3-website op het bestaande Vercel-project `instagram-julie-fleur`. De vormgeving, fotografie, inhoud, navigatie, configuratievoorbeelden zijn behouden. De Instagram-feed en Elfsight-code zijn op verzoek verwijderd; cookievoorkeuren blijven beschikbaar. `https://juliefleur.nl` en `https://www.juliefleur.nl` blijven op de bestaande productie staan. De bedoelde private bronrepository is `minkevdveen6-pixel/julie-fleur`. Zie [docs/PUBLICEREN.md](docs/PUBLICEREN.md) voor de koppeling en de tijdelijke productieblokkade.

## Vaste beoordelingsinstellingen

`npm run build` maakt een statische export in `out/` en dwingt deze waarden af, onafhankelijk van lokale of Vercel-omgevingsvariabelen:

```text
NEXT_PUBLIC_SITE_URL=https://juliefleur.nl
NEXT_PUBLIC_SITE_LAUNCHED=false
NEXT_PUBLIC_ECWID_STORE_ID=
NEXT_PUBLIC_ECWID_ENABLED=false
NEXT_PUBLIC_ECWID_LAUNCH_APPROVED=false
CONTACT_ENABLED=false
```

Pagina’s hebben noindex, robots blokkeert crawlen, de sitemap is leeg en Vercel voegt `X-Robots-Tag: noindex, nofollow, noarchive` toe. De website is wel openbaar toegankelijk. Dit is geen toegangsbeveiliging. De melding ‘De webshop is in voorbereiding’ blijft zichtbaar; bestellen, betalen en de Ecwid-storefront blijven uit.

## Lokaal controleren

Gebruik Node.js 22 en npm.

```bash
npm ci
npm run setup:git
npm run check:publish
npm run lint
npm run check:catalog
npm run check:contact
npm run check:review
npm run build
npm run typecheck
python3 scripts/check-export.py
npm run preview
```

De lokale productiepreview draait op `http://localhost:3000`. Deze gebruikt de bestaande Worker voor het serverendpoint, met verzending expliciet uit. De Vercel-adapter wordt daarnaast rechtstreeks getest door `check:review`. Mailtests gebruiken mocks en sturen geen echte mail. `npm run dev` is alleen de frontend; zonder een serverendpoint blijft het formulier eveneens uit.

## Bestaand Vercel-project

Zie [docs/VERCEL.md](docs/VERCEL.md). De configuratie staat in `vercel.json`:

- Framework Preset: **Other** — de frontend is een echte Next.js-export; het losse `api/contact.ts` blijft een aparte Vercel Function.
- Install Command: `npm ci`.
- Build Command: `npm run build`.
- Output Directory: `out`.
- Node.js: `22.x` via `package.json` en `.nvmrc`.
- Production Branch: `main`; automatische productiepublicatie blijft tijdelijk geblokkeerd. Alleen `codex/*`-branches mogen automatisch een niet-productiebuild starten.

Maak geen nieuw project aan en importeer niet via New Project. Verbind GitHub via de Git-instellingen van `instagram-julie-fleur`. De eerste Git-build moet een preview zijn; productie vereist eerst goedkeuring van de eigenaar. De bestaande domeininstellingen blijven behouden.

## Contactformulier

De bestaande UI en volledige Cloudflare-logica in `worker/` zijn behouden. De zelfstandige Vercel Function `api/contact.ts` houdt verzending hard uit: GET geeft `{ "ready": false }`, POST geeft bij een verzoek vanaf dezelfde origin HTTP 503. Het toevoegen van runtime-secrets of `CONTACT_ENABLED=true` activeert dit endpoint niet.

De bezoeker krijgt de bestaande eerlijke melding en kan rechtstreeks mailen naar `info@juliefleur.nl`. Voor latere activering zijn aparte goedkeuring, veilige hostingadaptatie, geverifieerde Resend-afzender, Upstash-inrichting en een geslaagde echte ontvangsttest nodig. De Cloudflare-versie blijft desgewenst te bouwen met `npm run build:cloudflare`. Zie [CONTACT-INSTELLEN.md](docs/CONTACT-INSTELLEN.md).

## Ecwid

Ecwid blijft uit totdat Julie haar feedbackronde heeft afgerond, zelf een account heeft en de koppeling afzonderlijk is goedgekeurd. Het nummer en de twee vlaggen alleen instellen is tijdens deze beoordelingsbuild onvoldoende: de build dwingt ze uit en de storefront vereist ook een vrijgegeven site. De lokale configuratoren blijven uitsluitend voorbeelden; ze plaatsen geen orders en verwerken geen betalingen.

## Bronbestanden en secrets

Alle benodigde geoptimaliseerde afbeeldingen en lokale fonts worden meegebouwd. `assets/originals/` is alleen lokaal; `prepare:photos` is niet nodig voor een Vercel-build. Fotografie staat centraal in `src/data/photography.json`, productdata in `src/data/catalog.ts`.

`.env*`, `.dev.vars*`, `.openai/`, `.vercel/`, dependencies en buildbestanden worden niet gepubliceerd naar GitHub. Voorbeeldwaarden staan in documentatie; er hoeven geen .env-bestanden te worden geüpload. Plaats toekomstige secrets uitsluitend in de server-runtime van de betreffende dienst.

`npm run setup:git` activeert de meegeleverde commit- en pushcontroles. Deze blokkeren uitgesloten bestanden en bekende sleutel-/tokenpatronen, zonder geheime waarden te tonen. De pushcontrole scant de te publiceren historie. Begin met de schone, gecontroleerde bronkopie: de oude lokale hostinghistorie hoort niet in de nieuwe repository. Een patrooncontrole vervangt geen zorgvuldige controle van een diff.

Zie ook [OPENSTAANDE-PUNTEN.md](OPENSTAANDE-PUNTEN.md), [ECWID-IMPLEMENTATIE.md](docs/ECWID-IMPLEMENTATIE.md), [INSTAGRAM.md](docs/INSTAGRAM.md), [COOKIES.md](docs/COOKIES.md) en [VERIFICATIE.md](docs/VERIFICATIE.md).
