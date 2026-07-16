'use client';

import { Suspense, use, useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notFound, useRouter } from 'next/navigation';
import { ChevronLeft, Info, CheckCircle2, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

import { MOCK_TREINOS } from '@/lib/mock-db';
import { ExecutarTreinoSchema, ExecutarTreinoData } from '@/lib/schemas';

interface Props {
    params: Promise<{ id: string }>;
}

export default function ExecutarTreinoWrapper({ params }: Props) {
    const resolvedParams = use(params);
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex text-white items-center justify-center">Carregando Treino...</div>}>
            <ExecutarTreino id={resolvedParams.id} />
        </Suspense>
    );
}

function ExecutarTreino({ id }: { id: string }) {
    const router = useRouter();
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const treino = MOCK_TREINOS.find(t => t.id === id);

    if (!treino) {
        notFound();
    }

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<ExecutarTreinoData>({
        resolver: zodResolver(ExecutarTreinoSchema),
        defaultValues: {
            itens: treino.itens.map(item => ({
                id: item.id,
                // Caso houvesse log anterior, preencheríamos aqui. Mockando valores em branco (0)
                carga: 0,
                rpe: 5,
                observacoes: '',
                concluido: false
            }))
        }
    });

    const { fields } = useFieldArray({
        control,
        name: 'itens'
    });

    const watchItens = watch('itens');
    const completedCount = watchItens ? watchItens.filter(item => item.concluido).length : 0;
    const totalItens = fields.length;
    const progressPercentage = (completedCount / totalItens) * 100;

    // Simple Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const onSubmit = (data: ExecutarTreinoData) => {
        console.log("=== RESUMO DO TREINO FINALIZADO ===");
        console.log("Tempo transcorrido:", formatTime(elapsedTime));
        console.log("Dados Registrados:", data);

        setIsFinished(true);

        // Simulando o Toast animado sem bibliotecas externas
        setTimeout(() => {
            router.push('/aluno/dashboard'); // Volta pro dashboard após 2.5s
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-32">
            {/* Sticky Header com Timer e Barra de Progresso */}
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-white/10 pt-4 pb-2 px-4 shadow-xl">
                <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-white p-2 -ml-2 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1 text-center px-4">
                        <h1 className="text-sm font-bold text-white line-clamp-1">{treino.titulo}</h1>
                        <div className="flex items-center justify-center gap-1 mt-1 text-primary text-xs font-mono font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(elapsedTime)}
                        </div>
                    </div>
                    <div className="w-8" /> {/* Placeholder para equilibrar */}
                </div>

                {/* Barra de Progresso Line */}
                <div className="max-w-3xl mx-auto mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium px-1">
                        <span>Progresso</span>
                        <span>{completedCount}/{totalItens} concluídos</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            </header>

            <main className="px-4 py-6 max-w-3xl mx-auto">

                {/* Aviso Inicial UX */}
                <div className="mb-6 bg-blue-500/10 border border-blue-500/20 text-blue-400/90 text-sm p-4 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>Anote as cargas precisas para acompanhar sua evolução no gráfico. Use o RPE (1-10) para medir seu nível de esforço na série.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="space-y-4">
                        {fields.map((field, index) => {
                            const originalExercicio = treino.itens[index];
                            const isConcluido = watchItens?.[index]?.concluido;

                            return (
                                <motion.div
                                    layout
                                    key={field.id}
                                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isConcluido
                                        ? 'bg-green-950/10 border-green-500/30 opacity-80'
                                        : 'bg-[#111] border-white/10 shadow-lg'
                                        }`}
                                >
                                    <div className="p-5">
                                        {/* Cabecalho de cada Exercicio */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="pr-4">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                                                    {originalExercicio.exercicio.grupoMuscular}
                                                </span>
                                                <h3 className={`font-bold text-lg leading-tight transition-colors ${isConcluido ? 'text-green-400' : 'text-white'}`}>
                                                    {originalExercicio.exercicio.nome}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1">Séries: {originalExercicio.series} • Reps: {originalExercicio.repeticoes}</p>
                                            </div>

                                            {/* Checkbox de marcacao */}
                                            <label className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors ${isConcluido ? 'bg-green-500 border-green-500 text-black' : 'border-white/20 bg-black/40 hover:border-primary/50'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    {...register(`itens.${index}.concluido`)}
                                                />
                                                {isConcluido && <Check className="w-5 h-5" />}
                                            </label>
                                        </div>

                                        {/* Resumo da Observacao */}
                                        {originalExercicio.observacoes && (
                                            <div className="mb-4 text-xs bg-yellow-500/10 text-yellow-500 p-2.5 rounded-lg italic">
                                                {originalExercicio.observacoes}
                                            </div>
                                        )}

                                        {/* Inputs do Front (Carga e RPE) */}
                                        <div className={`grid grid-cols-2 gap-4 transition-all ${isConcluido ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                                            {/* Carga */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Carga (kg)</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="Ex: 20"
                                                        className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                                        {...register(`itens.${index}.carga` as const, { valueAsNumber: true })}
                                                    />
                                                </div>
                                                {errors.itens?.[index]?.carga && (
                                                    <p className="text-red-400 text-xs mt-1">{errors.itens[index]?.carga?.message}</p>
                                                )}
                                            </div>

                                            {/* RPE */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">RPE (1-10)</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        placeholder="Esforço"
                                                        className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                                        {...register(`itens.${index}.rpe` as const, { valueAsNumber: true })}
                                                    />
                                                </div>
                                                {errors.itens?.[index]?.rpe && (
                                                    <p className="text-red-400 text-xs mt-1">{errors.itens[index]?.rpe?.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Observacao Aluno */}
                                        <div className={`mt-4 transition-all ${isConcluido ? 'hidden' : 'block'}`}>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Comentários (Opcional)</label>
                                            <textarea
                                                rows={2}
                                                placeholder="Senti incômodo, achei leve..."
                                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none"
                                                {...register(`itens.${index}.observacoes`)}
                                            />
                                        </div>

                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Fixed Bottom CTA for Submission */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-white/10 z-30">
                        <div className="max-w-3xl mx-auto relative">
                            <button
                                type="submit"
                                disabled={completedCount === 0 || isFinished}
                                className={`w-full h-14 rounded-xl font-bold flex items-center justify-center transition-all ${isFinished
                                    ? 'bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                                    : completedCount > 0
                                        ? 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_var(--primary)]'
                                        : 'bg-white/10 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isFinished ? (
                                    <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Treino Salvo!</span>
                                ) : (
                                    `Finalizar Treino (${completedCount}/${totalItens})`
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
