#  Sistema de Controle Financeiro Pessoal

**Segunda Avaliação — Frameworks Modernos para Desenvolvimento de Sistemas**

Data de Entrega: 07 de dezembro de 2025

##  Integrantes

- Marcos Vinicius Carvalho Scalcon  
- Natan de Almeida Benites 

##  Descrição do Projeto

Sistema web completo de controle financeiro pessoal. O sistema permite aos usuários gerenciar suas finanças de forma inteligente através de uma interface intuitiva e responsiva.

### Funcionalidades Principais

-  **Autenticação Google** - Login seguro via OAuth através do Supabase
-  **Dashboard Interativo** - Visualização em tempo real de saldo total, entradas e saídas
-  **Gestão de Transações** - CRUD completo (Criar, Listar, Editar e Excluir)
-  **Rotas Protegidas** - Navegação segura com controle de acesso
-  **Persistência de Sessão** - Gerenciamento de estado global com Pinia
-  **Interface Moderna** - Design clean com Vuetify e fonte Inter

### Tipos de Transações

-  **Receitas** - Entradas financeiras com indicadores verdes
-  **Despesas** - Saídas financeiras com indicadores vermelhos

##  Tecnologias Utilizadas

### Frontend
- **Vue.js 3** - Framework JavaScript progressivo
- **Vite** - Build tool rápida e moderna
- **Vuetify** - Biblioteca de componentes Material Design
- **Vue Router 4** - Gerenciamento de rotas
- **Pinia** - Store de gerenciamento de estado
- **Axios** - Cliente HTTP para requisições à API
- **Google Fonts (Inter)** - Tipografia moderna

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express.js 5** - Framework web minimalista
- **Supabase Client** - SDK para integração com Supabase
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

### Banco de Dados & Autenticação
- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Banco de dados relacional
- **Supabase Auth** - Autenticação OAuth com Google

##  Estrutura do Projeto

```
Sistema-de-Controle-Financeiro-Pessoal/
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes Vue reutilizáveis
│   │   ├── views/          # Páginas da aplicação
│   │   │   ├── Login.vue
│   │   │   ├── Dashboard.vue
│   │   │   └── Transactions.vue
│   │   ├── router/         # Configuração de rotas
│   │   ├── stores/         # Stores Pinia
│   │   │   └── auth.js
│   │   ├── services/       # Serviços de API
│   │   │   └── api.js
│   │   ├── lib/            # Configurações externas
│   │   │   └── supabase.js
│   │   ├── App.vue         # Componente raiz
│   │   ├── main.js         # Entrada da aplicação
│   │   └── style.css       # Estilos globais
│   ├── public/             # Arquivos estáticos
│   ├── index.html          # HTML principal
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── routes/         # Definição de rotas
│   │   │   └── transactions.js
│   │   └── index.js        # Servidor Express
│   ├── package.json
│   └── .env               # Variáveis de ambiente (não versionado)
├── .gitignore
├── LICENSE
└── readme.md
```

##  Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Supabase
- Projeto Supabase configurado com autenticação Google

### 1. Clone o Repositório
```bash
git clone https://github.com/MarcosScalcon/Sistema-de-Controle-Financeiro-Pessoal.git
cd Sistema-de-Controle-Financeiro-Pessoal
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anonima_do_supabase
PORT=3000
```

### 3. Configuração do Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env` na pasta `frontend/` com:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Configuração do Banco de Dados

No painel do Supabase, execute a seguinte query SQL para criar a tabela de transações:

```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Política para usuários visualizarem apenas suas transações
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. Configurar Autenticação Google

1. Acesse o painel do Supabase
2. Navegue até **Authentication → Providers**
3. Ative o provedor **Google**
4. Configure as credenciais OAuth do Google Cloud Console
5. Adicione as URLs de redirecionamento autorizadas

##  Executando o Projeto

### Iniciar o Backend
```bash
cd backend
npm start
```
O servidor estará rodando em `http://localhost:3000`  
 **Documentação Swagger:** `http://localhost:3000/api-docs`

### Iniciar o Frontend
```bash
cd frontend
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`

##  Rotas da Aplicação

### Frontend
- `/login` - Página de autenticação com Google OAuth
- `/` - Redireciona automaticamente para `/dashboard`
- `/dashboard` - Dashboard com resumo financeiro (requer autenticação)
- `/transactions` - Listagem e gestão de transações (requer autenticação)

### Backend API
- `GET /transactions` - Lista todas as transações do usuário
- `GET /transactions/:id` - Busca uma transação por ID
- `POST /transactions` - Cria uma nova transação
- `PUT /transactions/:id` - Atualiza uma transação existente
- `DELETE /transactions/:id` - Remove uma transação

###  Documentação da API (Swagger)

A API está totalmente documentada com Swagger/OpenAPI 3.0. Após iniciar o backend, acesse:

```
http://localhost:3000/api-docs
```

A interface interativa do Swagger permite:
- Visualizar todos os endpoints disponíveis
- Ver exemplos de requisições e respostas
- Testar as APIs diretamente pelo navegador
- Consultar os schemas de dados (Transaction, Error)

## ✅ Requisitos Atendidos

### Avaliação 2 - Sistema Completo
- ✅ Framework Vue 3 com Composition API
- ✅ Vuetify para componentes UI
- ✅ Vue Router para navegação
- ✅ Pinia para gerenciamento de estado
- ✅ Backend Express.js
- ✅ CRUD completo de transações
- ✅ Autenticação Google via Supabase
- ✅ Rotas protegidas com guards
- ✅ Dashboard com cálculos de saldo
- ✅ Persistência de dados no PostgreSQL
- ✅ Design responsivo e moderno
- ✅ Confirmações antes de exclusões
- ✅ Feedback visual com snackbars
- ✅ Loading states em operações assíncronas

### Avaliação 3 - Documentação da API
- ✅ Swagger/OpenAPI 3.0 configurado
- ✅ Documentação completa de todos os endpoints
- ✅ Schemas de dados definidos (Transaction, Error)
- ✅ Interface interativa para testes
- ✅ Exemplos de requisições e respostas
- ✅ Descrições detalhadas de parâmetros
- ✅ Documentação de códigos de status HTTP

##  Capturas de Tela

### Tela de Login
Interface clean com autenticação Google OAuth.

![Tela de Login](/images/tela_login.png)

### Dashboard
Visualização de saldo total, entradas, saídas e últimas transações.

![Dashboard](/images/dashboard.png)

### Transações
Tabela completa com CRUD, filtros, edição inline e confirmação de exclusão.

![Transações](/images/transações.png)

### Documentação Swagger - Visão Geral
Interface interativa da API com todos os endpoints documentados.

![Swagger Overview](/images/swagger_overview.png)

### Documentação Swagger - POST Endpoint
Exemplo de criação de transação com request body e validações.

![Swagger POST](/images/swagger_post.png)

### Documentação Swagger - Schemas
Estrutura completa dos modelos de dados (Transaction e Error).

![Swagger Schemas](/images/swagger_schemas.png)


##  Contribuidores

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina de Frameworks Modernos para Desenvolvimento de Sistemas.

- **Marcos Vinicius Carvalho Scalcon** - Desenvolvimento Frontend e Backend
- **Natan de Almeida Benites** - Desenvolvimento Frontend e Backend

##  Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Atualizado em:** 05 de dezembro de 2025  
**Versão:** 1.0.0  
**Status:** ✅ Concluído
