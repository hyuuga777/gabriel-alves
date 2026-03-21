'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Menu, User } from 'lucide-react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { MOCK_ALUNO } from '@/lib/mock-db';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session } = useSession();

    // Usando o mock ou a sessão para o cabeçalho
    const adminUser = {
        nome: session?.user?.name || MOCK_ALUNO.nome,
        email: session?.user?.email || MOCK_ALUNO.email
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Sidebar Component handles both Desktop and Mobile */}
            <AdminSidebar 
                mobileMenuOpen={mobileMenuOpen} 
                setMobileMenuOpen={setMobileMenuOpen} 
            />

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">

                {/* Header */}
                <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white leading-none">{adminUser.nome}</p>
                            <span className="text-xs text-gray-500 font-medium">Administrador</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
                    {children}
                </main>

            </div>
        </div>
    );
}
