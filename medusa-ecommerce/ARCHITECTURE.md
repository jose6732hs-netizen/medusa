# Arquitetura do Medusa ECommerce

## 📐 Visão Geral

O Medusa ECommerce é uma plataforma de ecommerce multi-tenant construída com Next.js 16, TypeScript e PostgreSQL. A arquitetura segue padrões modernos de desenvolvimento web com separação clara de responsabilidades.

## 🏗️ Estrutura de Pastas

```
medusa-ecommerce/
├── app/
│   ├── api/              # Route Handlers (API endpoints)
│   ├── dashboard/        # Páginas do admin/vendor
│   ├── storefront/       # Páginas públicas da loja
│   ├── auth/             # Páginas de login/registro
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout raiz
│   └── page.tsx          # Homepage
├── components/
│   ├── ui/               # Componentes base (Button, Input, etc)
│   ├── navbar.tsx        # Barra de navegação
│   └── dashboard-sidebar.tsx  # Sidebar do dashboard
├── db/
│   └── schema.ts         # Definição do schema Drizzle
├── lib/
│   ├── auth.config.ts    # Configuração NextAuth
│   ├── db.ts             # Conexão com banco
│   ├── jwt.ts            # Utilitários JWT
│   ├── types.ts          # Tipos TypeScript
│   ├── api-client.ts     # Cliente HTTP
│   ├── constants.ts      # Constantes da app
│   ├── formatters.ts     # Funções de formatação
│   ├── validations.ts    # Validações Zod
│   └── utils.ts          # Utilitários gerais
├── middleware.ts         # Middleware NextAuth
├── scripts/
│   ├── setup.sh          # Setup inicial
│   ├── migrate.ts        # Migração do banco
│   └── seed.ts           # Dados de teste
├── drizzle.config.ts     # Config Drizzle ORM
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Autenticação e Autorização

### Fluxo de Autenticação

1. **Registro**: Usuário cria conta em `/register`
   - Email e senha são validados com Zod
   - Senha é hasheada com bcrypt
   - Usuário é criado no banco com role `customer`

2. **Login**: Usuário faz login em `/login`
   - Credenciais são verificadas
   - JWT token é gerado se válido
   - Token é armazenado em httpOnly cookie

3. **Sessão**: Middleware valida token em cada requisição
   - Token é extraído do cookie
   - JWT é verificado
   - User info é anexada ao request

### Roles e Permissões

```typescript
// Roles disponíveis
- admin: Acesso total à plataforma
- vendor: Pode criar/gerenciar suas próprias lojas
- customer: Pode fazer compras
```

### Middleware de Proteção

```typescript
// middleware.ts
// Protege rotas /dashboard e /admin
// Redireciona usuários não autenticados para /login
// Valida role do usuário
```

## 💾 Banco de Dados

### Schema Drizzle ORM

A aplicação usa **Drizzle ORM** com PostgreSQL (Neon).

#### Tabelas Principais

1. **users**: Armazena usuários
   - email, password_hash, full_name, role
   - Índice em email (UNIQUE)

2. **stores**: Lojas dos vendors
   - owner_id (FK → users)
   - name, slug, description, logo_url
   - currency, is_active
   - Índice em owner_id para queries rápidas

3. **products**: Produtos de uma loja
   - store_id (FK → stores)
   - category_id (FK → product_categories)
   - name, slug, description, price
   - stock_quantity, status (draft/active/archived)
   - Índice em store_id para queries por loja

4. **carts**: Carrinhos de compra
   - user_id (FK → users, nullable)
   - store_id (FK → stores)
   - session_id para carrinhos anônimos

5. **orders**: Pedidos realizados
   - store_id (FK → stores)
   - customer_email, customer_name
   - total_amount, status, payment_status
   - shipping_address, billing_address

### Multi-Tenancy

O isolamento de dados é garantido por:

1. **Row-Level Security**: Cada loja só vê seus dados
2. **Middleware de Validação**: Verifica se user pode acessar store
3. **Foreign Keys**: Garante integridade referencial
4. **Índices**: Otimizam queries por store_id

## 🌐 API Routes

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login com email/senha

### Lojas
- `GET /api/stores` - Listar lojas do usuário
- `POST /api/stores` - Criar nova loja
- `GET /api/stores/[id]` - Obter detalhes da loja
- `PUT /api/stores/[id]` - Atualizar loja
- `DELETE /api/stores/[id]` - Deletar loja

### Produtos
- `GET /api/products` - Listar produtos (filtro por store)
- `POST /api/products` - Criar produto
- `GET /api/products/[id]` - Obter detalhes do produto
- `PUT /api/products/[id]` - Atualizar produto
- `DELETE /api/products/[id]` - Deletar produto

### Carrinho
- `GET /api/cart` - Obter carrinho atual
- `POST /api/cart` - Adicionar item ao carrinho
- `PUT /api/cart/[itemId]` - Atualizar quantidade
- `DELETE /api/cart/[itemId]` - Remover item

### Pedidos
- `GET /api/orders` - Listar pedidos da loja
- `POST /api/checkout` - Criar pedido (checkout)
- `GET /api/orders/[id]` - Obter detalhes do pedido
- `PUT /api/orders/[id]` - Atualizar status do pedido

### Analytics
- `GET /api/analytics` - Obter métricas da loja

## 📦 Componentes

### UI Base (`components/ui/`)

Componentes reutilizáveis seguindo padrão shadcn/ui:

- `Button` - Botão com variantes
- `Input` - Campo de entrada
- `Label` - Label para formulários
- `Card` - Container com border
- `Textarea` - Área de texto
- `Select` - Dropdown
- `Badge` - Badge de status
- `Table` - Tabelas

### Componentes de Negócio

- `NavBar` - Navegação principal
- `DashboardSidebar` - Menu lateral do dashboard

## 🎯 Fluxos de Negócio

### 1. Fluxo de Vendor (Criar Loja)

```
1. Vendor se registra → /register
2. É direcionado para /dashboard
3. Clica em "Nova Loja" → /dashboard/stores/new
4. Preenche formulário
5. POST /api/stores
6. Loja é criada
7. Vendor acessa /dashboard/stores/[id]/products
```

### 2. Fluxo de Cliente (Comprar)

```
1. Cliente acessa /storefront/[store]
2. Vê produtos da loja
3. Clica em produto → /storefront/[store]/products/[productId]
4. Adiciona ao carrinho → POST /api/cart
5. Vai para carrinho → /storefront/[store]/cart
6. Revisa itens
7. Vai para checkout → /storefront/[store]/checkout
8. Preenche endereço e pagamento
9. POST /api/checkout (cria Order)
10. É redirecionado para /order-confirmation
```

### 3. Fluxo de Vendor (Gerenciar Pedidos)

```
1. Vendor acessa /dashboard/stores/[id]/orders
2. Vê lista de pedidos
3. Clica em pedido para ver detalhes
4. Atualiza status (pending → processing → completed)
5. PUT /api/orders/[id]
```

## 🔌 Integrações

### NextAuth

```typescript
// Autenticação com email/senha
// Tokens JWT
// Middleware de proteção
```

### Drizzle ORM

```typescript
// Type-safe queries
// Migrations automáticas
// Relacionamentos entre tabelas
```

### Stripe (Futuro)

```typescript
// Webhook para confirmação de pagamento
// Criação de payment intent
// Gestão de subscriptions
```

## 📝 Tipos TypeScript

Todos os tipos são centralizados em `lib/types.ts`:

```typescript
// User
interface User { id, email, full_name, role, ... }

// Store
interface Store { id, owner_id, name, slug, ... }

// Product
interface Product { id, store_id, name, price, ... }

// Order
interface Order { id, store_id, customer_email, ... }

// Api Response
interface ApiResponse<T> { success, data?, error? }
```

## 🛠️ Utilitários

### `lib/api-client.ts`

Cliente HTTP centralizado para comunicação com a API:

```typescript
// Serviços agrupados por entidade
storeService.getAll()
productService.getByStore(storeId)
cartService.addItem(data)
orderService.getByStore(storeId)
```

### `lib/formatters.ts`

Funções de formatação reutilizáveis:

```typescript
formatCurrency(1000, 'BRL')  // R$ 1.000,00
formatDate(new Date())        // 23/03/2026
generateSlug('Meu Produto')   // meu-produto
```

### `lib/validations.ts`

Validações Zod para todos os forms:

```typescript
UserSchema.parse(data)
StoreSchema.parse(data)
ProductSchema.parse(data)
```

## 🚀 Performance

### Otimizações

1. **Índices no Banco**: store_id, owner_id, user_id
2. **Paginação**: ITEMS_PER_PAGE = 10
3. **Cache**: Implementar SWR em futuro
4. **Images**: Next.js Image component (futuro)
5. **Code Splitting**: Route-based splitting automático

## 🔒 Segurança

1. **Senhas**: bcryptjs com salt rounds = 10
2. **JWT**: Assigdo com AUTH_SECRET
3. **CORS**: Configurado em headers
4. **XSS**: Sanitizado pelo React
5. **SQL Injection**: Prevenido por Drizzle ORM
6. **CSRF**: Proteção via httpOnly cookies

## 📊 Analytics

Endpoint `/api/analytics` fornece:
- Total de receita
- Total de pedidos
- Valor médio de pedido
- Taxa de conversão
- Produtos com estoque baixo
- Receita por mês (gráfico)

## 🧪 Testes

Estrutura pronta para adicionar testes:
- Jest para unit tests
- React Testing Library para componentes
- MSW para mocking de API

## 🔄 Estado da Aplicação

Estado é gerenciado através de:
- **Local State**: useState para forms
- **Server State**: Fetches na API
- **Auth State**: NextAuth + JWT em cookie

Futuro: Implementar SWR ou React Query para melhor caching.

## 📚 Próximos Passos

1. **Integrar Stripe**: Pagamento real
2. **Email**: Confirmação de pedido
3. **Upload de Imagens**: S3 ou Blob
4. **Search**: Elasticsearch ou similar
5. **Notifications**: Real-time com websockets
6. **Tests**: Cobertura completa
7. **CI/CD**: GitHub Actions
8. **Monitoring**: Sentry, LogRocket
