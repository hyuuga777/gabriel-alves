# Decisões e Resolução de Conflitos (Importação XLSX)

O modo idempotente exige um fluxo bem claro sobre o que fazer quando o "Aluno X" já existe no banco.

## Critério de Matching de Alunos
O sistema buscará duplicidades seguindo a ordem de prioridade:
1. **Nome Exato:** Com normalização (tudo minúsculo e sem acentos para a comparação em memória) para identificar o Aluno. No entanto, o `email` é obrigatório no Prisma Schema.
2. **E-mail Fake / Placeholder:** Como a planilha não possui "E-mail", o importador gerará um alias: `aluno.nome.sanitizado@import.local` (ex: `gabriel.alves@import.local`) temporário, para satisfazer a chave `email @unique` na model User.

## Estratégia de Conflito de Aluno (Idempotência)
- **Cenário A (Aluno Não Existe):** Será criado um `User`, `AlunoProfile`, `Assinatura` e `N Avaliacoes`.
- **Cenário B (Aluno Já Existe):** O status da importação constará como "Atualização". 
  - `AlunoProfile` será reescrito com os dados mais recentes do XLSX.
  - `Avaliacao`: Faremos matching pela **Data**. Se a avaliação do dia `01/01/2024` já existe, os números de medidas serão subscritos ou mantidos? **Decisão:** Serão *ignorados* (skip) se os dados forem idênticos, ou *substituídos* com `updatedAt` novo, priorizando a planilha do Personal como fonte mestre daquele exato dia.
  - `Assinatura`: Se já tivermos uma assinatura, não criamos uma duplicada se a "DataFim" for a mesma.

## Proteção Multi-Tenant
Todas as buscas por duplicidade ou inserções carregam o `treinadorId: session.user.id`. 
Se o "Gabriel Alves" existir na conta do Treinador B, ele *não* será lido como duplicado pelo Treinador A; ele criará um novo perfil independente no silo do Treinador A.
