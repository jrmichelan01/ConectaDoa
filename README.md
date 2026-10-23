 # ConectaDoa

## Sobre o projeto

O ConectaDoa é um projeto desenvolvido como parte do Projeto Integrador Extensionista II. A proposta é criar uma aplicação que possa apoiar a conexão entre pessoas interessadas em doar e iniciativas que necessitam de doações.

## Tecnologias utilizadas

- JavaScript
- Node.js
- Express
- Vite+
- HTML e CSS

## Pré-requisitos

- Node.js instalado
- Vite+ instalado como dependência do projeto

## Como executar o projeto

### 1. Instalar as dependências

Na pasta do projeto, execute:

```bash
vp install
```

### 2. Iniciar a API

Abra um terminal no VS Code e execute:

```bash
vp run api
```

A API será iniciada na porta 3000.

### 3. Iniciar a aplicação web

Abra um segundo terminal, mantendo a API em execução, e execute:

```bash
vp dev
```

Acesse o endereço local exibido no terminal. Normalmente, será:

http://localhost:5173

Se essa porta estiver ocupada, o Vite+ poderá selecionar outra, como a porta 5174.

## Verificação da API

A API disponibiliza a rota:

`GET /api/health`

Para testar diretamente, acesse:

http://localhost:3000/api/health

A resposta deve apresentar o status da API como `ok`.

## Compilação do projeto

Para verificar a compilação de produção, execute:

```bash
vp build
```

## Variáveis de ambiente

O arquivo `.env.example` contém um exemplo de configuração da variável `PORT`. O arquivo `.env` é utilizado localmente e não deve ser enviado ao repositório.

## Autor

Projeto acadêmico — ConectaDoa.