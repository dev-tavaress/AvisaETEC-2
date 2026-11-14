# Componentes e Interface - AvisaETEC

Mapa dos componentes React do front-end (`client/src`). Atualize este arquivo quando a interface mudar.

## 1. Estrutura de telas

| Tela / Página | Arquivo | Descrição |
| --- | --- | --- |
| Login e cadastro demonstrativo | `pages/LoginPage.jsx` | Entrada com e-mail e senha, acesso rápido por perfis de demonstração |
| Mural de avisos | `pages/MuralPage.jsx` | Feed de avisos, perfil do usuário e calendário acadêmico |

## 2. Componentes

| Grupo | Componente | Função |
| --- | --- | --- |
| `layout` | `Sidebar` | Menu principal e filtros rápidos (contador de não lidos) |
| `layout` | `Topbar` | Menu, tema claro/escuro, perfil e saída |
| `layout` | `BottomNav` | Navegação para telas pequenas (mobile) |
| `notices` | `NoticeCard` | Card de um aviso (marcar como lido, salvar, editar e excluir quando autorizado) |
| `notices` | `EmitNotificationModal` | Formulário de envio de aviso (somente quem tem a permissão `notifications:emit`) |
| `notices` | `EditNoticeModal` | Formulário para editar o título e o corpo de um aviso próprio |
| `notices` | `NoticePublicationToast` | Modal compacto no canto inferior direito com o corpo publicado por um professor |
| `calendar` | `Calendar` | Calendário mensal com dias letivos e eventos |
| `profile` | `UserProfileCard` | Resumo do perfil acadêmico |
| `profile` | `ProfileSettingsModal` | Edição de nome, módulo e foto |
| `common` | `Toast` | Mensagem rápida de confirmação |

## 3. Regras de interface

- Tema claro e escuro (RNF02), alternado na `Topbar`.
- O botão **Emitir notificação** fica desabilitado para quem não tem permissão (RN01).
- Avisos têm categorias: Urgente, Minha turma, Para mim e Acadêmico.
- A página possui rodapé discreto com a identificação estudantil e os direitos reservados.
