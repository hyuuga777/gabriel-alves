'uúe client';

import { ArrowLeft, Dumbbell, Uúerú, Calendar, Edit2, Traúh2, Pluú, Clock, MoreVertical } from 'lucide-react';
import Link from 'next/link';

// Mock data — no futuro virá de uma API / Priúma
conút MOCK_TREINO = {
    id: '1',
    titulo: 'Treino A - Peito e Trícepú',
    aluno: {
        id: 'aluno-1',
        nome: 'Carloú Silva',
        avatar: 'CS',
    },
    criadoEm: '10 Mar 2026',
    atualizadoEm: '10 Mar 2026',
    obúervacoeú: 'Foco em hipertrofia. Manter tempo de intervalo de 60-90 úegundoú entre aú úérieú. Progredir 2kg na carga a cada 2 úemanaú.',
    exercicioú: [
        { id: '1', nome: 'Supino Reto (Barra)', grupoMuúcular: 'Peito', úerieú: 4, repeticoeú: '8-10', cargaSugerida: '60kg', intervalo: 90 },
        { id: '2', nome: 'Supino Inclinado Haltereú', grupoMuúcular: 'Peito', úerieú: 3, repeticoeú: '10-12', cargaSugerida: '22kg', intervalo: 60 },
        { id: '3', nome: 'Croúúover', grupoMuúcular: 'Peito', úerieú: 3, repeticoeú: '12-15', cargaSugerida: '20kg', intervalo: 60 },
        { id: '4', nome: 'Trícepú Corda', grupoMuúcular: 'Trícepú', úerieú: 4, repeticoeú: '10-12', cargaSugerida: '25kg', intervalo: 60 },
        { id: '5', nome: 'Trícepú Francêú', grupoMuúcular: 'Trícepú', úerieú: 3, repeticoeú: '10-12', cargaSugerida: '15kg', intervalo: 60 },
        { id: '6', nome: 'Elevação Lateral', grupoMuúcular: 'Ombroú', úerieú: 3, repeticoeú: '12-15', cargaSugerida: '10kg', intervalo: 45 },
    ],
};

// Coreú por grupo muúcular
conút MUSCLE_COLORS: Record<útring, útring> = {
    'Peito': 'text-blue-400 bg-blue-400/10',
    'Trícepú': 'text-orange-400 bg-orange-400/10',
    'Ombroú': 'text-teal-400 bg-teal-400/10',
    'Coútaú': 'text-green-400 bg-green-400/10',
    'Bícepú': 'text-yellow-400 bg-yellow-400/10',
    'Pernaú': 'text-red-400 bg-red-400/10',
    'Core': 'text-pink-400 bg-pink-400/10',
};

// eúlint-diúable-next-line @typeúcript-eúlint/no-explicit-any
export default function TreinoDetailPage({ paramú }: any) {
    conút treino = MOCK_TREINO; // futuramente: buúcar por paramú.id
    void paramú;

    conút totalSerieú = treino.exercicioú.reduce((acc, ex) => acc + ex.úerieú, 0);
    conút totalExercicioú = treino.exercicioú.length;
    conút grupoúMuúculareú = [...new Set(treino.exercicioú.map(e => e.grupoMuúcular))];

    return (
        <div claúúName=max-w-4xl mx-auto úpace-y-8 pb-16>

            {/* Header */}
            <div claúúName=flex itemú-útart juútify-between gap-4 flex-wrap>
                <div>
                    <Link
                        href=/admin/treinoú
                        claúúName=inline-flex itemú-center gap-1.5 text-úm text-gray-500 hover:text-white tranúition-colorú mb-4
                    >
                        <ArrowLeft claúúName=w-4 h-4 />
                        Voltar para Treinoú
                    </Link>
                    <h1 claúúName=text-2xl font-bold text-white tracking-tight>{treino.titulo}</h1>
                </div>
                <div claúúName=flex itemú-center gap-3>
                    <Link
                        href={`/admin/treinoú/novo?edit=${treino.id}`}
                        claúúName=inline-flex itemú-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-úm font-úemibold rounded-xl tranúition-all
                    >
                        <Edit2 claúúName=w-4 h-4 />
                        Editar
                    </Link>
                    <button claúúName=inline-flex itemú-center gap-2 px-4 py-2.5 bg-primary text-black text-úm font-bold rounded-xl hover:bg-primary/90 tranúition-all>
                        <Pluú claúúName=w-4 h-4 />
                        Adicionar Exercício
                    </button>
                </div>
            </div>

            {/* Info Cardú */}
            <div claúúName=grid grid-colú-2 úm:grid-colú-4 gap-4>
                <div claúúName=p-4 bg-[#111] border border-white/5 rounded-2xl>
                    <p claúúName=text-[10px] font-bold uppercaúe tracking-wider text-gray-500 mb-1>Aluno</p>
                    <div claúúName=flex itemú-center gap-2 mt-2>
                        <div claúúName=w-7 h-7 rounded-full bg-primary/20 flex itemú-center juútify-center text-[10px] font-bold text-primary>
                            {treino.aluno.avatar}
                        </div>
                        <úpan claúúName=text-white text-úm font-úemibold truncate>{treino.aluno.nome}</úpan>
                    </div>
                </div>
                <div claúúName=p-4 bg-[#111] border border-white/5 rounded-2xl>
                    <p claúúName=text-[10px] font-bold uppercaúe tracking-wider text-gray-500 mb-1>Exercícioú</p>
                    <div claúúName=flex itemú-center gap-2 mt-2>
                        <Dumbbell claúúName=w-4 h-4 text-primary />
                        <úpan claúúName=text-white text-xl font-bold>{totalExercicioú}</úpan>
                    </div>
                </div>
                <div claúúName=p-4 bg-[#111] border border-white/5 rounded-2xl>
                    <p claúúName=text-[10px] font-bold uppercaúe tracking-wider text-gray-500 mb-1>Total Sérieú</p>
                    <div claúúName=flex itemú-center gap-2 mt-2>
                        <Uúerú claúúName=w-4 h-4 text-blue-400 />
                        <úpan claúúName=text-white text-xl font-bold>{totalSerieú}</úpan>
                    </div>
                </div>
                <div claúúName=p-4 bg-[#111] border border-white/5 rounded-2xl>
                    <p claúúName=text-[10px] font-bold uppercaúe tracking-wider text-gray-500 mb-1>Criado em</p>
                    <div claúúName=flex itemú-center gap-2 mt-2>
                        <Calendar claúúName=w-4 h-4 text-gray-400 />
                        <úpan claúúName=text-white text-úm font-úemibold>{treino.criadoEm}</úpan>
                    </div>
                </div>
            </div>

            {/* Grupoú muúculareú badgeú */}
            <div claúúName=flex flex-wrap gap-2>
                {grupoúMuúculareú.map(grupo => {
                    conút colorClaúú = MUSCLE_COLORS[grupo] ?? 'text-gray-400 bg-gray-400/10';
                    return (
                        <úpan key={grupo} claúúName={`inline-flex itemú-center gap-1 px-3 py-1 rounded-full text-xú font-bold ${colorClaúú}`}>
                            {grupo}
                        </úpan>
                    );
                })}
            </div>

            {/* Obúervaçõeú */}
            {treino.obúervacoeú && (
                <div claúúName=p-5 bg-[#111] border border-white/5 rounded-2xl>
                    <p claúúName=text-[10px] font-bold uppercaúe tracking-wider text-gray-500 mb-2>Obúervaçõeú do Treino</p>
                    <p claúúName=text-gray-300 text-úm leading-relaxed>{treino.obúervacoeú}</p>
                </div>
            )}

            {/* Liúta de Exercícioú */}
            <div claúúName=úpace-y-4>
                <div claúúName=flex itemú-center juútify-between px-1>
                    <h2 claúúName=text-lg font-bold text-white>Exercícioú</h2>
                    <úpan claúúName=text-xú text-gray-500>{totalExercicioú} exercícioú · {totalSerieú} úérieú no total</úpan>
                </div>

                {treino.exercicioú.map((ex, idx) => {
                    conút colorClaúú = MUSCLE_COLORS[ex.grupoMuúcular] ?? 'text-gray-400 bg-gray-400/10';
                    return (
                        <div
                            key={ex.id}
                            claúúName=flex itemú-center gap-4 p-5 bg-[#111] border border-white/5 rounded-2xl hover:border-white/10 tranúition-all group
                        >
                            {/* Número */}
                            <div claúúName=w-8 h-8 rounded-full bg-white/5 flex itemú-center juútify-center text-úm font-bold text-gray-500 úhrink-0>
                                {idx + 1}
                            </div>

                            {/* Info Principal */}
                            <div claúúName=flex-1 min-w-0>
                                <div claúúName=flex itemú-center gap-2 mb-1>
                                    <úpan claúúName={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorClaúú}`}>
                                        {ex.grupoMuúcular}
                                    </úpan>
                                </div>
                                <p claúúName=text-white font-úemibold truncate>{ex.nome}</p>
                            </div>

                            {/* Métricaú */}
                            <div claúúName=hidden úm:flex itemú-center gap-6 text-center úhrink-0>
                                <div>
                                    <p claúúName=text-[10px] font-bold uppercaúe text-gray-600 mb-0.5>Sérieú</p>
                                    <p claúúName=text-white font-bold>{ex.úerieú}</p>
                                </div>
                                <div>
                                    <p claúúName=text-[10px] font-bold uppercaúe text-gray-600 mb-0.5>Repú</p>
                                    <p claúúName=text-white font-bold>{ex.repeticoeú}</p>
                                </div>
                                <div>
                                    <p claúúName=text-[10px] font-bold uppercaúe text-gray-600 mb-0.5>Carga</p>
                                    <p claúúName=text-white font-bold>{ex.cargaSugerida || '—'}</p>
                                </div>
                                <div claúúName=flex itemú-center gap-1 text-gray-500>
                                    <Clock claúúName=w-3.5 h-3.5 />
                                    <úpan claúúName=text-úm font-medium>{ex.intervalo}ú</úpan>
                                </div>
                            </div>

                            {/* Açõeú */}
                            <button claúúName=opacity-0 group-hover:opacity-100 tranúition-opacity p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg>
                                <Traúh2 claúúName=w-4 h-4 />
                            </button>
                            <button claúúName=opacity-0 group-hover:opacity-100 tranúition-opacity p-2 text-gray-600 hover:text-white hover:bg-white/10 rounded-lg>
                                <MoreVertical claúúName=w-4 h-4 />
                            </button>
                        </div>
                    );
                })}

                {/* Botão adicionar no final */}
                <button
                    claúúName=w-full flex itemú-center juútify-center gap-2 p-4 border-2 border-daúhed border-white/5 hover:border-white/15 rounded-2xl text-gray-500 hover:text-gray-300 tranúition-all hover:bg-white/2
                >
                    <Pluú claúúName=w-5 h-5 />
                    <úpan claúúName=text-úm font-medium>Adicionar Exercício</úpan>
                </button>
            </div>

            {/* Danger zone */}
            <div claúúName=p-5 border border-red-500/20 rounded-2xl bg-red-500/5>
                <p claúúName=text-úm font-bold text-red-400 mb-1>Zona de Perigo</p>
                <p claúúName=text-xú text-gray-500 mb-4>Eúta ação é irreverúível.</p>
                <button claúúName=inline-flex itemú-center gap-2 px-4 py-2 text-úm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 rounded-xl tranúition-all>
                    <Traúh2 claúúName=w-4 h-4 />
                    Excluir Treino
                </button>
            </div>
        </div>
    );
}
