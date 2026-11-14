# Modelo Lógico do Banco de Dados - AvisaETEC (MySQL)

## Tabela `usuarios`
- `id` BIGINT UNSIGNED, PK, AUTO_INCREMENT
- `nome` VARCHAR(120), NOT NULL
- `email` VARCHAR(190), UNIQUE, NOT NULL
- `senha_hash` VARCHAR(255), NOT NULL
- `perfil` ENUM('administrador', 'coordenador', 'professor', 'aluno'), NOT NULL
- `turma_id` BIGINT UNSIGNED, NULL, FK para `turmas.id`
- `criado_em` TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP

## Tabela `turmas`
- `id` BIGINT UNSIGNED, PK, AUTO_INCREMENT
- `nome` VARCHAR(120), UNIQUE, NOT NULL

## Tabela `avisos`
- `id` BIGINT UNSIGNED, PK, AUTO_INCREMENT
- `autor_id` BIGINT UNSIGNED, NOT NULL, FK para `usuarios.id`
- `titulo` VARCHAR(120), NOT NULL
- `mensagem` TEXT, NOT NULL
- `publicado_em` TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP
- `atualizado_em` TIMESTAMP, NULL

## Tabela `avisos_destinatarios`
- `aviso_id` BIGINT UNSIGNED, PK composta, FK para `avisos.id`
- `usuario_id` BIGINT UNSIGNED, PK composta, NULL, FK para `usuarios.id`
- `turma_id` BIGINT UNSIGNED, PK composta, NULL, FK para `turmas.id`
- Regra: exatamente um entre `usuario_id` e `turma_id` deve ser preenchido.

## Tabela `avisos_leituras`
- `aviso_id` BIGINT UNSIGNED, PK composta, FK para `avisos.id`
- `usuario_id` BIGINT UNSIGNED, PK composta, FK para `usuarios.id`
- `lido_em` TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP

Os campos `usuario_id` e `turma_id` em `avisos_destinatarios` são referências relacionais, não estruturas JSON. Índices devem ser criados para `avisos.autor_id`, `avisos.publicado_em` e os campos de destino.
