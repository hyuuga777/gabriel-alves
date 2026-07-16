
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'local-data.json');

export function getDb() {
    if (!fs.existsSync(DB_PATH)) {
        const initialData = {
            users: [
                { id: '1', name: 'Gabriel Alves', email: 'gabriel@exemplo.com', role: 'ALUNO', createdAt: new Date().toISOString(), status: 'ATIVA' }
            ],
            workouts: [],
            exercises: [],
            activities: [],
            config: { name: 'Admin', email: 'admin@fitness.com' }
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

export function saveDb(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

