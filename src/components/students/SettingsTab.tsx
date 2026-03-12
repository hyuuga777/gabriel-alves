'use client';

import { useState } from 'react';
import { Save, Trash2, Bell, MessageSquare, Loader2, AlertTriangle } from 'lucide-react';

interface SettingsTabProps {
    student: any;
}

export function SettingsTab({ student }: SettingsTabProps) {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-white mb-4">Perfil</h3>

                    <div className="grid gap-6 bg-[#111] border border-white/5 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
                            <label className="text-sm text-gray-400 font-medium">Email do Aluno</label>
                            <div className="md:col-span-2">
                                <input
                                    type="email"
                                    value={student.email}
                                    readOnly
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
                            <label className="text-sm text-gray-400 font-medium">Nome do Aluno</label>
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    defaultValue={student.name}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="text-sm text-gray-400 font-medium pt-2">Notas</label>
                            <div className="md:col-span-2">
                                <textarea
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary min-h-[100px]"
                                    placeholder="Adicione notas sobre este aluno..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-[#111] border border-white/5 rounded-xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Chat</p>
                                    <p className="text-xs text-gray-500">Habilitar chat com este aluno</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Notificações</p>
                                    <p className="text-xs text-gray-500">Receber notificações deste aluno</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-400">Status: <span className="text-green-500">Ativo</span> (Desde 07 Dez, 2025)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div>
                    <h3 className="text-lg font-medium text-red-500 mb-6">Zona de Perigo</h3>
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-500 mt-1">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">Excluir Aluno</h4>
                                <p className="text-sm text-gray-400 max-w-sm mt-1">
                                    Excluir este aluno e todos os dados associados. Esta ação não pode ser desfeita.
                                </p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-lg border border-red-500/20 transition-colors whitespace-nowrap">
                            Excluir Aluno
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
