'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    Activity,
    CreditCard,
    Settings,
    LogOut,
    Search,
    GraduationCap,
    X,
    ChevronRight,
    BadgeDollarSign,
    ClipboardList,
    MessageSquare,
    AlertTriangle
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminSidebarProps {
    mobileMenuOpen?: boolean;
    setMobileMenuOpen?: (open: boolean) => void;
}

export function AdminSidebar({ mobileMenuOpen, setMobileMenuOpen }: AdminSidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Usuários", href: "/admin/usuarios", icon: Users },
        { name: "Alunos", href: "/admin/alunos", icon: GraduationCap },
        { name: "Avaliações", href: "/admin/avaliacoes", icon: ClipboardList },
        { name: "Treinos", href: "/admin/treinos", icon: Dumbbell },
        { name: "Exercícios", href: "/admin/exercicios", icon: Activity },
        { name: "Planos", href: "/admin/planos", icon: CreditCard },
        { name: "Financeiro", href: "/admin/financeiro", icon: BadgeDollarSign },
        { name: "Inadimplência", href: "/admin/inadimplencia", icon: AlertTriangle },
        { name: "Chat", href: "/admin/chat", icon: MessageSquare },
        { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin' || pathname === '/admin/painel';
        }
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const SidebarContent = (isMobile = false) => (
        <div className="flex flex-col h-full bg-black relative overflow-hidden">
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3 relative z-10 w-full">
                <div className="flex items-center justify-center w-full max-w-[150px]">
                    <img src="https://ogabrielalves.com/logo.png" alt="Logo Cliente" className="w-full h-auto max-h-16 object-contain" />
                </div>
                {isMobile && setMobileMenuOpen && (
                    <button 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="absolute right-4 p-2 rounded-lg bg-white/5 text-gray-400 lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Search Section */}
            <div className="px-4 mb-6 relative z-10">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00caca] transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-[#111111] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00caca]/50 transition-all text-gray-300 placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto relative z-10 custom-scrollbar pb-8">
                {menuItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => isMobile && setMobileMenuOpen && setMobileMenuOpen(false)}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                ? 'bg-[#00caca] text-black shadow-[0_0_20px_rgba(0,202,202,0.2)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-[18px] h-[18px]" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 relative z-10">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white transition-all w-full rounded-xl hover:bg-white/5"
                >
                    <LogOut className="w-5 h-5" />
                    Sair do Painel
                </button>
            </div>
        </div>
    );


    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-56 fixed inset-y-0 left-0 z-50 shadow-2xl">
                <div className="flex-1 border-r border-white/5">
                    {SidebarContent()}
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden" 
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-black border-r border-white/5 z-[70] lg:hidden flex flex-col shadow-2xl"
                        >
                            {SidebarContent(true)}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
