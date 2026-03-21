'use client';

import { Suspense, use, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Edit2, Pencil, Trash2, Plus, Calendar, Clock, Activity, FileText } from 'lucide-react';
import { MOCK_TREINOS } from '@/lib/mock-db';

// Reusing part of the mock from the list page for realism
const MOCK_ALUNOS_LISTA = [
    {
        id: 'aluno-1',
        nome: 'Carlos Silva',
        email: 'carlos.silva@email.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=33',
        status: 'ATIVO',
        plano: 'Trimestral',
        vencimento: '15/11/2026',
        ultimoTreino: 'Ontem',
        dataEntrada: '10/01/2025',
        idade: 28,
        telefone: '(11) 99999-9999',
        restricoes: 'Dor leve no ombro direito ao realizar desenvolvimento com barra livre. Priorizar halteres.',
        treinosTotal: 45
    }
];

type TabType = 'visao-geral' | 'treinos' | 'avaliacoes' | 'financeiro';

interface Props {
    params: Promise<{ id: string }>;
}

export default function AdminAlunoPerfilWrapper({ params }: Props) {
    const resolvedParams = use(params);
    return (
        <Suspense fallback={<div className="p-8 text-white">Carregando Perfil...</div>}>
            <AdminAlunoPerfil id={resolvedParams.id} />
        </Suspense>
    );
}

function AdminAlunoPerfil({ id }: { id: string }) {
    const [activeTab, setActiveTab] = useState<TabType>('visao-geral');
    const [aluno, setAluno] = useState<any>(null);
    const [planos, setPlanos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [alunoRes, planosRes] = await Promise.all([
                fetch(`/api/admin/users/${id}`),
                fetch('/api/admin/plans')
            ]);

            if (!alunoRes.ok) throw new Error('Erro ao carregar aluno');
            const alunoData = await alunoRes.json();
            setAluno(alunoData);

            if (planosRes.ok) {
                const planosData = await planosRes.json();
                setPlanos(planosData);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useState(() => {
        fetchData();
    });

    if (loading) return <div className="p-8 text-white">Carregando Perfil...</div>;
    if (error) return <div className="p-8 text-red-500">Erro: {error}</div>;
    if (!aluno) return <div className="p-8 text-white">Aluno não encontrado.</div>;

    return (
        <div className="space-y-6">
            {/* 1. Header do Perfil */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-8">
                <Link
                    href="/admin/alunos"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Voltar para Alunos
                </Link>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <img
                            src={aluno.avatarUrl}
                            alt={aluno.nome}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/10"
                        />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{aluno.nome}</h1>

                                {aluno.status === 'ATIVO' ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
                                        Ativo
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                                        {aluno.status}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400">{aluno.email}</p>
                            <p className="text-xs text-gray-500 mt-2">Cliente desde {aluno.dataEntrada}</p>
                        </div>
                    </div>

                    <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-white/10">
                        <Edit2 className="w-4 h-4" />
                        Editar Dados
                    </button>
                </div>
            </div>

            {/* 2. Navegação em Abas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
                {[
                    { id: 'visao-geral', label: 'Visão Geral' },
                    { id: 'treinos', label: 'Treinos' },
                    { id: 'avaliacoes', label: 'Avaliações' },
                    { id: 'financeiro', label: 'Financeiro' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 3. Contesdo da Aba */}
            <div className="pt-2">
                {activeTab === 'visao-geral' && <AbaVisaoGeral aluno={aluno} />}
                {activeTab === 'treinos' && <AbaTreinos treinos={aluno.atribuicoes || []} />}
                {activeTab === 'avaliacoes' && (
                    <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
                        <p className="text-gray-500">Módulo de avaliações físicas em desenvolvimento.</p>
                    </div>
                )}
                {activeTab === 'financeiro' && (
                    <AbaFinanceiro 
                        aluno={aluno} 
                        planos={planos} 
                        onUpdate={fetchData}
                    />
                )}
            </div>
        </div>
    );
}

// ------ SUB-COMPONENTES PARA AS ABAS ------

function AbaVisaoGeral({ aluno }: { aluno: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card Dados Pessoais */}
            <div className="bg-[#111111] p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <UserSquare2Icon className="w-4 h-4" />
                    <h3 className="text-sm font-semibold">Dados Pessoais</h3>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Idade</p>
                    <p className="text-sm text-white font-medium">{aluno.idade} anos</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Telefone</p>
                    <p className="text-sm text-white font-medium">{aluno.telefone}</p>
                </div>
            </div>

            {/* Card Plano Atual */}
            <div className="bg-[#111111] p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <h3 className="text-sm font-semibold">Plano Atual</h3>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Modalidade</p>
                    <p className="text-sm text-white font-medium">{aluno.plano}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Vencimento</p>
                    <p className="text-sm text-white font-medium">{aluno.vencimento}</p>
                </div>
            </div>

            {/* Card Performance */}
            <div className="bg-[#111111] p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Activity className="w-4 h-4" />
                    <h3 className="text-sm font-semibold">Performance</h3>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Total de Treinos Feitos</p>
                    <p className="text-sm text-white font-medium">{aluno.treinosTotal} treinos</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">último Acesso</p>
                    <p className="text-sm text-white font-medium">{aluno.ultimoTreino}</p>
                </div>
            </div>

            {/* Card Restrições */}
            <div className="bg-[#111111] p-5 rounded-2xl border border-white/5 space-y-4 lg:col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                    <FileText className="w-4 h-4" />
                    <h3 className="text-sm font-semibold">Restrições / Notas</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                    {aluno.restricoes}
                </p>
            </div>
        </div>
    );
}

function AbaTreinos({ treinos }: { treinos: any[] }) {
    if (!treinos || treinos.length === 0) {
        return (
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Nenhum treino atribuído</h3>
                <p className="text-sm text-gray-400 mb-6 max-w-sm">Este aluno ainda não possui nenhuma ficha de treino ativa no momento.</p>
                <Link href={`/admin/alunos/${treinos[0]?.alunoId || 'novo'}/atribuir`} className="flex items-center gap-2 bg-primary text-black px-5 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                    <Plus className="w-5 h-5" />
                    Atribuir Primeiro Treino
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Fichas Ativas</h2>
                <Link
                    href={`/admin/alunos/${treinos[0]?.alunoId}/atribuir`}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Atribuir Treino
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {treinos.map((atribuicao) => (
                    <div key={atribuicao.id} className="bg-[#111111] border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{atribuicao.treino.nome}</h3>
                            <p className="text-sm text-gray-400 mb-3">{atribuicao.treino.descricao || 'Sem descrição'}</p>
                            <div className="flex gap-2">
                                <span className="inline-block bg-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                                    {atribuicao.treino.tipo}
                                </span>
                                <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                                    {atribuicao.ativo ? 'Ativo' : 'Pausado'}
                                </span>
                            </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 justify-end">
                            <Link 
                                href={`/admin/treinos/${atribuicao.treinoId}`}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Ver Ficha
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AbaFinanceiro({ aluno, planos, onUpdate }: { aluno: any, planos: any[], onUpdate: () => void }) {
    const [selectedPlano, setSelectedPlano] = useState(aluno.assinatura?.planoId || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdatePlano = async () => {
        if (!selectedPlano) return;
        
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/users/${aluno.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planoId: selectedPlano })
            });

            if (res.ok) {
                alert('Plano atualizado com sucesso!');
                onUpdate();
            } else {
                alert('Erro ao atualizar plano.');
            }
        } catch (err) {
            alert('Erro de conexão.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6">Gestão de Assinatura</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-400">Plano Atual</label>
                        <select 
                            value={selectedPlano}
                            onChange={(e) => setSelectedPlano(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="">Selecione um plano</option>
                            {planos.map(p => (
                                <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleUpdatePlano}
                            disabled={isUpdating || !selectedPlano || selectedPlano === aluno.assinatura?.planoId}
                            className="w-full bg-primary text-black font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? 'Atualizando...' : 'Salvar Alteração de Plano'}
                        </button>
                    </div>

                    <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Status da Assinatura</h4>
                                <p className="text-sm text-gray-400">{aluno.assinatura?.status || 'SEM PLANO'}</p>
                            </div>
                        </div>
                        
                        {aluno.assinatura && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Início:</span>
                                    <span className="text-white">{new Date(aluno.assinatura.dataInicio).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Vencimento:</span>
                                    <span className="text-white">
                                        {aluno.assinatura.dataFim ? new Date(aluno.assinatura.dataFim).toLocaleDateString('pt-BR') : 'Indeterminado'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Histórico de Pagamentos</h3>
                <div className="text-center py-8 text-gray-500 border border-dashed border-white/5 rounded-xl">
                    Nenhum pagamento registrado no sistema ainda.
                </div>
            </div>
        </div>
    );
}

// Pequeno mock de icone pro componente visual
function UserSquare2Icon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        </svg>
    )
}
