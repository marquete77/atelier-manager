import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, ChevronRight, MoreVertical } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { CreateClientModal } from '../components/CreateClientModal';

export const ClientsView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Gestión de Clientes</h1>
          <p className="text-charcoal-light mt-1">Administra tus contactos y proyectos.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-terracotta hover:bg-terracotta-dark text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-terracotta/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-surface p-2 rounded-xl shadow-soft border border-gray-50 mb-8 flex items-center">
        <div className="pl-4 text-charcoal-light">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o email..."
          className="w-full p-3 bg-transparent border-none focus:outline-none text-charcoal placeholder-charcoal-light/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CLIENTS.map((client) => (
          <div key={client.id} className="group bg-surface rounded-xl p-5 shadow-card hover:shadow-soft border border-gray-50 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-terracotta opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-4 pl-2">
              <div className="flex items-center gap-3">
                <img src={client.avatarUrl} alt={client.name} className="w-12 h-12 rounded-full object-cover border-2 border-linen" />
                <div>
                  <h3 className="font-bold text-lg text-charcoal">{client.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${client.status === 'VIP' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {client.status}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-terracotta">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="pl-2 space-y-3">
              <div className="flex items-center gap-2 text-sm text-charcoal-light">
                <Phone size={16} />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-charcoal-light">
                <Mail size={16} />
                <span className="truncate">{client.email}</span>
              </div>

              <div className="pt-3 mt-2 border-t border-gray-50 flex justify-end">
                <span className="text-sm font-semibold text-terracotta group-hover:underline flex items-center gap-1">
                  Ver Perfil <ChevronRight size={16} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};