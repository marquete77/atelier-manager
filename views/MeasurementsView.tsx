import React, { useState } from 'react';
import { Save, User, FileText, Camera, ChevronLeft, Check, AlertCircle, Scissors } from 'lucide-react';
import { InputMeasure } from '../components/InputMeasure';
import { Client } from '../types';

export const MeasurementsView: React.FC = () => {
  const [activeClient] = useState<Partial<Client>>({ name: "Maria Gonzalez", id: "1" });
  
  // State for form fields
  const [measures, setMeasures] = useState({
    busto: '',
    espalda: '',
    talleDelantero: '',
    talleEspalda: '',
    alturaBusto: '',
    cintura: '',
    cadera: '',
    largoTiro: '',
    largoTotal: '',
    largoManga: '',
    anchoBrazo: '',
    puno: '',
    sisa: ''
  });

  const handleChange = (key: string, val: string) => {
    setMeasures(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-24 md:pb-8">
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-terracotta text-sm font-bold uppercase tracking-wider mb-2">
            <RulerIcon /> 
            <span>Nueva Ficha</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-2">Ficha de Medidas</h1>
          <div className="flex items-center gap-2 text-charcoal-light">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Cliente: <strong className="text-charcoal">{activeClient.name}</strong></span>
            <span className="text-gray-300">|</span>
            <span>Proyecto: Vestido de Gala</span>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-gray-200 text-charcoal font-bold hover:bg-white transition-colors">
            Cancelar
          </button>
          <button className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-terracotta text-white font-bold shadow-lg shadow-terracotta/25 hover:bg-terracotta-dark transition-all flex items-center justify-center gap-2">
            <Save size={18} />
            Guardar Medidas
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Blocks */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upper Body Section */}
          <section className="bg-surface rounded-xl p-6 md:p-8 shadow-card border border-gray-50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta">
                <User size={20} />
              </div>
              <h3 className="font-serif text-2xl text-charcoal">Parte Superior</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputMeasure label="Contorno de Busto" value={measures.busto} onChange={(v) => handleChange('busto', v)} />
              <InputMeasure label="Ancho de Espalda" value={measures.espalda} onChange={(v) => handleChange('espalda', v)} />
              <InputMeasure label="Talle Delantero" value={measures.talleDelantero} onChange={(v) => handleChange('talleDelantero', v)} />
              <InputMeasure label="Talle Espalda" value={measures.talleEspalda} onChange={(v) => handleChange('talleEspalda', v)} />
              <div className="md:col-span-2">
                 <InputMeasure label="Altura de Busto" value={measures.alturaBusto} onChange={(v) => handleChange('alturaBusto', v)} />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lower Body Section */}
            <section className="bg-surface rounded-xl p-6 md:p-8 shadow-card border border-gray-50 h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta">
                  <User size={20} className="transform rotate-180" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal">Parte Inferior</h3>
              </div>
              <div className="space-y-5">
                <InputMeasure label="Contorno de Cintura" value={measures.cintura} onChange={(v) => handleChange('cintura', v)} />
                <InputMeasure label="Contorno de Cadera" value={measures.cadera} onChange={(v) => handleChange('cadera', v)} />
                <InputMeasure label="Largo de Tiro" value={measures.largoTiro} onChange={(v) => handleChange('largoTiro', v)} />
                <InputMeasure label="Largo Total" value={measures.largoTotal} onChange={(v) => handleChange('largoTotal', v)} />
              </div>
            </section>

            {/* Sleeves Section */}
            <section className="bg-surface rounded-xl p-6 md:p-8 shadow-card border border-gray-50 h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta">
                  <Scissors size={20} />
                </div>
                <h3 className="font-serif text-2xl text-charcoal">Mangas</h3>
              </div>
              <div className="space-y-5">
                <InputMeasure label="Largo de Manga" value={measures.largoManga} onChange={(v) => handleChange('largoManga', v)} />
                <InputMeasure label="Ancho de Brazo" value={measures.anchoBrazo} onChange={(v) => handleChange('anchoBrazo', v)} />
                <InputMeasure label="Contorno de Puño" value={measures.puno} onChange={(v) => handleChange('puno', v)} />
                <InputMeasure label="Sisa" value={measures.sisa} onChange={(v) => handleChange('sisa', v)} />
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: Sidebar info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Notes Card */}
          <section className="bg-surface rounded-xl p-6 md:p-8 shadow-card border border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta">
                <FileText size={16} />
              </div>
              <h3 className="font-serif text-xl text-charcoal">Notas Técnicas</h3>
            </div>
            <textarea 
              className="w-full h-40 bg-linen border border-gray-200 rounded-xl p-4 text-sm text-charcoal resize-none focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
              placeholder="Notas sobre postura, tipo de tela, preferencias del cliente..."
            ></textarea>
          </section>

          {/* Reference Image Placeholder */}
          <section className="relative overflow-hidden bg-surface rounded-xl p-8 shadow-card border border-gray-50 flex flex-col items-center justify-center text-center gap-4 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-2 z-10">
              <Camera size={32} className="text-terracotta" />
            </div>
            <h3 className="font-serif text-lg text-charcoal z-10">Referencia Visual</h3>
            <p className="text-charcoal-light text-sm z-10">Sube fotos del cliente o bocetos para referencia.</p>
            <button className="mt-2 flex items-center gap-2 text-terracotta font-bold text-sm bg-white px-4 py-2 rounded-lg border border-terracotta/20 hover:border-terracotta hover:shadow-md transition-all z-10">
              Adjuntar Imagen
            </button>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1f16413c80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] opacity-5 bg-cover bg-center pointer-events-none"></div>
          </section>

          {/* Status Card */}
          <section className="bg-surface rounded-xl p-6 shadow-card border border-gray-50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-light mb-4">Estado de la ficha</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-900">Creación</span>
                </div>
                <span className="text-xs text-green-700 font-mono">10:42 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg opacity-50">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-charcoal-light"></div>
                  <span className="text-sm font-medium text-charcoal-light">Revisión</span>
                </div>
              </div>
               <div className="flex items-center justify-between p-3 rounded-lg opacity-50">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-charcoal-light"></div>
                  <span className="text-sm font-medium text-charcoal-light">Aprobado</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

const RulerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
);