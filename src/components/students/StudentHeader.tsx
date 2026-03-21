import { useState } from 'react';
import { MoreVertical, MessageSquare, Dumbbell, X, Edit, Ban, Trash2 } from 'lucide-react';

interface StudentHeaderProps {
    student: {
        name: string;
        email: string;
        avatar?: string;
        lastWorkout?: string;
    };
    onRegisterWorkout?: () => void;
    onSendMessage?: () => void;
}

export function StudentHeader({ student, onRegisterWorkout, onSendMessage }: StudentHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState('');

    const handleSendMessage = () => {
        setIsMessageOpen(true);
        // Call parent handler if needed, but we handle the modal here now
        if (onSendMessage) onSendMessage();
    };

    const submitMessage = () => {
        alert(`Mensagem enviada para ${student.name}:\n\n"${messageText}"`);
        setIsMessageOpen(false);
        setMessageText('');
    };

    return (
        <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 border-2 border-white/10">
                        <img
                            src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}&background=random`}
                            alt={student.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{student.name}</h1>
                        <div className="text-sm text-gray-400 space-y-0.5">
                            <p>{student.email}</p>
                            <p className="text-xs text-gray-500">
                                último treino: {student.lastWorkout || '16 dias atrás'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative">
                    <button
                        onClick={onRegisterWorkout}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10"
                    >
                        <Dumbbell className="w-4 h-4" />
                        Registrar Treino
                    </button>
                    <button
                        onClick={() => setIsMessageOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg text-sm font-medium transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Enviar Mensagem
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMenuOpen(false)}
                                ></div>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                    <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors">
                                        <Edit className="w-4 h-4" /> Editar Perfil
                                    </button>
                                    <button className="w-full text-left px-4 py-3 text-sm text-yellow-500 hover:bg-white/5 flex items-center gap-2 transition-colors">
                                        <Ban className="w-4 h-4" /> Suspender
                                    </button>
                                    <button className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-white/5 flex items-center gap-2 transition-colors border-t border-white/5">
                                        <Trash2 className="w-4 h-4" /> Excluir Aluno
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Message Modal */}
            {isMessageOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-xl border border-white/10 w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-white/10">
                            <h3 className="text-lg font-bold text-white">Nova Mensagem</h3>
                            <button onClick={() => setIsMessageOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Para</label>
                                <div className="p-2 bg-black/30 rounded border border-white/5 text-gray-300 text-sm">
                                    {student.name} ({student.email})
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Mensagem</label>
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Digite sua mensagem aqui..."
                                    className="w-full h-32 bg-black/30 rounded border border-white/5 p-3 text-white text-sm focus:border-primary focus:outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                            <button
                                onClick={() => setIsMessageOpen(false)}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={submitMessage}
                                disabled={!messageText.trim()}
                                className="px-4 py-2 bg-primary text-black text-sm font-bold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
