# Contactformulier — koppeling en activering

## Vercel-preview — SMTP via de bestaande mailbox

Op verzoek van de eigenaar is op 4 november 2026 de Node.js-functie `api/contact.ts` aangesloten op `server/contact-smtp.ts`, met Nodemailer en de bestaande mailbox bij mijn.host. De Cloudflare-code hieronder blijft bewaard en is niet de verzendroute van Vercel.

Alleen de volgende **server-side Preview-variabelen** zijn nodig. Vul ze nooit in een `NEXT_PUBLIC_*`-variabele of een Git-bestand in.

| Variabele | Preview-waarde |
| --- | --- |
| `CONTACT_SMTP_HOST` | `mail.juliefleur.nl` |
| `CONTACT_SMTP_PORT` | `465` |
| `CONTACT_SMTP_USER` | `info@juliefleur.nl` |
| `CONTACT_SMTP_PASSWORD` | Bestaand mailboxwachtwoord, geheim in Vercel |
| `CONTACT_ENABLED` | `true`, uitsluitend voor de beveiligde Preview-test |

De host is op 4 november bereikbaar bevonden op 465 met een geldig TLS-certificaat en SMTP-banner van `h71.mijn.host`. Er zijn geen DNS- of mailboxwijzigingen uitgevoerd. [mijn.host SMTP-instellingen](https://mijn.host/kb/email/standaard-email-poorten-voor-imap-pop-smtp), [Nodemailer SMTP](https://nodemailer.com/smtp), [vertrouwde Vercel-requestheaders](https://vercel.com/docs/headers/request-headers).

**Productie blijft uit.** De nieuwe adapter vereist in productie bovendien `CONTACT_DELIVERY_VERIFIED=true`; deze waarde wordt pas na een echte bevestigde ontvangsttest en afzonderlijke publicatiegoedkeuring gezet. Er is tijdens de voorbereiding nog geen geslaagde ontvangsttest. Een configuratie- of mocktest bewijst geen ontvangst.

De functie accepteert alleen JSON vanaf dezelfde origin, begrenst de invoergrootte, hergebruikt de bestaande veldvalidatie en controleert honeypot, formulierleeftijd en een UUID. De bezoeker kan ontvanger, afzender of bijlagen niet instellen. Afzender en ontvanger zijn vast `info@juliefleur.nl`; het bezoekersadres wordt Reply-To. TLS en certificaatcontrole zijn verplicht. Er worden geen mailboxwachtwoorden of berichtinhouden gelogd.

Er zijn tijdelijke spamlimieten (5 per IP per 15 minuten, 3 per e-mailadres per uur en 40 per uur) en dubbelklikbeveiliging **per warme functie-instantie**. Alleen gehashte kenmerken, tellers en uitkomsten blijven tijdelijk in geheugen. Deze tellers zijn niet gedeeld tussen Vercel-instanties; SMTP biedt geen globale idempotentiesleutel. Bij onzekere verzending blijft de tekst staan en wordt geen succes geclaimd. Voor publieke activering moeten de echte bezorgtest en de inrichting van platformbrede spamlimieten worden beoordeeld.

Na wijziging van Preview-variabelen is een nieuwe Preview-deployment nodig. Test via `/contact/` een herkenbaar bericht naar de eigen mailbox, controleer daar alle velden en Reply-To en leg de uitkomst zonder klantgegevens vast. `npm run check:contact-smtp` simuleert serverreacties; `npm run check:contact` controleert de bewaarde Cloudflare-code.

## Bewaarde Cloudflare-oplossing

Status op 30 oktober 2026: het formulier, het serverendpoint en de beveiliging zijn geïmplementeerd. Er zijn **geen mailprovider- of beveiligingssleutels aangeleverd**. Echte mailbezorging is daarom nog niet getest en de knop blijft uitgeschakeld. Rechtstreeks mailen naar het door Fleur opgegeven `info@juliefleur.nl` is wel beschikbaar.

## Opzet

De bestaande Next.js-app genereert de pagina’s. Een kleine Cloudflare Worker bedient op dezelfde origin `/api/contact`. De statische bestanden blijven als assets beschikbaar. Er is geen nieuwe webshopbackend en er is geen database met contactberichten.

- `GET /api/contact` geeft alleen `{ "ready": false }` of `{ "ready": true }`, zonder sleutels of configuratiedetails.
- `POST /api/contact` valideert naam, e-mailadres, onderwerp en bericht, controleert herkomst, grootte, honeypot en formulierleeftijd, en past gedeelde spamlimieten toe.
- Resend verstuurt een tekstmail vanaf een geverifieerde afzender naar **uitsluitend info@juliefleur.nl**. Het bezoekersadres wordt `reply_to`; de bezoeker bepaalt nooit ontvanger of afzender.
- De UI bevestigt pas succes na een succesvolle providerrespons met bericht-ID. Bij een fout blijft de invoer staan. Een herhaalde poging met dezelfde inhoud gebruikt hetzelfde berichtkenmerk en dezelfde Resend-idempotentiesleutel.
- Een succesvolle API-respons betekent dat de maildienst de mail heeft aangenomen. Controle in de echte mailbox en op bezorg-/bounce-events blijft onderdeel van de acceptatietest.

## Wat Fleur / Studio FROU moet instellen

1. Maak een eigen Resend-account aan en voeg een eigen verzenddomein of subdomein toe. Bijvoorbeeld een apart subdomein voor websiteberichten; dit is nog geen geverifieerde afzender.
2. Neem de door Resend getoonde DNS-records exact over bij de DNS-beheerder. Wacht totdat het verzenddomein geverifieerd is. DNS-waarden zijn accountafhankelijk en worden hier niet verzonnen. Bestaande mailbox-/ontvangstinstellingen van `info@juliefleur.nl` moeten blijven kloppen.
3. Kies een afzender op dat geverifieerde domein, bijvoorbeeld `Julie Fleur <website@jouw-geverifieerde-domein>`. Gebruik het bezoekersadres nooit als `From`.
4. Maak een Resend API-sleutel met de benodigde verzendrechten. Zet open- en kliktracking voor deze contactmails niet onnodig aan.
5. Maak een eigen Upstash Redis-instantie aan voor gedeelde beveiligingstellers. Kies passende regio en verwerkersafspraken. Gebruik de HTTPS REST URL en een schrijftoken dat de benodigde Redis-commando’s toestaat (`EVAL`, `GET`, `INCR`, `EXPIRE`, `TTL`). Dit is geen berichtenarchief.
6. Genereer een eigen willekeurige salt van minimaal 32 tekens, bijvoorbeeld lokaal met `openssl rand -hex 32`. Plaats sleutels alleen als server-side runtime secrets, niet in chat, Git of een `NEXT_PUBLIC_*`-variabele.
7. Vul onderstaande runtime-variabelen in. Zet `CONTACT_ENABLED` eerst alleen op de besloten beoordelingsversie aan voor de echte test. Publiceer na een runtimewijziging opnieuw zodat de omgeving actief wordt.

| Naam | Waarde | Geheim |
| --- | --- | --- |
| `CONTACT_ENABLED` | `false`; voor de echte besloten test en na goedkeuring `true` | Nee |
| `RESEND_API_KEY` | Eigen Resend-verzendsleutel | Ja |
| `CONTACT_FROM` | Geverifieerde afzender, eventueel met `Julie Fleur <…>` | Nee |
| `CONTACT_RATE_LIMIT_SALT` | Eigen willekeurige waarde, minimaal 32 tekens | Ja |
| `UPSTASH_REDIS_REST_URL` | `https://…upstash.io` van eigen instantie | Nee |
| `UPSTASH_REDIS_REST_TOKEN` | Eigen REST schrijftoken | Ja |

Op Sites horen deze waarden in de productie-runtimeconfiguratie. Lokaal: kopieer `.dev.vars.example` naar de genegeerde `.dev.vars` en start `npm run preview`. Next.js publieke bouwconfiguratie blijft apart in `.env.local`.

## Grenzen en privacy

- Per IP maximaal 5 pogingen per 15 minuten, per genormaliseerd e-mailadres maximaal 3 per uur, globaal maximaal 60 per uur. De gedeelde limieten werken over meerdere Worker-instanties heen via één atomair Redis-script.
- De beveiligingsopslag bevat HMAC-kenmerken en tellers met TTL, geen rauw e-mailadres, IP-adres of berichtinhoud. Deze kenmerken zijn pseudoniemen en horen wel in de privacybeoordeling. Tellers vervallen na maximaal één uur.
- Als de limiter of maildienst niet bereikbaar is, wordt verzending niet als geslaagd getoond. Er is geen verborgen wachtrij met berichten. De tekst blijft in de browser staan, uitsluitend in geheugen.
- De Worker vertrouwt de door Cloudflare beheerde `CF-Connecting-IP`-header. Bij een andere host moet een passende, vertrouwde client-IP-adapter worden ingericht; een willekeurige door de bezoeker opgegeven forward-header is niet toegestaan.
- Provider-/mailboxbewaartermijnen, ontvangers, grondslag, internationale doorgiften en verwerkersafspraken moeten vóór publieke activering worden vastgesteld. Het zichtbare privacybeleid blijft een concept.

## Acceptatietest vóór publieke activering

- [ ] `GET /api/contact` toont pas `ready: true` met de volledige inrichting en expliciete activering.
- [ ] Verzend een herkenbaar testbericht via de besloten contactpagina en controleer daadwerkelijke ontvangst op `info@juliefleur.nl`, inclusief onderwerp en alle vier velden.
- [ ] Antwoord op de ontvangen mail en controleer dat het antwoord naar het ingevoerde bezoekersadres gaat.
- [ ] Controleer bezorging en eventuele bounce-events in Resend. Leg de ontvangen test vast zonder klantgegevens in Git te zetten.
- [ ] Test vereiste velden, ongeldig e-mailadres, te lange invoer en onjuiste herkomst.
- [ ] Test rate limiting in de echte Redis-inrichting, providerstoring en herstel. Bij fouten blijft de tekst staan en verschijnt geen succesmelding.
- [ ] Controleer dat opnieuw proberen geen dubbele mail oplevert binnen de idempotentieperiode van Resend.
- [ ] Controleer mailboxbereikbaarheid, providerquota, verwerkersafspraken en definitieve privacy-informatie.

Geautomatiseerd getest: 22 scenario’s met gesimuleerde providerantwoorden. Dit zijn geen echte verzend- of bezorgtests.

Primaire bronnen, gecontroleerd op 30 oktober 2026: [Resend Send Email](https://resend.com/docs/api-reference/emails/send-email), [geverifieerde domeinen](https://resend.com/docs/dashboard/domains/introduction), [idempotentiesleutels](https://resend.com/docs/dashboard/emails/idempotency-keys), [Upstash REST API](https://upstash.com/docs/redis/features/restapi), [Cloudflare assets-binding](https://developers.cloudflare.com/workers/static-assets/binding/).
