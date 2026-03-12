'use client';

import { useState } from 'react';
import { ArrowLeft, UserPlus, MoreVertical, Plus, Settings, ExternalLink, Save, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewProgramPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('Ilimitado');
    const [notes, setNotes] = useState('');

    // Routines State
    const [routines, setRoutines] = useState([
        { id: 1, name: 'Treino A', exercises: [] }
    ]);

    const handleAddRoutine = () => {
        const newId = routines.length + 1;
        setRoutines([...routines, { id: newId, name: `Treino ${String.fromCharCode(65 + routines.length)}`, exercises: [] }]);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/admin/programas');
    };

    return (
        <div className="max-w-[1400px] mx-auto p-6 flex gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <Link href="/admin/programas" className="flex items-center text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <h1 className="text-xl font-bold text-white">Criar Novo Modelo</h1>
                    </Link>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                            Rascunho não salvo
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Salvar Programa
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-[3fr,1fr] gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Título do Programa de Treino</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Hipertrofia Intermediário"
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary placeholder:text-gray-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Duração do Programa</label>
                        <div className="relative">
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary appearance-none"
                            >
                                <option>Ilimitado</option>
                                <option>4 semanas</option>
                                <option>8 semanas</option>
                                <option>12 semanas</option>
                            </select>
                            <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Nota do Programa</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Descreva os objetivos e instruções gerais..."
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary min-h-[100px] text-sm leading-relaxed placeholder:text-gray-600"
                    />
                </div>

                <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white">Rotinas</h2>
                        <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-xs font-medium">{routines.length}</span>
                    </div>
                    <button
                        onClick={handleAddRoutine}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Rotina
                    </button>
                </div>

                <div className="space-y-4">
                    {routines.map((routine, idx) => (
                        <div key={routine.id} className="bg-white rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-gray-900">{routine.name}</h3>
                                    <button className="text-xs text-blue-600 font-medium hover:underline">Renomear</button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Empty State for Routine */}
                            <div className="p-8 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">Adicionar exercícios</h4>
                                <p className="text-xs text-gray-500 mb-4">Comece a construir este treino adicionando exercícios.</p>
                                <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                                    Buscar na biblioteca
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar Summary */}
            <div className="w-[300px] space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">Resumo</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Total de Exercícios</span>
                            <span className="font-bold text-gray-900">0</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Total de Séries</span>
                            <span className="font-bold text-gray-900">0</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-gray-900">Distribuição Muscular</h4>
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                <button className="p-1 bg-blue-100 text-blue-600 rounded shadow-sm"><Settings className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="text-center py-6 text-xs text-gray-400">
                            Nenhum dado ainda
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
