'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Send, Paperclip, Check, CheckCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    unreadCount: number;
    lastMessage?: {
        conteudo: string;
        createdAt: string;
    };
}

interface Message {
    id: string;
    remetenteId: string;
    destinatarioId: string;
    conteudo: string;
    anexoUrl?: string;
    lida: boolean;
    createdAt: string;
}

export default function AdminChatPage() {
    const { data: session } = useSession();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch contacts
    useEffect(() => {
        fetchContacts();
        // Polling para atualizar lista de contatos a cada 10s
        const interval = setInterval(fetchContacts, 10000);
        return () => clearInterval(interval);
    }, []);

    // Fetch messages when contact selected
    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
            // Polling para mensagens atuais a cada 3s
            const interval = setInterval(() => fetchMessages(selectedContact.id), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchContacts = async () => {
        try {
            const res = await fetch('/api/chat/contacts');
            if (res.ok) {
                const data = await res.json();
                setContacts(data);
            }
        } catch (error) {
            console.error('Failed to fetch contacts', error);
        } finally {
            setLoadingContacts(false);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const res = await fetch(`/api/chat/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);

                // Se houver mensagens não lidas enviadas pelo usuário, marcar como lidas no server
                const hasUnread = data.some((m: Message) => m.remetenteId === userId && !m.lida);
                if (hasUnread) {
                    await fetch(`/api/chat/${userId}`, { method: 'PUT' });
                    // Atualizar unreadCount localmente
                    setContacts(prev => prev.map(c =>
                        c.id === userId ? { ...c, unreadCount: 0 } : c
                    ));
                }
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        const tempData: Message = {
            id: 'temp-' + Date.now(),
            remetenteId: 'me', // placeholder
            destinatarioId: selectedContact.id,
            conteudo: newMessage,
            lida: false,
            createdAt: new Date().toISOString()
        };

        // Otimistic update
        setMessages(prev => [...prev, tempData]);
        setNewMessage('');

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destinatarioId: selectedContact.id,
                    conteudo: tempData.conteudo
                })
            });

            if (res.ok) {
                const sentMessage = await res.json();
                setMessages(prev => prev.map(m => m.id === tempData.id ? sentMessage : m));
                fetchContacts(); // Atualizar sltima mensagem na lista
            }
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-6 overflow-hidden">
            {/* Contacts List */}
            <div className="w-80 flex flex-col bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 space-y-4">
                    <h1 className="text-xl font-bold text-white">Mensagens</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar aluno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-300"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingContacts ? (
                        <div className="p-4 text-center text-gray-500">Carregando...</div>
                    ) : filteredContacts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Nenhum contato encontrado.</div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredContacts.map(contact => (
                                <button
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`flex items-center gap-3 p-4 transition-colors border-b border-white/5 hover:bg-white/5 text-left ${selectedContact?.id === contact.id ? 'bg-white/5' : ''
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                                            {contact.avatar ? (
                                                <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        {contact.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#111]">
                                                {contact.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <p className="font-semibold text-white truncate">{contact.name}</p>
                                            {contact.lastMessage && (
                                                <span className="text-[10px] text-gray-500">
                                                    {new Date(contact.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs truncate ${contact.unreadCount > 0 ? 'text-primary font-medium' : 'text-gray-500'}`}>
                                            {contact.lastMessage?.conteudo || 'Nenhuma mensagem'}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#151515]">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                                {selectedContact.avatar ? (
                                    <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h2 className="font-bold text-white">{selectedContact.name}</h2>
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                    Online agora (simulado)
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => {
                                const isMe = message.remetenteId === session?.user?.email || message.remetenteId === 'me' || (messages.length > 0 && message.remetenteId !== selectedContact.id); // Lógica melhorada seria comparar IDs
                                // Como não temos o ID do usuário logado fácil aqui sem chamar API, vamos assumir:
                                // Se remetente != selectedContact.id, então sou eu.
                                const isCurrentUser = message.remetenteId !== selectedContact.id;

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl p-4 ${isCurrentUser
                                                    ? 'bg-primary text-black rounded-tr-sm'
                                                    : 'bg-gray-800 text-white rounded-tl-sm'
                                                }`}
                                        >
                                            <p className="text-sm">{message.conteudo}</p>
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <span className={`text-[10px] ${isCurrentUser ? 'text-black/60' : 'text-gray-400'}`}>
                                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isCurrentUser && (
                                                    message.lida ? <CheckCheck className="w-3 h-3 text-black/60" /> : <Check className="w-3 h-3 text-black/60" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
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
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-primary"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-8 h-8 text-gray-600" />
                        </div>
                        <p>Selecione um aluno para iniciar a conversa</p>
                    </div>
                )}
            </div>
        </div>
    );
}
