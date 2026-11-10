"use client";
import {useMemo,useState} from "react";
import {products} from "@/data/catalog";
import {ProductBrowser} from "./product-browser";
import {Icon} from "./icons";
export function Search(){
 const [query,setQuery]=useState("");
 const items=useMemo(()=>products.filter(p=>`${p.name} ${p.description}`.toLocaleLowerCase("nl").includes(query.trim().toLocaleLowerCase("nl"))),[query]);
 return <><form className="search-form" role="search" onSubmit={e=>e.preventDefault()}><label className="sr-only" htmlFor="catalog-search">Zoek in de collectie</label><Icon name="search" /><input id="catalog-search" type="search" autoComplete="off" maxLength={100} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Zoek op productnaam" /><button type="submit" className="icon-button" aria-label="Zoeken"><Icon name="arrow" /></button></form><p className="search-status" role="status">{query.trim()?`${items.length} ${items.length===1?"resultaat":"resultaten"} voor ‘${query.trim()}’`:"Zoek op productnaam of omschrijving."}</p>{query.trim()&&(items.length?<ProductBrowser products={items} />:<p>Geen producten gevonden. Probeer een andere zoekterm.</p>)}</>;
}
