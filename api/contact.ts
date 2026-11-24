import type { IncomingMessage, ServerResponse } from "node:http";
import { validateContact } from "../src/lib/contact-validation.ts";

const recipient = "info@juliefleur.nl";
const htmlEntities: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => htmlEntities[char]);

const origins = new Set(["https://juliefleur.nl", "https://www.juliefleur.nl"]);
const maxBodyBytes = 32_768;
const windowMs = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; expires: number }>();

function reply(status: number, body: object, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function allowAttempt(ip: string) {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.expires <= now) attempts.delete(key);
  }

  const entry = attempts.get(ip);
  if (entry) {
    if (entry.count >= 5) return false;
    entry.count += 1;
    return true;
  }

  if (attempts.size >= 2048) return false;
  attempts.set(ip, { count: 1, expires: now + windowMs });
  return true;
}

async function handleContact(request: Request) {
  if (request.method !== "POST") return reply(405, { ok: false }, { Allow: "POST" });
  if (!origins.has(request.headers.get("origin") ?? "")) return reply(403, { ok: false });
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return reply(415, { ok: false });
  }
  if (Number(request.headers.get("content-length")) > maxBodyBytes) return reply(413, { ok: false });

  let input: unknown;
  try {
    const body = await request.text();
    if (Buffer.byteLength(body) > maxBodyBytes) return reply(413, { ok: false });
    input = JSON.parse(body);
  } catch {
    return reply(400, { ok: false });
  }

  if (!input || typeof input !== "object" || !("website" in input) || input.website !== "") {
    return reply(400, { ok: false });
  }

  const { fields, errors } = validateContact(input);
  if (Object.keys(errors).length) return reply(400, { ok: false });
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) return reply(503, { ok: false });

  // Vercel supplies this address. The limit is local to the running instance.
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!allowAttempt(ip)) return reply(429, { ok: false }, { "Retry-After": "600" });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: fields.email,
        subject: fields.subject,
        html: `<div lang="nl" style="background:#FCF7F3;padding:24px 12px;color:#873B50;font-family:Arial,sans-serif;line-height:1.6">
          <div style="max-width:560px;margin:auto">
            <p style="margin:0;padding:12px 20px;background:#F3CDD3;color:#56692C;font-weight:bold">Julie Fleur</p>
            <div style="background:#fff;padding:20px;overflow-wrap:anywhere">
              <h1 style="font-size:22px;margin:0 0 16px">${escapeHtml(fields.subject)}</h1>
              <p><strong>Naam</strong><br>${escapeHtml(fields.name)}</p>
              <p><strong>E-mailadres</strong><br>${escapeHtml(fields.email)}</p>
              <p><strong>Bericht</strong><br>${escapeHtml(fields.message).replace(/\r\n|\r|\n/g, "<br>")}</p>
            </div>
          </div>
        </div>`,
        text: `Naam: ${fields.name}\nE-mailadres: ${fields.email}\n\n${fields.message}`,
      }),
    });
    if (!response.ok) {
      console.error("Resend rejected contact email", response.status);
      return reply(502, { ok: false });
    }
    const result = await response.json();
    if (typeof result.id !== "string" || !result.id) return reply(502, { ok: false });
    return reply(200, { ok: true, id: result.id });
  } catch {
    console.error("Resend contact request failed");
    return reply(502, { ok: false });
  }
}

type VercelRequest = IncomingMessage & { body?: unknown };

export default async function contact(req: VercelRequest, res: ServerResponse) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(",") : value);
  }

  let body: string | undefined;
  if (req.method === "POST" && req.body !== undefined) {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  const result = await handleContact(new Request("https://juliefleur.nl/api/contact", {
    method: req.method ?? "GET",
    headers,
    body,
  }));
  res.writeHead(result.status, Object.fromEntries(result.headers));
  res.end(await result.text());
}
