import fs from 'node:fs';
import crypto from 'node:crypto';
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
// Cadastro local para o MVP acadêmico. Em produção requer autenticação por usuário.
export function createItem(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Dados do item inválidos.');
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const description = typeof data.description === 'string' ? data.description.trim() : '';
  const categories = ['Mobilidade','Casa e decoração','Livros','Eletrônicos','Roupas e acessórios','Esportes','Outros'];
  const conditions = ['Novo','Muito bom','Bom estado','Regular'];
  if (title.length < 3 || title.length > 80) throw new Error('O nome deve ter entre 3 e 80 caracteres.');
  if (!categories.includes(data.category)) throw new Error('Escolha uma categoria válida.');
  if (!conditions.includes(data.condition)) throw new Error('Escolha um estado de conservação válido.');
  if (description.length > 800) throw new Error('A descrição deve ter no máximo 800 caracteres.');
  const state = getStore();
  if (state.items.length >= 100) throw new Error('Limite de 100 anúncios da demonstração alcançado.');
  const item = {id:'ITM-'+crypto.randomUUID().slice(0,8).toUpperCase(),
    title, category:data.category, condition:data.condition, description,
    active:true, createdAt:new Date().toISOString()};
  state.items.push(item);
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(statePath, JSON.stringify(state,null,2),'utf8');
  return {success:true, item, summary:summary()};
}
export function setAll(active){const s=getStore();const affected=s.items.filter(i=>i.active!==active).length;s.items=s.items.map(i=>({...i,active}));s.updatedAt=new Date().toISOString();fs.writeFileSync(statePath,JSON.stringify(s,null,2),'utf8');return {success:true,affected,activeCount:s.items.filter(i=>i.active).length,total:s.items.length,message:active?affected+' oferta(s) reativada(s).':affected+' oferta(s) pausada(s).'};}
export function summary(){const s=getStore();return {active:s.items.filter(i=>i.active).length,paused:s.items.filter(i=>!i.active).length,requests:s.requests.length,total:s.items.length,updatedAt:s.updatedAt};}
