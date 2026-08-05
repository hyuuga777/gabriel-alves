'use client';

import { useState, useEffect } from 'react';
import { UserSquare2, Save, CheckCircle2 } from 'lucide-react';

const POSTURAL_OPTIONS = {
    frontal: [
        'Simétrico',
        'Cabeça Inclinada Direita', 'Cabeça Inclinada Esquerda',
        'Ombro Direito Elevado', 'Ombro Esquerdo Elevado',
        'Pelve Inclinada Direita', 'Pelve Inclinada Esquerda',
        'Joelho Valgo', 'Joelho Varo',
        'Pé Plano', 'Pé Cavo'
    ],
    lateral: [
        'Alinhado',
        'Protusão Cervical',
        'Hipercifose Torácica',
        'Hiperlordose Lombar',
        'Retificação Lombar',
        'Joelho Hiperestendido',
        'Joelho Flexionado'
    ],
    posterior: [
        'Simétrico',
        'Escápula Alada Direita', 'Escápula Alada Esquerda',
        'Escápula Abduzida', 'Escápula Aduzida',
        'Pé Valgo', 'Pé Varo'
    ]
};

export function PosturalTab({ studentId }: { studentId: string }) {
    const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [postura, setPostura] = useState<any>({
        frontal: [],
        lateral: [],
        posterior: [],
        observacoes: ''
    });
    
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
                
                if (data.avaliacoes && data.avaliacoes.length > 0) {
                    const latest = data.avaliacoes[0];
                    setCurrentAvaliacaoId(latest.id);
                    if (latest.postura) {
                        try { setPostura(JSON.parse(latest.postura)); } catch(e){}
                    }
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
                postura: JSON.stringify(postura),
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

    const toggleDesvio = (plano: 'frontal' | 'lateral' | 'posterior', desvio: string) => {
        setPostura((prev: any) => {
            const atual = prev[plano] || [];
            if (atual.includes(desvio)) {
                return { ...prev, [plano]: atual.filter((d: string) => d !== desvio) };
            } else {
                return { ...prev, [plano]: [...atual, desvio] };
            }
        });
    };

    if (loading) return <div className="text-center py-12 text-gray-500">Carregando avaliação...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-500 flex items-center justify-center">
                        <UserSquare2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Avaliação Postural</h2>
                        <p className="text-gray-400 text-sm">Registre desvios nos planos frontal, lateral e posterior.</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                        saveSuccess ? 'bg-green-500 text-white' : 
                        'bg-pink-500 text-white hover:bg-pink-600 hover:scale-105'
                    }`}
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : saveSuccess ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saveSuccess ? 'Salvo!' : 'Salvar Avaliação'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Plano Frontal */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Plano Frontal</h3>
                    <div className="space-y-2">
                        {POSTURAL_OPTIONS.frontal.map(desvio => {
                            const isSelected = (postura.frontal || []).includes(desvio);
                            return (
                                <button
                                    key={desvio}
                                    onClick={() => toggleDesvio('frontal', desvio)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${
                                        isSelected ? 'bg-pink-500/20 border-pink-500 text-pink-400 font-medium' : 'bg-black/30 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-300'
                                    }`}
                                >
                                    {desvio}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Plano Lateral */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Plano Lateral</h3>
                    <div className="space-y-2">
                        {POSTURAL_OPTIONS.lateral.map(desvio => {
                            const isSelected = (postura.lateral || []).includes(desvio);
                            return (
                                <button
                                    key={desvio}
                                    onClick={() => toggleDesvio('lateral', desvio)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${
                                        isSelected ? 'bg-pink-500/20 border-pink-500 text-pink-400 font-medium' : 'bg-black/30 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-300'
                                    }`}
                                >
                                    {desvio}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Plano Posterior */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Plano Posterior</h3>
                    <div className="space-y-2">
                        {POSTURAL_OPTIONS.posterior.map(desvio => {
                            const isSelected = (postura.posterior || []).includes(desvio);
                            return (
                                <button
                                    key={desvio}
                                    onClick={() => toggleDesvio('posterior', desvio)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${
                                        isSelected ? 'bg-pink-500/20 border-pink-500 text-pink-400 font-medium' : 'bg-black/30 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-300'
                                    }`}
                                >
                                    {desvio}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Observações Posturais Adicionais</h3>
                <textarea 
                    value={postura.observacoes || ''}
                    onChange={(e) => setPostura(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Descreva assimetrias e encurtamentos não listados acima..."
                    className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
            </div>
        </div>
    );
}
