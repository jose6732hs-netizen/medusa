#!/usr/bin/env node

/**
 * Script para gerar variaveis de ambiente seguras para a plataforma Medusa SaaS
 * Uso: node scripts/generate-env.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateSecret(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function generateEnv() {
  const envPath = path.join(process.cwd(), '.env');
  
  // Checar se arquivo ja existe
  if (fs.existsSync(envPath)) {
    console.log('⚠️  Arquivo .env ja existe. Nao sobrescrevendo para evitar perda de dados.');
    console.log('Para gerar novas chaves, execute manualmente ou delete o arquivo .env primeiro.');
    process.exit(0);
  }

  const jwtSecret = generateSecret();
  const cookieSecret = generateSecret();
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost/medusa_saas';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
  const storeCors = process.env.STORE_CORS || 'http://localhost:3001';
  const adminCors = process.env.ADMIN_CORS || 'http://localhost:3002';
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@seu-saas.com';
  const superAdminPassword = generateSecret(12); // Senha temporaria

  const envContent = `# ============================================
# DATABASE
# ============================================
DATABASE_URL=${databaseUrl}

# ============================================
# AUTHENTICATION SECRETS
# ============================================
JWT_SECRET=${jwtSecret}
COOKIE_SECRET=${cookieSecret}

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000
BACKEND_URL=${backendUrl}

# ============================================
# CORS CONFIGURATION
# ============================================
STORE_CORS=${storeCors}
ADMIN_CORS=${adminCors}
AUTH_CORS=${backendUrl}

# ============================================
# MULTI-TENANT / SUPER ADMIN
# ============================================
SUPER_ADMIN_URL=http://localhost:3002
SUPER_ADMIN_EMAIL=${superAdminEmail}
SUPER_ADMIN_PASSWORD=${superAdminPassword}

# ============================================
# NODE ENVIRONMENT
# ============================================
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envContent, 'utf-8');

  console.log('✅ Arquivo .env criado com sucesso!');
  console.log('');
  console.log('🔑 Chaves geradas:');
  console.log(`   JWT_SECRET: ${jwtSecret.substring(0, 16)}...`);
  console.log(`   COOKIE_SECRET: ${cookieSecret.substring(0, 16)}...`);
  console.log(`   SUPER_ADMIN_PASSWORD: ${superAdminPassword}`);
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('   1. Abra o arquivo .env e configure o DATABASE_URL (Neon PostgreSQL)');
  console.log('   2. Configure os URLs de CORS com o endereco do seu frontend');
  console.log('   3. Mude o SUPER_ADMIN_PASSWORD apos o primeiro login');
  console.log('   4. Em producao, use um .env seguro e nao commite no git');
}

generateEnv();
