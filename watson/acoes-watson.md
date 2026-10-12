# Fluxos para IBM watsonx Assistant — ReUse!

**Status:** especificação implementável, não importação automática nem prova de integração IBM ativa.

## Ação: pausar ofertas
Frases: “quero pausar minhas ofertas”, “desativar todos os anúncios”, “suspender meus itens”.
1. Chamar GET /api/extension/items para verificar ofertas ativas.
2. Informar quantidade e perguntar se confirma (Sim/Cancelar).
3. Apenas após confirmação explícita, chamar POST /api/extension/items/pause-all.
4. Informar affected e activeCount retornados. Em caso de cancelamento, não chamar POST.

## Ação: reativar ofertas
Frases: “reativar meus anúncios”, “voltar a oferecer itens”.
1. Consultar GET /api/extension/items.
2. Solicitar confirmação antes de POST /api/extension/items/resume-all.
3. Confirmar quantas ofertas foram reativadas.

## Ação: consultar anúncios
Frases: “meus itens”, “quais anúncios estão ativos”.
Chamar GET /api/extension/items e listar título e estado dos itens.

## Ação: consultar solicitações
Frases: “tenho propostas?”, “mostrar pedidos de troca”.
Chamar GET /api/extension/trades e apresentar os estados.

## Tutoriais
- **Cadastrar**: Meus itens → Adicionar item → título, categoria, conservação → fotos → descrição → publicar.
- **Trocar**: Explorar → abrir item → Solicitar troca → selecionar item oferecido → negociar no chat → verificar antes de concluir.
- **Favoritos**: coração do anúncio → menu Favoritos.
- **Segurança**: validar descrição, conversar pela plataforma, encontro público, nunca informar senhas.

## Configuração
1. Criar assistant no IBM Cloud; obter URL, API key, Environment ID.
2. Publicar backend em HTTPS; definir segredo forte EXTENSION_API_KEY.
3. Importar watson/reuse-extension.openapi.json em Build custom extension, usando token via header x-reuse-extension-key.
4. Conectar extensão ao assistant e criar Actions/steps conforme acima.
5. Testar em Draft; registrar prints reais do IBM e publicar Live.
6. Ativar ASSISTANT_MODE=watson no backend e preencher variáveis IBM.

**Limitação do MVP:** backend single-user com JSON fictício. Em produção exigir identidade do usuário, autorização por proprietário e banco transacional.
