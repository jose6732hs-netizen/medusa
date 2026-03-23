# 💾 Medusa ECommerce - Referência Rápida de Código

## 🔐 Autenticação

### Login
```typescript
// POST /api/auth/login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: '123456'
  })
});
const { token } = await response.json();
```

### Registrar
```typescript
// POST /api/auth/register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@example.com',
    password: '123456',
    role: 'vendor' // ou 'customer'
  })
});
```

---

## 🏪 Stores (Lojas)

### Criar Loja
```typescript
// POST /api/stores
const response = await fetch('/api/stores', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Minha Loja',
    slug: 'minha-loja',
    description: 'Descrição da loja',
    logo: 'url-da-logo'
  })
});
```

### Listar Minhas Lojas
```typescript
// GET /api/stores
const response = await fetch('/api/stores');
const stores = await response.json();
```

### Editar Loja
```typescript
// PUT /api/stores/[storeId]
const response = await fetch(`/api/stores/${storeId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Novo Nome',
    description: 'Nova descrição'
  })
});
```

---

## 📦 Produtos

### Criar Produto
```typescript
// POST /api/products
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storeId: 'store-123',
    name: 'Produto Legal',
    description: 'Descrição',
    price: '99.99',
    stock: 100,
    image: 'url-imagem',
    status: 'active'
  })
});
```

### Listar Produtos
```typescript
// GET /api/products?storeId=store-123
const response = await fetch('/api/products?storeId=store-123');
const products = await response.json();
```

### Atualizar Produto
```typescript
// PUT /api/products/[productId]
const response = await fetch(`/api/products/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Novo Nome',
    price: '149.99',
    stock: 50
  })
});
```

### Deletar Produto
```typescript
// DELETE /api/products/[productId]
const response = await fetch(`/api/products/${productId}`, {
  method: 'DELETE'
});
```

---

## 🛒 Carrinho

### Obter Carrinho
```typescript
// GET /api/cart?storeId=store-123&sessionId=sess-123
const response = await fetch(
  '/api/cart?storeId=store-123&sessionId=sess-123'
);
const { cart, total, sessionId } = await response.json();
```

### Adicionar ao Carrinho
```typescript
// POST /api/cart
const response = await fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storeId: 'store-123',
    productId: 'prod-123',
    quantity: 2,
    sessionId: 'sess-123'
  })
});
```

### Atualizar Quantidade
```typescript
// PUT /api/cart/[itemId]
const response = await fetch(`/api/cart/${itemId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quantity: 5
  })
});
```

### Remover do Carrinho
```typescript
// DELETE /api/cart/[itemId]
const response = await fetch(`/api/cart/${itemId}`, {
  method: 'DELETE'
});
```

---

## 💳 Checkout

### Criar Pedido
```typescript
// POST /api/checkout
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storeId: 'store-123',
    cartId: 'cart-123',
    sessionId: 'sess-123',
    customerEmail: 'cliente@example.com',
    customerName: 'Maria Silva',
    shippingAddress: 'Rua X, 123, São Paulo, SP, 01234-567',
    billingAddress: 'Rua Y, 456, Rio de Janeiro, RJ, 20000-000'
  })
});
const { order } = await response.json();
```

---

## 📋 Pedidos

### Listar Pedidos
```typescript
// GET /api/orders?storeId=store-123
const response = await fetch('/api/orders?storeId=store-123');
const orders = await response.json();
```

### Detalhes do Pedido
```typescript
// GET /api/orders/[orderId]
const response = await fetch(`/api/orders/${orderId}`);
const order = await response.json();
```

### Atualizar Status
```typescript
// PUT /api/orders/[orderId]
const response = await fetch(`/api/orders/${orderId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'shipped', // pending, processing, shipped, delivered, cancelled
    paymentStatus: 'paid' // pending, paid, failed, refunded
  })
});
```

---

## 📊 Analytics

### Obter Métricas
```typescript
// GET /api/analytics?storeId=store-123
const response = await fetch('/api/analytics?storeId=store-123');
const {
  totalRevenue,
  totalOrders,
  paidOrders,
  pendingOrders,
  lowStockProducts,
  revenueLastMonth,
  ordersLastMonth,
  averageOrderValue
} = await response.json();
```

---

## 🎨 Componentes UI

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button>Clique aqui</Button>
<Button variant="outline">Outline</Button>
<Button size="sm">Small</Button>
<Button disabled>Desabilitado</Button>
```

### Input
```tsx
import { Input } from '@/components/ui/input';

<Input placeholder="Digite..." />
<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo aqui</CardContent>
</Card>
```

### Label
```tsx
import { Label } from '@/components/ui/label';

<Label htmlFor="input">Rótulo</Label>
<Input id="input" />
```

---

## 🗄️ Database

### Query com Drizzle
```typescript
import { dbClient } from '@/lib/db';
import { users, stores } from '@/db/schema';
import { eq } from 'drizzle-orm';

// SELECT
const user = await dbClient.query.users.findFirst({
  where: eq(users.id, userId)
});

// INSERT
const newUser = await dbClient.insert(users).values({
  name: 'João',
  email: 'joao@example.com',
  password: hashedPassword
}).returning();

// UPDATE
await dbClient.update(users)
  .set({ name: 'Maria' })
  .where(eq(users.id, userId));

// DELETE
await dbClient.delete(users)
  .where(eq(users.id, userId));
```

---

## 🔑 JWT

### Gerar Token
```typescript
import { generateToken } from '@/lib/jwt';

const token = generateToken({
  userId: user.id,
  email: user.email,
  role: user.role
});
```

### Verificar Token
```typescript
import { jwtVerifyToken } from '@/lib/jwt';

const payload = await jwtVerifyToken(token);
if (payload) {
  console.log(payload.userId, payload.role);
}
```

---

## 📍 Roteamento

### Links
```tsx
import Link from 'next/link';

// Página de loja
<Link href={`/dashboard/stores/${storeId}`}>Ir para loja</Link>

// Storefront público
<Link href={`/storefront/${storeSlug}`}>Ver loja</Link>

// Produto
<Link href={`/storefront/${storeSlug}/products/${productId}`}>Ver produto</Link>

// Carrinho
<Link href={`/storefront/${storeSlug}/cart`}>Carrinho</Link>
```

---

## 🎯 Hooks Úteis

### useParams (Next.js)
```typescript
import { useParams } from 'next/navigation';

const params = useParams();
const storeId = params.id as string;
```

### useRouter (Next.js)
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
router.back();
```

### useState (React)
```typescript
import { useState } from 'react';

const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState(null);
```

### useEffect (React)
```typescript
import { useEffect } from 'react';

useEffect(() => {
  fetchData();
}, [storeId]);
```

---

## 🛡️ Middleware de Auth

### Proteger Rota
```typescript
// Em middleware.ts
import { auth } from '@/lib/auth.config';

export const middleware = auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*']
};
```

---

## 📝 Validação com Zod

```typescript
import { z } from 'zod';

const storeSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().optional()
});

// Validar
const validated = storeSchema.parse(data);

// Safe parse
const result = storeSchema.safeParse(data);
if (!result.success) {
  console.error(result.error);
}
```

---

## 🎨 Tailwind Classes

```tsx
// Flexbox
<div className="flex items-center justify-between">

// Grid
<div className="grid grid-cols-3 gap-4">

// Spacing
<div className="p-4 m-2 gap-4">

// Cores
<p className="text-primary bg-secondary border-border">

// Responsive
<div className="md:grid-cols-2 lg:grid-cols-4">

// Hover
<button className="hover:bg-accent">
```

---

## 🚀 Deployment

```bash
# Vercel
vercel deploy

# Server próprio
npm run build
npm start

# Com Docker
docker build -t medusa .
docker run -p 3000:3000 medusa
```

---

**Quer saber mais? Consulte [INDEX.md](./INDEX.md)** 📚
