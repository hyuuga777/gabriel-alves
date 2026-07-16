'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, TrendingDown, TrendingUp, Calendar, Plus, ChevronRight, Scale, Info, X } from 'lucide-react';
import { 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Area, 
    AreaChart 
} from 'recharts';

const MEASUREMENT_HISTORY = [
    { date: 'Jan', weight: 85.0, fat: 18.5, muscle: 40.2 },
    { date: 'Fev', weight: 83.8, fat: 17.8, muscle: 40.8 },
    { date: 'Mar', weight: 82.4, fat: 16.5, muscle: 41.5 },
];

export function MeasurementsTab() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            {/* Main Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Peso Corporal', value: '82.4 kg', change: '-1.2kg', trend: 'down', icon: Scale, color: 'text-primary' },
                    { label: 'Gordura Corporal', value: '16.5%', change: '-0.8%', trend: 'down', icon: TrendingDown, color: 'text-red-400' },
                    { label: 'Massa Magra', value: '41.5 kg', change: '+0.4kg', trend: 'up', icon: TrendingUp, color: 'text-blue-400' },
                ].map((item, i) => (
                    <motion.div
                        key={item.label}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-primary/5 transition-colors" />
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-black ${item.trend === 'down' ? 'text-green-500' : 'text-primary'}`}>
                                {item.change}
                            </div>
                        </div>
                        
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-4xl font-black text-white tracking-tighter leading-none">{item.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weight Evolution Chart */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <TrendingDown className="w-6 h-6 text-primary" />
                                Evolução de Peso
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Comparação trimestral de progresso</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">P / M / G</button>
                            <button className="px-4 py-2 bg-primary text-black rounded-xl text-xs font-bold shadow-lg shadow-primary/20">3 Meses</button>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MEASUREMENT_HISTORY}>
                                <defs>
                                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00FF00" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#00FF00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#444" 
                                    fontSize={12} 
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis 
                                    domain={['dataMin - 2', 'dataMax + 2']} 
                                    hide 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0a0a0a', 
                                        border: '1px solid #ffffff10', 
                                        borderRadius: '20px',
                                        padding: '12px 16px',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="weight" 
                                    stroke="#00FF00" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#weightGrad)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary flex-shrink-0">
                            <Info className="w-5 h-5" />
                        </div>
                        <p className="text-gray-400 text-sm italic">
                            O aluno manteve consistência nas medições matinais. Próxima avaliação física recomendada para daqui a 15 dias.
                        </p>
                    </div>
                </div>

                {/* Sidebar Measurements List */}
                <div className="space-y-6">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-primary" />
                                Circunferências
                            </h3>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {[
                                { label: 'Braço Contraído', value: '42.5', unit: 'cm', change: '+0.5' },
                                { label: 'Tórax (Peitoral)', value: '112.0', unit: 'cm', change: '+2.0' },
                                { label: 'Abdomen (Cintura)', value: '84.5', unit: 'cm', change: '-1.5' },
                                { label: 'Coxa (Fêmur)', value: '65.2', unit: 'cm', change: '+1.2' },
                                { label: 'Panturrilha', value: '41.0', unit: 'cm', change: '0.0' },
                            ].map((item, i) => (
                                <div 
                                    key={item.label}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.08] transition-all cursor-pointer group/item border border-transparent hover:border-white/10"
                                >
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
                                        <p className="text-lg font-black text-white leading-none">
                                            {item.value} <span className="text-xs text-gray-500 font-medium">{item.unit}</span>
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${item.change.startsWith('-') ? 'bg-green-500/10 text-green-500' : item.change === '0.0' ? 'bg-gray-500/10 text-gray-500' : 'bg-primary/10 text-primary'}`}>
                                        {item.change}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => setIsHistoryModalOpen(true)}
                            className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group/btn"
                        >
                            Ver Histórico Completo
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Adicionar Medida */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-[#111111] border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-primary" />
                                    Nova Medida
                                </h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Parte do Corpo</label>
                                    <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none appearance-none">
                                        <option>Braço (Contraído)</option>
                                        <option>Tórax (Peitoral)</option>
                                        <option>Abdomen (Cintura)</option>
                                        <option>Coxa</option>
                                        <option>Panturrilha</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Valor (cm)</label>
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        step="0.1"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-primary outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        alert('Medida salva (visualmente persistida em breve)!');
                                    }}
                                    className="w-full bg-primary text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-primary/90 transition-colors mt-4"
                                >
                                    Salvar Medida
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Modal Histórico Completo */}
            <AnimatePresence>
                {isHistoryModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#111111] border border-white/10 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] flex-shrink-0">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Ruler className="w-5 h-5 text-primary" />
                                    Histórico Completo de Medidas
                                </h2>
                                <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Circunferências por mês */}
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Composição Corporal</p>
                                <div className="overflow-x-auto rounded-2xl border border-white/5">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-white/[0.03] border-b border-white/5">
                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Mês</th>
                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Peso</th>
                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">% Gordura</th>
                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Massa Magra</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {MEASUREMENT_HISTORY.map((row, i) => (
                                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-4 font-bold text-white">{row.date}</td>
                                                    <td className="px-5 py-4 text-gray-300">{row.weight} kg</td>
                                                    <td className="px-5 py-4">
                                                        <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold">{row.fat}%</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold">{row.muscle} kg</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Circunferências */}
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">Circunferências</p>
                                <div className="overflow-x-auto rounded-2xl border border-white/5">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-white/[0.03] border-b border-white/5">
                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Medida</th>
                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Valor Atual</th>
                                                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Variação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {[
                                                { label: 'Braço Contraído', value: '42.5', unit: 'cm', change: '+0.5' },
                                                { label: 'Tórax (Peitoral)', value: '112.0', unit: 'cm', change: '+2.0' },
                                                { label: 'Abdomen (Cintura)', value: '84.5', unit: 'cm', change: '-1.5' },
                                                { label: 'Coxa (Fêmur)', value: '65.2', unit: 'cm', change: '+1.2' },
                                                { label: 'Panturrilha', value: '41.0', unit: 'cm', change: '0.0' },
                                            ].map((item, i) => (
                                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-4 font-bold text-white">{item.label}</td>
                                                    <td className="px-5 py-4 text-gray-300">{item.value} {item.unit}</td>
                                                    <td className="px-5 py-4">
                                                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                                                            item.change.startsWith('-') 
                                                                ? 'bg-green-500/10 text-green-400' 
                                                                : item.change === '0.0' 
                                                                    ? 'bg-gray-500/10 text-gray-400' 
                                                                    : 'bg-primary/10 text-primary'
                                                        }`}>{item.change} {item.unit}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex-shrink-0">
                                <button
                                    onClick={() => setIsHistoryModalOpen(false)}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-colors text-sm"
                                >
                                    Fechar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
