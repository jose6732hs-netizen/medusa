# 🎯 COMECE AQUI - Setup Rápido em 5 Passos

## ✅ Passo 1: Gerar o arquivo `.env`

Execute este comando para gerar as variáveis de ambiente automaticamente:

```bash
node scripts/generate-env.js
```

**Resultado:**
- ✅ `.env` criado com JWT_SECRET e COOKIE_SECRET seguros
- ✅ Mostra a senha temporária do super admin
- ✅ Tudo pronto para desenvolvimento local

---

## ✅ Passo 2: Editar o `.env` com seu DATABASE_URL

Abra o arquivo `.env` que foi criado e procure por:

```env
DATABASE_URL=
```

Substitua pela sua connection string do Neon PostgreSQL:

```env
DATABASE_URL=postgresql://user:password@ep-XXXXXXXXXXX.neon.tech/medusa_saas?sslmode=require
```

**Como obter:**
1. Acesse seu projeto Neon em https://console.neon.tech
2. Clique em "Connection string" 
3. Copie a URL inteira
4. Cole no `.env`

---

## ✅ Passo 3: Configurar URLs do seu Frontend

No `.env`, localize:

```env
STORE_CORS=http://localhost:3001        # URL de onde seu frontend vai rodar
ADMIN_CORS=http://localhost:3002        # URL de onde seu admin vai rodar
BACKEND_URL=http://localhost:3000       # Deixe assim para desenvolvimento
```

Ajuste conforme seu setup:
- Se seu **frontend está em porta 3001** → deixe como está
- Se seu **admin está em outra porta** → mude `ADMIN_CORS`
- Em **produção** → use URLs reais (ex: `https://seu-saas.com`)

---

## ✅ Passo 4: Instalar Dependências

```bash
pnpm install
```

> Se não tem `pnpm` instalado, use `npm install` ou `yarn install`

---

## ✅ Passo 5: Rodar o Servidor

```bash
npm run dev
```

Você deve ver no console:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

🎉 **Seu backend está rodando!**

---

## 🧪 Testando a API

### 1. Criar um Tenant (Loja)

```bash
curl -X POST http://localhost:3000/admin/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minha Primeira Loja",
    "slug": "minha-loja",
    "owner_email": "dono@loja.com",
    "owner_password": "Senha123!"
  }'
```

**Resposta esperada:**
```json
{
  "id": "org_xxxxx",
  "name": "Minha Primeira Loja",
  "slug": "minha-loja",
  "owner_email": "dono@loja.com"
}
```

### 2. Login do Tenant

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dono@loja.com",
    "password": "Senha123!"
  }'
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_xxxxx",
    "email": "dono@loja.com"
  }
}
```

### 3. Usar o Token para Chamar Endpoints

Use o `access_token` para fazer requisições:

```bash
curl -X GET http://localhost:3000/admin/products \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

---

## 🗄️ Variáveis Explicadas

| Variável | O quê é | Exemplo |
|----------|---------|---------|
| `DATABASE_URL` | Conexão com PostgreSQL | `postgresql://user:pass@neon.tech/db` |
| `JWT_SECRET` | Chave para assinar tokens | `a1b2c3d4e5f6...` |
| `COOKIE_SECRET` | Chave para cookies seguros | `9z8y7x6w5v4u...` |
| `STORE_CORS` | URL do frontend da loja | `http://localhost:3001` |
| `ADMIN_CORS` | URL do admin dashboard | `http://localhost:3002` |
| `BACKEND_URL` | URL pública do seu backend | `http://localhost:3000` |
| `SUPER_ADMIN_EMAIL` | Email para acessar admin | `admin@seu-saas.com` |
| `SUPER_ADMIN_PASSWORD` | Senha temporária (MUDE!) | `ChangeMe123!` |

---

## 🚀 Próximos Passos

1. **Conectar seu frontend** à API do backend
2. **Implementar login/cadastro** no seu app
3. **Criar migrations** do banco de dados
4. **Fazer deploy** em produção

---

## ❌ Se não funcionar...

### Erro: "Cannot find module..."
```bash
pnpm install
```

### Erro: "DATABASE_URL is required"
- Abra `.env` e verifique se `DATABASE_URL` está preenchido
- Teste a conexão com o Neon

### Erro: "CORS error"
- Verifique o `STORE_CORS` e `ADMIN_CORS` no `.env`
- Certifique-se de que correspondem ao URL do seu frontend

### Porta 3000 já está em uso
```bash
PORT=3001 npm run dev
```

---

**Dúvidas? Consulte o arquivo `SETUP.md` para mais detalhes** 📖
