'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, UserSquare2, X, Loader2 } from 'lucide-react';

interface Plano {
    id: string;
    nome: string;
    preco: number;
}

interface Aluno {
    id: string;
    name: string;
    email: string;
    image?: string;
    assinatura?: {
        status: string;
        dataFim: string;
        plano?: {
            nome: string;
        };
    };
    treinoLogs: { createdAt: string }[];
}

export default function AdminAlunosPage() {
    const router = useRouter();
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        telefone: '',
        planoId: ''
    });

    const fetchData = useCallback(async () => {
        try {
            const [alunosRes, planosRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/plans')
            ]);
            
            const alunosData = await alunosRes.json();
            const planosData = await planosRes.json();
            
            setAlunos(alunosData);
            setPlanos(planosData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Falha ao criar aluno');

            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', telefone: '', planoId: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar aluno. Verifique os dados e tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerPerfil = (id: string) => {
        router.push(`/admin/alunos/${id}`);
    };

    const alunosFiltrados = alunos.filter(aluno => {
        const matchesName = aluno.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           aluno.email.toLowerCase().includes(searchTerm.toLowerCase());
        const status = aluno.assinatura?.status || 'INATIVO';
        const matchesStatus = filterStatus === 'Todos' || status === filterStatus;
        return matchesName && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ATIVA':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">Ativo</span>;
            case 'PENDENTE':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pendente</span>;
            case 'EXPIRADA':
            case 'SUSPENSA':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">Atrasado</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">Inativo</span>;
        }
    };

    const formatLastWorkout = (logs: { createdAt: string }[]) => {
        if (!logs || logs.length === 0) return 'Nunca';
        const lastDate = new Date(logs[0].createdAt);
        const diff = Date.now() - lastDate.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Hoje';
        if (days === 1) return 'Ontem';
        return `Há ${days} dias`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Meus Alunos</h1>
                    <p className="text-sm text-gray-400 mt-1">Gerencie seus alunos, planos e acompanhe os treinos.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Aluno
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-[#111111] p-4 rounded-xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    />
                </div>
                <div className="relative w-full sm:w-48 flex items-center">
                    <Filter className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer"
                    >
                        <option value="Todos">Todos os Status</option>
                        <option value="ATIVA">Ativos</option>
                        <option value="PENDENTE">Pendentes</option>
                        <option value="EXPIRADA">Inativos / Expirados</option>
                    </select>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider bg-black/20">
                                <th className="px-6 py-4 font-medium">Aluno</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Plano</th>
                                <th className="px-6 py-4 font-medium">Vencimento</th>
                                <th className="px-6 py-4 font-medium">último Treino</th>
                                <th className="px-6 py-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            Carregando alunos...
                                        </div>
                                    </td>
                                </tr>
                            ) : alunosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            ) : (
                                alunosFiltrados.map((aluno) => (
                                    <tr
                                        key={aluno.id}
                                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                        onClick={() => handleVerPerfil(aluno.id)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
                                                    {aluno.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-tight">{aluno.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{aluno.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(aluno.assinatura?.status || 'INATIVO')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {aluno.assinatura?.plano?.nome || 'Sem plano'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {aluno.assinatura?.dataFim ? new Date(aluno.assinatura.dataFim).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {formatLastWorkout(aluno.treinoLogs)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <UserSquare2 className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors inline-block" />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Novo Aluno */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Novo Aluno</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nome Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-primary outline-none"
                                    placeholder="Ex: João Silva"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-primary outline-none"
                                    placeholder="joao@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Senha Temporária</label>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-primary outline-none"
                                    placeholder="mínimo 6 caracteres"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Telefone</label>
                                    <input
                                        type="text"
                                        value={formData.telefone}
                                        onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-primary outline-none"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Plano Inicial</label>
                                    <select
                                        required
                                        value={formData.planoId}
                                        onChange={e => setFormData({ ...formData, planoId: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary outline-none appearance-none"
                                    >
                                        <option value="">Selecione...</option>
                                        {planos.map(plano => (
                                            <option key={plano.id} value={plano.id}>{plano.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Criando...
                                    </>
                                ) : (
                                    'Cadastrar Aluno'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
