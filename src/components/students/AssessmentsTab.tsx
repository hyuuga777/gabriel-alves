'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Activity, Dumbbell, ClipboardList, Save, ChevronDown, CheckCircle } from 'lucide-react';
import { calculate1RM, calculateCooperVO2Max } from '@/lib/calculators';

export function AssessmentsTab({ student }: { student: any }) {
    const [activeSection, setActiveSection] = useState<'anaerobic' | 'aerobic' | 'isometry' | 'postural'>('anaerobic');
    const [isSaving, setIsSaving] = useState(false);

    // Anaerobic State
    const [anaerobicTest, setAnaerobicTest] = useState({
        exercise: 'Supino Reto',
        weight: '',
        reps: ''
    });
    const estimated1RM = calculate1RM(Number(anaerobicTest.weight), Number(anaerobicTest.reps));

    // Aerobic State
    const [cooperDistance, setCooperDistance] = useState('');
    const vo2Max = calculateCooperVO2Max(Number(cooperDistance));

    // Postural State
    const [posturalData, setPosturalData] = useState({
        coluna: 'Neutra',
        ombros: 'Nivelados',
        escapulas: 'Neutras',
        pelve: 'Niveladas',
        tornozelo: 'Neutros'
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API save
        await new Promise(r => setTimeout(r, 800));
        alert('Testes físicos e posturais salvos com sucesso!');
        setIsSaving(false);
    };

    const SectionBtn = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveSection(id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase transition-all ${
                activeSection === id 
                ? 'bg-primary text-black' 
                : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                <SectionBtn id="anaerobic" label="Força (Anaeróbio)" icon={Dumbbell} />
                <SectionBtn id="aerobic" label="Cardio (Aeróbio)" icon={Activity} />
                <SectionBtn id="isometry" label="Isometria" icon={Target} />
                <SectionBtn id="postural" label="Avaliação Postural" icon={ClipboardList} />
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {/* ANAEROBIC */}
                    {activeSection === 'anaerobic' && (
                        <motion.div key="anaerobic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white">Teste de 1RM (Força Máxima)</h3>
                                <p className="text-xs text-gray-400">Insira a carga máxima e o número de repetições realizadas (até 15) para prever o 1RM.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Exercício</label>
                                    <select 
                                        value={anaerobicTest.exercise}
                                        onChange={e => setAnaerobicTest({...anaerobicTest, exercise: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm mt-1"
                                    >
                                        <option>Supino Reto</option>
                                        <option>Agachamento Livre</option>
                                        <option>Leg Press 45</option>
                                        <option>Puxada Frontal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Carga (kg)</label>
                                    <input 
                                        type="number" 
                                        value={anaerobicTest.weight}
                                        onChange={e => setAnaerobicTest({...anaerobicTest, weight: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm mt-1" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Repetições</label>
                                    <input 
                                        type="number" 
                                        value={anaerobicTest.reps}
                                        onChange={e => setAnaerobicTest({...anaerobicTest, reps: e.target.value})}
                                        max="15"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm mt-1" 
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">1RM Estimado (Fórmula de Brzycki)</p>
                                <div className="text-4xl font-black text-white">
                                    {estimated1RM > 0 ? `${estimated1RM.toFixed(1)} kg` : '--'}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* AEROBIC */}
                    {activeSection === 'aerobic' && (
                        <motion.div key="aerobic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white">Teste de Cooper (12 Minutos)</h3>
                                <p className="text-xs text-gray-400">Avaliação cardiovascular baseada na distância percorrida em 12 minutos corridos.</p>
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Distância Percorrida (metros)</label>
                                <input 
                                    type="number" 
                                    value={cooperDistance}
                                    onChange={e => setCooperDistance(e.target.value)}
                                    className="w-full max-w-md bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm mt-1" 
                                />
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">VO2 Máximo Estimado</p>
                                <div className="text-4xl font-black text-white">
                                    {vo2Max > 0 ? `${vo2Max.toFixed(2)} ml/kg/min` : '--'}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ISOMETRY */}
                    {activeSection === 'isometry' && (
                        <motion.div key="isometry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white">Testes de Isometria e Potência</h3>
                                <p className="text-xs text-gray-400">Registros de tempo sob tensão e taxa de execução para testes funcionais.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    'Prancha Frontal (>60s)',
                                    'Prancha Lateral Direita (>45s)',
                                    'Prancha Lateral Esquerda (>45s)',
                                    'Teste de Sorensen (>60s)',
                                    'Cadeirinha Bilateral (>60s)'
                                ].map(test => (
                                    <div key={test} className="flex items-center justify-between bg-black/50 border border-white/5 p-4 rounded-xl">
                                        <span className="text-sm font-medium text-gray-300">{test}</span>
                                        <input 
                                            type="number" 
                                            placeholder="Segundos"
                                            className="w-24 bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-primary/50 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* POSTURAL */}
                    {activeSection === 'postural' && (
                        <motion.div key="postural" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white">Avaliação Postural</h3>
                                <p className="text-xs text-gray-400">Selecione os desvios posturais observados nas vistas frontal, lateral e posterior.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Coluna', field: 'coluna', options: ['Neutra', 'Inclinada - Esquerda', 'Inclinada - Direita'] },
                                    { label: 'Ombros', field: 'ombros', options: ['Nivelados', 'Elevados', 'Deprimidos'] },
                                    { label: 'Escápulas', field: 'escapulas', options: ['Neutras', 'Aduzidas', 'Abduzidas', 'Rotatas - Superior', 'Aladas'] },
                                    { label: 'Pelve (EIPS)', field: 'pelve', options: ['Niveladas', 'Desalinhada - Esquerdo', 'Desalinhada - Direito'] },
                                    { label: 'Tornozelo', field: 'tornozelo', options: ['Neutros', 'Supinados', 'Pronados'] }
                                ].map(section => (
                                    <div key={section.field} className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase">{section.label}</label>
                                        <select 
                                            value={(posturalData as any)[section.field]}
                                            onChange={e => setPosturalData({...posturalData, [section.field]: e.target.value})}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm"
                                        >
                                            {section.options.map(opt => (
                                                <option key={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-8 pt-6 border-t border-white/5">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold uppercase tracking-widest text-xs p-4 rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Salvando Testes...' : 'Salvar Avaliações Físicas'}
                        {!isSaving && <Save className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
