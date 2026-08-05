'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, History, TrendingUp, Activity, Target, Dumbbell } from 'lucide-react';

interface StatsTabProps {
    student?: any;
}

export function StatsTab({ student }: StatsTabProps) {
    const [simulated1RM, setSimulated1RM] = useState(false);
    const [search1RM, setSearch1RM] = useState('');
    const [searchExercise, setSearchExercise] = useState('');
    const [selected1RMExercise, setSelected1RMExercise] = useState<any>(null);

    // Extract real exercises from student's workout assignments
    const allExercises = useMemo(() => {
        if (!student?.atribuicoes) return [];
        const seen = new Set<string>();
        const exercises: any[] = [];
        student.atribuicoes.forEach((atrib: any) => {
            const treino = atrib.treino;
            if (!treino?.exercicios) return;
            treino.exercicios.forEach((item: any) => {
                const ex = item.exercicio || item;
                const nome = ex.nome || item.nome || 'Exercício';
                if (!seen.has(nome)) {
                    seen.add(nome);
                    exercises.push({
                        name: nome,
                        group: ex.grupoMuscular || 'Geral',
                        series: item.series,
                        repeticoes: item.repeticoes,
                        treinoNome: treino.nome || treino.titulo,
                    });
                }
            });
        });
        return exercises;
    }, [student]);

    // Filter exercises by search
    const filteredExercises = useMemo(() => {
        if (!searchExercise) return allExercises;
        const q = searchExercise.toLowerCase();
        return allExercises.filter(e =>
            e.name.toLowerCase().includes(q) ||
            e.group.toLowerCase().includes(q) ||
            (e.treinoNome || '').toLowerCase().includes(q)
        );
    }, [allExercises, searchExercise]);

    // Filter exercises for 1RM selector
    const filtered1RM = useMemo(() => {
        if (!search1RM) return allExercises;
        const q = search1RM.toLowerCase();
        return allExercises.filter(e => e.name.toLowerCase().includes(q) || e.group.toLowerCase().includes(q));
    }, [allExercises, search1RM]);

    const hasWorkouts = allExercises.length > 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar exercício..."
                        value={searchExercise}
                        onChange={(e) => setSearchExercise(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-gray-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setSearchExercise('')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all font-bold"
                    >
                        <Filter className="w-5 h-5" />
                        Limpar Filtro
                    </button>
                    <div className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary px-6 py-3 rounded-2xl font-bold">
                        <TrendingUp className="w-5 h-5" />
                        {allExercises.length} Exercícios
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Exercise List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            Exercícios nos Programas
                        </h3>
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                            {hasWorkouts ? `${filteredExercises.length} exercício(s)` : 'Sem treinos'}
                        </span>
                    </div>

                    {!hasWorkouts ? (
                        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
                            <Dumbbell className="w-10 h-10 mx-auto mb-3 text-gray-600 animate-pulse" />
                            <p className="text-gray-500 text-sm font-medium">Nenhum treino atribuído</p>
                            <p className="text-gray-600 text-xs mt-1">Atribua treinos na aba Programas para ver os exercícios aqui.</p>
                        </div>
                    ) : filteredExercises.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl">
                            <Search className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                            <p className="text-gray-500 text-sm">Nenhum exercício encontrado para "{searchExercise}"</p>
                        </div>
                    ) : (
                        filteredExercises.map((exercise, i) => (
                            <motion.div
                                key={exercise.name}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={() => {
                                    setSelected1RMExercise(exercise);
                                    setSimulated1RM(true);
                                }}
                                className="group bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-6"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0 relative overflow-hidden">
                                    <Activity className="w-7 h-7 relative z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-bold text-white truncate">{exercise.name}</h4>
                                        <span className="px-2 py-0.5 bg-white/5 text-[9px] font-bold text-gray-500 rounded uppercase tracking-tighter border border-white/5 flex-shrink-0">
                                            {exercise.group}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                        {exercise.series && (
                                            <span className="flex items-center gap-1">
                                                Séries: <span className="text-gray-200">{exercise.series}</span>
                                            </span>
                                        )}
                                        {exercise.repeticoes && (
                                            <span className="flex items-center gap-1">
                                                Reps: <span className="text-gray-200">{exercise.repeticoes}</span>
                                            </span>
                                        )}
                                        {exercise.treinoNome && (
                                            <span className="flex items-center gap-1 uppercase tracking-widest text-[10px] opacity-60">
                                                {exercise.treinoNome}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right flex-shrink-0 text-gray-600 text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                                    Ver 1RM →
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Analysis Widget — 1RM */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        
                        <h3 className="text-xl font-black text-white mb-8 tracking-tight flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Previsão de 1RM
                        </h3>

                        {simulated1RM && selected1RMExercise ? (
                            <div className="text-center py-8 border border-primary/20 bg-primary/5 rounded-3xl group cursor-pointer relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSimulated1RM(false); setSelected1RMExercise(null); }}
                                    className="absolute pt-1 top-4 right-4 text-gray-500 hover:text-white text-xs uppercase tracking-widest"
                                >
                                    Fechar
                                </button>
                                <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest px-4">{selected1RMExercise.name}</div>
                                <div className="text-xs text-gray-600 mb-4 font-medium">{selected1RMExercise.group}</div>
                                <div className="text-4xl font-black text-white tracking-tighter mb-1">
                                    {selected1RMExercise.series || '—'} <span className="text-lg text-primary">séries</span>
                                </div>
                                <div className="text-2xl font-black text-gray-300 tracking-tighter mb-1">
                                    × {selected1RMExercise.repeticoes || '—'} <span className="text-sm text-gray-500">reps</span>
                                </div>
                                <p className="text-gray-500 text-xs mt-3 px-4">
                                    Registre cargas no app do aluno para calcular o 1RM estimado.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Search for 1RM exercise */}
                                {hasWorkouts && (
                                    <div className="mb-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type="text"
                                                placeholder="Buscar exercício..."
                                                value={search1RM}
                                                onChange={(e) => setSearch1RM(e.target.value)}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-primary/50 focus:outline-none text-sm placeholder:text-gray-700"
                                            />
                                        </div>
                                        {search1RM && filtered1RM.length > 0 && (
                                            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                                {filtered1RM.slice(0, 5).map(ex => (
                                                    <button
                                                        key={ex.name}
                                                        onClick={() => { setSelected1RMExercise(ex); setSimulated1RM(true); setSearch1RM(''); }}
                                                        className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white transition-colors"
                                                    >
                                                        <span className="font-bold">{ex.name}</span>
                                                        <span className="text-gray-500 text-xs ml-2">{ex.group}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div 
                                    onClick={() => hasWorkouts && allExercises[0] && (setSelected1RMExercise(allExercises[0]), setSimulated1RM(true))}
                                    className={`text-center py-10 border-2 border-dashed border-white/5 rounded-3xl group transition-colors ${hasWorkouts ? 'hover:border-primary/20 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                >
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Activity className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium px-6">
                                        {hasWorkouts 
                                            ? 'Selecione ou busque um exercício para ver detalhes'
                                            : 'Atribua treinos para ver a previsão de 1RM'
                                        }
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="mt-8 space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Total de Exercícios</span>
                                    <span className="text-xs font-bold text-primary">{allExercises.length}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all"
                                        style={{ width: `${Math.min(100, (allExercises.length / 20) * 100)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Programas Ativos</span>
                                    <span className="text-xs font-bold text-blue-400">{student?.atribuicoes?.length || 0}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-400 transition-all"
                                        style={{ width: `${Math.min(100, ((student?.atribuicoes?.length || 0) / 5) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
