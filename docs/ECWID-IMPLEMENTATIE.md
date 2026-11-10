# Ecwid — inrichting en acceptatie

Actuele Ecwid-Preview-koppeling voor Store ID 145090752: zie [ECWID-PREVIEW.md](ECWID-PREVIEW.md). De live beoordelingswebsite blijft ongewijzigd.

Controle van officiële documentatie: 30 oktober 2026. Het daadwerkelijke account en het gekozen abonnement zijn nog niet beschikbaar. Onderstaande inrichting is een onderbouwd voorstel, geen toezegging dat alle afhankelijkheden zonder aanvullende app werken.

## Architectuur en eigenaarschap

Fleur wordt eigenaar en betaler van haar eigen Ecwid-account. Studio FROU krijgt alleen benodigde beheerrechten als het gekozen abonnement die ondersteunt. Deel geen hoofdwachtwoord en zet geen geheime API-token in deze site.

De applicatie heeft één winkelroute `/winkel/` met de officiële `https://app.ecwid.com/script.js?STOREID&data_platform=code` en `xProductBrowser`. Geen eigen winkelwagen, betaalstroom, orderdatabase of bestel-API. Native Ecwid productopties en invoervelden moeten alle gekozen waarden in de echte order opnemen. Het lokale personalisatievoorbeeld heeft geen overdracht naar de winkel.

De drie omgevingswaarden uit `.env.example` sluiten onbedoelde activering uit. De openbare indexeringsschakelaar is apart: `NEXT_PUBLIC_SITE_LAUNCHED`. In de eerste versie staan ze uit. Voer bij de livegang eerst de acceptatietests uit in de echte winkel, daarna activeren en opnieuw bouwen. Live collecties en zoeken verwijzen naar Ecwid; de briefingcatalogus wordt dan geen live prijsbron. Eventuele verdere integratie van native productkaarten wordt pas gebouwd met geverifieerde catalogus-ID’s of een ondersteunde read-only cataloguskoppeling.

## Officiële mogelijkheden en grenzen

| Onderdeel | Gecontroleerde mogelijkheid | Nog in echte account aantonen |
| --- | --- | --- |
| Native storefront | Officiële script-embed / xProductBrowser | Juiste winkel, huisstijl, mobiele navigatie, hash-routes en foutscenario’s |
| Opties | Selecties, checkboxen, prijsmodificaties; gekozen waarden komen in orderdetails | Definitieve Nederlandse veldnamen, vereiste keuzes en alle toeslagen |
| Invoervelden | Tekst/textarea, verplicht mogelijk; input komt in order, mails en factuur | Tekengrenzen, lettertelling, bijzondere tekens en grensvalidatie; documentatie bevestigt niet alle gevraagde regels |
| Kleuren | Native kleurstalen vermeld op Venture en hoger | Exacte aangeleverde kleuren en uitvoering in klantaccount |
| Variaties | Afzonderlijke prijs, afbeelding en voorraad; vermeld bij Business/Unlimited | Noodzaak en aantal echte combinaties; niet elk persoonlijk tekstveld als variant aanmaken |
| Afhankelijke/image opties | Officiële documentatie verwijst hiervoor naar Advanced Product Options | Appcompatibiliteit, abonnementsrechten, prijs en correcte ordergegevens; geen standaardgarantie |
| Abonnement | Starter noemt 10 producten/2 categorieën; Venture 100; Business biedt variaties | Dit assortiment telt 16 producten en 5 categorieën; Starter past op deze aantallen niet. Venture kan basiskeuzes afdekken, Business onderzoeken bij variantenbeheer. |

Geen abonnement aangeschaft of als definitieve keuze vastgelegd. Controleer actuele regionale prijzen in Fleurs eigen account. Vertrouw voor de harde grenzen **niet** op uitsluitend JavaScript op de website: een bestelling via andere Ecwid-kanalen moet dezelfde geldige configuratie opleveren.

## Categorieën

Bagcharms, Sieraden & graveren en Punniken zijn voorbereide hoofdcategorieën. Borduren en Vilten kroon blijven leeg tot echte producten beschikbaar zijn. Geen fictieve bestsellers: pas zichtbaar maken bij expliciet door Fleur ingestelde producten. Bepaal eerst of Borduren en Punniken afzonderlijke categorieën blijven. Leg echte Ecwid-ID’s vast na inrichting.

## Productopties en afhankelijkheden

Alle bedragen en bekende keuzewaarden staan eenmalig in `src/data/catalog.ts` en exporteerbaar in `ASSORTIMENT.json`. In deze tabel staan inrichting en validatie, geen tweede prijslijst.

| Product | Voorstel Ecwid | Acceptatie / beperking |
| --- | --- | --- |
| Bagcharm | Uitvoering met prijsverschil; tekst 1/2; touwkleur; bedel; gewenste/uitgesloten letterkleuren | Maximaal 7 letters per touw; tekst 2 alleen bij dubbel. Minimaal 3 gewenste en maximaal 2 uitgesloten kleuren, geen ongewenste overlap. Nog geen bevestigde native oplossing voor alle groepsvalidaties. Zo nodig aparte enkel/dubbel producten en een ondersteunde opties-app. |
| Losse punniknaam | Aantal letters met prijsmodificatie; naam; garen | Naam moet passen bij betaalde staffel. Niet vertrouwen op een vrijwillige prijskeuze die losstaat van naam. Afdwingen met geverifieerde app/ondersteunde validatie of afzonderlijke producten met veilige intake vóór betaling. |
| Punnikslinger | Naam en garen | Maximale lengte, kleurkeuze en extra regels nog bepalen. |
| Kaartjeshouder | Niet publiceren totdat prijs bekend is | Geen nulprijs of fictieve prijs invullen. |
| Punniknaam in ring | Afwerking met prijsmodificatie; naam; garen; eventueel voetje | Voetje alleen bij bloemen. Prijs ontbreekt; geen gratis keuze veronderstellen. Eventueel bloemen/flosjes splitsen. |
| Fotolijst | Formaat met prijsverschil; framekleur; naam; garen | 10 × 15 maximaal 4 letters; grotere naamlimiet ontbreekt. Afhankelijk limiet aantonen of formaten splitsen. |
| Rieten tasje | Beige/bruin; naam; garen | Afmetingen en maximale naam ontbreken. |
| Mand | Visuele modeltegels/afzonderlijke producten met echte foto’s en namen | Modelprijzen en maten ontbreken. Native kleurstalen zijn niet automatisch algemene fototegels; app of aparte modelproducten onderzoeken. |
| Bar Bracelet engraved | Bar/band, 5 echte graveerfonts, verplichte tekst | Fonts en graveerlimieten ontbreken. Controleer dat fontkeuze en exacte tekst in order/mails komen. |
| Poppy necklace | Aantal letters, goud/zilver, letters, steentje, hartje, samenstelling | Letteraantal koppelen aan tekst; toeslagen uitsluitend één keer. Beschikbare steentjes en aantallen extra’s eerst vaststellen. Geen vrijblijvende betaalde staffel. |
| Paracord Initial bracelet | Kids/klein/groot met prijsmodificatie; initiaal, extra letters, kleur | Toeslagen en maximale extra’s ontbreken; geen extra letters aanbieden zonder definitieve prijs. |
| Birthstone bracelet | Steentje en definitieve uitvoering | Foto’s, materialen en maten ontbreken. |
| Sailor bracelet | Definitieve uitvoering | Variaties nog niet bevestigd. |
| Paracord initial necklace | Groot/klein met prijsverschil; initiaal, extra letters, kleur | Afwijkende prijsvolgorde bevestigen; extra toeslagen ontbreken. |
| Chunky / Mermaid Initial bracelet | Initiaal en definitieve uitvoering | Materiaal, maten en kleuren nog aanvullen. |

Voor 45 gewone en 7 teddygarenkleuren eerst officiële namen/beelden verzamelen. Geen willekeurige kleurstalen gebruiken. Voor mogelijke variatievoorraden voorkomen dat tientallen onnodige combinaties ontstaan: onderscheid keuze-informatie van echte SKU-voorraad.

## Betalingen, logistiek en belastingen

1. **Basis:** euro, Nederlandse taal en juiste juridische ondernemingsgegevens. Boekhouder bevestigt belastingstatus en juiste prijsweergave inclusief eventueel toepasselijke btw.
2. **Betalen:** Fleur kiest en verbindt een eigen ondersteunde provider. Verifieer gewenste Nederlandse en Belgische betaalmethoden in haar account; beloof geen specifieke methode vóór providercontrole. Gebruik testmodus of afgesproken testprocedure; controleer succes, mislukking, annulering en terugbetaling.
3. **Nederland:** DHL, aparte brievenbus/pakketmethoden; productgewichten, maximale maten, zone en tarieven invullen. Geen tarief uit deze code afleiden.
4. **België:** bevestig vervoerder, zones en toepasselijke methods/tarieven. Test Belgische postcodes en adressen. Geen ongeconfigureerde landen accepteren.
5. **Verpakking:** circa € 0,50 is nog een besluitpunt. Bepaal of een eventuele toeslag in tarief of handling fee hoort; voorkom dubbele berekening en onverwachte kosten.
6. **Afhalen:** Helmond, exact adres en afhaalinstructie na bevestiging, met gereedmelding. Geen automatische gereedverklaring bij betaling.
7. **Btw NL/BE:** geen tarief, KOR of OSS-keuze veronderstellen. Laat boekhouder beoordelen welke NL/BE-regels voor deze onderneming gelden, stel belastingzones/prijsinclusie/factuurgegevens correct in en test beide landen plus afhalen. Zie de Belastingdienst als bron voor grensoverschrijdende verkoop; dit bestand is geen fiscaal advies.
8. **Productietijden:** per product vastleggen; termijn voor gemengde order vooraf zichtbaar. Besluit samen verzenden of deelzenden. Facturatie-/betaalmoment, werkdagen, start productie en vervoerstijd onderscheiden.
9. **Spoed:** geen generieke betaaloptie. Eerst schriftelijke bevestiging door Fleur, daarna alleen een gecontroleerde, ordergebonden procedure binnen Ecwid. Onderzoek accountrechten en ondersteunde werkwijze; geen open spoedproduct als omweg.

## Verplichte acceptatietests vóór activeren

- [ ] Werkelijk account/abonnement, alle categorieën/producten en juiste eigenaarschap bevestigd.
- [ ] Elk verplicht veld ontbrekend, leeg, op grens en over grens getest. Unicode, spaties en accenten volgens afgesproken letterregel.
- [ ] Bagcharm enkel/dubbel, tekst 2, maximaal 7 letters, 3 gewenste / maximaal 2 uitgesloten kleuren, overlap, bedel en kleuren.
- [ ] Alle Poppy-staffels 1–9, mismatch in letters, alle extra’s en volgorde; totaal klopt in mand en order.
- [ ] Punnikstaffels, kleine fotolijst met 5 letters, voetje bij flosjes en ontbrekende mandprijs kunnen geen foutieve order opleveren.
- [ ] Exacte tekst, fonts, kleur/model-ID’s, aantallen en samenstelling zichtbaar in Ecwid-order, mails, factuur en relevante export.
- [ ] Teruggaan naar product, wijzigen, verwijderen, aantal wijzigen en pagina verversen leveren geen dubbele toeslagen/optieregels op.
- [ ] Nederlandse brief/pakketorder, Belgische order, gemengde order en afhalen gecontroleerd; juiste belasting, totale kosten en termijn vóór betaling.
- [ ] Geslaagde, afgebroken en mislukte betaling; correct orderstatus-/e-mailverloop; terugbetaling via echte provider gecontroleerd.
- [ ] Geen betaalde spoed zonder voorafgaande bevestiging mogelijk.
- [ ] Maatwerkuitzondering per relevant product vóór koop zichtbaar; geen algemene retouruitsluiting; garantie behouden.
- [ ] Cookie- en privacy-audit van echte storefront, apps en hosting afgerond. Onnodige tracking uit of voorafgaande toestemming.
- [ ] Mobile, toetsenbord, laadsituatie en scriptblokkering testen op de echte storefront.

## Geraadpleegde primaire bronnen

- [Officiële storefront-configuratie en embed](https://docs.ecwid.com/storefronts/store-configuration-settings/overview)
- [Product options, prijsmodificaties en verwijzing naar afhankelijke opties](https://support.ecwid.com/hc/en-us/articles/207099959-Product-options)
- [Input fields en zichtbaarheid van invoer in orders](https://support.ecwid.com/hc/en-us/articles/8751424680988-Adding-text-input-fields-calendar-or-file-uploader-to-product-pages)
- [Product variations](https://support.ecwid.com/hc/en-us/articles/207100299-Product-variations)
- [Abonnementen en functiematrix](https://support.ecwid.com/hc/en-us/articles/207100729-Ecwid-plans-and-features)
- [ACM: bedenktijd en uitzonderingen](https://www.acm.nl/nl/verkoop-aan-consumenten/klantenservice/bedenktijd)
- [Autoriteit Persoonsgegevens: cookies](https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/internet-telefoon-tv-en-post/cookies)
- [Belastingdienst: goederen leveren aan EU-particulieren](https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/btw-goederen-eu-particulieren)

Planfuncties en beschikbaarheid kunnen wijzigen; accountcontrole en testorders gaan boven deze momentopname.
