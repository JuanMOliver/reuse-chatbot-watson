const itemsEl=document.querySelector('#items'),messages=document.querySelector('#messages'),quick=document.querySelector('#quick'),input=document.querySelector('#message');const sessionId='visitor-'+Math.random().toString(36).slice(2);
function bubble(t,who){const d=document.createElement('div');d.className='bubble '+who;d.textContent=t;messages.append(d);messages.scrollTop=messages.scrollHeight;}
async function refresh(){const r=await fetch('/api/items');const d=await r.json();document.querySelector('#active').textContent=d.summary.active;document.querySelector('#paused').textContent=d.summary.paused;document.querySelector('#requests').textContent=d.summary.requests;itemsEl.replaceChildren();for(const i of d.items){const p=document.createElement('div');p.className='item';const title=document.createElement('div');const b=document.createElement('b');b.textContent=i.title;const small=document.createElement('small');small.textContent=i.category+' • '+i.condition;title.append(b,small);const status=document.createElement('span');status.textContent=i.active?'Ativo':'Pausado';status.className=i.active?'active':'paused';p.append(title,status);itemsEl.append(p);}}
async function send(value){const message=value.trim();if(!message)return;bubble(message,'user');input.value='';quick.replaceChildren();try{const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message,sessionId})});const d=await r.json();if(!r.ok)throw Error(d.error||'Falha');for(const m of d.messages||[])bubble(m,'bot');if(d.openItemForm)openItemForm();for(const t of d.quickReplies||[]){const b=document.createElement('button');b.textContent=t;b.addEventListener('click',()=>send(t));quick.append(b);}await refresh();}catch(e){bubble('Erro: '+e.message,'bot');}}
document.querySelector('#chatForm').addEventListener('submit',e=>{e.preventDefault();send(input.value);});bubble('Olá! Sou o assistente ReUse. Posso pausar e reativar anúncios, mostrar ofertas e orientar suas trocas.','bot');for(const t of ['Ver minhas ofertas','Pausar anúncios','Como cadastrar item']){const b=document.createElement('button');b.textContent=t;b.addEventListener('click',()=>send(t));quick.append(b);}refresh();
const itemDialog=document.querySelector('#itemDialog'),itemForm=document.querySelector('#itemForm');
function openItemForm(){document.querySelector('#itemError').textContent='';itemDialog.showModal();document.querySelector('#itemTitle').focus();}
document.querySelector('#openNewItem').addEventListener('click',openItemForm);
document.querySelector('#closeItem').addEventListener('click',()=>itemDialog.close());
document.querySelector('#cancelItem').addEventListener('click',()=>itemDialog.close());
itemForm.addEventListener('submit',async e=>{
 e.preventDefault();const save=document.querySelector('#saveItem');save.disabled=true;
 const payload=Object.fromEntries(new FormData(itemForm).entries());
 try{const r=await fetch('/api/items',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
 const d=await r.json();if(!r.ok)throw new Error(d.error||'Não foi possível publicar o item.');
 itemDialog.close();itemForm.reset();await refresh();
 bubble('Seu item "'+d.item.title+'" foi cadastrado e está ativo!','bot');
 }catch(error){document.querySelector('#itemError').textContent=error.message;}finally{save.disabled=false;}
});
