import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // 1. Clean up
    await prisma.mensagem.deleteMany();
    await prisma.notificacao.deleteMany();
    await prisma.exercicioLog.deleteMany();
    await prisma.treinoLog.deleteMany();
    await prisma.atribuicaoTreino.deleteMany();
    await prisma.exercicioTreino.deleteMany();
    await prisma.treino.deleteMany();
    await prisma.exercicio.deleteMany();
    await prisma.fotoAvaliacao.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.alunoProfile.deleteMany();
    await prisma.pagamento.deleteMany();
    await prisma.assinatura.deleteMany();
    await prisma.plano.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Banco de dados limpo.');

    const password = await hash('123456', 12);

    // 2. Admin
    const admin = await prisma.user.create({
        data: {
            email: 'admin@gabrielalves.com',
            name: 'Renato Silva',
            password: await hash('Senha123@', 12),
            role: 'ADMIN',
            avatar: 'https://ui-avatars.com/api/?name=Renato+Silva&background=10b981&color=fff'
        }
    });

    console.log('👮 Renato Silva (Admin) criado.');

    console.log('👮 Renato Silva (Admin) criado.');

    // 3. Exercícios
    const exerciciosData = [
        { nome: 'Supino Reto com Barra', grupo: ['Peito', 'Tríceps'], video: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
        { nome: 'Supino Inclinado com Halteres', grupo: ['Peito', 'Ombros'], video: 'https://www.youtube.com/watch?v=0G2_ii72e_0' },
        { nome: 'Crucifixo na Máquina', grupo: ['Peito'], video: '' },
        { nome: 'Puxada Alta Aberta', grupo: ['Costas'], video: '' },
        { nome: 'Remada Curvada', grupo: ['Costas', 'Bíceps'], video: '' },
        { nome: 'Levantamento Terra', grupo: ['Costas', 'Posterior', 'Glúteos'], video: '' },
        { nome: 'Desenvolvimento Militar', grupo: ['Ombros'], video: '' },
        { nome: 'Elevação Lateral', grupo: ['Ombros'], video: '' },
        { nome: 'Agachamento Livre', grupo: ['Quadríceps', 'Glúteos'], video: '' },
        { nome: 'Leg Press 45', grupo: ['Quadríceps'], video: '' },
        { nome: 'Cadeira Extensora', grupo: ['Quadríceps'], video: '' },
        { nome: 'Mesa Flexora', grupo: ['Posterior'], video: '' },
        { nome: 'Rosca Direta', grupo: ['Bíceps'], video: '' },
        { nome: 'Tríceps Corda', grupo: ['Tríceps'], video: '' },
        { nome: 'Abdominal Supra', grupo: ['Abdômen'], video: '' },
    ];

    const exercicios = [];
    for (const ex of exerciciosData) {
        const criado = await prisma.exercicio.create({
            data: {
                nome: ex.nome,
                grupoMuscular: JSON.stringify(ex.grupo),
                videoUrl: ex.video,
                equipamento: JSON.stringify([]),
            }
        });
        exercicios.push(criado);
    }
    console.log(`🏋️ ${exercicios.length} exercícios criados.`);

    // 4. Programas de Treino
    // Treino A - Peito e Tríceps
    const treinoA = await prisma.treino.create({
        data: {
            nome: 'Hipertrofia A - Peito e Tríceps',
            descricao: 'Foco em volume moderado e carga progressiva.',
            tipo: 'A',
            treinadorId: admin.id,
            exercicios: {
                create: [
                    { exercicioId: exercicios[0].id, ordem: 0, series: 4, repeticoes: '8-10', descanso: 90 }, // Supino
                    { exercicioId: exercicios[1].id, ordem: 1, series: 3, repeticoes: '10-12', descanso: 60 }, // Inclinado
                    { exercicioId: exercicios[2].id, ordem: 2, series: 3, repeticoes: '12-15', descanso: 45 }, // Crucifixo
                    { exercicioId: exercicios[13].id, ordem: 3, series: 4, repeticoes: '12', descanso: 60 }, // Tríceps
                ]
            }
        }
    });

    // Treino B - Costas e Bíceps
    const treinoB = await prisma.treino.create({
        data: {
            nome: 'Hipertrofia B - Costas e Bíceps',
            descricao: 'Foco em largura e densidade dorsal.',
            tipo: 'B',
            treinadorId: admin.id,
            exercicios: {
                create: [
                    { exercicioId: exercicios[3].id, ordem: 0, series: 4, repeticoes: '10', descanso: 90 }, // Puxada
                    { exercicioId: exercicios[4].id, ordem: 1, series: 4, repeticoes: '8-10', descanso: 90 }, // Remada
                    { exercicioId: exercicios[5].id, ordem: 2, series: 3, repeticoes: '6-8', descanso: 120 }, // Terra
                    { exercicioId: exercicios[12].id, ordem: 3, series: 3, repeticoes: '12', descanso: 60 }, // Rosca
                ]
            }
        }
    });

    // Treino C - Pernas Completo
    const treinoC = await prisma.treino.create({
        data: {
            nome: 'Hipertrofia C - Pernas',
            descricao: 'Treino intenso de membros inferiores.',
            tipo: 'C',
            treinadorId: admin.id,
            exercicios: {
                create: [
                    { exercicioId: exercicios[8].id, ordem: 0, series: 4, repeticoes: '6-8', descanso: 120 }, // Agachamento
                    { exercicioId: exercicios[9].id, ordem: 1, series: 4, repeticoes: '10-12', descanso: 90 }, // Leg Press
                    { exercicioId: exercicios[10].id, ordem: 2, series: 3, repeticoes: '15', descanso: 45 }, // Extensora
                    { exercicioId: exercicios[11].id, ordem: 3, series: 3, repeticoes: '12-15', descanso: 45 }, // Flexora
                ]
            }
        }
    });

    console.log('📝 3 Programas de treino criados.');

    // 5. Planos
    const planoBasic = await prisma.plano.create({
        data: {
            nome: 'Basic',
            descricao: 'Acesso essencial aos treinos e suporte básico.',
            preco: 359.00,
            intervalo: 'mensal',
            recursos: JSON.stringify(['Acesso ao App', 'Treino Semanal', 'Suporte via Chat']),
            ativo: true,
            destaque: false
        }
    });

    const planoUltra = await prisma.plano.create({
        data: {
            nome: 'Ultra',
            descricao: 'Treinamento completo com acompanhamento premium.',
            preco: 432.00,
            intervalo: 'mensal',
            recursos: JSON.stringify(['Acesso ao App', 'Treino Diário', 'Suporte Individualizado', 'Planilha de Nutrição']),
            ativo: true,
            destaque: true,
            textoDestaque: 'MAIS VENDIDO'
        }
    });

    console.log('💎 Planos Basic e Ultra criados.');

    // 6. Alunos
    const alunosData = [
        { nome: 'Carlos Silva', email: 'carlos@gabrielalves.com', status: 'ATIVA', planoId: planoBasic.id },
        { nome: 'Ana Pereira', email: 'ana@gabrielalves.com', status: 'ATIVA', planoId: planoUltra.id },
        { nome: 'Lucas Santos', email: 'usuario@gabrielalves.com', status: 'ATIVA', planoId: planoBasic.id },
        { nome: 'Roberto Costa', email: 'roberto@gabrielalves.com', status: 'ATIVA', planoId: planoUltra.id },
        { nome: 'Julia Santos', email: 'julia@gabrielalves.com', status: 'ATIVA', planoId: planoUltra.id },
        { nome: 'Mariana Lima', email: 'mariana@gabrielalves.com', status: 'ATIVA', planoId: planoBasic.id }
    ];

    for (const a of alunosData) {
        await prisma.user.create({
            data: {
                name: a.nome,
                email: a.email,
                password: password,
                role: 'ALUNO',
                avatar: `https://ui-avatars.com/api/?name=${a.nome.replace(' ', '+')}&background=random`,
                alunoProfile: {
                    create: {
                        dataNascimento: new Date('1995-05-15'),
                        genero: 'Masculino',
                        altura: 1.75,
                        pesoInicial: 80,
                        nivelAtividade: 'Intermediário',
                        objetivos: JSON.stringify(['Hipertrofia'])
                    }
                },
                assinaturas: {
                    create: {
                        status: a.status as any,
                        planoId: a.planoId,
                        dataInicio: new Date(),
                        dataFim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                        treinadorId: admin.id
                    }
                }
            }
        });
        console.log(`👤 Aluno ${a.nome} criado.`);
    }

}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
