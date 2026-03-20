'use client';

import { ArrowLeft, Dumbbell, Users, Calendar, Edit2, Trash2, Plus, Clock, MoreVertical } from 'lucide-react';
import Link from 'next/link';

// Mock data — no futuro virá de uma API / Prisma
const MOCK_TREINO = {
    id: '1',
    titulo: 'Treino A - Peito e Tríceps',
    aluno: {
        id: 'aluno-1',
        nome: 'Carlos Silva',
        avatar: 'CS',
    },
    criadoEm: '10 Mar 2026',
    atualizadoEm: '10 Mar 2026',
    observacoes: 'Foco em hipertrofia. Manter tempo de intervalo de 60-90 segundos entre as séries. Progredir 2kg na carga a cada 2 semanas.',
    exercicios: [
        { id: '1', nome: 'Supino Reto (Barra)', grupoMuscular: 'Peito', series: 4, repeticoes: '8-10', cargaSugerida: '60kg', intervalo: 90 },
        { id: '2', nome: 'Supino Inclinado Halteres', grupoMuscular: 'Peito', series: 3, repeticoes: '10-12', cargaSugerida: '22kg', intervalo: 60 },
        { id: '3', nome: 'Crossover', grupoMuscular: 'Peito', series: 3, repeticoes: '12-15', cargaSugerida: '20kg', intervalo: 60 },
        { id: '4', nome: 'Tríceps Corda', grupoMuscular: 'Tríceps', series: 4, repeticoes: '10-12', cargaSugerida: '25kg', intervalo: 60 },
        { id: '5', nome: 'Tríceps Francês', grupoMuscular: 'Tríceps', series: 3, repeticoes: '10-12', cargaSugerida: '15kg', intervalo: 60 },
        { id: '6', nome: 'Elevação Lateral', grupoMuscular: 'Ombros', series: 3, repeticoes: '12-15', cargaSugerida: '10kg', intervalo: 45 },
    ],
};

// Cores por grupo muscular
const MUSCLE_COLORS: Record<string, string> = {
    'Peito': 'text-blue-400 bg-blue-400/10',
    'Tríceps': 'text-orange-400 bg-orange-400/10',
    'Ombros': 'text-teal-400 bg-teal-400/10',
    'Costas': 'text-green-400 bg-green-400/10',
    'Bíceps': 'text-yellow-400 bg-yellow-400/10',
    'Pernas': 'text-red-400 bg-red-400/10',
    'Core': 'text-pink-400 bg-pink-400/10',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TreinoDetailPage({ params }: any) {
    const treino = MOCK_TREINO; // futuramente: buscar por params.id
    void params;

    const totalSeries = treino.exercicios.reduce((acc, ex) => acc + ex.series, 0);
    const totalExercicios = treino.exercicios.length;
    const gruposMusculares = [...new Set(treino.exercicios.map(e => e.grupoMuscular))];

    return (
        <div className=max-w-4xl mx-auto space-y-8 pb-16>

            {/* Header */}
            <div className=flex items-start justify-between gap-4 flex-wrap>
                <div>
                    <Link
                        href=/admin/treinos
                        className=inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-4
                    >
                        <ArrowLeft className=w-4 h-4 />
                        Voltar para Treinos
                    </Link>
                    <h1 className=text-2xl font-bold text-white tracking-tight>{treino.titulo}</h1>
                </div>
                <div className=flex items-center gap-3>
                    <Link
                        href={`/admin/treinos/novo?edit=${treino.id}`}
                        className=inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all
                    >
                        <Edit2 className=w-4 h-4 />
                        Editar
                    </Link>
                    <button className=inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-all>
                        <Plus className=w-4 h-4 />
                        Adicionar Exercício
                    </button>
                </div>
            </div>

            {/* Info Cards */}
            <div className=grid grid-cols-2 sm:grid-cols-4 gap-4>
                <div className=p-4 bg-[#111] border border-white/5 rounded-2xl>
                    <p className=text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1>Aluno</p>
                    <div className=flex items-center gap-2 mt-2>
                        <div className=w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary>
                            {treino.aluno.avatar}
                        </div>
                        <span className=text-white text-sm font-semibold truncate>{treino.aluno.nome}</span>
                    </div>
                </div>
                <div className=p-4 bg-[#111] border border-white/5 rounded-2xl>
                    <p className=text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1>Exercícios</p>
                    <div className=flex items-center gap-2 mt-2>
                        <Dumbbell className=w-4 h-4 text-primary />
                        <span className=text-white text-xl font-bold>{totalExercicios}</span>
                    </div>
                </div>
                <div className=p-4 bg-[#111] border border-white/5 rounded-2xl>
                    <p className=text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1>Total Séries</p>
                    <div className=flex items-center gap-2 mt-2>
                        <Users className=w-4 h-4 text-blue-400 />
                        <span className=text-white text-xl font-bold>{totalSeries}</span>
                    </div>
                </div>
                <div className=p-4 bg-[#111] border border-white/5 rounded-2xl>
                    <p className=text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1>Criado em</p>
                    <div className=flex items-center gap-2 mt-2>
                        <Calendar className=w-4 h-4 text-gray-400 />
                        <span className=text-white text-sm font-semibold>{treino.criadoEm}</span>
                    </div>
                </div>
            </div>

            {/* Grupos musculares badges */}
            <div className=flex flex-wrap gap-2>
                {gruposMusculares.map(grupo => {
                    const colorClass = MUSCLE_COLORS[grupo] ?? 'text-gray-400 bg-gray-400/10';
                    return (
                        <span key={grupo} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
                            {grupo}
                        </span>
                    );
                })}
            </div>

            {/* Observações */}
            {treino.observacoes && (
                <div className=p-5 bg-[#111] border border-white/5 rounded-2xl>
                    <p className=text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2>Observações do Treino</p>
                    <p className=text-gray-300 text-sm leading-relaxed>{treino.observacoes}</p>
                </div>
            )}

            {/* Lista de Exercícios */}
            <div className=space-y-4>
                <div className=flex items-center justify-between px-1>
                    <h2 className=text-lg font-bold text-white>Exercícios</h2>
                    <span className=text-xs text-gray-500>{totalExercicios} exercícios · {totalSeries} séries no total</span>
                </div>

                {treino.exercicios.map((ex, idx) => {
                    const colorClass = MUSCLE_COLORS[ex.grupoMuscular] ?? 'text-gray-400 bg-gray-400/10';
                    return (
                        <div
                            key={ex.id}
                            className=flex items-center gap-4 p-5 bg-[#111] border border-white/5 rounded-2xl hover:border-white/10 transition-all group
                        >
                            {/* Nsmero */}
                            <div className=w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0>
                                {idx + 1}
                            </div>

                            {/* Info Principal */}
                            <div className=flex-1 min-w-0>
                                <div className=flex items-center gap-2 mb-1>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
                                        {ex.grupoMuscular}
                                    </span>
                                </div>
                                <p className=text-white font-semibold truncate>{ex.nome}</p>
                            </div>

                            {/* Métricas */}
                            <div className=hidden sm:flex items-center gap-6 text-center shrink-0>
                                <div>
                                    <p className=text-[10px] font-bold uppercase text-gray-600 mb-0.5>Séries</p>
                                    <p className=text-white font-bold>{ex.series}</p>
                                </div>
                                <div>
                                    <p className=text-[10px] font-bold uppercase text-gray-600 mb-0.5>Reps</p>
                                    <p className=text-white font-bold>{ex.repeticoes}</p>
                                </div>
                                <div>
                                    <p className=text-[10px] font-bold uppercase text-gray-600 mb-0.5>Carga</p>
                                    <p className=text-white font-bold>{ex.cargaSugerida || '—'}</p>
                                </div>
                                <div className=flex items-center gap-1 text-gray-500>
                                    <Clock className=w-3.5 h-3.5 />
                                    <span className=text-sm font-medium>{ex.intervalo}s</span>
                                </div>
                            </div>

                            {/* Ações */}
                            <button className=opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg>
                                <Trash2 className=w-4 h-4 />
                            </button>
                            <button className=opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-600 hover:text-white hover:bg-white/10 rounded-lg>
                                <MoreVertical className=w-4 h-4 />
                            </button>
                        </div>
                    );
                })}

                {/* Botão adicionar no final */}
                <button
                    className=w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/5 hover:border-white/15 rounded-2xl text-gray-500 hover:text-gray-300 transition-all hover:bg-white/2
                >
                    <Plus className=w-5 h-5 />
                    <span className=text-sm font-medium>Adicionar Exercício</span>
                </button>
            </div>

            {/* Danger zone */}
            <div className=p-5 border border-red-500/20 rounded-2xl bg-red-500/5>
                <p className=text-sm font-bold text-red-400 mb-1>Zona de Perigo</p>
                <p className=text-xs text-gray-500 mb-4>Esta ação é irreversível.</p>
                <button className=inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 rounded-xl transition-all>
                    <Trash2 className=w-4 h-4 />
                    Excluir Treino
                </button>
            </div>
        </div>
    );
}
