'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Search,
    ClipboardList,
    Plus,
    X,
    Pencil,
    Trash2,
    Loader2,
    ChevronDown,
    ChevronUp,
    Calendar,
    Weight,
    FileText,
    AlertCircle,
} from 'lucide-react';

interface Aluno {
    id: string;
    name: string;
    email: string;
    image?: string;
}

interface Avaliacao {
    id: string;
    alunoId: string;
    tipo: string;
    data: string;
    peso?: number;
    observacoes?: string;
    bioimpedancia?: Record<string, string | number>;
    dobrasCutaneas?: Record<string, string | number>;
    perimetros?: Record<string, string | number>;
}

type TipoAvaliacao = 'inicial' | 'mensal' | 'trimestral';

const TIPO_LABELS: Record<TipoAvaliacao, string> = {
    inicial: 'Inicial',
    mensal: 'Mensal',
    trimestral: 'Trimestral',
};

const TIPO_COLORS: Record<TipoAvaliacao, string> = {
    inicial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    mensal: 'bg-[#00caca]/10 text-[#00caca] border-[#00caca]/20',
    trimestral: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const emptyForm = {
    tipo: 'mensal' as TipoAvaliacao,
    data: new Date().toISOString().split('T')[0],
    peso: '',
    observacoes: '',
    bioimpedancia: { massaMagra: '', massaGorda: '', aguaCorporal: '', massaOssea: '' },
    dobrasCutaneas: { triceps: '', subescapular: '', biceps: '', suprailiaca: '', abdomen: '', coxa: '', panturrilha: '' },
    perimetros: { abdomen: '', bracoD: '', bracoE: '', pernaD: '', pernaE: '', cintura: '', quadril: '' },
};

type FormData = typeof emptyForm;

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}

function populateJson(obj?: Record<string, string | number>): Record<string, string> {
    if (!obj) return {};
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v ?? '')]));
}

function JsonSection({
    title,
    fields,
    data,
    onChange,
}: {
    title: string;
    fields: { key: string; label: string; unit?: string }[];
    data: Record<string, string>;
    onChange: (key: string, value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const hasValues = Object.values(data).some(v => v !== '');
    return (
        <div className="border border-white/5 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 bg-black/30 hover:bg-black/50 transition-colors text-sm font-medium text-gray-300"
            >
                <span className="flex items-center gap-2">
                    {title}
                    {hasValues && <span className="w-2 h-2 rounded-full bg-[#00caca]" />}
                </span>
                {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {open && (
                <div className="grid grid-cols-2 gap-3 p-4 bg-black/10">
                    {fields.map(f => (
                        <div key={f.key}>
                            <label className="block text-xs text-gray-500 mb-1">{f.label}{f.unit ? ` (${f.unit})` : ''}</label>
                            <input
                                type="number"
                                step="0.1"
                                value={data[f.key] ?? ''}
                                onChange={e => onChange(f.key, e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:border-[#00caca]/50 outline-none"
                                placeholder="—"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminAvaliacoesPage() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [alunosLoading, setAlunosLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [avaliacoesLoading, setAvaliacoesLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/admin/users')
            .then(r => r.json())
            .then((data: Aluno[]) => setAlunos(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setAlunosLoading(false));
    }, []);

    const loadAvaliacoes = useCallback(async (alunoId: string) => {
        setAvaliacoesLoading(true);
        try {
            const res = await fetch(`/api/admin/assessments?alunoId=${alunoId}`);
            const data = await res.json();
            setAvaliacoes(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setAvaliacoes([]);
        } finally {
            setAvaliacoesLoading(false);
        }
    }, []);

    const handleSelectAluno = (aluno: Aluno) => {
        setSelectedAluno(aluno);
        loadAvaliacoes(aluno.id);
    };

    const openCreate = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (av: Avaliacao) => {
        setEditingId(av.id);
        setFormData({
            tipo: (av.tipo as TipoAvaliacao) || 'mensal',
            data: av.data ? av.data.split('T')[0] : new Date().toISOString().split('T')[0],
            peso: av.peso != null ? String(av.peso) : '',
            observacoes: av.observacoes || '',
            bioimpedancia: { massaMagra: '', massaGorda: '', aguaCorporal: '', massaOssea: '', ...populateJson(av.bioimpedancia) },
            dobrasCutaneas: { triceps: '', subescapular: '', biceps: '', suprailiaca: '', abdomen: '', coxa: '', panturrilha: '', ...populateJson(av.dobrasCutaneas) },
            perimetros: { abdomen: '', bracoD: '', bracoE: '', pernaD: '', pernaE: '', cintura: '', quadril: '', ...populateJson(av.perimetros) },
        });
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditingId(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAluno) return;
        setSubmitting(true);
        const cleanJson = (obj: Record<string, string>) =>
            Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '').map(([k, v]) => [k, parseFloat(v)]));
        const payload = {
            alunoId: selectedAluno.id,
            tipo: formData.tipo,
            data: formData.data,
            peso: formData.peso !== '' ? formData.peso : null,
            observacoes: formData.observacoes || null,
            bioimpedancia: cleanJson(formData.bioimpedancia),
            dobrasCutaneas: cleanJson(formData.dobrasCutaneas),
            perimetros: cleanJson(formData.perimetros),
        };
        try {
            const url = editingId ? `/api/admin/assessments/${editingId}` : '/api/admin/assessments';
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error('Erro ao salvar');
            closeModal();
            loadAvaliacoes(selectedAluno.id);
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar avaliação. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir esta avaliação?')) return;
        setDeletingId(id);
        try {
            await fetch(`/api/admin/assessments/${id}`, { method: 'DELETE' });
            setAvaliacoes(prev => prev.filter(a => a.id !== id));
        } catch (e) {
            console.error(e);
        } finally {
            setDeletingId(null);
        }
    };

    const alunosFiltrados = alunos.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Avaliações</h1>
                <p className="text-sm text-gray-400 mt-1">Selecione um aluno e gerencie suas avaliações físicas.</p>
            </div>

            <div className="flex gap-5" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
                {/* Left: student list */}
                <div className="w-72 flex-shrink-0 flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-3 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar aluno..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#00caca]/50 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {alunosLoading ? (
                            <div className="flex items-center justify-center py-12 text-gray-500">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Carregando...
                            </div>
                        ) : alunosFiltrados.length === 0 ? (
                            <div className="py-10 text-center text-sm text-gray-500">Nenhum aluno encontrado.</div>
                        ) : alunosFiltrados.map(aluno => {
                            const active = selectedAluno?.id === aluno.id;
                            return (
                                <button
                                    key={aluno.id}
                                    onClick={() => handleSelectAluno(aluno)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-white/5 last:border-0 ${active ? 'bg-[#00caca]/10 border-l-2 border-l-[#00caca]' : 'hover:bg-white/[0.03]'}`}
                                >
                                    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${active ? 'bg-[#00caca]/20 text-[#00caca]' : 'bg-white/5 text-gray-400'}`}>
                                        {aluno.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-sm font-semibold truncate ${active ? 'text-white' : 'text-gray-300'}`}>{aluno.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{aluno.email}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: assessments */}
                <div className="flex-1 flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
                    {!selectedAluno ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                <ClipboardList className="w-8 h-8 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">Nenhum aluno selecionado</p>
                                <p className="text-sm text-gray-500 mt-1">Selecione um aluno na lista ao lado para ver ou criar avaliações.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#00caca]/20 flex items-center justify-center text-[#00caca] font-bold text-sm">
                                        {selectedAluno.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{selectedAluno.name}</p>
                                        <p className="text-xs text-gray-500">{selectedAluno.email}</p>
                                    </div>
                                </div>
                                <button onClick={openCreate} className="flex items-center gap-2 bg-[#00caca] text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#00caca]/90 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    Nova Avaliação
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {avaliacoesLoading ? (
                                    <div className="flex items-center justify-center py-16 text-gray-500">
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Carregando avaliações...
                                    </div>
                                ) : avaliacoes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                                        <AlertCircle className="w-8 h-8 text-gray-600" />
                                        <p className="text-sm text-gray-500">Nenhuma avaliação cadastrada para este aluno.<br />Clique em <strong className="text-gray-300">Nova Avaliação</strong> para começar.</p>
                                    </div>
                                ) : avaliacoes.map(av => (
                                    <div key={av.id} className="bg-black/30 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${TIPO_COLORS[av.tipo as TipoAvaliacao] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                                    {TIPO_LABELS[av.tipo as TipoAvaliacao] ?? av.tipo}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(av.data)}
                                                </div>
                                                {av.peso && (
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                                        <Weight className="w-3.5 h-3.5" />
                                                        {av.peso} kg
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(av)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Editar">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(av.id)} disabled={deletingId === av.id} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors" title="Excluir">
                                                    {deletingId === av.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        {av.observacoes && (
                                            <div className="mt-3 flex gap-2 text-sm text-gray-400">
                                                <FileText className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-600" />
                                                <p className="leading-relaxed">{av.observacoes}</p>
                                            </div>
                                        )}
                                        {(av.bioimpedancia || av.dobrasCutaneas || av.perimetros) && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {av.bioimpedancia && Object.keys(av.bioimpedancia).length > 0 && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">Bioimpedância</span>
                                                )}
                                                {av.dobrasCutaneas && Object.keys(av.dobrasCutaneas).length > 0 && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">Dobras Cutâneas</span>
                                                )}
                                                {av.perimetros && Object.keys(av.perimetros).length > 0 && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">Perímetros</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center flex-shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-white">{editingId ? 'Editar Avaliação' : 'Nova Avaliação'}</h2>
                                <p className="text-xs text-gray-500 mt-0.5">{selectedAluno?.name}</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Tipo</label>
                                    <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value as TipoAvaliacao })} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00caca]/50 outline-none appearance-none">
                                        <option value="inicial">Inicial</option>
                                        <option value="mensal">Mensal</option>
                                        <option value="trimestral">Trimestral</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Data</label>
                                    <input required type="date" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00caca]/50 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Peso (kg)</label>
                                <input type="number" step="0.1" min="0" value={formData.peso} onChange={e => setFormData({ ...formData, peso: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#00caca]/50 outline-none" placeholder="Ex: 75.5" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Observações</label>
                                <textarea rows={3} value={formData.observacoes} onChange={e => setFormData({ ...formData, observacoes: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#00caca]/50 outline-none resize-none" placeholder="Anotações sobre o aluno, progresso, observações gerais..." />
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dados Avançados (opcional)</p>
                                <JsonSection title="Bioimpedância" fields={[{ key: 'massaMagra', label: 'Massa Magra', unit: 'kg' }, { key: 'massaGorda', label: 'Massa Gorda', unit: 'kg' }, { key: 'aguaCorporal', label: 'Água Corporal', unit: '%' }, { key: 'massaOssea', label: 'Massa Óssea', unit: 'kg' }]} data={formData.bioimpedancia} onChange={(k, v) => setFormData(prev => ({ ...prev, bioimpedancia: { ...prev.bioimpedancia, [k]: v } }))} />
                                <JsonSection title="Dobras Cutâneas" fields={[{ key: 'triceps', label: 'Tríceps', unit: 'mm' }, { key: 'subescapular', label: 'Subescapular', unit: 'mm' }, { key: 'biceps', label: 'Bíceps', unit: 'mm' }, { key: 'suprailiaca', label: 'Supra-ilíaca', unit: 'mm' }, { key: 'abdomen', label: 'Abdômen', unit: 'mm' }, { key: 'coxa', label: 'Coxa', unit: 'mm' }, { key: 'panturrilha', label: 'Panturrilha', unit: 'mm' }]} data={formData.dobrasCutaneas} onChange={(k, v) => setFormData(prev => ({ ...prev, dobrasCutaneas: { ...prev.dobrasCutaneas, [k]: v } }))} />
                                <JsonSection title="Perímetros" fields={[{ key: 'abdomen', label: 'Abdômen', unit: 'cm' }, { key: 'bracoD', label: 'Braço D.', unit: 'cm' }, { key: 'bracoE', label: 'Braço E.', unit: 'cm' }, { key: 'pernaD', label: 'Perna D.', unit: 'cm' }, { key: 'pernaE', label: 'Perna E.', unit: 'cm' }, { key: 'cintura', label: 'Cintura', unit: 'cm' }, { key: 'quadril', label: 'Quadril', unit: 'cm' }]} data={formData.perimetros} onChange={(k, v) => setFormData(prev => ({ ...prev, perimetros: { ...prev.perimetros, [k]: v } }))} />
                            </div>
                            <button type="submit" disabled={submitting} className="w-full bg-[#00caca] text-black font-bold py-3 rounded-lg hover:bg-[#00caca]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : editingId ? 'Salvar Alterações' : 'Criar Avaliação'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
