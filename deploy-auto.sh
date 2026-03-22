#!/bin/bash

# Script de Deploy Automático para v0
# Faz commit e push para GitHub, triggering deployment no Vercel

set -e

echo "========================================="
echo "INICIANDO DEPLOY AUTOMÁTICO"
echo "========================================="

# Verificar se estamos em um repositório git
if [ ! -d .git ]; then
    echo "Erro: Não está em um repositório git"
    exit 1
fi

# Configurar git (se necessário)
git config user.email "v0-deploy@vercel.app" 2>/dev/null || true
git config user.name "v0 Deploy Bot" 2>/dev/null || true

# Ver status
echo ""
echo "📊 Status do Git:"
git status --short

# Adicionar todos os arquivos
echo ""
echo "📝 Adicionando arquivos..."
git add -A

# Fazer commit
echo "💾 Fazendo commit..."
git commit -m "Deploy: Medusa SaaS multi-tenant pronto para produção

- Backend Medusa com suporte a tenants
- Autenticação JWT segura
- Health check endpoint
- Variáveis de ambiente configuradas
- Pronto para Vercel

Gerado por v0 Deployment Bot" || echo "Nada a commitiar"

# Fazer push
echo "🚀 Fazendo push para GitHub..."
git push origin develop

echo ""
echo "✅ DEPLOYMENT ACIONADO COM SUCESSO!"
echo "========================================="
echo ""
echo "Seu SaaS será compilado e deployado no Vercel em 2-5 minutos."
echo ""
echo "Acesse: https://vercel.com/imeldaberilazaria8/medusa"
echo ""
