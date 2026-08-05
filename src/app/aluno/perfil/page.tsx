'use client';

import { useSession, signOut } from 'next-auth/react';
import { User, Lock, Camera, Trash2, Eye, EyeOff, Save, Shield, Settings, AlertCircle, LogOut, CreditCard, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentProfilePage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'perfil' | 'conta' | 'infos'>('perfil');
    const [loading, setLoading] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: '',
        bio: '',
        link: '',
        birthDate: '',
        gender: '',
        phone: '',
        address: '',
        avatar: '',
        rotina: ''
    });

    useEffect(() => {
        // Fetch user data on mount
        fetch('/api/aluno/perfil')
            .then(res => res.json())
            .then(data => {
                if(data && !data.error) {
                    setProfileData({
                        name: data.name || session?.user?.name || '',
                        bio: data.bio || '',
                        link: data.link || '',
                        birthDate: data.birthDate || '',
                        gender: data.gender || '',
                        phone: data.phone || data.telefone || '',
                        address: data.address || '',
                        avatar: data.avatar || session?.user?.image || '',
                        rotina: data.alunoProfile?.rotina || data.rotina || ''
                    });
                }
            })
            .catch(console.error);
    }, [session]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/aluno/perfil', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            if (res.ok) {
                alert('Configurações salvas com sucesso!');
            } else {
                alert('Erro ao salvar as configurações.');
            }
        } catch(error) {
            alert('Falha na conexão ao salvar.');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'perfil', label: 'Perfil', icon: User },
        { id: 'infos', label: 'Informações', icon: Shield },
        { id: 'conta', label: 'Conta e Segurança', icon: Lock },
    ] as const;

    return (
        <div className="flex-1 bg-black text-gray-400 font-sans selection:bg-primary/30 selection:text-white">
            <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-12">
                
                {/* Header with Horizontal Tabs */}
                <header className="space-y-8">
                    <div className="flex items-end justify-between border-b border-white/5 pb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Configurações</h1>
                            <p className="text-gray-500 mt-1">Gerencie seu perfil, informações e segurança da conta.</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-primary hover:bg-primary-dark text-black font-bold h-11 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Salvar Tudo</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Navigation Tabs (Horizontal) */}
                    <nav className="flex items-center gap-2 p-1.5 bg-[#0a0a0a] rounded-2xl border border-white/5 w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    activeTab === tab.id 
                                    ? 'bg-[#1a1a1a] text-white shadow-xl shadow-black ring-1 ring-white/10' 
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                            >
                                <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-primary' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'perfil' && (
                        <motion.div
                            key="tab-perfil"
                            initial={{ opacity: 0, y: 10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                        >
                            {/* Left: Avatar & Bio Quick Edit */}
                            <div className="lg:col-span-1 space-y-8">
                                <section className="relative group">
                                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                                    <div className="bg-[#050505] p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center">
                                        <div className="relative mb-6">
                                            <div className="w-32 h-32 rounded-[2.5rem] bg-gray-900 border-2 border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:rotate-3 group-hover:scale-110 shadow-2xl">
                                                {profileData.avatar ? (
                                                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-16 h-16 text-gray-800" />
                                                )}
                                            </div>
                                            <label className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-black rounded-2xl border-4 border-black hover:scale-110 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer">
                                                <Camera className="w-5 h-5" />
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setProfileData({...profileData, avatar: reader.result as string});
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{profileData.name || 'Seu Nome'}</h3>
                                        <p className="text-sm text-gray-500 px-6 leading-relaxed">Personalize sua aparência no sistema e conquiste seus objetivos.</p>
                                        <div className="w-full pt-8 mt-8 border-t border-white/5 space-y-3">
                                            <label className="w-full text-center block text-sm font-bold text-white bg-white/5 hover:bg-white/10 py-3 rounded-xl transition-all border border-white/5 cursor-pointer">
                                                Subir nova foto
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setProfileData({...profileData, avatar: reader.result as string});
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} />
                                            </label>
                                            <button onClick={() => setProfileData({...profileData, avatar: ''})} className="w-full text-xs font-bold text-red-500/60 hover:text-red-500 py-2 transition-colors">
                                                Remover foto atual
                                            </button>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-[#050505]/50 p-6 rounded-3xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3 text-white">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <CreditCard className="w-4 h-4 text-primary" />
                                        </div>
                                        <h4 className="font-bold text-sm">Status da Assinatura</h4>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-black rounded-2xl border border-white/5">
                                        <span className="text-xs uppercase tracking-widest font-bold text-primary">Plano Pro</span>
                                        <span className="text-xs text-gray-500">Ativo</span>
                                    </div>
                                    <button className="w-full text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mt-2 group">
                                        Gerenciar Pagamentos <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </section>
                            </div>

                            {/* Right: Detailed Info */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-[#050505] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
                                    <h2 className="text-lg font-bold text-white uppercase tracking-widest text-primary/80">Informações Básicas</h2>
                                    
                                    <div className="grid grid-cols-1 gap-10">
                                        <div className="space-y-3 group">
                                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-primary transition-colors">Nome exibido</label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                placeholder="Como você gostaria de ser chamado?"
                                                className="w-full bg-black border border-white/5 rounded-2xl p-4 md:p-5 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium placeholder:text-gray-800 shadow-inner"
                                            />
                                        </div>

                                        <div className="space-y-3 group">
                                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-primary transition-colors">Sua Biografia</label>
                                            <textarea
                                                rows={5}
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                placeholder="Conte sua história, seus treinos e metas..."
                                                className="w-full bg-black border border-white/5 rounded-2xl p-4 md:p-5 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium placeholder:text-gray-800 shadow-inner resize-none leading-relaxed"
                                            />
                                            <div className="flex justify-between px-1">
                                                <p className="text-[10px] text-gray-700">Aparece na sua página pública de treinamentos.</p>
                                                <p className="text-[10px] text-gray-700">0 / 255</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 group">
                                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-primary transition-colors">Site ou Rede Social</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={profileData.link}
                                                    onChange={(e) => setProfileData({ ...profileData, link: e.target.value })}
                                                    placeholder="https://example.com"
                                                    className="w-full bg-black border border-white/5 rounded-2xl p-4 md:p-5 pl-14 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium placeholder:text-gray-800 shadow-inner"
                                                />
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600">
                                                    <Settings className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'infos' && (
                        <motion.div
                            key="tab-infos"
                            initial={{ opacity: 0, y: 10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-12 overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -mr-32 -mt-32" />
                            
                            <h2 className="text-lg font-bold text-white uppercase tracking-widest text-primary/80 relative">Informações Cadastrais</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                                <div className="space-y-3 group">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-primary">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        value={profileData.birthDate}
                                        onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                                        className="w-full bg-black border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer invert-icons"
                                    />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-primary">Gênero Bioógico</label>
                                    <select 
                                        value={profileData.gender}
                                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                        className="w-full bg-black border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:20px] bg-[right_20px_center] bg-no-repeat">
                                        <option value="">Prefiro não informar</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-primary">Telefone WhatsApp</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        placeholder="(00) 0 0000-0000"
                                        className="w-full bg-black border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-gray-800"
                                    />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-primary">CPF (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="000.000.000-00"
                                        className="w-full bg-black border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-gray-800 font-mono text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3 group">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-primary">Endereço de Correspondência</label>
                                    <textarea
                                        rows={3}
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        placeholder="Rua, Número, Complemento, Bairro, Cidade - UF"
                                        className="w-full bg-black border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-primary/40 transition-all resize-none shadow-inner placeholder:text-gray-800"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'conta' && (
                        <motion.div
                            key="tab-conta"
                            initial={{ opacity: 0, y: 10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="space-y-12"
                        >
                            {/* Privacy Control Card */}
                            <section className="bg-gradient-to-br from-[#0a0a0a] to-black p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-x-1/2" />
                                <div className="max-w-xl space-y-4 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-primary/20 rounded-2xl border border-primary/20">
                                            <EyeOff className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight">Privacidade do Perfil</h3>
                                    </div>
                                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                        Controle quem pode visualizar seu progresso. Com o perfil privado, você decide quem te acompanha nas suas vitórias.
                                    </p>
                                </div>
                                <div className="flex bg-black border border-white/10 p-1.5 rounded-[20px] relative shrink-0">
                                    <button className="px-8 py-3 rounded-[14px] text-xs font-bold tracking-widest uppercase transition-all text-gray-500 hover:text-gray-300">Público</button>
                                    <button className="px-8 py-3 rounded-[14px] text-xs font-bold tracking-widest uppercase transition-all bg-primary text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">Privado</button>
                                </div>
                            </section>

                            {/* Security Section Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="bg-[#050505] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-white tracking-tight">Mudar Senha</h3>
                                        <p className="text-sm text-gray-500">Mantenha sua conta protegida com uma senha complexa.</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] ml-1">Senha Atual</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-black border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-primary/40 focus:ring-0 transition-all" />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] ml-1">Nova Senha</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-black border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-primary/40 focus:ring-0 transition-all" />
                                        </div>
                                        <button className="w-full bg-white hover:bg-gray-200 text-black font-bold h-14 rounded-2xl transition-all active:scale-[0.98] shadow-2xl shadow-white/5">
                                            Atualizar Senha
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-red-500/5 p-10 rounded-[2.5rem] border border-red-500/10 shadow-2xl space-y-8 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-red-500">
                                            <AlertCircle className="w-6 h-6" />
                                            <h3 className="text-xl font-bold tracking-tight">Zona de Perigo</h3>
                                        </div>
                                        <p className="text-sm text-red-500/60 leading-relaxed">
                                            Ao deletar sua conta, todas as suas métricas, treinos e histórico de pagamentos serão apagados permanentemente. Esta ação não tem volta.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-mono text-charcoal-400 text-center uppercase tracking-widest text-red-500/30">ID da Conta: SAD-120-85</p>
                                        <button className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 font-bold h-14 rounded-2xl transition-all">
                                            Excluir Conta Permanentemente
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Custom Styles for Select/Inverts */}
            <style jsx global>{`
                .invert-icons::-webkit-calendar-picker-indicator {
                    filter: invert(0.5);
                    cursor: pointer;
                }
                select {
                    -webkit-appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1.5rem center;
                    background-size: 1rem;
                }
            `}</style>
        </div>
    );
}
