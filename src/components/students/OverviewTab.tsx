'use client';

import { motion } from 'framer-motion';
import { Activity, TrendingUp, Calendar, Zap, Flame, Heart } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const PERFORMANCE_DATA = [
    { name: 'Seg', value: 400, calories: 240 },
    { name: 'Ter', value: 300, calories: 139 },
    { name: 'Qua', value: 200, calories: 980 },
    { name: 'Qui', value: 278, calories: 390 },
    { name: 'Sex', value: 189, calories: 480 },
    { name: 'Sáb', value: 239, calories: 380 },
    { name: 'Dom', value: 349, calories: 430 },
];

interface OverviewTabProps {
    studentId: string;
}

export function OverviewTab({ studentId }: OverviewTabProps) {
    return (
        <div className="space-y-8">
            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Performance Chart */}
                <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Volume de Treino
                            </h3>
                            <p className="text-gray-500 text-xs">Acompanhamento semanal de carga e volume</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-primary border border-primary/20">
                            <TrendingUp className="w-3 h-3" />
                            +12% vs mês anterior
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PERFORMANCE_DATA}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00FF00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00FF00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#666" 
                                    fontSize={12} 
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#00FF00" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorValue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Calories/Activity Chart */}
                <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                <Flame className="w-5 h-5 text-red-500" />
                                Gasto Calórico
                            </h3>
                            <p className="text-gray-500 text-xs">Média diária de queima ativa</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={PERFORMANCE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#666" 
                                    fontSize={12} 
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                                />
                                <Bar 
                                    dataKey="calories" 
                                    fill="#ef4444" 
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Peso Atual', value: '82.4 kg', sub: '-1.2kg este mês', icon: Heart, color: 'text-red-400' },
                    { label: 'Meta de Treino', value: '4 / 5', sub: 'Treinos esta semana', icon: Zap, color: 'text-yellow-400' },
                    { label: 'Assiduidade', value: '94%', sub: 'Nível Gold', icon: Calendar, color: 'text-blue-400' },
                ].map((item, i) => (
                    <motion.div
                        key={item.label}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-white/20 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-white/5 ${item.color}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Premium</span>
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-3xl font-black text-white tracking-tighter mb-1">{item.value}</p>
                        <p className="text-sm text-gray-400 font-medium">{item.sub}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
