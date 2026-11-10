"use client";
import { useSyncExternalStore } from "react";
const key="julie-fleur.external-media.v1";
const lifetime=180*24*60*60*1000;
const listeners=new Set<()=>void>();
type ConsentRecord={allowed:boolean;time:number};
let memory:ConsentRecord|undefined;
export function getMediaConsentState():"unknown"|"allowed"|"denied" {
  if(typeof window==="undefined")return "unknown";
  let value=memory;
  try{if(!value){const raw=window.localStorage.getItem(key);if(raw)value=JSON.parse(raw);}}catch{/* De voorkeur werkt ook zonder browseropslag. */}
  if(typeof value?.allowed!=="boolean"||typeof value.time!=="number"||!Number.isFinite(value.time)||value.time>Date.now()||Date.now()-value.time>=lifetime)return "unknown";
  return value.allowed?"allowed":"denied";
}
function read(){return getMediaConsentState()==="allowed";}
function subscribe(listener:()=>void) {
  listeners.add(listener);
  const onStorage=(event:StorageEvent)=>{if(event.key===key||event.key===null){memory=undefined;listener();}};
  window.addEventListener("storage",onStorage);
  return()=>{listeners.delete(listener);window.removeEventListener("storage",onStorage);};
}
export function setMediaConsent(allowed:boolean) {
  memory={allowed,time:Date.now()};
  try{window.localStorage.setItem(key,JSON.stringify(memory));}catch{/* Alleen in geheugen tot de pagina sluit. */}
  listeners.forEach(listener=>listener());
}
export function useMediaConsent(){return useSyncExternalStore(subscribe,read,()=>false);}
