

## Para acessar a api e fazer as requests para a api hospedada na aws, requisitar com o seguinte endereço IP http://18.231.163.119:3000/ ao invés do localhost para os [endpoints abaixo](#endpoints)

Para acessar o swagger: http://18.231.163.119:3000/api

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

4. Rode o prisma generate para gerar os tipos do prisma:

```bash
npx prisma generate
```

5. Rode o prisma migrate para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev
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

### Listar analytics do link (GET)

http://localhost:3000/links/analytics/:shortUrl

## Sugestões de Melhorias

1. **Implementar testes automatizados**: Adicionar mais cobertura de testes unitários e de integração para garantir que todas as funcionalidades da aplicação estejam funcionando corretamente e para facilitar a manutenção do código.

2. **Documentação mais detalhada**: Expandir a documentação da API, incluindo exemplos de requisições e respostas, explicações sobre os parâmetros e possíveis códigos de erro.

3. **Escalabilidade**: Planejar e implementar estratégias para escalar a aplicação conforme o aumento da demanda, garantindo que ela continue funcionando de maneira eficiente.

4. **Feedback dos usuários**: Coletar e analisar feedbacks dos usuários para identificar pontos de melhoria e novas funcionalidades que possam ser implementadas.

## Maiores Desafios

1. **Segurança**: Garantir que a aplicação esteja protegida contra vulnerabilidades comuns, como injeção de SQL, XSS e CSRF. Implementar práticas de segurança robustas para proteger os dados dos usuários e a integridade do sistema.

2. **Manutenção do Código**: Manter o código limpo, bem documentado e modular para facilitar a manutenção e a adição de novas funcionalidades. Utilizar boas práticas de desenvolvimento, como revisão de código e testes automatizados.

3. **Desempenho**: Otimizar a aplicação para garantir tempos de resposta rápidos e um desempenho eficiente, mesmo com um grande número de usuários e requisições simultâneas. Monitorar e ajustar o desempenho conforme necessário.

4. **Escalabilidade**: Planejar e implementar uma arquitetura que permita a escalabilidade horizontal e vertical da aplicação, garantindo que ela possa crescer conforme a demanda aumenta sem comprometer a performance.

5. **Experiência do Usuário**: Garantir que a interface do usuário seja intuitiva, responsiva e acessível. Coletar feedback dos usuários para identificar áreas de melhoria e implementar mudanças que melhorem a experiência geral.

6. **Gerenciamento de Dependências**: Manter as dependências da aplicação atualizadas e seguras, evitando conflitos e vulnerabilidades. Utilizar ferramentas de gerenciamento de dependências para facilitar esse processo.

7. **Conformidade e Regulamentação**: Garantir que a aplicação esteja em conformidade com as regulamentações e leis aplicáveis, como GDPR, LGPD e outras normas de proteção de dados.

8. **Gerenciamento de Banco de Dados**: Manter a integridade e a performance do banco de dados, realizando backups regulares, otimizações e garantindo a consistência dos dados.
