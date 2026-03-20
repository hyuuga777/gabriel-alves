import { Usuario, Treino, AssinaturaStatus, PontoEvolucao, LogExecucao } from '@/types';

export const MOCK_ALUNO: Usuario = {
    id: 'aluno-12345',
    nome: 'Carlos Silva',
    email: 'carlos.silva@email.com',
    role: 'ALUNO',
    avatarUrl: 'https://i.pravatar.cc/150?u=carlos.silva@email.com'
};

export const MOCK_ASSINATURA: AssinaturaStatus = {
    plano: 'Trimestral',
    status: 'ATIVA',
    // Calcula aproximadamente 15 dias a partir de hoje
    proximaCobranca: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
};

export const MOCK_EVOLUCAO: PontoEvolucao[] = [
    {
        data: '2023-12-03T10:00:00.000Z',
        peso: 80.0,
        gorduraPercentual: 18.5,
        massaMagra: 65.2,
        fotoFrenteUrl: 'https://placehold.co/400x600/e2e8f0/64748b?text=Foto+Inicial'
    },
    {
        data: '2024-01-03T10:00:00.000Z',
        peso: 78.5,
        gorduraPercentual: 17.2,
        massaMagra: 65.0,
        fotoFrenteUrl: 'https://placehold.co/400x600/e2e8f0/64748b?text=Mes+1'
    },
    {
        data: '2024-02-03T10:00:00.000Z',
        peso: 77.0,
        gorduraPercentual: 15.8,
        massaMagra: 64.9,
        fotoFrenteUrl: 'https://placehold.co/400x600/e2e8f0/64748b?text=Mes+2'
    }
];

export const MOCK_TREINOS: Treino[] = [
    {
        id: 'treino-a',
        titulo: 'Treino A - Empurrar',
        descricao: 'Foco em peitoral, ombros e tríceps. Pouse de 90s a 120s nos compostos pesados.',
        concluido: false,
        itens: [
            {
                id: 'item-1',
                exercicio: {
                    id: 'ex-supino',
                    nome: 'Supino Reto com Barra',
                    grupoMuscular: 'Peito'
                },
                series: 4,
                repeticoes: '8-10',
                cargaAlvo: '60kg',
                rpeAlvo: 8,
                intervaloSegundos: 120,
                observacoes: 'Contrair bem as escápulas, focar na fase excêntrica controlada (3s).'
            },
            {
                id: 'item-2',
                exercicio: {
                    id: 'ex-desenvolvimento',
                    nome: 'Desenvolvimento com Halteres',
                    grupoMuscular: 'Ombros'
                },
                series: 3,
                repeticoes: '10-12',
                cargaAlvo: '16kg',
                rpeAlvo: 8,
                intervaloSegundos: 90,
                observacoes: 'Descer o halter até a linha da orelha e não travar o cotovelo totalmente em cima.'
            },
            {
                id: 'item-3',
                exercicio: {
                    id: 'ex-triceps',
                    nome: 'Tríceps na Polia com Corda',
                    grupoMuscular: 'Tríceps'
                },
                series: 3,
                repeticoes: '12-15',
                cargaAlvo: '25kg',
                rpeAlvo: 9,
                intervaloSegundos: 60,
                observacoes: 'Mantenha os cotovelos travados na lateral do corpo e abra a corda no final do movimento.'
            }
        ]
    },
    {
        id: 'treino-b',
        titulo: 'Treino B - Puxar',
        descricao: 'Foco em costas e bíceps. Pense em puxar com os cotovelos.',
        concluido: false,
        itens: [
            {
                id: 'item-4',
                exercicio: {
                    id: 'ex-puxada',
                    nome: 'Puxada Alta pela Frente',
                    grupoMuscular: 'Costas'
                },
                series: 4,
                repeticoes: '10-12',
                cargaAlvo: '45kg',
                rpeAlvo: 8,
                intervaloSegundos: 90,
                observacoes: 'Inicie o movimento deprimindo as escápulas antes de flexionar os cotovelos.'
            },
            {
                id: 'item-5',
                exercicio: {
                    id: 'ex-remada',
                    nome: 'Remada Curvada com Barra',
                    grupoMuscular: 'Costas'
                },
                series: 3,
                repeticoes: '8-10',
                cargaAlvo: '50kg',
                rpeAlvo: 8,
                intervaloSegundos: 120,
                observacoes: 'Mantenha o core rígido e a lombar preservada o tempo todo.'
            },
            {
                id: 'item-6',
                exercicio: {
                    id: 'ex-rosca',
                    nome: 'Rosca Direta com Halteres',
                    grupoMuscular: 'Bíceps'
                },
                series: 3,
                repeticoes: '10-12',
                cargaAlvo: '12kg',
                rpeAlvo: 9,
                intervaloSegundos: 60,
                observacoes: 'Pode realizar de forma alternada ou simultânea. Sem usar o ombro como alavanca.'
            }
        ]
    }
];

export const MOCK_LOGS: LogExecucao[] = [
    {
        id: 'log-1',
        itemTreinoId: 'item-1', // Supino Reto com Barra
        data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
        cargaUtilizada: 60,
        rpe: 8,
        feedback: 'Consegui fazer as 10 repetições mas a sltima saiu no limite.'
    },
    {
        id: 'log-2',
        itemTreinoId: 'item-2', // Desenvolvimento com Halteres
        data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
        cargaUtilizada: 16,
        rpe: 9,
        feedback: 'Senti muito pump no ombro!'
    },
    {
        id: 'log-3',
        itemTreinoId: 'item-3', // Tríceps na Polia
        data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
        cargaUtilizada: 25,
        rpe: 10,
        feedback: 'Só consegui 12 reps, na próxima tento manter a carga.'
    }
];

export const MOCK_EXERCICIOS = [
    { id: 'ex-1', nome: 'Supino Reto com Barra', grupoMuscular: 'Peito', videoUrl: 'https://youtube.com/watch?v=1' },
    { id: 'ex-2', nome: 'Agachamento Livre', grupoMuscular: 'Pernas', videoUrl: 'https://youtube.com/watch?v=2' },
    { id: 'ex-3', nome: 'Puxada Alta', grupoMuscular: 'Costas', videoUrl: 'https://youtube.com/watch?v=3' },
    { id: 'ex-4', nome: 'Desenvolvimento Halteres', grupoMuscular: 'Ombros', videoUrl: 'https://youtube.com/watch?v=4' },
    { id: 'ex-5', nome: 'Rosca Direta', grupoMuscular: 'Bíceps', videoUrl: 'https://youtube.com/watch?v=5' },
    { id: 'ex-6', nome: 'Tríceps Corda', grupoMuscular: 'Tríceps', videoUrl: 'https://youtube.com/watch?v=6' },
    { id: 'ex-7', nome: 'Leg Press 45', grupoMuscular: 'Pernas', videoUrl: 'https://youtube.com/watch?v=7' },
    { id: 'ex-8', nome: 'Remada Curvada', grupoMuscular: 'Costas', videoUrl: 'https://youtube.com/watch?v=8' },
    { id: 'ex-9', nome: 'Crucifixo Reto', grupoMuscular: 'Peito', videoUrl: 'https://youtube.com/watch?v=9' },
    { id: 'ex-10', nome: 'Prancha Abdominal', grupoMuscular: 'Abdômen', videoUrl: 'https://youtube.com/watch?v=10' },
];
