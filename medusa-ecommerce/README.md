# Medusa ECommerce - Plataforma Multi-Tenant

Uma plataforma de ecommerce moderna e escalável, inspirada na arquitetura do Medusa, com suporte a múltiplas lojas (multi-tenant).

## 🚀 Features

- ✅ **Multi-Tenant**: Gerencie múltiplas lojas em uma única plataforma
- 🛍️ **Gestão de Produtos**: CRUD completo com categorias e variantes
- 🛒 **Carrinho e Checkout**: Integração com Stripe para pagamentos seguros
- 📦 **Gestão de Pedidos**: Rastreamento completo de pedidos
- 📊 **Painel Admin**: Dashboard com métricas e relatórios
- 🔐 **Autenticação Robusta**: Sistema de roles (admin, vendor, customer) e permissões
- 💾 **PostgreSQL**: Banco de dados relacional escalável
- 🎨 **UI Moderna**: Tailwind CSS + Componentes customizados

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Authentication**: NextAuth + JWT
- **Styling**: Tailwind CSS + Custom Components
- **Payments**: Stripe
- **Validation**: Zod

## 📋 Pré-requisitos

- Node.js 18+
- npm ou pnpm
- PostgreSQL (ou Neon)
- Conta Stripe

## 🔧 Instalação

### 1. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```
DATABASE_URL=postgresql://user:password@host:5432/medusa_ecommerce
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Execute o script de setup

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Ou manualmente:

```bash
npm install
npm run db:generate
npm run db:push
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## 📱 Estrutura de Pastas

```
medusa-ecommerce/
├── app/
│   ├── (storefront)/          # Frontend da loja
│   ├── (admin)/               # Painel administrativo
│   ├── api/                   # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                    # Componentes base (Button, Input, etc)
│   ├── forms/                 # Formulários
│   └── admin/                 # Componentes admin
├── db/
│   ├── schema.ts              # Schema Drizzle
│   └── migrations/            # Migrações do banco
├── lib/
│   ├── db.ts                  # Cliente do banco
│   ├── auth.config.ts         # Configuração de auth
│   ├── jwt.ts                 # JWT utils
│   ├── validations.ts         # Schemas Zod
│   └── utils.ts               # Funções auxiliares
└── middleware.ts              # Middleware de autenticação
```

## 🔐 Autenticação

### Roles

- **Admin**: Acesso total à plataforma (Super Admin)
- **Vendor**: Acesso ao painel de sua loja
- **Customer**: Acesso ao storefront

### Fluxo de Login

1. Usuário faz login em `/login`
2. Credenciais são validadas contra o banco
3. JWT é gerado e armazenado em cookie HTTP-only
4. Middleware valida o token em rotas protegidas

## 🗄️ Modelo de Dados

### Tabelas Principais

- **users**: Usuários (admin, vendor, customer)
- **stores**: Lojas/Tenants
- **products**: Produtos
- **product_variants**: Variantes de produtos
- **categories**: Categorias
- **carts**: Carrinhos de compras
- **orders**: Pedidos
- **payments**: Pagamentos

## 🚀 Roadmap

- [x] Setup base (Next.js, Neon, Auth)
- [ ] Gestão de lojas (multi-tenant)
- [ ] Gestão de produtos
- [ ] Carrinho e checkout
- [ ] Gestão de pedidos
- [ ] Painel admin com métricas
- [ ] Polishing e deploy

## 📝 API Endpoints

### Autenticação

- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout

### Lojas (Em desenvolvimento)

- `GET /api/stores` - Listar lojas
- `POST /api/stores` - Criar loja
- `GET /api/stores/:id` - Detalhes da loja
- `PUT /api/stores/:id` - Atualizar loja
- `DELETE /api/stores/:id` - Deletar loja

### Produtos (Em desenvolvimento)

- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `GET /api/products/:id` - Detalhes do produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

## 🧪 Testes

```bash
npm run test
```

## 📦 Deploy

### Deploy no Vercel

```bash
npm install -g vercel
vercel
```

Lembre-se de configurar as variáveis de ambiente no painel do Vercel.

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues e pull requests.

## 📞 Suporte

Para suporte, abra uma issue neste repositório.
