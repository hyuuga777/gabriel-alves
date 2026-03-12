'use client';

import { useState } from 'react';
import { Plus, ChevronDown, ArrowUpRight, ArrowDownRight, ArrowRight, Ruler, Weight, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface MeasurementsTabProps {
    student: any;
}

const measurementTypes = [
    { id: 'abdomen', label: 'Abdômen', icon: Ruler },
    { id: 'fat', label: 'Gordura corporal', icon: User },
    { id: 'weight', label: 'Peso corporal', icon: Weight },
    { id: 'chest', label: 'Peito', icon: Ruler },
    { id: 'hips', label: 'Quadris', icon: Ruler },
    { id: 'bicep_l', label: 'Bíceps esquerdo', icon: Ruler },
    { id: 'calf_l', label: 'Panturrilha esquerda', icon: Ruler },
    { id: 'forearm_l', label: 'Antebraço esquerdo', icon: Ruler },
    { id: 'thigh_l', label: 'Coxa esquerda', icon: Ruler },
    { id: 'neck', label: 'Pescoço', icon: Ruler },
    { id: 'bicep_r', label: 'Bíceps direito', icon: Ruler },
    { id: 'calf_r', label: 'Panturrilha direita', icon: Ruler },
    { id: 'forearm_r', label: 'Antebraço direito', icon: Ruler },
    { id: 'thigh_r', label: 'Coxa direita', icon: Ruler },
    { id: 'shoulder', label: 'Ombro', icon: Ruler },
    { id: 'waist', label: 'Cintura', icon: Ruler },
];

const mockData = [
    { date: '09 Nov', value: 102.75 },
    { date: '16 Nov', value: 106.75 },
    { date: '23 Nov', value: 104.75 },
    { date: '30 Nov', value: 109.75 },
    { date: '07 Dez', value: 100.75 },
];

export function MeasurementsTab({ student }: MeasurementsTabProps) {
    const [activeType, setActiveType] = useState('chest');

    const activeLabel = measurementTypes.find(t => t.id === activeType)?.label || 'Medida';
    const lastValue = mockData[mockData.length - 1].value;
    const previousValue = mockData[mockData.length - 2].value;
    const isIncrease = lastValue > previousValue;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Medições de pesquisa"
                        className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

                <div className="space-y-1 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {measurementTypes.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setActiveType(type.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeType === type.id ? 'bg-[#1a1a1a] text-white border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <type.icon className="w-4 h-4 opacity-70" />
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white text-black rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{activeLabel}</h3>
                        <div className="flex flex-col mt-2">
                            <span className="text-xs text-gray-500">Durar</span>
                            <span className="text-3xl font-bold text-gray-900">
                                {Number(lastValue).toLocaleString('pt-BR')} cm
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 font-medium">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Todos os tempos
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors">
                            <Plus className="w-4 h-4" />
                            Medição de logaritmo
                        </button>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-[300px] w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                domain={['dataMin - 2', 'dataMax + 2']}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* History */}
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">História</h4>
                    <div className="space-y-2">
                        {[...mockData].reverse().map((item, i) => {
                            // Calculate previous item logic for direction of arrow
                            // For the reverse list, the "next" item in the array is actually the older data point
                            // So we compare item.value with reverseMockData[i+1].value
                            const reversedData = [...mockData].reverse();
                            const prevItem = reversedData[i + 1];
                            const isUp = prevItem ? item.value > prevItem.value : true;

                            return (
                                <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg bg-gray-100 text-gray-400`}>
                                            {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                        </div>
                                        <span className="text-gray-900 font-bold">{item.value.toLocaleString('pt-BR')} cm</span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {item.date === '07 Dez' ? '7 de dezembro' :
                                            item.date === '30 Nov' ? '30 de novembro' :
                                                item.date === '23 Nov' ? '23 de novembro' :
                                                    item.date === '16 Nov' ? '16 de novembro' :
                                                        item.date === '09 Nov' ? '9 de novembro' : item.date}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
