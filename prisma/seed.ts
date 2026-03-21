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

    // 2.1 Usuário Regular
    const user = await prisma.user.create({
        data: {
            email: 'usuario@gabrielalves.com',
            name: 'Lucas Santos',
            password: await hash('Lucas456#', 12),
            role: 'ALUNO',
            avatar: 'https://ui-avatars.com/api/?name=Lucas+Santos&background=3b82f6&color=fff'
        }
    });

    console.log('👤 Lucas Santos (Usuário) criado.');

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
                grupoMuscular: ex.grupo,
                videoUrl: ex.video,
                equipamento: [],
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

    // 5. Alunos
    const alunosData = [
        {
            nome: 'Carlos Silva',
            email: 'carlos@gabrielalves.com',
            status: 'ATIVA',
            plano: 'Plano Trimestral',
            activityPatterns: [0, 1, 2, 4, 6] // Dias atrás que treinou (0 = hoje)
        },
        {
            nome: 'Ana Pereira',
            email: 'ana@gabrielalves.com',
            status: 'ATIVA',
            plano: 'Plano Mensal',
            activityPatterns: [1, 3, 5]
        },
        {
            nome: 'Cliente Especial',
            email: 'cliente@ogabrielalves.app',
            status: 'ATIVA',
            plano: 'Plano Anual',
            activityPatterns: [0, 1, 2],
            password: await hash('1234567', 12)
        },
        {
            nome: 'Roberto Costa',
            email: 'roberto@gabrielalves.com',
            status: 'ATIVA',
            plano: 'Plano Anual',
            activityPatterns: [6]
        },
        {
            nome: 'Julia Santos',
            email: 'julia@gabrielalves.com',
            status: 'ATIVA',
            plano: 'Plano Semestral',
            activityPatterns: [0, 1, 2, 3, 4, 5, 6] // Hardcore
        },
        {
            nome: 'Pedro Oliveira',
            email: 'pedro@gabrielalves.com',
            status: 'EXPIRADA',
            plano: 'Plano Mensal',
            activityPatterns: []
        },
        {
            nome: 'Mariana Lima',
            email: 'mariana@gabrielalves.com',
            status: 'ATIVA',
            plano: 'Plano Trimestral',
            activityPatterns: [0, 2, 4]
        },
        {
            nome: 'Lucas Mendes',
            email: 'lucas@gabrielalves.com',
            status: 'SUSPENSA',
            plano: 'Plano Anual',
            activityPatterns: [5, 6]
        }
    ];

    for (const [index, a] of alunosData.entries()) {
        const treinoSelecionado = index % 3 === 0 ? treinoA : (index % 3 === 1 ? treinoB : treinoC);

        // Gerar logs baseados no padrão de atividade
        const logs = a.activityPatterns.map(daysAgo => ({
            treinoNome: treinoSelecionado.nome,
            treinoId: treinoSelecionado.id,
            completo: true,
            createdAt: new Date(new Date().setDate(new Date().getDate() - daysAgo))
        }));

        const aluno = await prisma.user.create({
            data: {
                name: a.nome,
                email: a.email,
                password: (a as any).password || password,
                role: 'ALUNO',
                avatar: `https://ui-avatars.com/api/?name=${a.nome.replace(' ', '+')}&background=random`,
                alunoProfile: {
                    create: {
                        dataNascimento: new Date('1995-05-15'),
                        genero: Math.random() > 0.5 ? 'Masculino' : 'Feminino',
                        altura: 1.75,
                        pesoInicial: 70 + Math.random() * 20,
                        nivelAtividade: 'Intermediário',
                        objetivos: ['Saúde', 'Hipertrofia']
                    }
                },
                atribuicoes: {
                    create: {
                        treinoId: treinoSelecionado.id,
                        diasSemana: [1, 3, 5]
                    }
                },
                treinoLogs: {
                    create: logs
                },
                assinatura: {
                    create: {
                        status: a.status as any,
                        plano: {
                            create: {
                                nome: a.plano,
                                descricao: 'Acesso total',
                                preco: 100 + Math.random() * 200,
                                intervalo: a.plano.includes('Mensal') ? 'mensal' : (a.plano.includes('Trimestral') ? 'trimestral' : 'anual'),
                                recursos: ['Treinos personalizados']
                            }
                        }
                    }
                }
            }
        });
        console.log(`👤 Aluno ${aluno.name} criado (Status: ${a.status}, Logs: ${logs.length}).`);
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
