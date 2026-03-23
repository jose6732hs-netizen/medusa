# Guia do Desenvolvedor - Medusa ECommerce

## 🚀 Setup Inicial

### 1. Clonar e Instalar

```bash
cd medusa-ecommerce
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Editar `.env.local` com:
- `DATABASE_URL` do Neon
- `NEXTAUTH_SECRET` (gerar com `openssl rand -base64 32`)
- Opcionalmente: Stripe keys

### 3. Migrar Banco de Dados

```bash
npm run db:push
```

Isso vai:
1. Gerar arquivos de migração via Drizzle
2. Aplicar schema no banco
3. Criar todas as tabelas

### 4. Iniciar Dev Server

```bash
npm run dev
```

Acessar em `http://localhost:3000`

## 📋 Arquivos Importantes

### Configuração
- `package.json` - Dependências e scripts
- `tsconfig.json` - Configuração TypeScript
- `tailwind.config.js` - Estilos Tailwind
- `drizzle.config.ts` - Config ORM
- `middleware.ts` - Middleware NextAuth

### Código
- `app/layout.tsx` - Layout raiz
- `lib/db.ts` - Conexão com banco
- `lib/auth.config.ts` - Configuração autenticação
- `lib/types.ts` - Tipos TypeScript

## 🔧 Como Adicionar Uma Nova Feature

### 1. Adicionar Tabela no Banco

Editar `db/schema.ts`:

```typescript
export const novaTabela = pgTable('nova_tabela', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
})
```

Executar:
```bash
npm run db:push
```

### 2. Criar Tipo TypeScript

Editar `lib/types.ts`:

```typescript
export interface NovaEntidade {
  id: string
  name: string
  created_at: Date
}
```

### 3. Criar Validação Zod

Editar `lib/validations.ts`:

```typescript
export const NovaEntidadeSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
})
```

### 4. Criar API Route

Criar `app/api/nova-entidade/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { novaTabela } from '@/db/schema'

export async function GET(req: NextRequest) {
  try {
    const dados = await db.select().from(novaTabela)
    return NextResponse.json({ success: true, data: dados })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar dados' 
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validado = NovaEntidadeSchema.parse(body)
    
    const resultado = await db
      .insert(novaTabela)
      .values(validado)
      .returning()
    
    return NextResponse.json({ 
      success: true, 
      data: resultado[0] 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao criar' 
    }, { status: 400 })
  }
}
```

### 5. Criar Página

Criar `app/dashboard/nova-entidade/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { NovaEntidade } from '@/lib/types'

export default function NovaEntidadePage() {
  const [dados, setDados] = useState<NovaEntidade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/nova-entidade')
      .then(res => res.json())
      .then(data => {
        setDados(data.data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nova Entidade</h1>
      <div className="space-y-4">
        {dados.map(item => (
          <div key={item.id} className="border p-4 rounded">
            <h2>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 💡 Padrões de Código

### API Route Handler

```typescript
import { NextRequest, NextResponse } from 'next/server'
import type { NovaEntidade } from '@/lib/types'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Lógica aqui
    return NextResponse.json({ 
      success: true, 
      data: resultado 
    })
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { success: false, error: 'Mensagem de erro' },
      { status: 500 }
    )
  }
}
```

### Componente Cliente

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function MeuComponente() {
  const [value, setValue] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Fazer chamada à API
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit">Enviar</Button>
    </form>
  )
}
```

### Validação com Zod

```typescript
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().positive(),
})

// Uso
try {
  const dados = schema.parse(input)
  // Dados validados
} catch (error) {
  console.error(error.errors) // Array de erros
}
```

## 🗄️ Queries Drizzle

### Select

```typescript
import { db } from '@/lib/db'
import { stores } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Todos
const todos = await db.select().from(stores)

// Com where
const loja = await db
  .select()
  .from(stores)
  .where(eq(stores.id, storeId))
  .limit(1)

// Com join
const com_dados = await db
  .select()
  .from(stores)
  .innerJoin(users, eq(stores.owner_id, users.id))
```

### Insert

```typescript
const resultado = await db
  .insert(stores)
  .values({
    name: 'Minha Loja',
    slug: 'minha-loja',
    owner_id: userId,
  })
  .returning()
```

### Update

```typescript
const atualizado = await db
  .update(stores)
  .set({ name: 'Novo Nome' })
  .where(eq(stores.id, storeId))
  .returning()
```

### Delete

```typescript
await db
  .delete(stores)
  .where(eq(stores.id, storeId))
```

## 🧪 Testes

### Preparação

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Exemplo de Teste

```typescript
// __tests__/utils.test.ts
import { generateSlug } from '@/lib/formatters'

describe('generateSlug', () => {
  it('deve converter para minúsculas e hífens', () => {
    const resultado = generateSlug('Meu Produto')
    expect(resultado).toBe('meu-produto')
  })
})
```

## 🐛 Debugging

### Console Logs

```typescript
// Use [v0] para debug logs
console.log('[v0] Dados recebidos:', data)
console.log('[v0] Erro:', error.message)
```

### DevTools do Navegador

- **Network**: Ver requisições HTTP
- **Application**: Ver cookies e storage
- **Console**: Erro JavaScript
- **Elements**: Inspecionar HTML

### Drizzle Studio

```bash
npm run db:studio
```

Abre interface web para explorar banco.

## 📦 Adicionar Dependências

```bash
npm install nova-dependencia
npm install -D @types/nova-dependencia
```

Depois importar:

```typescript
import { funcao } from 'nova-dependencia'
```

## 🎨 Customizar Estilos

### Tailwind

Editar `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primario: '#FF6B6B',
      },
    },
  },
}
```

### CSS Global

Editar `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-custom {
    @apply px-4 py-2 rounded bg-blue-500 text-white;
  }
}
```

## 🚀 Deployment

### Vercel

```bash
# Conectar repo GitHub
vercel link

# Deploy
vercel
```

Variáveis de env são configuradas em Settings → Environment Variables.

### Servidor Próprio

```bash
npm run build
npm run start
```

Acessar em `http://localhost:3000`

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Zod Validation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/docs)
- [NextAuth](https://authjs.dev)

## ⚡ Dicas de Performance

1. **Use `'use client'` sparingly**: Só em componentes que precisa de state
2. **Prefira RSC**: Server components por padrão
3. **Lazy load**: Importar componentes dinamicamente
4. **Images**: Usar `next/image` para otimizar
5. **Memoize**: Usar `useMemo` em cálculos pesados
6. **Índices DB**: Adicionar índices em queries frequentes

## 🔒 Checklist de Segurança

- [ ] Validar todos os inputs com Zod
- [ ] Usar bcryptjs para senhas
- [ ] JWT com expiração
- [ ] CORS configurado
- [ ] HTTPS em produção
- [ ] Variáveis sensíveis em `.env.local`
- [ ] SQL injection prevenido (Drizzle)
- [ ] Rate limiting em rotas públicas
- [ ] XSS prevenido (React escape automático)
