# ConectaDoa

## Sobre o projeto

O ConectaDoa é um projeto desenvolvido como parte do Projeto Integrador Extensionista II. A proposta é criar uma aplicação que possa apoiar a conexão entre pessoas interessadas em doar e iniciativas que necessitam de doações.

## Tecnologias utilizadas

- JavaScript
- Node.js
- Express
- Vite
- HTML e CSS

## Pré-requisitos

- Node.js instalado
- npm instalado

## Como executar o projeto

### 1. Instalar as dependências

Na pasta do projeto, execute:

```bash
npm install
```

### 2. Iniciar a API

Abra um terminal no VS Code e execute:

```bash
npm run api
```

A API será iniciada na porta 3000.

### 3. Iniciar a aplicação web

Abra um segundo terminal, mantendo a API em execução, e execute:

```bash
npm run dev
```

Acesse no navegador:

http://localhost:5173

## Verificação da API

A API disponibiliza a rota:

`GET /api/health`

Para testar diretamente, acesse:

http://localhost:3000/api/health

A resposta deve apresentar o status da API como `ok`.

## Variáveis de ambiente

O arquivo `.env.example` contém um exemplo de configuração da variável `PORT`. O arquivo `.env` é utilizado localmente e não deve ser enviado ao repositório.

## Autor

Projeto acadêmico — ConectaDoa.