'use client';

import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';
import { ClipboardList, Activity, Video, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ComoFuncionaPage() {
    const steps = [
        {
            icon: ClipboardList,
            title: '1. Anamnese Detalhada',
            description: 'Tudo começa com um mapeamento profundo do seu perfil, histórico de lesões, rotina e objetivos. Não é apenas um formulário, é o início do seu planejamento estratégico.',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            icon: Activity,
            title: '2. Avaliação Física Remota',
            description: 'Utilize nossa tecnologia exclusiva para enviar suas fotos e medidas. Nosso motor de IA calcula sua composição corporal e identifica desequilíbrios posturais.',
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
        },
        {
            icon: Video,
            title: '3. Prescrição Personalizada',
            description: 'Receba seu treino direto no app com vídeos demonstrativos em 4K. Cargas, repetições, intervalos e técnicas avançadas (Drop-sets, Rest-pause) detalhadas.',
            color: 'text-pink-400',
            bg: 'bg-pink-400/10'
        },
        {
            icon: TrendingUp,
            title: '4. Monitoramento Contínuo',
            description: 'Registre suas cargas e perceção de esforço a cada treino. Analisamos seus dados semanalmente para ajustar a intensidade e garantir progressão constante.',
            color: 'text-green-400',
            bg: 'bg-green-400/10'
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PublicNavbar />

            <main className="flex-grow pt-32 pb-20 px-6">
                {/* Hero */}
                <section className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Metodologia <span className="gradient-text">Team Alves</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Unimos ciência do esporte e tecnologia para criar o caminho mais eficiente entre você e seus objetivos. Sem achismos, apenas resultados.
                        </p>
                    </motion.div>
                </section>

                {/* Steps Timeline */}
                <section className="max-w-5xl mx-auto relative">
                    {/* Linha vertical conectora (apenas desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-transparent -translate-x-1/2" />

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Contesdo */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className={`inline-flex p-3 rounded-xl mb-4 ${step.bg} md:hidden`}>
                                        <step.icon className={`w-8 h-8 ${step.color}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Ícone Central (Desktop) */}
                                <div className="relative z-10 hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-card border border-white/10 shadow-xl">
                                    <step.icon className={`w-8 h-8 ${step.color}`} />
                                </div>

                                {/* Placeholder para balancear o grid (Desktop) */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-32 text-center">
                    <div className="glass max-w-3xl mx-auto p-12 rounded-3xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none" />
                        <h2 className="text-3xl font-bold mb-6 relative z-10">Pronto para começar?</h2>
                        <p className="text-muted-foreground mb-8 relative z-10">
                            Junte-se a centenas de alunos que já transformaram seus físicos e rotinas.
                        </p>
                        <Link
                            href="/assinar"
                            className="inline-flex items-center gap-2 px-8 py-4 gradient-primary rounded-xl font-bold text-white hover-lift relative z-10"
                        >
                            Ver Planos Disponíveis
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
