# 🚀 GUIA DE DEPLOY EM PRODUÇÃO

## ✅ Pré-requisitos Checklist

- [ ] `DATABASE_URL` do Neon configurado em `.env.local`
- [ ] `NEXTAUTH_SECRET` gerado (execute: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` configurado (seu domínio)
- [ ] Chaves Stripe opcionais (pagamentos)
- [ ] Repositório GitHub criado e conectado
- [ ] Conta Vercel criada (vercel.com)

---

## 🔧 Opção 1: Deploy via Vercel (RECOMENDADO)

### Passo 1: Push para GitHub
```bash
cd medusa-ecommerce
git init
git add .
git commit -m "Initial commit - Medusa ecommerce"
git remote add origin https://github.com/SEU_USUARIO/medusa-ecommerce.git
git push -u origin main
```

### Passo 2: Importar em Vercel
1. Acesse https://vercel.com/new
2. Clique "Import Git Repository"
3. Cole a URL do seu repositório
4. Clique "Import"

### Passo 3: Configurar Variáveis de Ambiente
Na página de configuração do Vercel:
1. Adicione todas as variáveis de `.env.local`
2. Particularmente importante:
   - `DATABASE_URL` (Neon)
   - `NEXTAUTH_SECRET` (novo!)
   - `NEXTAUTH_URL` (seu domínio Vercel)

### Passo 4: Deploy
1. Clique "Deploy"
2. Aguarde 2-5 minutos
3. ✨ Seu site estará online!

---

## 🖥️ Opção 2: Deploy em Servidor Próprio

### Passo 1: Preparar Servidor
```bash
# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Passo 2: Clonar e Setup
```bash
git clone https://github.com/SEU_USUARIO/medusa-ecommerce.git
cd medusa-ecommerce
npm install
npm run build
```

### Passo 3: Configurar Variáveis
```bash
cp .env.example .env.production
# Edite .env.production com suas configurações
source .env.production
```

### Passo 4: Iniciar
```bash
npm run start
```

### Passo 5: Usar PM2 (para manter rodando)
```bash
npm install -g pm2
pm2 start "npm run start" --name medusa-ecommerce
pm2 startup
pm2 save
```

---

## 🔐 Segurança em Produção

### Essencial:
- ✅ Use HTTPS obrigatoriamente
- ✅ Configure CORS corretamente
- ✅ Use variáveis de ambiente seguras
- ✅ Habilite WAF (Web Application Firewall)
- ✅ Configure rate limiting
- ✅ Use senhas fortes no banco

### Recomendado:
- ✅ Ativar backups automáticos Neon
- ✅ Configurar alertas de erro
- ✅ Monitorar performance
- ✅ Configurar CDN
- ✅ Usar SSL/TLS válido

---

## 📊 Monitoramento

### Checklist Pós-Deploy:
- [ ] Site abre sem erros (acessar homepage)
- [ ] Registro funciona (criar conta)
- [ ] Login funciona (fazer login)
- [ ] Dashboard carrega (acessar /dashboard)
- [ ] API responde (testar endpoints)
- [ ] Banco responde (criar uma loja)
- [ ] Emails funcionam (se configurado)
- [ ] HTTPS ativo (verificar certificado)

### URLs para Testar:
```
Home:        https://seu-dominio.com/
Register:    https://seu-dominio.com/register
Login:       https://seu-dominio.com/login
Dashboard:   https://seu-dominio.com/dashboard
Admin Panel: https://seu-dominio.com/dashboard/stores
```

---

## 🐛 Troubleshooting

### "Database connection failed"
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL
# Deve parecer com:
# postgresql://user:password@ep-xxx.us-east-1.neon.tech/medusa_ecommerce?sslmode=require
```

### "NextAuth error"
```bash
# Gerar novo NEXTAUTH_SECRET
openssl rand -base64 32
# Atualizar em .env e redeploy
```

### "Page not found (404)"
- Verificar routes em `/app`
- Revisar middleware.ts
- Checar build logs

### "Database timeout"
- Verificar limite de conexões Neon
- Aumentar pool size se necessário
- Verificar query performance

---

## 📈 Próximos Passos

1. **Analytics**: Configurar Vercel Analytics
2. **Pagamentos**: Integrar Stripe completamente
3. **Email**: Configurar Resend ou SendGrid
4. **CDN**: Adicionar Cloudflare
5. **Monitoramento**: Sentry para error tracking
6. **Escalabilidade**: Considerar Redis cache

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs: `vercel logs`
2. Verifique variáveis: `vercel env list`
3. Consulte documentação: `docs/`
4. Abra issue no GitHub

---

**Status**: ✅ Projeto pronto para produção em 100%
