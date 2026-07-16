'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function getUsers() {
    try {
        return await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                telefone: true,
                createdAt: true,
            }
        });
    } catch(e) {
        console.error('Prisma failed in getUsers action', e);
        const { getDb } = await import("@/lib/localDb");
        return getDb().users;
    }
}

export async function createUser(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as Role;
        const telefone = formData.get('telefone') as string;

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                telefone,
            }
        });
    } catch(e) {
        console.error('Prisma failed in createUser action', e);
        const { getDb, saveDb } = await import("@/lib/localDb");
        const db = getDb();
        db.users.unshift({
            id: 'mock-' + Date.now(),
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as string,
            telefone: formData.get('telefone') as string,
            createdAt: new Date().toISOString(),
            status: 'ATIVA'
        });
        saveDb(db);
    }

    revalidatePath('/admin/usuarios');
}

export async function updateUser(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as Role;
        const telefone = formData.get('telefone') as string;
        const password = formData.get('password') as string;

        const data: any = {
            name,
            email,
            role,
            telefone,
        };

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({
            where: { id },
            data,
        });
    } catch(e) {
         console.error('Prisma failed in updateUser action', e);
         const { getDb, saveDb } = await import("@/lib/localDb");
         const db = getDb();
         const userIndex = db.users.findIndex((u: any) => u.id === id);
         if (userIndex !== -1) {
             db.users[userIndex] = { ...db.users[userIndex], name: formData.get('name'), email: formData.get('email'), role: formData.get('role'), telefone: formData.get('telefone') };
             saveDb(db);
         }
    }
    revalidatePath('/admin/usuarios');
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id },
        });
    } catch(e) {
        console.error('Prisma failed in deleteUser action', e);
        const { getDb, saveDb } = await import("@/lib/localDb");
        const db = getDb();
        db.users = db.users.filter((u: any) => u.id !== id);
        saveDb(db);
    }
    revalidatePath('/admin/usuarios');
}
