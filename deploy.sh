#!/bin/bash

# Script de Deploy IPTV - Render + Vercel
# Execute: chmod +x deploy.sh && ./deploy.sh

set -e

echo "🚀 Iniciando deploy do projeto IPTV..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não está instalado. Por favor, instale o Git primeiro.${NC}"
    exit 1
fi

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi

# Deploy do Backend - Render (via Git)
echo -e "${GREEN}📡 Deploy do Backend no Render...${NC}"
cd backend

# Verificar se está em um repositório Git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Inicializando repositório Git...${NC}"
    git init
    git add .
    git commit -m "Initial commit for Render deploy"
fi

# Adicionar remote do Render (usuário deve configurar manualmente)
echo -e "${YELLOW}Para conectar com o Render, configure o remote do Git:${NC}"
echo -e "${YELLOW}git remote add render https://git.render.com/seu-projeto.git${NC}"
echo -e "${YELLOW}Ou use o dashboard do Render para conectar seu repositório${NC}"

# Mostrar instruções para configuração do Render
echo -e "${GREEN}✅ Backend configurado para Render!${NC}"
echo -e "${GREEN}Próximos passos:${NC}"
echo -e "1. Acesse https://render.com e crie uma conta"
echo -e "2. Crie um novo Web Service"
echo -e "3. Conecte seu repositório Git"
echo -e "4. Configure as variáveis de ambiente no dashboard"
echo -e "5. Faça push para o branch main para deploy automático"

# Obter URL do backend (será fornecida pelo Render)
BACKEND_URL="https://seu-backend.onrender.com"
echo -e "${GREEN}Backend será acessível em: $BACKEND_URL${NC}"

cd ..

# Deploy do Frontend - Vercel (mantido)
echo -e "${GREEN}🎨 Deploy do Frontend na Vercel...${NC}"
cd frontend

# Atualizar API URL no .env.production
echo "VITE_API_URL=$BACKEND_URL/api" > .env.production

# Deploy na Vercel
echo -e "${YELLOW}Fazendo deploy do frontend...${NC}"
vercel --prod --yes

cd ..

echo -e "${GREEN}🎉 Configuração para Render concluída!${NC}"
echo -e "${GREEN}Backend: Configure no dashboard do Render${NC}"
echo -e "${GREEN}Frontend: https://seu-frontend.vercel.app${NC}"
echo -e "${GREEN}Documentação: https://render.com/docs${NC}"
