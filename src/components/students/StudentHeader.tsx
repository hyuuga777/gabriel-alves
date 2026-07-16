'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, MessageSquare, Plus, Edit2 } from 'lucide-react';
import Link from 'next/link';

interface StudentHeaderProps {
    student: any;
    onRegisterWorkout: () => void;
    onSendMessage: () => void;
}

export function StudentHeader({ student, onRegisterWorkout, onSendMessage }: StudentHeaderProps) {
    return (
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl group">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/5 opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            
            <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-8">
                {/* Avatar with Glow */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-50 animated-pulse" />
                    <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/10 relative z-10"
                    />
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-[#0a0a0a] rounded-full z-20" />
                </motion.div>

                {/* Info & Actions */}
                <div className="flex-1 text-center md:text-left">
                    <Link 
                        href="/admin/alunos"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-4 text-sm font-medium"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar para lista
                    </Link>

                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2"
                    >
                        {student.name}
                    </motion.h1>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center md:justify-start gap-4"
                    >
                        <span className="px-3 py-1 bg-primary text-black text-xs font-bold rounded-full uppercase tracking-widest">
                            {student.status}
                        </span>
                        <span className="text-gray-400 font-medium">
                            {student.plan}
                        </span>
                        <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                        <span className="text-gray-500 text-sm">
                            Membro desde {student.joinDate}
                        </span>
                    </motion.div>
                </div>

                {/* Button Group */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
                >
                    <button 
                        onClick={onSendMessage}
                        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10 backdrop-blur-md"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Mensagem
                    </button>
                    <button 
                        onClick={onRegisterWorkout}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-black px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Treino
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all">
                        <Edit2 className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
