import test from 'node:test';
import assert from 'node:assert/strict';
import {isAction,graniteChat} from '../src/granite.js';
import {resetStore,summary} from '../src/store.js';
test('Classifica operações sensíveis sem enviar a IA',()=>{assert.equal(isAction('quero pausar minhas ofertas'),true);assert.equal(isAction('como cadastrar item?'),false);});
test('Pausa continua exigindo confirmação',async()=>{resetStore();let r=await graniteChat('pausar anúncios','granite-test');assert.equal(r.source,'automacao-controlada');assert.equal(summary().active,3);await graniteChat('sim','granite-test');assert.equal(summary().active,0);});
test('Resposta informativa usa API Ollama simulada',async()=>{const original=globalThis.fetch;globalThis.fetch=async()=>({ok:true,json:async()=>({message:{content:'Para cadastrar, abra Meus itens.'}})});try{const r=await graniteChat('Como cadastrar item?','granite-faq',{ollamaUrl:'http://127.0.0.1:11434'});assert.equal(r.source,'ibm-granite-local');assert.match(r.messages[0],/Meus itens/);}finally{globalThis.fetch=original;}});
