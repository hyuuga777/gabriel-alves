'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Play, Edit, Trash2, X, Loader2, FolderPlus, Tag, Check, Edit3 } from 'lucide-react';

const DEFAULT_GROUPS = [
    'Peito',
    'Costas',
    'Pernas',
    'Quadríceps',
    'Posterior',
    'Glúteos',
    'Ombros',
    'Bíceps',
    'Tríceps',
    'Abdômen',
    'Panturrilha',
    'Antebraço',
    'Cardio',
    'Geral'
];

export default function AdminExerciciosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('Todos');
    const [exercicios, setExercicios] = useState<any[]>([]);
    const [availableGroups, setAvailableGroups] = useState<string[]>(DEFAULT_GROUPS);
    const [isLoading, setIsLoading] = useState(true);
    
    // Exercise Modal
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
    const [isSavingExercise, setIsSavingExercise] = useState(false);
    const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
    const [exerciseForm, setExerciseForm] = useState({ nome: '', grupoMuscular: 'Peito', videoUrl: '' });
    
    // Inline Custom Group Mode in Exercise Modal
    const [isCustomGroupMode, setIsCustomGroupMode] = useState(false);
    const [customGroupInput, setCustomGroupInput] = useState('');

    // Group Management Modal
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isSavingGroup, setIsSavingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    // Fetch Exercises
    const fetchExercises = async () => {
        try {
            const res = await fetch('/api/admin/exercises');
            if (res.ok) {
                const data = await res.json();
                setExercicios(data);
            }
        } catch (error) {
            console.error('Failed to fetch exercises', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch Groups
    const fetchGroups = async () => {
        try {
            const res = await fetch('/api/admin/exercises/groups');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setAvailableGroups(data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch groups', error);
        }
    };

    useEffect(() => {
        fetchExercises();
        fetchGroups();
    }, []);

    // Helper: Parse group array/string safely
    const parseGroups = (rawGroup: any): string[] => {
        if (!rawGroup) return ['Geral'];
        if (Array.isArray(rawGroup)) return rawGroup;
        if (typeof rawGroup === 'string') {
            const trimmed = rawGroup.trim();
            if (trimmed.startsWith('[')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) return parsed;
                } catch {
                    // Fallthrough if parse fails
                }
            }
            return [trimmed.replace(/[\[\]\\"]/g, '')];
        }
        return ['Geral'];
    };

    // Gather all unique groups for filtering (from API + existing exercises)
    const allUniqueGroups = Array.from(new Set([
        ...availableGroups,
        ...exercicios.flatMap(ex => parseGroups(ex.grupoMuscular))
    ])).filter(Boolean);

    const handleSaveExercise = async () => {
        if (!exerciseForm.nome.trim()) return alert('Nome do exercício é obrigatório');
        
        let targetGroup = exerciseForm.grupoMuscular;

        // If user is in custom group mode and typed a group name
        if (isCustomGroupMode && customGroupInput.trim()) {
            targetGroup = customGroupInput.trim();
            try {
                await fetch('/api/admin/exercises/groups', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: targetGroup })
                });
                setAvailableGroups(prev => Array.from(new Set([...prev, targetGroup])));
            } catch (e) {
                console.error("Error creating custom group:", e);
            }
        }

        if (!targetGroup || targetGroup === '__CUSTOM__') {
            return alert('Selecione ou digite um grupo muscular válido.');
        }

        setIsSavingExercise(true);
        try {
            const payload = {
                id: editingExerciseId || undefined,
                nome: exerciseForm.nome.trim(),
                grupoMuscular: [targetGroup],
                videoUrl: exerciseForm.videoUrl.trim()
            };

            const method = editingExerciseId ? 'PUT' : 'POST';
            const res = await fetch('/api/admin/exercises', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsExerciseModalOpen(false);
                setEditingExerciseId(null);
                setIsCustomGroupMode(false);
                setCustomGroupInput('');
                setExerciseForm({ nome: '', grupoMuscular: availableGroups[0] || 'Peito', videoUrl: '' });
                fetchExercises();
                fetchGroups();
            } else {
                alert('Erro ao salvar exercício.');
            }
        } catch (error) {
            alert('Erro de conexão ao tentar salvar exercício.');
        } finally {
            setIsSavingExercise(false);
        }
    };

    const handleDeleteExercise = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o exercício "${name}"?`)) return;
        try {
            const res = await fetch(`/api/admin/exercises?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchExercises();
            } else {
                alert('Erro ao excluir exercício.');
            }
        } catch (error) {
            alert('Erro de conexão ao tentar excluir exercício.');
        }
    };

    const handleCreateGroup = async (groupNameToAdd?: string) => {
        const nameToUse = groupNameToAdd || newGroupName;
        if (!nameToUse || !nameToUse.trim()) return alert('Digite o nome do novo grupo');

        setIsSavingGroup(true);
        try {
            const res = await fetch('/api/admin/exercises/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameToUse.trim() })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.groups) {
                    setAvailableGroups(data.groups);
                } else {
                    setAvailableGroups(prev => [...prev, nameToUse.trim()]);
                }
                setNewGroupName('');
                if (isExerciseModalOpen) {
                    setExerciseForm(prev => ({ ...prev, grupoMuscular: nameToUse.trim() }));
                    setIsCustomGroupMode(false);
                }
            } else {
                alert('Erro ao criar grupo');
            }
        } catch (error) {
            alert('Erro ao salvar novo grupo');
        } finally {
            setIsSavingGroup(false);
        }
    };

    const handleDeleteGroup = async (groupName: string) => {
        if (!confirm(`Deseja remover o grupo "${groupName}"?`)) return;
        try {
            const res = await fetch('/api/admin/exercises/groups', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: groupName })
            });

            if (res.ok) {
                const data = await res.json();
                setAvailableGroups(data.groups || availableGroups.filter(g => g !== groupName));
            }
        } catch (error) {
            alert('Erro ao remover grupo');
        }
    };

    const filteredExercicios = exercicios.filter(ex => {
        const matchesSearch = ex.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const exGroups = parseGroups(ex.grupoMuscular);
        const matchesGroup = selectedGroup === 'Todos' || exGroups.includes(selectedGroup);
        return matchesSearch && matchesGroup;
    });

    const getGroupBadgeColor = (group: string) => {
        const lower = group.toLowerCase();
        if (lower.includes('peito')) return 'bg-primary/10 text-primary border-primary/20';
        if (lower.includes('costas')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        if (lower.includes('perna') || lower.includes('quadríceps') || lower.includes('coxa')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        if (lower.includes('ombro')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        if (lower.includes('bíceps')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
        if (lower.includes('tríceps')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        if (lower.includes('glúteo') || lower.includes('posterior')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        if (lower.includes('abdômen') || lower.includes('core')) return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
        if (lower.includes('cardio') || lower.includes('aeróbico')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        return 'bg-gray-500/10 text-gray-300 border-gray-500/20';
    };

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        Biblioteca de Exercícios
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Gerencie os movimentos e agrupamentos disponíveis para as fichas.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        onClick={() => setIsGroupModalOpen(true)}
                    >
                        <FolderPlus className="w-4 h-4 text-primary" />
                        + Criar Novo Grupo
                    </button>
                    <button
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 cursor-pointer"
                        onClick={() => {
                            setEditingExerciseId(null);
                            setIsCustomGroupMode(false);
                            setCustomGroupInput('');
                            setExerciseForm({ nome: '', grupoMuscular: availableGroups[0] || 'Peito', videoUrl: '' });
                            setIsExerciseModalOpen(true);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Novo Exercício
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-[#111111] p-4 rounded-2xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar exercício pelo nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    <button
                        onClick={() => setSelectedGroup('Todos')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${selectedGroup === 'Todos'
                            ? 'bg-primary text-black border-primary'
                            : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        Todos ({exercicios.length})
                    </button>
                    
                    {allUniqueGroups.map(group => (
                        <button
                            key={group}
                            onClick={() => setSelectedGroup(group)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap border cursor-pointer ${selectedGroup === group
                                ? 'bg-primary text-black border-primary font-bold'
                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {group}
                        </button>
                    ))}

                    <button
                        onClick={() => setIsGroupModalOpen(true)}
                        className="px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 flex items-center gap-1.5 cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" /> Grupo
                    </button>
                </div>
            </div>

            {/* Exercise Cards Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredExercicios.map(ex => {
                        const groupsList = parseGroups(ex.grupoMuscular);
                        return (
                            <div key={ex.id} className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all group relative overflow-hidden flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4 gap-2">
                                        <div className="flex flex-wrap gap-1">
                                            {groupsList.map((g, idx) => (
                                                <span key={idx} className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getGroupBadgeColor(g)}`}>
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {
                                                    setEditingExerciseId(ex.id);
                                                    setIsCustomGroupMode(false);
                                                    setCustomGroupInput('');
                                                    setExerciseForm({ 
                                                        nome: ex.nome, 
                                                        grupoMuscular: groupsList[0] || 'Peito', 
                                                        videoUrl: ex.videoUrl || '' 
                                                    });
                                                    setIsExerciseModalOpen(true);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                                title="Editar exercício"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteExercise(ex.id, ex.nome)}
                                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                                title="Excluir exercício"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-white font-bold text-lg mb-4 line-clamp-2">{ex.nome}</h3>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                    {ex.videoUrl ? (
                                        <a
                                            href={ex.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                            </div>
                                            Ver Vídeo Demonstrativo
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 text-xs flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
                                                <Play className="w-3.5 h-3.5 opacity-50" />
                                            </div>
                                            Sem Vídeo
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {filteredExercicios.length === 0 && (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-2xl">
                            <p className="text-gray-400 font-bold text-base">Nenhum exercício encontrado</p>
                            <p className="text-gray-600 text-xs mt-1">Tente mudar o filtro de busca ou adicione um novo exercício.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Criar Novo Grupo / Agrupamento */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <FolderPlus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Gerenciar Grupos Musculares</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Crie novos agrupamentos para os exercícios.</p>
                                </div>
                            </div>
                            <button onClick={() => setIsGroupModalOpen(false)} className="text-gray-500 hover:text-white p-2 transition-colors cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome do Novo Grupo*</label>
                                <div className="flex gap-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Ex: Quadríceps, Posterior, Cardio..."
                                        value={newGroupName}
                                        onChange={e => setNewGroupName(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleCreateGroup(); }}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => handleCreateGroup()}
                                        disabled={isSavingGroup || !newGroupName.trim()}
                                        className="bg-primary text-black px-4 py-3 rounded-xl font-bold text-xs uppercase hover:bg-primary/90 transition-all disabled:opacity-40 cursor-pointer"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            </div>

                            {/* Sugestões rápidas */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sugestões Rápidas</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Quadríceps', 'Posterior de Coxa', 'Glúteos', 'Panturrilha', 'Antebraço', 'Ombro Lateral', 'Cardio', 'Mobilidade'].map(sugg => {
                                        const alreadyExists = availableGroups.some(g => g.toLowerCase() === sugg.toLowerCase());
                                        if (alreadyExists) return null;
                                        return (
                                            <button
                                                key={sugg}
                                                onClick={() => handleCreateGroup(sugg)}
                                                className="px-2.5 py-1 bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 rounded-lg text-xs text-gray-300 transition-all flex items-center gap-1 cursor-pointer"
                                            >
                                                + {sugg}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Grupos Atuais */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Grupos Ativos ({allUniqueGroups.length})</label>
                                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                                    {allUniqueGroups.map(group => (
                                        <div key={group} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl text-sm">
                                            <span className="text-white font-medium flex items-center gap-2">
                                                <Tag className="w-3.5 h-3.5 text-primary" />
                                                {group}
                                            </span>
                                            {!DEFAULT_GROUPS.includes(group) && (
                                                <button
                                                    onClick={() => handleDeleteGroup(group)}
                                                    className="text-gray-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                                    title="Excluir grupo customizado"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
                            <button
                                onClick={() => setIsGroupModalOpen(false)}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 cursor-pointer"
                            >
                                Concluído
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Novo / Editar Exercício */}
            {isExerciseModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {editingExerciseId ? 'Editar Exercício' : 'Novo Exercício'}
                            </h3>
                            <button onClick={() => setIsExerciseModalOpen(false)} className="text-gray-500 hover:text-white p-2 transition-colors cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nome do Exercício*</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Ex: Supino Inclinado"
                                    value={exerciseForm.nome}
                                    onChange={e => setExerciseForm({ ...exerciseForm, nome: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none text-sm"
                                />
                            </div>

                            {/* Grupo Muscular com Opção Personalizada Inline */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Grupo Muscular*</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCustomGroupMode(!isCustomGroupMode);
                                            if (!isCustomGroupMode) setCustomGroupInput('');
                                        }}
                                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        {isCustomGroupMode ? '← Selecionar da Lista' : '+ Opção Personalizada'}
                                    </button>
                                </div>

                                {isCustomGroupMode ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Digite o novo grupo muscular..."
                                            value={customGroupInput}
                                            onChange={e => setCustomGroupInput(e.target.value)}
                                            className="flex-1 bg-black/50 border border-primary/50 rounded-xl px-4 py-3 text-white focus:outline-none text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCustomGroupMode(false);
                                                setCustomGroupInput('');
                                            }}
                                            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-xs font-bold transition-all border border-white/10 cursor-pointer"
                                            title="Voltar para a lista"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <select
                                        value={exerciseForm.grupoMuscular}
                                        onChange={e => {
                                            if (e.target.value === '__CUSTOM__') {
                                                setIsCustomGroupMode(true);
                                                setCustomGroupInput('');
                                            } else {
                                                setExerciseForm({ ...exerciseForm, grupoMuscular: e.target.value });
                                            }
                                        }}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none text-sm cursor-pointer"
                                    >
                                        {allUniqueGroups.map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                        <option value="__CUSTOM__">➕ Digitar Grupo Personalizado...</option>
                                    </select>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">URL do Vídeo (Opcional)</label>
                                <input
                                    type="text"
                                    placeholder="https://youtube.com/..."
                                    value={exerciseForm.videoUrl}
                                    onChange={e => setExerciseForm({ ...exerciseForm, videoUrl: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
                            <button
                                onClick={() => setIsExerciseModalOpen(false)}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-white/5 text-sm cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveExercise}
                                disabled={isSavingExercise}
                                className="flex-1 bg-primary text-black px-4 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm cursor-pointer"
                            >
                                {isSavingExercise ? 'Salvando...' : 'Salvar Exercício'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
