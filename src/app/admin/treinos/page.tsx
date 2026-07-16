'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Dumbbell, Users, ChevronRight, Loader2 } from 'lucide-react';

interface Treino {
    id: string;
    titulo: string;
    aluno: string;
    exercicios: number;
    criadoEm: string;
}

export default function AdminTreinosPage() {
    const [search, setSearch] = useState('');
    const [workouts, setWorkouts] = useState<Treino[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const res = await fetch('/api/admin/workouts');
                if (res.ok) {
                    const data = await res.json();
                    setWorkouts(data);
                }
            } catch (error) {
                console.error("Error fetching workouts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    const filtered = workouts.filter(t =>
        t.titulo.toLowerCase().includes(search.toLowerCase()) ||
        t.aluno.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Treinos</h1>
                    <p className="text-sm text-gray-400 mt-1">Gerencie as fichas de treino dos seus alunos.</p>
                </div>
                <Link
                    href="/admin/treinos/novo"
                    className="inline-flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Novo Treino
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Buscar por treino ou aluno..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-[#111] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary/50"
                />
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-gray-500 text-sm">Carregando treinos...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p>Nenhum treino encontrado.</p>
                    </div>
                ) : (
                    filtered.map(treino => (
                        <Link
                            key={treino.id}
                            href={`/admin/treinos/${treino.id}`}
                            className="flex items-center gap-4 p-5 bg-[#111] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/2 transition-all group"
                        >
                            <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                                <Dumbbell className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">{treino.titulo}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />{treino.aluno}
                                    </span>
                                    <span>·</span>
                                    <span>{treino.exercicios} exercícios</span>
                                    <span>·</span>
                                    <span>{treino.criadoEm}</span>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
