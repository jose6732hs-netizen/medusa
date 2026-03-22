#!/usr/bin/env node

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const envPath = path.join(projectRoot, '.env.production')

// Dados da configuração obtida do Neon
const DATABASE_URL = 'postgresql://neondb_owner:npg_eYI0o9qOXhTC@ep-super-glade-a4iqxq17-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'

// URLs do Vercel (placeholder - usuário vai substituir)
const VERCEL_PROJECT_NAME = process.env.VERCEL_PROJECT_NAME || 'medusa-saas'
const VERCEL_URL = process.env.VERCEL_URL || `${VERCEL_PROJECT_NAME}.vercel.app`

// Gerar secrets seguros (32 caracteres aleatórios em base64)
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64').slice(0, length)
}

console.log('🔧 Gerando configuração de produção para Vercel...\n')

const JWT_SECRET = generateSecret()
const COOKIE_SECRET = generateSecret()

const productionConfig = `# ============================================================
# MEDUSA SAAS - CONFIGURAÇÃO DE PRODUÇÃO (VERCEL)
# ============================================================
# ⚠️ IMPORTANTE: Essas variáveis estão configuradas no Vercel
# Não edite este arquivo manualmente!

# Database PostgreSQL (Neon)
DATABASE_URL=${DATABASE_URL}

# Secrets de autenticação (gerados aleatoriamente)
JWT_SECRET=${JWT_SECRET}
COOKIE_SECRET=${COOKIE_SECRET}

# URLs da aplicação (ajuste com seu domínio real)
# Exemplo: https://medusa-saas.vercel.app
BACKEND_URL=https://${VERCEL_URL}

# URLs do CORS para seu frontend/admin
# Atualize esses valores com seus domínios reais em produção
STORE_CORS=https://${VERCEL_URL}
ADMIN_CORS=https://${VERCEL_URL}
AUTH_CORS=https://${VERCEL_URL}

# Ambiente
NODE_ENV=production
PORT=3000

# ============================================================
# PRÓXIMAS ETAPAS:
# ============================================================
# 1. Copie todas as variáveis acima
# 2. Vá para: https://vercel.com/dashboard
# 3. Abra seu projeto: ${VERCEL_PROJECT_NAME}
# 4. Settings → Environment Variables
# 5. Cole cada variável (KEY=VALUE)
# 6. Faça deploy
# ============================================================
`

try {
  fs.writeFileSync(envPath, productionConfig, 'utf-8')
  console.log('✅ Arquivo .env.production criado com sucesso!\n')
  console.log(`📁 Localização: ${envPath}\n`)
  console.log('📋 INSTRUÇÕES PARA VERCEL:\n')
  console.log('1. Abra seu projeto no Vercel Dashboard')
  console.log('2. Clique em "Settings"')
  console.log('3. Vá para "Environment Variables"')
  console.log('4. Adicione as variáveis:\n')
  
  const vars = {
    DATABASE_URL,
    JWT_SECRET,
    COOKIE_SECRET,
    BACKEND_URL: `https://${VERCEL_URL}`,
    STORE_CORS: `https://${VERCEL_URL}`,
    ADMIN_CORS: `https://${VERCEL_URL}`,
    AUTH_CORS: `https://${VERCEL_URL}`,
    NODE_ENV: 'production'
  }
  
  Object.entries(vars).forEach(([key, value]) => {
    console.log(`   ${key}=${key === 'DATABASE_URL' ? '(connection string Neon)' : '(veja arquivo .env.production)'}`)
  })
  
  console.log('\n5. Clique "Save"')
  console.log('6. Faça um git push ou redeploy\n')
  console.log('✨ Seu backend SaaS estará online em: https://' + VERCEL_URL)
} catch (error) {
  console.error('❌ Erro ao criar arquivo:', error.message)
  process.exit(1)
}
