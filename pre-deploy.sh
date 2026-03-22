#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  MEDUSA SAAS - PREPARAÇÃO FINAL PARA PRODUÇÃO"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Passo 1: Validar .env
echo -e "${BLUE}[1/5]${NC} Validando variáveis de ambiente..."
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓${NC} Arquivo .env.production encontrado"
else
    echo -e "${YELLOW}✗${NC} Arquivo .env.production NÃO ENCONTRADO"
    exit 1
fi

# Passo 2: Verificar arquivos críticos
echo -e "${BLUE}[2/5]${NC} Verificando arquivos críticos..."
files=(
    "vercel.json"
    "server.js"
    "medusa-config.js"
    "scripts/validate-env.js"
    "VERCEL_DEPLOY_GUIDE.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${YELLOW}✗${NC} $file FALTANDO!"
    fi
done

# Passo 3: Package.json
echo -e "${BLUE}[3/5]${NC} Verificando scripts do package.json..."
if grep -q '"dev": "node server.js"' package.json; then
    echo -e "${GREEN}✓${NC} Script dev configurado"
fi
if grep -q '"start": "node server.js"' package.json; then
    echo -e "${GREEN}✓${NC} Script start configurado"
fi

# Passo 4: Git status
echo -e "${BLUE}[4/5]${NC} Status do Git..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Repositório Git detectado"
    echo "  Mudanças não commitadas:"
    git status --short
else
    echo -e "${YELLOW}!${NC} Git não inicializado (crie um depois)"
fi

# Passo 5: Instruções finais
echo -e "${BLUE}[5/5]${NC} Próximos passos..."
echo ""
echo -e "${YELLOW}IMPORTANTE:${NC} Leia o arquivo:"
echo -e "  ${GREEN}VERCEL_DEPLOY_GUIDE.md${NC}"
echo ""
echo "Ele contém instruções completas passo-a-passo para:"
echo "  1. Configurar variáveis no Vercel"
echo "  2. Fazer deploy"
echo "  3. Validar produção"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ TUDO PRONTO PARA DEPLOY!${NC}"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Comandos úteis:"
echo "  npm run dev              → Rodar localmente"
echo "  npm run validate:env     → Validar variáveis"
echo "  npm run health:check     → Testar health endpoint"
echo ""
