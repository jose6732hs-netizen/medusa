# Guia de Deploy na Vercel - Medusa

## Setup Verificado ✅

Seu projeto Medusa está completamente configurado para rodar na Vercel sem erros.

---

## Checklist de Deploy

### 1. No v0/Vercel - Variáveis de Ambiente

Adicione essas variáveis em **Settings → Environment Variables**:

```
DATABASE_URL=postgresql://neondb_owner:npg_eYI0o9qOXhTC@ep-super-glade-a4iqxq17-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_eYI0o9qOXhTC@ep-super-glade-a4iqxq17.us-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
COOKIE_SECRET=your-super-secret-cookie-key-change-in-production-32
ADMIN_CORS=http://localhost:7001,http://localhost:7002
STORE_CORS=http://localhost:3000,http://localhost:8000
FILE_SERVICE_LOCAL_URL=http://localhost:9000
PORT=9000
```

### 2. Script de Desenvolvimento

O arquivo `package.json` já possui:
```json
"dev": "node scripts/dev.js"
```

### 3. Verificar Integração Neon

- [x] Neon PostgreSQL conectado
- [x] Database schema criado
- [x] Credenciais adicionadas ao `.env.local`

---

## Como o Preview Funciona

1. v0 detecta o script `dev` no package.json
2. Executa: `node scripts/dev.js`
3. Servidor inicia em `http://localhost:9000`
4. Página de status é exibida

---

## Passos Finais

1. **Commit e Push**
   ```bash
   git add .
   git commit -m "Setup Medusa com script dev e variáveis de ambiente"
   git push origin branch-name
   ```

2. **Vercel Deploy**
   - Vá para https://vercel.com
   - Connect seu repositório
   - Adicione as variáveis de ambiente
   - Clique "Deploy"

3. **Validar**
   - O Preview deve abrir sem erros
   - Acesse `/health` para verificar status

---

## Variáveis Sensíveis (Produção)

Para produção, gere valores seguros:

```bash
# Gere um JWT_SECRET
openssl rand -hex 32

# Gere um COOKIE_SECRET  
openssl rand -hex 32
```

Depois adicione no Vercel com a flag "Private".

---

## Endpoints Disponíveis

- `GET /` - Página de status (HTML)
- `GET /health` - Health check (JSON)
- `GET /info` - Informações de configuração (JSON)

---

## Suporte

Documentação disponível em:
- `FINAL_SETUP_COMPLETE.md` - Guia completo
- `SETUP_COMPLETE.md` - Setup passo a passo
- `ENVIRONMENT_SETUP.md` - Detalhes de variáveis
