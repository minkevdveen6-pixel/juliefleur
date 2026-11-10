# Julie Fleur — visuele publicatie 10 november 2026

Bestaand Vercel-project: instagram-julie-fleur. GitHub: minkevdveen6-pixel/juliefleur, productiebranch main. Node.js 22.x, npm ci, npm run build, statische output out.

## Catalogus publiceren zonder betalingsvrijgave

De eigenaar heeft op 10 november expliciet toestemming gegeven om de gecontroleerde catalogus, winkelwagen en checkoutvormgeving naar juliefleur.nl en www.juliefleur.nl te publiceren. Domein- en DNS-records blijven ongewijzigd.

Productievariabelen:

- NEXT_PUBLIC_ECWID_STORE_ID=145090752
- ECWID_CATALOG_PUBLISHED=true
- ECWID_CATALOG_READY=true

Het buildscript leidt de publieke vlaggen af. Alleen de juiste winkel en een expliciete productievlag activeren de live catalogus; Preview-variabelen alleen geven geen productievrijgave. NEXT_PUBLIC_SITE_URL blijft https://juliefleur.nl. NEXT_PUBLIC_SITE_LAUNCHED=false behoudt noindex. Contactverzending blijft uit tot een echte ontvangsttest.

NEXT_PUBLIC_ECWID_PAYMENTS_AVAILABLE blijft false: dit is uitsluitend de melding op de website, geen eigen betaalengine. De header en winkelwagen melden dat online betalen nog niet beschikbaar is. De officiële Ecwid-winkelwagen en checkout zijn behouden. Geen betaalprovider is door de code toegevoegd of geactiveerd.

Preview gebruikt ECWID_PREVIEW_ENABLED=true, ECWID_CATALOG_READY=true en dezelfde Store ID. Productgegevens worden tijdens paginabezoek rechtstreeks door Ecwid opgehaald; nieuwe ingeschakelde producten verschijnen zonder deployment. De algemene overzichten vereisen geen uitgelichte status. Voor een categoriepagina is de juiste Ecwid-categorie nodig; de homepage houdt zijn uitgelichte selectie. Ecwid kan kort caching toepassen: herlaad na verwerken van wijzigingen.

## Vormgeving en controle

De native mand heeft ruimere productregels, grotere foto's, afzonderlijk uitgelijnde opties, leesbare lange teksten, grotere aanraakvlakken en een roze totaalblok. Checkout gebruikt een rustig wit vlak, olijfgroene knoppen en velden in de bestaande huisstijl. Mobiel stapelt de native inhoud. Er is geen tweede widget of prijsberekening toegevoegd.

Geautomatiseerde controles: Ecwid-vrijgavebeleid, typecontrole/productiebuild, ESLint en statische export. Browsercontrole omvat echte producten, personalisatie en meerprijzen, toevoegen/verwijderen, aantallen, btw/totaal, desktop en mobiel, navigatie en foutmeldingen. Lokale bewijsbestanden staan onder artifacts/ecwid-live-final en worden niet naar GitHub gepubliceerd.

## Eerstvolgende stappen voor verkoop

Mollie koppelen in Ecwid; gewenste betaal- en verzendmethoden controleren; volledige proefbestelling uitvoeren met succes/annulering/fout, btw/verzending, personalisatie, ordervastlegging en ontvangst van bestelbevestiging. Daarna betalingsmelding en indexeringsstatus afzonderlijk vrijgeven. De huidige build houdt de betalingsmelding bewust op niet beschikbaar; pas dit na die controle aan.

Fleur moet tevens de eerder gevonden productinstellingen bevestigen: limieten voor letters, gegevens van een tweede touw, gewenste letterkleuren en de ontbrekende keuze zonder hartje bij Poppy. Native opties en toeslagen werken; dit vervangt geen inhoudelijke verkoopregels. Zie ECWID-QUICKFIX-TESTVERSLAG.md.
