#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando setup do Medusa ECommerce${NC}"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL não está definida${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm install

# Generate Drizzle migrations
echo -e "${YELLOW}📝 Gerando migrações do Drizzle...${NC}"
npm run db:generate

# Push schema to database
echo -e "${YELLOW}📊 Criando tabelas no banco de dados...${NC}"
npm run db:push

# Generate environment file
echo -e "${YELLOW}🔐 Gerando arquivo .env.local...${NC}"
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✅ Arquivo .env.local criado (configure as variáveis)${NC}"
fi

echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo -e "${YELLOW}🎯 Próximos passos:${NC}"
echo "1. Configure as variáveis de ambiente em .env.local"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:3000"
