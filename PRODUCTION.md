# Guia de Produção - Medusa Multi-Tenant SaaS

Este documento contém tudo que você precisa saber para rodar seu backend Medusa em produção de forma segura e escalável.

---

## Checklist Pré-Deploy

Antes de fazer deploy em produção, certifique-se de que:

### Segurança

- [ ] JWT_SECRET foi gerado com `openssl rand -hex 16` ou similar (32+ caracteres)
- [ ] COOKIE_SECRET foi gerado com `openssl rand -hex 16` ou similar (32+ caracteres)
- [ ] Nenhum secret usa valores default como "change-me-in-production"
- [ ] Todas as URLs de CORS usam HTTPS (exceto localhost em desenvolvimento)
- [ ] DATABASE_URL contém `sslmode=require`
- [ ] NODE_ENV está definido como "production"

### Banco de Dados

- [ ] Neon PostgreSQL está configurado e acessível
- [ ] Backups automáticos estão habilitados no Neon
- [ ] Connection pooling está configurado (Neon padrão: 100 conexões)
- [ ] DATABASE_URL foi testado e conecta sem erros

### Configuração de Variáveis

- [ ] Todas as variáveis em `.env.production.example` foram preenchidas
- [ ] Variáveis foram adicionadas ao Vercel Environment Variables
- [ ] Script `npm run validate:env` passou sem erros
- [ ] CORS está configurado para seus domínios reais

### Testes

- [ ] Health check endpoint `/health` responde com status 200
- [ ] Login/autenticação funciona
- [ ] Criação de tenant funciona
- [ ] Super admin dashboard carrega sem erros
- [ ] Frontend consegue fazer requisições para o backend

---

## Variáveis de Ambiente Críticas

### DATABASE_URL
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**Importante**: 
- Use sempre `sslmode=require` em produção
- Neon fornece connection string pronta em Settings → Connection string
- Ative "Pooled Connection" para melhor performance

### JWT_SECRET e COOKIE_SECRET
```bash
# Gerar segredos seguros
openssl rand -hex 16  # Gera 32 caracteres (recomendado)
```

**Importante**:
- Ambos devem ser strings aleatórias de 32+ caracteres
- NUNCA reaproveite secrets entre ambientes
- Guarde em local seguro (Vercel Environment Variables)

### CORS URLs
```env
STORE_CORS=https://store.seuloja.com
ADMIN_CORS=https://admin.seuloja.com
AUTH_CORS=https://auth.seuloja.com
BACKEND_URL=https://api.seuloja.com
```

---

## Deploy no Vercel

### Opção 1: Via GitHub (Recomendado)

1. **Conectar repositório ao Vercel**
   - Vá para vercel.com/new
   - Conecte seu repositório GitHub
   - Autorize o Vercel

2. **Configurar variáveis de ambiente**
   - Settings → Environment Variables
   - Adicione cada variável de `.env.production.example`
   - Marque "Production" para cada variável

3. **Deploy**
   - Clique em Deploy
   - Vercel vai rodar `npm run build && npm start`
   - Seu backend estará vivo em `https://seu-projeto.vercel.app`

### Opção 2: Via Vercel CLI

```bash
# Instalar CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod

# Adicionar variáveis (primeira vez)
vercel env add DATABASE_URL
vercel env add JWT_SECRET
# ... adicione as outras
```

---

## Health Check e Monitoramento

### Health Check Endpoint

O servidor expõe um endpoint de health check:

```bash
curl https://seu-api.com/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-03-22T10:30:00.000Z",
  "environment": "production",
  "uptime": 3600
}
```

### Executar Health Check Local

```bash
npm run health:check
```

### Adicionar Monitoramento

Recomendamos usar serviços como:
- **Vercel Analytics** (integrado)
- **Sentry** (error tracking)
- **UptimeRobot** (monitoramento de uptime)
- **DataDog** (observabilidade completa)

---

## Rotação de Secrets

Secrets como JWT_SECRET e COOKIE_SECRET devem ser rotacionados regularmente (a cada 3-6 meses).

### Procedimento de Rotação

1. **Gerar novo secret**
   ```bash
   openssl rand -hex 16
   ```

2. **Adicionar novo valor como variável temporária**
   ```env
   JWT_SECRET_NEW=novo_valor
   ```

3. **Fazer redeploy** para aplicar

4. **Depois de 24h**, remover valor antigo

5. **Fazer outro redeploy**

---

## Rollback (Reverter Deploy)

Se algo der errado após deploy:

### Via Vercel Dashboard

1. Vá para Deployments
2. Clique em um deploy anterior (que funcionava)
3. Clique em "Promote to Production"

### Via CLI

```bash
vercel rollback
```

---

## Escalabilidade

### Limites Atuais

- **Vercel**: Até 10 segundos por requisição
- **Neon**: Até 100 conexões simultâneas (padrão)
- **Taxa de requisições**: ~1000 req/min com plano padrão

### Aumentar Limites

- **Neon**: Upgrade de plano para mais conexões
- **Vercel Pro**: Para mais recursos/execução
- **Load Balancing**: Distribuir entre múltiplos backends

---

## Troubleshooting em Produção

### Servidor não sobe

```bash
# Verificar logs no Vercel
vercel logs --prod

# Verificar variáveis
npm run validate:env

# Comum: DATABASE_URL faltando
```

### Erro de CORS

```
Access to XMLHttpRequest from origin 'https://store.com' has been blocked
```

**Solução**: Adicionar URL ao `STORE_CORS` (ou equivalente) em Environment Variables

### Banco de dados indisponível

```
Error: connect ECONNREFUSED
```

**Solução**:
- Verificar DATABASE_URL está correta
- Verificar se Neon está online
- Restartar Neon compute

### Sessão não persiste

```
Cookie não é salvo no cliente
```

**Solução**:
- Verificar se COOKIE_SECRET foi alterado (invalida sessions antigas)
- Certificar que frontend usa credentials: 'include' em fetch

---

## Performance e Otimizações

### Database

- Usar connection pooling (Vercel + Neon fazem isto automaticamente)
- Adicionar índices às tabelas frequentemente consultadas
- Usar read replicas para queries pesadas (Neon Pro)

### Backend

- Ativar caching em endpoints estáticos
- Usar CDN para assets estáticos
- Implementar rate limiting para APIs públicas

### Logs

- Monitorar em tempo real com `vercel logs --prod --follow`
- Enviar logs estruturados para observability platform

---

## Backup e Recuperação

### Backup de Database

Neon faz backups automáticos:
- **Free**: 7 dias de retenção
- **Pro**: 30 dias de retenção

Para backup manual:
```bash
# Conectar ao Neon via psql
psql DATABASE_URL

# Fazer dump
pg_dump DATABASE_URL > backup.sql

# Restaurar se necessário
psql DATABASE_URL < backup.sql
```

---

## Suporte e Recursos

- **Documentação Medusa**: https://docs.medusajs.com
- **Documentação Neon**: https://neon.tech/docs
- **Documentação Vercel**: https://vercel.com/docs
- **Issues e Bugs**: Abrir issue no repositório GitHub

---

**Sucesso! Seu backend está pronto para produção! 🚀**
