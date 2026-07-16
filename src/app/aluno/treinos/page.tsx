import { Dumbbell, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { MOCK_TREINOS } from '@/lib/mock-db';

export default async function StudentWorkoutsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20 px-6 py-8">
            <header className="mb-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Meus Treinos</h1>
                <p className="text-gray-400">Selecione um treino da sua rotina para iniciar.</p>
            </header>

            <main className="max-w-7xl mx-auto">
                {MOCK_TREINOS.length === 0 ? (
                    <div className="text-center py-16 bg-[#111] rounded-2xl border border-white/5 border-dashed">
                        <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-20 text-white" />
                        <p className="text-gray-400">Nenhum treino atribuído ainda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MOCK_TREINOS.map((treino) => {
                            // Extrai os 3 primeiros exercícios para resumo
                            const previewExercicios = treino.itens
                                .slice(0, 3)
                                .map(item => item.exercicio.nome)
                                .join(', ');

                            // Tempo estimado amigável na tela assumindo 15min/exercício em média. (Fictício)
                            const estimatedTime = treino.itens.length * 15;

                            return (
                                <Link key={treino.id} href={`/aluno/treinos/${treino.id}`} className="block h-full">
                                    <div className="h-full bg-[#111] border border-white/5 p-6 rounded-2xl flex flex-col group hover:border-primary/40 hover:bg-[#151515] transition-all relative overflow-hidden">

                                        {/* Status Badge */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-14 h-14 rounded-xl bg-gray-800/50 flex items-center justify-center text-primary border border-white/5 shadow-inner">
                                                <Dumbbell className="w-7 h-7" />
                                            </div>
                                            {treino.concluido && (
                                                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Concluído
                                                </span>
                                            )}
                                        </div>

                                        {/* Titulo e descricoes */}
                                        <div className="mb-4 flex-grow">
                                            <h3 className="font-bold text-white text-xl mb-2 group-hover:text-primary transition-colors">{treino.titulo}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2">{treino.descricao}</p>
                                        </div>

                                        {/* Preview lista exerciocios */}
                                        <div className="mb-6 p-3 rounded-lg bg-black/40 border border-white/5">
                                            <p className="text-xs text-gray-400 italic line-clamp-1">
                                                <span className="font-semibold not-italic">Exercícios:</span> {previewExercicios}{treino.itens.length > 3 ? '...' : ''}
                                            </p>
                                        </div>

                                        {/* Infos de rodape de cada Card */}
                                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                                    <Dumbbell className="w-4 h-4 text-primary" />
                                                    <span className="font-medium text-gray-200">{treino.itens.length}</span> ex.
                                                </span>
                                                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                                    <Clock className="w-4 h-4 text-primary" />
                                                    <span className="font-medium text-gray-200">~{estimatedTime}</span> min
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                                                Detalhes <ChevronRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
