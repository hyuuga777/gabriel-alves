'use client';

import { Dumbbell, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

interface OverviewTabProps {
    student: any;
}

const dataDuration = [
    { name: '28 Set', value: 0 }, { name: '19 Out', value: 0 }, { name: '09 Nov', value: 0 }, { name: '30 Nov', value: 4.5 }, { name: '21 Dez', value: 1.5 },
];

const dataVolume = [
    { name: '28 Set', value: 0 }, { name: '09 Nov', value: 0 }, { name: '30 Nov', value: 24000 }, { name: '21 Dez', value: 8000 },
];

const dataSets = [
    { name: '28 Set', value: 0 }, { name: '09 Nov', value: 0 }, { name: '30 Nov', value: 80 }, { name: '21 Dez', value: 25 },
];

const dataBodyweight = [
    { name: '09 Nov', value: 96.3 }, { name: '16 Nov', value: 97.2 }, { name: '23 Nov', value: 88.1 }, { name: '30 Nov', value: 81.1 }, { name: '07 Dez', value: 83.0 },
];

export function OverviewTab({ student }: OverviewTabProps) {
    return (
        <div className="space-y-6">
            {/* Top Row: Programs & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Program & Notes */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Program */}
                    <div className="bg-[#111] border border-white/5 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-medium text-white">Programa de Treino</h3>
                            <button className="text-primary text-sm font-medium hover:underline">Editar programa</button>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
                                <Dumbbell className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h4 className="font-medium text-white">{student.atribuicoes?.[0]?.treino?.nome || 'Full Body x3'}</h4>
                                    <span className="text-xs text-red-500 font-medium">Semana 5 de 4</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">3 rotinas • Início em 23 Nov, 2025</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-[#111] border border-white/5 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-white">Notas</h3>
                        </div>
                        <textarea
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary min-h-[100px] text-sm"
                            placeholder='Adicione notas sobre este aluno, ex: "Histórico de dor no joelho"'
                        />
                    </div>
                </div>

                {/* Right Column: Activities */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-6 h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-medium text-white">últimas Atividades</h3>
                        <button className="text-primary text-sm font-medium hover:underline">Ver tudo</button>
                    </div>

                    <div className="space-y-6 relative">
                        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-white/5"></div>
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#111] overflow-hidden flex-shrink-0">
                                    <img src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}&background=random`} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">
                                        <span className="font-medium text-white">{student.name}</span> completou um treino.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Domingo, 07 Dezembro, 2025</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div>
                <h3 className="text-lg font-medium text-white mb-4">Estatísticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Duração" value="0min" sub="Esta semana" data={dataDuration} color="#3b82f6" />
                    <StatCard title="Volume" value="0 kg" sub="Esta semana" data={dataVolume} color="#3b82f6" />
                    <StatCard title="Séries" value="0 séries" sub="Esta semana" data={dataSets} color="#3b82f6" />
                </div>
            </div>

            {/* Bottom: Bodyweight & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#111] border border-white/5 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-medium text-white mb-2">Peso Corporal</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-white">83 kg</span>
                                <ArrowUpRight className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                    <div className="h-[150px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataBodyweight}>
                                <XAxis dataKey="name" hide />
                                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} itemStyle={{ color: '#fff' }} />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#111] border border-white/5 rounded-xl p-6">
                    <h3 className="font-medium text-white mb-4">Fotos de Progresso</h3>
                    <div className="w-[120px] h-[160px] bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        Sem Fotos
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, data, color }: any) {
    return (
        <div className="bg-[#111] border border-white/5 rounded-xl p-6">
            <div className="mb-4">
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500">{sub}</p>
            </div>
            <div className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" hide />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
