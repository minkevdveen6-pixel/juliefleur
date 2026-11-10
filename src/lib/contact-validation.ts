export const contactLimits = { name: 100, email: 254, subject: 160, message: 5000 } as const;
export type ContactFields = { name: string; email: string; subject: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields,string>>;
const lineBreaks = /[\r\n\u0000-\u001f\u007f]/;
export function validateContact(value: unknown): { fields: ContactFields; errors: ContactErrors } {
  const input=(value && typeof value==="object" && !Array.isArray(value) ? value : {}) as Record<string,unknown>;
  const clean=(key:keyof ContactFields)=>typeof input[key]==="string" ? (input[key] as string).normalize("NFC").trim() : "";
  const fields:ContactFields={name:clean("name"),email:clean("email"),subject:clean("subject"),message:clean("message")};
  const errors:ContactErrors={};
  if(fields.name.length<2||fields.name.length>contactLimits.name||lineBreaks.test(fields.name)) errors.name="Vul je naam in (2–100 tekens).";
  if(fields.email.length>contactLimits.email||!/^[^\s@<>\u0000-\u001f]+@[^\s@<>\u0000-\u001f]+\.[^\s@<>\u0000-\u001f]+$/.test(fields.email)) errors.email="Vul een geldig e-mailadres in.";
  if(fields.subject.length<3||fields.subject.length>contactLimits.subject||lineBreaks.test(fields.subject)) errors.subject="Vul een onderwerp in (3–160 tekens).";
  if(fields.message.length<10||fields.message.length>contactLimits.message||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(fields.message)) errors.message="Schrijf een bericht van 10–5000 tekens.";
  return {fields,errors};
}
