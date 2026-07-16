'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Edit2, Trash2, X, Save } from 'lucide-react';

interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    features: string[];
    highlight: boolean;
    highlightText?: string;
    discount?: string | null;
    gradient?: boolean;
}

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({});
    const [newFeature, setNewFeature] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/admin/plans');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPlans(data);
            } else {
                setPlans([]);
            }
        } catch (error) {
            console.error('Failed to fetch plans', error);
            setPlans([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNew = () => {
        setCurrentPlan({
            features: [],
            highlight: false,
            gradient: false
        });
        setIsModalOpen(true);
    };

    const handleEdit = (plan: Plan) => {
        setCurrentPlan({ ...plan });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este plano?')) {
            try {
                await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' });
                setPlans(plans.filter(p => p.id !== id));
            } catch (error) {
                console.error('Failed to delete plan', error);
                alert('Erro ao excluir plano');
            }
        }
    };

    const handleSave = async () => {
        if (!currentPlan.name || !currentPlan.price) return;

        try {
            if (currentPlan.id) {
                // Update
                const res = await fetch(`/api/admin/plans/${currentPlan.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentPlan),
                });
                const updatedPlan = await res.json();
                setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
            } else {
                // Create
                const res = await fetch('/api/admin/plans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentPlan),
                });
                const newPlan = await res.json();
                setPlans(prev => [...prev, newPlan]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save plan', error);
            alert('Erro ao salvar plano');
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        Gerenciar Planos
                    </h1>
                    <p className="text-gray-400 mt-1">Configure os preços e benefícios oferecidos na landing page.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-primary hover:bg-primary/90 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Plano
                </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl p-8 flex flex-col h-full border ${plan.gradient
                                ? 'bg-[#151515] border-primary/50 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]'
                                : 'bg-[#111] border-white/5'
                                }`}
                        >
                            {/* Badges */}
                            {plan.highlightText && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-bold px-4 py-1 rounded-full text-xs tracking-wider shadow-lg">
                                    {plan.highlightText}
                                </div>
                            )}

                            <div className="mb-6">
                                {plan.discount && (
                                    <span className="text-cyan-400 text-sm font-semibold mb-2 block">
                                        {plan.discount}
                                    </span>
                                )}
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm text-gray-400 font-medium">R$</span>
                                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                    <span className="text-gray-500">{plan.period}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="flex-1 space-y-4 mb-8">
                                {(Array.isArray(plan.features) ? plan.features : []).map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.gradient ? 'bg-primary/20 text-primary' : 'bg-white/10 text-emerald-400'
                                            }`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-white/5 flex gap-3">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className={`flex-1 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${plan.gradient
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20'
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                                        }`}>
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111]">
                            <h2 className="text-xl font-bold text-white">
                                {currentPlan.id ? 'Editar Plano' : 'Novo Plano'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Plano</label>
                                <input
                                    type="text"
                                    value={currentPlan.name || ''}
                                    onChange={e => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    placeholder="Ex: Mensal"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Preço (R$)</label>
                                    <input
                                        type="text"
                                        value={currentPlan.price || ''}
                                        onChange={e => setCurrentPlan({ ...currentPlan, price: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        placeholder="0,00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Período</label>
                                    <input
                                        type="text"
                                        value={currentPlan.period || ''}
                                        onChange={e => setCurrentPlan({ ...currentPlan, period: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        placeholder="/mês"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Benefícios</label>
                                <div className="space-y-2 mb-3 max-h-60 overflow-y-auto pr-1">
                                    {(currentPlan.features || []).map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5 group">
                                            <span className="flex-1 text-sm text-gray-300">{feature}</span>
                                            <button
                                                onClick={() => {
                                                    const newFeatures = currentPlan.features?.filter((_, i) => i !== index);
                                                    setCurrentPlan({ ...currentPlan, features: newFeatures });
                                                }}
                                                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 w-full">
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={e => setNewFeature(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newFeature.trim()) {
                                                    setCurrentPlan({
                                                        ...currentPlan,
                                                        features: [...(currentPlan.features || []), newFeature.trim()]
                                                    });
                                                    setNewFeature('');
                                                }
                                            }
                                        }}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none text-sm"
                                        placeholder="Adicionar novo benefício..."
                                    />
                                    <button
                                        onClick={() => {
                                            if (newFeature.trim()) {
                                                setCurrentPlan({
                                                    ...currentPlan,
                                                    features: [...(currentPlan.features || []), newFeature.trim()]
                                                });
                                                setNewFeature('');
                                            }
                                        }}
                                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-colors border border-white/5"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Desconto (Badge)</label>
                                <input
                                    type="text"
                                    value={currentPlan.discount || ''}
                                    onChange={e => setCurrentPlan({ ...currentPlan, discount: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    placeholder="Ex: Economize 15%"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="gradient"
                                        checked={currentPlan.gradient}
                                        onChange={e => setCurrentPlan({ ...currentPlan, gradient: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary bg-gray-800"
                                    />
                                    <label htmlFor="gradient" className="text-sm text-gray-300">Destacar este plano (Borda e Gradiente)</label>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="highlight"
                                        checked={currentPlan.highlight}
                                        onChange={e => setCurrentPlan({ ...currentPlan, highlight: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary bg-gray-800"
                                    />
                                    <label htmlFor="highlight" className="text-sm text-gray-300">Marcar como "Destaque" (Fundo diferenciado)</label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Texto de Destaque (Badge Superior)</label>
                                <input
                                    type="text"
                                    value={currentPlan.highlightText || ''}
                                    onChange={e => setCurrentPlan({ ...currentPlan, highlightText: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    placeholder="Ex: MAIS VENDIDO, RECOMENDADO"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-[#111] flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Salvar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
