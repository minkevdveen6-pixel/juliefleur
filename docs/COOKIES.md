# Cookiebloem en Instagram

De cookiekeuze is gebouwd in de bestaande Site. De eerste keuze verschijnt automatisch, met een native modale dialoog in een roze bloemvorm. Op korte schermen gebruikt de dialoog een scrollbaar paneel zodat alle bediening bereikbaar blijft. Het bloemetje linksonder en de footerknop openen dezelfde dialoog.

## Gedrag

- Geen geldige keuze: popup bij het eerste laden, Instagram uit. De beleidspagina’s zijn direct leesbaar.
- Alleen noodzakelijk: popup dicht, geen Instagram-iframe, keuze onthouden.
- Ook Instagram toestaan: popup dicht, echte Elfsight-feed actief zodra die in beeld komt.
- Intrekken: iframe en actieve widgetcode direct verwijderd. Eerder door derden geplaatste cookies worden niet vanuit deze website gewist.
- Sluiten/Escape: geen nieuwe keuze, bestaande toestemming blijft ongewijzigd. Focus keert terug naar de opener.
- Bewaring: `julie-fleur.external-media.v1` in localStorage met `{allowed, time}`, maximaal 180 dagen. Een ontbrekend, ongeldig, verlopen of toekomstig record geldt als onbekend. Bij geblokkeerde opslag werkt de keuze tijdelijk in geheugen.
- Opslagwijzigingen in andere tabbladen worden verwerkt. De mediavoorkeur staat los van de aanmelding voor de private Site.

## Bronnen

De gelijkwaardige knoppen en vaste mogelijkheid tot intrekken sluiten aan op de [uitleg van de Autoriteit Persoonsgegevens](https://autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-en-misleidende-cookiebanners). Het beleid verwijst rechtstreeks naar het [privacybeleid van Elfsight](https://elfsight.com/privacy-policy/), dat onder meer de cookie `elfsight_viewed_recently` en technische verzoekgegevens beschrijft. De bewaartermijn van die externe cookie is niet verzonnen of gelijkgesteld aan onze eigen voorkeuropslag.

## Verificatie

Dertien controles van toestaan, weigeren, vervallen/toekomstige/ongeldige records en geblokkeerde opslag zijn geslaagd. Browsercontrole: eerste popup, geen iframe vóór toestemming, weigeren/herladen, openen via het bloemetje, echte feed op mobiel en desktop, één platformscript, intrekken, Escape/focusherstel en navigatie naar het cookiebeleid. Beeldmaten 320 × 760, 390 × 844 en 1280 × 720; geen pagina-overloop of consolefouten/-waarschuwingen waargenomen.

De bestaande Elfsight-widget en Site-toegang zijn behouden. De toekomstige publieke hosting-/winkelinrichting vraagt opnieuw een controle van de daadwerkelijk gebruikte externe diensten en cookies.
