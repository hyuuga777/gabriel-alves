'use client';

import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Calendar, Filter, Maximize2, Trash2, Layout, Plus, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const PROGRESS_PHOTOS = [
    { id: '1', date: '15 Mar, 2024', weight: '82.4 kg', type: 'Frente', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop' },
    { id: '2', date: '15 Mar, 2024', weight: '82.4 kg', type: 'Lado', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop' },
    { id: '3', date: '01 Fev, 2024', weight: '83.8 kg', type: 'Frente', url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c798f?q=80&w=400&auto=format&fit=crop' },
    { id: '4', date: '01 Fev, 2024', weight: '83.8 kg', type: 'Costas', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop' },
    { id: '5', date: '10 Jan, 2024', weight: '85.5 kg', type: 'Frente', url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop' },
    { id: '6', date: '10 Jan, 2024', weight: '85.5 kg', type: 'Lado', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop' },
];

interface PhotosTabProps {
    studentId?: string;
}

export function PhotosTab({ studentId }: PhotosTabProps) {
    const storageKey = `evolution_photos_${studentId || 'default'}`;
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [photos, setPhotos] = useState(PROGRESS_PHOTOS);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [zoomedPhoto, setZoomedPhoto] = useState<any | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const parsePhotoDate = (dateStr: string): number => {
        if (dateStr === 'Hoje' || dateStr.toLowerCase().includes('hoje')) {
            return Date.now();
        }
        const months: { [key: string]: number } = {
            jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
            jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
        };
        
        const cleanStr = dateStr.toLowerCase().replace(',', '');
        const parts = cleanStr.split(' ');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = months[parts[1]] !== undefined ? months[parts[1]] : 0;
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day).getTime();
        }
        return 0;
    };

    const selectedPhotoObjects = photos
        .filter(p => selectedPhotos.includes(p.id))
        .sort((a, b) => parsePhotoDate(a.date) - parsePhotoDate(b.date));

    useEffect(() => {
        const savedPhotos = localStorage.getItem(storageKey);
        if (savedPhotos) {
            try {
                setPhotos(JSON.parse(savedPhotos));
            } catch (e) {
                console.error("Error parsing saved photos", e);
            }
        }
    }, [storageKey]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const base64Url = event.target?.result as string;
                const newPhoto = {
                    id: Math.random().toString(),
                    date: 'Hoje',
                    weight: 'Fictício kg',
                    type: 'Nova Foto',
                    url: base64Url
                };
                
                setPhotos(prev => {
                    const updated = [newPhoto, ...prev];
                    // Save to localStorage keyed by student
                    try {
                        localStorage.setItem(storageKey, JSON.stringify(updated));
                    } catch (err) {
                        console.warn("Storage quota exceeded or error saving base64 to localStorage");
                    }
                    return updated;
                });
            };

            reader.readAsDataURL(file);
        }
    };

    const handleDeletePhoto = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Previne que selecione a foto
        setPhotos(prev => {
            const updated = prev.filter(p => p.id !== id);
            try {
                localStorage.setItem(storageKey, JSON.stringify(updated));
            } catch (err) { }
            return updated;
        });

        if (selectedPhotos.includes(id)) {
            setSelectedPhotos(selectedPhotos.filter(p => p !== id));
        }
    };

    const togglePhotoSelection = (id: string) => {
        if (selectedPhotos.includes(id)) {
            setSelectedPhotos(selectedPhotos.filter(p => p !== id));
        } else if (selectedPhotos.length < 2) {
            setSelectedPhotos([...selectedPhotos, id]);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <ImageIcon className="w-6 h-6 text-primary" />
                        Galeria de Evolução
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Clique para selecionar e comparar (máx 2)</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {selectedPhotos.length === 2 && (
                        <motion.button 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={() => setIsCompareOpen(true)}
                            className="bg-primary text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 cursor-pointer"
                        >
                            <Layout className="w-5 h-5" />
                            Comparar Agora
                        </motion.button>
                    )}
                    <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all font-bold">
                        <Filter className="w-5 h-5" />
                        Filtrar
                    </button>
                </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {photos.map((photo, i) => {
                    const isSelected = selectedPhotos.includes(photo.id);
                    return (
                        <motion.div
                            key={photo.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => togglePhotoSelection(photo.id)}
                            className={`group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${isSelected ? 'border-primary ring-4 ring-primary/20' : 'border-transparent hover:border-white/20'}`}
                        >
                            <img 
                                src={photo.url} 
                                alt={photo.type}
                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isSelected ? 'brightness-110' : 'brightness-75 group-hover:brightness-100'}`}
                            />
                            
                            {/* Overlay Info */}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-bold uppercase tracking-widest mb-1">
                                    <Calendar className="w-3 h-3" />
                                    {photo.date}
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-white text-xs font-black">{photo.type}</p>
                                        <p className="text-primary text-[10px] font-bold">{photo.weight}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setZoomedPhoto(photo);
                                            }}
                                            className="p-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                                        >
                                            <Maximize2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDeletePhoto(e, photo.id)}
                                            className="p-1.5 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Selection Checkmark */}
                            {isSelected && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                    <div className="w-3 h-3 border-b-2 border-r-2 border-black rotate-45 mb-0.5" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {/* Add Photo UI */}
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileSelect}
                />
                <motion.div
                    onClick={() => fileInputRef.current?.click()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: photos.length * 0.05 }}
                    className="aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                >
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Adicionar</span>
                </motion.div>
            </div>

            {/* Modal de Comparação */}
            {isCompareOpen && selectedPhotoObjects.length === 2 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center px-8 py-6 border-b border-white/5">
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-primary" />
                                    Comparação de Evolução
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Comparando fotos selecionadas do aluno</p>
                            </div>
                            <button 
                                onClick={() => setIsCompareOpen(false)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Photos Comparison */}
                        <div className="flex-grow p-8 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                                {selectedPhotoObjects.map((photo, index) => (
                                    <div key={photo.id} className="flex flex-col bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                                        {/* Label Header */}
                                        <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] text-primary font-black uppercase tracking-widest">
                                                {index === 0 ? 'Antes' : 'Depois'}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {photo.type}
                                            </span>
                                        </div>
                                        
                                        {/* Image Container */}
                                        <div className="relative flex-grow min-h-[350px] md:min-h-[450px] bg-black/40 flex items-center justify-center">
                                            <img 
                                                src={photo.url} 
                                                alt={photo.type}
                                                className="w-full h-full max-h-[450px] object-contain"
                                            />
                                        </div>

                                        {/* Photo Stats */}
                                        <div className="p-5 border-t border-white/5 bg-zinc-950/50 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Data</p>
                                                <p className="text-white font-black text-sm">{photo.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Peso</p>
                                                <p className="text-primary font-black text-sm">{photo.weight}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Zoom da Foto Individual */}
            {zoomedPhoto && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    onClick={() => setZoomedPhoto(null)}
                >
                    <div 
                        className="relative max-w-3xl w-full bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
                            <div>
                                <h3 className="text-md font-black text-white tracking-tight">{zoomedPhoto.type}</h3>
                                <p className="text-xs text-gray-400">{zoomedPhoto.date} - {zoomedPhoto.weight}</p>
                            </div>
                            <button 
                                onClick={() => setZoomedPhoto(null)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Image */}
                        <div className="p-4 flex items-center justify-center bg-black overflow-hidden max-h-[75vh]">
                            <img 
                                src={zoomedPhoto.url} 
                                alt={zoomedPhoto.type} 
                                className="max-w-full max-h-[70vh] object-contain rounded-xl" 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
