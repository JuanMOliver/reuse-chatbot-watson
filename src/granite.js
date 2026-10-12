import { demoChat } from './chat-demo.js';

const normalize = (text) => String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const actionPhrases = [
  /\b(pausar|suspender|desativar)\b.*\b(oferta|anuncio|anuncios|item|itens)\b/,
  /\b(reativar|ativar|retomar)\b.*\b(oferta|anuncio|anuncios|item|itens)\b/,
  /\b(minhas ofertas|meus anuncios|meus itens|listar|quantos anuncios|ver ofertas|minhas solicitacoes|meus pedidos|solicitacoes recebidas|pedidos recebidos|troca recebida|status da troca|acompanhar troca)\b/,
  /^(sim|confirmar|confirmo|pode|ok|yes|nao|cancelar|voltar|desistir)$/,
  /^(oi|ola|ajuda|menu|inicio|comecar|bom dia|boa tarde|boa noite)$/
];
const quickReplies = ['Ver minhas ofertas', 'Pausar anúncios', 'Reativar anúncios', 'Como cadastrar um item'];
const knowledge = `Você é o assistente virtual ReUse, uma plataforma fictícia para trocar e reutilizar objetos.
Responda exclusivamente em português do Brasil, com objetividade e clareza. Não invente funcionalidades.
Guia de cadastro: Meus itens > Adicionar item > preencher título, categoria, conservação, fotos e descrição > revisar > publicar.
Guia de troca: Explorar itens > abrir anúncio > Solicitar troca > selecionar o item oferecido > negociar pelo chat > combinar entrega.
Guia de favoritos: tocar no coração do anúncio e visualizar na aba Favoritos.
Guia de segurança: conferir anúncios, conversar pela plataforma, evitar compartilhar senhas, reunir-se em local público, inspecionar os itens.
Operações existentes: consultar ofertas, consultar solicitações, pausar e reativar todas as ofertas após confirmação explícita.
As operações executadas por outros módulos usam apenas itens fictícios locais. Não alegue ter executado uma ação nem atualizado um anúncio.
Quando a pergunta estiver fora dessas instruções, explique que só oferece orientações sobre ReUse.`;

export function isAction(message) { return actionPhrases.some(pattern => pattern.test(normalize(message))); }
export async function graniteChat(message, sessionId, options = {}) {
  if (isAction(message)) {
    const response = demoChat(message, sessionId);
    return {...response, mode: 'granite', source: 'automacao-controlada'};
  }
  const endpoint = (options.ollamaUrl || process.env.OLLAMA_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
  const model = options.model || process.env.OLLAMA_MODEL || 'granite3.3:2b';
  let response;
  try {
    response = await fetch(endpoint + '/api/chat', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({ model, stream: false, messages: [{role:'system', content:knowledge}, {role:'user', content:message}], options:{temperature:0.2} }),
      signal: AbortSignal.timeout(45_000)
    });
  } catch {
    throw new Error('O Ollama não está acessível. Instale e abra o Ollama, execute: ollama pull ' + model);
  }
  if (!response.ok) {
    const detail = await response.text().catch(()=> '');
    if (response.status === 404 || /model.*not found/i.test(detail)) {
      throw new Error('Modelo IBM Granite não instalado. Execute: ollama pull ' + model);
    }
    throw new Error('Falha ao consultar modelo Granite (' + response.status + ').');
  }
  const data = await response.json();
  const content = data?.message?.content?.trim();
  if (!content) throw new Error('Modelo Granite não retornou texto.');
  return {messages:[content.slice(0,3500)], quickReplies, mode:'granite', source:'ibm-granite-local', model};
}
