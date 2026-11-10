# Ecwid-controle — 10 november 2026

Store 145090752, Venture. Alleen Vercel Preview op het bestaande project instagram-julie-fleur. De productie-deployment, domeinen, DNS, contactverzending en betaalinstellingen zijn niet gewijzigd.

## Gevonden echte producten

Gecontroleerd in Ecwid-beheer, de catalogusexport en de officiële storefront. De catalogus bevat exact vijf producten; alle vijf zijn ingeschakeld, op voorraad en opgenomen op de winkelvoorpagina. Geen standaardvoorbeelden aangetroffen. De oude bekende voorbeeld-ID's blijven geblokkeerd; geen van deze vijf echte producten wordt daardoor tegengehouden.

| Product | Ecwid-ID | Hoofdcategorie | Categorie-ID |
| --- | --- | --- | --- |
| Gepersonaliseerde Bagcharm | 877006794 | Bagcharms | 209176759 |
| Losse Punniknaam | 877006081 | Punniken | 209183254 |
| Punniknaam als slinger | 877006110 | Punniken | 209183254 |
| Punniknaam op mand | 877004860 | Punniken | 209183254 |
| Poppy Necklace – Letterketting | 877004869 | Sieraden & graveren | 209176760 |

Borduren (209178261) en Vilten kroon (209183255) zijn aangemaakt en nog leeg. Alle vijf websitecategorieën zijn in Ecwid aangemaakt en de bestaande producten zijn eraan toegewezen. De eerdere per-productcategorieën blijven behouden. Nieuwe producten moeten in Ecwid ingeschakeld en aan de juiste hoofdcategorie toegewezen worden; dan verschijnen ze na herladen zonder codewijziging. Voor het bestsellerblok moeten ze ook in de winkelvoorpagina-selectie staan. Productnamen, foto's, prijzen, voorraad en opties komen live uit Ecwid; de website onderhoudt geen kopie.

## Werkelijk uitgevoerde praktijktest

- Alle vijf productpagina's geopend via de officiële storefront, elk met één producttitel en native opties.
- Bij alle vijf toevoegen zonder keuzes geprobeerd: Ecwid blokkeert met “Specificeer uw opties”; geen artikel toegevoegd.
- Losse Punniknaam: vijf letters, kleur 04, naam Fleur; native prijs €16,00, inclusief €1,00 staffeltoeslag; toegevoegd.
- Slinger: garenkleur 02, naam Test; €29,95; toegevoegd.
- Mand: Model 2, garenkleur 03, naam Test; €30,00; toegevoegd.
- Bagcharm: dubbel touw, touwkleur 02, goud hart, tekst Testnaam, uitgesloten kleuren Geen; €19,50 inclusief €2,00 toeslag; toegevoegd. Dit bevestigde tevens ontbrekende tekst- en conditionele validatie, zie hieronder.
- Poppy: twee letters JF, goudkleurig, januari goud, goud hart; €33,85 = €21,95 + €3,00 + €4,95 + €3,95; toegevoegd.
- Mand met alle vijf producten: €129,30. Alle gekozen opties en teksten zichtbaar; geen eigen prijsberekening.
- Aantal van de losse punniknaam verhoogd van één naar twee: regel €32,00, totaal €145,30 en header-teller zes. Na herladen bleven mand en personalisaties behouden.
- Native checkout verscheen met e-mailstap; geen e-mail/adres ingevuld, niet op Bestellen gedrukt, geen order of betaling uitgevoerd.
- Alle uitsluitend voor deze controle toegevoegde testregels verwijderd; echte lege mand bevestigd.
- Desktop en mobiel: productopties, gevulde mand en navigatie gecontroleerd. Bordeauxtekst en groene acties sluiten aan bij de bestaande huisstijl; oranje native hulp-/optietekst vervangen door bordeaux. Foto's passen in vierkante FIT-kaders zonder productdetails af te snijden.
- Categorie Punniken toont uitsluitend de drie punnikproducten. Borduren toont geen andere producten als opvulling. Geen handmatige of fictieve prijskaarten.

## Nog aan te passen in Ecwid vóór verkoop

1. **Bagcharm:** de tekst “max. 7 letters” is alleen een label. Acht letters (Testnaam) werden geaccepteerd. Voor dubbel touw konden naam en kleur van het tweede touw leeg blijven. Kies een ondersteunde inrichting die deze invoer afdwingt of controleer aanvragen expliciet. Het uitsluiten van kleuren is nu verplicht; bepaal of dit de bedoeling is. De beschrijving vraagt gewenste letterkleuren, maar daarvoor ontbreekt een eigen invoerveld.
2. **Poppy:** Hartje toevoegen is verplicht en biedt uitsluitend twee betaalde keuzes van €3,95. Er ontbreekt “Geen hartje”; de basisprijs van €21,95 kan met de huidige verplichte opties niet worden besteld. Als een hartje optioneel hoort te zijn, voeg dan een keuze zonder hartje/toeslag toe.
3. **Letterstaffels:** aantal letters en vrije tekst zijn afzonderlijke opties. De juiste staffel voor een ingevoerde naam wordt niet door onze code afgeleid. Ecwid-configuratie en de gewenste controle moeten nog sluitend gemaakt worden; maxima en mismatches zijn niet allemaal end-to-end getest.
4. **Mand:** Model 1 en Model 2 hebben momenteel dezelfde prijs. Bevestig of dit de bedoeling is.
5. **Verzending, bedrijfsgegevens en productinhoud:** controleer modellen/kleurkaarten, verzendmethoden en tarieven, levertijden en bestelbevestigingen. Niet ingesteld of gewijzigd tijdens deze controle.

Productopties en meerprijzen functioneren native, maar deze inhoudelijke validatieproblemen betekenen dat nog niet alle personalisatieregels verkoopklaar zijn. Geen app geïnstalleerd of abonnement gewijzigd.

## Pas na Mollie/verzending en afzonderlijke vrijgave

Nog niet getest: volledige adres-/leveringsstappen, verzendtarieven, betaalmethoden, Mollie/iDEAL-succes/annulering/fout, ordervastlegging, bevestigingsmail, factuur en terugbetaling. Daarvoor is een gecontroleerde test nodig nadat de betaal- en verzendinrichting gereed is. Er zijn geen financiële gegevens of Mollie-inloggegevens gebruikt.

## Techniek en publicatie

Eén officiële Ecwid-loader, gedeelde API-status en native winkelwagen. Categorie-ID's komen uit src/data/ecwid-categories.json. De officiële openPage-API opent de juiste categorie bij uitgestelde initialisatie; productnavigatie gaat naar de gedeelde winkelroute om dubbele collectie-koppen te voorkomen. Geen REST-token nodig in de frontend. ECWID_CATALOG_READY=true is uitsluitend voor Preview ingesteld. NEXT_PUBLIC_SITE_LAUNCHED=false en noindex blijven behouden. Productie wordt bovendien door het buildscript afgesloten, ook bij abusievelijk overgenomen Preview-variabelen.

De definitieve build-, responsive- en deploymentbewijzen staan lokaal onder artifacts/ecwid-products-check/. Deze auditbestanden en catalogusexport worden niet mee gepubliceerd.

Officiële documentatie: https://docs.ecwid.com/storefronts/store-configuration-settings/design-configs en https://docs.ecwid.com/storefronts/track-storefront-events/page-is-loaded-events.

## Definitieve oplevering

Preview: https://instagram-julie-fleur-lzq8fhso5-minkevdveen-s-projects.vercel.app/

Ready deployment dpl_Gcwqcmgb7Upzi9fmK4TgqL8BDosT, bestaande project-ID prj_iMisnENQeNTSIk1u4H56irPUoPwQ. Vercel Authentication is behouden. De productie-deployment bleef dpl_BCM9Cfuz7rZBVioKdSTFzmYhvBJb. Geen promotie of domein-/DNS-wijzigingen.

Geslaagd: Next.js-productiebuild inclusief TypeScript, ESLint, Ecwid-beleid, beoordelingsomgeving, secrets-/publicatiecontrole van 159 bestanden en exportcontrole van 39 HTML-pagina’s. Alle vijf categorieroutes ook op de online Preview gecontroleerd. Desktop vier rasterkolommen; mobiel twee bij 390px, zonder horizontale overflow. Eén eigen Ecwid-loader en winkel-ID 145090752 bevestigd. Op de online mobiele Preview opnieuw een Poppy met alle opties toegevoegd: €33,85 en alle personalisaties correct in mand en checkoutoverzicht; testregel daarna verwijderd. De volledige betaal-/verzendketen is nadrukkelijk nog niet getest.
