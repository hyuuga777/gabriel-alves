'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, CreditCard, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinanceiroPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('6m');
    const [stats, setStats] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [statsRes, transRes] = await Promise.all([
                    fetch(`/api/admin/financeiro/stats?period=${selectedPeriod}`),
                    fetch('/api/admin/financeiro/transactions')
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (transRes.ok) setTransactions(await transRes.json());
            } catch (error) {
                console.error("Erro ao carregar dados financeiros", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [selectedPeriod]);

    if (loading && !stats) {
        return <div className="p-8 text-center text-gray-500">Carregando dados financeiros...</div>;
    }

    const periods = [
        { label: '1 mês', value: '1m' },
        { label: '3 meses', value: '3m' },
        { label: '6 meses', value: '6m' },
        { label: '1 ano', value: '1y' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Financeiro</h1>
                    <p className="text-gray-400 text-sm">Acompanhe o desempenho financeiro do seu negócio.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#111] border border-white/5 rounded-lg p-1">
                    {periods.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setSelectedPeriod(p.value)}
                            className={`px-3 py-1.5 text-xs font-medium rounded shadow-sm transition-colors ${selectedPeriod === p.value
                                ? 'bg-primary text-black'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Receita Total"
                    value={`R$ ${stats?.totalRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    trend="+12.5%"
                    trendUp={true}
                    color="text-primary"
                    bg="bg-primary/10"
                />
                <KPICard
                    title="MRR (Mensal)"
                    value={`R$ ${stats?.mrr?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={TrendingUp}
                    trend="+5.2%"
                    trendUp={true}
                    color="text-primary"
                    bg="bg-primary/10"
                />
                <KPICard
                    title="Assinantes Ativos"
                    value={stats?.activeSubscribers}
                    icon={Users}
                    trend="+2"
                    trendUp={true}
                    color="text-primary"
                    bg="bg-primary/10"
                />
                <KPICard
                    title="Ticket Médio"
                    value={`R$ ${stats?.ticketMedio?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={CreditCard}
                    trend="-1.5%"
                    trendUp={false}
                    color="text-orange-400"
                    bg="bg-orange-400/10"
                />
            </div>

            {/* Main Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-white">Evolução da Receita</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary/50"></div> Receita</span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#666"
                                    fontSize={12}
                                    tickMargin={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#666"
                                    fontSize={12}
                                    tickFormatter={(value) => `R$${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#999', marginBottom: '4px' }}
                                    formatter={(value: any) => [`R$ ${value.toLocaleString()}`, 'Receita']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--color-primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <h3 className="font-bold text-lg text-white mb-6">Transações Recentes</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] lg:max-h-none">
                        {transactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                        t.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{t.user.name}</p>
                                        <p className="text-xs text-gray-500">{t.plan} • {new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${t.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                        t.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-gray-400 hover:text-white transition-colors border-t border-white/5">
                        Ver todas as transações
                    </button>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon: Icon, trend, trendUp, color, bg }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <Icon className="w-24 h-24" />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trend}
                    </div>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </motion.div>
    );
}
