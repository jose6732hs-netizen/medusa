# Guia de Deployment - Medusa ECommerce

## Deployment em Vercel

### 1. Preparar Repositório Git

```bash
# Adicionar ao git
git add .
git commit -m "Medusa ECommerce - Projeto completo"
git push origin main
```

### 2. Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Selecione seu repositório GitHub
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `medusa-ecommerce`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Adicionar Variáveis de Ambiente

No Vercel Dashboard, vá para **Settings > Environment Variables** e adicione:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
NEXTAUTH_SECRET=[gerar com: openssl rand -base64 32]
NEXTAUTH_URL=https://seu-dominio.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Executar Migrações

Após o deploy inicial, execute as migrações:

```bash
npm run db:push
```

Ou use um script de inicialização pré-deploy.

### 5. Deploy

Clique em "Deploy" no Vercel. O projeto será automaticamente buildado e deployado.

---

## Deploy em Servidor Próprio (Alternativa)

### Requisitos
- Node.js 18+
- PostgreSQL
- npm/yarn/pnpm

### Passos

1. **Clone o repositório**
```bash
git clone seu-repo
cd medusa-ecommerce
```

2. **Instale dependências**
```bash
npm install
```

3. **Configure .env.local**
```bash
cp .env.example .env.local
# Edite com suas credenciais
```

4. **Crie o banco de dados**
```bash
npm run db:push
```

5. **Build para produção**
```bash
npm run build
```

6. **Inicie o servidor**
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

---

## Configurações Adicionais

### SSL/HTTPS
- Se usando Vercel: SSL é automático
- Se usando servidor próprio: configure com Nginx + Let's Encrypt

### Domínio Customizado
1. Aponte seu domínio para Vercel (ou seu servidor)
2. Configure em **Project Settings > Domains**

### Banco de Dados
- **Neon**: Serverless PostgreSQL (recomendado para Vercel)
- **Supabase**: PostgreSQL gerenciado com extras
- **AWS RDS**: PostgreSQL na nuvem

### Email
Para notificações de pedidos, integre:
- SendGrid
- Resend
- AWS SES
- Mailgun

---

## Checklist de Produção

- [ ] Variáveis de ambiente configuradas
- [ ] NEXTAUTH_SECRET gerado e seguro
- [ ] HTTPS/SSL ativado
- [ ] Backups de banco de dados configurados
- [ ] Logs habilitados
- [ ] Monitoramento de erros (Sentry opcional)
- [ ] CDN para imagens (Vercel Blob ou CloudFront)
- [ ] Rate limiting ativado
- [ ] CORS configurado
- [ ] Testes em staging antes de produção

---

## Troubleshooting

### Erro: DATABASE_URL não encontrado
- Verifique se a variável está setada no Vercel ou `.env.local`

### Erro: NEXTAUTH_SECRET ausente
- Execute: `openssl rand -base64 32` e adicione à variável

### Erro: Conexão com banco recusada
- Verifique credenciais do PostgreSQL
- Confirme que a database existe
- Teste a conexão manualmente: `psql postgresql://user:pass@host:5432/db`

### Build falha com erro de tipo TypeScript
- Execute: `npm run lint` para identificar problemas
- Corrija os tipos e deploy novamente

---

## Performance

### Otimizações Recomendadas

1. **Cache de Produtos**
```typescript
// Adicionar revalidateTag em pages de produtos
export const revalidate = 3600; // revalida a cada 1 hora
```

2. **Compressão**
```bash
# Vercel faz automaticamente
```

3. **Imagens**
- Otimize tamanho e formato
- Use Next.js Image component
- Implemente lazy loading

4. **Database**
- Adicione índices às queries frequentes
- Monitore queries lentas

---

## Próximos Passos Pós-Deploy

1. **Monitorar Logs**
   - Vercel Analytics
   - Database logs

2. **Coletar Feedback**
   - Setup de suporte
   - Bugs reportados

3. **Melhorias**
   - Adicionar pagamento Stripe
   - Integrar email
   - Analytics avançado

4. **Escalar**
   - Adicionar cache (Redis)
   - CDN para assets
   - Database replication

---

## Suporte

Para problemas:
1. Verifique logs: `vercel logs`
2. Teste localmente: `npm run dev`
3. Consulte documentação Next.js
4. Abra issue no GitHub
