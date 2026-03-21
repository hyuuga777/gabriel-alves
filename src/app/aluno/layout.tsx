'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Home, Dumbbell, MessageCircle, CreditCard, User, LogOut } from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: 'Home', href: '/aluno/dashboard', icon: Home },
        { name: 'Treinos', href: '/aluno/treinos', icon: Dumbbell },
        { name: 'Chat', href: '/aluno/chat', icon: MessageCircle },
        { name: 'Gerenciar Plano', href: '/aluno/pagamentos', icon: CreditCard },
        { name: 'Perfil', href: '/aluno/perfil', icon: User },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Desktop Sidebar (visible on lg+) */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-[#111] h-screen sticky top-0">
                <div className="p-6 border-b border-white/10">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {tabs.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive
                                    ? 'bg-primary text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 w-full transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 mb-16 lg:mb-0">
                {children}
            </div>

            {/* Mobile Bottom Tab Bar (visible on < lg) */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/10 pb-safe z-50">
                <div className="flex justify-around items-center h-16">
                    {tabs.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500'
                                    }`}
                            >
                                <tab.icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                                <span className="text-[10px] font-medium">{tab.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
