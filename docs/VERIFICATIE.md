# Verificatie eerste versie

## Leesbaarheid, cookiekaart en schermformaten — 2 november 2026

- Lopende tekst nu 16–17 px; navigatie, productinformatie, prijzen, formulieren en footer hebben afzonderlijke, grotere schalen. Serifkoppen, kleuren, foto's, inhoud en productfunctionaliteit behouden.
- Nieuwe cookiekaart op 390 × 844: 358 × 419 px, volledig zichtbaar zonder intern scrollen. Op 320 × 568: 288 × 498 px, eveneens binnen beeld. Op 844 × 390 blijft de kaart binnen het scherm en kan de inhoud intern scrollen. Sluitknop is 44 × 44 px; keuzevlakken circa 154 × 62 px op 390 px breed. Escape sluit en herstelt focus naar de cookieknop.
- Cookiekeuze via beide knoppen gecontroleerd. Na toestemming één Instagram-iframe, na intrekken nul. Intrekken blijft na herladen behouden. Contactinvoer bleef behouden na wijzigen van cookievoorkeuren; Tab gaat van Naam naar E-mailadres; invoerlettergrootte 16 px; verzendknop blijft uitgeschakeld.
- Bewegende tekstbalk: circa 72 px hoog met 16px-tekst op mobiel, circa 77 px met 17px-tekst op desktop. Eén toegankelijke reeks boodschappen; duplicaat alleen voor de vloeiende CSS-animatie. Ondersteuning voor verminderde beweging is in de CSS behouden.
- Alle 37 geëxporteerde paginaroutes (inclusief de foutpagina) op 320 px breed doorgelopen: geen horizontale pagina-overloop en geen zichtbare afgesneden tekst gevonden. Het opzettelijk verborgen zoeklabel is buiten de visuele beoordeling gehouden.
- Acht representatieve paginatypen op 390 en 1440 px breed gecontroleerd: home, collecties, sieradencollectie, twee productpagina’s, contact, FAQ en privacy. Op 768 px zijn home, collecties, product en contact extra gecontroleerd. Geen horizontale overloop of tekstafsnijding op de gecontroleerde paginatypen. Mobiel menu en collectienavigatie werken.
- Gelijke collectiebeelden op 390 px: drie keer 350 × 438 px. Footerlinks 15 px. Geen foto's vervangen, bewerkt of toegevoegd. Geen consolefouten/-waarschuwingen tijdens de afzonderlijke interactiecontrole waargenomen.
- Productiebuild en TypeScript geslaagd. Gerichte ESLint-controle, exportcontrole en uitgeschakelde Vercel-contactadapter gecontroleerd. Geen DNS-wijzigingen; Ecwid en betalingen blijven uit.

Lokale bewijsbeelden en meetgegevens staan onder `artifacts/readability-*` en worden niet als bronbestanden gepubliceerd.

## Vercel-beoordelingsversie — 2 november 2026

- Next.js 16.4.3: productiebuild geslaagd met Node.js **22.23.4**, 40 statisch gegenereerde pagina’s. De bestaande statische export, vormgeving en fotografie zijn behouden.
- Lint, TypeScript, zestien cataloguscontroles en 22 contactscenario’s geslaagd. De afzonderlijke Vercel-adapter is ook onder Node.js 22 gecontroleerd: ready:false, geen verzending, POST 503, ongeldige herkomst 403 en ongeldige methode 405. Dit is geen echte mailontvangsttest.
- Exportcontrole: interne links, lokale afbeeldingen, canonicals op `https://juliefleur.nl/`, noindex, lege sitemap en geblokkeerde robots gecontroleerd. Geen oude Sites-origin of actief Ecwid-script in de export.
- Vercel is voorbereid met preset Other, `npm ci`, `npm run build`, uitvoer `out` en de losse `/api/contact`-functie. `X-Robots-Tag` is geconfigureerd; de daadwerkelijke Vercel-responseheaders kunnen pas na import worden gemeten.
- Browsercontrole van de lokale productie-export op 1280 × 720 en 390 × 844: geen horizontale overloop. Mobiel menu en navigatie naar Contact werken; verzendknop blijft uit. Het nieuwe portret op Over Fleur laadt en past binnen de mobiele weergave.
- De echte Instagram-feed laadt na toestemming op mobiel, met echt profiel en bericht. Intrekken verwijdert de iframe (nul over). Geen consolewaarschuwingen of -fouten waargenomen tijdens deze gecontroleerde interacties.
- Broncodepakket gecontroleerd op uitgesloten env-bestanden, lokale hostingidentiteit en bekende credentialpatronen. Er wordt een schone broncodestart gebruikt, zonder de oude hostinghistorie. Dit vervangt geen volledige beveiligingsaudit.
- Geen DNS-, domein-, Ecwid-, mailprovider- of hostingwijzigingen uitgevoerd. GitHub-upload en Vercel-import zijn afzonderlijke stappen; deze lokale controles bewijzen geen live deployment.

Bewijsbeelden staan lokaal in `artifacts/vercel-review-desktop.png`, `artifacts/vercel-review-mobile.png` en `artifacts/vercel-review-instagram.png`; ze horen niet bij de bronrepository. Zie `VERCEL.md` voor importinstellingen en de resterende controle na import.

De onderstaande controles beschrijven eerdere versies en de toenmalige hosting.

Datum: 30 oktober 2026. Getest met Node.js 24.15.0, de Next.js-productiebouw en de lokale Cloudflare Worker-runtime. Er is geen actieve Ecwid-winkel aangesloten.

## Technisch

- ESLint: geslaagd. Een ongebruikte lintuitzondering is verwijderd; de aangepaste bestanden zijn opnieuw gecontroleerd.
- TypeScript: geslaagd via `npm run typecheck` en opnieuw als onderdeel van de productiebuild.
- Next.js productiebuild: geslaagd; alle voorbereide routes statisch gegenereerd.
- Cataloguscontrole: geslaagd voor zestien producten, prijsstaffels, bekende extra’s, tekengrenzen en conditionele velden.
- Exportcontrole: 40 HTML-bestanden inclusief de aparte widget-embed. Inhoudspagina’s gecontroleerd op één h1, geldige interne links, canonicals, `noindex` en afwezigheid van rechtstreeks ingesloten externe scripts. Robots blokkeert indexering; sitemap is leeg zolang de site niet is vrijgegeven.
- De lokale Worker-preview geeft de eigen foutpagina met HTTP 404 bij een onbekend pad.
- `git diff --check`: geslaagd.

## Browsercontrole

De productie-export is met de in-app browser gecontroleerd.

- Homepage op 390 × 844 en 1440 × 1000: eigen mobiele en desktopcompositie, geen horizontale pagina-overloop (`scrollWidth` gelijk aan viewportbreedte).
- Mobiel menu: opent als modal, focus op sluitknop; navigatie naar Bagcharms werkt en sluit het menu.
- Bagcharm: dubbel touw toont tweede tekstveld en voorbeeldprijs € 19,50. Acht ingetoetste tekens worden begrensd tot zeven. Bestelknop blijft uitgeschakeld.
- Poppy: negen letters + geboortesteentje + hartje geeft € 54,85. Geen externe winkel- of trackingscripts geladen.
- Zoeken: ‘poppy’ geeft één resultaat; een onbekende zoekterm geeft de ontworpen lege toestand.
- Winkelmand-icoon: toont de eerlijke voorbereidingsmelding, zonder nepvoorraad of nepmand. Escape sluit de modal.
- Geen waarschuwingen of fouten in de console van de gecontroleerde productiepagina’s.

Screenshots staan lokaal in `artifacts/julie-fleur-mobile.jpg` en `artifacts/julie-fleur-desktop.jpg` (niet in de bronrepository opgenomen).

### Update met aangeleverd logo

Het originele PNG-logo is toegevoegd en de header gebruikt het bestand rechtstreeks. Bronafmetingen en geladen afbeelding zijn in de browser gecontroleerd: 1320 × 1597 pixels. Het bestand is byte voor byte bewaard; alleen de lege buitenmarges worden met CSS buiten het zichtvenster gehouden.

Opnieuw gecontroleerd op 1280 × 720 en 390 × 844: het volledige merkbeeld past binnen de header, zonder vervorming of horizontale pagina-overloop. De header blijft 100 pixels hoog op desktop en 76 pixels op mobiel, exclusief aankondiging/navigatie. Geen consolemeldingen. Lint, typecheck, productiebuild en exportcontrole slagen na deze wijziging. De contrasttabel hieronder is bijgewerkt met de gemeten rasterkleuren. Nieuwe screenshots: `artifacts/julie-fleur-logo-desktop.jpg` en `artifacts/julie-fleur-logo-mobile.jpg`.

## Contrast

Berekening volgens relatieve sRGB-luminantie. Dit verifieert de hoofdkleurcombinaties, geen volledige toegankelijkheidsaudit.

| Tekst / achtergrond | Ratio | WCAG AA normale tekst |
| --- | --- | --- |
| Bordeaux / gebroken wit | 7,10:1 | Voldoet |
| Bordeaux / poederroze | 5,27:1 | Voldoet |
| Olijf / gebroken wit | 6,18:1 | Voldoet |
| Secundaire tekst / gebroken wit | 6,29:1 | Voldoet |
| Gebroken wit / olijf | 6,18:1 | Voldoet |

## Niet geverifieerd of nog niet beschikbaar

- Originele DOCX, vectorlogo/huisstijlgids, overige productfotografie ontbreken nog; het portret is inmiddels verwerkt. Acht aangeleverde PNG-productfoto’s zijn inmiddels verwerkt. Het aangeleverde rasterlogo is inmiddels verwerkt; de schermkleuren zijn daarvan afgeleid.
- Werkelijke Ecwid-storefront, abonnement, afhankelijke opties, harde bestelvalidatie en doorgifte van personalisatie naar echte orders.
- Betalingen, btw, verzending, afhalen, mails, facturen, retourafhandeling en echte testbestellingen.
- Definitieve bedrijfsgegevens, juridische teksten en cookiegedrag van de toekomstige actieve winkel/hosting.
- Volledige screenreader-, cross-browser- of geautomatiseerde WCAG-audit; de gecontroleerde interacties en hoofdkleuren zijn afzonderlijk vermeld.
- Geen Lighthouse-score geclaimd of gemeten.

## Aanvulling: contact, Instagram en beeldbeheer

- Lint, typecheck en Next.js/Worker-productiebuild geslaagd. Dezelfde Site-ID en besloten toegang blijven behouden; de bestaande Next.js-componenten zijn doorontwikkeld.
- Contactserver: 22 geautomatiseerde scenario’s met gesimuleerde Resend-/Upstash-antwoorden. Vaste ontvanger, Reply-To, normalisatie, headerinjectie, lengte-/bodygrenzen, honeypot, herkomst, rate-limietfouten, timeouts en idempotentiesleutel gecontroleerd. Dit is geen echte bezorgtest.
- Echte lokale Worker: `/contact/` en `/` geven 200; `/api/contact` geeft 200 met `ready: false`; onjuiste herkomst geeft 403. Zonder configuratie wordt geen mail verstuurd.
- Contactpagina gecontroleerd op 390, 768, 1280 en 1440 pixels breed, met juiste verplichte labels en limieten, geen horizontale overloop en een duidelijke niet-actieve verzendstatus. Tab gaat van Naam naar E-mailadres. Invoer bleef behouden na wijziging van cookievoorkeuren.
- Elfsight heeft daadwerkelijk het echte profiel en echte berichten geladen na toestemming, zowel mobiel als desktop. Eén platformscript per iframe bevestigd. Vóór toestemming geen iframe/platformscript in de hoofdpagina; na intrekken weer nul iframes. Opnieuw toestaan via de footer werkt.
- Geen consolefouten of -waarschuwingen waargenomen op de gecontroleerde pagina’s.
- Bij de eerdere controle ontbraken de genoemde JPEG’s. De acht daarna aangeleverde PNG’s zijn inmiddels verwerkt; zie de foto-update hieronder.

Nieuwe screenshots: `artifacts/contact-desktop.jpg`, `artifacts/contact-mobile.jpg` en `artifacts/instagram-mobile.jpg`. Ze staan niet in de bronrepository.

Nog noodzakelijk: echte Resend-/DNS-/afzenderconfiguratie, Upstash-inrichting en secrets, ontvangst-/Reply-To-/bouncecontrole en de definitieve privacyafhandeling. Zie `CONTACT-INSTELLEN.md`. Het Elfsight-account en de uiteindelijke publieke domeintoelating blijven door Fleur te controleren. Overige productfoto’s, portret en schone camerabestanden ter vervanging van eventuele screenshotmarkeringen blijven gewenst.

Zie `OPENSTAANDE-PUNTEN.md` en `ECWID-IMPLEMENTATIE.md` voor de besluiten en acceptatiecriteria vóór publieke verkoop.

## Foto-update — 31 oktober 2026

- Acht clipboard-PNG’s verwerkt, met 24 WebP-varianten. Grootste varianten samen 1.548.112 bytes tegenover 17.999.480 bytes bronmateriaal: circa 91% minder. 480px-varianten samen 320.116 bytes. Geen gemeten laadsnelheidsclaim.
- Alle acht beelden zijn teruggevonden in de productie-export; lokale verwijzingen bestaan en alt-teksten zijn ingevuld. Lokale bronkopieën zijn met SHA-256 byte-identiek aan de bijlagen bevonden.
- Homepage op 1440 × 1000 en 390 × 844 bekeken; geen horizontale overloop. Hero en collecties tonen de volledige beelden met `contain`; namen blijven zichtbaar.
- Mandproductpagina mobiel gecontroleerd: volledige Neeke-foto, natuurlijke verhouding, voorbereidingsprijs en uitgeschakelde bestelknop.
- Sieradencollectie op 768 × 1024 gecontroleerd: geen pagina-overloop; beide aanvullende sieradenbeelden geladen met volledige beeldinhoud. Geen consolefouten of -waarschuwingen op de gecontroleerde pagina’s.
- Lint, typecheck, productiebuild, exportcontrole van 40 HTML-bestanden en `git diff --check` geslaagd. Ecwid- en mailconfiguratie zijn niet veranderd.
- Screenshots lokaal: `artifacts/photography-home-desktop.jpg`, `artifacts/photography-home-mobile.jpg`, `artifacts/photography-jewelry-tablet.jpg`.

## Rustige beeldindeling en portret — 31 oktober 2026

- Ronde hero-sticker verwijderd.
- Geen herhaalde product- of portretfoto binnen dezelfde geëxporteerde HTML-pagina. Alle lokale beeldverwijzingen en alt-teksten gecontroleerd.
- Homepagecollecties gemeten: drie keer 421 × 527 px op desktop (1440 px breed), drie keer 350 × 438 px op mobiel (390 px breed). Namen, kralen en bagcharmdetails visueel gecontroleerd.
- Homepage heeft een unieke fotokeuze; dubbele collectieheaders worden overgeslagen.
- Portret geïntegreerd op homepage en Over Fleur. Bronkopie byte-identiek aan de bijlage; alleen WebP-optimalisatie en CSS-uitsnede van zwarte zijranden. Geen filters, retouche of gegenereerde beeldinhoud.
- Portretweergave: 350 × 525 px op desktop; 310 × 465 px op mobiel. Geen horizontale overloop of consolefouten/-waarschuwingen waargenomen.
- Lint, typecheck, productiebuild en exportcontrole geslaagd. Screenshots: `artifacts/collecties-gelijke-fotos.jpg` en `artifacts/fleur-natuurlijk-desktop.jpg`.

## Cookiebloem en actieve Instagram-feed — 31 oktober 2026

Automatische eerste keuze in bloemvorm, een vaste bloemknop en actueel cookiebeleid toegevoegd. Dertien opslag-/toestemmingscontroles geslaagd. In de productiepreview werd de echte feed op mobiel en desktop geladen na toestemming. Voor toestemming nul iframes; na toestaan één iframe met één platformscript; na intrekken nul iframes. Weigeren blijft na herladen bewaard. Escape sluit en herstelt focus naar het bloemetje. Cookiebeleidlink werkt.

Gecontroleerd op 320 × 760, 390 × 844 en 1280 × 720, zonder horizontale overloop of consolefouten/-waarschuwingen. Lint, typecontrole via productiebuild en exportcontrole geslaagd. Screenshots: `artifacts/cookiebloem-desktop.jpg`, `artifacts/cookiebloem-mobile.jpg`, `artifacts/instagram-live-mobile.jpg`, `artifacts/instagram-live-desktop.jpg`. Zie `COOKIES.md`.
