# 📑 Sistema de Comandas — Web

Frontend do sistema de comandas, para controle de consumo em bares, restaurantes e eventos. Consome a API do [bar-system-backend](https://github.com/hi-giih/bar-system-backend) e está publicado na Vercel.

## ⚙️ Funcionalidades

- 🔐 **Login** com JWT: o token fica salvo no navegador, é enviado em todas as requisições e, se a API responder 401, o usuário volta para a tela de login. Há botão de logout (inclusive no mobile).
- 🧾 **Comandas:** listagem, criação, detalhe com produtos consumidos, alteração de quantidade, remoção de produtos e fechamento.
- 💰 **Pagamentos:** geração de pagamento (Pix com QR Code, cartão ou dinheiro) e confirmação, com atualização do saldo restante da comanda.
- 👤 **Clientes:** cadastro, listagem, edição e exclusão.
- 🛒 **Produtos:** cadastro, listagem, edição e exclusão, com escolha do ícone (drink, bebida ou comida). Não aceita preço negativo.
- 🔎 **Busca** de cliente e produto por texto, pensada para listas grandes.
- 📊 **Relatório:** download da planilha de comandas (`.xlsx`).
- 📱 **Layout responsivo**, com menu lateral no desktop e barra de navegação inferior no mobile.
- 🧪 **Modo mock:** permite desenvolver com dados fictícios, sem precisar do backend.

## 💻 Tecnologias

- **React 19** + **TypeScript**
- **Vite** (bundler e servidor de desenvolvimento)
- **React Router** (rotas e proteção de rotas autenticadas)
- **TanStack Query** (cache e sincronização dos dados da API)
- **React Hook Form** + **Zod** (formulários e validação)
- **Tailwind CSS 4** (estilização)
- **Axios** (requisições HTTP) e **axios-mock-adapter** (modo mock)
- **Sonner** (notificações), **react-icons** e **date-fns**
- **Oxlint** (lint)
- **Vercel** (deploy)

## 🏗️ Estrutura do projeto

```
src/
├── components/ui/   # Componentes visuais reutilizáveis (Button, Modal, Sidebar...)
├── features/        # Hooks e formulários por domínio (clientes, comandas, produtos)
├── pages/           # Telas (Login, Comandas, ComandaDetalhe, NovaComanda, Clientes, Produtos)
├── providers/       # AuthProvider (estado de autenticação)
├── routes/          # Layout e proteção de rotas
├── schemas/         # Validações com Zod
├── services/        # Cliente Axios (api.ts), com token e tratamento de 401
├── mocks/           # Dados fictícios do modo mock
├── types/           # Tipos TypeScript
├── utils/           # Formatação de moeda e data, status, ícones...
└── config/env.ts    # Variáveis de ambiente
```

## 🚀 Rodando localmente

**Pré-requisito:** Node.js 20+.

1. Clone o repositório:
```bash
git clone https://github.com/hi-giih/bar-system-web.git
cd bar-system-web
```

2. Instale as dependências:
```bash
npm install
```

3. Copie `.env.example` para `.env.local` e ajuste, se necessário (veja abaixo).

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação abre em `http://localhost:5173`.

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_BASE_URL` | URL base da API. Padrão: `https://bar-system-backend.onrender.com`. Use `http://127.0.0.1:5000` para rodar contra o backend local. |
| `VITE_USE_MOCKS` | `true` usa dados fictícios em memória, sem backend. Padrão: `false`. |

> Para usar o backend local, a origem `http://localhost:5173` precisa estar em `CORS_ALLOWED_ORIGINS` (já é o padrão do backend).

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checa os tipos e gera o build de produção |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Roda o Oxlint |

## ☁️ Deploy

Hospedado na [Vercel](https://vercel.com). O `vercel.json` configura:

- **Rewrite** para `index.html`, para as rotas do React Router funcionarem em acesso direto.
- **Cache:** `index.html` sem cache e `/assets/*` com cache permanente (arquivos com hash), evitando que o navegador sirva uma versão antiga após um novo deploy.

## 🔗 Integração com o backend

O backend fica no Render (plano free), que hiberna por inatividade, então a primeira requisição depois de um tempo parado pode demorar. Repositório: [bar-system-backend](https://github.com/hi-giih/bar-system-backend).

## 📜 Autoria

Projeto criado por Giovanna Santos ([@hi-giih](https://github.com/hi-giih)).
