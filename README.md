 
# ConectaDoa

Projeto desenvolvido para a atividade de Projeto Integrador Extensionista II (PIE II), da Universidade de Marília (UNIMAR).

## Sobre o projeto

O ConectaDoa é um sistema voltado ao registro e à consulta de doações, permitindo organizar os dados dos doadores, dos itens disponíveis e das doações realizadas.

## Tecnologias utilizadas

- JavaScript
- Node.js
- Express
- MySQL
- Vite

## Requisitos

- Node.js e npm instalados
- MySQL instalado e em execução

## Configuração do projeto

1. Instale as dependências:

   npm install

2. Configure as variáveis de ambiente no arquivo `.env`, utilizando o `.env.example` como modelo.

3. Crie o banco de dados e as tabelas utilizando o arquivo `database/schema.sql`.

4. Se necessário, insira os dados iniciais utilizando o arquivo `database/seed.sql`.

## Como executar

Para iniciar a API:

   npm run api

Para iniciar o ambiente de desenvolvimento do front-end, abra outro terminal e execute:

   npm run dev

## Rotas da API

- GET `/api/health` — verifica a conexão com o banco de dados.
- `/api/doadores` — consulta e gerencia os doadores.
- `/api/itens` — consulta os itens disponíveis.
- `/api/doacoes` — consulta e cadastra doações.

## Observação

As credenciais do banco de dados devem permanecer no arquivo `.env`, que não deve ser enviado ao GitHub.
