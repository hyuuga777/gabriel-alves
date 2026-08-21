# Política de Identidade e Idempotência (Importador)

## 1. Desacoplamento de Email
**Regra Fundamental:** O aluno não necessita de um e-mail para ter seu histórico registrado. O schema foi refatorado para `email String?`. O login só será gerado se um e-mail verídico for providenciado. Não usamos e-mails falsos como `aluno@import.local`.

## 2. Níveis de Confiança (Idempotência)
Ao analisar o lote `ImportBatch`, a reconciliação julga as identidades baseadas em:

### A) Identidade Forte: Email Idêntico ou Hash de Origem
Se o arquivo XLSX contiver um e-mail igual ao do DB, ou se a string computada pelo `externalSourceId` (Hash SHA256 do Nome + Data Nasc) for encontrada, acusamos `CONFLITO (Duplicata)`.

### B) Identidade Fraca: Colisão de Nome (Múltiplos Nomes)
Se não há e-mail, nem o hash original bate, mas o `nome` completo do aluno já existe no banco (para este personal trainer), a API reporta `CONFLITO (Colisão de Nome)`. O frontend exibirá um modal solicitando intervenção manual do treinador.

### 3. Resolução de Conflitos (Modo Manual)
A rota `confirm` foi reescrita para receber as decisões de `decisoesConflito`:
- `SOBRESCREVER`: Faz upsert e junta o histórico novo ao antigo (substituindo perfis).
- `IGNORAR`: Mantém a ficha local e ignora a planilha importada.
- `CRIAR_NOVO`: Adiciona o aluno, mesmo que tenham o mesmo nome (úteis para homônimos, gerando hashes de origem diferentes).
