'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Target, TrendingUp, Users, Video, Calendar, MessageCircle, BarChart, Check } from 'lucide-react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';

interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
  highlightText?: string;
  discount?: string | null;
  gradient?: boolean;
}

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch('/api/admin/plans')
      .then(res => res.json())
      .then(data => setPlans(data))
      .catch(err => console.error('Failed to fetch plans', err));
  }, []);

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,222,213,0.2),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Transforme Seu
              <br />
              <span className="gradient-text">Corpo & Mente</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Assessoria esportiva de alta performance com avaliação física profissional,
              treinos personalizados e acompanhamento em tempo real
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assinar" className="px-8 py-4 gradient-primary rounded-lg font-semibold text-lg hover-lift">
                Comece Agora
              </Link>
              <Link href="/como-funciona" className="px-8 py-4 glass rounded-lg font-semibold text-lg hover-lift">
                Saiba Mais
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {[
              { value: '10K+', label: 'Alunos Ativos' },
              { value: '95%', label: 'Taxa de Sucesso' },
              { value: '50+', label: 'Profissionais' },
              { value: '4.9', label: 'Avaliação' }
            ].map((stat, i) => (
              <div key={i} className="glass rounded-xl p-6 hover-lift">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground">Metodologia completa para resultados extraordinários</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: 'Avaliação Profissional',
                description: 'Análise completa com bioimpedância, dobras cutâneas, testes de performance e VO2 Max'
              },
              {
                icon: Calendar,
                title: 'Treinos Personalizados',
                description: 'Programas adaptados aos seus objetivos com progressão inteligente e periodização'
              },
              {
                icon: Video,
                title: 'Vídeos Explicativos',
                description: 'Cada exercício com vídeo demonstrativo e instruções detalhadas de execução'
              },
              {
                icon: BarChart,
                title: 'Acompanhamento Real-Time',
                description: 'Gráficos de evolução, histórico de cargas e ajustes automáticos no treino'
              },
              {
                icon: MessageCircle,
                title: 'Chat com Treinador',
                description: 'Comunicação direta para tirar dsvidas e receber feedback personalizado'
              },
              {
                icon: TrendingUp,
                title: 'Progressão Inteligente',
                description: 'Sistema que adapta cargas e volumes baseado no seu progresso real'
              },
              {
                icon: Users,
                title: 'Comunidade Premium',
                description: 'Acesso a grupo exclusivo de alunos para motivação e troca de experiências'
              },
              {
                icon: Dumbbell,
                title: 'App Mobile',
                description: 'Registre seus treinos pelo celular com cronômetro, notas e log completo'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover-lift"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Escolha Seu Plano</h2>
            <p className="text-xl text-muted-foreground">Invista na sua transformação</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`glass rounded-2xl p-8 hover-lift relative ${plan.gradient ? 'ring-2 ring-primary' : ''
                  }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 gradient-primary rounded-full text-sm font-semibold">
                    {plan.highlightText || 'DESTAQUE'}
                  </div>
                )}
                {plan.discount && (
                  <div className="text-accent text-sm font-semibold mb-2">{plan.discount}</div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground font-medium">R$</span>
                    <span className="text-5xl font-bold">{plan.price}</span>
                  </div>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((recurso, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{recurso}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?plan=${plan.id}`}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition ${plan.gradient
                    ? 'gradient-primary hover-lift'
                    : 'glass hover-lift'
                    }`}
                >
                  Assinar Agora
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto Para Se Transformar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se a milhares de pessoas que já alcançaram resultados extraordinários
            </p>
            <Link href="/assinar" className="inline-block px-12 py-4 gradient-primary rounded-lg font-semibold text-lg hover-lift">
              Começar Minha Jornada
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
