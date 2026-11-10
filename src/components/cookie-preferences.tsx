"use client";
import Link from "next/link";
import {useEffect,useRef} from "react";
import {getMediaConsentState,setMediaConsent} from "@/lib/media-consent";
import {ecwid} from "@/lib/site";
import {Icon} from "./icons";
export function CookiePreferences(){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const policyPage=/^\/(cookiebeleid|privacybeleid)\/?$/.test(window.location.pathname);if(!policyPage&&getMediaConsentState()==="unknown"&&!dialog.current?.open)dialog.current?.showModal();},[]);
 function choose(value:boolean){setMediaConsent(value);dialog.current?.close();}
 function open(){if(!dialog.current?.open)dialog.current?.showModal();}
 return <><button className="cookie-preferences-button" onClick={open}>Cookievoorkeuren</button><button className="cookie-trigger" onClick={open} aria-label="Cookievoorkeuren openen" aria-haspopup="dialog">Cookies</button><dialog className="cookie-dialog" ref={dialog} aria-labelledby="preferences-title" aria-describedby="preferences-description preferences-change"><div className="cookie-header"><h2 id="preferences-title">Cookievoorkeuren</h2><button className="icon-button cookie-close" onClick={()=>dialog.current?.close()} aria-label="Cookievoorkeuren sluiten"><Icon name="close" /></button></div><p id="preferences-description">{ecwid.enabled ? "Deze website onthoudt je cookievoorkeur. De winkel gebruikt Ecwid voor producten, je winkelwagen en afrekenen. Ecwid kan hiervoor noodzakelijke winkelgegevens in je browser bewaren. Er is geen externe Instagram-feed ingeschakeld." : "Deze website gebruikt alleen noodzakelijke functies en onthoudt je cookievoorkeur. Er zijn momenteel geen optionele cookies of externe feeds ingeschakeld."}</p><p id="preferences-change">Je kunt je voorkeur altijd bekijken via Cookies of Cookievoorkeuren.</p><p className="cookie-current">Noodzakelijk: altijd actief · Optionele cookies: uit</p><div className="cookie-actions single-action"><button onClick={()=>choose(false)}>Alleen noodzakelijk</button></div><Link className="text-link" href="/cookiebeleid" onClick={()=>dialog.current?.close()}>Cookiebeleid <Icon name="arrow" width="16" /></Link></dialog></>;
}
