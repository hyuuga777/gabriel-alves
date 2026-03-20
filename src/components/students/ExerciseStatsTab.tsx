'use client';

import { useState } from 'react';
import { Search, ChevronDown, Dumbbell, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ExerciseStatsTabProps {
    student: any;
}

const exercises = [
    { id: 1, name: 'Levantamento terra (com barra)', muscle: 'Glsteos', image: '/exercises/deadlift.jpg' },
    { id: 2, name: 'Supino inclinado (com halteres)', muscle: 'Peito', image: '/exercises/incline_bench.jpg' },
    { id: 3, name: 'Extensão de Pernas (Máquina)', muscle: 'Quadríceps', image: '/exercises/leg_ext.jpg' },
    { id: 4, name: 'Puxe para cima', muscle: 'Dorsais', image: '/exercises/pullup.jpg' },
    { id: 5, name: 'Sente-se', muscle: 'Abdômen', image: '/exercises/situp.jpg' },
    { id: 6, name: 'Extensão de tríceps com corda', muscle: 'Tríceps', image: '/exercises/tricep_pushdown.jpg' },
    { id: 7, name: 'Supino (com barra)', muscle: 'Peito', image: '/exercises/bench_press.jpg' },
];

const mockStatsData = [
    { date: '12 sem', value: 100 },
    { date: '10 sem', value: 105 },
    { date: '8 sem', value: 105 },
    { date: '6 sem', value: 110 },
    { date: '4 sem', value: 115 },
    { date: '2 sem', value: 120 },
    { date: 'Atual', value: 120 },
];

export function ExerciseStatsTab({ student }: ExerciseStatsTabProps) {
    const [selectedExercise, setSelectedExercise] = useState(exercises[0]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar: Exercise List */}
            <div className="space-y-4">
                <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-between px-3 py-2 bg-[#111] border border-white/10 rounded-lg text-sm text-white">
                        Equipamento
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="flex-1 flex items-center justify-between px-3 py-2 bg-[#111] border border-white/10 rounded-lg text-sm text-white">
                        Mssculos
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Exercícios de pesquisa"
                        className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-gray-500"
                    />
                </div>

                <div className="space-y-1">
                    <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Exercícios recentes</h4>
                    {exercises.map(exercise => (
                        <div
                            key={exercise.id}
                            onClick={() => setSelectedExercise(exercise)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedExercise.id === exercise.id ? 'bg-[#1a1a1a] border border-white/5' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                <Dumbbell className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className={`text-sm font-medium truncate ${selectedExercise.id === exercise.id ? 'text-white' : 'text-gray-300'}`}>
                                    {exercise.name}
                                </p>
                                <p className="text-xs text-gray-500">{exercise.muscle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content: Exercise Details */}
            <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{selectedExercise.name}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-semibold text-gray-900">Equipamento: </span>
                                <span className="text-sm text-gray-600">Barra</span>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-900">Grupo muscular principal: </span>
                                <span className="text-sm text-gray-600">{selectedExercise.muscle}</span>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-900">Grupos musculares secundários: </span>
                                <span className="text-sm text-gray-600">Isquiotibiais, Quadríceps, Lombar, Dorsais, Trapézios</span>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-900">Tipo de exercício: </span>
                                <span className="text-sm text-gray-600">Repetições de peso</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                            {/* Placeholder for Muscle Anatomy */}
                            <div className="relative w-32 h-48 opacity-50">
                                <User className="w-full h-full text-gray-300" />
                                <div className="absolute inset-0 bg-red-500/20 mix-blend-multiply mask-image" style={{ clipPath: 'polygon(30% 60%, 70% 60%, 70% 80%, 30% 80%)' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex gap-6">
                            <button className="pb-2 border-b-2 border-primary text-primary font-medium text-sm">
                                Estatísticas
                            </button>
                            <button className="pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors">
                                História
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-900">Visão geral das estatísticas</h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                sltimas 12 semanas
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Peso Estimado (1RM)</h4>
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={mockStatsData}>
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                            />
                                            <YAxis
                                                hide
                                                domain={['dataMin - 10', 'dataMax + 10']}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111' }}
                                                itemStyle={{ color: '#111' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#3b82f6"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
