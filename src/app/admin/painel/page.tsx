'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

// ── Tooltip customizado para o gráfico ────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl px-4 py-3 text-sm shadow-2xl">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-white font-bold">
        R$ {(payload[0].value as number).toLocaleString('pt-BR')}
      </p>
    </div>
  );
}

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
      <div className="space-y-8 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <RotateCw className="w-8 h-8 text-violet-500 animate-spin" />
        <p className="text-gray-400 text-sm mt-4">Carregando painel administrativo...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8 p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white mt-4">Erro ao carregar dados</h2>
        <p className="text-gray-400 mt-2">{error || 'Tente recarregar a página.'}</p>
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
      trend: '+0 este mês', // Você pode implementar lógica de tendência no futuro
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
      className="space-y-8"
    >
      {/* ── Header ── */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Visão Geral
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Acompanhe métricas e atividades da sua consultoria.
        </p>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              variants={item}
              className="relative overflow-hidden rounded-2xl border border-white/8 p-6 flex items-start gap-4 group"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Glow blob */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-500"
                style={{ backgroundColor: kpi.accent }}
              />

              {/* Ícone */}
              <div
                className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: kpi.accentBg }}
              >
                <Icon className="w-5 h-5" style={{ color: kpi.accent }} />
              </div>

              {/* Conteúdo */}
              <div className="relative z-10">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                  {kpi.label}
                </p>
                <p className="text-3xl font-extrabold text-white mt-1 tabular-nums">
                  {kpi.value}
                </p>
                <p
                  className="text-xs mt-1.5 flex items-center gap-1"
                  style={{ color: kpi.trendUp ? '#10b981' : '#f87171' }}
                >
                  {kpi.trendUp ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {kpi.trend}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Gráfico + Atividades ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gráfico de Receita */}
        <motion.div
          variants={item}
          className="lg:col-span-2 rounded-2xl border border-white/8 p-6 flex flex-col"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">
                Receita — últimos 6 Meses
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Desempenho de novas assinaturas
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#receitaGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#7c3aed', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* últimas Atividades */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-white/8 p-6 flex flex-col"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white">
              últimas Atividades
            </h2>
            <History className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto pr-1">
            {data.activities.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-12">Nenhuma atividade recente.</p>
            ) : data.activities.map((a, idx) => {
              const itemIsLast = idx === data.activities.length - 1;
              
              // Mapeamento de ícones e cores baseado no tipo
              const getIconProps = (type: string) => {
                switch(type) {
                    case 'payment': return { Icon: DollarSign, cor: '#10b981', bg: 'rgba(16,185,129,0.12)' };
                    case 'workout': return { Icon: CheckCircle2, cor: '#7c3aed', bg: 'rgba(124,58,237,0.12)' };
                    case 'evaluation': return { Icon: TrendingUp, cor: '#3b82f6', bg: 'rgba(59,130,246,0.12)' };
                    default: return { Icon: RotateCw, cor: '#6b7280', bg: 'rgba(255,255,255,0.05)' };
                }
              };

              const { Icon, cor, bg } = getIconProps(a.type);
              
              const formatTime = (time: string) => {
                const date = new Date(time);
                return date.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
              };

              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="flex gap-3 relative"
                >
                  {/* Linha de timeline */}
                  {!itemIsLast && (
                    <div className="absolute left-[18px] top-10 bottom-[-4px] w-px bg-white/6" />
                  )}

                  {/* Ícone */}
                  <div
                    className="shrink-0 mt-1 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: cor }} />
                  </div>

                  {/* Texto */}
                  <div className="pb-5">
                    <p className="text-sm text-gray-200 font-medium leading-snug">
                      <span className="text-violet-400">{a.user}</span> {a.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatTime(a.time)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button className="mt-4 w-full py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200">
            Ver histórico completo
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
