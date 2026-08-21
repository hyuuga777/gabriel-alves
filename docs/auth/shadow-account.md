# Arquitetura de Shadow Accounts (Contas Sombra)

## Definição
Shadow Accounts referem-se a registros de `User` com `role = 'ALUNO'` que **não possuem email ou senha**.
Eles existem estritamente como nós de dados gerados pelos Treinadores para rastrear o progresso, pagamentos e fichas, sem que o aluno final tenha ativado o acesso ao aplicativo móvel ou painel.

## Restrições de Autenticação
1. **NextAuth.js:** Adaptado para considerar o `email` como string opcional. 
2. **Login Rejeitado:** Se um login (credentials ou OAuth) for tentado numa Shadow Account, o fluxo falhará prematuramente no nível do Provider (`authorize`), já que não há senhas hash ou emails associados.
3. **Reset de Senha Inativo:** As rotas de `esqueci-senha` não disparam emails nem geram tokens para usuários sem email real confirmado.

## Fluxo de Ativação
1. O treinador insere o e-mail do aluno via Dashboard.
2. O servidor envia um link único (Magic Link) de convite.
3. Ao clicar, o aluno escolhe uma senha. Apenas neste momento o status de Shadow Account cessa, ativando as funcionalidades completas de Autenticação.
