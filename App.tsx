import React, { useState } from 'react';
import { MeasurementsView } from './views/Measurements/MeasurementsView';
import { DashboardView } from './views/Dashboard/DashboardView';
import { ClientsView } from './views/Clients/ClientsView';
import { CalendarView } from './views/Calendar/CalendarView';
import { NewProjectView } from './views/Projects/NewProjectView';
import { ViewState } from './types';
import { Nav } from "@/components/layout/Nav/Nav.tsx";
import { ClientProfileView } from "./src/views/Clients/ClientProfile/ClientProfileView";
import styles from './App.module.css';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onChangeView={setCurrentView} />;
      case 'clients':
        return <ClientsView onChangeView={setCurrentView} />;
      case 'client-profile':
        return <ClientProfileView onChangeView={setCurrentView} />;
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
      <Nav
        currentView={currentView}
        onChangeView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className={`${styles.mainContent} ${isSidebarCollapsed ? styles.mainContentCollapsed : ''}`}>
        <div className={styles.contentWrapper}>
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;