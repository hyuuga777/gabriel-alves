import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "./actions";
import { UserTable } from "./UserTable";
import { Users as UsersIcon } from "lucide-react";

export default async function UsuariosPage() {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
        redirect("/admin/painel");
    }

    const users = await getUsers();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <UsersIcon className="w-8 h-8 text-primary shadow-sm" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                                Gestão de Usuários
                            </h1>
                            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {users.length} usuários registrados na plataforma
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <UserTable initialUsers={users} />
        </div>
    );
}
