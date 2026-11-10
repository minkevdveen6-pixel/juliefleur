# Julie Fleur — verfijning en nieuwe fotografie, 4 november 2026

## Uitgevoerd

- Bestaande header, logo, navigatie, kleuren en compacte typografie behouden. Drie hoofdcollecties met vierkante foto’s en kleine olijfgroene actieknoppen. Borduren en Vilten kroon toegevoegd als twee kleinere categorie-ingangen.
- Negen nieuw aangeleverde JPG’s zonder generatieve bewerking verwerkt in 27 responsieve WebP-varianten (480/960/1440 px). Originele bestanden byte voor byte bewaard in de genegeerde originele-assetsmap. Productdetailfoto’s en aanvullende foto’s gebruiken contain-weergave en kunnen groter worden geopend.
- Categoriebeeld sieraden: ketting met F. Bagcharms: roze/lila met hartjes. Punniken: groene naam. Borduren: naamgeborduurde mutsen. Vilten kroon: roze/lila kroon met cijfers.
- Productfoto’s: Bar Bracelet de gegraveerde armbandjes, extra beeld met armbandje Fleur; persoonlijke bagcharm beige/bruin met extra roze/lila voorbeeld; Poppy de nieuwe naamkettingen; losse punniknaam het groene voorbeeld. Kettingfoto’s worden niet aan andersoortige armbanden gekoppeld.
- Bestsellers blijft een compacte redactionele selectie: Bar Bracelet, persoonlijke bagcharm, Poppy necklace en punniknaam op rieten tasje. Alleen foto, naam en vanafprijs; groen Bekijk alles leidt naar de volledige catalogus.
- Roze Over Fleur behouden met hetzelfde korte tekstfragment. Portret volledig zichtbaar en groter; het bestaande logo staat apart naast het portret, zonder overlap. De al in de aangeleverde foto opgenomen letters worden niet generatief gereconstrueerd. Het volledige verhaal blijft op Over Fleur staan.
- Instagram-sectie, feedcomponent, iframe-document en Elfsight-script verwijderd. Gewone contactlinks naar Instagram blijven staan. Cookievenster, openen/sluiten, onthouden van voorkeuren en bestaande opslagcompatibiliteit behouden; geen niet-bestaande optionele feed aangeboden. Privacy- en cookiepagina aangepast aan de feitelijke situatie.
- Sorteerlabel en veld met duidelijke eigen tussenruimte. Prijs- en naamsortering omvat ook producten zonder foto; bij een gekozen sortering worden alle producten in één geordende compacte lijst getoond. De standaardweergave behoudt het productraster en de overige producten. Eén product toont geen overbodig sorteerveld.

## Grenzen

Ecwid, bestellen, betalen en contactverzending blijven uitgeschakeld. Mutsen en kroon blijven in voorbereiding zolang productgegevens en prijzen ontbreken. Geen prijzen, voorraad of opties verzonnen. DNS, mijn.host, liveproductie en abonnementen worden niet gewijzigd. De gebruiker heeft uitdrukkelijk gevraagd nog niet live te publiceren; uitsluitend Preview is toegestaan.

## Controles en preview

- Productiebuild met Node.js 22.23.4 / Next.js 16.4.3 en ESLint: geslaagd.
- Exportcontrole: 39 HTML-bestanden, alle lokale links en assets, h1, HTTPS-canonicals, noindex en robots geslaagd. De verwijderde Instagram-embed verklaart één HTML-bestand minder.
- Alle negen oorspronkelijke bestanden identiek gearchiveerd en alle 27 responsieve varianten aanwezig; ieder nieuw beeld is daadwerkelijk gekoppeld. Fleurs volledige verhaal is ongewijzigd.
- Homepage op 320/374/390/768/1440 pixels gecontroleerd: vierkante beeldvakken, passende knoppen, geen horizontale overloop. Nog dertien betrokken routes op mobiel én desktop gecontroleerd; samen 31 route/formaat-metingen zonder gevonden overloop, gebroken geladen afbeeldingen of iframe.
- Sorteren op prijs oplopend/aflopend en naam A–Z gecontroleerd voor alle zestien producten; onbekende prijs blijft onderaan de prijsvolgorde. Standaard herstelt het raster. Ook gesorteerde weergave op 320 pixels zonder overloop.
- Borduren-ingang daadwerkelijk aangeklikt; nieuwe mutsenfoto op de juiste pagina. Extra Bar-foto verwijst naar het nieuwe armbandje Fleur. Productdetailfoto gebruikt contain-weergave.
- Cookievenster op mobiel circa 358 × 401 pixels binnen beeld; Alleen noodzakelijk sluit het venster en blijft na herladen bewaard. Geen iframe of Elfsight-script aanwezig. Contactknop blijft uit; GET /api/contact geeft 200 met ready:false. Geen e-mail of betaling verzonden.
- Geschoonde bron gecontroleerd: 139 bestanden, geen .env of secrets. git diff --check geslaagd.
- Preview READY: https://instagram-julie-fleur-onyvm0kpp-minkevdveen-s-projects.vercel.app
- Deployment dpl_Bz7Liov1rKMFohVELoTTWztirTss binnen het bestaande project. Actieve productie en beide domeinen via Vercel-API ongewijzigd bevestigd. Geen productiepublicatie uitgevoerd.

De eerder geblokkeerde GitHub-koppeling is niet gewijzigd; dit is een gecontroleerde bronupload naar Preview in het bestaande Vercel-project. Geen end-to-end Ecwid-checkout of echte mailontvangst geclaimd.
