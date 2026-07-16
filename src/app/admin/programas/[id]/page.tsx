'use client';

import { useState } from 'react';
import { ArrowLeft, UserPlus, FileText, MoreVertical, Plus, Settings, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditProgramPage({ params }: any) {
    const [title, setTitle] = useState('Hipertrofia - Iniciante - 3 Dias');
    const [duration, setDuration] = useState('Ilimitado');
    const [notes, setNotes] = useState('A divisão de 3 dias para iniciantes (empurrar/puxar/pernas) é uma abordagem simples e sustentável para novatos construírem uma base na academia. Cada dia é dedicado a grupos musculares específicos.');

    const routines = [
        {
            id: 1,
            name: 'Treino 1 - Empurrar',
            exercises: [
                { name: 'Supino Reto (Barra)', sets: '5×', type: 'Repetições de peso' },
                { name: 'Supino Inclinado (Halteres)', sets: '3×', type: 'Repetições de peso' },
                { name: 'Desenvolvimento (Máquina)', sets: '3×', type: 'Repetições de peso' },
                { name: 'Tríceps Corda', sets: '3×', type: 'Repetições de peso' },
                { name: 'Elevação Lateral', sets: '3×', type: 'Repetições de peso' },
            ]
        },
        {
            id: 2,
            name: 'Treino 2 - Puxar',
            exercises: [
                { name: 'Remada Curvada', sets: '5×', type: 'Repetições de peso' },
                { name: 'Puxada Aberta', sets: '3×', type: 'Repetições de peso' },
                { name: 'Rosca Direta', sets: '3×', type: 'Repetições de peso' },
                { name: 'Face Pull', sets: '3×', type: 'Repetições de peso' },
            ]
        },
        {
            id: 3,
            name: 'Treino 3 - Pernas',
            exercises: [
                { name: 'Agachamento Livre', sets: '5×', type: 'Repetições de peso' },
                { name: 'Leg Press', sets: '3×', type: 'Repetições de peso' },
                { name: 'Cadeira Extensora', sets: '3×', type: 'Repetições de peso' },
                { name: 'Panturrilha Sentado', sets: '3×', type: 'Repetições de peso' },
            ]
        }
    ];

    const stats = [
        { label: 'Total de Exercícios', value: 14 },
        { label: 'Total de Séries', value: 48 },
    ];

    return (
        <div className="max-w-[1400px] mx-auto p-6 flex gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <Link href="/admin/programas" className="flex items-center text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <h1 className="text-xl font-bold text-white">Editar Modelo de Programa</h1>
                    </Link>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 text-xs text-green-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Todas as alterações salvas
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-gray-100">
                            <UserPlus className="w-4 h-4" />
                            Atribuir Programa
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-[3fr,1fr] gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Título do Programa de Treino</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
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
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary min-h-[100px] text-sm leading-relaxed"
                    />
                </div>

                <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white">Rotinas</h2>
                        <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-xs font-medium">{routines.length}</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm">
                        <Plus className="w-4 h-4" />
                        Adicionar Rotina
                    </button>
                </div>

                <div className="space-y-4">
                    {routines.map((routine) => (
                        <div key={routine.id} className="bg-white rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">{routine.name}</h3>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-2 space-y-1">
                                {routine.exercises.map((exercise, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group">
                                        <span className="text-gray-400 w-6 text-right text-sm font-medium">{exercise.sets}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{exercise.name}</p>
                                        </div>
                                    </div>
                                ))}
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
                        <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-gray-600"><ExternalLink className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{stat.label}</span>
                                <span className="font-bold text-gray-900">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-gray-900">Distribuição Muscular</h4>
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                <button className="p-1 bg-blue-100 text-blue-600 rounded shadow-sm"><Settings className="w-4 h-4" /></button>
                                <button className="p-1 text-gray-400 hover:text-gray-600"><UserPlus className="w-4 h-4" /></button>
                            </div>
                        </div>
                        {/* Mock Muscle List */}
                        <div className="space-y-2">
                            {[
                                { name: 'Peito', val: 9 },
                                { name: 'Quadríceps', val: 9 },
                                { name: 'Costas', val: 9 },
                                { name: 'Ombros', val: 6 },
                                { name: 'Tríceps', val: 6 },
                                { name: 'Bíceps', val: 6 },
                            ].map((m, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">{m.name}</span>
                                    <span className="font-medium text-gray-900">{m.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
