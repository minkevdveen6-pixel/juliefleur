# Julie Fleur — inrichting en controle van de Ecwid Preview

Store **145090752**, Venture. Alleen het bestaande Vercel-project `instagram-julie-fleur`. Productie en DNS blijven ongewijzigd.

## Wat de integratie doet

- Eén gedeelde loader (`EcwidProvider`) registreert één eigen officiële Ecwid-loader per document. Ecwid kan zelf aanvullende compatibiliteitsbestanden laden. De gedocumenteerde uitgestelde initialisatie met `_xnext_initialization_scripts` en `Ecwid.init()` registreert de storefront én het officiële header-winkelwagenwidget samen. Er zijn geen afzonderlijke winkelwagens of prijsberekeningen.
- De header behoudt exact het bestaande tas-icoon. De teller en de lege/niet-lege toestand komen uit `Ecwid.Cart.get` en `Ecwid.OnCartChanged`. Een verborgen officieel minicart-widget verzorgt alleen de ondersteunde API-initialisatie op pagina’s zonder productbrowser; dit is geen tweede zichtbare winkelwagen. De website bewaart geen kopie van de mandinhoud, klantgegevens of prijzen.
- De lege mand krijgt één titel **Winkelmandje**, de tekst **Je winkelmandje is nog leeg.** en **Bekijk de collecties**. De native lege presentatie wordt vervangen door deze presentatie van de echte Ecwid-toestand; de officiële mand blijft geïnitialiseerd. Bij een echte gevulde mand worden Ecwid's orderregels, opties, prijzen en checkout gebruikt.
- Dubbele Ecwid-breadcrumbs, footer-navigatie en losse inloglink staan via ondersteunde configuratie uit. Account, orderhistorie en tracking blijven via **Mijn account & bestellingen** bereikbaar. Alle gedocumenteerde checkoutstappen zijn toegestaan; dit omvat ook adres, levering, adresboek, betaling, orderbevestiging en foutpagina's.
- Kleuren en lettertype komen via Ecwid's `chameleon`-configuratie uit de bestaande CSS-tokens. Productfoto's krijgen vierkante kaders met **FIT**, zodat de afbeelding niet wordt afgesneden. Native medium-kaarten passen zich aan de beschikbare breedte aan. De voorkeur is circa vier kolommen op desktop en twee op mobiel; dit moet met echte productbeelden worden nagemeten. Geen schaduwen, productkaders, SKU's of koopknoppen in het raster.
- Directe navigatie naar de vijf aangetroffen demoproduct-ID's wordt met `Ecwid.OnPageSwitch` geweigerd. Een eventueel reeds met voorbeelden gevulde mand wordt niet getoond of automatisch aangepast. Het ongecontroleerde rootassortiment en zoeken blijven met `ECWID_CATALOG_READY=false` afgeschermd. Dit beschermt de presentatie op deze website, niet andere Ecwid-verkoopkanalen.

## Categorieën gekoppeld op 10 november 2026

De vijf hoofdcategorieën zijn in Ecwid aangemaakt en geverifieerd. Bestaande categorieën en productgegevens zijn behouden.

| Route | Categorie-ID | Echte producten |
| --- | --- | --- |
| /collecties/bagcharms/ | 209176759 | Gepersonaliseerde Bagcharm |
| /collecties/sieraden-graveren/ | 209176760 | Poppy Necklace – Letterketting |
| /collecties/punniken/ | 209183254 | Losse Punniknaam; Punniknaam als slinger; Punniknaam op mand |
| /collecties/borduren/ | 209178261 | Nog leeg |
| /collecties/vilten-kroon/ | 209183255 | Nog leeg |

De echte ID's staan in `src/data/ecwid-categories.json`. Een Preview-variabele `NEXT_PUBLIC_ECWID_CATEGORY_IDS` kan deze overschrijven. Tijdens de controle bestaat geen dergelijke override.
De officiële `Ecwid.openPage('category', {id})` wordt bij het eerste laden gebruikt: alleen `defaultCategoryId` bleek bij de uitgestelde initialisatie niet voldoende. Producten openen in `/winkel/?product=ID`; daardoor blijven collectie-koppen en breadcrumbs buiten productdetails. Native prijzen, opties, mand en checkout blijven van Ecwid.

Na de eenmalige ID-koppeling hoeven nieuwe productnamen, foto's, prijzen, opties, voorraad en categorie-toewijzingen niet in de websitecode te worden overgenomen. De storefront haalt deze gegevens bij Ecwid op. Controleer een wijziging met een nieuwe paginabezoek of herladen; een reeds geopende pagina en Ecwid's eigen caching kunnen de oude weergave nog tijdelijk behouden. De website bevat geen tweede productcache of periodieke synchronisatietaak.

De vijf echte producten zijn ingeschakeld, op voorraad en in het storefront opgenomen. De catalogus bevat vijf producten en geen standaardvoorbeelden. `ECWID_CATALOG_READY=true` is daarom uitsluitend voor Vercel Preview ingesteld. Productie is niet vrijgegeven.

Zie `ECWID-CONTROLE-2026-11-10.md` voor de praktijktest, gevonden productinstellingen en beperkingen. Oudere opmerkingen hieronder beschrijven de eerdere voorbereidingsfase; de gedateerde controle gaat voor.

## Wat Fleur in Ecwid moet doen

1. Controleer/maak de vijf categorieën en lever hun echte ID's aan. Koppel uitsluitend echte artikelen aan deze categorieën.
2. Schakel de vijf standaardvoorbeeldartikelen uit. Voeg echte producten toe, met Nederlandse naam, beschrijving, meerdere foto's, juiste europrijs, beschikbaarheid en de juiste categorie. Publiceer pas volledige artikelen.
3. Voeg opties en invoervelden toe in het productbeheer: kleuren/uitvoeringen, vereiste naam of graveertekst, keuzes zonder ongewenste voorselectie en eventuele vaste/procentuele prijsmodificaties. Alle toeslagen worden door Ecwid berekend. Bevestig dat gekozen waarden in mand, order, e-mail en factuur terugkomen.
4. Stel gewicht/maten en de gewenste verzend- en afhaalmogelijkheden in. Beslis zelf over tarieven, zones en eventueel een gratis-verzendgrens. Controleer belastinginstellingen en prijsinclusie met de eigen boekhouder.
5. Kies en verbind zelf een ondersteunde betaalprovider die de gewenste iDEAL-methode aanbiedt. Geen provider is door deze wijziging geactiveerd. Test in de afgesproken testmodus; er is geen betaling gedaan.
6. Vul bedrijfsgegevens, juridische pagina's, voorraad-/productietijden, bestelbevestigingen en afzender in. Controleer tracking en cookie-toestemming in Ecwid voordat de winkel publiek gaat verkopen.

## Venture: mogelijkheden en grenzen

Native keuzelijsten, radio's, checkboxen, kleurstalen, tekstvelden en tekstgebieden passen bij het gewenste personaliseren. Vereiste velden en meerprijzen zijn Ecwid-instellingen. Productopties verschijnen in orderdetails, meldingen en facturen. De website voegt geen losse prijs- of personalisatie-engine toe.

Afzonderlijke voorraad, afbeelding en SKU per combinatie via **productvariaties** zijn volgens de actuele documentatie Business/Unlimited-functionaliteit. Voorwaardelijk tonen van opties kan aanvullende configuratie of een opties-app vragen; er is geen app geïnstalleerd of abonnement gewijzigd. Regels zoals lettertelling tegenover een betaalde staffel moeten per echt product worden gevalideerd. Een vrijwillige staffelkeuze bewijst niet automatisch dat de ingevoerde naam eraan voldoet.

## Gecontroleerd en nog open

Technisch: officiële scriptinitialisatie, juiste winkel-ID, native lege mand/teller, compacte lege presentatie, behoud van accountnavigatie, routebeleid voor echte categorieën en demoproducten, alle checkout-paginatypen, fout-/laadtoestanden, typecontrole en productiebuild. De browsercontrole en uiteindelijke deploymentresultaten staan in `artifacts/ecwid-refinement/`.

**Met echte producten nog uitvoeren:** homepage → gekoppelde collectie → product → opties kiezen → toevoegen aan mand → aantal/opties wijzigen → verwijderen/terugkeren/herladen → alle checkoutstappen. Controleer echte totalen, btw, NL/BE-verzending/afhalen, gratis-verzendgrens, iDEAL-succes/annulering/fout en ontvangen bestelbevestiging. Controleer vier/twee rasterkolommen met verschillende echte foto's en de teller bij een niet-lege mand. Een unit-test met testobjecten vervangt deze controles niet. Er zijn geen testproducten, mandregels, orders of betalingen aangemaakt.

Productie blijft geblokkeerd door `scripts/build-review.mjs`: ook bij overgenomen Preview-variabelen blijven Ecwid, productievrijgave en indexering uit. Het contactformulier en alle bestaande website-onderdelen buiten de winkelintegratie zijn ongemoeid gelaten. De wijziging wordt alleen als Vercel Preview gepubliceerd.

## Officiële bronnen

- [Uitgestelde initialisatie voor React en andere dynamische websites](https://docs.ecwid.com/api-reference/rest-api/storefront-widget-details/dynamic-loading-for-storefront-widget)
- [Ecwid-vormgeving, chameleon en tekstlabels](https://docs.ecwid.com/storefronts/store-configuration-settings/design-configs)
- [Officiële winkelwagenwidget, teller en eigen icoon](https://support.ecwid.com/hc/en-us/articles/360000013659-Adding-shopping-bag-to-a-custom-site)
- [PageSwitch en pagina-gebeurtenissen](https://docs.ecwid.com/storefronts/track-storefront-events/page-is-loaded-events)
- [Native winkelwagengegevens](https://docs.ecwid.com/storefronts/manage-cart-and-checkout/get-cart-details)
- [Productopties en prijsmodificaties](https://support.ecwid.com/hc/en-us/articles/207099959-Product-options)
- [Tekstinvoer en verplichte velden](https://support.ecwid.com/hc/en-us/articles/8751424680988-Adding-text-input-fields-calendar-or-file-uploader-to-product-pages)
- [Productdetails en planbeperkingen](https://support.ecwid.com/hc/en-us/articles/360000009240-Guide-to-product-details)
