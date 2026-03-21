'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    Activity,
    CreditCard,
    DollarSign,
    BadgeDollarSign,
    GraduationCap,
    Settings,
    LogOut,
    Search,
    Target,
    MessageSquare,
    Library,
    User,
    X
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

interface AdminSidebarProps {
    mobileMenuOpen?: boolean;
    setMobileMenuOpen?: (open: boolean) => void;
}

export function AdminSidebar({ mobileMenuOpen, setMobileMenuOpen }: AdminSidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Usuários", href: "/admin/usuarios", icon: Users },
        { name: "Alunos", href: "/admin/alunos", icon: GraduationCap },
        { name: "Treinos", href: "/admin/treinos", icon: Dumbbell },
        { name: "Exercícios", href: "/admin/exercicios", icon: Activity },
        { name: "Planos", href: "/admin/planos", icon: CreditCard },
        { name: "Financeiro", href: "/admin/financeiro", icon: BadgeDollarSign },
        { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
    ];

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    const SidebarContent = (isMobile = false) => (
        <>
            <div className="p-6 flex items-center justify-between">
                <img src="https://ogabrielalves.com/logo.png" alt="Team Alves" className="h-10 w-auto object-contain" />
                {isMobile && setMobileMenuOpen && (
                    <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

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

            <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => isMobile && setMobileMenuOpen && setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                                ? 'bg-primary text-black'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-red-500/10"
                >
                    <LogOut className="w-5 h-5" />
                    Sair do Painel
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-[#0a0a0a] border-r border-white/5 z-50">
                {SidebarContent()}
            </aside>

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0a0a0a] border-r border-white/5 z-50 transform transition-transform duration-300 lg:hidden flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {SidebarContent(true)}
            </aside>
        </>
    );
}
