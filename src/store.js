import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const statePath=path.join(root,'data','state.json');
const initial={
  user:{id:'demo-user',name:'Juan',city:'São Paulo'},
  items:[
    {id:'ITM-104',title:'Bicicleta urbana',category:'Mobilidade',condition:'Bom estado',active:true,icon:'bike',color:'#dcefe6',description:'Bicicleta aro 26 revisada e pronta para troca.'},
    {id:'ITM-105',title:'Mesa de escritório',category:'Casa e decoração',condition:'Muito bom',active:true,icon:'desk',color:'#f3e9d8',description:'Mesa compacta em madeira clara.'},
    {id:'ITM-106',title:'Livros de design',category:'Livros',condition:'Conservados',active:true,icon:'book',color:'#e7e5f5',description:'Coleção de livros de design gráfico.'},
    {id:'ITM-107',title:'Câmera analógica',category:'Eletrônicos',condition:'Bom estado',active:false,icon:'camera',color:'#f4e0d9',description:'Câmera disponível para ativação futura.'}
  ],
  requests:[
    {id:'TRO-081',item:'Bicicleta urbana',with:'Mariana S.',status:'Em análise'},
    {id:'TRO-072',item:'Mesa de escritório',with:'Rafael M.',status:'Aguardando resposta'}
  ],updatedAt:new Date().toISOString()
};
export const deepClone=(v)=>JSON.parse(JSON.stringify(v));
export function resetStore(){fs.mkdirSync(path.dirname(statePath),{recursive:true});fs.writeFileSync(statePath,JSON.stringify(initial,null,2),'utf8');return getStore();}
export function getStore(){try{return JSON.parse(fs.readFileSync(statePath,'utf8'));}catch{return resetStore();}}
export function listItems(){return getStore().items;}
export function requests(){return getStore().requests;}
export function setAll(active){const s=getStore();const affected=s.items.filter(i=>i.active!==active).length;s.items=s.items.map(i=>({...i,active}));s.updatedAt=new Date().toISOString();fs.writeFileSync(statePath,JSON.stringify(s,null,2),'utf8');return {success:true,affected,activeCount:s.items.filter(i=>i.active).length,total:s.items.length,message:active?affected+' oferta(s) reativada(s).':affected+' oferta(s) pausada(s).'};}
export function summary(){const s=getStore();return {active:s.items.filter(i=>i.active).length,paused:s.items.filter(i=>!i.active).length,requests:s.requests.length,total:s.items.length,updatedAt:s.updatedAt};}
