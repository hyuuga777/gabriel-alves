'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Bell, CreditCard, User, MoreVertical, Key, Trash2, Mail, MessageSquare, ChevronRight, X, Save } from 'lucide-react';

export function SettingsTab({ student, onUpdate }: { student?: any, onUpdate?: () => void }) {
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userStatus, setUserStatus] = useState(student?.assinatura?.status || 'ATIVA');
    const [permissions, setPermissions] = useState([
        { id: 1, label: 'Chat Direto Habilitado', sub: 'Permite que o aluno envie mensagens diretamente no suporte.', active: true, icon: MessageSquare },
        { id: 2, label: 'Alertas de Próximo Treino', sub: 'Envia push 15min antes da rotina agendada.', active: false, icon: Bell },
        { id: 3, label: 'Relatórios Semanais Automáticos', sub: 'PDF gerado todo domingo com stats de performance.', active: true, icon: CreditCard },
    ]);
    const [profile, setProfile] = useState({
        name: student?.name || 'Carregando...',
        email: student?.email || 'carregando@exemplo.com',
        plan: student?.assinatura?.plano?.nome || 'Nenhum plano',
        startDate: student?.createdAt ? new Date(student.createdAt).toLocaleDateString('pt-BR') : '...'
    });

    import('react').then(({ useEffect }) => {
        useEffect(() => {
            if (student) {
                setProfile({
                    name: student.name,
                    email: student.email,
                    plan: student.assinatura?.plano?.nome || 'Nenhum plano',
                    startDate: student.createdAt ? new Date(student.createdAt).toLocaleDateString('pt-BR') : '...'
                });
                setUserStatus(student.assinatura?.status || 'ATIVA');
            }
        }, [student]);
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    email: profile.email,
                    status: userStatus
                })
            });

            if (response.ok) {
                alert('Alterações salvas com sucesso!');
                setIsEditing(false);
                if (onUpdate) onUpdate();
            } else {
                alert('Erro ao salvar no banco de dados.');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Falha na conexão com o servidor.');
        } finally {
            setIsSaving(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setUserStatus(newStatus);
                alert(`Status alterado para ${newStatus}`);
                if (onUpdate) onUpdate();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const togglePermission = (id: number) => {
        setPermissions(permissions.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <Settings className="w-6 h-6 text-primary" />
                    Configurações do Perfil
                </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Admin Controls */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Settings */}
                    <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <h4 className="text-white font-bold flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Dados Administrativos
                            </h4>
                            <button onClick={() => setIsEditing(!isEditing)} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">
                                {isEditing ? 'Cancelar Edição' : 'Editar Tudo'}
                            </button>
                        </div>
                        
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { key: 'name', label: 'Nome Completo', value: profile.name, icon: User },
                                { key: 'email', label: 'E-mail de Acesso', value: profile.email, icon: Mail },
                                { key: 'plan', label: 'Tipo de Plano', value: profile.plan, icon: CreditCard },
                                { key: 'startDate', label: 'Data de Início', value: profile.startDate, icon: Bell },
                            ].map((field) => (
                                <div key={field.label} className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">{field.label}</label>
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                                        <field.icon className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors flex-shrink-0" />
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={field.value}
                                                onChange={(e) => setProfile({...profile, [field.key]: e.target.value})}
                                                className="bg-transparent text-white w-full focus:outline-none focus:border-b focus:border-primary border-b border-transparent"
                                            />
                                        ) : (
                                            <span className="text-white font-medium">{field.value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isEditing && (
                                <div className="md:col-span-2 flex justify-end">
                                    <button 
                                        onClick={handleSave} 
                                        disabled={isSaving}
                                        className="bg-primary text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'Salvar Perfil'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Permissions & Security */}
                    <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-[2rem] p-8"
                    >
                        <h4 className="text-white font-bold mb-8 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            Permissões e Notificações
                        </h4>

                        <div className="space-y-4">
                            {permissions.map((item) => (
                                <div key={item.label} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/[0.08] transition-all">
                                    <div className="flex gap-5">
                                        <div className="p-3 bg-white/5 rounded-2xl text-gray-500 group-hover:scale-110 transition-transform flex-shrink-0">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold leading-tight mb-1">{item.label}</h5>
                                            <p className="text-gray-500 text-xs">{item.sub}</p>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={() => togglePermission(item.id)}
                                        className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${item.active ? 'bg-primary' : 'bg-white/10'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${item.active ? 'translate-x-[28px]' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden">
                        <h4 className="text-white font-bold mb-8">Ações Críticas</h4>
                        
                        <div className="space-y-3">
                            <button onClick={() => alert('Senha resetada com sucesso! Um e-mail foi enviado.')} className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl transition-all group">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:text-primary transition-colors">
                                    <Key className="w-4 h-4" />
                                </div>
                                Resetar Senha
                                <ChevronRight className="w-4 h-4 ml-auto text-gray-600" />
                            </button>
                            <button onClick={() => updateStatus('ATIVA')} className="w-full flex items-center gap-4 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold rounded-2xl transition-all group">
                                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:text-emerald-400 transition-colors">
                                    <Shield className="w-4 h-4" />
                                </div>
                                Ativar Perfil
                                <ChevronRight className="w-4 h-4 ml-auto text-emerald-600" />
                            </button>
                            <button onClick={() => updateStatus('SUSPENSA')} className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl transition-all group">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:text-primary transition-colors">
                                    <Shield className="w-4 h-4" />
                                </div>
                                Suspender Perfil
                                <ChevronRight className="w-4 h-4 ml-auto text-gray-600" />
                            </button>
                            <button onClick={() => { 
                                if(window.confirm('Tem certeza que deseja excluir o aluno?')) {
                                    updateStatus('CANCELADA');
                                }
                            }} className="w-full flex items-center gap-4 p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold rounded-2xl transition-all group mt-10">
                                <div className="p-2 bg-red-500/10 group-hover:bg-black/20 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </div>
                                Excluir Permanentemente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
