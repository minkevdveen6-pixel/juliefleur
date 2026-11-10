import { createHash, randomBytes } from "node:crypto";
import { isIP } from "node:net";
import nodemailer from "nodemailer";
import { validateContact, type ContactFields } from "../src/lib/contact-validation.ts";

export type SmtpContactEnv = {
  CONTACT_ENABLED?: string;
  CONTACT_DELIVERY_VERIFIED?: string;
  CONTACT_SMTP_HOST?: string;
  CONTACT_SMTP_PORT?: string;
  CONTACT_SMTP_USER?: string;
  CONTACT_SMTP_PASSWORD?: string;
  VERCEL?: string;
  VERCEL_ENV?: string;
};
const destination = "info@juliefleur.nl";
const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const reply = (status: number, body: unknown, extra: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });

export function smtpContactConfigured(env: SmtpContactEnv) {
  const allowedStage = env.VERCEL_ENV === "preview" || (env.VERCEL_ENV === "production" && env.CONTACT_DELIVERY_VERIFIED === "true");
  return env.VERCEL === "1" && allowedStage && env.CONTACT_ENABLED === "true" &&
    Boolean(env.CONTACT_SMTP_HOST && /^(?:mail\.juliefleur\.nl|[a-z0-9-]+\.mijn\.host)$/i.test(env.CONTACT_SMTP_HOST) &&
      ["465", "587"].includes(env.CONTACT_SMTP_PORT || "") && env.CONTACT_SMTP_USER === destination && env.CONTACT_SMTP_PASSWORD);
}

type ContactMessage = { fields: ContactFields; reference: string };
type SendMail = (env: SmtpContactEnv, message: ContactMessage) => Promise<boolean>;
export function contactMail({ fields, reference }: ContactMessage) {
  return {
    from: { name: "Julie Fleur website", address: destination },
    to: destination,
    replyTo: { name: fields.name, address: fields.email },
    subject: `Julie Fleur · ${fields.subject}`,
    messageId: `<${reference}@juliefleur.nl>`,
    text: `Nieuw contactbericht via Julie Fleur\n\nNaam: ${fields.name}\nE-mailadres: ${fields.email}\nOnderwerp: ${fields.subject}\n\nBericht:\n${fields.message}\n\nKenmerk: ${reference}`,
    disableFileAccess: true, disableUrlAccess: true,
  };
}
async function sendViaSmtp(env: SmtpContactEnv, { fields, reference }: ContactMessage): Promise<boolean> {
  const transport = nodemailer.createTransport({
    host: env.CONTACT_SMTP_HOST,
    port: Number(env.CONTACT_SMTP_PORT),
    secure: env.CONTACT_SMTP_PORT === "465",
    requireTLS: true,
    auth: { user: env.CONTACT_SMTP_USER, pass: env.CONTACT_SMTP_PASSWORD },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectionTimeout: 7000, greetingTimeout: 5000, socketTimeout: 10000,
    disableFileAccess: true, disableUrlAccess: true,
    logger: false, debug: false,
  });
  try {
    const result = await transport.sendMail(contactMail({ fields, reference }));
    return result.accepted.some(address => String(address).toLowerCase() === destination) && result.rejected.length === 0;
  } finally {
    transport.close();
  }
}

async function readPayload(request: Request) {
  const limit = 32 * 1024;
  if (Number(request.headers.get("content-length") || 0) > limit) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

export function createSmtpContactHandler({ sendMail = sendViaSmtp, now = Date.now }: { sendMail?: SendMail; now?: () => number } = {}) {
  // Tijdelijke tellers en dubbelklikbeveiliging per warme functie-instantie.
  // Geen blijvende opslag van IP-adressen of berichten. Geen globale exactly-once-garantie.
  const salt = randomBytes(32).toString("hex");
  const digest = (value: string) => createHash("sha256").update(salt + value).digest("hex");
  const buckets = new Map<string, { count: number; expires: number }>();
  const attempts = new Map<string, { signature: string; expires: number; result: Promise<boolean> }>();
  return async (request: Request, env: SmtpContactEnv): Promise<Response> => {
    if (request.method === "GET") return reply(200, { ready: smtpContactConfigured(env) });
    if (request.method !== "POST") return reply(405, { message: "Deze methode wordt niet ondersteund." }, { Allow: "GET, POST" });
    if (request.headers.get("origin") !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site")
      return reply(403, { message: "Open het formulier op de website en probeer opnieuw." });
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json")
      return reply(415, { message: "Ongeldig berichtformaat." });
    if (!smtpContactConfigured(env)) return reply(503, { message: "Verzenden is nog niet beschikbaar. Mail Fleur rechtstreeks via info@juliefleur.nl." });
    let payload: Record<string, unknown>;
    try { payload = await readPayload(request); }
    catch (error) { return reply(error instanceof RangeError ? 413 : 400, { message: "Het bericht kon niet worden gelezen. Controleer de invoer." }); }
    const { fields, errors } = validateContact(payload);
    if (Object.keys(errors).length) return reply(422, { message: "Controleer de gemarkeerde velden.", errors });
    const time = now();
    if (payload.website !== "" || typeof payload.startedAt !== "number" || !Number.isFinite(payload.startedAt) || time - payload.startedAt < 2000 || time - payload.startedAt > 86400000 ||
      typeof payload.submissionId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.submissionId))
      return reply(400, { message: "Open de contactpagina opnieuw en probeer het nog eens, of mail Fleur rechtstreeks." });
    // Vercel overschrijft deze header. Negeer vrij meegegeven Cloudflare-/forward-headers.
    const ip = request.headers.get("x-vercel-forwarded-for")?.trim();
    if (!ip || !isIP(ip)) return reply(503, { message: "Verzenden is tijdelijk niet mogelijk. Je tekst blijft staan." });
    for (const [key, value] of buckets) if (value.expires <= time) buckets.delete(key);
    for (const [key, value] of attempts) if (value.expires <= time) attempts.delete(key);
    const signature = digest(JSON.stringify(fields));
    const reference = payload.submissionId;
    const previous = attempts.get(reference);
    if (previous && previous.signature !== signature) return reply(409, { message: "Dit berichtkenmerk is al gebruikt. Open de contactpagina opnieuw." });
    if (!previous) {
      const limits = [[`ip:${digest(ip)}`, 5, 900000], [`email:${digest(fields.email.toLowerCase())}`, 3, 3600000], ["total", 40, 3600000]] as const;
      if (buckets.size >= 10000 || attempts.size >= 1000 || limits.some(([key, limit]) => (buckets.get(key)?.count || 0) >= limit))
        return reply(429, { message: "Er zijn al meerdere berichten verstuurd. Probeer het later opnieuw of mail Fleur rechtstreeks." }, { "Retry-After": "900" });
      for (const [key, , ttl] of limits) {
        const bucket = buckets.get(key) || { count: 0, expires: time + ttl };
        bucket.count++;
        buckets.set(key, bucket);
      }
      attempts.set(reference, { signature, expires: time + 3600000, result: Promise.resolve().then(() => sendMail(env, { fields, reference })).catch(() => false) });
    }
    const accepted = await attempts.get(reference)!.result;
    if (!accepted) return reply(502, { message: "De mailserver heeft de verzending niet bevestigd. Je tekst blijft staan. Mail Fleur rechtstreeks als je twijfelt of je bericht is aangekomen.", reference });
    return reply(200, { ok: true, reference });
  };
}
