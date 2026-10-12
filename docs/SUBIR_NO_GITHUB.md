# Entrega FIAP — Juan Marco Oliver, RM 564575

Repositório público: https://github.com/JuanMOliver/reuse-chatbot-watson

## O que comprovar
- Automações: pausa, reativação, consulta de ofertas e pedidos via backend demonstrativo.
- Orientações: cadastro, troca, favoritos e segurança.
- IBM Watson: arquitetura e extensão OpenAPI preparadas, **integração em nuvem pendente de configuração e validação**.

## Instalar
Node.js 20+, copiar .env.example para .env e executar npm start; testar com npm test.

## Para o IBM
Configurar assistant, criar ações de watson/acoes-watson.md, publicar backend HTTPS, importar extensão watson/reuse-extension.openapi.json, configurar segredo do header e testar na IBM. Nunca publicar .env.

## Atenção
O código publicado serve ao MVP local; não equivale à implantação no ambiente IBM nem à automação no banco de produção da ReUse.
