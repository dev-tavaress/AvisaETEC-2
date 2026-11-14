# AvisaETEC

Sistema web de avisos e notificações em tempo real para a ETEC, desenvolvido como Trabalho de Conclusão de Curso (TCC).
Funcionários autorizados enviam avisos para turmas ou alunos; os alunos acompanham tudo em um mural com calendário acadêmico.

## Tecnologias

- **Front-end:** React 19, Vite, Tailwind CSS, lucide-react
- **Back-end:** Node.js, Express, Socket.IO, JWT, bcryptjs, helmet, express-rate-limit
- **Banco de dados:** não relacional, em documentos JSON (coleções `users.json` e `notices.json` em `server/data`), acessado só por `server/src/lib/store.js`. Os arquivos de exemplo ficam em `server/data/seed` (versionados); na primeira execução o servidor cria `server/data/*.json` a partir deles, e esses dados vivos não entram no Git

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
│       ├── styles/          # main.css (Tailwind + estilos; escala de cantos no :root)
│       ├── utils/           # funções auxiliares
│       ├── App.jsx
│       └── main.jsx
├── server/                  # Back-end (Express + Socket.IO)
│   ├── data/seed/           # users.json e notices.json de exemplo (os dados vivos ficam ao lado, fora do Git)
│   └── src/
│       ├── config/          # leitura das variáveis de ambiente
│       ├── lib/             # acesso aos dados (store) e limitador de conexões
│       ├── middleware/      # autenticação, rate limit e tratamento de erros
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

## Segurança

| Proteção | Limite |
| --- | --- |
| API em geral | 600 requisições / 15 min por usuário autenticado; 120 / 15 min por IP para anônimos |
| Login (só tentativas que falham contam) | 10 por conta e 50 por IP, a cada 15 min |
| Emissão de avisos | 30 a cada 10 min por usuário |
| Socket.IO | 120 tentativas de conexão por minuto por IP; token JWT obrigatório |
| Demais | cabeçalhos do `helmet`, corpo limitado a 100 KB, timeouts de cabeçalho (15 s) e requisição (30 s) |

Ao exceder, a API responde `429` com o cabeçalho `Retry-After`.
Os limites ficam em `server/src/middleware/rateLimit.js`.

- Atrás de proxy (Nginx, Render etc.), defina `TRUST_PROXY=1` no `.env`; sem isso todos os usuários aparecem com o IP do proxy.
- O limite por conta pode atrasar o acesso de quem teve a conta alvo de tentativas; é o custo de bloquear força bruta.
- O contador fica em memória e zera ao reiniciar o servidor; com mais de uma instância, use um store compartilhado (por exemplo, Redis).
- Rate limit na aplicação **não** barra ataque de volume (DDoS de verdade): isso exige proteção na frente do servidor (Cloudflare, WAF, balanceador do provedor de hospedagem).

## Estado atual e próximos passos

- O front-end ainda usa dados de demonstração: login e avisos **não** chamam a API.
  Próximo passo: ligar `LoginPage`/`App` aos endpoints e ao Socket.IO.
- Reescrever os documentos de `docs/03-banco-de-dados` no formato de coleções JSON (hoje descrevem o modelo relacional original).
- Para publicar: definir `JWT_SECRET` forte, `NODE_ENV=production`, `TRUST_PROXY` e `CLIENT_ORIGIN` corretos.
