# Como Acessar Seu SaaS Medusa no Navegador

## 1️⃣ Seu SaaS ONLINE (Após Deploy)

Após fazer `git push`, seu SaaS estará disponível em:

```
https://seu-projeto.vercel.app
```

**Para descobrir a URL exata:**
1. Abra https://vercel.com/dashboard
2. Procure por seu projeto
3. A URL aparece como "Domains"
4. Ou veja em "Production Deployment"

---

## 2️⃣ Testar Endpoints

### Health Check (Status do Servidor)
```
https://seu-projeto.vercel.app/health
```

Você verá algo como:
```json
{
  "status": "ok",
  "timestamp": "2024-03-22T10:30:00.000Z",
  "environment": "production",
  "uptime": 3600
}
```

### Homepage (Info do Medusa)
```
https://seu-projeto.vercel.app
```

Mostra informações sobre a versão do Medusa instalado.

---

## 3️⃣ Se Está Rodando LOCAL (Desenvolvimento)

Se você quer testar ANTES de fazer deploy:

```bash
npm run dev
```

Acesse em seu navegador:
```
http://localhost:3000
```

---

## 4️⃣ Monitorar Deploy em Tempo Real

1. Abra https://vercel.com/dashboard
2. Clique no seu projeto
3. Vá para "Deployments"
4. Veja status em tempo real
5. Logs aparecem automaticamente

---

## 5️⃣ Checklist de Acesso

- [ ] Fiz `git push origin develop`
- [ ] Deploy aparece em Vercel Dashboard como "Ready"
- [ ] URL verde está disponível em "Domains"
- [ ] Health check responde com status "ok"
- [ ] Homepage mostra info do Medusa

---

## 6️⃣ Troubleshooting

### URL não responde?
- Aguarde 2-5 minutos após push
- Vercel precisa de tempo para build
- Veja logs em Vercel Dashboard → Deployments

### Health check retorna erro?
- Verifique se DATABASE_URL está configurado
- Veja logs: Vercel Dashboard → Logs → Runtime Logs

### "Cannot GET /health"
- Verifique se server.js foi enviado
- Veja se `npm run dev` funciona localmente

---

## 7️⃣ Próximos Passos

Seu backend está online! Agora você precisa:

1. **Conectar seu frontend** (loja) à API:
   ```
   NEXT_PUBLIC_API_URL=https://seu-projeto.vercel.app
   ```

2. **Conectar seu admin** (dashboard) à API:
   ```
   NEXT_PUBLIC_ADMIN_API=https://seu-projeto.vercel.app
   ```

3. **Criar as primeiras lojas** (tenants) via admin API

4. **Configurar CORS** se tiver frontend em outro domínio

---

**Seu SaaS está no ar! 🚀**
