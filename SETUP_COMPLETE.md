# 🚀 Configuração Completa - Projeto Medusa

## ✅ Variáveis de Ambiente Configuradas

Seu arquivo `.env.local` foi criado com as seguintes variáveis:

### 🗄️ Banco de Dados (Neon PostgreSQL)
- **DATABASE_URL** ✅ Configurada (com pooler)
- **DATABASE_URL_UNPOOLED** ✅ Configurada (para migrações)

### ⚙️ Ambiente
- **NODE_ENV** → `development`

### 🔐 Segurança (IMPORTANTE - Altere em produção!)
- **JWT_SECRET** → `your-super-secret-jwt-key-change-in-production-min-32-chars`
- **COOKIE_SECRET** → `your-super-secret-cookie-key-change-in-production-32`

### 🌐 CORS (Acesso Permitido)
- **ADMIN_CORS** → `http://localhost:7001,http://localhost:7002`
- **STORE_CORS** → `http://localhost:3000,http://localhost:8000`

### 📁 Arquivos
- **FILE_SERVICE_LOCAL_URL** → `http://localhost:9000`

### 🔌 Servidor
- **PORT** → `9000`

---

## 📋 Próximas Etapas

### 1️⃣ Instale as Dependências
```bash
pnpm install
```

Ou use o script automatizado:
```bash
chmod +x setup.sh
./setup.sh
```

### 2️⃣ Configure Secrets Seguros (PRODUÇÃO)
Para produção, gere valores seguros e substitua em `.env.local`:

```bash
# Gerar JWT_SECRET (32+ caracteres aleatórios)
openssl rand -base64 32

# Gerar COOKIE_SECRET (32 caracteres aleatórios)
openssl rand -hex 16
```

### 3️⃣ Execute as Migrações
```bash
pnpm medusa migrations run
```

### 4️⃣ Inicie o Servidor em Desenvolvimento
```bash
pnpm dev
```

---

## 🎯 Acessar o Medusa

Após iniciar:

- **Admin Dashboard**: http://localhost:7001
- **API REST**: http://localhost:9000
- **Storefront (se configurado)**: http://localhost:3000

---

## 📝 Informações do Banco de Dados

| Propriedade | Valor |
|-----------|-------|
| **Host** | `ep-super-glade-a4iqxq17-pooler.us-east-1.aws.neon.tech` |
| **Database** | `neondb` |
| **User** | `neondb_owner` |
| **Region** | `us-east-1` (AWS) |
| **PostgreSQL Version** | `17` |
| **Provider** | Neon (Serverless PostgreSQL) |

---

## 🐛 Troubleshooting

### Erro: "DATABASE_URL not set"
Verifique se o arquivo `.env.local` existe e está na raiz do projeto.

### Erro: "Connection refused"
Certifique-se de que:
- Você tem conexão com a internet (Neon é um banco remoto)
- A DATABASE_URL está correta
- As credenciais do Neon estão válidas

### Erro de Migrações
Se as migrações falharem:
```bash
# Listar migrações
pnpm medusa migrations list

# Reverter última migração
pnpm medusa migrations revert --name=NOME_DA_MIGRACAO
```

---

## 📚 Arquivos Criados

- **`.env.local`** - Variáveis de ambiente (não comitar no Git)
- **`.env.example`** - Referência de variáveis (comitar no Git)
- **`setup.sh`** - Script automatizado de setup
- **`ENVIRONMENT_SETUP.md`** - Guia detalhado (este arquivo)

---

## 🔒 Segurança

⚠️ **IMPORTANTE**: 
- Nunca comite `.env.local` no Git
- Use valores seguros para JWT_SECRET e COOKIE_SECRET em produção
- Mantenha suas credenciais do Neon seguras
- Use HTTPS em produção

---

## ✨ Seu Projeto Está Pronto!

Você agora tem um projeto Medusa completo com:
- ✅ Banco de dados Neon PostgreSQL conectado
- ✅ Variáveis de ambiente configuradas
- ✅ Estrutura pronta para desenvolvimento
- ✅ Scripts de setup automatizados

**Comece com**: `pnpm install && pnpm dev`

Boa sorte! 🎉
