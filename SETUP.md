# 🚀 Medusa SaaS Multi-Tenant Platform

Sua plataforma de e-commerce multi-tenant (tipo Shopify) construída com Medusa.

## 📋 O que você terá

- ✅ **Backend Medusa** com suporte a multi-tenant
- ✅ **Sistema de Login & Cadastro** para tenants
- ✅ **Super Admin Dashboard** para gerenciar todas as lojas
- ✅ **Cada tenant tem sua própria loja** com produtos, pedidos, clientes
- ✅ **Autenticação JWT** segura
- ✅ **CORS configurável** para frontend

## 🛠️ Configuração Rápida

### 1️⃣ Gerar Variáveis de Ambiente

```bash
node scripts/generate-env.js
```

Isso vai criar um arquivo `.env` com chaves seguras geradas automaticamente.

### 2️⃣ Editar o .env

Abra `.env` e configure:

```env
# Sua DATABASE_URL do Neon PostgreSQL
DATABASE_URL=postgresql://user:password@region.neon.tech/medusa_saas?sslmode=require

# URLs do seu frontend e admin
STORE_CORS=http://localhost:3001          # URL da loja cliente
ADMIN_CORS=http://localhost:3002          # URL do painel admin
BACKEND_URL=http://localhost:3000         # URL deste backend

# Super admin (mude apos primeiro login!)
SUPER_ADMIN_EMAIL=seu-email@seu-saas.com
SUPER_ADMIN_PASSWORD=valor-em-producao
```

### 3️⃣ Instalar Dependências

```bash
pnpm install
# ou npm install ou yarn install
```

### 4️⃣ Rodar o Servidor

```bash
npm run dev
```

O servidor vai iniciar em `http://localhost:3000`

Você vai ver no console:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## 📚 Estrutura do Projeto

```
.
├── packages/
│   ├── medusa/              # Core Medusa (backend, entities, services)
│   ├── admin/
│   │   └── dashboard/       # Admin Dashboard (gerenciar lojas, produtos)
│   └── ...
├── medusa-config.js         # Configuração do Medusa
├── server.js                # Servidor Node.js que inicia tudo
├── .env                     # Variáveis de ambiente (gitignore)
└── .env.example             # Template de variáveis
```

## 🏗️ Conceitos Multi-Tenant

### Super Admin
- **Você** - proprietário da plataforma
- Acessa o painel admin em `http://localhost:3002`
- Email: configurado em `SUPER_ADMIN_EMAIL`
- Pode gerenciar todos os tenants (lojas)

### Tenant (Loja)
- Cada cliente é um **tenant**
- Tem sua própria loja (`http://localhost:3001/tenant-slug`)
- Seus próprios produtos, pedidos, clientes
- Dados completamente isolados via `organization_id`

### Fluxo
1. Cliente faz cadastro → cria uma nova **organization** (tenant)
2. Cliente faz login → acessa a **sua** loja
3. Você (super admin) acessa admin dashboard → vê todas as lojas

## 🔐 Segurança

- **JWT_SECRET**: usado para assinar tokens JWT (não compartilhe!)
- **COOKIE_SECRET**: usado para sessões seguras
- **DATABASE_URL**: nunca commite no git, use variáveis de ambiente
- Em produção: use HTTPS, variáveis seguras, e configure CORS adequadamente

## 🌐 Próximos Passos

1. **Conectar seu frontend** (já pronto) à API do Medusa
2. **Criar as migrations** do banco de dados
3. **Seeder**: popular dados iniciais (produtos de exemplo, categorias)
4. **Deploy**: colocar em produção (Vercel, AWS, etc)

## 📖 Documentação

- [Medusa Docs](https://docs.medusajs.com)
- [Admin API](https://docs.medusajs.com/api/admin)
- [Store API](https://docs.medusajs.com/api/store)

## ❓ Dúvidas

Se tiver problemas ao rodar ou com configuração:
- Verifique se o `.env` está correto
- Confirme se o PostgreSQL (Neon) está acessível
- Cheque os logs do servidor para erros

---

**Seu SaaS multi-tenant está pronto para começar! 🚀**
