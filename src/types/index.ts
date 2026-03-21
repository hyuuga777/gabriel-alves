export type Role = 'ALUNO' | 'TREINADOR' | 'ADMIN';

export interface Usuario {
    id: string;
    nome: string;
    email: string;
    role: Role;
    avatarUrl?: string;
}

export interface Exercicio {
    id: string;
    nome: string;
    grupoMuscular: 'Peito' | 'Costas' | 'Pernas' | 'Ombros' | 'Bíceps' | 'Tríceps' | 'Abdômen';
    videoUrl?: string;
}

export interface ItemTreino {
    id: string;
    exercicio: Exercicio;
    series: number;
    repeticoes: string; // Ex: "10-12" ou "Falha"
    cargaAlvo?: string; // Ex: "20kg"
    rpeAlvo?: number; // 1-10
    intervaloSegundos: number;
    observacoes?: string;
}

export interface Treino {
    id: string;
    titulo: string; // Ex: "Treino A - Peito e Tríceps"
    descricao?: string;
    itens: ItemTreino[];
    concluido: boolean;
}

export interface AssinaturaStatus {
    plano: 'Mensal' | 'Trimestral' | 'Anual';
    status: 'ATIVA' | 'SUSPENSA' | 'CANCELADA' | 'EXPIRADA';
    proximaCobranca: string; // ISO Date
}

// Histórico de execução de um exercício específico
export interface LogExecucao {
    id: string;
    itemTreinoId: string;
    data: string; // ISO Date
    cargaUtilizada: number; // O que o aluno realmente pegou
    rpe: number; // 0-10
    feedback?: string;
}

// Resumo para gráficos de evolução
export interface PontoEvolucao {
    data: string;
    peso: number;
    gorduraPercentual?: number;
    massaMagra?: number;
    fotoFrenteUrl?: string;
}
