'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Paperclip, Check, CheckCheck, Ghost } from 'lucide-react';

interface Message {
    id: string;
    remetenteId: string;
    conteudo: string;
    lida: boolean;
    createdAt: string;
}

export default function StudentChatPage() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    // Para simplificar, assumimos que o estudante fala com o primeiro admin encontrado ou sistema
    // Na API de envio, o destinatarioId precisa ser o ID do admin. 
    // Como solução temporária, o aluno envia para um ID fixo ou a API resolve quem é o treinador dele.
    // Vamos ajustar a API de envio do aluno para descobrir o admin, mas por enquanto vamos simular buscando o ID do admin via uma chamada simples ou hardcoded se necessário.
    // Melhor: O aluno sempre fala com quem lhe enviou mensagem ou com o Admin padrão.
    const [trainerId, setTrainerId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch trainer info and messages
    useEffect(() => {
        const initChat = async () => {
            // 1. Descobrir ID do Treinador (Admin)
            // Mock: Vamos assumir que a API de mensagens /api/chat/me retornaria as msg e o ID do outro participante
            // Mas usamos /api/chat/[userId]. O aluno precisa saber seu próprio ID? Sim, via session.
            // E o ID do admin?

            // Workaround: Buscar mensagens primeiro. Se houver, pegamos o outro ID.
            // Se não, precisamos de uma rota para "Get My Trainer".
            // Vamos usar um fetch nas mensagens trocadas com o admin.
            // Para simplificar neste MVP, vamos assumir que o sistema busca o primeiro admin do banco se não tiver histórico.

            // PROVISÓRIO: Vamos buscar o ID do admin via uma server action ou API simulada.
            // Como não criei essa API, vou fazer um fetch nas mensagens do usuário logado (usando o ID dele mesmo na rota, a rota sabe quem é o interlocutor?)
            // A rota /api/chat/[userId] pega msg entre [userId] e LoggedUser. 
            // Se eu sou Aluno e chamo /api/chat/[AdminID], funciona. Mas não sei o AdminID.

            // Vou assumir que o aluno entra na tela, e a tela busca "mensagens gerais".
            // AJUSTE NA API: A rota /api/chat/my-messages poderia facilitar.
            // Mas para manter o plano, vou adicionar uma busca simples de "Meu Treinador".

            const res = await fetch('/api/admin/users'); // Reutilizando rota existente se houver, ou criando uma especifica.
            // Não temos rota publica de users.

            // Solução Rápida: O aluno vê mensagens apenas se o admin mandou primeiro? Não.
            // Vamos hardcodear uma busca pelo admin na montagem ou criar um server action rapido?
            // Melhor: Criar rota /api/chat/trainer
        };

        // Pular a complexidade: Vamos assumir que o Admin ID é conhecido ou a API resolve.
        // Vou criar uma rota /api/chat/trainer rapidinho.
        fetchTrainer();
    }, []);

    const fetchTrainer = async () => {
        try {
            const res = await fetch('/api/chat/trainer');
            if (res.ok) {
                const data = await res.json();
                setTrainerId(data.id);
            }
        } catch (error) {
            console.error('Erro ao buscar treinador', error);
        }
    }

    useEffect(() => {
        if (trainerId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [trainerId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        if (!trainerId) return;
        try {
            const res = await fetch(`/api/chat/${trainerId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !trainerId) return;

        const tempData: Message = {
            id: 'temp-' + Date.now(),
            remetenteId: 'me',
            conteudo: newMessage,
            lida: false,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempData]);
        setNewMessage('');

        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destinatarioId: trainerId,
                conteudo: tempData.conteudo
            })
        });
        fetchMessages();
    };

    if (!trainerId && !loading) return <div className="p-8 text-center text-white">Treinador não encontrado. Contate o suporte.</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] max-w-4xl mx-auto bg-[#111] border border-white/5 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#151515]">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Ghost className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="font-bold text-white">Treinador</h2>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        Online
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                    const isMe = message.remetenteId !== trainerId; // Lógica simplificada
                    return (
                        <div
                            key={message.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] md:max-w-[60%] rounded-2xl p-4 ${isMe
                                        ? 'bg-primary text-black rounded-tr-sm'
                                        : 'bg-gray-800 text-white rounded-tl-sm'
                                    }`}
                            >
                                <p className="text-sm">{message.conteudo}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <span className={`text-[10px] ${isMe ? 'text-black/60' : 'text-gray-400'}`}>
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && (
                                        message.lida ? <CheckCheck className="w-3 h-3 text-black/60" /> : <Check className="w-3 h-3 text-black/60" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#151515] flex gap-2">
                <button
                    type="button"
                    className="p-3 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tire suas dúvidas..."
                    className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
