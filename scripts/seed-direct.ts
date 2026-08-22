import { GET } from '../src/app/api/seed/route';

async function main() {
    const res = await GET();
    const data = await res.json();
    console.log(data);
}

main().catch(console.error);
