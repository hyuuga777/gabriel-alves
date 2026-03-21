'use client';

import { useState } from 'react';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    UserPlus,
    User as UserIcon,
    Shield,
    Phone,
    Mail,
    X,
    Save
} from 'lucide-react';
import { deleteUser, createUser, updateUser } from './actions';
import { Role } from '@prisma/client';

interface User {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    avatar: string | null;
    telefone: string | null;
    createdAt: Date;
}

interface UserTableProps {
    initialUsers: User[];
}

export function UserTable({ initialUsers }: UserTableProps) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'Todos' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setSelectedUser(user);
            setIsEditing(true);
        } else {
            setSelectedUser(null);
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        if (isEditing && selectedUser) {
            await updateUser(selectedUser.id, formData);
        } else {
            await createUser(formData);
        }
        
        // Em um cenário real, deveríamos atualizar o estado local ou revalidar
        // Para simplificar, vamos apenas fechar o modal. O usuário verá os dados
        // atualizados ao recarregar ou se usarmos revalidatePath do Next.js 14+
        // que já está em actions.ts.
        window.location.reload(); 
        setIsModalOpen(false);
    };

    const getRoleBadge = (role: Role) => {
        switch (role) {
            case 'ADMIN':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-tighter">Admin</span>;
            case 'TREINADOR':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-tighter">Treinador</span>;
            case 'ALUNO':
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-tighter">Aluno</span>;
        }
    };

    return (
        <div className="space-y-4">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#111111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                        />
                    </div>
                    <div className="relative w-full md:w-48">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full bg-[#111111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer shadow-inner"
                        >
                            <option value="Todos">Todos os Cargos</option>
                            <option value="ADMIN">Admin</option>
                            <option value="TREINADOR">Treinador</option>
                            <option value="ALUNO">Aluno</option>
                        </select>
                    </div>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary text-black px-6 py-2.5 rounded-lg font-black hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 uppercase italic whitespace-nowrap active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    Novo Usuário
                </button>
            </div>

            {/* Grid for users */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-[#111111] border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-all group relative overflow-hidden shadow-2xl">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-8 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all"></div>
                        
                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name || ''} className="w-14 h-14 rounded-full border border-white/10 object-cover shadow-2xl ring-2 ring-primary/10" />
                                ) : (
                                    <div className="w-14 h-14 rounded-full border border-white/10 bg-gradient-to-br from-black to-[#222] flex items-center justify-center shadow-2xl ring-2 ring-primary/5">
                                        <UserIcon className="w-7 h-7 text-gray-500 group-hover:text-primary transition-colors" />
                                    </div>
                                )}
                                <div className="max-w-[140px]">
                                    <h3 className="text-white font-black leading-tight group-hover:text-primary transition-colors truncate uppercase italic">{user.name || 'Sem nome'}</h3>
                                    <div className="mt-1">
                                        {getRoleBadge(user.role)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button 
                                    onClick={() => handleOpenModal(user)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" 
                                    title="Editar"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" 
                                    title="Excluir"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3 relative z-10">
                            <div className="flex items-center gap-3 text-sm text-gray-400 bg-black/30 p-2 rounded-lg border border-white/5">
                                <Mail className="w-4 h-4 text-primary/40 flex-shrink-0" />
                                <span className="truncate font-medium">{user.email}</span>
                            </div>
                            {user.telefone && (
                                <div className="flex items-center gap-3 text-sm text-gray-400 bg-black/30 p-2 rounded-lg border border-white/5">
                                    <Phone className="w-4 h-4 text-primary/40 flex-shrink-0" />
                                    <span className="font-medium">{user.telefone}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                            <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest italic flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-primary/30"></span>
                                REGISTRO: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-[#0a0a0a] rounded-xl border-2 border-dashed border-white/5">
                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <UserIcon className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-white font-black uppercase italic text-xl">Nenhum Usuário</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto font-medium">Não encontramos registros para os filtros selecionados. Tente novamente.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                    {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
                                </h2>
                                <p className="text-gray-400 text-xs mt-1 uppercase font-bold tracking-widest">
                                    {isEditing ? 'Atualizar informações do registro' : 'Cadastrar novo acesso na plataforma'}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic ml-1">Nome Completo</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        defaultValue={selectedUser?.name || ''}
                                        placeholder="EX: JOÃO SILVA"
                                        className="w-full bg-black border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary/50 transition-all text-sm font-bold uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic ml-1">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        defaultValue={selectedUser?.email || ''}
                                        placeholder="EX@EMAIL.COM"
                                        className="w-full bg-black border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary/50 transition-all text-sm font-bold lowercase"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic ml-1">Cargo / Role</label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <select
                                            required
                                            name="role"
                                            defaultValue={selectedUser?.role || 'ALUNO'}
                                            className="w-full bg-black border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-black uppercase appearance-none italic"
                                        >
                                            <option value="ADMIN">Admin</option>
                                            <option value="TREINADOR">Treinador</option>
                                            <option value="ALUNO">Aluno</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic ml-1">Telefone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input
                                            name="telefone"
                                            type="text"
                                            defaultValue={selectedUser?.telefone || ''}
                                            placeholder="(00) 00000-0000"
                                            className="w-full bg-black border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary/50 transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic ml-1">
                                    {isEditing ? 'Nova Senha (opcional)' : 'Senha de Acesso'}
                                </label>
                                <input
                                    required={!isEditing}
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-black border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder-gray-700 focus:outline-none focus:border-primary/50 transition-all text-sm font-bold shadow-inner"
                                />
                                {isEditing && <p className="text-[9px] text-gray-600 font-bold ml-1 uppercase">Deixe em branco para manter a senha atual.</p>}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-black py-3 rounded-xl font-black uppercase italic flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/20 active:scale-[0.98]"
                                >
                                    <Save className="w-5 h-5" />
                                    {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
