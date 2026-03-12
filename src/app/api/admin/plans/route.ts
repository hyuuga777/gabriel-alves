import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'plans.json');

// Helper to read data
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

// Helper to write data
function savePlans(plans: any[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(plans, null, 2));
}

export async function GET() {
    const plans = getPlans();
    return NextResponse.json(plans);
}

export async function POST(request: Request) {
    const body = await request.json();
    const plans = getPlans();

    const newPlan = {
        ...body,
        id: Date.now(), // Simple ID generation
        features: body.features || [],
    };

    plans.push(newPlan);
    savePlans(plans);

    return NextResponse.json(newPlan);
}
