# Requisitos Funcionais - AvisaETEC

## 1. Requisitos Funcionais (RF)
- **RF01 - Autenticação e Perfis:** O sistema deve autenticar utilizadores via login e redirecionar permissões de acordo com o cargo (Professor, Coordenador, Diretor ou Aluno).

- **RF02 - Envio de Avisos em Tempo Real:** Funcionários autenticados devem conseguir enviar notificações instantâneas (sobre horários, feriados, manutenções, dias não letivos) utilizando WebSockets. Alunos podem somente visualizar os avisos, não enviar.

- **RF03 - Segmentação de Destinatários:** O remetente deve poder escolher se o aviso será enviado para um único aluno ou para uma turma inteira.

- **RF04 - Mural de Notificações:** A página principal deve exibir um feed/mural com todas as mensagens recebidas de forma organizada.

- **RF05 - Calendário Acadêmico:** A página principal deve integrar um calendário interativo com os dias letivos, feriados e eventos da ETEC.

- **RF06 - Gestão de Avisos pelo Autor:** O administrador pode editar ou excluir mensagens que publicou. O servidor deve validar a autoria ou a permissão administrativa antes de alterar ou remover um aviso.

- **RF07 - Confirmação de Publicação para Professores:** Ao publicar uma notificação, o professor deve visualizar um modal no canto inferior direito contendo o título e o corpo da mensagem publicada.

- **RF08 - Rodapé Institucional:** A página deve exibir um rodapé em letras reduzidas informando que o AvisaETEC é um projeto estudantil para a ETEC, com direitos reservados.