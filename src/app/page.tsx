"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Heart, ShieldCheck, CheckCircle2, Zap, ArrowRight, Check, Star, Video, MessageCircle, FileText, Dumbbell, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';

interface Plan {
  id: string;
  name: string;
  descricao: string | null;
  price: number;
  period: string;
  features: any;
  highlight: boolean;
  highlightText: string | null;
  gradient: boolean;
}

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Error loading plans:', error);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,222,213,0.2),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Esquerdo: Vídeo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full aspect-video rounded-2xl overflow-hidden glass border border-white/10 group cursor-pointer shadow-2xl"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <img src="https://img.youtube.com/vi/Qc9CtognLNo/maxresdefault.jpg" alt="Video cover" className="w-full h-full object-cover" />
            </motion.div>

            {/* Direito: Texto */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-left"
            >
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full glass text-sm font-medium border border-primary/20 backdrop-blur-md">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">🔥 Consultoria Fitness Premium</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                Treinamento com método para <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">resultados reais</span>.
              </h1>
              
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Transforme seu corpo e mude de vida com uma metodologia comprovada e <strong className="text-foreground font-semibold">100% adaptada ao seu estilo de vida</strong>. Sem desculpas, apenas resultados.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#planos" className="group relative px-8 py-4 gradient-primary rounded-xl font-bold text-lg hover-lift w-full sm:w-auto overflow-hidden shadow-[0_0_40px_-10px_rgba(120,119,198,0.5)] text-center cursor-pointer">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    COMEÇAR AGORA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nossa Filosofia de Trabalho</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Baseada exclusivamente no <span className="text-foreground">seu estilo de vida</span> e necessidades reais.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Prescrição Baseada no Estilo de Vida',
                desc: 'Dietas e treinos que se encaixam na sua rotina, não o contrário. Respeitamos suas limitações e horários.',
              },
              {
                icon: Heart,
                title: 'Cuidado sem Julgamentos',
                desc: 'Um ambiente seguro para relatar dificuldades. Se errar, ajustamos juntos sem pressão psicológica.',
              },
              {
                icon: Activity,
                title: 'Processo Sustentável',
                desc: 'Resultados duradouros construídos através de consistência, ciência e saúde mental em primeiro lugar.',
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass rounded-3xl p-8 hover-lift border border-white/5 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why People Fail Section */}
      <section className="py-24 relative bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-y border-white/5 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Por que muitas pessoas falham?</h2>
              <p className="text-xl text-muted-foreground mb-8">Você se identifica com algum desses problemas comuns na busca pelo corpo ideal?</p>
              
              <ul className="space-y-6">
                {[
                  { title: "Falta de consistência", desc: "Desistir na terceira semana porque o plano era irreal." },
                  { title: "Estratégias radicais", desc: "Dietas altamente restritivas que destroem sua relação com a comida." },
                  { title: "Falta de orientação", desc: "Treinos aleatórios sem progressão ou correção de movimento." }
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl p-1 bg-gradient-to-br from-primary/30 to-accent/30"
            >
              <div className="glass rounded-[22px] p-10 h-full">
                <ShieldCheck className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-3xl font-bold mb-4">Com a nossa consultoria, cortamos isso pela raiz.</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Não trabalhamos com achismos. Usamos dados, feedback semanal e ajustes constantes para garantir que seu planejamento seja não apenas eficiente, mas <strong className="text-foreground">executável a longo prazo</strong>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">O que está incluso?</h2>
            <p className="text-xl text-muted-foreground">O ecossistema completo para a sua evolução</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Dumbbell, title: 'Plano de Treino', desc: 'Periodização focada em performance e hipertrofia estética.' },
              { icon: Activity, title: 'Reajuste Mensal', desc: 'Ajustes estratégicos mensais baseados no seu feedback.' },
              { icon: Video, title: 'Análise Biomecânica', desc: 'Correção de exercícios em vídeo para evitar lesões.' },
              { icon: FileText, title: 'Materiais de Apoio', desc: 'E-books e guias exclusivos para potencializar resultados.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover-lift border border-white/5"
              >
                <feature.icon className="w-10 h-10 text-primary mb-5" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-24 relative bg-black/40 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Planos de Consultoria</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o formato ideal para o seu momento e nível de acompanhamento necessário.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {!Array.isArray(plans) || plans.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 gap-4 glass rounded-[40px] border border-white/5">
                <Zap className="w-12 h-12 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground text-center max-w-sm">No momento não existem planos disponíveis para contratação online. Por favor, entre em contato com seu consultor.</p>
              </div>
            ) : (
              plans.map((plan, index) => {
                const isUltra = plan.name.toLowerCase().includes('ultra') || plan.name.toLowerCase().includes('vip');
                const slug = plan.name.toLowerCase().replace(/\s+/g, '-');
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass rounded-[40px] p-8 hover-lift flex flex-col relative ${
                      isUltra ? 'border border-accent/30 shadow-[0_0_50px_-12px_rgba(74,222,213,0.3)]' : 'border border-white/5'
                    }`}
                  >
                    {plan.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 gradient-accent rounded-full text-sm font-bold shadow-lg text-black w-max">
                        {plan.highlightText || 'DESTAQUE'}
                      </div>
                    )}
                    
                    <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{plan.descricao}</p>
                    
                    <div className="space-y-6 mb-8 flex-grow">
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm group/price relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/price:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold opacity-70">
                            PLANO {plan.period.startsWith('/') ? plan.period.slice(1) : plan.period}
                          </div>
                          <div className="text-4xl font-black tracking-tight">
                            R$ {Number(String(plan.price).replace(',', '.')).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            <span className="text-lg text-muted-foreground font-medium italic">
                              /{plan.period.startsWith('/') ? plan.period.slice(1) : (plan.period === 'mensal' ? 'mês' : plan.period)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10">
                      <h4 className="font-bold mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {isUltra ? 'Benefícios Exclusivos:' : 'Recursos Inclusos:'}
                      </h4>
                      <ul className="space-y-4">
                        {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, idx: number) => (
                          <li key={idx} className="flex gap-4 text-sm items-start">
                            <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isUltra ? 'bg-accent/20' : 'bg-primary/20'}`}>
                              {isUltra ? (
                                <Star className="w-3 h-3 text-accent fill-accent" />
                              ) : (
                                <Check className="w-3 h-3 text-primary" />
                              )}
                            </div>
                            <span className={isUltra ? "text-foreground font-semibold" : "text-foreground/90 font-medium"}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link 
                      href={`/checkout?plan=${slug}-mensal`} 
                      className={`mt-auto block w-full py-5 rounded-2xl text-center font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg ${
                        isUltra 
                          ? 'gradient-accent text-black shadow-accent/20 hover:shadow-accent/40' 
                          : 'gradient-primary text-white shadow-primary/20 hover:shadow-primary/40'
                      }`}
                    >
                      Assinar Agora
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl rounded-full" />
            <div className="glass rounded-[40px] p-12 relative border border-white/10 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 relative z-10">
                Sua melhor versão não vai <br className="hidden md:block"/>acontecer por acaso.
              </h2>
              <p className="text-xl text-muted-foreground mb-10 relative z-10 max-w-2xl mx-auto">
                Dê o primeiro passo hoje e deixe o resto com a nossa equipe especializada. Seu resultado é o nosso compromisso.
              </p>
              <Link href="#planos" className="relative z-10 inline-flex items-center gap-2 px-10 py-5 gradient-primary rounded-xl font-bold text-lg hover-lift shadow-xl shadow-primary/20">
                ESCOLHER MEU PLANO <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsVideoModalOpen(false)}>
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/Qc9CtognLNo?autoplay=1" 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="border-0"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
