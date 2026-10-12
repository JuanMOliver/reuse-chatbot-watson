import test from 'node:test';
import assert from 'node:assert/strict';
import {resetStore,createItem,listItems,summary} from '../src/store.js';
import {demoChat} from '../src/chat-demo.js';
import {graniteChat} from '../src/granite.js';
test('Novo item é salvo e incrementa inventário',()=>{
 resetStore();const before=summary().total;
 const r=createItem({title:'Skate usado',category:'Esportes',condition:'Bom estado',description:'Pouco uso.'});
 assert.equal(r.success,true);assert.equal(summary().total,before+1);assert.equal(listItems().at(-1).title,'Skate usado');
});
test('Cadastro recusa valores inválidos',()=>{
 resetStore();assert.throws(()=>createItem({title:'A',category:'Outros',condition:'Novo'}),/nome/);
 assert.throws(()=>createItem({title:'Skate usado',category:'Inexistente',condition:'Novo'}),/categoria/);
});
test('Pedido para cadastrar abre formulário via chatbot e Granite',async()=>{
 resetStore();assert.equal(demoChat('Quero cadastrar um item','novo-cadastro').openItemForm,true);
 const r=await graniteChat('Quero cadastrar um item','novo-granite');
 assert.equal(r.openItemForm,true);
 assert.equal(r.source,'automacao-controlada');
});
