# DER - AvisaETEC

Modelo relacional MySQL em DBML:

```dbml
Table usuarios {
  id bigint [pk, increment]
  nome varchar(120) [not null]
  email varchar(190) [unique, not null]
  senha_hash varchar(255) [not null]
  perfil varchar [not null]
  turma_id bigint
  criado_em timestamp [not null]
}

Table turmas {
  id bigint [pk, increment]
  nome varchar(120) [unique, not null]
}

Table avisos {
  id bigint [pk, increment]
  autor_id bigint [not null]
  titulo varchar(120) [not null]
  mensagem text [not null]
  publicado_em timestamp [not null]
  atualizado_em timestamp
}

Table avisos_destinatarios {
  aviso_id bigint [not null]
  usuario_id bigint
  turma_id bigint

  indexes {
    (aviso_id, usuario_id) [pk]
    (aviso_id, turma_id) [pk]
  }
}

Table avisos_leituras {
  aviso_id bigint [not null]
  usuario_id bigint [not null]
  lido_em timestamp [not null]

  indexes {
    (aviso_id, usuario_id) [pk]
  }
}

Ref: usuarios.turma_id > turmas.id
Ref: avisos.autor_id > usuarios.id
Ref: avisos_destinatarios.aviso_id > avisos.id
Ref: avisos_destinatarios.usuario_id > usuarios.id
Ref: avisos_destinatarios.turma_id > turmas.id
Ref: avisos_leituras.aviso_id > avisos.id
Ref: avisos_leituras.usuario_id > usuarios.id
```

O modelo usa tabelas de associação para destinos e leituras, evitando colunas duplicadas e estruturas JSON.
