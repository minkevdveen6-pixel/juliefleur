import plan from "@/data/photography.json";
import generated from "@/data/photography-generated.json";
export type PreparedPhoto={src:string;width:number;height:number;variants:{src:string;width:number}[]};
type Approval={alt:string;fit?:"contain"|"cover";position?:string};
export function photoAt(slot?:string):(PreparedPhoto & Approval & {fit:"contain"|"cover"})|null {
  if(!slot)return null;
  const file=slot.startsWith("product:")?(plan.products as Record<string,string>)[slot.slice(8)]:(plan.slots as Record<string,string|null>)[slot];
  const approval=file?(plan.approvedImages as Record<string,Approval>)[file]:undefined;
  const asset=file?(generated as Record<string,PreparedPhoto>)[file]:undefined;
  if(!asset||typeof approval?.alt!=="string"||!approval.alt.trim())return null;
  return {...asset,...approval,fit:approval.fit==="cover"?"cover":"contain"};
}
