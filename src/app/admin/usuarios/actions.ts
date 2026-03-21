'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function getUsers() {
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
}

export async function createUser(formData: FormData) {
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

    revalidatePath('/admin/usuarios');
}

export async function updateUser(id: string, formData: FormData) {
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

    revalidatePath('/admin/usuarios');
}

export async function deleteUser(id: string) {
    await prisma.user.delete({
        where: { id },
    });

    revalidatePath('/admin/usuarios');
}
