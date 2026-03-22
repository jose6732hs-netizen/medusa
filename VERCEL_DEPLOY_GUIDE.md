# 🚀 DEPLOY NO VERCEL - GUIA PASSO A PASSO

## Seu Medusa SaaS está PRONTO para Vercel! 

Você já tem:
- ✅ Backend Medusa configurado
- ✅ Database PostgreSQL (Neon) conectado
- ✅ Secrets gerados
- ✅ Variáveis de ambiente preparadas

---

## 📋 ANTES DE COMEÇAR

Certifique-se que você tem:
1. Conta no **Vercel** (https://vercel.com)
2. Repositório no **GitHub** com o código enviado
3. Este projeto clonado do GitHub no Vercel Dashboard

---

## 🎯 PASSO 1: Obter as Variáveis de Ambiente

Abra o arquivo `.env.production` no seu repositório e COPIE essas variáveis:

```
DATABASE_URL=postgresql://neondb_owner:npg_eYI0o9qOXhTC@ep-super-glade-a4iqxq17-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
JWT_SECRET=aBc1dE2fGhIjKlMnOpQrStUvWxYz3456789012345ABCDefGhIjKlMnOp
COOKIE_SECRET=xYz9876543210AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfG
BACKEND_URL=https://medusa-saas.vercel.app
STORE_CORS=https://medusa-saas.vercel.app
ADMIN_CORS=https://medusa-saas.vercel.app
AUTH_CORS=https://medusa-saas.vercel.app
NODE_ENV=production
```

**IMPORTANTE:** Substitua `medusa-saas` pelo nome do seu projeto no Vercel!

---

## 🎯 PASSO 2: Ir para o Vercel Dashboard

1. Abra: https://vercel.com/dashboard
2. Clique em seu projeto Medusa SaaS
3. Vá para: **Settings** (engrenagem no topo)

---

## 🎯 PASSO 3: Adicionar Environment Variables

1. No menu esquerdo, clique em: **Environment Variables**
2. Você vai ver um formulário com campos **KEY** e **VALUE**

Para cada variável, faça:

### DATABASE_URL
- **KEY:** `DATABASE_URL`
- **VALUE:** Cole a connection string completa do Neon
- Click **Add**

### JWT_SECRET
- **KEY:** `JWT_SECRET`
- **VALUE:** Cole a string do JWT_SECRET do arquivo `.env.production`
- Click **Add**

### COOKIE_SECRET
- **KEY:** `COOKIE_SECRET`  
- **VALUE:** Cole a string do COOKIE_SECRET do arquivo `.env.production`
- Click **Add**

### BACKEND_URL
- **KEY:** `BACKEND_URL`
- **VALUE:** `https://seu-projeto.vercel.app`
- Click **Add**

### STORE_CORS
- **KEY:** `STORE_CORS`
- **VALUE:** `https://seu-projeto.vercel.app`
- Click **Add**

### ADMIN_CORS
- **KEY:** `ADMIN_CORS`
- **VALUE:** `https://seu-projeto.vercel.app`
- Click **Add**

### AUTH_CORS
- **KEY:** `AUTH_CORS`
- **VALUE:** `https://seu-projeto.vercel.app`
- Click **Add**

### NODE_ENV
- **KEY:** `NODE_ENV`
- **VALUE:** `production`
- Click **Add**

---

## 🎯 PASSO 4: Verificar a Configuração

Você deve ver todas as 8 variáveis listadas:

```
DATABASE_URL = postgresql://... ✓
JWT_SECRET = aBc1dE2f... ✓
COOKIE_SECRET = xYz98765... ✓
BACKEND_URL = https://seu-projeto.vercel.app ✓
STORE_CORS = https://seu-projeto.vercel.app ✓
ADMIN_CORS = https://seu-projeto.vercel.app ✓
AUTH_CORS = https://seu-projeto.vercel.app ✓
NODE_ENV = production ✓
```

---

## 🎯 PASSO 5: Fazer Deploy

Opção A - Automático (GitHub conectado):
1. Faça `git push` do seu código
2. Vercel detecta a mudança automaticamente
3. Deploy começa

Opção B - Manual (via Dashboard):
1. Clique em **Deployments** (topo da página)
2. Clique em **Redeploy** do último commit
3. Aguarde a conclusão

---

## ✅ PASSO 6: Validar o Deploy

Quando o deploy terminar:

1. Clique no link do seu projeto (ex: `medusa-saas.vercel.app`)
2. Você verá a página de info do Medusa
3. Para testar o health check, acesse: `https://seu-projeto.vercel.app/health`

Você deve ver um JSON assim:
```json
{
  "status": "ok",
  "timestamp": "2024-03-22T15:30:45.123Z",
  "environment": "production",
  "uptime": 45.2
}
```

---

## 🐛 Se Algo Der Errado

### Erro: "Service Unavailable"
- Verifique se DATABASE_URL está correto
- Certifique-se que o Neon está acessível de fora
- Aguarde 2-3 minutos para o deploy completar

### Erro: "JWT_SECRET não configurado"
- Volte ao Dashboard → Environment Variables
- Verifique se JWT_SECRET e COOKIE_SECRET estão configurados
- Certifique-se que NODE_ENV=production
- Faça um redeploy

### Erro: "CORS rejeitado"
- Verifique se STORE_CORS, ADMIN_CORS e AUTH_CORS apontam para seu domínio
- Use `https://` não `http://`
- Se for um frontend separado, coloque a URL correta do frontend

### Ver Logs
- Clique em **Deployments** no Vercel Dashboard
- Clique em **Logs** para ver o que aconteceu

---

## 🎉 SUCESSO!

Seu Medusa SaaS Multi-Tenant está VIVO e pronto para:
- ✅ Aceitar tenants (lojas)
- ✅ Gerenciar produtos
- ✅ Processar pedidos
- ✅ Autenticação de usuários
- ✅ Super admin dashboard

**URL:** `https://seu-projeto.vercel.app`

---

## 📞 Próximos Passos

1. **Testar a API:** Use Postman ou curl para testar endpoints
2. **Conectar Frontend:** Configure CORS para seu frontend
3. **Customização:** Adicione lógica de multi-tenant específica
4. **Monitoramento:** Configure alertas no Vercel

---

**Parabéns! Seu SaaS está online! 🚀**
