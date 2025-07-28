# IPTV Pro - Frontend

Frontend React com Material UI para o sistema IPTV Pro.

## 🚀 Tecnologias

- **React 19** - Biblioteca JavaScript
- **Material UI** - Componentes de interface
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado
- **Emotion** - CSS-in-JS
- **Vite** - Build tool

## 📁 Estrutura

```
frontend/
├── public/           # Arquivos públicos
├── src/
│   ├── components/   # Componentes reutilizáveis
│   │   ├── ui/       # Componentes shadcn/ui
│   │   └── Header.jsx
│   ├── contexts/     # Contextos React
│   │   └── AuthContext.jsx
│   ├── pages/        # Páginas da aplicação
│   │   ├── Home.jsx
│   └── Login.jsx
│   ├── services/     # Serviços de API
│   │   └── api.js
│   ├── theme/        # Tema Material UI
│   │   └── theme.js
│   ├── App.jsx       # Componente principal
│   ├── App.css       # Estilos principais
│   └── main.jsx      # Ponto de entrada
├── package.json      # Dependências
├── vite.config.js    # Configuração Vite
└── README.md         # Este arquivo
```

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar API

Edite o arquivo `src/services/api.js` e configure a URL do backend:

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

### 3. Executar em Desenvolvimento

```bash
pnpm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### 4. Build para Produção

```bash
pnpm run build
```

## 🎨 Tema e Design

### Material UI Dark Theme

O projeto usa um tema escuro personalizado com:

- **Cores Primárias**: Azul (#1976d2)
- **Cores Secundárias**: Rosa (#dc004e)
- **Background**: Preto/Cinza escuro
- **Tipografia**: Roboto

### Componentes Principais

- **Header**: Navegação principal com menu responsivo
- **AuthContext**: Gerenciamento de autenticação
- **Theme**: Tema Material UI personalizado

## 📱 Páginas

### Home (`/`)
- Hero section com call-to-action
- Conteúdo em destaque
- Canais populares
- Seção de cadastro para não autenticados

### Login (`/login`)
- Formulário de login
- Validação de campos
- Redirecionamento após login
- Credenciais de demonstração

### Outras Páginas (Em desenvolvimento)
- `/register` - Cadastro de usuário
- `/channels` - Lista de canais
- `/movies` - Catálogo de filmes
- `/series` - Catálogo de séries
- `/favorites` - Favoritos do usuário
- `/profile` - Perfil do usuário
- `/plans` - Planos de assinatura

## 🔐 Autenticação

### Context API

O sistema usa Context API para gerenciar o estado de autenticação:

```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

### Token JWT

- Armazenado no localStorage
- Enviado automaticamente nas requisições
- Interceptor para renovação/logout automático

### Proteção de Rotas

Rotas protegidas redirecionam para login se não autenticado.

## 📡 Integração com API

### Serviços Disponíveis

- **authService**: Login, registro, verificação
- **channelsService**: Canais de TV
- **vodService**: Filmes e séries
- **plansService**: Planos de assinatura

### Interceptors

- **Request**: Adiciona token JWT automaticamente
- **Response**: Trata erros e logout automático

## 📱 Responsividade

### Breakpoints Material UI

- **xs**: 0px - 599px (Mobile)
- **sm**: 600px - 959px (Tablet)
- **md**: 960px - 1279px (Desktop pequeno)
- **lg**: 1280px - 1919px (Desktop)
- **xl**: 1920px+ (Desktop grande)

### Componentes Responsivos

- Header com menu drawer no mobile
- Grid system responsivo
- Tipografia adaptativa

## 🎯 Funcionalidades

### Implementadas ✅

- [x] Sistema de autenticação
- [x] Navegação responsiva
- [x] Tema escuro personalizado
- [x] Integração com API
- [x] Página inicial
- [x] Login/Logout
- [x] Gerenciamento de estado

### Em Desenvolvimento 🚧

- [ ] Cadastro de usuário
- [ ] Lista de canais
- [ ] Player de vídeo
- [ ] Sistema de favoritos
- [ ] Perfil do usuário
- [ ] Planos de assinatura
- [ ] Busca de conteúdo

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run dev

# Build
pnpm run build

# Preview do build
pnpm run preview

# Lint
pnpm run lint
```

## 🌐 Deploy

### Build de Produção

```bash
pnpm run build
```

### Variáveis de Ambiente

Crie um arquivo `.env` para configurações:

```env
VITE_API_URL=https://sua-api.com/api
```

### Hospedagem

O projeto pode ser hospedado em:
- Vercel
- Netlify
- GitHub Pages
- Servidor próprio

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é para fins educacionais e demonstrativos.

