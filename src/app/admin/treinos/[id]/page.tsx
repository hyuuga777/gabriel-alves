'use client';

import { ArrowLeft, Dumbbell, Users, Calendar, Edit2, Trash2, Plus, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

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

export default function TreinoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [treino, setTreino] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchTreino = async () => {
            try {
                const res = await fetch(`/api/admin/workouts/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTreino(data);
                }
            } catch (error) {
                console.error("Error fetching workout:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTreino();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Tem certeza que deseja excluir este treino permanentemente?")) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/workouts/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert("Treino excluído com sucesso!");
                router.push('/admin/treinos');
            } else {
                alert("Falha ao excluir o treino.");
            }
        } catch (error) {
            console.error("Error deleting workout:", error);
            alert("Erro na conexão com o servidor.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-gray-500 text-sm">Carregando detalhes do treino...</p>
            </div>
        );
    }

    if (!treino) {
        return (
            <div className="text-center py-20">
                <Dumbbell className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Treino não encontrado</h2>
                <Link href="/admin/treinos" className="text-primary hover:underline text-sm">
                    Voltar para a lista
                </Link>
            </div>
        );
    }

    const totalSeries = treino.exercicios?.reduce((acc: number, ex: any) => acc + (Number(ex.series) || 0), 0) || 0;
    const totalExercicios = treino.exercicios?.length || 0;
    const gruposMusculares = [...new Set(treino.exercicios?.map((e: any) => e.grupoMuscular) || [])] as string[];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <Link
                        href="/admin/treinos"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Treinos
                    </Link>
                    <h1 className="text-3xl font-black text-white tracking-tight">{treino.titulo}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/admin/treinos/novo?edit=${treino.id}`}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                        Editar
                    </Link>
                    <button 
                        onClick={() => router.push(`/admin/treinos/novo?edit=${treino.id}`)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Exercício
                    </button>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-[#111] border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Aluno</p>
                    <div className="flex items-center gap-2.5 mt-2 min-w-0">
                        <div className="w-7 h-7 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                            {treino.aluno?.avatar || 'AL'}
                        </div>
                        {treino.aluno?.id && treino.aluno.id !== 'default' ? (
                            <Link 
                                href={`/admin/alunos/${treino.aluno.id}`}
                                className="text-white text-sm font-semibold truncate hover:text-primary hover:underline"
                            >
                                {treino.aluno?.nome}
                            </Link>
                        ) : (
                            <span className="text-white text-sm font-semibold truncate">{treino.aluno?.nome}</span>
                        )}
                    </div>
                </div>
                <div className="p-5 bg-[#111] border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Exercícios</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Dumbbell className="w-4 h-4 text-primary" />
                        <span className="text-white text-xl font-bold">{totalExercicios}</span>
                    </div>
                </div>
                <div className="p-5 bg-[#111] border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Total Séries</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-xl font-bold">{totalSeries}</span>
                    </div>
                </div>
                <div className="p-5 bg-[#111] border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Criado em</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm font-semibold">{treino.criadoEm}</span>
                    </div>
                </div>
            </div>

            {/* Grupos musculares badges */}
            {gruposMusculares.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {gruposMusculares.map(grupo => {
                        const colorClass = MUSCLE_COLORS[grupo] ?? 'text-gray-400 bg-gray-400/10';
                        return (
                            <span key={grupo} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
                                {grupo}
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Observações */}
            {treino.descricao && (
                <div className="p-6 bg-[#111] border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Observações / Descrição do Treino</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{treino.descricao}</p>
                </div>
            )}

            {/* Lista de Exercícios */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold text-white">Exercícios</h2>
                    <span className="text-xs text-gray-500">{totalExercicios} exercícios · {totalSeries} séries no total</span>
                </div>

                {treino.exercicios?.map((ex: any, idx: number) => {
                    const colorClass = MUSCLE_COLORS[ex.grupoMuscular] ?? 'text-gray-400 bg-gray-400/10';
                    return (
                        <div
                            key={ex.id}
                            className="flex items-center gap-4 p-5 bg-[#111] border border-white/5 rounded-2xl hover:border-white/10 transition-all group"
                        >
                            {/* Número */}
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                                {idx + 1}
                            </div>

                            {/* Info Principal */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
                                        {ex.grupoMuscular}
                                    </span>
                                </div>
                                <p className="text-white font-semibold truncate">{ex.nome}</p>
                            </div>

                            {/* Métricas */}
                            <div className="flex items-center gap-6 text-center shrink-0">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-gray-600 mb-0.5">Séries</p>
                                    <p className="text-white font-bold">{ex.series}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-gray-600 mb-0.5">Reps</p>
                                    <p className="text-white font-bold">{ex.repeticoes}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-gray-600 mb-0.5">Carga</p>
                                    <p className="text-white font-bold">{ex.cargaSugerida || '—'}</p>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-sm font-medium">{ex.intervalo}s</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {totalExercicios === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-[#111] border border-dashed border-white/5 rounded-2xl">
                        <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-25" />
                        <p className="text-sm">Nenhum exercício adicionado a este treino.</p>
                    </div>
                )}
            </div>

            {/* Danger zone */}
            <div className="p-6 border border-red-500/20 rounded-2xl bg-red-500/5">
                <p className="text-sm font-bold text-red-400 mb-1">Zona de Perigo</p>
                <p className="text-xs text-gray-500 mb-4 font-medium">Esta ação é irreversível e excluirá a ficha de treino permanentemente.</p>
                <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 px-5 py-3 font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl transition-all disabled:opacity-50"
                >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Excluindo...' : 'Excluir Treino'}
                </button>
            </div>
        </div>
    );
}
