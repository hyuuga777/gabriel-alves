'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Dumbbell, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function PublicNavbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Detectar scroll para mudar estilo da navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Como Funciona', href: '/como-funciona' },
        { name: 'Planos', href: '/assinar' },
        { name: 'Contato', href: '/contato' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <img src="/logo.png" alt="FitnessPro" className="h-[42px] w-auto" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/cadastro"
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all hover:border-primary/50"
                    >
                        Começar Agora
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-muted-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-white/10 p-6 shadow-2xl"
                >
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-lg font-medium ${isActive(link.href) ? 'text-primary' : 'text-foreground'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-white/10 my-2" />
                        <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-medium text-muted-foreground"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/cadastro"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full py-3 bg-primary text-white rounded-lg font-bold text-center"
                        >
                            Começar Agora
                        </Link>
                    </nav>
                </motion.div>
            )}
        </header>
    );
}
