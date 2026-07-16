'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewStudentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telefone: '',
        password: '',
        confirmPassword: '',
        planoId: '',
    });

    const [planos, setPlanos] = useState<any[]>([]);

    useEffect(() => {
        const fetchPlanos = async () => {
            try {
                const response = await fetch('/api/admin/plans');
                if (response.ok) {
                    const data = await response.json();
                    
                    // Filter plans as requested: only 'Basic' and 'Ultra'
                    const filteredPlanos = data.filter((p: any) => 
                        p.nome === 'Basic' || p.nome === 'Ultra'
                    );
                    
                    setPlanos(filteredPlanos);
                }
            } catch (error) {
                console.error("Failed to fetch plans", error);
            }
        };
        fetchPlanos();
    }, []);

    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    telefone: formData.telefone,
                    password: formData.password,
                    planoId: formData.planoId || null
                }),
            });

            if (!response.ok) {
                const data = await response.text();
                throw new Error(data === 'Email already exists' ? 'Este email já está cadastrado' : 'Erro ao criar aluno');
            }

            router.push('/admin/alunos');
            router.refresh();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Um erro desconhecido ocorreu');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/alunos"
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Novo Aluno</h1>
                    <p className="text-gray-400 text-sm">Cadastre um novo aluno para acesso ao app.</p>
                </div>
            </div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-[#111] border border-white/5 rounded-xl p-8 space-y-6"
            >
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary text-gray-300"
                            placeholder="Ex: João da Silva"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary text-gray-300"
                            placeholder="Ex: joao@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Telefone / WhatsApp</label>
                        <input
                            type="tel"
                            value={formData.telefone}
                            onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary text-gray-300"
                            placeholder="Ex: (11) 99999-9999"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Plano de Assinatura</label>
                        <select
                            value={formData.planoId}
                            onChange={e => setFormData({ ...formData, planoId: e.target.value })}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary text-gray-300 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <option value="">Selecione um plano (Opcional)</option>
                            {planos.map((plano) => (
                                <option key={plano.id} value={plano.id} className="bg-[#1a1a1a]">
                                    {plano.nome} - R$ {Number(plano.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Senha Provisória</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary text-gray-300 pr-10"
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar Senha</label>
                            <input
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary text-gray-300"
                                placeholder="Repita a senha"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link
                        href="/admin/alunos"
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Salvar Aluno
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
