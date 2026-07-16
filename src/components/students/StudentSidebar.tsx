'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Calendar, Clock, Trophy, Target, ShieldCheck } from 'lucide-react';

interface StudentSidebarProps {
    student: any;
}

export function StudentSidebar({ student }: StudentSidebarProps) {
    const infoItems = [
        { icon: Phone, label: 'Telefone', value: student.phone },
        { icon: Mail, label: 'Email', value: student.email, className: 'truncate' },
        { icon: Calendar, label: 'Vencimento', value: '15 de Abr, 2024' },
    ];

    const stats = [
        { icon: Target, label: 'Frequência', value: `${student.attendance}%`, color: 'text-primary' },
        { icon: Trophy, label: 'Treinos', value: student.workoutsCompleted, color: 'text-blue-400' },
        { icon: ShieldCheck, label: 'Nível', value: 'Avançado', color: 'text-purple-400' },
    ];

    return (
        <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md group hover:bg-white/[0.07] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Info Card */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md"
            >
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    Informações de Contato
                </h3>
                
                <div className="space-y-6">
                    {infoItems.map((item) => (
                        <div key={item.label} className="flex items-start gap-4">
                            <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                <p className={`text-sm text-gray-200 font-medium ${item.className || ''}`}>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-primary text-[10px] font-extrabold uppercase tracking-tighter">Última Presença</p>
                            <p className="text-white text-sm font-bold">Ontem, às 18:45</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
