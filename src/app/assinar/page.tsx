'use client';

import { useState } from 'react';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { Check, Star, Shield, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function AssinarPage() {
    const [cycle, setCycle] = useState<'monthly' | 'quarterly' | 'annual'>('quarterly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const plans = [
        {
            id: 'monthly',
            name: 'Mensal',
            price: 129.90,
            period: '/mês',
            description: 'Para quem quer flexibilidade total.',
            features: [
                'Treinos personalizados',
                'Avaliação física básica',
                'Suporte via chat (horário comercial)',
                'Acesso ao app',
            ],
            highlight: false,
        },
        {
            id: 'quarterly',
            name: 'Trimestral',
            price: 109.90,
            period: '/mês',
            total: '3x de R$ 109,90',
            description: 'O equilíbrio ideal entre compromisso e resultado.',
            features: [
                'Tudo do plano Mensal',
                'Avaliação física completa',
                'Ajustes de treino quinzenais',
                'Prioridade no suporte',
                'Nutrição básica (guia)',
            ],
            highlight: true,
            badge: 'MAIS POPULAR',
        },
        {
            id: 'annual',
            name: 'Anual',
            price: 89.90,
            period: '/mês',
            total: '12x de R$ 89,90',
            description: 'Transformação real e duradoura com o melhor valor.',
            features: [
                'Tudo do plano Trimestral',
                'Avaliação com bioimpedância presencial (1x/ano)',
                'Ajustes semanais ilimitados',
                'Masterclass exclusiva mensal',
                'Kit boas-vindas FitnessPro',
            ],
            highlight: false,
            badge: 'MELHOR VALOR',
        },
    ];

    const faqs = [
        {
            question: 'Como funciona a avaliação física?',
            answer: 'Nossa engine exclusiva utiliza seus dados (peso, medidas, fotos) para calcular sua composição corporal e métricas de saúde com precisão científica. Você pode atualizar seus dados mensalmente para acompanhar a evolução.'
        },
        {
            question: 'O treino é realmente personalizado?',
            answer: 'Sim! Após sua anamnese inicial, nosso algoritmo cria uma base que é refinada manualmente por treinadores reais da Team Alves para se adaptar exatamente aos seus objetivos e limitações.'
        },
        {
            question: 'Posso cancelar quando quiser?',
            answer: 'No plano mensal, o cancelamento é a qualquer momento sem multa. Nos planos trimestral e anual, há uma taxa proporcional ao tempo restante do contrato caso cancele antes do final.'
        },
        {
            question: 'Tenho suporte de dúvidas?',
            answer: 'Com certeza! Todos os planos incluem acesso ao chat com nossos especialistas para tirar dúvidas sobre execução de exercícios ou ajustes na rotina.'
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PublicNavbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background pointer-events-none" />
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Invista na sua <span className="gradient-text">melhor versão</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                                Escolha o plano ideal para seus objetivos. Treinos científicos, acompanhamento real e resultados visíveis.
                            </p>
                        </motion.div>

                        {/* Ciclo de Faturamento */}
                        <div className="inline-flex items-center p-1 bg-muted rounded-full mb-16">
                            <span className="px-4 py-1 text-sm font-medium text-muted-foreground">Planos Flexíveis</span>
                        </div>
                    </div>

                    {/* Cards de Preço */}
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                className={`relative rounded-2xl p-8 border ${plan.highlight
                                    ? 'glass border-primary ring-1 ring-primary/50 shadow-2xl shadow-primary/10'
                                    : 'glass border-white/10 hover:border-white/20'
                                    } flex flex-col`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent px-4 py-1 rounded-full text-xs font-bold text-black shadow-lg">
                                        {plan.badge}
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-sm text-muted-foreground h-10">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <span className="text-4xl font-bold">R$ {plan.price.toFixed(2)}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                    {plan.total && (
                                        <p className="text-xs text-muted-foreground mt-1">Total: {plan.total}</p>
                                    )}
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/checkout?plan=${plan.id}`}
                                    className={`block w-full text-center py-3 rounded-lg font-bold transition-all ${plan.highlight
                                        ? 'gradient-primary hover:shadow-lg hover:shadow-primary/25 hover-lift text-white'
                                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    Assinar Agora
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Benefícios */}
                <section className="py-20 px-6 bg-secondary/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Por que escolher a FitnessPro?</h2>
                            <p className="text-muted-foreground">Não é apenas um app, é um ecossistema de performance.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="glass p-8 rounded-xl text-center hover-lift">
                                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
                                    <Star className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Metodologia Comprovada</h3>
                                <p className="text-muted-foreground">Baseado em protocolos científicos de treinamento e nutrição para garantir resultados seguros e eficientes.</p>
                            </div>
                            <div className="glass p-8 rounded-xl text-center hover-lift">
                                <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-6">
                                    <Zap className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Tecnologia de Ponta</h3>
                                <p className="text-muted-foreground"> Avaliação física com IA, análise de execução e métricas de performance em tempo real.</p>
                            </div>
                            <div className="glass p-8 rounded-xl text-center hover-lift">
                                <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                                    <Shield className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Acompanhamento Real</h3>
                                <p className="text-muted-foreground">Não somos robôs. Treinadores reais monitoram seu progresso e ajustam a rota sempre que necessário.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Perguntas Frequentes</h2>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="glass rounded-xl overflow-hidden cursor-pointer"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <div className="p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                                        <h3 className="font-semibold">{faq.question}</h3>
                                        <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                                    </div>
                                    <motion.div
                                        initial={false}
                                        animate={{ height: openFaq === index ? 'auto' : 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-muted-foreground border-t border-white/5">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
