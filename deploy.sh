#!/bin/bash

# Script de Deploy IPTV - Railway + Vercel
# Execute: chmod +x deploy.sh && ./deploy.sh

set -e

echo "🚀 Iniciando deploy do projeto IPTV..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Railway CLI...${NC}"
    npm install -g @railway/cli
fi

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi

# Deploy do Backend
echo -e "${GREEN}📡 Deploy do Backend...${NC}"
cd backend

# Login no Railway (se necessário)
echo -e "${YELLOW}Faça login no Railway se solicitado...${NC}"
railway login

# Criar projeto no Railway (se não existir)
if [ ! -f ".railway/config.json" ]; then
    echo -e "${YELLOW}Criando novo projeto no Railway...${NC}"
    railway init --name iptv-backend
fi

# Deploy
echo -e "${YELLOW}Fazendo deploy do backend...${NC}"
railway up

# Obter URL do backend
BACKEND_URL=$(railway domain)
echo -e "${GREEN}✅ Backend deployado em: $BACKEND_URL${NC}"

cd ..

# Deploy do Frontend
echo -e "${GREEN}🎨 Deploy do Frontend...${NC}"
cd frontend

# Atualizar API URL no .env.production
echo "VITE_API_URL=$BACKEND_URL/api" > .env.production

# Deploy na Vercel
echo -e "${YELLOW}Fazendo deploy do frontend...${NC}"
vercel --prod --yes

cd ..

echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}Backend: $BACKEND_URL${NC}"
echo -e "${GREEN}Frontend: https://seu-frontend.vercel.app${NC}"
