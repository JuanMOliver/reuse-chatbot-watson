# ReUse! — chatbot e automações com IBM watsonx Assistant

Projeto acadêmico FIAP — Juan Marco Oliver (RM 564575).

MVP local de chatbot com ações para consultar ofertas, pausar e reativar anúncios, acompanhar solicitações e orientar usuários da plataforma ReUse. Implementação demonstrativa em Node.js e frontend web, com integração Watson configurável. **O modo local não prova uma conexão ativa com IBM Watson**; consulte `watson/` para configurar, publicar e validar a integração.

## Execução

Requer Node.js 20+.

```bash
cp .env.example .env
npm start
# http://localhost:3000
npm test
```

O modo `demo` usa dados fictícios persistidos em JSON. Configure `ASSISTANT_MODE=watson`, `IBM_WATSON_APIKEY`, `IBM_WATSON_URL`, `IBM_WATSON_ENVIRONMENT_ID` para conectar uma instância real; configure também extensão OpenAPI HTTPS e credencial secreta.

As operações de demonstração não usam o banco de produção da ReUse. Não publique credenciais no GitHub. APIs para integração estão em `/api/extension` com cabeçalho `x-reuse-extension-key`.

## Entrega acadêmica

Este repositório contém código, configuração, testes e instruções. A integração IBM real exige credenciais e validação externa. O PDF da entrega é fornecido separadamente.