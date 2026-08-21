import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb, saveDb } from "@/lib/localDb";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "ALUNO") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const email = session.user.email;
        
        // Fetch from Prisma
        const { prisma } = await import("@/lib/prisma");
        const userPrisma = await prisma.user.findUnique({
            where: { email: email as string },
            include: { alunoProfile: true, assinaturas: { include: { plano: true } } }
        });

        if (userPrisma) {
            return NextResponse.json(userPrisma);
        }

        // Fallback to localDb
        const db = getDb();
        const user = db.users.find((u: any) => u.email === email);

        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Erro ao buscar perfil do aluno:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "ALUNO") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const body = await req.json();
        const email = session.user.email as string;
        
        const { prisma } = await import("@/lib/prisma");
        const userPrisma = await prisma.user.findUnique({ where: { email } });

        if (userPrisma) {
            // Update Prisma
            const { name, telefone, alunoProfile, rotina } = body;
            
            await prisma.user.update({
                where: { email },
                data: {
                    ...(name && { name }),
                    ...(telefone && { telefone })
                }
            });

            if (alunoProfile) {
                await prisma.alunoProfile.upsert({
                    where: { userId: userPrisma.id },
                    create: {
                        userId: userPrisma.id,
                        ...alunoProfile,
                        ...(rotina && { rotina }),
                        dataNascimento: alunoProfile.dataNascimento ? new Date(alunoProfile.dataNascimento) : new Date(),
                    },
                    update: {
                        ...alunoProfile,
                        ...(rotina && { rotina }),
                        ...(alunoProfile.dataNascimento && { dataNascimento: new Date(alunoProfile.dataNascimento) }),
                    }
                });
            }
            
            const updatedUser = await prisma.user.findUnique({
                where: { email },
                include: { alunoProfile: true }
            });
            return NextResponse.json(updatedUser);
        }

        // Fallback localDb
        const db = getDb();
        const userIndex = db.users.findIndex((u: any) => u.email === email);

        if (userIndex === -1) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        // Merge fields
        const updatedUser = {
            ...db.users[userIndex],
            name: body.name || db.users[userIndex].name,
            bio: body.bio !== undefined ? body.bio : db.users[userIndex].bio,
            link: body.link !== undefined ? body.link : db.users[userIndex].link,
            birthDate: body.birthDate !== undefined ? body.birthDate : db.users[userIndex].birthDate,
            gender: body.gender !== undefined ? body.gender : db.users[userIndex].gender,
            phone: body.phone !== undefined ? body.phone : db.users[userIndex].phone,
            address: body.address !== undefined ? body.address : db.users[userIndex].address,
            avatar: body.avatar !== undefined ? body.avatar : db.users[userIndex].avatar,
        };

        db.users[userIndex] = updatedUser;
        saveDb(db);

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}
