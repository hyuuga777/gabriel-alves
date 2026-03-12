'use client';

import { Plus, LayoutTemplate, User } from 'lucide-react';

interface ProgressPicturesTabProps {
    student: any;
}

const mockPhotos = [
    { id: 1, date: '07 de dezembro de 2025', weight: '83,0 kg', image: '/placeholder-body.jpg' },
    { id: 2, date: '30 de novembro de 2025', weight: '81,1 kg', image: '/placeholder-body.jpg' },
    { id: 3, date: '23 de novembro de 2025', weight: '88,1 kg', image: '/placeholder-body.jpg' },
    { id: 4, date: '16 de novembro de 2025', weight: '97,2 kg', image: '/placeholder-body.jpg' },
    { id: 5, date: '09 de novembro de 2025', weight: '96,3 kg', image: '/placeholder-body.jpg' },
];

export function ProgressPicturesTab({ student }: ProgressPicturesTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Fotos do progresso</h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 font-medium transition-colors">
                        <LayoutTemplate className="w-4 h-4 text-gray-500" />
                        Comparação
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors">
                        <Plus className="w-4 h-4" />
                        Medição de logaritmo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mockPhotos.map((photo) => (
                    <div key={photo.id} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 overflow-hidden relative group">
                            {/* Placeholder for actual image */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                <User className="w-24 h-24 text-gray-200" />
                            </div>
                            {/* Overlay effect */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>
                        <div className="px-2 pb-2">
                            <p className="font-semibold text-gray-900 text-sm mb-1">{photo.date}</p>
                            <p className="text-gray-500 text-sm">{photo.weight}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
