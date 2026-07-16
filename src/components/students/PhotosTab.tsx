'use client';

import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Calendar, Filter, Maximize2, Trash2, Layout, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const PROGRESS_PHOTOS = [
    { id: '1', date: '15 Mar, 2024', weight: '82.4 kg', type: 'Frente', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop' },
    { id: '2', date: '15 Mar, 2024', weight: '82.4 kg', type: 'Lado', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop' },
    { id: '3', date: '01 Fev, 2024', weight: '83.8 kg', type: 'Frente', url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c798f?q=80&w=400&auto=format&fit=crop' },
    { id: '4', date: '01 Fev, 2024', weight: '83.8 kg', type: 'Costas', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop' },
    { id: '5', date: '10 Jan, 2024', weight: '85.5 kg', type: 'Frente', url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop' },
    { id: '6', date: '10 Jan, 2024', weight: '85.5 kg', type: 'Lado', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop' },
];

export function PhotosTab() {
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [photos, setPhotos] = useState(PROGRESS_PHOTOS);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedPhotos = localStorage.getItem('evolution_photos_mock-1');
        if (savedPhotos) {
            try {
                setPhotos(JSON.parse(savedPhotos));
            } catch (e) {
                console.error("Error parsing saved photos", e);
            }
        }
    }, []);

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
                    // Save to localStorage as a fallback
                    try {
                        localStorage.setItem('evolution_photos_mock-1', JSON.stringify(updated));
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
                localStorage.setItem('evolution_photos_mock-1', JSON.stringify(updated));
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
                            className="bg-primary text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
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
                                        <button className="p-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20">
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
        </div>
    );
}
