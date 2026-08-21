# Decisões em Aberto

Por favor, responda às perguntas abaixo para podermos definir as fundações da arquitetura e do banco de dados (Fases 2 e 3):

1. **Volume e Escala:** Qual a quantidade média e máxima esperada de alunos ativos e inativos?
2. **Atores:** O sistema será usado por um único profissional (você) ou precisaremos suportar múltiplos profissionais na mesma plataforma (multi-tenant / clínica)?
3. **Acesso do Aluno:** Os alunos terão acesso próprio ao sistema (via login/app) para ver seus treinos e resultados no futuro próximo?
4. **Hospedagem e Custos:** Onde o sistema será hospedado (Vercel, AWS, VPS própria)? Existe um orçamento mensal para banco de dados e hospedagem?
5. **Periodicidade da Importação:** A importação da planilha será um evento único de migração ou precisará ocorrer recorrentemente (sincronização bidirecional)?
6. **Contratos e Planos:** Qual a regra exata dos planos/ciclos? Um aluno pode ter múltiplos contratos simultâneos ou apenas um contrato ativo por vez? A fórmula de dias para o vencimento considera dias úteis ou corridos?
7. **Pagamentos:** O sistema precisa apenas registrar os pagamentos de forma descritiva (ex: "PIX", "Cartão") ou haverá integração real com meios de pagamento (Stripe/Mercado Pago) no futuro?
8. **Anexos e Mídia:** Há necessidade de armazenar arquivos, como fotos de "antes e depois", laudos médicos ou PDFs de avaliações? Se sim, precisaremos de um bucket de storage (ex: AWS S3, Supabase Storage).
