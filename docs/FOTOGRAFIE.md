# Originele fotografie

Op 31 oktober 2026 zijn de acht aangeleverde clipboard-PNG’s geïntegreerd. De eerder genoemde IMG_….jpeg-bestandsnamen zijn niet bevestigd; er is geen fictieve koppeling met die namen gemaakt. De PNG’s zijn byte voor byte bewaard in `assets/originals/` (lokaal, niet in Git). De geoptimaliseerde WebP-bestanden staan wel in de bronrepository.

## Beeldtoewijzing

| Bestand | Plaatsing |
| --- | --- |
| letterkettingen-jim-joe.png | Poppy necklace |
| punnikmand-neeke.png | Punniknaam op mand, als voorbeeld; geen nieuw mandmodel of prijs toegevoegd |
| losse-punniknaam-lenne.png | Losse punniknaam, ook in de homepagekeuze |
| rieten-tasje-olivia.png | Homepagehero en punniknaam op rieten tasje |
| bagcharm-smile-love.png | Bagcharms en persoonlijke bagcharm |
| sieraden-blauwe-kralen-initiaal.png | Sieradenbeeldverhaal; geen onbevestigde productmodelkoppeling |
| sieraden-kralen-kleuren.png | Sieraden-collectietegel en beeldverhaal; geen onbevestigde productmodelkoppeling |
| fleur-portret-2026-11.png | Homepageverhaal en Over Fleur |
| rieten-tas-groene-punniknaam.png | Punniken-collectie |

Alle beelden hebben feitelijke alt-teksten. Het zichtbare materiaal leidt niet tot claims over samenstelling of nieuwe productopties. Het portret van Fleur is inmiddels aangeleverd en geïntegreerd. Foto’s van de overige producten ontbreken nog. Borduren en Vilten kroon behouden hun voorbereidingsstatus.

## Verwerking en vervanging

```bash
npm run prepare:photos
# of:
npm run prepare:photos -- '/absolute/map/met/originelen'
```

De verwerking corrigeert EXIF-oriëntatie, converteert naar sRGB, verwijdert metadata en maakt WebP-varianten van maximaal 480, 960 en 1440 pixels breed, zonder opschalen. De acht productbronnen zijn 1320 pixels breed; het nieuwe portret is 1024 × 1536 pixels. Er wordt niets aan de beeldinhoud toegevoegd of weggehaald. Screenshotmarkeringen in enkele bronnen zijn behouden; schone originele camerabestanden kunnen later op dezelfde plaatsen worden ingevuld.

Alle toewijzing staat in `src/data/photography.json`: `slots`, `products`, `approvedImages` en herkomst onder `sources`. Hero, productdetails en editorial beelden volgen de natuurlijke verhouding; productbeeldvakken gebruiken `contain`, zodat de foto volledig zichtbaar blijft. De drie homepagecollecties hebben even grote beeldvakken in 4:5 met `cover`; de belangrijke productdetails blijven in beeld. Het portret gebruikt de bestaande 2:3-beeldvakken, passend bij de verhouding van de nieuwe bronfoto. De bronfoto, persoon, kleuren en belichting zijn niet geretoucheerd. Responsive `srcset`, expliciete afmetingen, lazy loading en prioriteit voor de hero zijn ingesteld. Nieuwe foto’s verschijnen pas na verwerking en een goedgekeurde alt-tekst.

De grootste acht WebP’s zijn samen 1.548.112 bytes tegenover 17.999.480 bytes voor de PNG-bronnen: circa 91% kleiner. De acht 480px-varianten zijn samen 320.116 bytes. Dit zijn bestandsgroottes, geen gemeten paginalaadsnelheid.

De homepage gebruikt elke foto maximaal eenmaal. Een collectieheader wordt overgeslagen als die foto al bij een product of het beeldverhaal staat. Een productfoto kan op verschillende pagina’s naar hetzelfde product verwijzen.

## Herkomst

- `letterkettingen-jim-joe.png` ← `codex-clipboard-e5159b78-025a-4a18-aa4a-40a4e87e8a66.png`
- `punnikmand-neeke.png` ← `codex-clipboard-498aa813-0454-46ea-9326-f131c43856f5.png`
- `losse-punniknaam-lenne.png` ← `codex-clipboard-fb173efa-16ec-4915-a798-a6c2f87ee7ff.png`
- `rieten-tasje-olivia.png` ← `codex-clipboard-47cc3610-1f57-4987-b954-c8791a376163.png`
- `bagcharm-smile-love.png` ← `codex-clipboard-2313869b-9b48-4aec-a730-f2a659b3c4aa.png`
- `sieraden-blauwe-kralen-initiaal.png` ← `codex-clipboard-2e005078-4d77-488b-920c-adb1b71780d0.png`
- `sieraden-kralen-kleuren.png` ← `codex-clipboard-cb6fdcbf-27fd-458d-bd0a-d199e68c7ea5.png`
- `rieten-tas-groene-punniknaam.png` ← `codex-clipboard-6a4db200-6685-47d7-b766-24aedaa87255.png`

- `fleur-portret-2026-11.png` ← `CCC3558F-40EA-4CA2-8CAD-627D3AEE74CC.PNG` (vervangen op 2 november 2026; oude bron lokaal behouden).

## Nieuw portret — 2 november 2026

De aangeleverde PNG vervangt het eerdere portret op de homepage en Over Fleur via hetzelfde centrale portretslot. De oorspronkelijke PNG is ongewijzigd lokaal bewaard. WebP-varianten van 480, 960 en 1024 pixels breed worden zonder opschalen gegenereerd. De bestaande beeldvakken en de bronfoto hebben beide verhouding 2:3, waardoor gezicht, haar en handen volledig in beeld blijven. Kleuren, belichting en gezichtskenmerken zijn niet aangepast. De rest van het ontwerp is ongewijzigd.
