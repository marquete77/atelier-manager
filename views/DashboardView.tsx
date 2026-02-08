import React from 'react';
import { Calendar, Package, DollarSign, ChevronRight, Clock } from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_PROJECTS } from '../constants';

export const DashboardView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-charcoal">Resumen del Día</h1>
        <p className="text-charcoal-light mt-1 font-sans">Martes, 24 de Octubre</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={Calendar} 
          label="Citas Hoy" 
          value="4" 
          badge="+2 hoy" 
          badgeColor="bg-green-100 text-green-700" 
          iconColor="text-blue-600 bg-blue-50"
        />
        <StatCard 
          icon={Package} 
          label="Entregas Pendientes" 
          value="2" 
          badge="! Urgente" 
          badgeColor="bg-orange-100 text-orange-700" 
          iconColor="text-orange-600 bg-orange-50"
        />
        <StatCard 
          icon={DollarSign} 
          label="Ingresos Mes" 
          value="$1,250" 
          badge="-5% vs. mes pasado" 
          badgeColor="bg-red-100 text-red-700" 
          iconColor="text-emerald-600 bg-emerald-50"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Appointments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-charcoal">Citas de hoy</h3>
            <button className="text-terracotta text-sm font-medium hover:underline flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="bg-surface rounded-xl shadow-soft border border-gray-50 overflow-hidden">
            {MOCK_APPOINTMENTS.map((apt) => (
              <div key={apt.id} className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group flex items-start gap-4">
                <div className={`flex flex-col items-center justify-center min-w-[60px] rounded-lg py-2 px-1 ${apt.time === '12:30' ? 'bg-terracotta text-white shadow-md shadow-terracotta/20' : 'bg-linen text-charcoal-light'}`}>
                  <span className="text-xs font-bold">{apt.time}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-charcoal">{apt.clientName}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-linen text-charcoal-light border border-gray-200">{apt.type}</span>
                  </div>
                  <p className="text-sm text-charcoal-light mt-0.5">Proyecto en curso</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects/Deliveries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-charcoal">Próximas Entregas</h3>
            <button className="text-charcoal-light text-sm font-medium hover:text-terracotta transition-colors flex items-center gap-1">
              Ver calendario <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
             {MOCK_PROJECTS.map((proj) => (
               <div key={proj.id} className="bg-surface p-4 rounded-xl shadow-soft border border-gray-50 flex gap-4 items-center group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                    <img src={proj.imageUrl} alt={proj.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-bold text-charcoal truncate">{proj.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${proj.status === 'Prueba' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal-light truncate">Cliente: {proj.clientName}</p>
                    <div className="w-full bg-linen h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-terracotta h-full rounded-full" 
                        style={{width: proj.status === 'Prueba' ? '80%' : '40%'}}
                      ></div>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, badge, badgeColor, iconColor }: any) => (
  <div className="bg-surface p-6 rounded-xl shadow-soft border border-gray-50 hover:-translate-y-1 transition-transform duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon size={20} />
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${badgeColor}`}>
        {badge}
      </span>
    </div>
    <p className="text-sm font-medium text-charcoal-light">{label}</p>
    <h3 className="text-3xl font-serif font-bold text-charcoal mt-1">{value}</h3>
  </div>
);