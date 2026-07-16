require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando sincronização de dados para produção ---');

  // 1. Ler dados locais
  const localDataPath = path.join(__dirname, '../local-data.json');
  if (!fs.existsSync(localDataPath)) {
    throw new Error('Arquivo local-data.json não encontrado!');
  }
  const localData = JSON.parse(fs.readFileSync(localDataPath, 'utf-8'));
  const users = localData.users || [];

  // 2. Garantir que os planos básicos existam
  console.log('Criando/Atualizando planos...');
  const plansData = [
    { nome: 'Plano Basic', preco: 99.90, intervalo: 'mensal' },
    { nome: 'Plano Pro', preco: 199.90, intervalo: 'mensal' },
    { nome: 'Plano VIP', preco: 499.90, intervalo: 'mensal' },
  ];

  const planMap: { [key: string]: string } = {};
  for (const p of plansData) {
    const slug = p.nome.replace(/\s/g, '-').toLowerCase();
    const upsertedPlan = await prisma.plano.upsert({
      where: { id: slug }, 
      update: {
        preco: p.preco,
        intervalo: p.intervalo,
        nome: p.nome,
        recursos: JSON.stringify(["Treinos", "Suporte", "Evolução"]),
      },
      create: {
        id: slug,
        nome: p.nome,
        preco: p.preco,
        intervalo: p.intervalo,
        recursos: JSON.stringify(["Treinos", "Suporte", "Evolução"]),
      },
    });
    planMap[p.nome] = upsertedPlan.id;
  }

  // 3. Criar Admin se não existir
  console.log('Configurando Admin...');
  const adminEmail = localData.config?.email || "admin@fitness.com";
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: localData.config?.name || "Admin" },
    create: {
      email: adminEmail,
      name: localData.config?.name || "Admin",
      password: hashedPassword,
      role: "ADMIN",
    }
  });

  // 4. Migrar Alunos
  console.log(`Migrando ${users.length} alunos...`);
  for (const u of users) {
    if (u.role !== 'ALUNO') continue;

    console.log(`Migrando: ${u.email}`);
    const userPassword = await bcrypt.hash("mudar123", 10); 
    
    // Inserir Usuário
    const createdUser = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        avatar: u.avatar,
        telefone: u.phone,
      },
      create: {
        email: u.email,
        name: u.name,
        password: userPassword,
        role: "ALUNO",
        avatar: u.avatar,
        telefone: u.phone,
      }
    });

    // Inserir Perfil
    const birthDate = u.birthDate ? new Date(u.birthDate) : new Date();
    await prisma.alunoProfile.upsert({
      where: { userId: createdUser.id },
      update: {
        genero: u.gender || "prefiro não informar",
      },
      create: {
        userId: createdUser.id,
        dataNascimento: isNaN(birthDate.getTime()) ? new Date() : birthDate,
        genero: u.gender || "prefiro não informar",
        altura: 0,
        pesoInicial: 0,
        objetivos: JSON.stringify(["Geral"]),
        nivelAtividade: "Ativo",
      }
    });

    // Inserir Assinatura
    const planName = u.assinatura?.plano?.nome || 'Plano Pro';
    const targetPlanId = planMap[planName] || planMap['Plano Pro'];
    await prisma.assinatura.upsert({
      where: { userId: createdUser.id },
      update: {
        status: (u.assinatura?.status || 'ATIVA'),
        planoId: targetPlanId,
      },
      create: {
        userId: createdUser.id,
        planoId: targetPlanId,
        status: (u.assinatura?.status || 'ATIVA'),
      }
    });
  }

  console.log('--- Sincronização concluída com sucesso! ---');
}

main()
  .catch((e) => {
    console.error('Erro no seed de produção:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
