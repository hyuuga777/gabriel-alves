'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  User, 
  Flame, 
  Dumbbell, 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  History, 
  Play, 
  CheckCircle2, 
  Trophy, 
  Clock, 
  Target, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  MessageSquare, 
  LogOut,
  Activity,
  Weight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MOCK_ALUNO, MOCK_ASSINATURA, MOCK_TREINOS, MOCK_EVOLUCAO } from '@/lib/mock-db';

// ── Animações ──────────────────────────────────────────────────────────────
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ── Tooltip customizado ────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-2xl">
      <p className="text-gray-400">{label}</p>
      <p className="text-white font-bold mt-0.5">{payload[0].value} kg</p>
    </div>
  );
}

// ── Glassmorphism card ─────────────────────────────────────────────────────
function GlassCard({
  children,
  className = '',
  accentColor = 'transparent',
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/8 ${className}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 100%)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {accentColor !== 'transparent' && (
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
      )}
      {children}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function AlunoDashboard() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/aluno/perfil')
      .then(r => r.json())
      .then(d => {
        if (!d.error) setProfileData(d);
      })
      .catch(console.error);
  }, []);

  const pesoRecente = MOCK_EVOLUCAO[MOCK_EVOLUCAO.length - 1].peso;
  const pesoAntigo = MOCK_EVOLUCAO[0].peso;
  const diff = +(pesoRecente - pesoAntigo).toFixed(1);
  const isLoss = diff < 0;
  const proximoTreino = MOCK_TREINOS[0];

  const assignedStatus = profileData?.assinatura?.status || MOCK_ASSINATURA.status;
  const assignedPlan = profileData?.assinatura?.plano?.nome || MOCK_ASSINATURA.plano;

  const badgeColors =
    assignedStatus === 'ATIVA'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';

  // Dados do gráfico: últimas 6 evoluções
  const chartData = [...MOCK_EVOLUCAO].slice(-6).map((p) => ({
    data: new Date(p.data).toLocaleDateString('pt-BR', { month: 'short' }),
    peso: p.peso,
    gordura: p.gorduraPercentual,
  }));

  const STATS = [
    {
      label: 'Treinos/Semana',
      value: '4',
      sub: '/7 dias',
      Icon: Activity,
      color: '#7c3aed',
    },
    {
      label: 'Peso Atual',
      value: String(pesoRecente),
      sub: 'kg',
      Icon: Weight,
      color: '#3b82f6',
    },
    {
      label: 'Progresso',
      value: `${diff > 0 ? '+' : ''}${diff}`,
      sub: 'kg',
      Icon: isLoss ? TrendingDown : TrendingUp,
      color: isLoss ? '#10b981' : '#f87171',
    },
    {
      label: 'Próx. Cobrança',
      value: new Date(MOCK_ASSINATURA.proximaCobranca).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      }),
      sub: '',
      Icon: Calendar,
      color: '#f59e0b',
    },
  ];

  const userName = profileData?.name || session?.user?.name || 'Aluno';

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-background/75 backdrop-blur-xl border-b border-white/8 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <User className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Bem-vindo de volta,</p>
            <h1 className="font-bold text-sm flex items-center gap-2 text-white">
              {userName}
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${badgeColors}`}>
                {assignedPlan} · {assignedStatus}
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500">Sequência</p>
            <p className="text-sm font-bold text-amber-400">7 dias 🔥</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="lg:hidden w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-colors ml-2"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 md:px-6 py-8 max-w-5xl mx-auto space-y-6"
      >

        {/* ── Stats 2×2 grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s) => {
            const Icon = s.Icon;
            return (
              <motion.div key={s.label} variants={item}>
                <GlassCard accentColor={s.color} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                    <span className="text-[11px] text-gray-400 font-medium">{s.label}</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white tabular-nums">
                    {s.value}
                    {s.sub && <span className="text-sm font-normal text-gray-400 ml-0.5">{s.sub}</span>}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* ── Próximo Treino Banner ── */}
        <motion.div variants={item}>
          <Link href={`/aluno/treinos/${proximoTreino.id}`} className="block group">
            <div
              className="relative overflow-hidden rounded-2xl p-6 border border-violet-500/25 cursor-pointer transition-all duration-300 group-hover:border-violet-500/50 group-hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.04) 100%)',
              }}
            >
              {/* Glow */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-violet-600 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500" />

              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-[11px] font-bold text-violet-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Seu Próximo Treino
                  </p>
                  <h2 className="text-xl md:text-2xl font-black text-white mb-1">{proximoTreino.titulo}</h2>
                  <p className="text-sm text-gray-400">{proximoTreino.descricao}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center shadow-[0_0_28px_rgba(124,58,237,0.5)] shrink-0 ml-4 group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Gráfico Evolução ── */}
        <motion.div variants={item}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-white">Evolução do Peso</h3>
                <p className="text-xs text-gray-500 mt-0.5">últimos 6 registros</p>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: isLoss ? 'rgba(16,185,129,0.15)' : 'rgba(248,113,113,0.15)',
                  color: isLoss ? '#10b981' : '#f87171',
                }}
              >
                {diff > 0 ? '+' : ''}{diff} kg total
              </span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pesoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="data" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}kg`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="peso"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    fill="url(#pesoGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#7c3aed', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Programação da Semana ── */}
        <motion.div variants={item}>
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-white">Sua Programação</h3>
              <Link href="/aluno/treinos" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Ver todos →
              </Link>
            </div>
            <div className="space-y-2">
              {MOCK_TREINOS.map((treino, idx) => (
                <motion.div
                  key={treino.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.07 }}
                >
                  <Link href={`/aluno/treinos/${treino.id}`}>
                    <div className="flex justify-between items-center p-4 rounded-xl border border-white/6 bg-white/4 hover:bg-white/8 hover:border-violet-500/20 transition-all duration-200 group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-600/15 flex items-center justify-center">
                          <Dumbbell className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{treino.titulo}</h4>
                          <p className="text-xs text-gray-500">{treino.itens.length} exercícios</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Histórico Composição Corporal ── */}
        <motion.div variants={item}>
          <GlassCard className="p-6">
            <h3 className="font-bold text-white mb-5">Histórico de Composição Corporal</h3>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm text-left min-w-[380px]">
                <thead>
                  <tr className="border-b border-white/8">
                    {['Data', 'Peso', '% Gordura', 'Massa Magra'].map((h) => (
                      <th key={h} className="pb-3 px-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...MOCK_EVOLUCAO].reverse().map((p, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <td className="py-3 px-3 text-gray-400 tabular-nums text-xs">
                        {new Date(p.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white tabular-nums">
                        {p.peso} <span className="text-xs text-gray-500">kg</span>
                      </td>
                      <td className="py-3 px-3 tabular-nums">
                        <span className="text-amber-400 font-medium">{p.gorduraPercentual}%</span>
                      </td>
                      <td className="py-3 px-3 tabular-nums">
                        <span className="text-emerald-400 font-medium">{p.massaMagra}</span>
                        <span className="text-xs text-gray-500 ml-0.5">kg</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

      </motion.main>
    </div>
  );
}
