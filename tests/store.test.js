import test from 'node:test';import assert from 'node:assert/strict';import {resetStore,summary,setAll,listItems,requests} from '../src/store.js';import {demoChat} from '../src/chat-demo.js';
test('Inventário inicial e solicitações',()=>{resetStore();assert.equal(listItems().length,4);assert.equal(requests().length,2);});
test('Pausar exige confirmação explícita e salva',()=>{resetStore();demoChat('pausar anúncios','p1');assert.equal(summary().active,3);demoChat('sim','p1');assert.equal(summary().active,0);});
test('Cancelar mantém ofertas',()=>{resetStore();demoChat('pausar anúncios','p2');demoChat('cancelar','p2');assert.equal(summary().active,3);});
test('Reativar anúncios',()=>{resetStore();setAll(false);demoChat('reativar anúncios','p3');demoChat('sim','p3');assert.equal(summary().active,4);});
test('Orientações cadastro e troca',()=>{assert.match(demoChat('como cadastrar um item','p4').messages[0],/Adicionar item/);assert.match(demoChat('como funciona a troca','p5').messages[0],/Solicitar troca/);});
test('Operação idempotente',()=>{resetStore();assert.equal(setAll(false).affected,3);assert.equal(setAll(false).affected,0);});