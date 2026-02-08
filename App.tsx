import React, { useState } from 'react';
import { MeasurementsView } from './views/Measurements/MeasurementsView';
import { DashboardView } from './views/Dashboard/DashboardView';
import { ClientsView } from './views/Clients/ClientsView';
import { CalendarView } from './views/Calendar/CalendarView';
import { NewProjectView } from './views/Projects/NewProjectView';
import { ViewState } from './types';
import { Nav } from "@/components/layout/Nav/Nav.tsx";
import styles from './App.module.css';

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
      case 'new-project':
      case 'projects':
        return <NewProjectView />;
      case 'measurements':
      default:
        return <MeasurementsView />;
    }
  };

  return (
    <div className={styles.appContainer}>
      <Nav currentView={currentView} onChangeView={setCurrentView} />

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;