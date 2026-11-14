# Modelo Conceitual do Banco de Dados - AvisaETEC

O AvisaETEC utilizará **MySQL** como banco relacional. Os dados de negócio não serão armazenados em documentos JSON; cada entidade possui uma tabela própria e os relacionamentos são representados por chaves estrangeiras.

## 1. Entidades

- **Usuario:** pessoas autenticadas, com nome, e-mail, hash de senha e perfil.
- **Turma:** módulo/turma da ETEC.
- **Aviso:** título, corpo, autor, data de publicação e data de atualização.
- **AvisoDestinatario:** associação entre um aviso e uma turma ou usuário destinatário.
- **AvisoLeitura:** estado de leitura de cada aviso por usuário.

## 2. Relacionamentos

1. Um usuário pode publicar muitos avisos; cada aviso possui um único autor.
2. Um aviso pode ser direcionado a uma ou mais turmas e/ou usuários por meio de `AvisoDestinatario`.
3. Um usuário pode pertencer a uma turma.
4. Um usuário pode registrar uma leitura para cada aviso recebido.

Essa estrutura elimina colunas de destino duplicadas e listas/objetos JSON, mantendo a integridade referencial e permitindo consultas SQL, auditoria e índices.
