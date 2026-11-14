# AvisaETEC

Sistema web de avisos e notificações em tempo real para a ETEC, desenvolvido como Trabalho de Conclusão de Curso (TCC).
Funcionários autorizados enviam avisos para turmas ou alunos; os alunos acompanham tudo em um mural com calendário acadêmico.

## Tecnologias

- **Front-end:** React 19, Vite, Tailwind CSS, lucide-react
- **Back-end:** Node.js, Express, Socket.IO, JWT, bcryptjs
- **Dados (atual):** arquivos JSON em `server/data` (o banco MySQL/PostgreSQL está modelado em `docs/03-banco-de-dados`)

## Estrutura do projeto

```text
AvisaETEC/
├── client/                  # Front-end (React + Vite)
│   ├── index.html
│   ├── vite.config.js       # proxy de /api e /socket.io para o servidor
│   └── src/
│       ├── components/      # calendar, common, layout, notices, profile
│       ├── data/            # dados estáticos e de demonstração
│       ├── hooks/           # hooks reutilizáveis (useToast)
│       ├── pages/           # LoginPage, MuralPage
│       ├── styles/          # main.css (Tailwind + estilos) e overrides.css
│       ├── utils/           # funções auxiliares
│       ├── App.jsx
│       └── main.jsx
├── server/                  # Back-end (Express + Socket.IO)
│   ├── data/                # users.json e notices.json
│   └── src/
│       ├── config/          # leitura das variáveis de ambiente
│       ├── lib/             # acesso aos dados (store)
│       ├── middleware/      # autenticação e tratamento de erros
│       ├── routes/          # auth e notices
│       ├── app.js           # configuração do Express
│       ├── socket.js        # Socket.IO (exige token JWT)
│       └── index.js         # inicialização do servidor
├── docs/                    # documentação do TCC
├── .env.example
└── package.json             # workspaces: client + server
```

## Como executar

Requisitos: Node.js 18 ou superior.

```bash
npm install                   # instala client e server de uma vez (na raiz)
cp .env.example .env          # no Windows: copy .env.example .env
npm run dev                   # sobe front (http://localhost:5173) e API (http://localhost:3001)
```

Outros comandos:

| Comando | O que faz |
| --- | --- |
| `npm run dev:client` | Só o front-end |
| `npm run dev:server` | Só a API |
| `npm run build` | Gera o build do front-end em `client/dist` |
| `npm start` | Sobe a API sem modo de observação |
| `npm run format` | Formata o código com Prettier |

## Contas de demonstração

A senha de ambas é `demo123`.

| Perfil | E-mail | Pode emitir avisos |
| --- | --- | --- |
| Aluno | `beatriz.almeida@demo.avisaetec.local` | Não |
| Professor | `rafael.martins@demo.avisaetec.local` | Sim |

## API

| Método | Rota | Acesso |
| --- | --- | --- |
| GET | `/api/health` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/me` | Autenticado |
| GET | `/api/notices` | Autenticado |
| POST | `/api/notices` | Permissão `notifications:emit` |

Tempo real: o evento `notice.created` é enviado pelo Socket.IO. Conecte com `io({ auth: { token } })`.

## Estado atual e próximos passos

- O front-end ainda usa dados de demonstração: login e avisos **não** chamam a API.
  Próximo passo: ligar `LoginPage`/`App` aos endpoints e ao Socket.IO.
- Migrar os JSON para o banco relacional modelado em `docs/03-banco-de-dados`.
- Adicionar limite de tentativas de login (rate limit) antes de publicar.
