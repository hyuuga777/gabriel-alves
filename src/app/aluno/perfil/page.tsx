'use client';

import { useSession } from 'next-auth/react';
import { User, Lock, Camera, Trash2, Eye, EyeOff, Save, Shield, Settings, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function StudentProfilePage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'perfil' | 'conta' | 'infos'>('perfil');
    const [loading, setLoading] = useState(false);

    // Perfil State
    const [profileData, setProfileData] = useState({
        name: session?.user?.name || '',
        bio: '',
        website: ''
    });

    // Conta State
    const [privacy, setPrivacy] = useState(false); // Perfil privado
    const [passData, setPassData] = useState({ current: '', new: '' });

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            {/* Inner Sidebar / Settings Menu */}
            <aside className="w-full md:w-64 border-r border-white/5 bg-[#0a0a0a] p-6 flex-shrink-0">
                <h2 className="text-gray-500 font-bold mb-4 px-2">Conta</h2>
                <nav className="space-y-1">
                    <button
                        onClick={() => setActiveTab('perfil')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'perfil' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Perfil
                    </button>
                    <button
                        onClick={() => setActiveTab('infos')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'infos' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <AlertCircle className="w-4 h-4" />
                        Minhas Informações
                    </button>
                    <button
                        onClick={() => setActiveTab('conta')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'conta' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Lock className="w-4 h-4" />
                        Conta
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5">
                        <CreditCardIcon />
                        Gerenciar assinatura
                    </button>
                </nav>

                <h2 className="text-gray-500 font-bold mt-8 mb-4 px-2">Preferências</h2>
                <nav className="space-y-1">
                    <div className="px-3 py-2 text-gray-600 text-sm flex gap-3 cursor-not-allowed">
                        <Settings className="w-4 h-4" /> Unido
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 max-w-4xl">

                {activeTab === 'perfil' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-between items-center border-b border-white/10 pb-6">
                            <h1 className="text-2xl font-bold text-white">Perfil</h1>
                            <button className="bg-gray-600/50 hover:bg-gray-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                Salvar alterações
                            </button>
                        </div>

                        {/* Avatar */}
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                                {session?.user?.image ? (
                                    <img src={session?.user?.image} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-gray-500" />
                                )}
                            </div>
                            <button className="bg-[#222] hover:bg-[#333] border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                Alterar imagem
                            </button>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Nome</label>
                                <input
                                    type="text"
                                    placeholder="Seu nome completo"
                                    defaultValue={session?.user?.name || ''}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Biografia</label>
                                <input
                                    type="text"
                                    placeholder="Descreva-se"
                                    className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Link</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com"
                                    className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'infos' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-between items-center border-b border-white/10 pb-6">
                            <h1 className="text-2xl font-bold text-white">Minhas Informações</h1>
                            <button className="bg-gray-600/50 hover:bg-gray-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                Salvar alterações
                            </button>
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Gênero</label>
                                    <select className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary">
                                        <option value="">Selecione</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Telefone / WhatsApp</label>
                                <input
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Endereço Completo</label>
                                <textarea
                                    placeholder="Rua, Nsmero, Bairro, Cidade - UF"
                                    rows={3}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary resize-none"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'conta' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div className="border-b border-white/10 pb-6">
                            <h1 className="text-2xl font-bold text-white">Conta</h1>
                        </div>

                        {/* Perfil Privado */}
                        <div className="flex items-start justify-between max-w-2xl">
                            <div>
                                <h3 className="font-bold text-white text-base mb-1">Perfil Privado</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Ter um perfil privado significa que outros usuários precisam solicitar para segui-lo.
                                    Somente se você aceitar a solicitação de acompanhamento, eles poderão ver seus treinos.
                                </p>
                            </div>
                            <button className="bg-[#222] border border-white/10 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2">
                                Desligado <Settings className="w-3 h-3 rotate-90" />
                            </button>
                        </div>

                        {/* Alterar Senha */}
                        <div className="space-y-6 max-w-2xl pt-6 border-t border-white/5">
                            <div>
                                <h3 className="font-bold text-white text-base mb-1">Alterar senha</h3>
                                <p className="text-sm text-gray-400">Atualize sua senha para manter sua conta segura.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Senha atual</label>
                                    <input
                                        type="password"
                                        className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Nova senha</label>
                                    <input
                                        type="password"
                                        className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                                    Atualizar senha
                                </button>
                            </div>
                        </div>

                        {/* Excluir Conta */}
                        <div className="pt-12 text-center max-w-2xl">
                            <button className="text-red-500 hover:text-red-400 text-sm font-bold transition-colors">
                                Excluir conta
                            </button>
                        </div>

                    </motion.div>
                )}

            </main>
        </div>
    );
}

function CreditCardIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
    )
}
