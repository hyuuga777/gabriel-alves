import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/localDb";

const DEFAULT_GROUPS = [
    'Peito',
    'Costas',
    'Pernas',
    'Quadríceps',
    'Posterior',
    'Glúteos',
    'Ombros',
    'Bíceps',
    'Tríceps',
    'Abdômen',
    'Panturrilha',
    'Antebraço',
    'Cardio',
    'Geral'
];

export async function GET() {
    try {
        const db = getDb();
        if (!db.groups || !Array.isArray(db.groups) || db.groups.length === 0) {
            db.groups = DEFAULT_GROUPS;
            saveDb(db);
        }
        return NextResponse.json(db.groups);
    } catch (error) {
        console.error("[GROUPS_GET]", error);
        return NextResponse.json(DEFAULT_GROUPS);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return new NextResponse("Group name is required", { status: 400 });
        }

        const trimmedName = name.trim();
        const db = getDb();
        if (!db.groups || !Array.isArray(db.groups)) {
            db.groups = [...DEFAULT_GROUPS];
        }

        // Avoid case-insensitive duplicates
        const exists = db.groups.some(
            (g: string) => g.toLowerCase() === trimmedName.toLowerCase()
        );

        if (!exists) {
            db.groups.push(trimmedName);
            saveDb(db);
        }

        return NextResponse.json({ success: true, groups: db.groups, added: trimmedName });
    } catch (error) {
        console.error("[GROUPS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const db = getDb();
        if (db.groups && Array.isArray(db.groups)) {
            db.groups = db.groups.filter((g: string) => g.toLowerCase() !== name.toLowerCase());
            saveDb(db);
        }

        return NextResponse.json({ success: true, groups: db.groups || DEFAULT_GROUPS });
    } catch (error) {
        console.error("[GROUPS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
