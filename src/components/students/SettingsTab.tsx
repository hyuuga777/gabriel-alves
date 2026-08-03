'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Bell, CreditCard, User, Key, Trash2, Mail, MessageSquare, ChevronRight, Save, CheckCircle, XCircle, AlertTriangle, Copy, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Simple inline toast
type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: number; type: ToastType; title: string; message: string; }

export function SettingsTab({ student, onUpdate }: { student?: any, onUpdate?: () => void }) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [tempPassword, setTempPassword] = useState('');
    const [tempPasswordEmail, setTempPasswordEmail] = useState('');
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);

    const [permissions, setPermissions] = useState([
        { id: 1, label: 'Chat Direto Habilitado', sub: 'Permite que o aluno envie mensagens diretamente no suporte.', active: true, icon: MessageSquare },
        { id: 2, label: 'Alertas de Próximo Treino', sub: 'Envia notificação 15min antes da rotina agendada.', active: false, icon: Bell },
        { id: 3, label: 'Relatórios Semanais Automáticos', sub: 'PDF gerado todo domingo com stats de performance.', active: true, icon: CreditCard },
    ]);

    const [profile, setProfile] = useState({
        name: student?.name || '',
        email: student?.email || '',
        plan: student?.assinatura?.plano?.nome || 'Nenhum plano',
        planValue: student?.assinatura?.plano?.preco || '0.00',
        startDate: student?.assinatura?.dataInicio ? new Date(student.assinatura.dataInicio).toLocaleDateString('pt-BR') : (student?.createdAt ? new Date(student.createdAt).toLocaleDateString('pt-BR') : '—'),
        endDate: student?.assinatura?.dataFim ? new Date(student.assinatura.dataFim).toLocaleDateString('pt-BR') : '—',
    });

    useEffect(() => {
        if (student) {
            setProfile({
                name: student.name || '',
                email: student.email || '',
                plan: student.assinatura?.plano?.nome || 'Nenhum plano',
                planValue: student.assinatura?.plano?.preco || '0.00',
                startDate: student.assinatura?.dataInicio ? new Date(student.assinatura.dataInicio).toLocaleDateString('pt-BR') : (student?.createdAt ? new Date(student.createdAt).toLocaleDateString('pt-BR') : '—'),
                endDate: student.assinatura?.dataFim ? new Date(student.assinatura.dataFim).toLocaleDateString('pt-BR') : '—',
            });
        }
    }, [student]);

    const addToast = (type: ToastType, title: string, message: string) => {
        const id = Date.now();
        setToasts(t => [...t, { id, type, title, message }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: profile.name, email: profile.email })
            });
            if (response.ok) {
                addToast('success', 'Perfil Salvo', 'As alterações foram salvas com sucesso.');
                setIsEditing(false);
                if (onUpdate) onUpdate();
            } else {
                addToast('error', 'Erro ao Salvar', 'Não foi possível salvar as alterações.');
            }
        } catch (error) {
            addToast('error', 'Falha na Conexão', 'Verifique sua conexão e tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetPassword = async () => {
        setIsResetting(true);
        try {
            const res = await fetch(`/api/admin/users/${student.id}/reset-password`, {
                method: 'POST',
            });
            if (res.ok) {
                const data = await res.json();
                setTempPassword(data.tempPassword);
                setTempPasswordEmail(data.email);
                setShowPasswordModal(true);
            } else {
                addToast('error', 'Erro', 'Não foi possível resetar a senha.');
            }
        } catch (error) {
            addToast('error', 'Falha na Conexão', 'Verifique sua conexão e tente novamente.');
        } finally {
            setIsResetting(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        setIsChangingStatus(true);
        try {
            const res = await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                const label = newStatus === 'ATIVA' ? 'Perfil Ativado' : 'Perfil Suspenso';
                const msg = newStatus === 'ATIVA'
                    ? 'O aluno agora tem acesso total à plataforma.'
                    : 'O aluno foi suspenso e não pode acessar a plataforma.';
                addToast('success', label, msg);
                if (onUpdate) onUpdate();
            } else {
                addToast('error', 'Erro', 'Não foi possível alterar o status.');
            }
        } catch (e) {
            addToast('error', 'Falha na Conexão', 'Verifique sua conexão e tente novamente.');
        } finally {
            setIsChangingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmText !== 'EXCLUIR') return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/users/${student.id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setShowDeleteModal(false);
                addToast('success', 'Aluno Excluído', 'O perfil foi excluído permanentemente.');
                setTimeout(() => router.push('/admin/alunos'), 1500);
            } else {
                addToast('error', 'Erro ao Excluir', 'Não foi possível excluir o aluno. Tente novamente.');
            }
        } catch (e) {
            addToast('error', 'Falha na Conexão', 'Verifique sua conexão e tente novamente.');
        } finally {
            setIsDeleting(false);
        }
    };

    const togglePermission = (id: number) => {
        setPermissions(permissions.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    const currentStatus = student?.assinatura?.status || 'ATIVA';

    return (
        <div className="space-y-8 relative">
            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[100] space-y-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-sm min-w-[300px] max-w-sm
                                ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100' : ''}
                                ${toast.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-100' : ''}
                                ${toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500/30 text-amber-100' : ''}
                                ${toast.type === 'info' ? 'bg-blue-950/90 border-blue-500/30 text-blue-100' : ''}
                            `}
                        >
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
                            {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />}
                            <div>
                                <p className="font-bold text-sm">{toast.title}</p>
                                <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) { setShowDeleteModal(false); setDeleteConfirmText(''); } }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0f0f0f] border border-red-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                                        <Trash2 className="w-5 h-5 text-red-400" />
                                    </div>
                                    <h3 className="text-white font-black text-lg">Excluir Permanentemente</h3>
                                </div>
                                <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} className="text-gray-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                                Esta ação é <span className="text-red-400 font-bold">irreversível</span>. Todos os dados do aluno, incluindo histórico de treinos, avaliações e fotos, serão excluídos permanentemente.
                            </p>
                            <p className="text-gray-300 font-bold text-sm mb-1">Aluno: <span className="text-white">{student?.name}</span></p>
                            <p className="text-gray-500 text-xs mb-6">Para confirmar, digite <span className="font-mono font-bold text-red-400">EXCLUIR</span> abaixo:</p>
                            <input
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                                placeholder="Digite EXCLUIR para confirmar"
                                className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-white font-mono focus:outline-none focus:border-red-500/50 mb-4 placeholder:text-gray-600"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-bold text-sm transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteConfirmText !== 'EXCLUIR' || isDeleting}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? 'Excluindo...' : 'Excluir Permanentemente'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reset Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowPasswordModal(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                                        <Key className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-white font-black text-lg">Senha Temporária</h3>
                                </div>
                                <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">E-mail do aluno:</p>
                            <p className="text-white font-bold text-sm mb-5">{tempPasswordEmail}</p>
                            <p className="text-gray-400 text-xs mb-3">Compartilhe esta senha temporária com o aluno. Recomende que ele altere ao fazer login:</p>
                            <div className="flex items-center gap-3 bg-black/50 border border-primary/20 rounded-2xl px-4 py-4 mb-6">
                                <code className="text-primary font-mono text-lg font-bold flex-1 tracking-wider">{tempPassword}</code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(tempPassword);
                                        addToast('success', 'Copiado!', 'Senha copiada para a área de transferência.');
                                    }}
                                    className="p-2 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
                                >
                                    <Copy className="w-4 h-4 text-primary" />
                                </button>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-bold text-sm transition-all"
                            >
                                Fechar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                { key: 'name', label: 'Nome Completo', value: profile.name, icon: User, editable: true },
                                { key: 'email', label: 'E-mail de Acesso', value: profile.email, icon: Mail, editable: true },
                                { key: 'plan', label: 'Plano Adquirido', value: profile.plan, icon: CreditCard, editable: true },
                                { key: 'planValue', label: 'Valor do Plano (R$)', value: profile.planValue, icon: CreditCard, editable: true },
                                { key: 'startDate', label: 'Data de Início', value: profile.startDate, icon: Bell, editable: true },
                                { key: 'endDate', label: 'Data de Fim', value: profile.endDate, icon: Bell, editable: true },
                            ].map((field) => (
                                <div key={field.label} className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">{field.label}</label>
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                                        <field.icon className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors flex-shrink-0" />
                                        {isEditing && field.editable ? (
                                            <input
                                                type="text"
                                                value={field.value}
                                                onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                                                className="bg-transparent text-white w-full focus:outline-none border-b border-transparent focus:border-primary"
                                            />
                                        ) : (
                                            <span className="text-white font-medium">{field.value || '—'}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isEditing && (
                                <div className="md:col-span-2 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-primary text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition-all"
                                    >
                                        <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'Salvar Perfil'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Permissions */}
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

                {/* Sidebar — Critical Actions */}
                <div className="space-y-6">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden">
                        <h4 className="text-white font-bold mb-8">Ações Críticas</h4>

                        <div className="space-y-3">
                            {/* Reset Password */}
                            <button
                                id="btn-reset-senha"
                                onClick={handleResetPassword}
                                disabled={isResetting}
                                className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl transition-all group disabled:opacity-60"
                            >
                                <div className="p-2 bg-white/5 rounded-lg group-hover:text-primary transition-colors">
                                    <Key className="w-4 h-4" />
                                </div>
                                {isResetting ? 'Gerando senha...' : 'Resetar Senha'}
                                <ChevronRight className="w-4 h-4 ml-auto text-gray-600" />
                            </button>

                            {/* Ativar Perfil */}
                            <button
                                id="btn-ativar-perfil"
                                onClick={() => handleUpdateStatus('ATIVA')}
                                disabled={isChangingStatus || currentStatus === 'ATIVA'}
                                className="w-full flex items-center gap-4 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-2xl transition-all group disabled:opacity-50"
                            >
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <Shield className="w-4 h-4" />
                                </div>
                                {currentStatus === 'ATIVA' ? 'Perfil Já Ativo' : isChangingStatus ? 'Ativando...' : 'Ativar Perfil'}
                                <ChevronRight className="w-4 h-4 ml-auto text-emerald-700" />
                            </button>

                            {/* Suspender Perfil */}
                            <button
                                id="btn-suspender-perfil"
                                onClick={() => handleUpdateStatus('SUSPENSA')}
                                disabled={isChangingStatus || currentStatus === 'SUSPENSA'}
                                className="w-full flex items-center gap-4 p-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-2xl transition-all group disabled:opacity-50"
                            >
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <Shield className="w-4 h-4" />
                                </div>
                                {currentStatus === 'SUSPENSA' ? 'Perfil Já Suspenso' : isChangingStatus ? 'Suspendendo...' : 'Suspender Perfil'}
                                <ChevronRight className="w-4 h-4 ml-auto text-amber-700" />
                            </button>

                            {/* Excluir */}
                            <button
                                id="btn-excluir-permanentemente"
                                onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); }}
                                className="w-full flex items-center gap-4 p-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold rounded-2xl transition-all group mt-10"
                            >
                                <div className="p-2 bg-red-500/10 group-hover:bg-black/20 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </div>
                                Excluir Permanentemente
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            </button>
                        </div>

                        {/* Status Indicator */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-2">Status atual</p>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border
                                ${currentStatus === 'ATIVA' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                                ${currentStatus === 'SUSPENSA' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
                                ${currentStatus === 'CANCELADA' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
                            `}>
                                <span className={`w-1.5 h-1.5 rounded-full
                                    ${currentStatus === 'ATIVA' ? 'bg-emerald-400' : ''}
                                    ${currentStatus === 'SUSPENSA' ? 'bg-amber-400' : ''}
                                    ${currentStatus === 'CANCELADA' ? 'bg-red-400' : ''}
                                `} />
                                {currentStatus}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
