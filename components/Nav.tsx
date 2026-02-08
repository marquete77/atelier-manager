import React from 'react';
import { LayoutDashboard, Users, Ruler, Calendar, Scissors, Settings, LogOut, PenTool, FileText } from 'lucide-react';
import { ViewState } from '../types';

interface NavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Nav: React.FC<NavProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'measurements', label: 'Medidas', icon: Ruler },
    { id: 'projects', label: 'Proyectos', icon: FileText },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface border-r border-gray-100 shadow-soft z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-terracotta/10 rounded-lg flex items-center justify-center text-terracotta">
            <PenTool size={20} />
          </div>
          <h1 className="font-serif font-bold text-xl text-charcoal">Atelier<span className="font-sans font-light text-terracotta">Manager</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium ${currentView === item.id
                ? 'bg-terracotta text-white shadow-md shadow-terracotta/20'
                : 'text-charcoal-light hover:bg-linen hover:text-charcoal'
                }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'stroke-[2.5px]' : 'stroke-2'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-charcoal-light hover:bg-linen hover:text-charcoal transition-all text-sm font-medium">
            <Settings size={20} />
            Configuración
          </button>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 px-2">
            <img src="https://picsum.photos/40/40" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-charcoal truncate">Elena Sastre</p>
              <p className="text-xs text-charcoal-light truncate">Propietaria</p>
            </div>
            <LogOut size={16} className="text-charcoal-light cursor-pointer hover:text-terracotta" />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as ViewState)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${currentView === item.id ? 'text-terracotta' : 'text-charcoal-light'
              }`}
          >
            <item.icon size={24} className={currentView === item.id ? 'fill-terracotta/10 stroke-2' : 'stroke-1.5'} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};