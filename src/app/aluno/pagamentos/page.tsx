'use client';

import { CreditCard, CheckCircle, Clock } from 'lucide-react';

export default function StudentPaymentsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground px-6 py-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Pagamentos e Assinatura</h1>
                <p className="text-gray-400 text-sm">Gerencie seu plano e histórico.</p>
            </header>

            <div className="space-y-6">
                {/* Current Plan Card */}
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="bg-primary text-black text-xs font-bold px-2 py-1 rounded mb-2 inline-block">ATIVO</span>
                            <h2 className="text-xl font-bold text-white">Plano Mensal Pro</h2>
                        </div>
                        <CreditCard className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Acesso total ao app</p>
                        <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Treinos personalizados</p>
                        <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Chat com treinador</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                        <span className="text-xs text-gray-400">Próxima renovação: 15/02/2026</span>
                        <span className="font-bold text-white">R$ 99,90/mês</span>
                    </div>
                </div>

                {/* Transaction History */}
                <div>
                    <h3 className="font-bold text-white mb-4">Histórico Recente</h3>
                    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Renovação Mensal</p>
                                        <p className="text-xs text-gray-500">15/{String(1 + i).padStart(2, '0')}/2026</p>
                                    </div>
                                </div>
                                <span className="font-bold text-white">R$ 99,90</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center pt-8">
                    <p className="text-xs text-gray-500 mb-2">Precisa alterar seu cartão?</p>
                    <button className="text-primary text-sm font-medium hover:underline">
                        Gerenciar formas de pagamento
                    </button>
                </div>
            </div>
        </div>
    );
}
