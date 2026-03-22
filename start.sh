#!/bin/bash

# ============================================
# 🚀 MEDUSA SAAS - SETUP COMPLETO EM 3 LINHAS
# ============================================

echo "📦 Step 1: Gerando variáveis de ambiente..."
npm run setup:env

echo ""
echo "📥 Step 2: Instalando dependências..."
pnpm install

echo ""
echo "🚀 Step 3: Iniciando servidor..."
npm run dev
