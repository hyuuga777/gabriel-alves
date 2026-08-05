'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MessageSquare, Phone, User as UserIcon, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';

interface Inadimplente {
    id: string;
    name: string;
    email: string;
    telefone: string;
    avatar: string;
    plano: string;
    dataFim: string;
    status: string;
    isVencido: boolean;
}

export default function InadimplenciaPage() {
    const [inadimplentes, setInadimplentes] = useState<Inadimplente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'VENCIDOS' | 'A_VENCER'>('ALL');

    useEffect(() => {
        fetchInadimplentes();
    }, []);

    const fetchInadimplentes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/inadimplencia');
            const data = await res.json();
            if (Array.isArray(data)) {
                setInadimplentes(data);
            }
        } catch (error) {
            console.error('Failed to fetch inadimplentes', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getDiasParaVencer = (dataFim: string) => {
        if (!dataFim) return 0;
        return differenceInDays(new Date(dataFim), new Date());
    };

    const handleWhatsApp = (telefone: string, nome: string) => {
        if (!telefone) {
            alert('Este aluno não possui telefone cadastrado.');
            return;
        }
        const apenasNumeros = telefone.replace(/\D/g, '');
        const telFormatado = apenasNumeros.startsWith('55') ? apenasNumeros : `55${apenasNumeros}`;
        const msg = encodeURIComponent(`Olá, ${nome}. Notei que o seu plano na nossa plataforma está vencendo ou já venceu. Podemos ajudar com algo?`);
        window.open(`https://wa.me/${telFormatado}?text=${msg}`, '_blank');
    };

    const filteredList = inadimplentes.filter(aluno => {
        if (filter === 'ALL') return true;
        if (filter === 'VENCIDOS') return aluno.isVencido;
        if (filter === 'A_VENCER') return !aluno.isVencido;
        return true;
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        Inadimplência
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Gerencie os alunos com assinaturas vencidas ou prestes a vencer.
                    </p>
                </div>

                {/* Filtros */}
                <div className="flex bg-[#111] p-1 rounded-xl border border-white/5 w-fit">
                    {(['ALL', 'VENCIDOS', 'A_VENCER'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                                filter === tab
                                    ? 'bg-primary text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab === 'ALL' ? 'Todos' : tab === 'VENCIDOS' ? 'Vencidos' : 'A Vencer'}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredList.map((aluno, index) => {
                            const dias = getDiasParaVencer(aluno.dataFim);
                            const badgeColor = aluno.isVencido 
                                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20';

                            return (
                                <motion.div
                                    key={aluno.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col h-full hover:border-white/10 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            {aluno.avatar ? (
                                                <img src={aluno.avatar} alt={aluno.name} className="w-12 h-12 rounded-full border border-white/10" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                    <UserIcon className="w-6 h-6 text-gray-500" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-white text-lg leading-tight">{aluno.name}</h3>
                                                <p className="text-gray-500 text-xs mt-1">{aluno.plano}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${badgeColor} flex items-center gap-1.5`}>
                                            <Calendar className="w-3.5 h-3.5" />
                                            {aluno.isVencido ? 'Vencido' : `Vence em ${dias} dia(s)`}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/alunos/${aluno.id}`}
                                                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                Ver Perfil
                                            </Link>
                                            <Link
                                                href={`/admin/chat?user=${aluno.id}`}
                                                className="w-12 h-12 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors flex items-center justify-center shrink-0"
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => handleWhatsApp(aluno.telefone, aluno.name)}
                                            className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Phone className="w-4 h-4" />
                                            Enviar WhatsApp
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {filteredList.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Nenhum aluno encontrado</h3>
                                <p className="text-gray-500">
                                    {filter === 'ALL' 
                                        ? 'Sua lista de inadimplentes está vazia. Parabéns!' 
                                        : 'Nenhum aluno se encaixa neste filtro atual.'}
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
