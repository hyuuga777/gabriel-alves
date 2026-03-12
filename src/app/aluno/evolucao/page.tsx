'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentEvolutionPage() {
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvolution() {
            try {
                const res = await fetch('/api/aluno/evolucao');
                if (res.ok) {
                    const data = await res.json();
                    setAssessments(data);
                }
            } catch (error) {
                console.error("Failed to fetch evolution data");
            } finally {
                setLoading(false);
            }
        }
        fetchEvolution();
    }, []);

    // Preparar dados para o gráfico (formatar data)
    const chartData = assessments
        .filter(a => a.peso)
        .map(a => ({
            date: new Date(a.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            rawDate: new Date(a.data), // para sort se precisar
            weight: a.peso
        }));

    // Inverter array para tabela (mais recente primeiro)
    const tableData = [...assessments].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 px-6 py-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Minha Evolução</h1>
                <p className="text-gray-400 text-sm">Acompanhe seu progresso físico.</p>
            </header>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Carregando dados...</div>
            ) : assessments.length === 0 ? (
                <div className="text-center py-12 bg-[#111] rounded-xl border border-white/5 border-dashed">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-gray-400">Nenhuma avaliação registrada ainda.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Weight Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111] border border-white/5 p-6 rounded-2xl"
                    >
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Peso Corporal (kg)
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#666"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={['dataMin - 2', 'dataMax + 2']}
                                        allowDecimals={true}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: any) => [`${value} kg`, 'Peso']}
                                        labelStyle={{ color: '#888', marginBottom: '4px' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#4ade80"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#4ade80', strokeWidth: 0 }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* History Table */}
                    <div>
                        <h3 className="font-bold text-white mb-4 text-lg">Histórico de Avaliações</h3>
                        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5 bg-[#1a1a1a] text-left">
                                        <th className="p-4 text-xs font-medium text-gray-400 uppercase">Data</th>
                                        <th className="p-4 text-xs font-medium text-gray-400 uppercase">Tipo</th>
                                        <th className="p-4 text-right text-xs font-medium text-gray-400 uppercase">Peso</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {tableData.map((a) => (
                                        <tr key={a.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-sm text-white flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-600" />
                                                {new Date(a.data).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 capitalize">
                                                    {a.tipo}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-sm font-bold text-white">
                                                {a.peso ? `${a.peso} kg` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
