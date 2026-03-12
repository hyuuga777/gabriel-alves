import Link from 'next/link';
import { Plus, Dumbbell, Calendar, Users } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function WorkoutsPage() {
    // let workouts;
    // try {
    //     workouts = await prisma.treino.findMany({
    //         orderBy: { updatedAt: 'desc' },
    //         include: {
    //             _count: {
    //                 select: { exercicios: true, atribuicoes: true }
    //             }
    //         }
    //     });
    // } catch (error) {
    //     console.error("Database connection failed, using mock data:", error);
    const workouts = [
        {
            id: 'mock-1',
            nome: 'Hipertrofia - Iniciante',
            tipo: 'A',
            descricao: 'Programa focado em adaptação e força base.',
            updatedAt: new Date(),
            _count: { exercicios: 8, atribuicoes: 12 }
        },
        {
            id: 'mock-2',
            nome: 'Perda de Peso - Intermediário',
            tipo: 'B',
            descricao: 'Circuito metabólico para queima de gordura.',
            updatedAt: new Date(Date.now() - 86400000 * 2),
            _count: { exercicios: 12, atribuicoes: 8 }
        },
        {
            id: 'mock-3',
            nome: 'Força Pura - Avançado',
            tipo: 'C',
            descricao: 'Foco em levantamentos básicos e progressão de carga.',
            updatedAt: new Date(Date.now() - 86400000 * 5),
            _count: { exercicios: 5, atribuicoes: 3 }
        }
    ];
    // }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Programas de Treino</h1>
                    <p className="text-gray-400 text-sm">Gerencie os modelos de treinos disponíveis.</p>
                </div>
                <Link
                    href="/admin/programas/novo"
                    className="bg-primary hover:bg-primary/90 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Novo Programa
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout: any) => (
                    <Link
                        key={workout.id}
                        href={`/admin/programas/${workout.id}`}
                        className="block"
                    >
                        <div className="bg-[#111] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-colors group h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <span className="font-bold text-lg">{workout.tipo}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(workout.updatedAt).toLocaleDateString('pt-BR')}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                {workout.nome}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                                {workout.descricao || 'Sem descrição definida.'}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Dumbbell className="w-4 h-4" />
                                    <span>{workout._count.exercicios} Exercícios</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Users className="w-4 h-4" />
                                    <span>{workout._count.atribuicoes} Alunos</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {workouts.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-xl bg-white/2">
                        <p className="text-gray-500">Nenhum programa criado ainda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
