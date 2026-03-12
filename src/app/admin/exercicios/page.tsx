'use client';

import { useState } from 'react';
import { Plus, Search, Play, Edit, Filter } from 'lucide-react';
import { MOCK_EXERCICIOS } from '@/lib/mock-db';

export default function AdminExerciciosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('Todos');

    const filteredExercicios = MOCK_EXERCICIOS.filter(ex => {
        const matchesSearch = ex.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = selectedGroup === 'Todos' || ex.grupoMuscular === selectedGroup;
        return matchesSearch && matchesGroup;
    });

    const groups = ['Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps', 'Abdômen'];

    const getGroupBadgeColor = (group: string) => {
        switch (group) {
            case 'Peito': return 'bg-primary/10 text-primary border-primary/20';
            case 'Costas': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Pernas': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'Ombros': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Bíceps': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'Tríceps': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Biblioteca de Exercícios</h1>
                    <p className="text-sm text-gray-400 mt-1">Gerencie o acervo de movimentos disponíveis para as fichas.</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10"
                    onClick={() => alert('Novo exercício funcionalidade em breve!')}
                >
                    <Plus className="w-5 h-5" />
                    Novo Exercício
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 bg-[#111111] p-4 rounded-xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar exercício..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {groups.map(group => (
                        <button
                            key={group}
                            onClick={() => setSelectedGroup(group)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${selectedGroup === group
                                ? 'bg-primary text-black border-primary'
                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de Exercícios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredExercicios.map(ex => (
                    <div key={ex.id} className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getGroupBadgeColor(ex.grupoMuscular)}`}>
                                {ex.grupoMuscular}
                            </span>
                            <button className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="text-white font-bold text-lg mb-4 line-clamp-1">{ex.nome}</h3>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <a
                                href={ex.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                </div>
                                Ver Vídeo
                            </a>
                        </div>
                    </div>
                ))}

                {filteredExercicios.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-gray-500">Nenhum exercício encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
