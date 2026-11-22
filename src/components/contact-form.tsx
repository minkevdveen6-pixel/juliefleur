"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { contactLimits, validateContact, type ContactErrors, type ContactFields } from "@/lib/contact-validation";
import { Icon } from "./icons";

const empty:ContactFields={name:"",email:"",subject:"",message:""};
export function ContactForm() {
  const [fields,setFields]=useState<ContactFields>(empty);
  const [errors,setErrors]=useState<ContactErrors>({});
  const [ready,setReady]=useState(false);
  const [status,setStatus]=useState<"idle" | "sending" | "sent" | "error" | "limited">("idle");
  const errorSummary=useRef<HTMLDivElement>(null);
  useEffect(()=>setReady(true),[]);

  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(status==="sending") return;
    const website = new FormData(event.currentTarget).get("website");
    setStatus("idle");
    const { fields: validFields, errors: nextErrors } = validateContact(fields);
    setErrors(nextErrors);
    if(Object.keys(nextErrors).length){
      requestAnimationFrame(()=>errorSummary.current?.focus());
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validFields, website }),
      });
      if (response.status === 429) {
        setStatus("limited");
        return;
      }

      if (!response.ok || (await response.json()).ok !== true) {
        setStatus("error");
        return;
      }

      setFields(empty);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
  const update=(key:keyof ContactFields,value:string)=>{setFields(previous=>({...previous,[key]:value}));if(errors[key])setErrors(previous=>({...previous,[key]:undefined}));};
  return <form className="contact-form" onSubmit={submit} noValidate aria-label="Contactformulier">
    <h2>Stuur Fleur een bericht</h2>
    <p className="form-required-note">Alle velden zijn verplicht.</p>
    <p className="form-availability" id="contact-availability">Liever rechtstreeks mailen? Gebruik <a href="mailto:info@juliefleur.nl">info@juliefleur.nl</a>.</p>
    <div hidden aria-hidden="true">
      <label htmlFor="contact-website">Website</label>
      <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
    {status==="sent"&&<p className="form-availability" role="status">Je bericht is verzonden. Bedankt voor je bericht!</p>}
    {(status==="error"||status==="limited")&&<p className="form-error-summary" role="alert">{status==="limited"?"Je hebt te vaak een bericht geprobeerd te versturen. Probeer het later opnieuw.":"Je bericht kon niet worden verzonden. Probeer het opnieuw of mail rechtstreeks."}</p>}
    {Object.values(errors).some(Boolean)&&<div className="form-error-summary" role="alert" ref={errorSummary} tabIndex={-1}><p>Controleer de volgende velden.</p>{Object.entries(errors).filter(([,value])=>value).map(([key,value])=><a key={key} href={`#contact-${key}`}>{value}</a>)}</div>}
    <div className="contact-field-row">{([['name','Naam','text','name'],['email','E-mailadres','email','email']] as const).map(([key,label,type,autoComplete])=><div className="contact-field" key={key}><label htmlFor={`contact-${key}`}>{label}</label><input id={`contact-${key}`} name={key} type={type} autoComplete={autoComplete} required maxLength={contactLimits[key]} value={fields[key]} onChange={e=>update(key,e.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key]?`contact-${key}-error`:undefined} />{errors[key]&&<small className="field-error" id={`contact-${key}-error`}>{errors[key]}</small>}</div>)}</div>
    <div className="contact-field"><label htmlFor="contact-subject">Onderwerp</label><input id="contact-subject" name="subject" required maxLength={contactLimits.subject} value={fields.subject} onChange={e=>update("subject",e.target.value)} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject?"contact-subject-error":undefined} />{errors.subject&&<small className="field-error" id="contact-subject-error">{errors.subject}</small>}</div>
    <div className="contact-field"><label htmlFor="contact-message">Bericht</label><textarea id="contact-message" name="message" rows={7} required maxLength={contactLimits.message} value={fields.message} onChange={e=>update("message",e.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message?"contact-message-error":"contact-message-help"} /><div className="message-help"><small id="contact-message-help">Deel alleen de gegevens die nodig zijn voor je vraag.</small><small>{fields.message.length}/{contactLimits.message}</small></div>{errors.message&&<small className="field-error" id="contact-message-error">{errors.message}</small>}</div>
    <p className="contact-privacy">We gebruiken je gegevens om je bericht te beantwoorden. <Link href="/privacybeleid">Lees de privacy-informatie</Link>.</p>
    <button type="submit" className="button contact-submit" disabled={!ready||status==="sending"} aria-describedby="contact-availability">{status==="sending"?"Bezig met verzenden…":"Verstuur bericht"} <Icon name="arrow" /></button>
    <noscript><p>Voor het formulier is JavaScript nodig. Je kunt rechtstreeks mailen naar info@juliefleur.nl.</p></noscript>
  </form>;
}
