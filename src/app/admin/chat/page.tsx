'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Search, Send, Paperclip, Check, CheckCheck, User, MessageSquare, ArrowLeft } from 'lucide-react';
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

function AdminChatContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const preselectedUserId = searchParams.get('userId');

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingContacts, setLoadingContacts] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch contacts
    useEffect(() => {
        fetchContacts();
        const interval = setInterval(fetchContacts, 10000);
        return () => clearInterval(interval);
    }, []);

    // Auto-select student from URL param after contacts are loaded
    useEffect(() => {
        if (preselectedUserId && contacts.length > 0 && !selectedContact) {
            const found = contacts.find(c => c.id === preselectedUserId);
            if (found) {
                setSelectedContact(found);
            } else {
                // If student not in contacts yet (no prior message), fetch their info and create a virtual contact
                fetchUserAndSelect(preselectedUserId);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contacts, preselectedUserId]);

    // Fetch messages when contact selected
    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
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

    // Fetch user info to create a virtual contact when no prior messages exist
    const fetchUserAndSelect = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`);
            if (res.ok) {
                const data = await res.json();
                const virtualContact: Contact = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                    unreadCount: 0,
                };
                setSelectedContact(virtualContact);
            }
        } catch (error) {
            console.error('Failed to fetch user info', error);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const res = await fetch(`/api/chat/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);

                const hasUnread = data.some((m: Message) => m.remetenteId === userId && !m.lida);
                if (hasUnread) {
                    await fetch(`/api/chat/${userId}`, { method: 'PUT' });
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
            remetenteId: 'me',
            destinatarioId: selectedContact.id,
            conteudo: newMessage,
            lida: false,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempData]);
        setNewMessage('');
        setTimeout(() => inputRef.current?.focus(), 50);

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
                fetchContacts();
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
            <div className={`${selectedContact ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 flex-col bg-[#111] border border-white/5 rounded-xl overflow-hidden`}>
                <div className="p-4 border-b border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Mensagens</h1>
                    </div>
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
                        <div className="p-8 text-center">
                            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredContacts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-gray-700" />
                            <p>Nenhuma conversa ainda.</p>
                            <p className="text-xs mt-1 text-gray-600">Acesse o perfil de um aluno e clique em "Chat Direto"</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredContacts.map(contact => (
                                <button
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`flex items-center gap-3 p-4 transition-colors border-b border-white/5 hover:bg-white/5 text-left ${selectedContact?.id === contact.id ? 'bg-white/5 border-l-2 border-l-primary' : ''}`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-11 h-11 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
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
                                                <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
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
            <div className={`${selectedContact ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-[#111] border border-white/5 rounded-xl overflow-hidden`}>
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#151515]">
                            <button
                                onClick={() => { setSelectedContact(null); setMessages([]); }}
                                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg mr-1"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                                {selectedContact.avatar ? (
                                    <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h2 className="font-bold text-white">{selectedContact.name}</h2>
                                <p className="text-xs text-gray-500">{selectedContact.email}</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                                    <MessageSquare className="w-10 h-10 mb-3 text-gray-700" />
                                    <p className="text-sm">Nenhuma mensagem ainda.</p>
                                    <p className="text-xs mt-1">Envie a primeira mensagem para {selectedContact.name}!</p>
                                </div>
                            )}
                            {messages.map((message) => {
                                const isCurrentUser = message.remetenteId !== selectedContact.id;
                                return (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${isCurrentUser
                                                ? 'bg-primary text-black rounded-tr-sm'
                                                : 'bg-gray-800 text-white rounded-tl-sm'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.conteudo}</p>
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <span className={`text-[10px] ${isCurrentUser ? 'text-black/60' : 'text-gray-400'}`}>
                                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isCurrentUser && (
                                                    message.lida
                                                        ? <CheckCheck className="w-3 h-3 text-black/60" />
                                                        : <Check className="w-3 h-3 text-black/60" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#151515] flex gap-2 items-center">
                            <button
                                type="button"
                                className="p-3 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg flex-shrink-0"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={`Mensagem para ${selectedContact.name}...`}
                                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 bg-primary text-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-[0_0_15px_rgba(0,202,202,0.3)] hover:shadow-[0_0_25px_rgba(0,202,202,0.5)]"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-10 h-10 text-gray-700" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-400">Selecione uma conversa</p>
                            <p className="text-sm mt-1 text-gray-600">ou acesse o perfil de um aluno e clique em "Chat Direto"</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminChatPage() {
    return (
        <Suspense fallback={
            <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        }>
            <AdminChatContent />
        </Suspense>
    );
}
