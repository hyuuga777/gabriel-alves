'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, MoreVertical, Edit2, UserSquare2 } from 'lucide-react';

const MOCK_ALUNOS_LISTA = [
    {
        id: 'aluno-1',
        nome: 'Carlos Silva',
        email: 'carlos.silva@email.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=33',
        status: 'ATIVO',
        plano: 'Trimestral',
        vencimento: '15/11/2026',
        ultimoTreino: 'Ontem'
    },
    {
        id: 'aluno-2',
        nome: 'Mariana Souza',
        email: 'mari.souza@email.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
        status: 'INADIMPLENTE',
        plano: 'Mensal',
        vencimento: '01/10/2026',
        ultimoTreino: 'Há 5 dias'
    },
    {
        id: 'aluno-3',
        nome: 'João Pedro',
        email: 'jp.treinamento@email.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        status: 'ATIVO',
        plano: 'Anual',
        vencimento: '20/08/2027',
        ultimoTreino: 'Hoje'
    },
    {
        id: 'aluno-4',
        nome: 'Renata Alves',
        email: 'renata.fit@email.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        status: 'INATIVO',
        plano: 'Mensal',
        vencimento: 'Cancelado',
        ultimoTreino: 'Nunca'
    },
    {
        id: 'aluno-5',
        nome: 'Lucas Mendes',
        email: 'lucas.mendes22@email.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=60',
        status: 'ATIVO',
        plano: 'Trimestral',
        vencimento: '05/12/2026',
        ultimoTreino: 'Há 2 dias'
    }
];

export default function AdminAlunosPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Todos');

    const handleNovoAluno = () => {
        alert('Funcionalidade "Novo Aluno" em desenvolvimento.');
    };

    const handleVerPerfil = (id: string) => {
        router.push(`/admin/alunos/${id}`);
    };

    // Filtros Simples
    const alunosFiltrados = MOCK_ALUNOS_LISTA.filter(aluno => {
        const matchesName = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'Todos' || aluno.status === filterStatus.toUpperCase();
        return matchesName && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ATIVO':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">Ativo</span>;
            case 'INADIMPLENTE':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">Inadimplente</span>;
            case 'INATIVO':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">Inativo</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header da Página */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Meus Alunos</h1>
                    <p className="text-sm text-gray-400 mt-1">Gerencie seus alunos, planos e acompanhe os treinos.</p>
                </div>
                <button
                    onClick={handleNovoAluno}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Aluno
                </button>
            </div>

            {/* Barra de Ferramentas */}
            <div className="flex flex-col sm:flex-row gap-4 bg-[#111111] p-4 rounded-xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
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
                        <option value="Ativo">Ativo</option>
                        <option value="Inadimplente">Inadimplente</option>
                        <option value="Inativo">Inativo</option>
                    </select>
                </div>
            </div>

            {/* Tabela de Alunos (Desktop & Mobile Scroll) */}
            <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider bg-black/20">
                                <th className="px-6 py-4 font-medium">Aluno</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Plano</th>
                                <th className="px-6 py-4 font-medium">Vencimento</th>
                                <th className="px-6 py-4 font-medium">Último Treino</th>
                                <th className="px-6 py-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {alunosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                                        Nenhum aluno encontrado para os filtros atuais.
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
                                                <img src={aluno.avatarUrl} alt={aluno.nome} className="w-10 h-10 rounded-full border border-white/10" />
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-tight">{aluno.nome}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{aluno.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(aluno.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {aluno.plano}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {aluno.vencimento}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {aluno.ultimoTreino}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita navegar 2x já que a linha toda clica
                                                    handleVerPerfil(aluno.id);
                                                }}
                                                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors inline-block"
                                                title="Ver Perfil"
                                            >
                                                <UserSquare2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
