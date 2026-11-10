# Ecwid-koppeling — beoordelingsversie

De nadere afwerking, gedeelde initialisatie en categorievoorwaarden staan in [ECWID-AFWERKING.md](ECWID-AFWERKING.md). Dat document gaat voor bij verschillen met onderstaande eerste integratie.

Store ID: **145090752**. Bestaand project: `instagram-julie-fleur`. Alleen Vercel Preview; geen productiepublicatie, DNS-wijzigingen of wijzigingen in het Ecwid-account.

## Integratie

Next.js 16.4.3, Node.js 22.x en de bestaande statische export blijven behouden. `EcwidStore` laadt de officiële `https://app.ecwid.com/script.js?145090752&data_platform=code` met `next/script`, initialiseert `xProductBrowser` en controleert de echte winkel via `Ecwid.OnAPILoaded` en `Ecwid.getOwnerId()`. Het laden van een winkelpagina wordt bevestigd door `Ecwid.OnPageLoaded`. Time-out en scriptfouten tonen een herlaadmogelijkheid.

Ecwid beheert de productgegevens, prijzen, opties, winkelwagen en checkout. Er is geen eigen order- of betaal-API en geen geheime Ecwid-API-sleutel nodig. De lokale briefingcatalogus levert in deze Preview geen productkaarten, prijzen of zoekresultaten. Oude `/producten/.../`-links blijven werken met een verwijzing naar de actuele winkel; nieuwe productdetailpagina's worden door Ecwid weergegeven onder `/winkel/#!/...`.

De homepage, header, bestaande fotografie, roze Over Fleur-sectie en groene footer blijven behouden. De bestaande bestsellerpositie gebruikt de native Ecwid-startpaginaproducten. Fleur kan deze selectie in Ecwid beheren. Alle winkelwidgets gebruiken de huidige Preview-origin plus `/winkel/` als hoofdwinkel, zodat links en winkelwagen niet onbedoeld naar productie gaan. Volledige documentnavigatie voorkomt achtergebleven widgets bij Next.js-routewissels.

## Preview-variabelen

| Vercel-variabele | Preview | Productie |
| --- | --- | --- |
| NEXT_PUBLIC_ECWID_STORE_ID | 145090752 | ongewijzigd |
| ECWID_PREVIEW_ENABLED | true | niet instellen |
| ECWID_CATALOG_READY | false | niet instellen |
| NEXT_PUBLIC_ECWID_CATEGORY_IDS | optioneel, echte ID's als JSON | niet instellen |

`scripts/build-review.mjs` maakt hieruit de publieke buildwaarden. `NEXT_PUBLIC_ECWID_PREVIEW` is uitsluitend waar bij Vercel Preview met de expliciete Preview-vlag, of bij een lokale controlebuild met dezelfde vlag zonder VERCEL_ENV. Productie wordt altijd gebouwd met Ecwid uit, een lege Store ID en catalogusvrijgave uit, ook bij foutief overgenomen Preview-variabelen. `NEXT_PUBLIC_SITE_LAUNCHED=false`, noindex en het contactverzendverbod blijven behouden.

Lokaal testen met Node 22:

```sh
ECWID_PREVIEW_ENABLED=true NEXT_PUBLIC_ECWID_STORE_ID=145090752 npm run build
python3 scripts/check-export.py --ecwid-preview
npm run check:ecwid
```

## Ecwid bevat nog standaardvoorbeelden

Bij de initialisatietest stonden vijf standaardproducten met `VOORBEELD` in hun naam in het account. Deze zijn niet verwijderd of gewijzigd. Zolang `ECWID_CATALOG_READY=false`, wordt de catalogus afgeschermd, inclusief rechtstreekse product- en zoekroutes. Er verschijnt alleen een neutrale lege-collectietekst. De native lege winkelwagen blijft bereikbaar. De volledige widget initialiseert op de achtergrond; de verborgen catalogus is `inert` en niet toegankelijk voor toetsenbord of schermlezers.

Dit is een weergaveblokkade op deze integratie, geen beveiliging van andere Ecwid-verkoopkanalen. Er zijn geen producten toegevoegd, mandregels aangemaakt, orders verzonden of betalingen uitgevoerd.

Na het toevoegen van echte producten: schakel de Ecwid-standaardvoorbeelden uit, controleer het assortiment en zet daarna **alleen in Preview** `ECWID_CATALOG_READY=true` met een nieuwe Preview-build. Vanaf dat moment komen product- en prijswijzigingen direct uit Ecwid; daarvoor is geen websitebuild nodig. Deze vlag is geen toestemming voor productie.

## Vijf categorieën voorbereiden

Bestaande routes blijven: `bagcharms`, `sieraden-graveren`, `punniken`, `borduren`, `vilten-kroon`. Voeg bij het aanmaken van de Ecwid-categorieën hun werkelijke numerieke ID's toe aan het JSON-object `NEXT_PUBLIC_ECWID_CATEGORY_IDS`, met deze slugs als sleutels. Geen fictieve IDs invullen. Dit vereist eenmaal een Preview-build; latere producttoewijzingen en prijzen worden daarna direct uit Ecwid opgehaald. Ontbrekende koppelingen tonen een neutrale melding met een link naar de winkel, nooit producten uit een verkeerde categorie.

## Nog te testen met echte producten

- De vijf categorie-ID's, startpaginaselectie en juiste producten per categorie.
- Productdetailpagina's, echte prijzen, verplichte personalisatie, aantallen en voorraad.
- Toevoegen/wijzigen/verwijderen in de mand en behoud na verversen.
- Checkout met verzendzones, tarieven, belasting, afhalen en juridische pagina's.
- Betaalprovider in testmodus, succes/annulering/fout en echte orderbevestiging.
- Ecwid-instellingen voor tracking en cookie-toestemming vóór productievrijgave. De website voegt geen extra analytics/advertenties toe; de eigen cookievoorkeur blijft behouden.

Geen fictieve producten of testprijzen aanmaken om deze punten af te vinken. Publicatie naar `juliefleur.nl` en `www.juliefleur.nl` vereist afzonderlijk akkoord én een bewuste wijziging aan de productieblokkade.

## Officiële bronnen

- [Storefront-embed en defaultCategoryId](https://docs.ecwid.com/storefronts/store-configuration-settings/overview)
- [Native vormgevingsinstellingen](https://docs.ecwid.com/storefronts/store-configuration-settings/design-configs)
- [Eén hoofdwinkel voor meerdere widgets](https://docs.ecwid.com/storefronts/store-configuration-settings/behavioral-configs)
- [Cookie-instellingen in Ecwid](https://support.ecwid.com/hc/en-us/articles/360000270729-Adding-Cookie-Notification-to-your-ecommerce-site)
