import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {Nav} from "../../components/layout/Nav/Nav.tsx";
import { ViewState } from '@/types';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Derivar la vista actual directamente de la URL
    const getCurrentView = (): ViewState => {
        const path = location.pathname.split('/')[1];
        if (!path) return 'dashboard';
        // Asumimos que el path coincide con el ViewState, si no, por defecto dashboard
        return (path as ViewState) || 'dashboard';
    };

    const handleViewChange = (view: ViewState) => {
        navigate(view === 'dashboard' ? '/' : `/${view}`);
    };

    return (
        <div className={styles.layoutContainer}>
            <Nav
                currentView={getCurrentView()}
                onChangeView={handleViewChange}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main className={`${styles.mainContent} ${isSidebarCollapsed ? styles.mainContentCollapsed : ''}`}>
                <div className={styles.contentWrapper}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
