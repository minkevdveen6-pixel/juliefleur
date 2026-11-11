import Image from "next/image";
import type {CSSProperties} from "react";
import {photoAt} from "@/lib/photography";
export function PhotoSpace({title="Productfoto",kind="collection",image,alt,slot,fit,position,priority=false,eager=false}:{title?:string;index?:string;tone?:string;kind?:string;image?:string|null;alt?:string;slot?:string;fit?:"contain"|"cover";position?:string;priority?:boolean;eager?:boolean}){
  const photo=photoAt(slot);
  if(photo&&!image)return <div className={`photo-space has-photograph photo-${kind}`} style={{"--photo-ratio":`${photo.width} / ${photo.height}`} as CSSProperties}><picture><source type="image/webp" srcSet={photo.variants.map(v=>`${v.src} ${v.width}w`).join(", ")} sizes={kind==="home-category"?"(max-width: 600px) 50vw, (max-width: 900px) 33vw, 216px":"(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 360px"} />{/* Vooraf geoptimaliseerde aangeleverde fotografie; de website genereert of retoucheert geen beelden. */}<img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading={priority||eager?"eager":"lazy"} fetchPriority={priority?"high":"auto"} decoding="async" style={{objectFit:fit??photo.fit,objectPosition:position||photo.position||"50% 50%"}} /></picture></div>;
  if(image)return <div className={`photo-space photo-${kind}`}><Image src={image} alt={alt||title} fill sizes="(max-width: 700px) 50vw, 360px" style={{objectFit:fit||"contain",objectPosition:position}} /></div>;
  return null;
}
