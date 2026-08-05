'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Clock, ChevronDown, ChevronUp, Plus, Calendar, Zap, Trash2, X, Pencil, Check } from 'lucide-react';
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
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [atribuicoes, setAtribuicoes] = useState<any[]>(student?.atribuicoes || []);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editSelectedWorkoutId, setEditSelectedWorkoutId] = useState<string>('');
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    useEffect(() => {
        setAtribuicoes(student?.atribuicoes || []);
    }, [student]);

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

    // IDs already assigned (to filter dropdown)
    const assignedTreinoIds = atribuicoes.map((a: any) => a.treinoId || a.treino?.id);
    const availableWorkouts = allWorkouts.filter((w: any) => !assignedTreinoIds.includes(w.id));

    const handleAddWorkout = async () => {
        if (!selectedWorkoutId || !student?.id) return;
        setIsAssigning(true);
        try {
            const res = await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ treinoId: selectedWorkoutId })
            });
            if (res.ok) {
                // Reload student data
                const userRes = await fetch(`/api/admin/users/${student.id}`);
                if (userRes.ok) {
                    const data = await userRes.json();
                    setAtribuicoes(data.atribuicoes || []);
                }
                setSelectedWorkoutId('');
                setShowAddPanel(false);
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

    const handleEditWorkout = async (atribuicaoId: string, oldTreinoId: string) => {
        if (!editSelectedWorkoutId || !student?.id) return;
        if (editSelectedWorkoutId === oldTreinoId) { setEditingId(null); return; }
        setIsSavingEdit(true);
        try {
            // 1. Remove old assignment
            await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ removeWorkoutId: atribuicaoId })
            });
            // 2. Add new assignment
            await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ treinoId: editSelectedWorkoutId })
            });
            // 3. Reload student data
            const userRes = await fetch(`/api/admin/users/${student.id}`);
            if (userRes.ok) {
                const data = await userRes.json();
                setAtribuicoes(data.atribuicoes || []);
            }
            setEditingId(null);
            setEditSelectedWorkoutId('');
        } catch (e) {
            console.error(e);
            alert('Erro ao editar treino.');
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleRemoveOne = async (atribuicaoId: string) => {
        if (!student?.id) return;
        if (!confirm('Deseja remover este treino do aluno?')) return;
        setRemovingId(atribuicaoId);
        try {
            const res = await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ removeWorkoutId: atribuicaoId })
            });
            if (res.ok) {
                setAtribuicoes(prev => prev.filter((a: any) => a.id !== atribuicaoId));
            } else {
                alert('Erro ao remover treino.');
            }
        } catch (e) {
            console.error(e);
            alert('Erro ao remover treino.');
        } finally {
            setRemovingId(null);
        }
    };

    const routines = atribuicoes.map((atrib: any) => {
        const t = atrib.treino;
        const lastLog = student?.treinoLogs?.find((log: any) => log.treinoId === t?.id);
        const lastDone = lastLog
            ? new Date(lastLog.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
            : 'Nunca';
        const startDate = atrib.createdAt
            ? new Date(atrib.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A';

        return {
            atribuicaoId: atrib.id,
            id: t?.id,
            title: t?.nome || t?.titulo,
            description: t?.descricao || 'Treino personalizado.',
            exercisesCount: t?.exercicios?.length || 0,
            duration: (t?.exercicios?.length || 0) * 10 + ' min',
            lastDone,
            startDate,
            exercicios: t?.exercicios || []
        };
    });

    return (
        <div className="space-y-8">
            {/* Header with count + Add button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-white tracking-tighter">
                        Treinos Atribuídos
                    </h3>
                    <span className="text-primary text-sm font-medium bg-primary/10 px-3 py-0.5 rounded-full border border-primary/20">
                        {routines.length} {routines.length === 1 ? 'treino' : 'treinos'}
                    </span>
                </div>
                <button
                    onClick={() => setShowAddPanel(prev => !prev)}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,202,202,0.2)]"
                >
                    {showAddPanel ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddPanel ? 'Cancelar' : 'Adicionar Treino'}
                </button>
            </div>

            {/* Add Workout Panel */}
            <AnimatePresence>
                {showAddPanel && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Selecionar treino para adicionar
                                </label>
                                <select
                                    value={selectedWorkoutId}
                                    onChange={(e) => setSelectedWorkoutId(e.target.value)}
                                    className="w-full bg-[#151515] border border-white/10 rounded-xl h-12 px-4 text-white focus:outline-none focus:border-primary/50 text-sm cursor-pointer"
                                >
                                    <option value="">Selecionar treino existente...</option>
                                    {availableWorkouts.map((w: any) => (
                                        <option key={w.id} value={w.id}>{w.titulo || w.nome}</option>
                                    ))}
                                </select>
                                {availableWorkouts.length === 0 && (
                                    <p className="text-xs text-gray-500">Todos os treinos disponíveis já foram atribuídos.</p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddWorkout}
                                    disabled={!selectedWorkoutId || isAssigning}
                                    className="bg-primary text-black font-bold px-6 h-12 rounded-xl hover:bg-primary/90 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(0,202,202,0.3)]"
                                >
                                    {isAssigning ? 'Adicionando...' : '+ Atribuir'}
                                </button>
                                <Link
                                    href="/admin/treinos/novo"
                                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-bold px-4 h-12 rounded-xl hover:bg-white/10 transition-all text-sm whitespace-nowrap"
                                >
                                    <Plus className="w-4 h-4" /> Criar Novo
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty state */}
            {routines.length === 0 && !showAddPanel && (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Dumbbell className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Nenhum treino atribuído</h3>
                    <p className="text-gray-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                        Este aluno ainda não possui fichas de treinos associadas ao seu perfil.
                    </p>
                    <button
                        onClick={() => setShowAddPanel(true)}
                        className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-[0_0_20px_rgba(0,202,202,0.3)]"
                    >
                        <Plus className="w-4 h-4" /> Adicionar Primeiro Treino
                    </button>
                </div>
            )}

            {/* Routines Grid */}
            {routines.length > 0 && (
                <div className="grid grid-cols-1 gap-6">
                    {routines.map((routine: any, i: number) => {
                        const isExpanded = expandedRoutineId === routine.id;
                        return (
                            <motion.div
                                key={routine.atribuicaoId || routine.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.07 }}
                                className="group bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/[0.08] transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-white/5 rounded-2xl text-primary">
                                            <Dumbbell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-white leading-tight">
                                                {routine.title}
                                            </h4>
                                            <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Desde {routine.startDate}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {editingId !== routine.atribuicaoId && (
                                            <>
                                                <button
                                                    onClick={() => handleToggleExpand(routine.id)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-400 transition-all cursor-pointer"
                                                >
                                                    {isExpanded ? (
                                                        <><ChevronUp className="w-3.5 h-3.5" /> Recolher</>
                                                    ) : (
                                                        <><ChevronDown className="w-3.5 h-3.5" /> Exercícios</>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(routine.atribuicaoId);
                                                        setEditSelectedWorkoutId(routine.id || '');
                                                    }}
                                                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
                                                    title="Trocar treino"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveOne(routine.atribuicaoId)}
                                                    disabled={removingId === routine.atribuicaoId}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 transition-all cursor-pointer disabled:opacity-50"
                                                    title="Remover este treino"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Inline Edit Panel */}
                                <AnimatePresence>
                                    {editingId === routine.atribuicaoId && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden mb-4"
                                        >
                                            <div className="flex flex-col sm:flex-row gap-3 bg-white/5 border border-primary/20 rounded-2xl p-4">
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trocar por</label>
                                                    <select
                                                        value={editSelectedWorkoutId}
                                                        onChange={(e) => setEditSelectedWorkoutId(e.target.value)}
                                                        className="w-full bg-[#151515] border border-white/10 rounded-xl h-10 px-3 text-white focus:outline-none focus:border-primary/50 text-sm cursor-pointer"
                                                    >
                                                        <option value={routine.id}>{routine.title} (atual)</option>
                                                        {allWorkouts
                                                            .filter((w: any) => w.id !== routine.id && !assignedTreinoIds.filter((tid: string) => tid !== routine.id).includes(w.id))
                                                            .map((w: any) => (
                                                                <option key={w.id} value={w.id}>{w.titulo || w.nome}</option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="flex gap-2 items-end">
                                                    <button
                                                        onClick={() => handleEditWorkout(routine.atribuicaoId, routine.id)}
                                                        disabled={isSavingEdit || editSelectedWorkoutId === routine.id}
                                                        className="flex items-center gap-1.5 bg-primary text-black font-bold px-4 h-10 rounded-xl hover:bg-primary/90 transition-all text-sm disabled:opacity-50 cursor-pointer whitespace-nowrap"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        {isSavingEdit ? 'Salvando...' : 'Salvar'}
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingId(null); setEditSelectedWorkoutId(''); }}
                                                        className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-400 font-bold px-4 h-10 rounded-xl hover:bg-white/10 transition-all text-sm cursor-pointer"
                                                    >
                                                        <X className="w-4 h-4" /> Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <p className="text-gray-400 text-sm mb-5 max-w-xl leading-relaxed">
                                    {routine.description}
                                </p>

                                <div className="flex items-center gap-5 text-gray-500 text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-yellow-500" />
                                        {routine.exercisesCount} Exercícios
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                        {routine.duration} estimada
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-primary" />
                                        Última execução: <strong className="text-white font-medium ml-1">{routine.lastDone}</strong>
                                    </span>
                                </div>

                                {/* Exercises List Accordion */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                                                <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">
                                                    Exercícios na Ficha:
                                                </p>
                                                {routine.exercicios.length === 0 ? (
                                                    <p className="text-sm text-gray-500">Nenhum exercício cadastrado neste treino.</p>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {routine.exercicios.map((item: any, idx: number) => {
                                                            const grupo = item.exercicio?.grupoMuscular || 'Geral';
                                                            return (
                                                                <div
                                                                    key={item.id || idx}
                                                                    className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                                                                            {idx + 1}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-white leading-tight">
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
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
