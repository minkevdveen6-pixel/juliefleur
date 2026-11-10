# Julie Fleur — testverslag Ecwid quickfix

Datum: 10 november 2026. Store **145090752**, Venture.

Preview: https://instagram-julie-fleur-9hhposo1u-minkevdveen-s-projects.vercel.app/

## Uitkomst en gerichte aanpassing

De bestaande officiële Ecwid-integratie is behouden. Er is geen tweede storefront-loader, productbrowser of winkelwagen toegevoegd. Producten, foto's, actuele prijzen, voorraad, personalisatievelden en meerprijzen blijven afkomstig van Ecwid. De website berekent geen eigen prijzen en heeft geen ingebouwde productcache of lijst van Ecwid-producten in de broncode.

Eén functioneel punt is verbeterd: **Alle collecties** en de algemene **Winkel** tonen nu alle ingeschakelde Ecwid-producten, onafhankelijk van de optie “Uitlichten op de voorpagina van de winkel”. De homepage-bestsellers houden hun bestaande uitgelichte selectie. De officiële instelling `hide_category_block_show_all_enabled_products` wordt daarvoor alleen op de algemene overzichten aangezet. De categoriepagina's blijven op hun eigen categorie-ID gericht. Dit is ingesteld in de bestaande provider, met een `allProducts`-eigenschap in het bestaande winkelcomponent en de twee betreffende pagina's. Huisstijl, foto's, header, homepage-indeling en footer zijn niet opnieuw ontworpen.

Officiële bron: https://docs.ecwid.com/storefronts/store-configuration-settings/design-configs.

## Bewijs dat nieuwe producten zonder deployment verschijnen

De Preview-deployment **dpl_As26um7hooGxKXcVx6mRtocYzYnr** was al gereed voordat het tijdelijke testproduct werd opgeslagen.

1. Preview eerst gecontroleerd: vijf echte producten, één eigen Ecwid-script, één productbrowser en één verborgen officieel header-cartwidget voor dezelfde native winkelwagen.
2. In Ecwid een afzonderlijke kopie als tijdelijk testproduct gemaakt: **JF integratietest — tijdelijk**, SKU **JF-INTEGRATIETEST-20261110**, ID **877027302**. Het oorspronkelijke artikel is niet gewijzigd. Het testproduct kreeg de bestaande punnikcategorieën, bestaande foto's en twee verplichte opties, een testprijs van €1,23 en eindige voorraad van één. **Uitlichten op de voorpagina stond uit.**
3. Het product verscheen na herladen in **Alle collecties** en **Punniken**, zonder codewijziging of nieuwe deployment.
4. Alleen in Ecwid de testprijs gewijzigd naar €2,34. De nieuwe prijs verscheen in de productpagina en de native winkelwagen, opnieuw zonder deployment.
5. Testproduct met garenkleur **03** en naam **Test** toegevoegd: beide waarden bleven in de mand staan; totaal €2,34.
6. Lege verplichte opties werden geweigerd. Een poging twee stuks te kiezen bij voorraad één werd niet toegevoegd; Ecwid zette het aantal terug naar één. Eén stuk kon vervolgens wel in de mand.
7. Testmandregel verwijderd. Daarna voorraad uitsluitend op het testproduct naar nul gezet. Na herladen toonde de Preview **UITVERKOCHT** en verdween **In winkelwagen**.
8. Het tijdelijke product na afloop verwijderd. Ecwid-beheer bevestigde opnieuw **vijf producten**, zonder testproduct. Geen testorder geplaatst; de mand is leeg achtergelaten.

**Verversing:** Ecwid geeft wijzigingen niet altijd direct overal tegelijk door. Tijdens deze test liepen product- en categoriegegevens kort achter elkaar aan. Herladen na korte verwerkingstijd liet de nieuwe gegevens zien. Een reeds geopende pagina wordt niet voortdurend automatisch vernieuwd; de website heeft daarvoor geen eigen polling of webhook toegevoegd.

Bewijsbeelden staan lokaal onder `artifacts/ecwid-quickfix/`, waaronder `new-product-without-deploy.png`, `cart-test-product.png` en `zero-stock.png`. Het tijdelijke product en de testprijs zijn geen onderdeel van de websitecode.

## Gecontroleerde categorieën

| Collectie | Ecwid-categorie-ID | Echte producten na opruimen |
| --- | --- | --- |
| Bagcharms | 209176759 | Gepersonaliseerde Bagcharm |
| Sieraden & graveren | 209176760 | Poppy Necklace – Letterketting |
| Punniken | 209183254 | Losse Punniknaam; Punniknaam als slinger; Punniknaam op mand |
| Borduren | 209178261 | Nog leeg |
| Vilten kroon | 209183255 | Nog leeg |

Alle vijf routes op de online Preview gecontroleerd. Nieuwe artikelen moeten **ingeschakeld** zijn en in Ecwid aan de gewenste hoofdcategorie worden toegewezen. Voor alleen de homepage-bestsellers is daarnaast de uitgelichte selectie bepalend. Nieuwe categorieën buiten deze vijf vragen eerst een nieuwe bijbehorende website-route/ID-koppeling.

## Producten, opties, winkelwagen en vormgeving

- De vijf echte catalogusartikelen en hun actuele prijzen/foto's zijn rechtstreeks zichtbaar vanuit Ecwid; geen fictieve productkaarten of handmatige prijsweergave toegevoegd.
- De Poppy-ketting op de nieuwe mobiele Preview opnieuw getest met twee letters JF, goudkleurig, geboortesteentje januari goud en goudkleurig hartje. Native prijs en mandtotaal: **€33,85**, inclusief €3,00 lettertoeslag, €4,95 geboortesteentje en €3,95 hartje. Alle vijf geselecteerde opties/teksten waren zichtbaar in de mand.
- De opties en prijzen van alle vijf echte producten waren in de voorafgaande controle op dezelfde dag al afzonderlijk getest; deze quickfix verandert geen productopties of prijsberekening. Zie `ECWID-CONTROLE-2026-11-10.md` voor die volledige productmatrix.
- Native header-teller, toevoegen, verwijderen en lege mand werken. Er is geen tweede mandopslag. Eén eigen script-loader en één productbrowser per document bevestigd; Ecwid zelf mag aanvullende compatibiliteitsbestanden laden.
- Mobiel op 390px: collectiepagina's, productkeuzes, prijs, winkelwagen en homepage bekeken zonder horizontale overflow. Desktop op 1280px: productraster, uitlijning en bestaande roze/groene huisstijl gecontroleerd. De bestaande vierkante FIT-kaders behouden productdetails.
- Checkout opent de officiële Ecwid-e-mailstap. Geen e-mailadres, adres, betaalgegevens of Mollie-inloggegevens ingevoerd. Geen order of betaling uitgevoerd.

## Wat Fleur nog zelf moet instellen

1. **Producten publiceren:** schakel echte artikelen in, vul foto's en inhoud aan en wijs ze aan de juiste van de vijf hoofdcategorieën toe. Alleen selecteren als uitgelicht wanneer ze ook op de homepage gewenst zijn.
2. **Bagcharm:** “maximaal zeven letters” is nog slechts een label; de bestaande invoer accepteerde eerder acht letters. Naam/kleur voor het tweede touw zijn niet conditioneel verplicht. De beschrijving vraagt gewenste letterkleuren, maar daarvoor ontbreekt een eigen invoerveld. Bepaal ook of het uitsluiten van kleuren echt verplicht hoort te zijn.
3. **Poppy:** Hartje toevoegen is verplicht en kent alleen betaalde keuzes van €3,95. Voeg een keuze zonder hartje/toeslag toe als het hartje optioneel moet zijn. De huidige basisprijs kan met de verplichte opties niet zonder deze toeslag besteld worden.
4. **Letterstaffels:** aantal betaalde letters en ingevoerde tekst zijn afzonderlijke velden. Controleer de gewenste maximale lengte en onderlinge validatie in Ecwid. Niet alle mogelijke kleur-/lettercombinaties zijn exhaustief getest.
5. **Mandmodellen:** bevestig of Model 1 en Model 2 dezelfde prijs moeten hebben; beide staan nu zonder meerprijs ingesteld.
6. **Verzending en betaling:** stel de gewenste verzendmethoden, zones, tarieven, levertijden en Mollie in. Deze instellingen zijn niet gewijzigd of geactiveerd. Voer daarna een gecontroleerde volledige test uit voor adres, levering, betaling, annulering/fout, ordergegevens, bevestigingsmail en factuur.

## Build, publicatie en grenzen

Geslaagd: Next.js 16.4.3-productiebuild inclusief TypeScript; ESLint op de gewijzigde bestanden; Ecwid-/beoordelingsbeleid; secrets-/publicatiecontrole van 159 bronbestanden; exportcontrole van 39 HTML-pagina's.

Er is uitsluitend naar het bestaande Vercel-project **instagram-julie-fleur**, als **Preview**, gepubliceerd. Vercel Authentication is behouden. Geen productiepromotie, DNS-wijziging, domeinwijziging of wijziging aan mijn.host. De livewebsite houdt haar beoordelingsstatus, noindex en uitgeschakelde productieverkoop. De Ecwid-loader is op de huidige live-homepage nog niet geactiveerd; de geteste koppeling staat in Preview klaar voor afzonderlijke vrijgave.

Mollie is niet gekoppeld, geen betaalmethode is geactiveerd en er zijn geen betalingen of orders aangemaakt. De integratie is technisch getest tot de winkelwagen/eerste checkoutstap; volledige verkoopgereedheid blijft afhankelijk van de hierboven genoemde Ecwid-instellingen en een afzonderlijke eindtest.
