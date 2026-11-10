import Link from "next/link";
export default function NotFound(){return <div className="shell empty-collection not-found"><h1>Pagina niet gevonden</h1><p>Deze pagina bestaat niet of is verhuisd.</p><Link href="/collecties" className="button">Naar de collecties</Link></div>;}
