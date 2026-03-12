'use client';

import { MoreVertical, ThumbsUp, MessageSquare, Clock, Dumbbell, Calendar, Smartphone } from 'lucide-react';

interface WorkoutProgramTabProps {
    student: any;
}

export function WorkoutProgramTab({ student }: WorkoutProgramTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Workout History */}
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-medium text-white">Histórico de treinos</h3>

                {/* Workout History Card Item */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
                                <img
                                    src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}&background=random`}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">{student.name}</h4>
                                <p className="text-xs text-gray-500">Domingo, 7 de dezembro de 2025</p>
                            </div>
                        </div>
                        <button className="text-gray-500 hover:text-white">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <h5 className="text-white font-medium mb-1">Treino de corpo inteiro - Dia 2</h5>
                        <div className="flex items-center gap-2 text-sm text-red-500 mb-4">
                            <span>💪</span>
                            <span>Treino 8 do programa</span>
                        </div>

                        <div className="flex gap-12 mb-6">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duração</p>
                                <p className="text-sm text-white font-medium">48 minutos</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Volume</p>
                                <p className="text-sm text-white font-medium">7.313 kg</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <img src="/exercises/deadlift_thumb.jpg" className="w-8 h-8 rounded object-cover opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    <Dumbbell className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-white">5 séries de levantamento terra (com barra)</p>
                                    <p className="text-xs text-gray-500">100kg x 5, 120kg x 3...</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <Dumbbell className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-white">5 séries de supino inclinado (com halteres)</p>
                                    <p className="text-xs text-gray-500">24kg x 10, 26kg x 8...</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <Dumbbell className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-white">4 séries de barra fixa</p>
                                    <p className="text-xs text-gray-500">Peso do corpo x 8...</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button className="text-xs text-gray-400 hover:text-white transition-colors">
                                    Veja mais 3 exercícios
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex gap-6">
                            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Dar certo</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span>Comentar</span>
                            </button>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500">
                            <span>0 curtidas</span>
                            <span>0 comentários</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Active Program */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-white">Programa Ativo</h3>

                <div className="bg-white rounded-xl overflow-hidden text-black">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h4 className="font-bold text-gray-900">Corpo inteiro x3</h4>
                        <span className="text-xs font-medium text-red-500">5ª semana de 4</span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {/* Day 1 */}
                        <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <h5 className="font-semibold text-gray-900 text-sm mb-2">Treino de corpo inteiro - Dia 1</h5>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                4 x Agachamento (Barra), 4 x Supino (Barra), 4 x Remada Curvada (Barra), 4 x Desenvolvimento (Barra), 3 x Puxada Lat (Cabo)...
                            </p>
                        </div>

                        {/* Day 2 */}
                        <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <h5 className="font-semibold text-gray-900 text-sm mb-2">Treino de corpo inteiro - Dia 2</h5>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                5 repetições de levantamento terra (barra), 5 repetições de supino inclinado (halteres), 4 repetições de barra fixa...
                            </p>
                        </div>

                        {/* Day 3 */}
                        <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <h5 className="font-semibold text-gray-900 text-sm mb-2">Treino de corpo inteiro - Dia 3</h5>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                4 x Agachamento (Barra), 4 x Supino (Barra), 3 x Remada Sentada com Cabo - Pegada na Barra...
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50">
                        <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
                            Editar programa
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#111] border border-white/5 rounded-xl">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-300">Para registrar os treinos dos clientes</p>
                        <a href="#" className="text-sm text-primary hover:underline">Baixe o aplicativo Hevy Coach</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
