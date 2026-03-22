# 📋 Guia de Configuração - Variáveis de Ambiente

Este guia descreve as variáveis de ambiente necessárias para iniciar o projeto Medusa.

## ✅ Variáveis Obrigatórias

### 1. **DATABASE_URL** (Neon PostgreSQL)
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

**Descrição:** URL de conexão com pool de conexões para o banco de dados PostgreSQL.

**Como obter:**
- Vá para o Neon Dashboard
- Copie a URL de conexão da sua database
- A URL já inclui o pool de conexões por padrão

**Exemplo:**
```
DATABASE_URL=postgresql://neondb_owner:Abc123xyz@ep-random-host.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

### 2. **DATABASE_URL_UNPOOLED** (Para Migrações)
```
DATABASE_URL_UNPOOLED=postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

**Descrição:** URL de conexão SEM pool de conexões, usada para executar migrações de banco de dados.

**Como obter:**
- Use a mesma URL do `DATABASE_URL`
- Adicione `?sslmode=require` se for Neon

**Nota:** Algumas ferramentas de migração requerem conexões diretas sem pool.

---

### 3. **NODE_ENV**
```
NODE_ENV=development
```

**Valores válidos:**
- `development` - Modo de desenvolvimento (HMR ativado, logs detalhados)
- `production` - Modo de produção (otimizado, logs mínimos)
- `test` - Modo de testes

---

### 4. **JWT_SECRET**
```
JWT_SECRET=seu-chave-secreta-aleatoria-aqui
```

**Descrição:** Chave usada para assinar tokens JWT de autenticação.

**Como gerar uma chave segura:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Importante:** 
- ⚠️ Deve ter **pelo menos 32 caracteres**
- Deve ser aleatória e única
- Nunca compartilhe esta chave
- Em produção, armazene em um gerenciador de secrets

---

### 5. **COOKIE_SECRET**
```
COOKIE_SECRET=sua-chave-secreta-aleatoria-aqui
```

**Descrição:** Chave usada para assinar cookies de sessão.

**Como gerar uma chave segura:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Importante:**
- ⚠️ Deve ter **pelo menos 32 caracteres**
- Deve ser diferente do `JWT_SECRET`
- Deve ser aleatória e única
- Em produção, armazene em um gerenciador de secrets

---

### 6. **ADMIN_CORS**
```
ADMIN_CORS=http://localhost:7001,http://localhost:7002
```

**Descrição:** URLs permitidas para requisições CORS do painel administrativo.

**Desenvolvimento:**
```
ADMIN_CORS=http://localhost:7001,http://localhost:7002,http://127.0.0.1:7001
```

**Produção:**
```
ADMIN_CORS=https://admin.seu-dominio.com,https://admin-alt.seu-dominio.com
```

---

### 7. **STORE_CORS**
```
STORE_CORS=http://localhost:3000,http://localhost:8000
```

**Descrição:** URLs permitidas para requisições CORS da storefront (loja).

**Desenvolvimento:**
```
STORE_CORS=http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000
```

**Produção:**
```
STORE_CORS=https://loja.seu-dominio.com,https://www.seu-dominio.com
```

---

### 8. **FILE_SERVICE_LOCAL_URL**
```
FILE_SERVICE_LOCAL_URL=http://localhost:9000
```

**Descrição:** URL base para o serviço de arquivos locais (uploads).

**Desenvolvimento:**
```
FILE_SERVICE_LOCAL_URL=http://localhost:9000
```

**Produção:**
```
FILE_SERVICE_LOCAL_URL=https://seu-dominio.com
```

---

### 9. **PORT**
```
PORT=9000
```

**Descrição:** Porta na qual o servidor Medusa será executado.

**Valores comuns:**
- `9000` - Desenvolvimento padrão
- `3000` - Alternativa comum
- `8000` - Outra alternativa

---

## 🔧 Variáveis Opcionais

### REDIS_URL
```
REDIS_URL=redis://localhost:6379
```
**Uso:** Cache, sessions, rate limiting
**Padrão:** Usa implementação em memória se não configurado

---

### LOG_LEVEL
```
LOG_LEVEL=info
```
**Valores:** `debug`, `info`, `warn`, `error`
**Padrão:** `info`

---

### ANONYMIZED_TELEMETRY
```
ANONYMIZED_TELEMETRY=true
```
**Uso:** Enviar dados anônimos de telemetria
**Padrão:** `true`

---

## 🚀 Como Configurar

### Passo 1: Criar arquivo `.env`
```bash
cp .env.example .env
```

### Passo 2: Preencher variáveis obrigatórias
```bash
# Editar .env com seus valores
# DATABASE_URL, JWT_SECRET, COOKIE_SECRET, etc.
```

### Passo 3: Verificar configuração
```bash
# Listar variáveis de ambiente
env | grep -E "DATABASE_URL|NODE_ENV|JWT_SECRET"
```

### Passo 4: Inicializar banco de dados
```bash
yarn medusa db create
yarn medusa db migrate
```

### Passo 5: Iniciar servidor
```bash
yarn dev
```

---

## 🔐 Boas Práticas de Segurança

✅ **Recomendado:**
- Gerar chaves aleatórias e seguras
- Usar variáveis diferentes para dev, test e prod
- Armazenar secrets em gerenciador de secrets (Vercel Secrets, HashiCorp Vault)
- Nunca commitar `.env` com valores reais no Git
- Adicionar `.env` ao `.gitignore`
- Rotacionar secrets regularmente em produção

❌ **Nunca:**
- Commitar valores reais de `.env` no repositório
- Usar chaves fracas ou fáceis de adivinhar
- Compartilhar secrets em Slack, email ou chat
- Reutilizar a mesma chave em múltiplos ambientes
- Deixar secrets em logs ou console

---

## ✨ Verificação Rápida

Execute este comando para verificar se todas as variáveis obrigatórias estão configuradas:

```bash
required_vars=(DATABASE_URL NODE_ENV JWT_SECRET COOKIE_SECRET ADMIN_CORS STORE_CORS FILE_SERVICE_LOCAL_URL PORT)

for var in "${required_vars[@]}"; do
  if [ -z "$(echo $var | xargs eval echo)" ]; then
    echo "❌ $var não está configurado"
  else
    echo "✅ $var está configurado"
  fi
done
```

---

**Para mais informações, consulte:** https://docs.medusajs.com/learn/fundamentals/environment-variables
