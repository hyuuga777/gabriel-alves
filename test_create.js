const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'hashedpassword',
        role: 'ALUNO',
        telefone: '123456789',
        alunoProfile: {
            create: {
                dataNascimento: new Date(),
                genero: 'Não informado',
                altura: 0,
                pesoInicial: 0,
                nivelAtividade: 'Iniciante',
                objetivos: [],
            }
        }
      }
    });
    console.log('Success:', user.id);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
