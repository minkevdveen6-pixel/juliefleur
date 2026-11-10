import Link from "next/link";
import {Breadcrumb} from "@/components/catalog";
import {ContactForm} from "@/components/contact-form";
import {pageMetadata,site} from "@/lib/site";
import {Icon} from "@/components/icons";
import styles from "./contact.module.css";
export const metadata=pageMetadata("Contact","/contact/");
export default function ContactPage(){return <div className={`shell section-page ${styles.page}`}><Breadcrumb items={[{label:"Contact"}]} /><header className="page-heading"><h1>Contact</h1><p>Een vraag over een product of een persoonlijk idee? Stuur Fleur een bericht.</p></header><div className={styles.layout}><aside className={styles.details} aria-label="Contactgegevens"><div><h2>Rechtstreeks contact</h2><a className={styles.email} href="mailto:info@juliefleur.nl">info@juliefleur.nl <Icon name="arrow" width="18" height="18" /></a><a className={styles.instagram} href={site.instagram} target="_blank" rel="noopener noreferrer"><Icon name="instagram" width="18" height="18" /> @juliefleur.nl</a></div><div className={styles.address}><h2>Afhalen op afspraak</h2><p>Julie Fleur<br />Van Someren-Downerlaan 32<br />5707 KL Helmond</p><p>Afhalen gebeurt op afspraak nadat je bestelling klaar is.</p><Link className="text-link" href="/bedrijfsinformatie">Bedrijfsinformatie <Icon name="arrow" width="16" height="16" /></Link></div></aside><div className={styles.panel}><ContactForm /></div></div></div>;}
