# Deployment para Produção - MultiTenant Admin

Guia completo para colocar seu sistema multi-tenant em produção.

## 1. Preparação

### 1.1 Verificações Finais Locais

```bash
# Build local
npm run build

# Verifique erros
npm run type-check

# Teste
npm run dev
```

### 1.2 Atualize Variáveis de Ambiente

Em produção, você precisa de:

```env
# Banco de Dados (Neon)
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-1.neon.tech/database?sslmode=require

# JWT Secret (GERE UMA CHAVE SEGURA COM 64+ CARACTERES)
JWT_SECRET=seu-jwt-secret-super-seguro-com-muitos-caracteres-aleatorios-!!!

# Node Environment
NODE_ENV=production

# URLs
NEXT_PUBLIC_API_URL=https://seu-dominio.com

# E-mail (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
```

## 2. Deploy na Vercel (Recomendado)

### 2.1 Conectar GitHub

```bash
# 1. Push seu código para GitHub
git add .
git commit -m "Initial multitenant setup"
git push origin multitenant-com-edicoes
```

### 2.2 Criar Projeto no Vercel

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione seu repositório GitHub
4. Escolha como root directory: `packages/multitenant-admin`

### 2.3 Configurar Variáveis de Ambiente

No Vercel Dashboard:

1. Vá para **Settings** > **Environment Variables**
2. Adicione:
   - `DATABASE_URL`: Sua connection string Neon
   - `JWT_SECRET`: Sua chave secreta (64+ caracteres)
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_API_URL`: `https://seu-dominio.com`

### 2.4 Deploy

```bash
# Vercel faz deploy automaticamente quando você push
# Ou clique em "Deploy" no Vercel Dashboard
```

### 2.5 Configurar Domínio Customizado

No Vercel Dashboard:

1. **Domains** > **Add Domain**
2. Aponte seu DNS para Vercel
3. Configure SSL (automático)

## 3. Banco de Dados - Neon

### 3.1 Otimizar Produção

```sql
-- Criar índices adicionais para produção
CREATE INDEX idx_super_admins_last_login ON super_admins(last_login_at);
CREATE INDEX idx_tenant_users_last_login ON tenant_users(last_login_at);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Criar views para dashboards
CREATE VIEW active_tenants AS
SELECT id, name, plan, status, created_at
FROM tenants
WHERE status = 'active'
ORDER BY created_at DESC;

-- Backup automático no Neon (configurar via console)
```

### 3.2 Configurar Backup

No Neon Console:

1. **Project Settings** > **Backups**
2. Ative backup automático diário
3. Configure retenção por 30 dias

## 4. Segurança em Produção

### 4.1 HTTPS Obrigatório

```javascript
// next.config.js - Já configurado, mas verifique:
headers: async () => {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ]
}
```

### 4.2 Rate Limiting

```typescript
// app/api/auth/login/route.ts
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
})

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  // ... resto do código
}
```

### 4.3 CORS

```javascript
// next.config.js
headers: async () => {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_API_URL },
        { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
      ],
    },
  ]
}
```

### 4.4 Secrets Seguros

Em Vercel > **Settings** > **Secrets**:

```bash
# Nunca commite secrets!
# Use variáveis de ambiente apenas

# Gere JWT_SECRET com:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 5. Monitoramento e Logging

### 5.1 Integrar Sentry (Erro Tracking)

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

### 5.2 Logs Estruturados

```typescript
// lib/logger.ts
export function log(level: string, message: string, data?: any) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
    environment: process.env.NODE_ENV,
  }))
}
```

### 5.3 Health Check

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}
```

## 6. Performance

### 6.1 Otimizações

```javascript
// next.config.js
const nextConfig = {
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    serverComponentsExternalPackages: ['postgres'],
  },
}
```

### 6.2 Caching

```typescript
// app/api/admin/tenants/route.ts
export const revalidate = 300 // Cache por 5 minutos

export async function GET(request: NextRequest) {
  // Response será cacheado por 5 minutos
}
```

### 6.3 Compression

```javascript
// next.config.js
const withCompression = require('next-compression')

module.exports = withCompression({
  // config...
})
```

## 7. Scaling (Quando Crescer)

### 7.1 Database Connection Pooling

```typescript
// lib/db.ts
const pool = new Pool({
  max: 50,
  min: 10,
  idleTimeoutMillis: 30000,
})
```

### 7.2 Redis Cache

```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function getFromCache(key: string) {
  return await redis.get(key)
}

export async function setInCache(key: string, value: any, ttl = 3600) {
  await redis.setex(key, ttl, JSON.stringify(value))
}
```

### 7.3 Separar o API em Microserviços

Como o projeto crescer:

```
multitenant-admin/     (Dashboard super admin)
├── packages/
├── multitenant-api/   (API geral para tenants)
├── multitenant-tenant-app/ (App para usuários)
└── multitenant-billing-service/ (Serviço de faturamento)
```

## 8. Checklist de Deploy

- [ ] JWT_SECRET é seguro (64+ caracteres aleatórios)
- [ ] DATABASE_URL está correto
- [ ] NODE_ENV=production
- [ ] HTTPS está ativado
- [ ] CORS está configurado
- [ ] Rate limiting está ativado
- [ ] Backup do banco está configurado
- [ ] Health checks estão funcionando
- [ ] Logs estão sendo registrados
- [ ] SSL certificate é válido
- [ ] CDN está configurado
- [ ] Monitoramento está ativado

## 9. Após Deploy

### 9.1 Teste em Produção

```bash
# Test login
curl -X POST https://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@multitenant.com","password":"admin123456"}'

# Test health
curl https://seu-dominio.com/api/health

# Test CORS
curl -H "Origin: https://seu-dominio.com" https://seu-dominio.com/api/admin/tenants
```

### 9.2 Monitoramento

Configure alertas em Vercel:

1. **Monitoring** > **Enable Alerts**
2. Configure notificações por Slack/Email
3. Monitore:
   - Response time
   - Error rate
   - Uptime

### 9.3 Backups

Verifique no Neon Console:

1. **Project** > **Backups**
2. Confirme que backups automáticos estão rodando
3. Teste restore de um backup

## 10. Troubleshooting Produção

### Erro: "DATABASE_URL not found"

```bash
# Verifique no Vercel Dashboard
Settings > Environment Variables > DATABASE_URL

# Ou no terminal
vercel env pull
cat .env.local
```

### Erro: "Invalid JWT"

```bash
# Regenere JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Atualize em Vercel
vercel env add JWT_SECRET
```

### Erro: "Connection pooling exceeded"

```typescript
// Reduza max connections
const pool = new Pool({
  max: 20, // Reduza de 50 para 20
})
```

### Erro: "CORS not working"

```javascript
// Atualize next.config.js
headers: async () => {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' }, // Teste com *
      ],
    },
  ]
}
```

## 11. Documentação Útil

- [Vercel Deployment](https://vercel.com/docs)
- [Neon Postgres](https://neon.tech/docs)
- [Next.js Production](https://nextjs.org/docs/going-to-production)
- [Security Best Practices](https://cheatsheetseries.owasp.org/)

---

**Seu sistema está pronto para produção! 🚀**

Qualquer dúvida, revise a documentação completa em README.md ou QUICK_START_MULTITENANT.md
