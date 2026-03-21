'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Dumbbell,
  TrendingUp,
  MessageCircle,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { MOCK_ALUNO } from '@/lib/mock-db';

const TABS = [
  { name: 'Início', href: '/aluno/dashboard', icon: Home, description: 'Visão geral' },
  { name: 'Treinos', href: '/aluno/treinos', icon: Dumbbell, description: 'Seus treinos' },
  { name: 'Evolução', href: '/aluno/evolucao', icon: TrendingUp, description: 'Seu progresso' },
  { name: 'Chat', href: '/aluno/chat', icon: MessageCircle, description: 'Suporte direto' },
  { name: 'Perfil', href: '/aluno/perfil', icon: User, description: 'Sua conta' },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#050505] border-r border-white/5 h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="p-8 pb-10">
        <Link href="/aluno/dashboard" className="block group">
          <Image
            src="https://ogabrielalves.com/logo.png"
            alt="Logo"
            width={160}
            height={48}
            className="h-[43px] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
          Menu Principal
        </p>
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link key={tab.href} href={tab.href} className="block relative group px-2">
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-teal-500/10 text-white shadow-[inset_0_0_20px_rgba(0,202,203,0.05)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-teal-500 rounded-r-full shadow-[0_0_12px_rgba(0,202,203,0.6)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <div
                  className={`flex shrink-0 w-8 h-8 rounded-lg items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20 scale-110'
                      : 'bg-white/5 group-hover:bg-white/10 group-hover:scale-110 group-hover:rotate-3'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold tracking-tight">{tab.name}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{tab.description}</p>
                </div>

                {isActive && <ChevronRight className="w-4 h-4 text-teal-400/50" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Perfil / Footer */}
      <div className="p-4 mt-auto">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border border-teal-400/30 p-0.5">
                <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Gabriel Alves</p>
              <p className="text-[10px] text-teal-400 font-black uppercase tracking-tighter">
                Aluno VIP
              </p>
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-300 group border border-transparent hover:border-red-500/20 text-xs font-bold">
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sair da Conta
          </button>
        </div>
      </div>
    </aside>
  );
}
