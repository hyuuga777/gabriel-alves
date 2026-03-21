'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    Library,
    DollarSign,
    Settings,
    Menu,
    X,
    LogOut,
    User
} from 'lucide-react';
import { MOCK_ALUNO } from '@/lib/mock-db'; // Using mock user temporarily for the header

const MENU_ITEMS = [
    { name: 'Dashboard', href: '/admin/painel', icon: LayoutDashboard },
    { name: 'Alunos', href: '/admin/alunos', icon: Users },
    { name: 'Treinos', href: '/admin/treinos', icon: Dumbbell },
    { name: 'Exercícios', href: '/admin/exercicios', icon: Library },
    { name: 'Financeiro', href: '/admin/financeiro', icon: DollarSign },
    { name: 'Configurações', href: '/admin/config', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Mocking an admin user
    const adminUser = {
        nome: 'Leo Cruz',
        avatarUrl: 'https://i.pravatar.cc/150?img=11'
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-[#111111] border-r border-white/5 z-50">
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain" />
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive
                                    ? 'bg-primary text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-red-500/10">
                        <LogOut className="w-5 h-5" />
                        Sair do Painel
                    </button>
                </div>
            </aside>

            {/* Mobile Drawer Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Mobile */}
            <aside className={`fixed inset-y-0 left-0 bg-[#111111] w-64 transform transition-transform duration-300 z-50 lg:hidden flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                    <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain" />
                    <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive
                                    ? 'bg-primary text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-red-500/10">
                        <LogOut className="w-5 h-5" />
                        Sair do Painel
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">

                {/* Header */}
                <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        {/* Opcional: Breadcrumbs ou Título Dinâmico poderia ir aqui */}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white leading-none">{adminUser.nome}</p>
                            <span className="text-xs text-gray-500">Administrador</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8">
                    {children}
                </main>

            </div>
        </div>
    );
}
