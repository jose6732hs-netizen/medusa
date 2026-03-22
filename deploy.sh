#!/bin/bash

echo "🚀 DEPLOYMENT AUTOMÁTICO DO MEDUSA SAAS"
echo "========================================"
echo ""
echo "📍 Repositório: jose6732hs-netizen/medusa"
echo "📍 Branch: develop"
echo "📍 Projeto Vercel: medusa"
echo ""
echo "⏳ Sincronizando com Vercel..."
echo ""

# Trigger do deployment
curl -X POST https://api.vercel.com/v1/deployments \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "medusa-saas",
    "gitSource": {
      "type": "github",
      "repo": "jose6732hs-netizen/medusa",
      "ref": "develop"
    }
  }' 2>/dev/null

echo "✅ Deployment enviado para o Vercel!"
echo ""
echo "⏳ Seu SaaS está sendo construído... Aguarde 3-5 minutos"
echo ""
echo "📍 Acompanhe em: https://vercel.com/imeldaberilazaria8/medusa"
echo ""
echo "✨ Quando terminar, acesse: https://medusa.vercel.app"
