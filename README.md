# Simulados Educa - Frontend

Sistema de criação e gerenciamento de simulados educacionais.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento para React
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Quill** - Editor de texto rico
- **Zod** - Validação de schemas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Deploy no Render

### Configuração Automática

O projeto já está configurado para deploy automático no Render através do arquivo `render.yaml`.

### Passos para Deploy:

1. **Criar repositório no GitHub**
   - Faça upload dos arquivos para um repositório público
   - Nome sugerido: `Simulados-Educa`

2. **Conectar ao Render**
   - Acesse [render.com](https://render.com)
   - Conecte sua conta GitHub
   - Selecione o repositório `Simulados-Educa`

3. **Configuração no Render**
   - **Service Type**: Static Site
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Yes

### Variáveis de Ambiente

Configure as seguintes variáveis no painel do Render:

```env
VITE_API_BASE_URL=https://educandario-simulados-backend.onrender.com
VITE_APP_NAME=Educandário Simulados
VITE_APP_VERSION=1.0.0
VITE_ENABLE_LOGS=false
VITE_REQUEST_TIMEOUT=30000
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React (Auth, etc.)
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── types/              # Definições TypeScript
├── utils/              # Utilitários
└── styles/             # Estilos globais
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build local
- `npm run lint` - Executa linting do código

## 📱 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Criação e edição de testes
- ✅ Gerenciamento de questões
- ✅ Editor de texto rico (Quill)
- ✅ Suporte a LaTeX/KaTeX
- ✅ Integração com API externa de questões
- ✅ Interface responsiva
- ✅ Gerenciamento de escolas

## 🌍 URLs

- **Desenvolvimento**: http://localhost:3001
- **Produção**: [Será gerada pelo Render]
- **API Backend**: https://educandario-simulados-backend.onrender.com

## 📄 Licença

Este projeto é privado e proprietário.