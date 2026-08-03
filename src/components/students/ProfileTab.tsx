'use client';

import { useState } from 'react';
import { Save, AlertCircle, Calendar, Target, Activity, Dumbbell, ShieldAlert, Zap, TrendingUp, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateTrainingLevel } from '@/lib/calculators';

export function ProfileTab({ student }: { student: any }) {
    const [isSaving, setIsSaving] = useState(false);
    
    // Anamnese Forms
    const [dores, setDores] = useState(student?.alunoProfile?.doresIntensidade || '');
    const [objetivos, setObjetivos] = useState(student?.alunoProfile?.objetivos || '');
    const [pontosFracos, setPontosFracos] = useState(student?.alunoProfile?.pontosFracos || '');
    const [pontosFortes, setPontosFortes] = useState(student?.alunoProfile?.pontosFortes || '');
    const [proibidos, setProibidos] = useState(student?.alunoProfile?.exerciciosProibidos || '');
    
    // Nível de Treinamento
    const [pontosLevel, setPontosLevel] = useState({
        tempoTreino: 1,
        destreino: 1,
        experiencia: 1,
        tecnica: 1,
        forca: 1
    });

    const levelResult = calculateTrainingLevel(
        pontosLevel.tempoTreino, 
        pontosLevel.destreino, 
        pontosLevel.experiencia, 
        pontosLevel.tecnica, 
        pontosLevel.forca
    );

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                doresIntensidade: dores,
                objetivos,
                pontosFracos,
                pontosFortes,
                exerciciosProibidos: proibidos,
                nivelTreinamentoPontuacao: levelResult.score
                // TODO: Save to API via PUT request to update profile
            };
            
            // Simular request
            await new Promise(r => setTimeout(r, 800));
            alert('Perfil clínico salvo com sucesso!');
        } catch (e) {
            alert('Erro ao salvar');
        } finally {
            setIsSaving(false);
        }
    };

    const LevelBtn = ({ label, value, current, field }: any) => (
        <button
            onClick={() => setPontosLevel(prev => ({ ...prev, [field]: value }))}
            className={`flex-1 p-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                current === value 
                ? 'bg-primary text-black border-primary' 
                : 'bg-white/5 text-gray-500 hover:text-gray-300 border-white/5 hover:bg-white/10'
            }`}
        >
            {label} ({value}pt)
        </button>
    );

    return (
        <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SECTION: ANAMNESE E OBSERVAÇÕES */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Anamnese & Perfil</h2>
                            <p className="text-xs text-gray-400">Objetivos, dores e limitações do aluno</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Target className="w-3.5 h-3.5" /> Objetivos Principais
                            </label>
                            <textarea 
                                value={objetivos}
                                onChange={e => setObjetivos(e.target.value)}
                                rows={2}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 focus:outline-none" 
                                placeholder="Ex: Hipertrofia com foco em pernas..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <ShieldAlert className="w-3.5 h-3.5" /> Dores e Intensidade
                            </label>
                            <textarea 
                                value={dores}
                                onChange={e => setDores(e.target.value)}
                                rows={2}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 focus:outline-none" 
                                placeholder="Ex: Dor lombar leve ao agachar..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <TrendingUp className="w-3.5 h-3.5 text-green-500" /> Pontos Fortes
                                </label>
                                <textarea 
                                    value={pontosFortes}
                                    onChange={e => setPontosFortes(e.target.value)}
                                    rows={2}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 focus:outline-none" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <TrendingUp className="w-3.5 h-3.5 text-red-500" style={{ transform: 'scaleY(-1)' }} /> Pontos Fracos
                                </label>
                                <textarea 
                                    value={pontosFracos}
                                    onChange={e => setPontosFracos(e.target.value)}
                                    rows={2}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 focus:outline-none" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Exercícios Proibidos
                            </label>
                            <textarea 
                                value={proibidos}
                                onChange={e => setProibidos(e.target.value)}
                                rows={2}
                                className="w-full bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-sm text-red-200 focus:border-red-500/50 focus:outline-none" 
                                placeholder="Ex: Agachamento Livre, Stiff..."
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION: NÍVEL DE TREINAMENTO E ROTINA */}
                <div className="space-y-6">
                    <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Nível de Treinamento</h2>
                                    <p className="text-xs text-gray-400">Baseado em Santos Junior et al. (2021)</p>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <div className="text-2xl font-black text-primary">{levelResult.score} pt</div>
                                <div className="text-[10px] font-bold uppercase text-white px-2 py-0.5 bg-primary/20 rounded-md">
                                    {levelResult.classification}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Tempo Ininterrupto', field: 'tempoTreino', opts: ['< 6 Meses', '6-12 Meses', '1-2 Anos', '> 2 Anos'] },
                                { label: 'Destreino', field: 'destreino', opts: ['Muitas Pausas', 'Algumas', 'Raramente', 'Constante'] },
                                { label: 'Experiência Prévia', field: 'experiencia', opts: ['Nenhuma', 'Pouca', 'Média', 'Alta'] },
                                { label: 'Técnica de Movimento', field: 'tecnica', opts: ['Iniciante', 'Básica', 'Boa', 'Avançada'] },
                                { label: 'Valores de Força', field: 'forca', opts: ['Baixo', 'Moderado', 'Alto', 'Muito Alto'] }
                            ].map(item => (
                                <div key={item.field} className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">{item.label}</label>
                                    <div className="flex gap-2">
                                        {item.opts.map((opt, idx) => (
                                            <LevelBtn 
                                                key={idx} 
                                                label={opt} 
                                                value={idx + 1} 
                                                current={(pontosLevel as any)[item.field]} 
                                                field={item.field} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold uppercase tracking-widest text-xs p-4 rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Perfil e Anamnese'}
                        {!isSaving && <Save className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
