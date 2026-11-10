# Instagram via Elfsight

Widget-ID uit de aanvullende briefing: `bed9e533-8a25-4d8f-a57c-b2991f07c3b9`.

De homepage bevat de gevraagde titel, introductie, Instagram-link en toestemming voor externe inhoud. Het officiële script `https://elfsightcdn.com/platform.js` en de officiële widgetklasse staan in `public/embeds/instagram.html`.

De Next.js-component maakt pas na toestemming een lazy iframe met deze inhoud. De iframe laadt het script pas na een gecontroleerd bericht van de eigen bovenliggende pagina. Ook het direct openen van de embed-URL laadt daardoor niet automatisch Elfsight. Er is per iframe één scriptinstantie. Hoogteberichten worden alleen geaccepteerd van die iframe en dezelfde origin.

Intrekken via de feedknop of het **bloemetje linksonder** of **Cookievoorkeuren** in de footer verwijdert de hele iframe, inclusief de lopende widgetcode. De pagina hoeft niet te herladen en een eventueel ongeschreven contactbericht raakt daardoor niet verloren. Al geplaatste externe cookies worden niet automatisch gewist; de bezoeker kan die via de browser verwijderen.

Alleen de voorkeur en het keuzemoment worden maximaal 180 dagen lokaal onthouden onder `julie-fleur.external-media.v1`. Zonder toestemming of bij een fout blijft de gewone link naar [@juliefleur.nl](https://www.instagram.com/juliefleur.nl/) beschikbaar. Als laden mislukt of niet tijdig wordt bevestigd, verschijnt een nette fallback.

## Controleren in het eigen Elfsight-account

- De Instagrambron is nog verbonden en de widget is gepubliceerd.
- Het abonnement, weergavequotum en eventuele domeinbeperkingen staan deze site toe.
- Lay-out, kleuren, aantal berichten en mobiele weergave van de bestaande widget zijn correct.
- Controleer de uiteindelijke host en cookie-/netwerkverzoeken vóór publieke opening. Het beleid blijft een concept tot de hele verwerking is vastgesteld.

Voor het plaatsen van de aangeleverde openbare widgetcode is geen API-sleutel in deze website nodig. Er is geen fictieve feed of eigen kopie van Instagramberichten toegevoegd.

## Uitgevoerde browsercontrole

De widget is lokaal daadwerkelijk geladen op 390 en 1440 pixels breed. Na toestemming verschenen het echte profiel en echte berichten van @juliefleur.nl. In de geladen iframe stond precies één `elfsightcdn.com/platform.js`-script. Vóór toestemming was er geen iframe of Elfsight-script in de hoofdpagina; na intrekken was het aantal iframes weer nul. Ook opnieuw toestaan via Cookievoorkeuren is gecontroleerd. Er waren geen consolefouten of -waarschuwingen. De daadwerkelijke publieke domein-/accountcontrole blijft onderdeel van de oplevering zodra dat domein actief is.

Primaire bronnen: [Elfsight officiële installatiecode](https://help.elfsight.com/article/1633-adding-elfsight-widget-to-framer-website), [Elfsight privacybeleid](https://elfsight.com/privacy-policy/).

## Cookiebloem — 31 oktober 2026

Bij een ontbrekende of verlopen keuze verschijnt automatisch een pop-up in bloemvorm. Beide keuzes zijn rechtstreeks en even zichtbaar: Alleen noodzakelijk / Ook Instagram toestaan. De tweede keuze activeert de echte feed direct; bij een volgend bezoek blijft die keuze gelden. Het vaste bloemetje opent de voorkeuren op iedere pagina. Sluiten of Escape geeft geen toestemming. Het cookiebeleid is bereikbaar in de pop-up en via de footer; het wordt niet afgedekt bij rechtstreeks bezoek.

Op 320, 390 en 1280 pixels breed gecontroleerd. Echte feedberichten verschenen op mobiel en desktop; één platformscript in de iframe. Intrekken verwijderde de iframe direct. Weigeren bleef na herladen behouden; vóór toestemming werd geen iframe geladen. Zie `COOKIES.md` voor de opslag- en UI-afspraken.
