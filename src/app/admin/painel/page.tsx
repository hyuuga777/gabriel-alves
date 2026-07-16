'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  History,
  RotateCw,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// ── Types ──────────────────────────────────────────────────────────
interface DashboardStats {
  kpis: {
    activeStudents: number;
    totalRevenue: number;
    pendingAssessments: number;
    latePayments: number;
  };
  revenueChart: Array<{ name: string; value: number }>;
  activities: Array<{
    id: string;
    type: string;
    user: string;
    avatar: string | null;
    description: string;
    time: string;
    status: string;
  }>;
}

// ── Variantes de animação ──────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ── Componente principal ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/dashboard/stats');
        if (!res.ok) throw new Error('Falha ao buscar dados');
        const stats = await res.json();
        setData(stats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 p-12 flex flex-col items-center justify-center min-h-[600px]">
        <RotateCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm mt-4 animate-pulse">Sincronizando dados...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-black text-white mt-4 uppercase tracking-tighter">Erro Crítico</h2>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">{error || 'Não foi possível carregar as métricas do sistema.'}</p>
        <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest"
        >
            Tentar Novamente
        </button>
      </div>
    );
  }

  const KPI_CARDS = [
    {
      label: 'Alunos Ativos',
      value: data.kpis.activeStudents.toString(),
      icon: Users,
      accent: '#7c3aed',
      accentBg: 'rgba(124,58,237,0.12)',
      trend: '+0 este mês',
      trendUp: true,
    },
    {
      label: 'Faturamento Total',
      value: `R$ ${data.kpis.totalRevenue.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      accent: '#10b981',
      accentBg: 'rgba(16,185,129,0.12)',
      trend: 'Total acumulado',
      trendUp: true,
    },
    {
      label: 'Pendentes/Atrasados',
      value: (data.kpis.pendingAssessments + data.kpis.latePayments).toString(),
      icon: AlertTriangle,
      accent: '#ef4444',
      accentBg: 'rgba(239,68,68,0.12)',
      trend: `${data.kpis.latePayments} mensalidades`,
      trendUp: false,
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 p-1 md:p-0"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Gerenciamento centralizado de métricas e performance.
          </p>
        </div>
        <div className="flex gap-2">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">LIVE STATUS</span>
            </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              variants={item}
              className="relative overflow-hidden rounded-[32px] border border-white/5 p-8 group transition-all duration-500 hover:border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                style={{ backgroundColor: kpi.accent }}
              />

              <div className="flex justify-between items-start mb-6">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: kpi.accentBg }}
                >
                    <Icon className="w-6 h-6 z-10" style={{ color: kpi.accent }} />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${kpi.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {kpi.trend}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-1">
                  {kpi.label}
                </p>
                <p className="text-4xl font-black text-white tracking-tighter tabular-nums">
                  {kpi.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico */}
        <motion.div
          variants={item}
          className="lg:col-span-2 glass rounded-[40px] p-8 border border-white/5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Receita Líquida</h3>
              <p className="text-sm text-muted-foreground font-medium">Histórico de conversões mensais</p>
            </div>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueChart} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(v) => `R$${v >= 1000 ? (v/1000).toFixed(1)+'k' : v}`}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/80 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl ring-1 ring-white/10 scale-105">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-1">{label}</p>
                          <p className="text-xl font-black text-primary tracking-tighter">
                            R$ {Number(payload[0].value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--primary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Atividades */}
        <motion.div
          variants={item}
          className="glass rounded-[40px] p-8 border border-white/5 flex flex-col h-[500px]"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Log de Atividade</h3>
            <History className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {data.activities.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3">
                    <History className="w-10 h-10" />
                    <p className="text-xs font-bold uppercase tracking-widest">Sem registros</p>
                </div>
            ) : data.activities.map((a, idx) => {
              const getConfig = (type: string) => {
                  switch(type) {
                      case 'payment': return { Icon: DollarSign, color: '#10b981' };
                      case 'workout': return { Icon: CheckCircle2, color: '#7c3aed' };
                      case 'evaluation': return { Icon: TrendingUp, color: '#3b82f6' };
                      default: return { Icon: RotateCw, color: '#6b7280' };
                  }
              };

              const { Icon, color } = getConfig(a.type);
              return (
                <div key={a.id} className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 transition-colors group-hover:border-white/10 relative">
                    <Icon className="w-4 h-4" style={{ color: color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground/90 font-bold leading-tight truncate">
                      <span className="text-primary italic">{a.user}</span> {a.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tighter">
                        {new Date(a.time).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link 
            href="/admin/atividades"
            className="mt-8 w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:bg-white/10 hover:text-white transition-all shadow-inner block text-center"
          >
            Histórico Completo
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
