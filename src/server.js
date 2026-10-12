import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {demoChat} from './chat-demo.js';
import {listItems,requests,summary,setAll,resetStore,createItem} from './store.js';
import {watsonChat,watsonReady} from './watson.js';
import {graniteChat} from './granite.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const env=path.join(root,'.env');if(fs.existsSync(env))for(const line of fs.readFileSync(env,'utf8').split('\n')){const i=line.indexOf('=');if(i>0&&!line.trim().startsWith('#')){const k=line.slice(0,i).trim();if(!process.env[k])process.env[k]=line.slice(i+1).trim();}}
const port=Number(process.env.PORT||3000);
const json=(res,status,obj)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(obj));};
async function body(req){let v='';for await(const c of req){v+=c;if(v.length>12000)throw Error('Corpo muito grande');}return JSON.parse(v||'{}');}
function secure(req){const expected=process.env.EXTENSION_API_KEY;if(!expected||expected==='change-this-before-deployment')return false;const a=Buffer.from(req.headers['x-reuse-extension-key']||''),b=Buffer.from(expected);return a.length===b.length&&crypto.timingSafeEqual(a,b);}
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const p=url.pathname;
 if(p==='/api/status'&&req.method==='GET')return json(res,200,{ok:true,mode:process.env.ASSISTANT_MODE==='granite'?'granite':process.env.ASSISTANT_MODE==='watson'?'watson':'demo',ibmConfigured:watsonReady(),summary:summary()});
 if(p==='/api/items'&&req.method==='GET')return json(res,200,{items:listItems(),summary:summary()});
 if(p==='/api/items'&&req.method==='POST'){if(process.env.NODE_ENV==='production')return json(res,403,{error:'Cadastro público desabilitado até implementar login e autorização.'});const b=await body(req);try{return json(res,201,createItem(b));}catch(e){return json(res,422,{error:e.message});}}
 if(p==='/api/requests'&&req.method==='GET')return json(res,200,{requests:requests()});
 if(p==='/api/chat'&&req.method==='POST'){const b=await body(req);if(typeof b.message!=='string'||b.message.length>500)return json(res,400,{error:'Mensagem inválida (máximo 500 caracteres)'});const id=String(b.sessionId||'anonymous').slice(0,80);if(process.env.ASSISTANT_MODE==='watson'){if(!watsonReady())return json(res,503,{error:'Configure o IBM no .env'});try{return json(res,200,await watsonChat(b.message,id));}catch(e){return json(res,502,{error:e.message});}}if(process.env.ASSISTANT_MODE==='granite'){try{return json(res,200,await graniteChat(b.message,id));}catch(e){return json(res,503,{error:e.message});}}return json(res,200,demoChat(b.message,id));}
 if(p.startsWith('/api/extension/')){if(!secure(req))return json(res,401,{error:'Token inválido'});if(p==='/api/extension/items'&&req.method==='GET')return json(res,200,{success:true,items:listItems(),summary:summary()});if(p==='/api/extension/trades'&&req.method==='GET')return json(res,200,{success:true,requests:requests()});if(p==='/api/extension/items/pause-all'&&req.method==='POST')return json(res,200,setAll(false));if(p==='/api/extension/items/resume-all'&&req.method==='POST')return json(res,200,setAll(true));}
 if(p==='/api/reset'&&req.method==='POST')return process.env.NODE_ENV==='production'?json(res,403,{error:'Desabilitado'}):json(res,200,{ok:true,summary:resetStore()});
 if(req.method==='GET'){const f=path.resolve(root,'public','.'+(p==='/'?'/index.html':decodeURIComponent(p)));if(f.startsWith(path.resolve(root,'public')+path.sep)&&fs.existsSync(f)&&fs.statSync(f).isFile()){const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.png':'image/png'};res.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream'});return fs.createReadStream(f).pipe(res);}}
 return json(res,404,{error:'Não encontrado'});
 }catch(e){return json(res,400,{error:e.message});}}).listen(port,()=>console.log('ReUse iniciado em http://localhost:'+port));
