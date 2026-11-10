# Julie Fleur — homepage boutique-redesign, 4 november 2026

## Wijzigingen

Uitsluitend de homepage is herontworpen. De roze header, het originele gecentreerde logo, de navigatie, footer, cookiefunctionaliteit, binnenpagina-componenten, productgegevens en hostinginstellingen zijn niet gewijzigd ten opzichte van de vorige preview. De nieuwe vormgeving staat in een CSS-module die alleen op de homepage wordt gebruikt.

Volgorde: compacte crème hero met de aangeleverde headline Kleine dingen. Groot plezier., één korte zin, de nieuwe foto van de gegraveerde armbandjes en een collectielink; editorial presentatie van de drie hoofdcollecties; kleinere Borduren/Vilten kroon-presentatie; vier bestsellers op desktop/twee op mobiel; roze persoonlijke sectie met de vrijstaande originele foto en het bestaande logo; bestaande footer. De dominante gevulde groene knoppen en grijze productkaders zijn van de homepage verdwenen. Groen wordt alleen in tekstlinks en pijltjes gebruikt. Er zijn geen extra secties, nieuwe producten, prijzen, claims of externe widgets toegevoegd.

## Portret zonder beeldgeneratie

Bron: de eerder aangeleverde originele donkere foto c05ec35c-70ed-47d4-afc5-e05d6fa50456.JPG, lokaal intact bewaard. De logoachtergrondversie is niet gebruikt als bron. De achtergrond is verwijderd met lokale Apple Vision-segmentatiemaskers en een transparantiekanaal; er worden geen nieuwe RGB-pixels van gezicht, haar, handen of kleding gegenereerd. De stoel blijft waar deze de oorspronkelijke persoon overlapt, zodat geen ontbrekende lichaamsdelen of kleding gereconstrueerd hoeven te worden.

Het PNG-masterbestand kopieert alle oorspronkelijke RGB-waarden exact en wijzigt alleen alpha. Volledig ondoorzichtige pixels van de lossless WebP-versie van 1066 pixels zijn met de bron vergeleken: nul RGB-verschillen. Varianten van 400 en 800 pixels zijn normaal verkleind en hoogwaardig gecomprimeerd, met verliesloze alpha en behoud van verhoudingen. De uitsnede is gecontroleerd tegen de roze achtergrond; witte randen en tekst/logo achter Fleur zijn verwijderd. De foto gebruikt contain-weergave, zodat handen en verhoudingen intact blijven. De foto op de afzonderlijke Over Fleur-pagina is niet gewijzigd.

Lokale bron/maskers/PNG-master en verificatie staan in de genegeerde map artifacts/revision. Website-assets: public/images/portraits/fleur-cutout-400.webp, -800.webp en -1066.webp. Er is geen generatieve beeldservice gebruikt.

## Publicatie en controle

Alleen Preview in het bestaande Vercel-project instagram-julie-fleur is toegestaan. Liveproductie, domeinen, DNS, mijn.host, Ecwid, betalingen en contactverzending blijven ongewijzigd. De beoordelingsstatus en noindex blijven actief.

- Build Next.js 16.4.3 onder Node.js 22.23.4: geslaagd. ESLint en git diff --check: geslaagd.
- 39 geëxporteerde HTML-bestanden gecontroleerd op lokale links/assets, h1, HTTPS-canonicals, noindex en robots: geslaagd.
- Homepage op 320, 374, 390, 768, 1440 en 1920 CSS-pixels gecontroleerd. Geen horizontale overloop. Vier bestsellerkolommen vanaf tablet/desktop en twee op mobiel. Alle vier fotovakken hebben een transparante achtergrond; de portretfoto gebruikt contain.
- Hero circa 330–350 px hoog op tablet/desktop en 339–398 px op mobiel. Geen enorme mobiele hero. Koptekst 26/28 px mobiel, 32/38 px tablet/desktop.
- Contrasten: olijfgroen op roze 4,59:1; bordeaux op roze 5,27:1; olijfgroen op hero-crème 5,64:1; bordeaux op warm wit 7,10:1.
- Werkelijk doorgeklikt: collectielink, hero-productfoto, Bagcharms, Borduren, bestseller Poppy en Lees mijn verhaal. Alle zes bereiken de juiste bestaande pagina.
- Transparante foto: nul gewijzigde RGB-waarden in volledig ondoorzichtige pixels van de volledige lossless variant. De kleinere webvarianten wegen circa 35 en 89 KB, met verliesloze alpha. Het oorspronkelijke portret en de PNG-master blijven lokaal bewaard.
- Afzonderlijke controle: gedeelde componenten, globale CSS, gegevens en configuratie zijn byte voor byte ongewijzigd ten opzichte van de vorige preview. Er zijn geen nieuwe dependencies of diensten toegevoegd.
- Publicatiebron: 144 gecontroleerde bestanden zonder .env, secrets, lokale originele beelden of hostingidentiteit.
- Preview READY: https://instagram-julie-fleur-ogkxvbqva-minkevdveen-s-projects.vercel.app
- Deployment dpl_85peVTP6UsJLFhZtFqi7MNy2yTtR, bestaand project prj_iMisnENQeNTSIk1u4H56irPUoPwQ. Liveproductie en beide domeinen ongewijzigd bevestigd via Vercel-API. Geen productiepublicatie of DNS-wijziging.

De eerder geblokkeerde GitHub-koppeling is niet gewijzigd; deze preview is een gecontroleerde bronupload in het bestaande Vercel-project. Er is geen checkout, betaling of echte mailontvangst getest of geactiveerd.

De vier bestsellerproducten blijven dezelfde. Alleen op de homepage toont Bar Bracelet de aanvullende foto met het armbandje Fleur, zodat het hero- en productbeeld niet worden herhaald. De productpagina en catalogusgegevens zijn niet gewijzigd.


## Gerichte hero-correctie

De hero gebruikt dezelfde maximale breedte van 1080 px en dezelfde responsieve zijmarges als het collectieoverzicht. De rechterrand van de foto sluit exact aan. De titel is “Persoonlijk & handgemaakt.” met de aangeleverde ondertekst en de bestaande collectielink. Alleen de twee homepagebestanden zijn gewijzigd.

Gecontroleerd op 320, 374, 390, 768, 1440 en 1920 CSS-pixels: geen horizontale overflow; verschil tussen de rechterrand van de hero-afbeelding en het collectieoverzicht kleiner dan 0,001 px. Build op Node.js 22, lint en exportcontrole geslaagd. Uitsluitend preview; productie blijft ongewijzigd.
