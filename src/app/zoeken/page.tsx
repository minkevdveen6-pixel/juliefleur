import {StoreLink} from "@/components/store-link";
import {Search} from "@/components/search";
import {Breadcrumb} from "@/components/catalog";
import {ecwid,pageMetadata} from "@/lib/site";
export const metadata={...pageMetadata("Zoeken","/zoeken/"),robots:{index:false,follow:false}};
export default function SearchPage(){return <div className="shell section-page"><Breadcrumb items={[{label:"Zoeken"}]} /><header className="page-heading"><h1>Zoeken</h1></header>{ecwid.enabled?<StoreLink hash="#!/~/search" className="button">Zoek in de winkel</StoreLink>:<Search />}</div>;}
