'use client';

import { useState } from 'react';
import { User, Bell, Lock, Globe, Save, Loader2, Mail, Shield } from 'lucide-react';

export default function ConfigPage() {
    const [isLoading, setIsLoading] = useState(false);

    // Mock State
    const [profile, setProfile] = useState({
        name: 'Treinador Admin',
        email: 'admin@fitnesspro.com',
        language: 'pt-BR',
        notifications: true
    });

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
                <p className="text-gray-400">Gerencie suas preferências e configurações da conta.</p>
            </header>

            <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Perfil
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                            <div className="relative">
                                <input
                                    value={profile.name}
                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:border-primary"
                                />
                                <User className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email</label>
                            <div className="relative">
                                <input
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:border-primary"
                                />
                                <Mail className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        Preferências
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">Notificações por Email</h3>
                                <p className="text-sm text-gray-400">Receba atualizações sobre seus alunos.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={profile.notifications} onChange={e => setProfile({ ...profile, notifications: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">Idioma</h3>
                                <p className="text-sm text-gray-400">Selecione o idioma da interface.</p>
                            </div>
                        </div>
                        <select
                            value={profile.language}
                            onChange={e => setProfile({ ...profile, language: e.target.value })}
                            className="bg-[#111] border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none"
                        >
                            <option value="pt-BR">Português (BR)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es">Español</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden opacity-75">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Segurança (Em breve)
                    </h2>
                </div>
                <div className="p-6">
                    <button disabled className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-white/5 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">Alterar Senha</h3>
                                <p className="text-sm text-gray-400">Atualize sua senha de acesso.</p>
                            </div>
                        </div>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">Indisponível</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
}
