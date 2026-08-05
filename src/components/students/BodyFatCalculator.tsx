'use client';

import { useState } from 'react';
import { Calculator, Save, CheckCircle2 } from 'lucide-react';

export function BodyFatCalculator({ studentId, age = 30, gender = 'masculino', onSave }: { studentId: string, age?: number, gender?: string, onSave: () => void }) {
    const [dobras, setDobras] = useState({
        triceps: '',
        subescapular: '',
        peitoral: '',
        axilarMedia: '',
        supraIliaca: '',
        abdomen: '',
        coxa: ''
    });

    const [resultado, setResultado] = useState<{ bf: number, dc: number } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const calcularPollock7 = () => {
        const valores = Object.values(dobras).map(v => parseFloat(v) || 0);
        const soma = valores.reduce((a, b) => a + b, 0);

        if (soma === 0) return;

        let DC = 0;
        if (gender === 'masculino' || gender === 'Masculino') {
            DC = 1.112 - (0.00043499 * soma) + (0.00000055 * (soma * soma)) - (0.00028826 * age);
        } else {
            DC = 1.097 - (0.00046971 * soma) + (0.00000056 * (soma * soma)) - (0.00012828 * age);
        }

        const bf = (4.95 / DC - 4.50) * 100;
        setResultado({ bf: Math.max(0, bf), dc: DC });
    };

    const handleSave = async () => {
        if (!resultado) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${studentId}/measurements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    percentualGordura: resultado.bf.toFixed(1),
                    parteCorpo: 'Dobras Cutâneas (Pollock 7)', // mock to save as measurement type
                    valor: resultado.bf.toFixed(1)
                })
            });

            if (res.ok) {
                setSaveSuccess(true);
                onSave();
                setTimeout(() => setSaveSuccess(false), 2000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group mt-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Calculadora %G (Pollock 7 Dobras)
                </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {Object.keys(dobras).map(key => (
                    <div key={key}>
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                            type="number"
                            step="0.1"
                            value={(dobras as any)[key]}
                            onChange={e => setDobras({ ...dobras, [key]: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-primary outline-none text-sm"
                            placeholder="mm"
                        />
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={calcularPollock7}
                    className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                    Calcular % Gordura
                </button>
                
                {resultado && (
                    <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1 bg-primary/20 text-primary px-4 py-3 rounded-xl font-bold text-center border border-primary/30">
                            {resultado.bf.toFixed(1)}% Gordura
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                                saveSuccess ? 'bg-green-500 text-white' : 'bg-primary text-black hover:bg-primary/90'
                            }`}
                        >
                            {isSaving ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 
                             saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {saveSuccess ? 'Salvo' : 'Salvar Resultado'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
