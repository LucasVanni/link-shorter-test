# Autenticação API

Este projeto é uma API de autenticação construída com NestJS. Abaixo estão as instruções para rodar o projeto localmente.

## Pré-requisitos

- Node.js (versão 18.18 ou superior)
- npm ou yarn
- Docker (opcional, para rodar o banco de dados)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/LucasVanni/link-shorter-test
cd link-shorter-test
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o docker compose para criar o banco de dados:

```bash
docker compose up -d
```

4. Rode o prisma migrate para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev
```

5. Rode o prisma generate para gerar os tipos do prisma:

```bash
npx prisma generate
```

6. Rode o projeto no modo de desenvolvimento:

```bash
npm run start:dev
```

## Documentação

A documentação da API está disponível no Swagger UI, que pode ser acessada no seguinte endereço:

http://localhost:3000/api

## Autenticação

Para autenticar as requisições, é necessário incluir o token JWT no header Authorization com o seguinte formato:

```
Authorization: Bearer {token}
```

## Endpoints

### Cadastro de usuário (POST)

http://localhost:3000/auth/register

### Login (POST)

http://localhost:3000/auth/login

### Encurtar link (POST)

http://localhost:3000/links/shorten

### Listar links (GET)

http://localhost:3000/links

### Listar link por ID (GET)

http://localhost:3000/links/:id

### Atualizar link (PUT)

http://localhost:3000/links/:id

### Deletar link (DELETE)

http://localhost:3000/links/:id
