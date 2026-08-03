'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Clock, ChevronDown, ChevronUp, Plus, Calendar, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WorkoutsTabProps {
    student?: any;
}

export function WorkoutsTab({ student }: WorkoutsTabProps) {
    const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);
    const [allWorkouts, setAllWorkouts] = useState<any[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState(false);

    const atribuicoes = student?.atribuicoes || [];

    useEffect(() => {
        const fetchAllWorkouts = async () => {
            try {
                const res = await fetch('/api/admin/workouts');
                if (res.ok) {
                    const data = await res.json();
                    setAllWorkouts(data);
                }
            } catch (e) {
                console.error("Error fetching general workouts:", e);
            }
        };
        fetchAllWorkouts();
    }, []);

    const handleToggleExpand = (id: string) => {
        setExpandedRoutineId(expandedRoutineId === id ? null : id);
    };

    const handleAssignWorkout = async () => {
        if (!selectedWorkoutId || !student?.id) return;
        setIsAssigning(true);
        try {
            const res = await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    treinoId: selectedWorkoutId
                })
            });
            if (res.ok) {
                window.location.reload();
            } else {
                alert('Erro ao atribuir treino.');
            }
        } catch (e) {
            console.error(e);
            alert('Erro ao atribuir treino.');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleRemoveWorkout = async () => {
        if (!student?.id) return;
        if (!confirm('Deseja realmente remover o treino deste aluno?')) return;
        setIsAssigning(true);
        try {
            const res = await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    removeWorkout: true
                })
            });
            if (res.ok) {
                window.location.reload();
            } else {
                alert('Erro ao remover treino.');
            }
        } catch (e) {
            console.error(e);
            alert('Erro ao remover treino.');
        } finally {
            setIsAssigning(false);
        }
    };

    if (atribuicoes.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Dumbbell className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Nenhum treino atribuído</h3>
                <p className="text-gray-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                    Este aluno ainda não possui fichas de treinos associadas ao seu perfil.
                </p>
                
                <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
                    <div className="flex gap-3 w-full">
                        <select
                            value={selectedWorkoutId}
                            onChange={(e) => setSelectedWorkoutId(e.target.value)}
                            className="flex-1 bg-[#151515] border border-white/10 rounded-xl h-12 px-4 text-white focus:outline-none focus:border-primary/50 text-sm cursor-pointer"
                        >
                            <option value="">Selecionar treino existente...</option>
                            {allWorkouts.map((w: any) => (
                                <option key={w.id} value={w.id}>{w.titulo}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAssignWorkout}
                            disabled={!selectedWorkoutId || isAssigning}
                            className="bg-primary text-black font-bold px-6 h-12 rounded-xl hover:bg-primary/90 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isAssigning ? 'Atribuindo...' : 'Atribuir'}
                        </button>
                    </div>
                    <div className="text-gray-600 text-[10px] font-black uppercase tracking-wider my-1">OU</div>
                    <Link 
                        href="/admin/treinos/novo"
                        className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all w-full text-sm hover:scale-[1.02]"
                    >
                        <Plus className="w-4 h-4" /> Criar Novo Treino Geral
                    </Link>
                </div>
            </div>
        );
    }

    // Use the first workout as the active program card
    const activeAssignment = atribuicoes[0];
    const activeWorkout = activeAssignment?.treino;
    const startDate = activeAssignment?.createdAt 
        ? new Date(activeAssignment.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'N/A';

    const routines = atribuicoes.map((atrib: any) => {
        const t = atrib.treino;
        // Find last done log
        const lastLog = student.treinoLogs?.find((log: any) => log.treinoId === t.id);
        const lastDone = lastLog 
            ? new Date(lastLog.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
            : 'Nunca';

        return {
            id: t.id,
            title: t.nome,
            description: t.descricao || 'Treino personalizado.',
            exercisesCount: t.exercicios?.length || 0,
            duration: (t.exercicios?.length || 0) * 10 + ' min',
            lastDone,
            exercicios: t.exercicios || []
        };
    });

    return (
        <div className="space-y-8">
            {/* Active Program Card */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 p-8 md:p-10 group"
            >
                {/* Actions (Alterar / Remover) */}
                <div className="absolute top-6 right-6 z-20 flex gap-2">
                    {!isEditMode && (
                        <>
                            <button
                                onClick={() => {
                                    setIsEditMode(true);
                                    setSelectedWorkoutId(activeWorkout?.id || '');
                                }}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all cursor-pointer"
                            >
                                Alterar Treino
                            </button>
                            <button
                                onClick={handleRemoveWorkout}
                                disabled={isAssigning}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 transition-all cursor-pointer"
                            >
                                {isAssigning ? 'Removendo...' : 'Remover Treino'}
                            </button>
                        </>
                    )}
                </div>

                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Dumbbell size={120} className="text-primary" />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                            Programa Ativo
                        </span>
                        <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Atribuído em {startDate}
                        </span>
                    </div>

                    {isEditMode ? (
                        <div className="mb-6 space-y-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alterar treino do aluno</label>
                            <div className="flex gap-3 max-w-md">
                                <select
                                    value={selectedWorkoutId}
                                    onChange={(e) => setSelectedWorkoutId(e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl h-11 px-3 text-white focus:outline-none focus:border-primary/50 text-sm cursor-pointer"
                                >
                                    <option value="">Selecionar novo treino...</option>
                                    {allWorkouts.map((w: any) => (
                                        <option key={w.id} value={w.id}>{w.titulo}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAssignWorkout}
                                    disabled={!selectedWorkoutId || isAssigning}
                                    className="bg-primary text-black font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all text-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {isAssigning ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditMode(false);
                                        setSelectedWorkoutId('');
                                    }}
                                    className="bg-white/5 border border-white/10 text-gray-400 font-bold px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all text-sm cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter leading-none">
                                {activeWorkout?.nome}
                            </h2>
                            
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                {activeWorkout?.descricao || 'Programa de treinamento personalizado montado para o aluno atingir seus objetivos com máximo rendimento.'}
                            </p>
                        </>
                    )}

                    <div className="flex flex-wrap items-center gap-8">
                        <div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Total de Rotinas</p>
                            <div className="flex items-center gap-3">
                                <span className="text-white font-black text-2xl">{routines.length}</span>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">rotina(s) ativa(s)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Routines Grid */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                    Rotinas do Programa
                    <span className="text-primary text-sm font-medium bg-primary/10 px-3 py-0.5 rounded-full border border-primary/20">
                        {routines.length} Ativas
                    </span>
                </h3>

                <div className="grid grid-cols-1 gap-6">
                    {routines.map((routine: any, i: number) => {
                        const isExpanded = expandedRoutineId === routine.id;
                        return (
                            <motion.div
                                key={routine.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleToggleExpand(routine.id)}
                                className="group bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                                
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                                        <Dumbbell className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 font-medium">Clique para {isExpanded ? 'recolher' : 'ver exercícios'}</span>
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                        )}
                                    </div>
                                </div>

                                <h4 className="text-2xl font-black text-white mb-2 leading-tight">
                                    {routine.title}
                                </h4>
                                <p className="text-gray-400 text-sm mb-6 max-w-xl">{routine.description}</p>
                                
                                <div className="flex items-center gap-4 text-gray-500 text-xs mb-6">
                                    <span className="flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-yellow-500" />
                                        {routine.exercisesCount} Exercícios
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                        {routine.duration} Estimada
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-primary" />
                                        Última execução: <strong className="text-white font-medium">{routine.lastDone}</strong>
                                    </span>
                                </div>

                                {/* Exercises List Accordion */}
                                {isExpanded && (
                                    <div 
                                        onClick={(e) => e.stopPropagation()} 
                                        className="mt-6 pt-6 border-t border-white/10 space-y-3 cursor-default"
                                    >
                                        <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">Exercícios na Ficha:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {routine.exercicios.map((item: any, idx: number) => {
                                                const grupo = item.exercicio?.grupoMuscular || 'Geral';
                                                
                                                return (
                                                    <div 
                                                        key={item.id} 
                                                        className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group/ex hover:border-white/20 transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white leading-tight group-hover/ex:text-primary transition-colors">
                                                                    {item.exercicio?.nome}
                                                                </p>
                                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                                                                    {grupo}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-white font-black">{item.series}x {item.repeticoes}</p>
                                                            {item.observacoes && (
                                                                <p className="text-[10px] text-gray-400 italic mt-0.5">Obs: {item.observacoes}</p>
                                                            )}
                                                            <p className="text-[10px] text-gray-500 font-medium">Descanso: {item.descanso}s</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
