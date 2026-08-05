'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AnamneseModalProps {
    onComplete: () => void;
}

export default function AnamneseModal({ onComplete }: AnamneseModalProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        dataNascimento: '',
        genero: 'MASCULINO',
        altura: '',
        pesoInicial: '',
        nivelAtividade: 'SEDENTARIO',
        objetivos: '',
        historicoSaude: '',
        restricoes: '',
        doresIntensidade: '',
        limitacoes: '',
        referenciaObjetivo: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/aluno/perfil', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alunoProfile: {
                        ...formData,
                        altura: parseFloat(formData.altura),
                        pesoInicial: parseFloat(formData.pesoInicial),
                        onboardingCompleto: true,
                    }
                }),
            });

            if (!res.ok) throw new Error('Erro ao salvar anamnese');
            onComplete();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto">
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 w-full max-w-2xl my-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo(a) ao Team Alves!</h2>
                    <p className="text-gray-400">
                        Para montarmos seu treino ideal, precisamos de algumas informações essenciais.
                        Por favor, preencha esta anamnese com atenção.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-white/10'}`} />
                        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`} />
                        <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-white/10'}`} />
                    </div>
                </div>

                {error && (
                    <div className="p-3 mb-4 text-red-500 bg-red-500/10 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                    {/* STEP 1: DADOS BÁSICOS */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">1. Dados Básicos</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">Data de Nascimento</label>
                                    <input required type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className="w-full p-3 bg-black border border-white/10 rounded-lg text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">Gênero</label>
                                    <select name="genero" value={formData.genero} onChange={handleChange} className="w-full p-3 bg-black border border-white/10 rounded-lg text-white">
                                        <option value="MASCULINO">Masculino</option>
                                        <option value="FEMININO">Feminino</option>
                                        <option value="OUTRO">Outro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">Altura (m) ex: 1.75</label>
                                    <input required type="number" step="0.01" name="altura" value={formData.altura} onChange={handleChange} placeholder="1.75" className="w-full p-3 bg-black border border-white/10 rounded-lg text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">Peso Atual (kg)</label>
                                    <input required type="number" step="0.1" name="pesoInicial" value={formData.pesoInicial} onChange={handleChange} placeholder="70.5" className="w-full p-3 bg-black border border-white/10 rounded-lg text-white" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-400">Nível de Atividade</label>
                                <select name="nivelAtividade" value={formData.nivelAtividade} onChange={handleChange} className="w-full p-3 bg-black border border-white/10 rounded-lg text-white">
                                    <option value="SEDENTARIO">Sedentário</option>
                                    <option value="LEVE">Leve (1-2x/sem)</option>
                                    <option value="MODERADO">Moderado (3-4x/sem)</option>
                                    <option value="INTENSO">Intenso (5+x/sem)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: OBJETIVOS E REFERÊNCIAS */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">2. Objetivos e Referências</h3>
                            
                            <div className="space-y-1">
                                <label className="text-sm text-gray-400">Qual o seu principal objetivo?</label>
                                <textarea required name="objetivos" value={formData.objetivos} onChange={handleChange} placeholder="Ex: Hipertrofia, Perda de peso, Saúde..." className="w-full p-3 bg-black border border-white/10 rounded-lg text-white h-24" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-400">Referência de Objetivo</label>
                                <textarea required name="referenciaObjetivo" value={formData.referenciaObjetivo} onChange={handleChange} placeholder="Ex: Quero um shape parecido com o de fulano, ou apenas me sentir melhor..." className="w-full p-3 bg-black border border-white/10 rounded-lg text-white h-24" />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SAÚDE E LIMITAÇÕES */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">3. Saúde e Limitações</h3>
                            
                            <div className="space-y-1">
                                <label className="text-sm text-gray-400">Histórico de Saúde / Restrições Médicas</label>
                                <textarea name="historicoSaude" value={formData.historicoSaude} onChange={handleChange} placeholder="Possui alguma doença, pressão alta, diabetes, toma algum remédio contínuo?" className="w-full p-3 bg-black border border-white/10 rounded-lg text-white h-20" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-400">Dores e Intensidade</label>
                                <textarea name="doresIntensidade" value={formData.doresIntensidade} onChange={handleChange} placeholder="Sente dor em alguma articulação? Onde e qual a intensidade (0 a 10)?" className="w-full p-3 bg-black border border-white/10 rounded-lg text-white h-20" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-400">Principais Limitações / Exercícios Proibidos (Médico)</label>
                                <textarea name="limitacoes" value={formData.limitacoes} onChange={handleChange} placeholder="O que você não consegue ou foi proibido de fazer?" className="w-full p-3 bg-black border border-white/10 rounded-lg text-white h-20" />
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex gap-3 justify-end">
                        {step > 1 && (
                            <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-lg font-medium border border-white/10 text-white hover:bg-white/5 transition-colors">
                                Voltar
                            </button>
                        )}
                        {step < 3 ? (
                            <button type="submit" className="px-6 py-2.5 rounded-lg font-medium bg-primary text-black hover:bg-primary/90 transition-colors">
                                Próximo
                            </button>
                        ) : (
                            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg font-medium bg-primary text-black hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                                {loading ? 'Salvando...' : 'Finalizar Anamnese'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
