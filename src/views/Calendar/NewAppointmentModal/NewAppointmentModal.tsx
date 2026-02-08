import React from 'react';
import { BaseModal } from '@/components/common/BaseModal/BaseModal';

interface NewAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDate?: string;
    initialTime?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose, initialDate, initialTime }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Nueva Cita"
        >
            <form className="flex flex-col gap-4 p-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                {/* Client Search Placeholder */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-charcoal-light">Cliente</label>
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="w-full bg-linen border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-terracotta"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-charcoal-light">Fecha</label>
                        <input
                            type="date"
                            defaultValue={initialDate || ''}
                            className="w-full bg-linen border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-terracotta"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-charcoal-light">Hora</label>
                        <input
                            type="time"
                            defaultValue={initialTime ? `${initialTime}:00` : ''}
                            className="w-full bg-linen border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-terracotta"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-charcoal-light">Tipo de Cita</label>
                    <select className="w-full bg-linen border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-terracotta">
                        <option>Toma de Medidas</option>
                        <option>Primera Prueba</option>
                        <option>Segunda Prueba</option>
                        <option>Entrega Final</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-charcoal-light">Notas</label>
                    <textarea
                        className="w-full bg-linen border border-gray-200 rounded-xl p-3 h-24 resize-none focus:outline-none focus:border-terracotta"
                        placeholder="Detalles adicionales..."
                    ></textarea>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 text-charcoal-light font-bold hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 bg-terracotta text-white font-bold rounded-xl hover:bg-terracotta/90 transition-colors shadow-lg shadow-terracotta/20"
                    >
                        Agendar Cita
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};
