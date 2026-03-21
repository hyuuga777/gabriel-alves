'use client';

import Link from 'next/link';
import { Dumbbell, Instagram, Youtube, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-background border-t border-white/5 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="FitnessPro" className="h-[32px] w-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Plataforma completa de assessoria esportiva para quem busca alta performance e resultados reais com embasamento científico.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold mb-4">Plataforma</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/como-funciona" className="hover:text-primary transition-colors">Como Funciona</Link></li>
                            <li><Link href="/assinar" className="hover:text-primary transition-colors">Planos</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">Área do Aluno</Link></li>
                            <li><Link href="/admin/painel" className="hover:text-primary transition-colors">Área do Treinador</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacidade</Link></li>
                            <li><Link href="/contato" className="hover:text-primary transition-colors">Suporte</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold mb-4">Siga-nos</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} FitnessPro. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
