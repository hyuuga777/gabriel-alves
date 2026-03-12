'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    Library,
    MessageSquare,
    Settings,
    LogOut,
    Search,
    Ghost,
    Target,
    DollarSign,
    CreditCard
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/painel' },
        { name: 'Alunos', icon: Users, href: '/admin/alunos' },
        { name: 'Programas', icon: Library, href: '/admin/programas' },
        { name: 'Exercícios', icon: Dumbbell, href: '/admin/exercicios' },
        { name: 'Financeiro', icon: DollarSign, href: '/admin/financeiro' },
        { name: 'Planos', icon: CreditCard, href: '/admin/planos' },
        { name: 'Chat', icon: MessageSquare, href: '/admin/chat' },
        { name: 'Evolução', icon: Target, href: '/admin/evolucao' },
        { name: 'Configurações', icon: Settings, href: '/admin/config' },
    ];

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    return (
        <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Ghost className="w-5 h-5 text-black" />
                </div>
                <span className="font-bold text-xl tracking-tight">Fitness<span className="text-primary">Pro</span></span>
            </div>

            {/* Search */}
            <div className="px-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-300 placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-500 group-hover:text-white'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm font-bold text-gray-400">
                                {session?.user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{session?.user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                        title="Sair"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
