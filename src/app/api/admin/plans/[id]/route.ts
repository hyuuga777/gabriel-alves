import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'plans.json');

function getPlans() {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    try {
        return JSON.parse(fileContent);
    } catch (e) {
        return [];
    }
}

function savePlans(plans: any[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(plans, null, 2));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const body = await request.json();
    const plans = getPlans();

    const index = plans.findIndex((p: any) => p.id === id);
    if (index === -1) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Update plan
    plans[index] = { ...plans[index], ...body, id }; // Ensure ID doesn't change
    savePlans(plans);

    return NextResponse.json(plans[index]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    let plans = getPlans();

    plans = plans.filter((p: any) => p.id !== id);
    savePlans(plans);

    return NextResponse.json({ success: true });
}
