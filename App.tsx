import React, { useState } from 'react';
import { Nav } from './components/Nav';
import { MeasurementsView } from './views/MeasurementsView';
import { DashboardView } from './views/DashboardView';
import { ClientsView } from './views/ClientsView';
import { CalendarView } from './views/CalendarView';
import { AlterationsView } from './views/AlterationsView';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'clients':
        return <ClientsView />;
      case 'calendar':
        return <CalendarView />;
      case 'alterations':
        return <AlterationsView />;
      case 'measurements':
      default:
        return <MeasurementsView />;
    }
  };

  return (
    <div className="min-h-screen bg-linen font-sans selection:bg-terracotta/30">
      <Nav currentView={currentView} onChangeView={setCurrentView} />

      <main className="md:pl-64 min-h-screen transition-all duration-300">
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Global CSS animation classes injected here for simplicity in single-file format */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;