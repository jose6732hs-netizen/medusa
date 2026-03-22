# Instruções de Deploy - Passo a Passo

Guia completo para fazer seu primeiro deploy em produção.

---

## Pré-Requisitos

Você precisa ter:
- [ ] Conta no Vercel (grátis em vercel.com)
- [ ] Neon PostgreSQL configurado
- [ ] Repositório no GitHub com o código
- [ ] Node.js 18+ instalado localmente

---

## Passo 1: Preparar o Repositório Localmente

### 1.1 Gerar arquivo `.env`

```bash
npm run setup:env
```

Isso cria um arquivo `.env` com secrets gerados automaticamente.

### 1.2 Editar `.env` com suas URLs

Abra o arquivo `.env` e configure:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/medusa_saas?sslmode=require
STORE_CORS=https://seu-store.com
ADMIN_CORS=https://seu-admin.com
AUTH_CORS=https://seu-auth.com
BACKEND_URL=https://seu-api.vercel.app
```

### 1.3 Validar configuração

```bash
npm run validate:env
```

Deve mostrar ✓ Validação PASSOU com sucesso!

### 1.4 Testar localmente

```bash
npm run dev
```

Acesse http://localhost:3000 e verifique se o servidor sobe.

### 1.5 Fazer commit (sem .env!)

```bash
git add .
git commit -m "Configuração para produção"
git push origin develop
```

**Importante**: O `.env` está no `.gitignore`, então não será commitado (perfeito!)

---

## Passo 2: Configurar no Vercel

### 2.1 Criar novo projeto

1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Conecte sua conta GitHub
4. Selecione o repositório `medusa`
5. Clique em "Import"

### 2.2 Configurar variáveis de ambiente

Vercel vai mostrar a tela de configuração:

1. **Framework Preset**: Deixe em "Other" (não é Next.js puro)
2. **Root Directory**: `.` (raiz)
3. **Build Command**: Deixe vazio (usará o script do package.json)
4. **Output Directory**: Deixe vazio

### 2.3 Adicionar variáveis de ambiente

Clique em "Add Environment Variable" e preencha:

**Importante**: Copie do seu arquivo `.env` local!

| Variável | Valor | Exemplo |
|----------|-------|---------|
| DATABASE_URL | Sua connection string Neon | `postgresql://...` |
| JWT_SECRET | Secret de 32+ chars | `a7f8c2e1d9b3f5a8...` |
| COOKIE_SECRET | Secret de 32+ chars | `b2e9a5f1d4c7b3e8...` |
| BACKEND_URL | URL do seu backend | `https://seu-api.vercel.app` |
| STORE_CORS | URL da loja | `https://store.exemplo.com` |
| ADMIN_CORS | URL do admin | `https://admin.exemplo.com` |
| AUTH_CORS | URL de auth | `https://auth.exemplo.com` |
| NODE_ENV | "production" | production |

**NUNCA** deixe em branco ou use valores default!

### 2.4 Deploy

1. Clique em "Deploy"
2. Aguarde o build completar (2-5 minutos)
3. Vercel vai mostrar a URL: `https://seu-projeto.vercel.app`

---

## Passo 3: Verificar Deploy

### 3.1 Acessar o site

Acesse a URL fornecida pelo Vercel:
```
https://seu-projeto.vercel.app
```

Você deve ver a página de info do Medusa.

### 3.2 Testar health check

```bash
curl https://seu-projeto.vercel.app/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-03-22T10:30:00.000Z",
  "environment": "production",
  "uptime": 150
}
```

### 3.3 Verificar logs

No Vercel Dashboard:
1. Vá para seu projeto
2. Clique em "Deployments"
3. Clique no deploy mais recente
4. Clique em "Logs"

Procure por:
```
ready - started server on 0.0.0.0:3000
```

---

## Passo 4: Conectar seu Frontend

### 4.1 Configurar CORS no frontend

No seu frontend Next.js:

```typescript
// Exemplo com fetch
const response = await fetch('https://seu-api.vercel.app/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // IMPORTANTE para cookies
  body: JSON.stringify(data)
})
```

### 4.2 Variáveis de ambiente do frontend

No seu `.env.local` do frontend:

```env
NEXT_PUBLIC_API_URL=https://seu-api.vercel.app
```

### 4.3 Testar conexão

Teste login/cadastro para verificar se a comunicação funciona.

---

## Passo 5: Setup de Domínio (Opcional)

### 5.1 Conectar domínio customizado

No Vercel Dashboard:
1. Vá para projeto → Settings
2. Vá para Domains
3. Clique em "Add Domain"
4. Digite seu domínio (ex: `api.seuloja.com`)
5. Siga instruções para configurar DNS

### 5.2 Validação de DNS

Depois de 24-48h, seu domínio estará ativo com SSL automático.

---

## Atualizações Futuras

### Fazer update do código

```bash
# No seu computador
git push origin develop

# Vercel detecta e faz redeploy automaticamente!
```

### Atualizar variáveis de ambiente

1. No Vercel Dashboard
2. Settings → Environment Variables
3. Edite a variável
4. Clique em "Save"
5. Faça um redeploy:

```bash
vercel --prod
```

---

## Troubleshooting de Deploy

### Build falha

**Erro**: "npm install failed"

**Solução**:
```bash
# Localmente, faça:
rm -rf node_modules package-lock.json
npm install
git push origin develop
# Vercel vai tentar de novo
```

### Servidor não sobe

**Erro**: "Health check failed"

**Solução**:
- Verifique se DATABASE_URL está correto
- Execute `npm run validate:env`
- Verifique logs no Vercel

### CORS bloqueando

**Erro**: "Access to XMLHttpRequest blocked"

**Solução**:
- Adicione URL do frontend em `STORE_CORS` ou `AUTH_CORS`
- Salve em Environment Variables
- Faça redeploy

### Database offline

**Erro**: "connect ECONNREFUSED"

**Solução**:
- Verifique status do Neon em neon.tech
- Tente reconectar o compute
- Use `psql` para testar: `psql DATABASE_URL`

---

## Rollback (Reverter)

Se algo deu errado:

```bash
# Via Vercel Dashboard
# Deployments → Selecionar deploy anterior → "Promote to Production"

# Ou via CLI
vercel rollback
```

---

## Checklist Final

- [ ] Deploy no Vercel está verde (não red)
- [ ] Health check responde com status 200
- [ ] Endpoint `/health` está acessível
- [ ] Frontend consegue fazer requisições
- [ ] Login/cadastro funcionando
- [ ] Variáveis de ambiente todas configuradas
- [ ] DATABASE_URL com `sslmode=require`
- [ ] Backups automáticos no Neon ativados

---

## Próximos Passos

1. **Testar multi-tenant**: Criar múltiplos tenants e verificar isolamento
2. **Setup de monitoring**: Adicionar Sentry ou DataDog
3. **Scaling**: Se tiver muito tráfego, upgrade de plano
4. **CI/CD**: Adicionar testes automáticos no GitHub Actions

---

**Parabéns! Seu backend está em produção! 🚀**
