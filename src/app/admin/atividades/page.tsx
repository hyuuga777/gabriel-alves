'use client';

import { motion } from 'framer-motion';
import { Activity, Dumbbell, User, Calendar, MessageSquare, PlayCircle, Clock } from 'lucide-react';

const RECENT_ACTIVITIES = [
  { id: 1, type: 'workout_complete', user: 'Gabriel Alves', detail: 'Hipertrofia A', time: 'Há 5 min', icon: Dumbbell, color: 'text-primary' },
  { id: 2, type: 'new_student', user: 'Mariana Silva', detail: 'Plano Premium', time: 'Há 22 min', icon: User, color: 'text-blue-400' },
  { id: 3, type: 'measurement', user: 'Carlos Silva', detail: 'Nova avaliação inserida', time: 'Há 1 hora', icon: Activity, color: 'text-green-400' },
  { id: 4, type: 'message', user: 'Ana Paula', detail: 'Dúvida sobre execução', time: 'Há 2 horas', icon: MessageSquare, color: 'text-purple-400' },
  { id: 5, type: 'workout_complete', user: 'João Vitor', detail: 'Funcional B', time: 'Há 3 horas', icon: PlayCircle, color: 'text-red-400' },
  { id: 6, type: 'new_student', user: 'Felipe Dias', detail: 'Plano Consultoria', time: 'Há 5 horas', icon: User, color: 'text-blue-400' },
  { id: 7, type: 'measurement', user: 'Beatriz', detail: 'Atualizou peso (+2kg)', time: 'Há 1 dia', icon: Activity, color: 'text-green-400' },
];

export default function ActivitiesPage() {
    return (
        <div className="min-h-screen bg-black p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="flex items-center gap-4 mb-8">
                    <Activity className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-black tracking-tighter text-white">Log de Atividades</h1>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
                    <div className="space-y-6">
                        {RECENT_ACTIVITIES.map((activity, i) => (
                            <motion.div 
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
                            >
                                <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                                    <activity.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{activity.user}</h4>
                                    <p className="text-gray-500 text-sm">{activity.detail}</p>
                                </div>
                                <div className="ml-auto flex items-center justify-center h-12">
                                    <span className="flex flex-col items-end text-[10px] uppercase font-bold text-gray-500 tracking-widest gap-1">
                                        <Clock className="w-3 h-3 text-gray-700" />
                                        {activity.time}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
