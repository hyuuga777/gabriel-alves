'use client';

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

// ── Dados mock (serão substituídos por fetch real) ──────────────────────────
const REVENUE_DATA = [
  { mes: 'Jul', receita: 3200 },
  { mes: 'Ago', receita: 3800 },
  { mes: 'Set', receita: 2900 },
  { mes: 'Out', receita: 4100 },
  { mes: 'Nov', receita: 4800 },
  { mes: 'Dez', receita: 4250 },
];

const KPI = [
  {
    label: 'Alunos Ativos',
    value: '42',
    icon: Users,
    accent: '#7c3aed',
    accentBg: 'rgba(124,58,237,0.12)',
    trend: '+3 este mês',
    trendUp: true,
  },
  {
    label: 'Faturamento Mensal',
    value: 'R$ 4.250',
    icon: DollarSign,
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.12)',
    trend: '+12% vs mês anterior',
    trendUp: true,
  },
  {
    label: 'Inadimplentes',
    value: '3',
    icon: AlertTriangle,
    accent: '#ef4444',
    accentBg: 'rgba(239,68,68,0.12)',
    trend: 'Atenção requerida',
    trendUp: false,
  },
];

const ATIVIDADES = [
  {
    id: 1,
    texto: 'João finalizou o Treino A',
    tempo: 'há 10 min',
    Icon: CheckCircle2,
    cor: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
  },
  {
    id: 2,
    texto: 'Maria renovou o plano Trimestral',
    tempo: 'há 2 horas',
    Icon: RotateCw,
    cor: '#7c3aed',
    bg: 'rgba(124,58,237,0.12)',
  },
  {
    id: 3,
    texto: 'Pedro tem avaliação pendente',
    tempo: 'há 5 horas',
    Icon: AlertTriangle,
    cor: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },
  {
    id: 4,
    texto: 'Ana iniciou plano Mensal',
    tempo: 'ontem',
    Icon: TrendingUp,
    cor: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
  },
];

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
        {KPI.map((kpi) => {
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

              {/* Contesdo */}
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
            <span className="text-xs bg-emerald-500/15 text-emerald-400 font-semibold px-2.5 py-1 rounded-full">
              +12% ↑
            </span>
          </div>

          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="mes"
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
                  dataKey="receita"
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
            {ATIVIDADES.map((a, idx) => {
              const Icon = a.Icon;
              const isLast = idx === ATIVIDADES.length - 1;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className="flex gap-3 relative"
                >
                  {/* Linha de timeline */}
                  {!isLast && (
                    <div className="absolute left-[18px] top-10 bottom-[-4px] w-px bg-white/6" />
                  )}

                  {/* Ícone */}
                  <div
                    className="shrink-0 mt-1 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: a.bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: a.cor }} />
                  </div>

                  {/* Texto */}
                  <div className="pb-5">
                    <p className="text-sm text-gray-200 font-medium leading-snug">
                      {a.texto}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.tempo}</p>
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
