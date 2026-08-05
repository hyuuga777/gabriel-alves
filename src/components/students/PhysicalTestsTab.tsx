'use client';

import { useState, useEffect } from 'react';
import { Activity, Dumbbell, Timer, Flame, Save, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export function PhysicalTestsTab({ studentId }: { studentId: string }) {
    const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Testes Anaeróbios (Força Máxima)
    const [forcaMaxima, setForcaMaxima] = useState<any>({});
    
    // Testes Aeróbios
    const [vo2Max, setVo2Max] = useState<string>('');
    const [cooperTest, setCooperTest] = useState<string>('');
    
    // Teste Isométrico
    const [potenciaIso, setPotenciaIso] = useState<any>({});
    
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [currentAvaliacaoId, setCurrentAvaliacaoId] = useState<string | null>(null);

    useEffect(() => {
        fetchAvaliacoes();
    }, [studentId]);

    const fetchAvaliacoes = async () => {
        try {
            const res = await fetch(`/api/admin/users/${studentId}/avaliacoes`);
            if (res.ok) {
                const data = await res.json();
                setAvaliacoes(data.avaliacoes || []);
                
                // Pega a mais recente para popular os inputs
                if (data.avaliacoes && data.avaliacoes.length > 0) {
                    const latest = data.avaliacoes[0];
                    setCurrentAvaliacaoId(latest.id);
                    
                    if (latest.forcaMaxima) {
                        try { setForcaMaxima(JSON.parse(latest.forcaMaxima)); } catch(e){}
                    }
                    if (latest.potenciaIso) {
                        try { setPotenciaIso(JSON.parse(latest.potenciaIso)); } catch(e){}
                    }
                    setVo2Max(latest.vo2Max?.toString() || '');
                    setCooperTest(latest.cooperTest?.toString() || '');
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                forcaMaxima: JSON.stringify(forcaMaxima),
                potenciaIso: JSON.stringify(potenciaIso),
                vo2Max: vo2Max ? parseFloat(vo2Max) : null,
                cooperTest: cooperTest ? parseFloat(cooperTest) : null,
            };

            let res;
            if (currentAvaliacaoId) {
                res = await fetch(`/api/admin/users/${studentId}/avaliacoes/${currentAvaliacaoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(`/api/admin/users/${studentId}/avaliacoes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res?.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const updateForca = (exercicio: string, campo: 'carga' | 'repeticoes', valor: string) => {
        setForcaMaxima((prev: any) => ({
            ...prev,
            [exercicio]: {
                ...prev[exercicio],
                [campo]: valor
            }
        }));
    };

    const updateIso = (exercicio: string, tempo: string) => {
        setPotenciaIso((prev: any) => ({
            ...prev,
            [exercicio]: tempo
        }));
    };

    if (loading) return <div className="text-center py-12 text-gray-500">Carregando testes...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Testes Físicos e Desempenho</h2>
                        <p className="text-gray-400 text-sm">Registre avaliações aeróbias, anaeróbias e isométricas.</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                        saveSuccess ? 'bg-green-500 text-white' : 
                        'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                    }`}
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : saveSuccess ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saveSuccess ? 'Salvo!' : 'Salvar Testes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Teste Anaeróbio */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Dumbbell className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Teste Anaeróbio (Força Máxima)</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {['Supino Reto', 'Agachamento Livre', 'Levantamento Terra'].map(ex => (
                            <div key={ex} className="flex items-center justify-between gap-4 bg-black/30 p-4 rounded-2xl border border-white/5">
                                <span className="text-sm font-medium text-gray-300 w-1/3">{ex}</span>
                                <div className="flex items-center gap-2 w-2/3">
                                    <input 
                                        type="number" 
                                        placeholder="Carga (kg)"
                                        value={forcaMaxima[ex]?.carga || ''}
                                        onChange={(e) => updateForca(ex, 'carga', e.target.value)}
                                        className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-2 text-white text-center focus:border-purple-400 focus:outline-none"
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Reps"
                                        value={forcaMaxima[ex]?.repeticoes || ''}
                                        onChange={(e) => updateForca(ex, 'repeticoes', e.target.value)}
                                        className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-2 text-white text-center focus:border-purple-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Teste Aeróbio */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">Teste Aeróbio</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Teste de Cooper (Distância em 12min)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={cooperTest}
                                    onChange={(e) => setCooperTest(e.target.value)}
                                    placeholder="Ex: 2400"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-orange-400 focus:outline-none"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">metros</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">VO2 Máx Estimado</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    step="0.1"
                                    value={vo2Max}
                                    onChange={(e) => setVo2Max(e.target.value)}
                                    placeholder="Ex: 45.5"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-orange-400 focus:outline-none"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">ml/kg/min</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teste Isométrico */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Timer className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Teste Isométrico (Sustentação)</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {['Prancha Abdominal', 'Cadeirinha (Wall Sit)'].map(ex => (
                            <div key={ex} className="flex items-center justify-between gap-4 bg-black/30 p-4 rounded-2xl border border-white/5">
                                <span className="text-sm font-medium text-gray-300">{ex}</span>
                                <div className="relative w-32">
                                    <input 
                                        type="number" 
                                        placeholder="Segundos"
                                        value={potenciaIso[ex] || ''}
                                        onChange={(e) => updateIso(ex, e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-center focus:border-green-400 focus:outline-none pr-8"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">s</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
