'use client';

import { useState } from 'react';
import { BarChart3, Clock, Scale, Layers, Calendar, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from 'recharts';

interface AdvancedStatsTabProps {
    student: any;
}

const mockChartDataLines = [
    { date: 'Set 28', ombros: 0, biceps: 0, peito: 0 },
    { date: 'Out 5', ombros: 0, biceps: 0, peito: 0 },
    { date: 'Out 12', ombros: 0, biceps: 0, peito: 0 },
    { date: 'Nov 16', ombros: 0, biceps: 0, peito: 0 },
    { date: 'Nov 23', ombros: 10, biceps: 8, peito: 9 },
    { date: 'Nov 30', ombros: 7, biceps: 6, peito: 7 },
    { date: 'Dez 7', ombros: 2, biceps: 2, peito: 2 },
    { date: 'Dez 14', ombros: 0, biceps: 0, peito: 0 },
    { date: 'Dez 21', ombros: 0, biceps: 0, peito: 0 },
];

const mockChartDataBars = [
    { date: 'Set 28', value: 0 },
    { date: 'Out 5', value: 0 },
    { date: 'Out 12', value: 0 },
    { date: 'Out 19', value: 0 },
    { date: 'Out 26', value: 0 },
    { date: 'Nov 02', value: 0 },
    { date: 'Nov 09', value: 0 },
    { date: 'Nov 16', value: 0 },
    { date: 'Nov 23', value: 120 }, // High value
    { date: 'Nov 30', value: 60 },  // Mid value
    { date: 'Dez 07', value: 20 },  // Low value
    { date: 'Dez 14', value: 0 },
    { date: 'Dez 21', value: 0 },
];

const muscleGroups = [
    { name: 'Ombros', total: 36.5, color: '#3b82f6', checked: true },
    { name: 'Dorsais', total: 33, color: '#9ca3af', checked: false },
    { name: 'Parte superior das costas', total: 30, color: '#9ca3af', checked: false },
    { name: 'Quadríceps', total: 28.5, color: '#9ca3af', checked: false },
    { name: 'Bíceps', total: 28, color: '#eab308', checked: true },
    { name: 'Tríceps', total: 27, color: '#9ca3af', checked: false },
    { name: 'Peito', total: 27, color: '#a855f7', checked: true },
    { name: 'Músculos isquiotibiais', total: 21, color: '#9ca3af', checked: false },
];

const statsTypes = [
    { id: 'muscles', label: 'Número de séries por grupo muscular', icon: BarChart3 },
    { id: 'duration', label: 'Duração', icon: Clock },
    { id: 'volume', label: 'Volume', icon: Scale },
    { id: 'sets', label: 'Conjuntos', icon: Layers },
];

export function AdvancedStatsTab({ student }: AdvancedStatsTabProps) {
    void student; // Suppress unused variable warning
    const [activeType, setActiveType] = useState('muscles');

    const getChartTitle = () => {
        return statsTypes.find(t => t.id === activeType)?.label;
    };

    // Helper to format Y-axis tick values based on active type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatYAxis = (value: any) => {
        if (typeof value !== 'number') return value;

        if (activeType === 'duration') {
            if (value === 0) return '0h';
            return `${Math.round(value / 60)}h`; // improved mapping for Hours
        }
        if (activeType === 'volume') {
            if (value === 0) return '0 kg';
            if (value >= 1000) return `${value / 1000}k kg`;
            return `${value} kg`;
        }
        if (activeType === 'sets') {
            if (value === 0) return '0 sets';
            return `${value} sets`;
        }
        return value.toString();
    };

    // Prepare bar data based on active type to simulate different patterns
    const getBarData = () => {
        return mockChartDataBars.map(d => {
            let val = d.value;
            // Scale mock values to look realistic for different metrics
            if (activeType === 'duration') val = val * 2; // e.g. 120 -> 240 mins ~ 4h
            if (activeType === 'volume') val = val * 250; // e.g. 120 -> 30000 kg
            if (activeType === 'sets') val = val * 0.8; // e.g. 120 -> 96 sets
            return { ...d, value: val };
        });
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-2">
                {statsTypes.map(type => (
                    <button
                        key={type.id}
                        onClick={() => setActiveType(type.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeType === type.id
                            ? 'bg-gray-100/10 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        style={activeType === type.id ? { backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
                    >
                        <type.icon className="w-5 h-5" />
                        <span className="text-left">{type.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h3 className="font-semibold text-gray-900 text-lg">{getChartTitle()}</h3>
                        <div className="flex gap-3">
                            <div className="relative">
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-white">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    Semana
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                </button>
                            </div>
                            <div className="relative">
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-white">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    Últimos 3 meses
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="h-[300px] w-full mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            {activeType === 'muscles' ? (
                                <LineChart data={mockChartDataLines} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111' }} itemStyle={{ fontSize: '12px' }} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" name="Ombros" dataKey="ombros" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name="Bíceps" dataKey="biceps" stroke="#eab308" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name="Peito" dataKey="peito" stroke="#a855f7" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            ) : (
                                <BarChart data={getBarData()} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        tickFormatter={formatYAxis}
                                        width={50}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111' }}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(value: any) => [formatYAxis(value), '']}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>

                    {/* Data Table - Only for Muscle Groups */}
                    {activeType === 'muscles' && (
                        <div>
                            <div className="flex justify-between text-sm text-gray-500 border-b border-gray-100 pb-2 mb-2">
                                <span>Grupo muscular</span>
                                <span>Total</span>
                            </div>
                            <div className="space-y-0.5">
                                {muscleGroups.map((group, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${group.checked ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
                                                {group.checked && <div className="w-2 h-2 bg-white rounded-sm" />}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{group.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{group.total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
