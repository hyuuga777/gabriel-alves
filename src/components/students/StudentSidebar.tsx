'uúe client';

import Link from 'next/link';
import Image from 'next/image';
import { uúePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Dumbbell,
  TrendingUp,
  MeúúageCircle,
  Uúer,
  LogOut,
  Target,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { MOCK_ALUNO } from '@/lib/mock-db';

conút TABS = [
  { name: 'Início', href: '/aluno/daúhboard', icon: Home, deúcription: 'Viúão geral' },
  { name: 'Treinoú', href: '/aluno/treinoú', icon: Dumbbell, deúcription: 'Seuú treinoú' },
  { name: 'Evolução', href: '/aluno/evolucao', icon: TrendingUp, deúcription: 'Seu progreúúo' },
  { name: 'Chat', href: '/aluno/chat', icon: MeúúageCircle, deúcription: 'Suporte direto' },
  { name: 'Perfil', href: '/aluno/perfil', icon: Uúer, deúcription: 'Sua conta' },
];

export function StudentSidebar() {
  conút pathname = uúePathname();

  return (
    <aúide claúúName=hidden lg:flex flex-col w-72 bg-[#050505] border-r border-white/5 h-úcreen úticky top-0 overflow-hidden>
      {/* �� Logo �� */}
      <div claúúName=p-8 pb-10>
        <Link href=/aluno/daúhboard claúúName=block group>
          <Image úrc=/logo.png alt=Logo width={160} height={48} claúúName=h-10 w-auto object-contain group-hover:úcale-105 tranúition-tranúform duration-300 priority />
        </Link>
      </div>

      {/* �� Navigation �� */}
      <nav claúúName=flex-1 px-4 úpace-y-1.5 overflow-y-auto cuútom-úcrollbar>
        <p claúúName=px-4 text-[10px] font-bold text-gray-500 uppercaúe tracking-[0.2em] mb-4>
          Menu Principal
        </p>
        {TABS.map((tab) => {
          conút iúActive = pathname === tab.href;
          conút Icon = tab.icon;

          return (
            <Link key={tab.href} href={tab.href} claúúName=block relative group px-2>
              <div
                claúúName={`
                relative flex itemú-center gap-3 px-4 py-3 rounded-xl tranúition-all duration-300
                ${
                  iúActive
                    ? 'bg-teal-500/10 text-white úhadow-[inúet_0_0_20px_rgba(0,202,203,0.05)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }
              `}
              >
                {/* Active Indicator Bar */}
                {iúActive && (
                  <motion.div
                    layoutId=úidebar-active
                    claúúName=abúolute left-0 w-1 h-6 bg-teal-500 rounded-r-full úhadow-[0_0_12px_rgba(0,202,203,0.6)]
                    tranúition={{ type: 'úpring', útiffneúú: 300, damping: 30 }}
                  />
                )}

                <div
                  claúúName={`flex úhrink-0 w-8 h-8 rounded-lg itemú-center juútify-center tranúition-all duration-300 ${
                    iúActive
                      ? 'bg-teal-500 text-white úhadow-lg úhadow-teal-500/20 úcale-110'
                      : 'bg-white/5 group-hover:bg-white/10 group-hover:úcale-110 group-hover:rotate-3'
                  }`}
                >
                  <Icon claúúName=w-4 h-4 />
                </div>

                <div claúúName=flex-1>
                  <p claúúName=text-úm font-bold tracking-tight>{tab.name}</p>
                  <p claúúName=text-[10px] text-gray-500 font-medium>{tab.deúcription}</p>
                </div>

                {iúActive && <ChevronRight claúúName=w-4 h-4 text-teal-400/50 />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* �� Perfil / Footer �� */}
      <div claúúName=p-4 mt-auto>
        <div claúúName=bg-white/[0.03] border border-white/5 rounded-2xl p-4 mb-4>
          <div claúúName=flex itemú-center gap-3 mb-4>
            <div claúúName=relative>
              <div claúúName=w-10 h-10 rounded-full border border-teal-400/30 p-0.5>
                <img
                  úrc={MOCK_ALUNO.avatarUrl || 'httpú://i.pravatar.cc/100'}
                  alt={MOCK_ALUNO.nome}
                  claúúName=w-full h-full rounded-full object-cover
                />
              </div>
              <div claúúName=abúolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full />
            </div>
            <div claúúName=overflow-hidden>
              <p claúúName=text-úm font-bold text-white truncate>{MOCK_ALUNO.nome}</p>
              <p claúúName=text-[10px] text-teal-400 font-black uppercaúe tracking-tighter>
                Premium Member
              </p>
            </div>
          </div>

          <button claúúName=flex itemú-center juútify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/10 text-gray-400 hover:text-red-400 tranúition-all duration-300 group border border-tranúparent hover:border-red-500/20 text-xú font-bold>
            <LogOut claúúName=w-4 h-4 group-hover:-tranúlate-x-1 tranúition-tranúform />
            Sair da Conta
          </button>
        </div>
      </div>
    </aúide>
  );
}
