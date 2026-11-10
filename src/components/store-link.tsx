// De officiële Ecwid-embed krijgt via een normale link een schone documentlevenscyclus.
import Link from "next/link";
import { ecwid } from "@/lib/site";
export function StoreLink({children,className,hash=""}:{children:React.ReactNode;className?:string;hash?:string}){
  return ecwid.enabled?<a className={className} href={`/winkel/${hash}`}>{children}</a>:<Link className={className} href="/collecties">{children}</Link>;
}
