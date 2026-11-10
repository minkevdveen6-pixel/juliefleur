> Actuele release-instructies: zie [PUBLICATIE-2026-11-10.md](PUBLICATIE-2026-11-10.md). De expliciete live-catalogusvrijgave vervangt de eerdere Preview-only blokkade; online betalen en noindex blijven afzonderlijk beschermd.

# Bestaande Vercel-koppeling — Julie Fleur

Actuele Ecwid-Preview-koppeling voor Store ID 145090752: zie [ECWID-PREVIEW.md](ECWID-PREVIEW.md). De live beoordelingswebsite blijft ongewijzigd.

## Status en doel

Openbare beoordelingswebsite met hoofd-origin `https://juliefleur.nl`. Geen verkoop, betaling, actieve Ecwid-storefront, actieve contactverzending of zoekmachine-indexering. Gebruik uitsluitend het bestaande project `instagram-julie-fleur` (`prj_iMisnENQeNTSIk1u4H56irPUoPwQ`) in team `minkevdveen-s-projects`. Geen DNS-, domein- of mijn.host-wijzigingen uitvoeren.

## Build en hosting

De bestaande `output: "export"`, `trailingSlash: true` en vooraf geoptimaliseerde fotografie blijven behouden. De Cloudflare-verpakking is uit het standaard buildcommando gehaald en blijft afzonderlijk beschikbaar onder `build:cloudflare`.

Verbind de private GitHub-repository `minkevdveen6-pixel/julie-fleur` via Settings → Git van het bestaande project. Maak geen nieuw Vercel-project aan. Behoud **Other** (`framework: null`), installatie `npm ci`, build `npm run build`, uitvoermap `out`, Node.js 22.x. Zo blijft de Next.js-frontend statisch en kan Vercel daarnaast de losse TypeScript Function in `/api` bouwen. Upload niet handmatig `dist/` of `node_modules/`.

Vercel documenteert [losse Node.js Functions in api/](https://vercel.com/docs/functions/runtimes/node-js), [buildinstellingen](https://vercel.com/docs/builds) en [branchgebonden deployments](https://vercel.com/docs/project-configuration/git-configuration). Tijdens de koppelcontrole staat `main` expliciet uit en zijn alleen `codex/*`-branches toegestaan. Het project heeft bovendien een Ignored Build Step die productie overslaat: `if [ "$VERCEL_ENV" = "production" ]; then exit 0; else exit 1; fi`. Verwijder deze blokkades pas na afzonderlijke goedkeuring voor de eerste productie-deployment. Zie [PUBLICEREN.md](PUBLICEREN.md).

## Publieke buildwaarden

De eigenaar kan deze waarden ook in Vercel opnemen, maar `scripts/build-review.mjs` dwingt ze voor deze beoordelingsfase af:

| Variabele | Waarde |
| --- | --- |
| NEXT_PUBLIC_SITE_URL | https://juliefleur.nl |
| NEXT_PUBLIC_SITE_LAUNCHED | false |
| NEXT_PUBLIC_ECWID_STORE_ID | leeg |
| NEXT_PUBLIC_ECWID_ENABLED | false |
| NEXT_PUBLIC_ECWID_LAUNCH_APPROVED | false |
| CONTACT_ENABLED | false |

Dit zijn geen secrets. NEXT_PUBLIC-waarden worden tijdens het bouwen vastgezet. De beoordelingsfase vrijgeven vraagt een bewuste wijziging aan het bouwproces, met een nieuwe controle; alleen een dashboardvlag omzetten activeert geen verkoop.

## Contact via mijn.host SMTP

De losse Node.js-functie in `api/contact.ts` gebruikt `server/contact-smtp.ts` en Nodemailer. De statische frontend en de Cloudflare-bestanden blijven behouden. Alleen de beveiligde Preview mag met de benodigde server-side SMTP-variabelen worden getest. Productie vereist daarnaast een bevestigde ontvangsttest en `CONTACT_DELIVERY_VERIFIED=true`; die vlag blijft nu uit. Zie [CONTACT-INSTELLEN.md](CONTACT-INSTELLEN.md) voor de runtime-variabelen, de grenzen van tijdelijke spamlimieten en de acceptatietest. Een succesvolle mocktest is geen bewijs van e-mailontvangst.

## Bestaande eigen domeinen behouden

`juliefleur.nl` en `www.juliefleur.nl` zijn beide al geverifieerd en gekoppeld aan de werkende productie. Laat de bestaande records, redirects, aliases en hostingbestanden ongewijzigd. Het koppelen van GitHub vereist geen DNS-wijziging.

Noindex staat in de paginametadata en als Vercel-responseheader; robots blokkeert de site en de sitemap blijft leeg. De site is publiek: deze maatregelen beschermen geen vertrouwelijke informatie. De cookie-informatie noemt daarom geen ChatGPT-aanmelding meer voor deze openbare versie. De Instagram-feed en Elfsight-scripts zijn op verzoek verwijderd. De bestaande Instagram-link en cookievoorkeuren blijven beschikbaar.

## Importcontrole

Controleer de niet-productiebuild op `/`, `/collecties/`, `/over-fleur/`, `/contact/`, `/winkel/`, `/robots.txt`, `/sitemap.xml` en `/api/contact`. Controleer afbeeldingen, mobiel menu, de Instagram-link en cookievoorkeuren en de uitgeschakelde bestelknoppen. GET /api/contact moet ready:false geven. Controleer ook `X-Robots-Tag` op HTML en bestanden. De bestaande Vercel-aanmeldbeveiliging van previews blijft behouden; schakel deze niet uit voor een test. Echte mail wordt uitsluitend als herkenbare test op de beveiligde Preview verzonden na inrichting van de mailboxsecret.

## GitHub-inhoud

Alleen gecontroleerde bronbestanden, documentatie en benodigde publieke assets worden naar de private repository gepubliceerd, met een schone start zonder de oude hostinghistorie. Geen .env-bestanden, secrets, lokale hostingidentiteit, originele privébijlagen, dependencies of buildresultaten. De publieke beoordelingswaarden worden tijdens het bouwen vastgezet. Voor de afzonderlijke contactfunctie zijn server-side runtime-variabelen nodig; de mailboxsecret hoort uitsluitend in Vercel.
