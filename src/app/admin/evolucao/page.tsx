'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, User, Trash2, Edit2, Calendar, Activity, ChevronRight, X, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Student {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface Assessment {
    id: string;
    data: string;
    tipo: string;
    peso?: number;
    bioimpedancia?: any;
    dobrasCutaneas?: any;
    perimetros?: any;
}

export default function EvolucaoPage() {
    // State
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingAssessments, setLoadingAssessments] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);

    // Filtered Students
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Initial Load - Fetch all students
    useEffect(() => {
        const fetchStudents = async () => {
            setLoadingStudents(true);
            try {
                // Reusing contacts API or simpler user API if exists. 
                // Since we don't have a public Users API, we'll assume /api/chat/contacts returns students.
                // Or better, creating a dedicated endpoint logic here would be overkill, let's reuse chat contacts for now or fetch admin/users if implemented.
                // We'll use /api/chat/contacts as it returns 'ALUNO' role users.
                const res = await fetch('/api/chat/contacts');
                if (res.ok) {
                    const data = await res.json();
                    setStudents(data);
                }
            } catch (error) {
                console.error("Failed to fetch students");
            } finally {
                setLoadingStudents(false);
            }
        };
        fetchStudents();
    }, []);

    // Load Assessments when student selected
    useEffect(() => {
        if (selectedStudent) {
            fetchAssessments(selectedStudent.id);
        } else {
            setAssessments([]);
        }
    }, [selectedStudent]);

    const fetchAssessments = async (studentId: string) => {
        setLoadingAssessments(true);
        try {
            const res = await fetch(`/api/admin/assessments?alunoId=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setAssessments(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAssessments(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return;
        try {
            await fetch(`/api/admin/assessments/${id}`, { method: 'DELETE' });
            if (selectedStudent) fetchAssessments(selectedStudent.id);
        } catch (error) {
            console.error(error);
        }
    };

    // Chart Data Preparation
    const weightData = assessments
        .slice()
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
        .map(a => ({
            date: new Date(a.data).toLocaleDateString('pt-BR'),
            weight: a.peso
        }))
        .filter(d => d.weight);

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-6 overflow-hidden">
            {/* Sidebar - Student List */}
            <div className="w-80 flex flex-col bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 space-y-4">
                    <h2 className="font-bold text-white">Alunos</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar aluno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-300"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loadingStudents ? (
                        <div className="p-4 text-center text-gray-500">Carregando...</div>
                    ) : filteredStudents.map(student => (
                        <button
                            key={student.id}
                            onClick={() => setSelectedStudent(student)}
                            className={`w-full flex items-center gap-3 p-4 transition-colors border-b border-white/5 hover:bg-white/5 text-left ${selectedStudent?.id === student.id ? 'bg-white/5 border-l-2 border-l-primary' : ''
                                }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                                {student.avatar ? (
                                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white truncate">{student.name}</p>
                                <p className="text-xs text-gray-500 truncate">{student.email}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                {selectedStudent ? (
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">Evolução de {selectedStudent.name}</h1>
                                <p className="text-gray-400 text-sm">Acompanhe o progresso e avaliações físicas.</p>
                            </div>
                            <button
                                onClick={() => { setEditingAssessment(null); setIsModalOpen(true); }}
                                className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Nova Avaliação
                            </button>
                        </div>

                        {loadingAssessments ? (
                            <div className="text-center text-gray-500 py-12">Carregando dados...</div>
                        ) : assessments.length === 0 ? (
                            <div className="text-center text-gray-500 py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                                <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Nenhuma avaliação cadastrada para este aluno.</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-4 text-primary hover:underline text-sm"
                                >
                                    Cadastrar a primeira avaliação
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Charts Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/5">
                                        <h3 className="font-bold text-white mb-6">Evolução de Peso (kg)</h3>
                                        <div className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={weightData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                                    <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                                        itemStyle={{ color: '#fff' }}
                                                    />
                                                    <Line type="monotone" dataKey="weight" stroke="#4ade80" strokeWidth={2} dot={{ r: 4, fill: '#4ade80' }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    {/* Placeholder for other charts */}
                                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/5 flex items-center justify-center text-gray-600 border-dashed">
                                        <p>Outros gráficos (Gordura, Dobras) aparecerão aqui</p>
                                    </div>
                                </div>

                                {/* History Table */}
                                <div>
                                    <h3 className="font-bold text-white mb-4 text-lg">Histórico de Avaliações</h3>
                                    <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/5 bg-[#222] text-left">
                                                    <th className="p-4 text-xs font-medium text-gray-400 uppercase">Data</th>
                                                    <th className="p-4 text-xs font-medium text-gray-400 uppercase">Tipo</th>
                                                    <th className="p-4 text-xs font-medium text-gray-400 uppercase">Peso</th>
                                                    <th className="p-4 text-right text-xs font-medium text-gray-400 uppercase">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {assessments.map((a) => (
                                                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="p-4 text-sm text-white">
                                                            {new Date(a.data).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 capitalize">
                                                                {a.tipo}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-300">
                                                            {a.peso ? `${a.peso} kg` : '-'}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => { setEditingAssessment(a); setIsModalOpen(true); }}
                                                                    className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(a.id)}
                                                                    className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-400"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <Activity className="w-16 h-16 mb-4 opacity-20" />
                        <p>Selecione um aluno para ver a evolução</p>
                    </div>
                )}
            </div>

            {/* Assessment Modal */}
            <AnimatePresence>
                {isModalOpen && selectedStudent && (
                    <AssessmentModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => { setIsModalOpen(false); fetchAssessments(selectedStudent.id); }}
                        studentId={selectedStudent.id}
                        assessment={editingAssessment}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Subcomponent: Assessment Modal
function AssessmentModal({ isOpen, onClose, onSuccess, studentId, assessment }: any) {
    const isEditing = !!assessment;

    // Form State
    const [formData, setFormData] = useState({
        data: assessment ? new Date(assessment.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        tipo: assessment?.tipo || 'mensal',
        peso: assessment?.peso || '',
        // Simplification: Not implementing full JSON perimeters fields in MVP modal yet
        // If needed, we can expand later
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = isEditing
                ? `/api/admin/assessments/${assessment.id}`
                : '/api/admin/assessments';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alunoId: studentId,
                    ...formData
                })
            });

            if (res.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1a1a1a] rounded-xl border border-white/10 w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#222]">
                    <h3 className="font-bold text-white text-lg">
                        {isEditing ? 'Editar Avaliação' : 'Nova Avaliação'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Data</label>
                            <input
                                type="date"
                                value={formData.data}
                                onChange={e => setFormData({ ...formData, data: e.target.value })}
                                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Tipo</label>
                            <select
                                value={formData.tipo}
                                onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                            >
                                <option value="inicial">Inicial</option>
                                <option value="mensal">Mensal</option>
                                <option value="trimestral">Trimestral</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Peso (kg)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.peso}
                            onChange={e => setFormData({ ...formData, peso: e.target.value })}
                            placeholder="Ex: 75.5"
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                        />
                    </div>
                </form>

                <div className="p-6 pt-0 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-black hover:bg-primary/90 transition-colors"
                    >
                        Salvar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
