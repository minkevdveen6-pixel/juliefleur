# Codex → GitHub → bestaand Vercel-project

## Uitgangspunt op 3 november 2026

De actieve productie is `dpl_7wgnixwcSk8Bn2dQAe19pz3GYeJn`, afkomstig van Vercel Drop. Alle 108 opgeslagen bronbestanden komen byte voor byte overeen met de lokale bron vóór de koppelvoorbereiding. Ook 73 gepubliceerde pagina's en bestanden zijn vergeleken: inhoud, opmaakklassen, navigatie, afbeeldingen, favicon en robotsbestanden komen overeen. Bewijs staat lokaal in de genegeerde map `artifacts/`.

De bedoelde repository is `minkevdveen6-pixel/julie-fleur`, private. De oude openbare repository `juliefleur` is leeg en is niet gekoppeld. GitHub-aanmelding en toegang moeten eerst zijn bevestigd; deze documentatie bewijst op zichzelf geen geslaagde GitHub-upload of preview-deployment.

## Tijdelijke productieblokkade

- `vercel.json`: `main: false`, `codex/*: true`, overige branches uit.
- Bestaand Vercel-project: Ignored Build Step slaat `VERCEL_ENV=production` over.
- De actieve productie en alle bestaande domeinen blijven intact. Geen `vercel --prod`, Promote, aliaswijziging of DNS-wijziging uitvoeren.
- Verbind uitsluitend project `prj_iMisnENQeNTSIk1u4H56irPUoPwQ`, team `team_W8m8SzQBVye0FmZAPFDeLWC7`. Maak geen nieuw project aan.

## Werken vanuit een schone clone

```bash
git clone https://github.com/minkevdveen6-pixel/julie-fleur.git
cd julie-fleur
npm ci
npm run setup:git
git switch -c codex/mijn-wijziging
```

Voer de wijziging uit en controleer de diff. Gebruik geen oude lokale hostinghistorie als basis. De hooks controleren te committen bestanden en de historie van te pushen commits op uitgesloten bestanden en bekende geheime patronen. Deel geen tokens of .env-bestanden via Git.

```bash
npm run lint
npm run check:catalog
npm run check:contact
npm run check:review
npm run build
python3 scripts/check-export.py
git add <bewust-gekozen-bestanden>
npm run check:publish
git commit -m "Beschrijf de wijziging"
git push -u origin codex/mijn-wijziging
```

Een push naar `codex/*` hoort precies één preview in het bestaande project te starten. Controleer in Vercel dat de SHA en branch kloppen en de omgeving Preview is. Gebruik voor de eerste validatie één branch `codex/github-verification`; start niet daarnaast een identieke CLI- of Drop-deployment.

## Eerste productiepublicatie — alleen na akkoord

Na een geslaagde preview en expliciet akkoord: wijzig `main` naar `true` in `vercel.json`, pas de bijbehorende controle in `scripts/check-review.ts` aan en verwijder de tijdelijke Ignored Build Step uit het bestaande Vercel-project. Test de wijziging eerst op de previewbranch, beoordeel de diff en merge daarna naar `main`. Dat is de eerste Git-productiepublicatie; voer deze stappen niet uit als onderdeel van het alleen gereedmaken van de koppeling.

Daarna blijven `codex/*`-branches previews en publiceert een goedgekeurde merge naar `main` automatisch. Ecwid, bestellen, betalen en mailverzending blijven onafhankelijk daarvan uitgeschakeld. Die functionaliteiten vereisen afzonderlijke goedkeuring en de bestaande aanvullende tests.
