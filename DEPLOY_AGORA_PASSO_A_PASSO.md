DEPLOY SEU MEDUSA SAAS NO VERCEL - PASSO A PASSO
===============================================

Você conectou o repositório Git com sucesso! Agora precisa fazer o PRIMEIRO DEPLOY.

Siga os passos abaixo EXATAMENTE NESTA ORDEM:

PASSO 1: Abra o terminal (CMD/PowerShell no Windows ou Terminal no Mac/Linux)
─────────────────────────────────────────────────────────────────────────────

PASSO 2: Navegue até a pasta do projeto
─────────────────────────────────────────────────────────────────────────────
Copie e cole no terminal:

   cd seu/caminho/para/medusa

PASSO 3: Adicione os arquivos modificados ao Git
─────────────────────────────────────────────────────────────────────────────
Copie e cole no terminal:

   git add .

PASSO 4: Faça um commit
─────────────────────────────────────────────────────────────────────────────
Copie e cole no terminal:

   git commit -m "Deploy: Medusa SaaS multi-tenant pronto para produção"

PASSO 5: Faça push para o GitHub
─────────────────────────────────────────────────────────────────────────────
Copie e cole no terminal:

   git push origin develop

(Se usa main em vez de develop, use: git push origin main)

─────────────────────────────────────────────────────────────────────────────

PRONTO! Agora o Vercel vai:
1. Receber o push do seu código
2. Começar o build automaticamente
3. Instalar as dependências
4. Fazer deploy em produção

Aguarde 2-5 MINUTOS e seu SaaS estará ONLINE!

ACOMPANHE O DEPLOY:
─────────────────────────────────────────────────────────────────────────────
1. Volte para https://vercel.com/dashboard
2. Clique no projeto "medusa"
3. Veja o build rodando em tempo real
4. Quando terminar, você verá uma URL: https://seu-projeto.vercel.app

TESTE SEU SAAS:
─────────────────────────────────────────────────────────────────────────────
Após o deploy terminar, abra no navegador:

   https://seu-projeto.vercel.app

Você verá uma página com informações do Medusa!

TESTE O HEALTH CHECK:
─────────────────────────────────────────────────────────────────────────────
   https://seu-projeto.vercel.app/health

Resposta esperada:
{
  "status": "ok",
  "timestamp": "2024-03-22T...",
  "environment": "production",
  "uptime": 123
}

─────────────────────────────────────────────────────────────────────────────

PRONTO! Seu Medusa SaaS está online!

Próximos passos:
- Conectar seu frontend da loja
- Criar primeiro tenant (loja cliente)
- Começar a vender!

Qualquer dúvida, revise os guias:
- VERCEL_DEPLOY_GUIDE.md
- PRODUCTION.md
- COMO_ACESSAR.md
