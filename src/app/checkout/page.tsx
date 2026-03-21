'use client';

import { useSearchParams } from 'next/navigation';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { Check, Lock, CreditCard, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan') || 'basic-mensal';
    const treinadorId = searchParams.get('treinadorId');

    const planDetails: Record<string, { name: string; price: number; period: string }> = {
        'basic-mensal': { name: 'Plano Basic Mensal', price: 359.00, period: 'mês' },
        'basic-semestral': { name: 'Plano Basic Semestral', price: 2010.00, period: 'semestre (equivalente a R$ 335,00/mês)' },
        'ultra-mensal': { name: 'Plano Ultra Mensal', price: 432.00, period: 'mês' },
        'ultra-semestral': { name: 'Plano Ultra Semestral', price: 2228.00, period: 'semestre (equivalente a R$ 380,00/mês)' },
    };

    const selectedPlan = planDetails[planId] || planDetails['basic-mensal'];

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Coluna Principal - Formulário */}
            <div className="lg:col-span-2 space-y-8">
                {/* Dados Pessoais */}
                <div className="glass p-8 rounded-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">1</span>
                        Dados Pessoais
                    </h2>
                    {treinadorId && <input type="hidden" name="treinadorId" value={treinadorId} />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome Completo</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="Seu nome" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input type="email" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="seu@email.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CPF</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="000.000.000-00" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Celular</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="(11) 99999-9999" />
                        </div>
                    </div>
                </div>

                {/* Endereço */}
                <div className="glass p-8 rounded-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">2</span>
                        Endereço
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CEP</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="00000-000" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Rua</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="Nome da rua" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nsmero</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="123" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Complemento</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="Apto, Sala, Bloco..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bairro</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="Bairro" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cidade</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="Cidade" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="Estado (ex: SP)" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">País</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="País" defaultValue="Brasil" />
                        </div>
                    </div>
                </div>

                {/* Pagamento */}
                <div className="glass p-8 rounded-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">3</span>
                        Pagamento Seguro
                    </h2>

                    <div className="flex gap-4 mb-6">
                        <button className="flex-1 py-4 border border-primary bg-primary/10 rounded-lg flex flex-col items-center justify-center gap-2">
                            <CreditCard className="w-6 h-6 text-primary" />
                            <span className="font-semibold text-primary">Cartão de Crédito</span>
                        </button>
                        <button className="flex-1 py-4 border border-border bg-input/50 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-input transition-colors">
                            <span className="text-2xl">💠</span>
                            <span className="font-medium text-muted-foreground">Pix (-5%)</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nsmero do Cartão</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Validade</label>
                                <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="MM/AA" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CVV</label>
                                <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="123" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome no Cartão</label>
                            <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="Como impresso no cartão" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Coluna Lateral - Resumo */}
            <div className="lg:col-span-1">
                <div className="glass p-6 rounded-2xl sticky top-24">
                    <h3 className="font-bold text-lg mb-6">Resumo do Pedido</h3>

                    <div className="flex justify-between mb-4 pb-4 border-b border-white/10">
                        <div>
                            <p className="font-medium">{selectedPlan.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedPlan.period}</p>
                        </div>
                        <p className="font-bold">R$ {selectedPlan.price.toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between items-center text-lg font-bold mb-8">
                        <span>Total:</span>
                        <span className="text-primary">R$ {selectedPlan.price.toFixed(2)}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-green-400" /> Gatantia de 7 dias
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ShieldCheck className="w-4 h-4 text-green-400" /> Pagamento 100% seguro
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="w-4 h-4 text-green-400" /> Dados criptografados
                        </li>
                    </ul>

                    <button className="w-full py-4 gradient-primary rounded-xl font-bold text-white hover-lift shadow-lg shadow-primary/20">
                        Confirmar Assinatura
                    </button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                        Ao assinar, você concorda com nossos Termos de Uso.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PublicNavbar />
            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2">Finalizar Contratação</h1>
                    <p className="text-muted-foreground">Falta pouco para começar sua transformação.</p>
                </div>
                <Suspense fallback={<div className="text-center">Carregando...</div>}>
                    <CheckoutContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
