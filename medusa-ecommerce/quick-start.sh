#!/bin/bash

# Quick Start Script for Medusa ECommerce
# Execute este script na pasta medusa-ecommerce

echo "🚀 Medusa ECommerce - Quick Start"
echo "=================================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale de https://nodejs.org"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

# Criar arquivo .env.local
echo ""
echo "🔧 Configurando variáveis de ambiente..."

if [ ! -f .env.local ]; then
    cat > .env.local << 'EOF'
# Database (Neon)
# Obtenha seu DATABASE_URL em console.neon.tech
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]

# NextAuth
NEXTAUTH_SECRET=seu-secret-aleatorio-aqui
NEXTAUTH_URL=http://localhost:3000

# (Opcional) Stripe
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
EOF

    echo "✅ Arquivo .env.local criado"
    echo "⚠️  IMPORTANTE: Edite .env.local com suas credenciais do Neon"
else
    echo "✅ Arquivo .env.local já existe"
fi

# Push database
echo ""
echo "🗄️  Enviando schema para o banco..."
npm run db:push

# Iniciar servidor
echo ""
echo "🎉 Iniciando servidor..."
echo "📍 Acesse http://localhost:3000"
echo ""
npm run dev
