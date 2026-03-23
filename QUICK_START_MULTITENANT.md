# 🚀 Guia Rápido - MultiTenant Admin Panel

Bem-vindo! Aqui está como começar como super admin do seu sistema multi-tenant.

## 1️⃣ Preparação Inicial (5 min)

### Copiar variáveis de ambiente

```bash
cd packages/multitenant-admin
cp .env.example .env.local
```

### Editar `.env.local`

```env
# Neon Connection String (coloque sua DATABASE_URL do Neon aqui)
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-1.neon.tech/database?sslmode=require

# JWT Secret (use algo seguro em produção)
JWT_SECRET=sua-chave-super-secreta-mude-em-producao-!!!

# Node Environment
NODE_ENV=development

# URLs
NEXT_PUBLIC_API_URL=http://localhost:3001

# Super Admin (será criado no banco)
SUPER_ADMIN_EMAIL=admin@multitenant.com
SUPER_ADMIN_PASSWORD=admin123456
```

## 2️⃣ Configurar Banco de Dados (10 min)

### Via CLI Neon

1. Vá para [console.neon.tech](https://console.neon.tech)
2. Abra o Query Editor
3. Copie o conteúdo de `scripts/01-create-multitenant-schema.sql`
4. Execute na interface web do Neon

### Ou via psql (se tiver localmente)

```bash
psql "sua-database-url-neon" -f scripts/01-create-multitenant-schema.sql
```

## 3️⃣ Setup Super Admin (5 min)

```bash
# Instalar dependências
npm install

# Setup super admin com bcrypt
npm run setup
```

Isso vai:
- ✅ Gerar hash seguro da senha
- ✅ Criar você como super admin
- ✅ Criar primeiro tenant de exemplo
- ✅ Criar usuário owner no tenant

## 4️⃣ Iniciar Desenvolvimento (2 min)

```bash
npm run dev
```

Acesse: **http://localhost:3001**

### Login como Super Admin

```
Email: admin@multitenant.com
Senha: admin123456
```

## 5️⃣ Primeiras Ações

Uma vez logado como super admin:

### ✅ Seu Dashboard

- Ver estatísticas gerais
- Visualizar atividades recentes
- Status do sistema

### ✅ Gerenciar Tenants

1. Clique em **"Tenants"** no menu
2. Clique em **"Novo Tenant"**
3. Preencha:
   - Nome: `Minha Empresa`
   - Slug: `minha-empresa` (único, apenas letras e hífens)
   - Subdomain: `minha-empresa` (será: minha-empresa.app.com)
   - Email de Faturamento: `billing@minha-empresa.com`

4. Clique em **"Criar Tenant"**

### ✅ Convidar Usuários para Tenant

Dentro de um tenant, convide usuários:

```
POST /api/admin/users

{
  "tenant_id": "uuid-do-tenant",
  "email": "usuario@empresa.com",
  "role": "admin"
}
```

### ✅ Gerenciar Permissões

Roles disponíveis:

| Role | Permissões |
|------|-----------|
| **owner** | Total acesso, gerenciar tudo, faturamento |
| **admin** | Gerenciar usuários, dados, relatórios |
| **user** | Acesso normal aos recursos |
| **viewer** | Apenas visualizar, sem edições |

## 6️⃣ Estrutura do Seu Negócio

```
Você (Super Admin)
├── Tenant 1 (Empresa 1)
│   ├── Admin User
│   ├── Regular User
│   └── Viewer
├── Tenant 2 (Empresa 2)
│   ├── Owner User
│   └── ...
└── Tenant N
    └── ...
```

## 7️⃣ Chaves de Negócio

### Multi-Tenant com Subdomínios

- Cada tenant: `{slug}.app.com`
- Dados isolados por tenant_id
- Usuários vinculados a um tenant específico

### Faturamento Flexível

- Plano Free: Sem custos
- Plano Starter: R$ 29,90/mês
- Plano Pro: R$ 99,90/mês
- Plano Enterprise: Customizado

Você pode atualizar planos no banco:

```sql
UPDATE tenants SET plan = 'pro' WHERE slug = 'minha-empresa';
```

### Segurança

- Senhas com bcrypt (não armazenar em texto plano)
- Tokens JWT com expiração
- Auditoria de tudo que acontece
- Isolamento de dados por tenant

## 8️⃣ Próximos Passos

### Customizar Design

1. Abra `app/globals.css`
2. Edite cores, fontes, espaçamento
3. Customize conforme sua marca

### Adicionar Mais Funcionalidades

```
# Copiar componente de exemplo
components/Header.tsx → components/NewComponent.tsx

# Criar novo endpoint
app/api/admin/novo-recurso/route.ts

# Criar nova página
app/dashboard/novo-recurso/page.tsx
```

### Integrar Stripe (Pagamentos)

```bash
npm install stripe @stripe/stripe-js
```

```typescript
// app/api/admin/billing/checkout/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  // Criar checkout session
}
```

### Deploy para Vercel

```bash
# 1. Conecte seu repo do GitHub
# 2. No Vercel, configure variáveis:
DATABASE_URL=...
JWT_SECRET=...

# 3. Deploy automático quando pushar
```

## 🆘 Problemas Comuns

### "DATABASE_URL not set"
```bash
# Verifique .env.local existe
cat .env.local

# Ou configure:
export DATABASE_URL="postgresql://..."
```

### "Erro ao conectar ao banco"
```bash
# Teste a conexão
psql "seu-database-url"

# Se Neon, verifique:
# - Host está correto
# - Senha está correta
# - Network está configurado
```

### "Senha do super admin não funciona"
```bash
# Re-execute o setup
npm run setup

# Você será solicitado a digitar nova senha
```

## 📚 Documentação Completa

Veja `README.md` para:
- Arquitetura completa
- Todos os endpoints da API
- Estrutura do banco de dados
- Instruções de produção
- Troubleshooting avançado

## 🎯 Checklist de Início

- [ ] .env.local configurado
- [ ] Database schema criado
- [ ] Super admin setup completado
- [ ] `npm run dev` funcionando
- [ ] Consegui fazer login em http://localhost:3001
- [ ] Criei um novo tenant
- [ ] Entendo a estrutura multi-tenant

## 💡 Dicas

1. **Sempre use slugs únicos** - Sistema não permite duplicatas
2. **Subdomínios = marca do tenant** - Use algo reconhecível
3. **Backup do banco regularmente** - Especialmente antes de grandes mudanças
4. **Revise logs de auditoria** - Ótima forma de debugar problemas
5. **Use JWT_SECRET forte em produção** - Mínimo 32 caracteres aleatórios

## 🚀 Você está pronto!

Agora é hora de:

1. Configurar seu design personalizado
2. Convidar primeiros tenants
3. Adicionar recursos conforme necessário
4. Escalar seu negócio SaaS

**Boa sorte! 🎉**

---

*Precisa de ajuda? Visite a documentação completa em README.md*
