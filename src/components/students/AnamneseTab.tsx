import { useState, useEffect } from 'react';
import { FileText, Save, AlertCircle, CheckCircle2, User, Activity, Target, ShieldAlert, Zap } from 'lucide-react';

const METODOS_TREINO = [
    'REPETIÇÕES FORÇADAS ou ROUBADA',
    '"DROP-SET" OU REGRESSIVO ou EXAUSTÃO',
    'EXCÊNTRICO ou NEGATIVO',
    'CONCENTRADO',
    'INSISTÊNCIA ou BOMBEADA',
    'DIVISÃO DOS MOVIMENTOS',
    'SUSTENTAÇÃO ou ISOMÉTRICO',
    'TEMPO SOB TENSÃO ("TRAINING TO FAILURE")',
    'PIRÂMIDE CRESCENTE',
    'PIRÂMIDE DECRESCENTE',
    'PIRÂMIDE TRUNCADA',
    'SUPER-SÉRIES (BI, TRI, POLI SET) ou CIRCUITOS',
    'CONTRASTES',
    'PLIOMÉTRICO',
    'PAUSA',
    'SUPERLENTO ou "SUPER-SLOW"',
    'PRIORIDADE MUSCULAR',
    'SÉRIE GIGANTE',
    'PICO DE CONTRAÇÃO',
    'D.T.A. (DOR-TORTURA-AGONIA) ou PONTO FALHO',
    'PRÉ-EXAUSTÃO',
    'QUEIMA',
    'BLITZ',
    '"STRIP-SET"',
    'GVT ("GERMAN VOLUME TRAINING")',
    'SST ("SARCOPLASMA STIMULATING TRAINING")',
    'FST-7 ("FASCIA STRETCH TRAINING")',
    'ISOMÉTRICOS',
    '"REST-PAUSE HYPERTROPHY" ("CLUSTER SERIES")',
    '"REST-PAUSE STRENGTH" ("CLUSTER SERIES")'
];

interface MetodoRow {
    nome: string;
    datas: [string, string, string, string];
    observacoes: string;
    peso: string;
    gorduraResultados: string;
}

export function AnamneseTab({ student, onUpdate }: { student: any, onUpdate: () => void }) {
    const profile = student?.alunoProfile;

    const [anotacoes, setAnotacoes] = useState(student?.anotacoes || '');
    
    // Admin editable fields in AlunoProfile
    const [pontosFracos, setPontosFracos] = useState(profile?.pontosFracos || '');
    const [pontosFortes, setPontosFortes] = useState(profile?.pontosFortes || '');
    const [exerciciosProibidos, setExerciciosProibidos] = useState(profile?.exerciciosProibidos || '');
    
    // Metodos utilized (Table State)
    const [metodos, setMetodos] = useState<MetodoRow[]>([]);

    useEffect(() => {
        // Initialize table
        let parsedMetodos: any[] = [];
        if (profile?.metodosUtilizados) {
            try {
                const parsed = JSON.parse(profile.metodosUtilizados);
                // Backward compatibility: If it was just an array of strings, convert to objects
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                    parsedMetodos = parsed.map(m => ({
                        nome: m,
                        datas: ['', '', '', ''],
                        observacoes: '',
                        peso: '',
                        gorduraResultados: ''
                    }));
                } else {
                    parsedMetodos = parsed;
                }
            } catch (e) {
                console.error("Failed to parse metodos", e);
            }
        }

        // Ensure all default methods exist in the state so the table is fully populated like Excel
        const fullTable = METODOS_TREINO.map(nomeMetodo => {
            const existing = parsedMetodos.find((p: any) => p.nome === nomeMetodo);
            if (existing) return existing;
            return {
                nome: nomeMetodo,
                datas: ['', '', '', ''],
                observacoes: '',
                peso: '',
                gorduraResultados: ''
            };
        });

        setMetodos(fullTable);
    }, [profile]);

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const handleMetodoChange = (index: number, field: keyof MetodoRow | 'data0' | 'data1' | 'data2' | 'data3', value: string) => {
        setMetodos(prev => {
            const updated = [...prev];
            if (field.startsWith('data')) {
                const dataIndex = parseInt(field.replace('data', ''));
                updated[index].datas[dataIndex] = value;
            } else {
                (updated[index] as any)[field] = value;
            }
            return updated;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('saving');
        try {
            // Only save rows that have at least one field filled to save space, or just save all.
            // Since it's a direct excel replacement, we can just save all to keep the exact order.
            const metodosToSave = metodos.filter(m => 
                m.datas.some(d => d.trim() !== '') || 
                m.observacoes.trim() !== '' || 
                m.peso.trim() !== '' || 
                m.gorduraResultados.trim() !== ''
            );

            const res = await fetch(`/api/admin/users/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    anotacoes,
                    alunoProfile: {
                        pontosFracos,
                        pontosFortes,
                        exerciciosProibidos,
                        metodosUtilizados: JSON.stringify(metodosToSave) // Save only filled rows to DB, empty ones will be reconstructed on load
                    }
                }),
            });
            if (res.ok) {
                setSaveStatus('success');
                onUpdate();
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Ficha Geral (Menu)</h2>
                        <p className="text-gray-400 text-sm">Resumo da anamnese e diretrizes do treino</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                        saveStatus === 'success' ? 'bg-green-500 text-white' : 
                        'bg-primary text-black hover:bg-primary/90 hover:scale-105'
                    }`}
                >
                    {saveStatus === 'saving' ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : saveStatus === 'success' ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saveStatus === 'success' ? 'Salvo!' : 'Salvar Alterações'}
                </button>
            </div>

            {/* DADOS DO ALUNO (SOMENTE LEITURA) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-6 text-white">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Informações Preenchidas pelo Aluno</h3>
                </div>

                {profile && profile.onboardingCompleto ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Principais Objetivos
                                </h4>
                                <p className="text-white bg-black/50 p-4 rounded-xl border border-white/5">{profile.objetivos || 'Não informado'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Referência de Objetivo
                                </h4>
                                <p className="text-white bg-black/50 p-4 rounded-xl border border-white/5">{profile.referenciaObjetivo || 'Não informado'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Nível de Atividade
                                </h4>
                                <p className="text-white bg-black/50 p-4 rounded-xl border border-white/5">{profile.nivelAtividade || 'Não informado'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Rotina / Horários Livres
                                </h4>
                                <p className="text-white bg-black/50 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">{profile.rotina || 'Não informado'}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4" /> Histórico de Saúde / Restrições
                                </h4>
                                <p className="text-white bg-black/50 p-4 rounded-xl border border-white/5">{profile.historicoSaude || 'Nenhuma restrição relatada'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4" /> Dores e Intensidade
                                </h4>
                                <p className="text-white bg-black/50 p-4 rounded-xl border border-white/5">{profile.doresIntensidade || 'Nenhuma dor relatada'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4" /> Limitações
                                </h4>
                                <p className="text-white bg-black/50 p-4 rounded-xl border border-white/5">{profile.limitacoes || 'Nenhuma limitação relatada'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-3 text-gray-600" />
                        <p className="text-lg">Aluno ainda não preencheu a anamnese.</p>
                        <p className="text-sm">Os dados aparecerão aqui quando o cadastro for completado.</p>
                    </div>
                )}
            </div>

            {/* AVALIAÇÃO TÉCNICA */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-2 mb-6 text-white">
                    <Zap className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Avaliação Técnica (Treinador)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Pontos Fortes</label>
                        <textarea
                            value={pontosFortes}
                            onChange={(e) => setPontosFortes(e.target.value)}
                            placeholder="Descreva os pontos fortes musculares e físicos do aluno..."
                            className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Pontos Fracos</label>
                        <textarea
                            value={pontosFracos}
                            onChange={(e) => setPontosFracos(e.target.value)}
                            placeholder="Descreva os pontos fracos que precisam de foco..."
                            className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Exercícios Proibidos</label>
                        <textarea
                            value={exerciciosProibidos}
                            onChange={(e) => setExerciciosProibidos(e.target.value)}
                            placeholder="Liste exercícios que o aluno não deve fazer sob nenhuma hipótese..."
                            className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Anotações Gerais Livres</label>
                        <textarea
                            value={anotacoes}
                            onChange={(e) => setAnotacoes(e.target.value)}
                            placeholder="Digite aqui suas observações sobre o aluno, evolução, metas discutidas..."
                            className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y"
                        />
                    </div>
                </div>
            </div>

            {/* TABELA DE MÉTODOS UTILIZADOS (PLANILHA MENU) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-6 text-white">
                    <DumbbellIcon className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Tabela de Acompanhamento de Métodos</h3>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar pb-4 border border-white/10 rounded-xl bg-black/30">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-primary">
                                <th className="p-3 font-semibold whitespace-nowrap min-w-[200px] border-r border-white/10 sticky left-0 bg-[#1a1a1a] z-10">Métodos</th>
                                <th className="p-3 font-semibold border-r border-white/10 min-w-[120px]">Data 1</th>
                                <th className="p-3 font-semibold border-r border-white/10 min-w-[120px]">Data 2</th>
                                <th className="p-3 font-semibold border-r border-white/10 min-w-[120px]">Data 3</th>
                                <th className="p-3 font-semibold border-r border-white/10 min-w-[120px]">Data 4</th>
                                <th className="p-3 font-semibold border-r border-white/10 min-w-[200px]">Observações</th>
                                <th className="p-3 font-semibold border-r border-white/10 min-w-[100px]">Peso</th>
                                <th className="p-3 font-semibold min-w-[150px]">% Gordura / Res.</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {metodos.map((row, idx) => {
                                const isFilled = row.datas.some(d => d) || row.observacoes || row.peso || row.gorduraResultados;
                                
                                return (
                                    <tr key={idx} className={`border-b border-white/5 transition-colors hover:bg-white/5 ${isFilled ? 'bg-primary/5' : ''}`}>
                                        <td className="p-0 border-r border-white/10 sticky left-0 bg-[#151515] hover:bg-[#1f1f1f] transition-colors z-10">
                                            <div className="px-3 py-2 font-medium text-xs text-white uppercase line-clamp-2" title={row.nome}>
                                                {row.nome}
                                            </div>
                                        </td>
                                        <td className="p-0 border-r border-white/10">
                                            <input 
                                                type="text" 
                                                value={row.datas[0]}
                                                onChange={(e) => handleMetodoChange(idx, 'data0', e.target.value)}
                                                placeholder="dd/mm" 
                                                className="w-full bg-transparent p-3 text-white focus:bg-white/10 focus:outline-none placeholder:text-white/20"
                                            />
                                        </td>
                                        <td className="p-0 border-r border-white/10">
                                            <input 
                                                type="text" 
                                                value={row.datas[1]}
                                                onChange={(e) => handleMetodoChange(idx, 'data1', e.target.value)}
                                                placeholder="dd/mm" 
                                                className="w-full bg-transparent p-3 text-white focus:bg-white/10 focus:outline-none placeholder:text-white/20"
                                            />
                                        </td>
                                        <td className="p-0 border-r border-white/10">
                                            <input 
                                                type="text" 
                                                value={row.datas[2]}
                                                onChange={(e) => handleMetodoChange(idx, 'data2', e.target.value)}
                                                placeholder="dd/mm" 
                                                className="w-full bg-transparent p-3 text-white focus:bg-white/10 focus:outline-none placeholder:text-white/20"
                                            />
                                        </td>
                                        <td className="p-0 border-r border-white/10">
                                            <input 
                                                type="text" 
                                                value={row.datas[3]}
                                                onChange={(e) => handleMetodoChange(idx, 'data3', e.target.value)}
                                                placeholder="dd/mm" 
                                                className="w-full bg-transparent p-3 text-white focus:bg-white/10 focus:outline-none placeholder:text-white/20"
                                            />
                                        </td>
                                        <td className="p-0 border-r border-white/10">
                                            <input 
                                                type="text" 
                                                value={row.observacoes}
                                                onChange={(e) => handleMetodoChange(idx, 'observacoes', e.target.value)}
                                                placeholder="Obs..." 
                                                className="w-full bg-transparent p-3 text-white focus:bg-white/10 focus:outline-none placeholder:text-white/20"
                                            />
                                        </td>
                                        <td className="p-0 border-r border-white/10">
                                            <input 
                                                type="text" 
                                                value={row.peso}
                                                onChange={(e) => handleMetodoChange(idx, 'peso', e.target.value)}
                                                placeholder="kg" 
                                                className="w-full bg-transparent p-3 text-white focus:bg-white/10 focus:outline-none placeholder:text-white/20"
                                            />
                                        </td>
                                        <td className="p-0">
                                            <input 
                                                type="text" 
                                                value={row.gorduraResultados}
                                                onChange={(e) => handleMetodoChange(idx, 'gorduraResultados', e.target.value)}
                                                placeholder="%" 
                                                className="w-full bg-transparent p-3 text-white focus:bg-white/10 focus:outline-none placeholder:text-white/20"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p className="text-gray-400 text-xs mt-3 flex items-center gap-2">
                    <InfoIcon className="w-4 h-4" /> 
                    Dica: Preencha apenas os métodos que desejar salvar. A tabela desliza para os lados em telas menores.
                </p>
            </div>
        </div>
    );
}

function DumbbellIcon(props: any) {
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
            <path d="m14.4 14.4 5.6 5.6" />
            <path d="m20 20-5.6-5.6" />
            <path d="m4 4 5.6 5.6" />
            <path d="m9.6 9.6-5.6-5.6" />
            <path d="M14.4 9.6 9.6 14.4" />
            <path d="M12.4 7.6 7.6 12.4" />
            <path d="M16.4 11.6 11.6 16.4" />
            <path d="m18 10 4-4-2-2-4 4" />
            <path d="m10 18-4 4-2-2 4-4" />
        </svg>
    )
}

function InfoIcon(props: any) {
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    )
}
