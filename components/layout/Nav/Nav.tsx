import React, { useState } from 'react';
import { LayoutDashboard, Users, Ruler, Calendar, Settings, LogOut, PenTool, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewState } from '../../../types';
import styles from './Nav.module.css';

interface NavProps {
    currentView: ViewState;
    onChangeView: (view: ViewState) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const Nav: React.FC<NavProps> = ({ currentView, onChangeView, isCollapsed, onToggleCollapse }) => {

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'clients', label: 'Clientes', icon: Users },
        { id: 'measurements', label: 'Medidas', icon: Ruler },
        { id: 'projects', label: 'Proyectos', icon: FileText },
        { id: 'calendar', label: 'Agenda', icon: Calendar },
    ];

    const toggleSidebar = () => {
        onToggleCollapse();
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
                <button
                    className={styles.toggleButton}
                    onClick={toggleSidebar}
                    aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <div className={styles.logoSection}>
                    <div className={styles.logoIcon}>
                        <PenTool size={20} />
                    </div>
                    <h1 className={styles.logoText}>Atelier<span className={styles.logoSuffix}>Manager</span></h1>
                </div>

                <nav className={styles.navContainer}>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id as ViewState)}
                            className={`${styles.navButton} ${currentView === item.id ? styles.navButtonActive : ''}`}
                            title={isCollapsed ? item.label : ''}
                        >
                            <item.icon size={20} strokeWidth={currentView === item.id ? 2.5 : 2} />
                            <span className={styles.navLabel}>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className={styles.userSection}>
                    <button className={styles.navButton} title={isCollapsed ? 'Configuración' : ''}>
                        <Settings size={20} />
                        <span className={styles.navLabel}>Configuración</span>
                    </button>
                    <div className={styles.userDivider}>
                        <img src="https://picsum.photos/40/40" alt="User" className={styles.userAvatar} />
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>Elena Sastre</p>
                            <p className={styles.userRole}>Propietaria</p>
                        </div>
                        <button className={styles.logoutButton} title="Cerrar sesión">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className={styles.mobileNav}>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onChangeView(item.id as ViewState)}
                        className={`${styles.mobileNavItem} ${currentView === item.id ? styles.mobileNavItemActive : ''}`}
                    >
                        <item.icon
                            size={24}
                            className={currentView === item.id ? styles.mobileNavIconActive : styles.mobileNavIcon}
                        />
                        <span className={styles.mobileNavLabel}>{item.label}</span>
                    </button>
                ))}
            </nav>
        </>
    );
};
