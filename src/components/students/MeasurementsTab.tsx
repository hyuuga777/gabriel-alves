'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, TrendingDown, TrendingUp, Calendar, Plus, ChevronRight, Scale, Info, X, Trash2, Check } from 'lucide-react';
import { 
    ResponsiveContainer, 
    AreaChart,
    Area,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
} from 'recharts';
import { BodyFatCalculator } from './BodyFatCalculator';

interface MeasurementsTabProps {
    studentId?: string;
}

const BODY_PARTS = [
    'Braço (Contraído)',
    'Tórax (Peitoral)',
    'Abdomen (Cintura)',
    'Coxa (Fêmur)',
    'Panturrilha',
    'Quadril',
    'Cintura',
];

// Default empty state for circumferences
const DEFAULT_CIRCUMFERENCES = [
    { label: 'Braço (Contraído)', value: null, unit: 'cm', change: '0.0', key: 'braco_contraido' },
    { label: 'Tórax (Peitoral)', value: null, unit: 'cm', change: '0.0', key: 'torax_peitoral' },
    { label: 'Abdomen (Cintura)', value: null, unit: 'cm', change: '0.0', key: 'abdomen_cintura' },
    { label: 'Coxa (Fêmur)', value: null, unit: 'cm', change: '0.0', key: 'coxa_femur' },
    { label: 'Panturrilha', value: null, unit: 'cm', change: '0.0', key: 'panturrilha' },
];

export function MeasurementsTab({ studentId }: MeasurementsTabProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form state
    const [formParteCorpo, setFormParteCorpo] = useState(BODY_PARTS[0]);
    const [formValor, setFormValor] = useState('');
    const [formPeso, setFormPeso] = useState('');

    // Data state
    const [measurements, setMeasurements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<any[]>([]);
    const [circumferences, setCircumferences] = useState(DEFAULT_CIRCUMFERENCES);
    const [latestStats, setLatestStats] = useState<{ peso: number | null; gordura: number | null; massaMagra: number | null }>({
        peso: null, gordura: null, massaMagra: null
    });
    const [studentProfile, setStudentProfile] = useState<{ idade?: number, genero?: string }>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            return;
        }
        fetchMeasurements();
    }, [studentId]);

    const fetchMeasurements = async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${studentId}/measurements`);
            if (res.ok) {
                const data = await res.json();
                const list: any[] = data.measurements || [];
                setMeasurements(list);
                processData(list);
            }
            // Fetch student profile basic info for age/gender
            const profileRes = await fetch(`/api/admin/users/${studentId}`);
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                const nasc = profileData.profile?.dataNascimento;
                let idade = 30;
                if (nasc) {
                    const diff = Date.now() - new Date(nasc).getTime();
                    idade = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
                }
                setStudentProfile({ 
                    idade, 
                    genero: profileData.profile?.sexo || 'masculino' 
                });
            }
        } catch (e) {
            console.error("Error fetching measurements:", e);
        } finally {
            setLoading(false);
        }
    };

    const processData = (list: any[]) => {
        if (list.length === 0) return;

        // Build chart data from peso history
        const chartEntries = list
            .filter((m: any) => m.peso)
            .slice(0, 6)
            .reverse()
            .map((m: any) => ({
                date: new Date(m.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
                weight: m.peso,
                fat: m.percentualGordura,
                muscle: m.massaMagra ?? (m.bioimpedancia as any)?.massaMagra,
            }));
        if (chartEntries.length > 0) setChartData(chartEntries);

        // Latest stats
        const withPeso = list.find((m: any) => m.peso);
        if (withPeso) {
            setLatestStats({
                peso: withPeso.peso,
                gordura: withPeso.percentualGordura,
                massaMagra: withPeso.massaMagra ?? (withPeso.bioimpedancia as any)?.massaMagra ?? null,
            });
        }

        // Build circumferences from the most recent measurement that has perimetros
        const withPerimetros = list.find((m: any) => m.perimetros && Object.keys(m.perimetros).length > 0);
        if (withPerimetros) {
            const perimetros = withPerimetros.perimetros as Record<string, number>;
            setCircumferences(prev => prev.map(circ => {
                // Try to find matching key
                const matchKey = Object.keys(perimetros).find(k =>
                    circ.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_')
                        .includes(k.replace(/_+/g, '_'))
                    || k.includes(circ.key.split('_')[0])
                );
                if (matchKey && perimetros[matchKey]) {
                    return { ...circ, value: perimetros[matchKey] };
                }
                // Direct key match attempts
                const directKey = Object.keys(perimetros).find(k =>
                    circ.label.toLowerCase().includes(k.replace(/_/g, ' ').toLowerCase().split(' ')[0])
                );
                if (directKey && perimetros[directKey]) {
                    return { ...circ, value: perimetros[directKey] };
                }
                return circ;
            }));
        }
    };

    const handleSaveMeasurement = async () => {
        if (!studentId || !formValor) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${studentId}/measurements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parteCorpo: formParteCorpo,
                    valor: parseFloat(formValor),
                    unit: 'cm',
                    ...(formPeso && { peso: parseFloat(formPeso) }),
                })
            });
            if (res.ok) {
                setSaveSuccess(true);
                setFormValor('');
                setFormPeso('');
                await fetchMeasurements();
                setTimeout(() => {
                    setSaveSuccess(false);
                    setIsAddModalOpen(false);
                }, 1200);
            }
        } catch (e) {
            console.error("Error saving measurement:", e);
        } finally {
            setIsSaving(false);
        }
    };

    const Portals = () => {
        if (!mounted) return null;
        return createPortal(
            <>
                {/* Modal de Adicionar Medida */}
                <AnimatePresence>
                    {isAddModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={(e) => { if (e.target === e.currentTarget) setIsAddModalOpen(false); }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 10 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 10 }}
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
                                        <select
                                            value={formParteCorpo}
                                            onChange={(e) => setFormParteCorpo(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none appearance-none cursor-pointer"
                                        >
                                            {BODY_PARTS.map(part => (
                                                <option key={part} value={part}>{part}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Valor (cm)</label>
                                        <input
                                            type="number"
                                            placeholder="0.0"
                                            step="0.1"
                                            value={formValor}
                                            onChange={(e) => setFormValor(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Peso Corporal (kg) <span className="text-gray-600 normal-case tracking-normal">(opcional)</span></label>
                                        <input
                                            type="number"
                                            placeholder="0.0"
                                            step="0.1"
                                            value={formPeso}
                                            onChange={(e) => setFormPeso(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveMeasurement}
                                        disabled={!formValor || isSaving}
                                        className="w-full bg-primary text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-primary/90 transition-colors mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {saveSuccess ? (
                                            <><Check className="w-4 h-4" /> Salvo!</>
                                        ) : isSaving ? 'Salvando...' : 'Salvar Medida'}
                                    </button>
                                    {!studentId && (
                                        <p className="text-xs text-amber-400 text-center">⚠️ Aluno não identificado — medidas não serão salvas.</p>
                                    )}
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
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={(e) => { if (e.target === e.currentTarget) setIsHistoryModalOpen(false); }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="bg-[#111111] border border-white/10 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
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
                                    {measurements.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <Ruler className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p className="text-sm">Nenhuma medida registrada ainda.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Weight history */}
                                            {measurements.some((m: any) => m.peso) && (
                                                <>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Composição Corporal</p>
                                                    <div className="overflow-x-auto rounded-2xl border border-white/5 mb-8">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="bg-white/[0.03] border-b border-white/5">
                                                                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Data</th>
                                                                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Peso</th>
                                                                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">% Gordura</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-white/5">
                                                                {measurements.filter((m: any) => m.peso).map((row: any, i: number) => (
                                                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                                        <td className="px-5 py-4 font-bold text-white">
                                                                            {new Date(row.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                        </td>
                                                                        <td className="px-5 py-4 text-gray-300">{row.peso ? `${row.peso} kg` : '—'}</td>
                                                                        <td className="px-5 py-4">
                                                                            {row.percentualGordura ? (
                                                                                <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold">{row.percentualGordura}%</span>
                                                                            ) : '—'}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )}

                                            {/* Circumferences history */}
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Circunferências</p>
                                            <div className="overflow-x-auto rounded-2xl border border-white/5">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-white/[0.03] border-b border-white/5">
                                                            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Data</th>
                                                            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Medida</th>
                                                            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Valor</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {measurements.filter((m: any) => m.parteCorpo || (m.perimetros && Object.keys(m.perimetros).length > 0)).map((row: any, i: number) => {
                                                            if (row.parteCorpo) {
                                                                return (
                                                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                                        <td className="px-5 py-4 font-bold text-white text-sm">
                                                                            {new Date(row.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                        </td>
                                                                        <td className="px-5 py-4 text-gray-300">{row.parteCorpo}</td>
                                                                        <td className="px-5 py-4">
                                                                            <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-bold">{row.valor} cm</span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                            // Show each perimetro entry
                                                            return Object.entries(row.perimetros || {}).map(([key, val]: any, j: number) => (
                                                                <tr key={`${i}-${j}`} className="hover:bg-white/[0.02] transition-colors">
                                                                    <td className="px-5 py-4 font-bold text-white text-sm">
                                                                        {new Date(row.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                    </td>
                                                                    <td className="px-5 py-4 text-gray-300 capitalize">{key.replace(/_/g, ' ')}</td>
                                                                    <td className="px-5 py-4">
                                                                        <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-bold">{val} cm</span>
                                                                    </td>
                                                                </tr>
                                                            ));
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
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
            </>,
            document.body
        );
    };

    const displayChartData = chartData.length > 0 ? chartData : [
        { date: 'Sem dados', weight: 0 }
    ];

    return (
        <div className="space-y-8">
            <Portals />
            {/* Main Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Peso Corporal', value: latestStats.peso ? `${latestStats.peso} kg` : '—', change: '', trend: 'down', icon: Scale, color: 'text-primary' },
                    { label: 'Gordura Corporal', value: latestStats.gordura ? `${latestStats.gordura}%` : '—', change: '', trend: 'down', icon: TrendingDown, color: 'text-red-400' },
                    { label: 'Massa Magra', value: latestStats.massaMagra ? `${latestStats.massaMagra} kg` : '—', change: '', trend: 'up', icon: TrendingUp, color: 'text-blue-400' },
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
                        </div>
                        
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-4xl font-black text-white tracking-tighter leading-none">
                            {loading ? <span className="text-gray-600 text-2xl">Carregando...</span> : item.value}
                        </p>
                        {!loading && item.value === '—' && (
                            <p className="text-gray-600 text-xs mt-2">Adicione uma medida</p>
                        )}
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
                            <p className="text-gray-500 text-sm mt-1">Histórico de medições do aluno</p>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        {chartData.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                                <Scale className="w-12 h-12 mb-3 opacity-20" />
                                <p className="text-sm font-medium">Nenhum dado de peso registrado</p>
                                <p className="text-xs mt-1 opacity-60">Adicione medidas com peso para ver o gráfico</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={displayChartData}>
                                    <defs>
                                        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00CACA" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#00CACA" stopOpacity={0} />
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
                                        formatter={(value: any) => [`${value} kg`, 'Peso']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="weight" 
                                        stroke="#00CACA" 
                                        strokeWidth={4} 
                                        fillOpacity={1} 
                                        fill="url(#weightGrad)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="mt-8 flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary flex-shrink-0">
                            <Info className="w-5 h-5" />
                        </div>
                        <p className="text-gray-400 text-sm italic">
                            {measurements.length > 0
                                ? `${measurements.length} registro(s) de medidas encontrado(s). Próxima avaliação recomendada em 30 dias.`
                                : 'Nenhuma medida registrada. Clique em + para adicionar a primeira medida do aluno.'}
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

                        {loading ? (
                            <div className="space-y-2">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {circumferences.map((item, i) => (
                                    <div 
                                        key={item.label}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.08] transition-all cursor-pointer group/item border border-transparent hover:border-white/10"
                                    >
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
                                            <p className="text-lg font-black text-white leading-none">
                                                {item.value !== null ? (
                                                    <>{item.value} <span className="text-xs text-gray-500 font-medium">{item.unit}</span></>
                                                ) : (
                                                    <span className="text-gray-600 text-sm font-medium">Sem dados</span>
                                                )}
                                            </p>
                                        </div>
                                        {item.value !== null && (
                                            <div className="px-2 py-1 rounded-lg text-[10px] font-black bg-primary/10 text-primary">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

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

            {/* Calculadora de % Gordura (Pollock 7) */}
            {studentId && (
                <BodyFatCalculator 
                    studentId={studentId} 
                    age={studentProfile.idade} 
                    gender={studentProfile.genero} 
                    onSave={fetchMeasurements}
                />
            )}
        </div>
    );
}
