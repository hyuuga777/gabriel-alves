'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, History, TrendingUp, ChevronRight, Activity, Target } from 'lucide-react';

const RECENT_EXERCISES = [
    { name: 'Supino Reto com Barra', group: 'Peito', lastVolume: '2,450 kg', change: '+5%', date: 'Ontem' },
    { name: 'Agachamento Livre', group: 'Pernas', lastVolume: '3,100 kg', change: '+2%', date: 'Hojte' },
    { name: 'Puxada Aberta Pulley', group: 'Costas', lastVolume: '1,800 kg', change: '-1%', date: '2 dias atrás' },
    { name: 'Desenvolvimento Halteres', group: 'Ombros', lastVolume: '950 kg', change: '+8%', date: 'Ontem' },
    { name: 'Levantamento Terra', group: 'Cadeia Posterior', lastVolume: '4,200 kg', change: '+12%', date: '3 dias atrás' },
];

export function StatsTab() {
    const [simulated1RM, setSimulated1RM] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar exercício..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-gray-600"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all font-bold">
                        <Filter className="w-5 h-5" />
                        Filtros
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary px-6 py-3 rounded-2xl hover:bg-primary/20 transition-all font-bold">
                        <TrendingUp className="w-5 h-5" />
                        Volume Total
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Exercise List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            Histórico de Exercícios
                        </h3>
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Últimos 30 dias</span>
                    </div>

                    {RECENT_EXERCISES.map((exercise, i) => (
                        <motion.div
                            key={exercise.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-6"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0 relative overflow-hidden">
                                <Activity className="w-7 h-7 relative z-10" />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-lg font-bold text-white truncate">{exercise.name}</h4>
                                    <span className="px-2 py-0.5 bg-white/5 text-[9px] font-bold text-gray-500 rounded uppercase tracking-tighter border border-white/5">
                                        {exercise.group}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                    <span className="flex items-center gap-1">
                                        V. Total: <span className="text-gray-200">{exercise.lastVolume}</span>
                                    </span>
                                    <span className="flex items-center gap-1 uppercase tracking-widest text-[10px] opacity-60">
                                        {exercise.date}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 flex-shrink-0">
                                <div className={`text-right ${exercise.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                    <p className="text-sm font-black leading-none mb-1">{exercise.change}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">1RM Est.</p>
                                </div>
                                {/* Seta lateral removida */}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Analysis Widget */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        
                        <h3 className="text-xl font-black text-white mb-8 tracking-tight flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Previsão de 1RM
                        </h3>

                        {simulated1RM ? (
                            <div 
                                onClick={() => alert('O simulador de 1RM será calculado pelo sistema com base no algoritmo do banco!')}
                                className="text-center py-8 border border-primary/20 bg-primary/5 rounded-3xl group cursor-pointer relative"
                            >
                                <button onClick={(e) => { e.stopPropagation(); setSimulated1RM(false); }} className="absolute pt-1 top-4 right-4 text-gray-500 hover:text-white text-xs uppercase tracking-widest">
                                    Fechar
                                </button>
                                <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Agachamento Livre</div>
                                <div className="text-5xl font-black text-white tracking-tighter mb-1">115 <span className="text-2xl text-primary">kg</span></div>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest">+5% este mês</p>
                            </div>
                        ) : (
                            <div 
                                onClick={() => setSimulated1RM(true)}
                                className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl group hover:border-primary/20 transition-colors cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Activity className="w-8 h-8 text-gray-600" />
                                </div>
                                <p className="text-gray-500 text-sm font-medium px-6">
                                    Adicionar / Selecionar Exercício para Previsão 1RM
                                </p>
                            </div>
                        )}

                        <div className="mt-8 space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Capacidade Aeróbica</span>
                                    <span className="text-xs font-bold text-primary">Excelente</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-[85%] h-full bg-primary" />
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Resistência Muscular</span>
                                    <span className="text-xs font-bold text-blue-400">Acima da Média</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-[72%] h-full bg-blue-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
