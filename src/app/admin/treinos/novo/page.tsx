'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Trash2,
    ChevronLeft,
    Dumbbell,
    Check,
    Search,
    X
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MOCK_EXERCICIOS } from '@/lib/mock-db';

const WorkoutBuilderSchema = z.object({
    titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
    alunoId: z.string().min(1, 'Selecione um aluno'),
    itens: z.array(z.object({
        exercicioId: z.string().min(1),
        nome: z.string(),
        grupoMuscular: z.string(),
        series: z.number().min(1),
        repeticoes: z.string().min(1),
        cargaSugerida: z.string().optional(),
        intervalo: z.number().min(0),
    })).min(1, 'Adicione pelo menos um exercício ao treino')
});

type WorkoutBuilderData = z.infer<typeof WorkoutBuilderSchema>;

export default function AdminNewWorkoutPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, control, handleSubmit, formState: { errors } } = useForm<WorkoutBuilderData>({
        resolver: zodResolver(WorkoutBuilderSchema),
        defaultValues: {
            titulo: '',
            alunoId: '',
            itens: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'itens'
    });

    const filteredExercicios = MOCK_EXERCICIOS.filter(ex =>
        ex.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onSubmit = (data: WorkoutBuilderData) => {
        console.log('Salvando treino:', data);
        alert('Treino salvo com sucesso (Simulado)!');
        router.push('/admin/dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto pb-32">
            <header className="mb-8 flex flex-col gap-4">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors w-fit"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Voltar
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Novo Treino</h1>
                    <p className="text-gray-400 text-sm mt-1">Monte uma ficha personalizada para seu aluno.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Configuração Inicial */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#111] border border-white/5 rounded-2xl shadow-xl">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest text-white/70 ml-1">Título do Treino</label>
                        <input
                            {...register('titulo')}
                            placeholder="Ex: Treino A - Peito e Tríceps"
                            className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-white focus:outline-none focus:border-primary/50"
                        />
                        {errors.titulo && <p className="text-red-400 text-xs ml-1">{errors.titulo.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest text-white/70 ml-1">Vincular a Aluno</label>
                        <select
                            {...register('alunoId')}
                            className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-black">Selecione um aluno...</option>
                            <option value="aluno-1" className="bg-black">Carlos Silva</option>
                            <option value="aluno-2" className="bg-black">Mariana Souza</option>
                        </select>
                        {errors.alunoId && <p className="text-red-400 text-xs ml-1">{errors.alunoId.message}</p>}
                    </div>
                </div>

                {/* Builder Area */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-primary" />
                            Exercícios da Ficha
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors py-1 px-2"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar Exercício
                        </button>
                    </div>

                    {fields.length === 0 ? (
                        <div className="border-2 border-dashed border-white/5 rounded-2xl p-12 text-center bg-white/2 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-6 h-6 text-gray-500" />
                            </div>
                            <p className="text-gray-400 text-sm">Clique para adicionar o primeiro exercício</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="bg-[#111] border border-white/5 rounded-2xl p-6 relative group overflow-hidden">
                                    {/* Linha 1: Info Exercício */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70 mb-1 block">
                                                {field.grupoMuscular}
                                            </span>
                                            <h3 className="text-white font-bold text-lg">{field.nome}</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Linha 2: Inputs */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Séries</label>
                                            <input
                                                type="number"
                                                {...register(`itens.${index}.series` as const, { valueAsNumber: true })}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl h-11 px-3 text-white focus:outline-none focus:border-white/20"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Reps</label>
                                            <input
                                                placeholder="10-12"
                                                {...register(`itens.${index}.repeticoes` as const)}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl h-11 px-3 text-white focus:outline-none focus:border-white/20"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Carga</label>
                                            <input
                                                placeholder="20kg"
                                                {...register(`itens.${index}.cargaSugerida` as const)}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl h-11 px-3 text-white focus:outline-none focus:border-white/20"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Intervalo(s)</label>
                                            <input
                                                type="number"
                                                {...register(`itens.${index}.intervalo` as const, { valueAsNumber: true })}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl h-11 px-3 text-white focus:outline-none focus:border-white/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.itens && <p className="text-red-400 text-xs mt-2 px-2">{errors.itens.message}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-8">
                    <button
                        type="submit"
                        className="flex-1 bg-primary text-black py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/10"
                    >
                        Salvar Treino
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 rounded-xl font-bold text-gray-400 hover:text-white border border-white/5 hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                </div>
            </form>

            {/* Modal Pesquisa Exercício */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Escolher Exercício</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white p-2">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Pesquisar por nome..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 no-scrollbar">
                                {filteredExercicios.map(ex => (
                                    <button
                                        key={ex.id}
                                        onClick={() => {
                                            append({
                                                exercicioId: ex.id,
                                                nome: ex.nome,
                                                grupoMuscular: ex.grupoMuscular,
                                                series: 3,
                                                repeticoes: '10-12',
                                                cargaSugerida: '',
                                                intervalo: 60
                                            });
                                            setIsModalOpen(false);
                                            setSearchTerm('');
                                        }}
                                        className="w-full text-left p-4 rounded-xl bg-white/2 hover:bg-white/10 border border-transparent hover:border-white/10 flex items-center justify-between group transition-all"
                                    >
                                        <div>
                                            <p className="text-white font-bold">{ex.nome}</p>
                                            <p className="text-xs text-gray-500">{ex.grupoMuscular}</p>
                                        </div>
                                        <Plus className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
