import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Clock, Dumbbell, PlayCircle, Info } from 'lucide-react';
import { MOCK_TREINOS } from '@/lib/mock-db';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function TreinoDetailsPage({ params }: Props) {
    // Desestrutura o ID via a nova spec de Next.js async params (15.x recomendation)
    const resolvedParams = await params;
    const treinoId = resolvedParams.id;

    const treino = MOCK_TREINOS.find(t => t.id === treinoId);

    // Se o ID digitado/navigado não existir, dispara a página padrão 404 de notFound
    if (!treino) {
        notFound();
    }

    // Gera o tempo dinâmico que estimamos na tela anterior
    const estimatedTime = treino.itens.length * 15;

    return (
        <div className="min-h-screen bg-background text-foreground pb-32 px-6 py-8">
            {/* Cabeçalho */}
            <header className="mb-8 max-w-4xl mx-auto flex flex-col gap-4">
                <Link
                    href="/aluno/treinos"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors w-fit"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Voltar para Treinos
                </Link>

                <div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">{treino.titulo}</h1>
                    {treino.descricao && (
                        <p className="text-gray-400 text-sm">{treino.descricao}</p>
                    )}
                </div>

                <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <Dumbbell className="w-4 h-4 text-primary" />
                        <span className="font-medium text-white">{treino.itens.length}</span> exercícios
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium text-white">~{estimatedTime}</span> min
                    </span>
                </div>
            </header>

            {/* Lista de Exercícios */}
            <main className="max-w-4xl mx-auto">
                <div className="space-y-4">
                    {treino.itens.map((item, index) => (
                        <div key={item.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden group">
                            <div className="p-5 sm:p-6">

                                <div className="flex justify-between items-start mb-4">
                                    {/* Badge Grupo Muscular */}
                                    <span className="inline-flex text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md">
                                        {item.exercicio.grupoMuscular}
                                    </span>
                                    <span className="text-gray-600 font-mono text-sm font-bold">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Titulo Exercicio */}
                                <h2 className="text-xl font-bold text-white mb-4">{item.exercicio.nome}</h2>

                                {/* Grid de Dados Técnicos */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                    <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                        <span className="text-xs text-gray-500 mb-1">Séries</span>
                                        <span className="font-bold text-white text-lg">{item.series}</span>
                                    </div>
                                    <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                        <span className="text-xs text-gray-500 mb-1">Repetições</span>
                                        <span className="font-bold text-white text-lg">{item.repeticoes}</span>
                                    </div>
                                    <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                        <span className="text-xs text-gray-500 mb-1">Carga Alvo</span>
                                        <span className="font-bold text-white text-lg">{item.cargaAlvo || '-'}</span>
                                    </div>
                                    <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                        <span className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Intervalo</span>
                                        <span className="font-bold text-white text-lg">{item.intervaloSegundos}s</span>
                                    </div>
                                </div>

                                {/* Observações */}
                                {item.observacoes && (
                                    <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-3">
                                        <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                        <p className="text-sm text-yellow-400/90 leading-relaxed italic">
                                            {item.observacoes}
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* CTA Fixo / Floating Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-white/10 z-40">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/aluno/treinos/${treinoId}/executar`} className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold text-lg py-4 rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_var(--primary)] opacity-90 hover:opacity-100">
                        <PlayCircle className="w-6 h-6" />
                        Iniciar Treino Agora
                    </Link>
                </div>
            </div>
        </div>
    );
}
