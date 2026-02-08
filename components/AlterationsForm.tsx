import React, { useState } from 'react';
import { Shirt, Scissors, Tag, Calendar as CalendarIcon, Camera, Plus } from 'lucide-react';
import { Client } from '../types';

export const AlterationsForm: React.FC = () => {
    const [activeClient] = useState<Partial<Client>>({ name: "Laura Castillo", id: "2" });
    const [selectedGarment, setSelectedGarment] = useState<string>('pantalon');

    // Tasks state structure
    const [tasks, setTasks] = useState([
        { id: 'ruedo', label: 'Ruedo / Basta', price: 15.00, selected: false },
        { id: 'cintura', label: 'Ajuste Cintura', price: 25.00, selected: false },
        { id: 'cierre', label: 'Cambio de Cierre', price: 20.00, selected: false },
        { id: 'parches', label: 'Zurcido / Parches', price: 10.00, selected: false },
        { id: 'mangas', label: 'Acortar Mangas', price: 18.00, selected: false },
        { id: 'botones', label: 'Reponer Botones', price: 5.00, selected: false },
    ]);

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
    };

    const updatePrice = (id: string, newPrice: string) => {
        const price = parseFloat(newPrice) || 0;
        setTasks(tasks.map(t => t.id === id ? { ...t, price } : t));
    };

    const calculateTotal = () => {
        return tasks.filter(t => t.selected).reduce((acc, curr) => acc + curr.price, 0);
    };

    const garmentTypes = [
        { id: 'pantalon', label: 'Pantalón', icon: Scissors },
        { id: 'vestido', label: 'Vestido', icon: Shirt },
        { id: 'camisa', label: 'Camisa/Blusa', icon: Tag },
        { id: 'chaqueta', label: 'Chaqueta', icon: Shirt },
    ];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in pb-24 md:pb-8">
            {/* Header Section */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                </div>

            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Work Details */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Garment Selection */}
                    <section className="bg-surface rounded-xl p-6 shadow-card border border-gray-50">
                        <h3 className="font-serif text-xl text-charcoal mb-4">Tipo de Prenda</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {garmentTypes.map((garment) => (
                                <button
                                    key={garment.id}
                                    onClick={() => setSelectedGarment(garment.id)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${selectedGarment === garment.id
                                        ? 'border-terracotta bg-terracotta/5 text-terracotta'
                                        : 'border-gray-100 bg-white text-charcoal-light hover:border-gray-200'
                                        }`}
                                >
                                    <garment.icon size={28} className="mb-2" strokeWidth={1.5} />
                                    <span className="text-sm font-medium">{garment.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Tasks List */}
                    <section className="bg-surface rounded-xl p-6 shadow-card border border-gray-50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-xl text-charcoal">Tareas a realizar</h3>
                            <button className="text-xs font-bold text-terracotta bg-terracotta/10 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-terracotta/20 transition-colors">
                                <Plus size={14} /> Tarea Personalizada
                            </button>
                        </div>

                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${task.selected ? 'bg-linen border-terracotta/30' : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={task.selected}
                                            onChange={() => toggleTask(task.id)}
                                            className="w-6 h-6 rounded-md border-2 border-charcoal-light/30 text-terracotta focus:ring-terracotta cursor-pointer accent-terracotta"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <span className={`font-medium ${task.selected ? 'text-charcoal' : 'text-charcoal-light'}`}>
                                            {task.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-charcoal-light text-sm font-medium">$</span>
                                        <input
                                            type="number"
                                            value={task.price}
                                            onChange={(e) => updatePrice(task.id, e.target.value)}
                                            disabled={!task.selected}
                                            className={`w-20 p-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:ring-terracotta/20 ${task.selected ? 'bg-white text-charcoal border border-gray-200' : 'bg-transparent text-gray-400 border-transparent'
                                                }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Specific Notes */}
                    <section className="bg-surface rounded-xl p-6 shadow-card border border-gray-50">
                        <h3 className="font-serif text-xl text-charcoal mb-4">Notas Específicas</h3>
                        <textarea
                            className="w-full h-32 bg-linen border border-gray-200 rounded-xl p-4 text-sm text-charcoal resize-none focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
                            placeholder="Detalles sobre el arreglo (e.g., 'Subir 2cm pero dejar 3cm de tela', 'Usar hilo invisible')..."
                        ></textarea>
                    </section>
                </div>

                {/* Right Column: Summary & Reference */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Summary Card */}
                    <section className="bg-surface rounded-xl p-6 shadow-card border border-gray-50 sticky top-6">
                        <h3 className="font-serif text-xl text-charcoal mb-6 border-b border-gray-100 pb-4">Resumen de Orden</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-charcoal-light">
                                <span className="text-sm">Prenda</span>
                                <span className="font-medium capitalize text-charcoal">{selectedGarment}</span>
                            </div>
                            <div className="flex justify-between items-center text-charcoal-light">
                                <span className="text-sm">Tareas seleccionadas</span>
                                <span className="font-medium text-charcoal">{tasks.filter(t => t.selected).length}</span>
                            </div>
                            <div className="flex justify-between items-center text-charcoal-light">
                                <span className="text-sm flex items-center gap-2"><CalendarIcon size={14} /> Fecha de entrega</span>
                                <input type="date" className="bg-linen border border-gray-200 rounded px-2 py-1 text-xs text-charcoal font-medium focus:outline-none focus:border-terracotta" />
                            </div>
                        </div>

                        <div className="bg-linen p-4 rounded-xl flex justify-between items-center mb-6">
                            <span className="font-serif text-lg text-charcoal font-bold">Total Estimado</span>
                            <span className="font-sans text-2xl font-bold text-terracotta">${calculateTotal().toFixed(2)}</span>
                        </div>

                        <button className="w-full py-3 rounded-xl border border-terracotta text-terracotta font-bold hover:bg-terracotta hover:text-white transition-all duration-300">
                            Generar Ticket
                        </button>
                    </section>

                    {/* Photo Reference */}
                    <section className="relative overflow-hidden bg-surface rounded-xl p-8 shadow-card border border-gray-50 flex flex-col items-center justify-center text-center gap-4 group">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-2 z-10 border border-gray-100">
                            <Camera size={28} className="text-charcoal-light" />
                        </div>
                        <h3 className="font-serif text-lg text-charcoal z-10">Evidencia / Estado</h3>
                        <p className="text-charcoal-light text-sm z-10 px-4">Toma fotos de la prenda antes de iniciar para registrar el estado inicial.</p>
                        <button className="mt-2 text-terracotta font-bold text-sm bg-white px-4 py-2 rounded-lg border border-terracotta/20 hover:border-terracotta hover:shadow-md transition-all z-10">
                            Abrir Cámara
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-br from-linen to-white z-0"></div>
                    </section>

                </div>
            </div>
        </div>
    );
};
