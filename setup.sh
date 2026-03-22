#!/bin/bash

echo "================================"
echo "Medusa Project Setup"
echo "================================"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Verificar pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm não está instalado. Instalando..."
    npm install -g pnpm
fi
echo "✅ pnpm: $(pnpm --version)"

echo ""
echo "📦 Instalando dependências..."
pnpm install

echo ""
echo "================================"
echo "Configuração Completa!"
echo "================================"
echo ""
echo "Próximos passos:"
echo ""
echo "1. Edite o arquivo .env.local com suas configurações:"
echo "   - DATABASE_URL (já preenchida com Neon)"
echo "   - JWT_SECRET (gere um valor seguro)"
echo "   - COOKIE_SECRET (gere um valor seguro)"
echo "   - ADMIN_CORS e STORE_CORS conforme necessário"
echo ""
echo "2. Execute as migrações do banco de dados:"
echo "   pnpm medusa migrations run"
echo ""
echo "3. Inicie o servidor em desenvolvimento:"
echo "   pnpm dev"
echo ""
echo "O servidor estará disponível em:"
echo "   - Admin: http://localhost:7001"
echo "   - API: http://localhost:9000"
echo ""
