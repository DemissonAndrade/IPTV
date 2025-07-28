# IPTV Pro - Backend API

Backend Node.js com PostgreSQL para o sistema IPTV Pro.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Joi** - Validação de dados
- **Helmet** - Segurança
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - Logging de requisições

## 📁 Estrutura

```
backend/
├── config/           # Configurações
│   └── database.js   # Configuração PostgreSQL
├── controllers/      # Controladores
│   ├── authController.js
│   └── channelsController.js
├── middleware/       # Middlewares
│   ├── auth.js       # Autenticação JWT
│   └── validation.js # Validação de dados
├── migrations/       # Migrações do banco
│   └── init.js       # Criação inicial das tabelas
├── routes/           # Rotas da API
│   ├── auth.js       # Rotas de autenticação
│   └── channels.js   # Rotas de canais
├── utils/            # Utilitários
├── .env              # Variáveis de ambiente
├── package.json      # Dependências
├── server.js         # Servidor principal
└── README.md         # Este arquivo
```

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar PostgreSQL

Instale o PostgreSQL e crie um banco de dados:

```sql
CREATE DATABASE iptv_pro;
CREATE USER iptv_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE iptv_pro TO iptv_user;
```

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iptv_pro
DB_USER=iptv_user
DB_PASSWORD=sua_senha

# Aplicação
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_muito_segura

# CORS
CORS_ORIGIN=*
```

### 4. Executar Migrações

As tabelas são criadas automaticamente na primeira execução.

## 🏃‍♂️ Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 📚 API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar usuário | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/verify` | Verificar token | ✅ |
| POST | `/api/auth/logout` | Logout | ✅ |

### Canais

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/channels` | Listar canais | ❌ |
| GET | `/api/channels/:id` | Detalhes do canal | ❌ |
| GET | `/api/channels/:id/stream` | URL de stream | ✅ |
| POST | `/api/channels/:id/favorite` | Adicionar favorito | ✅ |
| DELETE | `/api/channels/:id/favorite` | Remover favorito | ✅ |
| GET | `/api/channels/favorites/list` | Listar favoritos | ✅ |

### Utilitários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status do servidor |
| GET | `/` | Informações da API |

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer <seu_token_jwt>
```

## 📝 Exemplos de Uso

### Registrar Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

### Listar Canais

```bash
curl http://localhost:3000/api/channels
```

## 🗄️ Banco de Dados

### Principais Tabelas

- **usuarios** - Dados dos usuários
- **planos** - Planos de assinatura
- **assinaturas** - Assinaturas ativas
- **categorias** - Categorias de conteúdo
- **canais** - Canais de TV
- **filmes** - Catálogo de filmes
- **series** - Catálogo de séries
- **episodios** - Episódios das séries
- **favoritos** - Favoritos dos usuários
- **historico** - Histórico de visualização

### Dados de Exemplo

O sistema inclui dados de exemplo:

- **Admin**: admin@iptvpro.com / admin123
- **Planos**: Básico, Premium, Família
- **Canais**: Globo, SBT, Record, ESPN, Discovery
- **Categorias**: Canais Abertos, Esportes, Filmes, etc.

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Rate limiting para prevenir ataques
- Helmet para headers de segurança
- Validação de dados com Joi
- CORS configurado
- JWT com expiração

## 🐛 Logs e Debug

Os logs são exibidos no console e incluem:
- Requisições HTTP (Morgan)
- Queries do banco de dados
- Erros e exceções
- Status de inicialização

## 📦 Deploy

Para deploy em produção:

1. Configure as variáveis de ambiente
2. Use um gerenciador de processos (PM2)
3. Configure proxy reverso (Nginx)
4. Use HTTPS
5. Configure backup do banco

```bash
# Exemplo com PM2
npm install -g pm2
pm2 start server.js --name "iptv-backend"
pm2 startup
pm2 save
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é para fins educacionais e demonstrativos.

