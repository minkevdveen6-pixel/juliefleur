"use client";
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}){return <div className="shell empty-collection"><h1>De pagina kan niet worden geladen</h1><button className="button" onClick={reset}>Probeer opnieuw</button></div>;}
