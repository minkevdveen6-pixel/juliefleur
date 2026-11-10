import { createSmtpContactHandler, type SmtpContactEnv } from "../server/contact-smtp.ts";

// Losse Node.js-functie naast de statische Next.js-export. Cloudflare blijft intact.
// Alleen Preview mag vóór de echte ontvangsttest worden geactiveerd.
const handleContact = createSmtpContactHandler();
export const maxDuration = 30;
const contact = {
  fetch(request: Request): Promise<Response> {
    return handleContact(request, process.env as SmtpContactEnv);
  },
};
export default contact;
