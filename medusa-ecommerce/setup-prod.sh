#!/bin/bash

set -e

echo "=========================================="
echo "🚀 INICIANDO SETUP PARA PRODUÇÃO"
echo "=========================================="
echo ""

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
  echo "⚠️  Arquivo .env.local não encontrado!"
  echo "📝 Criando .env.local a partir de .env.example..."
  cp .env.example .env.local
  echo "✓ Arquivo criado. Por favor, edite .env.local com suas configurações."
  exit 1
fi

echo "✓ Arquivo .env.local encontrado"
echo ""

echo "📦 Instalando dependências..."
npm install
echo "✓ Dependências instaladas"
echo ""

echo "💾 Configurando banco de dados..."
npm run db:push
echo "✓ Banco de dados configurado"
echo ""

echo "🔨 Construindo projeto..."
npm run build
echo "✓ Projeto construído com sucesso"
echo ""

echo "=========================================="
echo "✅ SETUP COMPLETO!"
echo "=========================================="
echo ""
echo "🚀 Para iniciar em desenvolvimento:"
echo "   npm run dev"
echo ""
echo "🌍 Para iniciar em produção:"
echo "   npm run start"
echo ""
