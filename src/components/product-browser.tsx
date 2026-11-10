"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {formatPrice,type Product} from "@/data/catalog";
import {photoAt} from "@/lib/photography";
import {ProductCard} from "./catalog";
import {PhotoSpace} from "./placeholder";

function priceLabel(product:Product){return product.price===null?"In voorbereiding":`${product.fromPrice?"Vanaf ":""}${formatPrice(product.price)}`;}

export function ProductBrowser({products}:{products:Product[]}){
  const [sort,setSort]=useState("collection");
  const sorted=useMemo(()=>[...products].sort((a,b)=>sort==="price-up"?(a.price??Infinity)-(b.price??Infinity):sort==="price-down"?(b.price??-Infinity)-(a.price??-Infinity):sort==="name"?a.name.localeCompare(b.name,"nl"):0),[products,sort]);
  const photographed=sorted.filter(p=>p.image||photoAt(`product:${p.slug}`));
  const others=sorted.filter(p=>!p.image&&!photoAt(`product:${p.slug}`));
  return <>
    <div className="catalog-toolbar"><p>{products.length} {products.length===1?"product":"producten"}</p>{products.length>1&&<label><span>Sorteer op</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="collection">Standaard</option><option value="price-up">Prijs: laag naar hoog</option><option value="price-down">Prijs: hoog naar laag</option><option value="name">Naam: A–Z</option></select></label>}</div>
    {sort!=="collection"?<ul className="sorted-product-list">{sorted.map(p=><li key={p.slug}><Link href={`/producten/${p.slug}`}>{p.image||photoAt(`product:${p.slug}`)?<PhotoSpace slot={`product:${p.slug}`} image={p.image} alt={p.name} fit="contain" />:<span aria-hidden="true" />}<span>{p.name}</span><span className="sorted-product-price">{priceLabel(p)}</span></Link></li>)}</ul>:<>
      {photographed.length>0&&<div className="product-grid">{photographed.map(p=><ProductCard key={p.slug} product={p} />)}</div>}
      {others.length>0&&<section className="product-index" aria-label="Overige producten">{photographed.length>0&&<h2>Overige producten</h2>}<ul>{others.map(p=><li key={p.slug}><Link href={`/producten/${p.slug}`}><span>{p.name}</span><span>{priceLabel(p)}</span></Link></li>)}</ul></section>}
    </>}
  </>;
}
