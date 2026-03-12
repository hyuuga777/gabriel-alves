'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/footer';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContatoPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PublicNavbar />

            <main className="flex-grow pt-32 pb-20 px-6">
                <section className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold mb-6">Fale Conosco</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Dúvidas sobre os planos? Quer saber mais sobre a metodologia?
                            Nossa equipe está pronta para te atender.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Info Cards */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass p-6 rounded-xl flex items-center gap-6"
                            >
                                <div className="p-4 bg-primary/20 rounded-full">
                                    <MessageCircle className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">WhatsApp</h3>
                                    <p className="text-muted-foreground mb-1">Atendimento rápido</p>
                                    <a href="#" className="text-primary font-medium hover:underline">(11) 99999-9999</a>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass p-6 rounded-xl flex items-center gap-6"
                            >
                                <div className="p-4 bg-accent/20 rounded-full">
                                    <Mail className="w-8 h-8 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Email</h3>
                                    <p className="text-muted-foreground mb-1">Para parcerias e suporte</p>
                                    <a href="mailto:contato@fitnesspro.com" className="text-accent font-medium hover:underline">contato@fitnesspro.com</a>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass p-6 rounded-xl flex items-center gap-6"
                            >
                                <div className="p-4 bg-purple-500/20 rounded-full">
                                    <MapPin className="w-8 h-8 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Escritório</h3>
                                    <p className="text-muted-foreground">Av. Paulista, 1000 - SP</p>
                                    <span className="text-sm text-muted-foreground block mt-1">Visitas com agendamento</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass p-8 rounded-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Envie uma mensagem</h2>
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nome</label>
                                    <input type="text" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Seu nome" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input type="email" className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="seu@email.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Assunto</label>
                                    <select className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition-all">
                                        <option>Dúvida sobre Planos</option>
                                        <option>Suporte Técnico</option>
                                        <option>Parcerias</option>
                                        <option>Outros</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Mensagem</label>
                                    <textarea rows={4} className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Como podemos ajudar?" />
                                </div>
                                <button className="w-full py-4 gradient-primary rounded-xl font-bold flex items-center justify-center gap-2 hover-lift">
                                    <Send className="w-5 h-5" />
                                    Enviar Mensagem
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
