import {listItems,requests,setAll,summary} from './store.js';
const pending=new Map();
const norm=t=>String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const menu=['Ver minhas ofertas','Pausar anúncios','Reativar anúncios','Como cadastrar item'];
const reply=(text,quickReplies=menu)=>({messages:[text],quickReplies,mode:'demo'});
export function demoChat(text,sessionId='anonymous'){
 const t=norm(text), state=pending.get(sessionId);
 if(state){
  if(/^(sim|confirmar|confirmo|pode|ok|yes)$/.test(t)){pending.delete(sessionId);const r=setAll(state==='pause'?false:true);return reply(r.message+' Agora você tem '+r.activeCount+' anúncio(s) ativo(s).');}
  if(/^(nao|cancelar|voltar|desistir)$/.test(t)){pending.delete(sessionId);return reply('Operação cancelada. Nenhuma oferta foi alterada.');}
  return reply('Confirme com Sim ou Cancelar.',['Sim','Cancelar']);
 }
 if(/(pausar|suspender|desativar).*(oferta|anunci|item)|^pausar$/.test(t)){const n=summary().active;if(!n)return reply('Não há ofertas ativas para pausar.');pending.set(sessionId,'pause');return reply('Você tem '+n+' oferta(s) ativa(s). Deseja pausar todas?',['Sim','Cancelar']);}
 if(/(reativar|ativar|retomar).*(oferta|anunci|item)|^reativar$/.test(t)){const n=summary().paused;if(!n)return reply('Todas as ofertas já estão ativas.');pending.set(sessionId,'resume');return reply('Deseja reativar '+n+' oferta(s) pausada(s)?',['Sim','Cancelar']);}
 if(/(minhas ofertas|meus anuncios|meus itens|listar|quantos anuncios|ver ofertas)/.test(t))return reply('Você possui: '+listItems().map(i=>i.title+' ('+(i.active?'ativo':'pausado')+')').join('; '));
 if(/(solicitac|pedido|troca recebida|status da troca|acompanhar troca)/.test(t))return reply('Solicitações: '+requests().map(r=>r.id+' — '+r.item+': '+r.status).join('; '));
 if(/(quero|preciso|desejo|pode|abrir|iniciar|novo).*(cadastrar|adicionar|publicar|anunciar|novo item)|^(cadastrar|adicionar|publicar) (um |novo )?item$/.test(t))return {...reply('Vou abrir o formulário de cadastro. Preencha os dados e clique em Publicar item.'),openItemForm:true};
 if(/(cadastrar|publicar|anunciar|adicionar).*item|como.*(anunci|item|produto)|novo anuncio/.test(t))return reply('Como cadastrar: 1. Abra Meus itens; 2. Selecione Adicionar item; 3. Informe título, categoria e estado; 4. Adicione fotos e descrição; 5. Revise e publique.');
 if(/(como.*troca|realizar.*troca|funciona.*troca|trocar produto)/.test(t))return reply('Como trocar: 1. Explore os itens; 2. Abra o anúncio; 3. Clique em Solicitar troca e indique seu item; 4. Aguarde a resposta; 5. Combine a entrega pelo chat e confira os itens.');
 if(/(seguranca|golpe|confiavel|cuidados)/.test(t))return reply('Segurança: confira fotos; converse pela ReUse; combine encontros públicos; verifique os itens; não compartilhe senhas.');
 if(/(favorito|salvar item|curtir anuncio)/.test(t))return reply('Toque no coração do anúncio para salvá-lo. Abra Favoritos no menu para rever.');
 if(/(ola|oi|bom dia|boa tarde|ajuda|menu|comecar|inicio)/.test(t)||!t)return reply('Olá! Sou o assistente da ReUse. Posso consultar, pausar e reativar ofertas e explicar como usar a plataforma.');
 return reply('Experimente: pausar anúncios, ver minhas ofertas ou como cadastrar item.');
}
