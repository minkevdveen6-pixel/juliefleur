import Link from "next/link";
import {EcwidStore} from "@/components/ecwid-store";
import {Breadcrumb} from "@/components/catalog";
import {ecwid,pageMetadata} from "@/lib/site";
import styles from "@/components/ecwid-store.module.css";
export const metadata=pageMetadata("Winkel","/winkel/");
export default function StorePage(){return <div className={`shell section-page ${ecwid.enabled ? styles.shopPage : ""}`}>{ecwid.enabled?<EcwidStore main allProducts />:<><Breadcrumb items={[{label:"Winkel"}]} /><div className="content-container empty-collection"><h1>Webshop in voorbereiding</h1><p>Bestellen en betalen zijn nog niet mogelijk.</p><Link href="/collecties" className="button">Bekijk de collectie</Link></div></>}</div>;}
