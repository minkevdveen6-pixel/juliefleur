"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { contactLimits, validateContact, type ContactErrors, type ContactFields } from "@/lib/contact-validation";
import { Icon } from "./icons";

const empty:ContactFields={name:"",email:"",subject:"",message:""};
export function ContactForm() {
  const [fields,setFields]=useState<ContactFields>(empty);
  const [errors,setErrors]=useState<ContactErrors>({});
  const [availability,setAvailability]=useState<"checking"|"ready"|"unavailable">("checking");
  const [sending,setSending]=useState(false);
  const [failure,setFailure]=useState("");
  const [success,setSuccess]=useState("");
  const startedAt=useRef(0);
  const website=useRef<HTMLInputElement>(null);
  const errorSummary=useRef<HTMLDivElement>(null);
  const attempt=useRef<{signature:string;id:string}|null>(null);
  useEffect(()=>{
    startedAt.current=Date.now();
    const controller=new AbortController();
    fetch("/api/contact",{signal:AbortSignal.any([controller.signal,AbortSignal.timeout(6000)]),cache:"no-store"}).then(async result=>{
      if(!result.ok)throw new Error();
      const data=await result.json();setAvailability(data.ready===true?"ready":"unavailable");
    }).catch(()=>{if(!controller.signal.aborted)setAvailability("unavailable");});
    return()=>controller.abort();
  },[]);
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();if(sending)return;
    const validated=validateContact(fields);setErrors(validated.errors);setFailure("");
    if(Object.keys(validated.errors).length){requestAnimationFrame(()=>errorSummary.current?.focus());return;}
    if(availability!=="ready"){setFailure("Het formulier is nog niet aangesloten. Mail rechtstreeks naar info@juliefleur.nl.");return;}
    const signature=JSON.stringify(validated.fields);
    if(attempt.current?.signature!==signature)attempt.current={signature,id:crypto.randomUUID()};
    setSending(true);
    try {
      const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...validated.fields,website:website.current?.value||"",startedAt:startedAt.current,submissionId:attempt.current.id}),signal:AbortSignal.timeout(22000)});
      const body=await response.json();
      if(!response.ok||body.ok!==true){
        if(body.errors)setErrors(body.errors);
        setFailure(typeof body.message==="string"?body.message:"Je bericht is niet verstuurd. Probeer opnieuw of mail ons rechtstreeks.");
        requestAnimationFrame(()=>errorSummary.current?.focus());return;
      }
      setSuccess(String(body.reference));setFields(empty);attempt.current=null;
    }catch{setFailure("De verzending kon niet worden bevestigd. Je tekst blijft staan. Probeer opnieuw of mail ons rechtstreeks.");requestAnimationFrame(()=>errorSummary.current?.focus());}
    finally{setSending(false);}
  }
  if(success)return <div className="contact-success" role="status"><Icon name="check" width="35" height="35" /><h2>Je bericht is verstuurd</h2><p>De maildienst heeft je bericht aangenomen voor info@juliefleur.nl. Je kunt dit kenmerk bewaren als je navraag wilt doen:</p><code>{success}</code><button className="text-link" onClick={()=>{setSuccess("");startedAt.current=Date.now();}}>Nog een bericht schrijven <Icon name="arrow" /></button></div>;
  const update=(key:keyof ContactFields,value:string)=>{setFields(previous=>({...previous,[key]:value}));if(errors[key])setErrors(previous=>({...previous,[key]:undefined}));};
  return <form className="contact-form" onSubmit={submit} noValidate aria-label="Contactformulier">
    <h2>Stuur Fleur een bericht</h2>
    <p className="form-required-note">Alle velden zijn verplicht.</p>
    <div className={`form-availability ${availability==="ready"?"form-available":""}`} id="contact-availability" role="status">{availability==="checking"?"We controleren of je bericht verstuurd kan worden…":availability==="ready"?"Je bericht gaat rechtstreeks naar info@juliefleur.nl.":<>Het formulier wordt nog aangesloten. Je kunt ons alvast rechtstreeks mailen via <a href="mailto:info@juliefleur.nl">info@juliefleur.nl</a>.</>}</div>
    {(failure||Object.values(errors).some(Boolean))&&<div className="form-error-summary" role="alert" ref={errorSummary} tabIndex={-1}><p>{failure||"Controleer de volgende velden:"}</p>{Object.entries(errors).filter(([,value])=>value).map(([key,value])=><a key={key} href={`#contact-${key}`}>{value}</a>)}</div>}
    <div className="contact-field-row">{([['name','Naam','text','name'],['email','E-mailadres','email','email']] as const).map(([key,label,type,autoComplete])=><div className="contact-field" key={key}><label htmlFor={`contact-${key}`}>{label}</label><input id={`contact-${key}`} name={key} type={type} autoComplete={autoComplete} required maxLength={contactLimits[key]} value={fields[key]} onChange={e=>update(key,e.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key]?`contact-${key}-error`:undefined} disabled={sending} />{errors[key]&&<small className="field-error" id={`contact-${key}-error`}>{errors[key]}</small>}</div>)}</div>
    <div className="contact-field"><label htmlFor="contact-subject">Onderwerp</label><input id="contact-subject" name="subject" required maxLength={contactLimits.subject} value={fields.subject} onChange={e=>update("subject",e.target.value)} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject?"contact-subject-error":undefined} disabled={sending} />{errors.subject&&<small className="field-error" id="contact-subject-error">{errors.subject}</small>}</div>
    <div className="contact-field"><label htmlFor="contact-message">Bericht</label><textarea id="contact-message" name="message" rows={7} required maxLength={contactLimits.message} value={fields.message} onChange={e=>update("message",e.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message?"contact-message-error":"contact-message-help"} disabled={sending} /><div className="message-help"><small id="contact-message-help">Deel alleen de gegevens die nodig zijn voor je vraag.</small><small>{fields.message.length}/{contactLimits.message}</small></div>{errors.message&&<small className="field-error" id="contact-message-error">{errors.message}</small>}</div>
    <div className="contact-honeypot" aria-hidden="true"><label htmlFor="contact-website">Website — laat dit veld leeg</label><input ref={website} id="contact-website" name="website" tabIndex={-1} autoComplete="off" maxLength={200} /></div>
    <p className="contact-privacy">We gebruiken je gegevens om je bericht te beantwoorden. <Link href="/privacybeleid">Lees de privacy-informatie</Link>.</p>
    <button type="submit" className="button contact-submit" disabled={sending||availability!=="ready"} aria-describedby="contact-availability">{sending?"Je bericht wordt verstuurd…":"Verstuur je bericht"}<Icon name="arrow" /></button>
    <noscript><p>Voor het formulier is JavaScript nodig. Je kunt rechtstreeks mailen naar info@juliefleur.nl.</p></noscript>
  </form>;
}
