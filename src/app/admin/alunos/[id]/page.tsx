'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    MessageSquare, 
    Calendar, 
    User, 
    Dumbbell, 
    Activity, 
    Ruler, 
    Camera, 
    Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { WorkoutsTab } from '@/components/students/WorkoutsTab';
import { StatsTab } from '@/components/students/StatsTab';
import { MeasurementsTab } from '@/components/students/MeasurementsTab';
import { PhotosTab } from '@/components/students/PhotosTab';
import { SettingsTab } from '@/components/students/SettingsTab';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TABS = [
    { id: 'workouts', label: 'Programas', icon: Dumbbell },
    { id: 'stats', label: 'Performance', icon: Activity },
    { id: 'measurements', label: 'Medidas', icon: Ruler },
    { id: 'photos', label: 'Evolução', icon: Camera },
    { id: 'settings', label: 'Gestão', icon: Settings },
];

export default function StudentProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState('workouts');
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [situacaoStatus, setSituacaoStatus] = useState<string>('INATIVO');

    useEffect(() => {
        if (student) {
            const savedStatus = localStorage.getItem('mock_user_status');
            setSituacaoStatus(savedStatus || student.assinatura?.status || 'INATIVO');
        }
    }, [student]);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await fetch(`/api/admin/users/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setStudent(data);
                }
            } catch (error) {
                console.error("Error fetching student:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Carregando Perfil...</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Aluno não encontrado</h1>
                    <Link href="/admin/alunos" className="text-primary hover:underline">Voltar para lista</Link>
                </div>
            </div>
        );
    }

    const dataInicio = student.createdAt ? format(new Date(student.createdAt), "MMM yyyy", { locale: ptBR }) : 'N/A';
    const numTreinos = student.atribuicoes?.length || 0;

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12">
            {/* Navigation Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                <div className="flex items-center gap-6">
                    <Link 
                        href="/admin/alunos" 
                        className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all group"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl lg:text-5xl font-black tracking-tightest">{student.name}</h1>
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                                situacaoStatus === 'ATIVA' 
                                    ? 'bg-primary/10 text-primary border-primary/20' 
                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>{situacaoStatus}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {student.email}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Início: {dataInicio}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/5">
                        <MessageSquare className="w-4 h-4" />
                        Chat Direto
                    </button>
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                    { label: 'Treinos / Ativos', value: numTreinos, unit: 'programas', color: 'text-primary' },
                    { label: 'Taxa Adesão', value: student.taxaAdesao || '94', unit: '%', color: 'text-green-400' },
                    { label: 'Plano', value: student.assinatura?.plano?.nome || 'Nenhum', unit: '', color: 'text-blue-400' },
                    { label: 'Dias Restantes', value: '15', unit: 'dias', color: 'text-yellow-500' },
                ].map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white/5 border border-white/5 p-6 rounded-3xl"
                    >
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
                            <span className="text-[10px] text-gray-600 font-bold uppercase">{stat.unit}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded-[2rem] border border-white/5 mb-12 overflow-x-auto no-scrollbar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2.5 px-6 py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'bg-white text-black shadow-lg' 
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-gray-600'}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="relative min-h-[600px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'workouts' && <WorkoutsTab student={student} />}
                        {activeTab === 'stats' && <StatsTab />}
                        {activeTab === 'measurements' && <MeasurementsTab />}
                        {activeTab === 'photos' && <PhotosTab />}
                        {activeTab === 'settings' && (
                            <SettingsTab 
                                student={student} 
                                onUpdate={() => {
                                    // Recarrega os dados do aluno após salvar
                                    const fetchStudent = async () => {
                                        try {
                                            const res = await fetch(`/api/admin/users/${id}`);
                                            if (res.ok) {
                                                const data = await res.json();
                                                setStudent(data);
                                            }
                                        } catch (e) { console.error(e); }
                                    };
                                    fetchStudent();
                                }} 
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
