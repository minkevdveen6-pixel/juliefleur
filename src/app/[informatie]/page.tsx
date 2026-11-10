import Link from "next/link";
import {notFound} from "next/navigation";
import {pages} from "@/data/pages";
import {Breadcrumb} from "@/components/catalog";
import {PhotoSpace} from "@/components/placeholder";
import {Icon} from "@/components/icons";
import {pageMetadata} from "@/lib/site";
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(pages).map(informatie=>({informatie}));}
export async function generateMetadata({params}:{params:Promise<{informatie:string}>}){const {informatie}=await params;const p=pages[informatie];return pageMetadata(p?.title||"Informatie",`/${informatie}/`);}
export default async function InformationPage({params}:{params:Promise<{informatie:string}>}){
  const {informatie}=await params;const p=pages[informatie];if(!p)notFound();
  return <div className={`shell section-page information-page ${p.kind==="about"?"about-page":""}`}><Breadcrumb items={[{label:p.title}]} /><div className="content-container"><header className="page-heading"><h1>{p.title}</h1>{p.intro&&<div className="page-description">{p.intro.split("\n").map(line=><p key={line}>{line}</p>)}</div>}</header><div className={p.kind==="about"?"about-story":"info-content"}>{p.kind==="about"&&<PhotoSpace slot="portrait:fleur" kind="portrait" priority />}<div>{p.sections.map(s=>p.kind==="faq"||p.collapsible?<details className="faq-item" key={s.title}><summary>{s.title}<Icon name="plus" width="18" /></summary><div className="details-content"><Paragraphs paragraphs={s.paragraphs} />{s.links?.map(l=><InfoLink key={l.href} {...l} />)}</div></details>:<section className="prose-section" key={s.title}><h2>{s.title}</h2><Paragraphs paragraphs={s.paragraphs} />{s.links?.map(l=><InfoLink key={l.href} {...l} />)}</section>)}</div></div></div></div>;
}
function Paragraphs({paragraphs}:{paragraphs:string[]}){return paragraphs.map((text,i)=>text.startsWith("• ")?<p className="prose-bullet" key={i}>{text}</p>:<p key={i}>{text}</p>);}
function InfoLink({label,href}:{label:string;href:string}){return href.startsWith("https:")?<a className="text-link" href={href} target="_blank" rel="noopener noreferrer">{label}<Icon name="arrow" width="17" /></a>:<Link className="text-link" href={href}>{label}<Icon name="arrow" width="17" /></Link>;}
