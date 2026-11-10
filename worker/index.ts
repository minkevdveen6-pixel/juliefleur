import { handleContact, type ContactEnv } from "./contact.ts";
type Env = ContactEnv & { ASSETS:{fetch:(request:Request)=>Promise<Response>} };
const worker={
  async fetch(request:Request,env:Env) {
    const path=new URL(request.url).pathname.replace(/\/$/,"");
    if(path==="/api/contact")return handleContact(request,env);
    if(path.startsWith("/api/"))return Response.json({message:"Niet gevonden."},{status:404,headers:{"Cache-Control":"no-store"}});
    return env.ASSETS.fetch(request);
  },
};
export default worker;
