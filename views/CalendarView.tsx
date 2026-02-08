import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';

export const CalendarView: React.FC = () => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dates = [23, 24, 25, 26, 27, 28, 29]; // Mock week
  const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9am to 5pm

  return (
    <div className="h-full flex flex-col animate-fade-in pb-20 md:pb-0">
       <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Agenda</h1>
          <p className="text-charcoal-light mt-1">Octubre 2023</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-white text-charcoal transition-colors">
             <ChevronLeft size={20} />
           </button>
           <span className="text-sm font-bold text-charcoal px-2">Semana 43</span>
           <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-white text-charcoal transition-colors">
             <ChevronRight size={20} />
           </button>
        </div>
      </div>

      <div className="flex-1 bg-surface rounded-xl shadow-soft border border-gray-50 overflow-hidden flex flex-col">
        {/* Header Grid */}
        <div className="grid grid-cols-8 border-b border-gray-100">
          <div className="p-4 border-r border-gray-50"></div>
          {days.map((day, idx) => (
            <div key={day} className={`p-4 text-center border-r border-gray-50 last:border-0 ${idx === 1 ? 'bg-terracotta/5' : ''}`}>
              <span className="block text-xs font-bold uppercase text-charcoal-light mb-1">{day}</span>
              <span className={`inline-flex w-8 h-8 items-center justify-center rounded-full text-lg font-medium ${idx === 1 ? 'bg-terracotta text-white shadow-md' : 'text-charcoal'}`}>
                {dates[idx]}
              </span>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 min-h-[80px] border-b border-gray-50 border-dashed">
              <div className="p-2 text-xs font-medium text-charcoal-light text-right pr-4 -mt-2.5">
                {hour}:00
              </div>
              {/* Columns for days */}
              {Array.from({length: 7}).map((_, dayIdx) => (
                 <div key={dayIdx} className={`border-r border-gray-50 last:border-0 relative ${dayIdx === 1 ? 'bg-terracotta/5' : ''}`}>
                    {/* Render appointment if matches logic (Mock logic) */}
                    {MOCK_APPOINTMENTS.map(apt => {
                      const aptHour = parseInt(apt.time.split(':')[0]);
                      const isToday = dayIdx === 1 && apt.date === '2023-10-24'; // Mock today logic
                      const isTomorrow = dayIdx === 2 && apt.date === '2023-10-25';
                      
                      if (aptHour === hour && (isToday || isTomorrow)) {
                         return (
                           <div key={apt.id} className="absolute inset-x-1 top-1 bottom-1 bg-terracotta text-white p-2 rounded-lg shadow-sm text-xs overflow-hidden border-l-4 border-white/30 hover:scale-[1.02] transition-transform cursor-pointer z-10">
                              <span className="font-bold block truncate">{apt.clientName}</span>
                              <span className="block opacity-90 truncate">{apt.type}</span>
                           </div>
                         )
                      }
                      return null;
                    })}
                 </div>
              ))}
            </div>
          ))}
          
          {/* Current Time Line Mock */}
          <div className="absolute top-[340px] left-[12.5%] right-0 border-t-2 border-terracotta z-20 pointer-events-none flex items-center">
             <div className="w-2 h-2 bg-terracotta rounded-full -ml-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};