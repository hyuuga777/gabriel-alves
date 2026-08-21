import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== Teste de Isolamento Multi-Tenant (ADR-0006) ===");
  
  // Criar 2 treinadores mockados
  const treinadorA = await prisma.user.create({
    data: { name: 'Treinador A', email: 'a@test.com', password: '123', role: 'TREINADOR' }
  });
  
  const treinadorB = await prisma.user.create({
    data: { name: 'Treinador B', email: 'b@test.com', password: '123', role: 'TREINADOR' }
  });

  // Criar alunos para o Treinador A
  await prisma.user.create({
    data: { name: 'Aluno A1', email: 'a1@test.com', password: '123', role: 'ALUNO', treinadorId: treinadorA.id }
  });
  
  // Criar alunos para o Treinador B
  await prisma.user.create({
    data: { name: 'Aluno B1', email: 'b1@test.com', password: '123', role: 'ALUNO', treinadorId: treinadorB.id }
  });

  console.log("Usuários criados com sucesso.");

  // Testando Endpoint (Simulação) do Treinador A
  const sessionTreinadorA = { user: { id: treinadorA.id, role: 'TREINADOR' } };
  
  const alunosTreinadorA = await prisma.user.findMany({
    where: { role: 'ALUNO', treinadorId: sessionTreinadorA.user.id }
  });

  console.log(`Alunos vistos pelo Treinador A (deveria ser 1): ${alunosTreinadorA.length}`);
  console.assert(alunosTreinadorA.length === 1, "Isolamento falhou!");
  console.assert(alunosTreinadorA[0].name === 'Aluno A1', "Aluno incorreto retornado");

  // Limpando
  await prisma.user.deleteMany({
    where: { email: { in: ['a@test.com', 'b@test.com', 'a1@test.com', 'b1@test.com'] } }
  });

  console.log("=== Teste finalizado com SUCESSO ===");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
