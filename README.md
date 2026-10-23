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
- Dependências do projeto instaladas por meio do Vite+

## Como executar o projeto

### 1. Instalar as dependências

Na pasta do projeto, execute:

```bash
vp install
```

### 2. Configurar as variáveis de ambiente

O arquivo `.env.example` contém um exemplo de configuração da variável `PORT`.

Crie uma cópia desse arquivo com o nome `.env`, na raiz do projeto.

No terminal PowerShell do VS Code, execute:

```powershell
Copy-Item .env.example .env
```

Se o arquivo `.env` já existir, não execute esse comando novamente, para evitar sobrescrever sua configuração.

O arquivo `.env` é utilizado localmente e não deve ser enviado ao GitHub.

### 3. Iniciar a API

Abra um terminal no VS Code e execute:

```bash
vp run api
```

A API será iniciada na porta 3000.

Mantenha esse terminal aberto enquanto utiliza a aplicação.

### 4. Iniciar a aplicação web

Abra um segundo terminal no VS Code e execute:

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

Na página inicial do ConectaDoa, o status da API também deve ser exibido.

## Compilação do projeto

Para verificar a compilação de produção, execute:

```bash
vp build
```

## Variáveis de ambiente

O arquivo `.env.example` deve ser mantido no repositório para orientar a configuração do projeto. O arquivo `.env` contém configurações locais e não deve ser enviado ao GitHub.

## Autor

Projeto acadêmico — ConectaDoa.
