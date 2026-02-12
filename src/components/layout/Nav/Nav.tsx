import React, { useState } from 'react';
import { LayoutDashboard, Users, Ruler, Calendar, Settings, LogOut, PenTool, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ViewState } from '@/types';
import styles from './Nav.module.css';

interface NavProps {
    currentView: ViewState;
    onChangeView: (view: ViewState) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const Nav: React.FC<NavProps> = ({ currentView, onChangeView, isCollapsed, onToggleCollapse }) => {
    const { user, signOut } = useAuth();

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

    const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';
    const userDisplayRole = user?.user_metadata?.role || 'Propietaria';

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

                <div className={styles.separationContainer}>
                    <button
                        onClick={() => onChangeView('settings')}
                        className={`${styles.navButton} ${currentView === 'settings' ? styles.navButtonActive : ''}`}
                        title={isCollapsed ? "Configuración" : ''}
                    >
                        <Settings size={20} strokeWidth={currentView === 'settings' ? 2.5 : 2} />
                        <span className={styles.navLabel}>Configuración</span>
                    </button>
                </div>

                <div className={styles.userSection}>
                    <div className={styles.userDivider}>
                        <div className={styles.avatarPlaceholderGlobal}>
                            {userDisplayName.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>{userDisplayName}</p>
                            <p className={styles.userRole}>{userDisplayRole}</p>
                        </div>
                        <button
                            className={styles.logoutButton}
                            onClick={() => signOut()}
                            title="Cerrar sesión"
                        >
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
                <button
                    onClick={() => onChangeView('settings')}
                    className={`${styles.mobileNavItem} ${currentView === 'settings' ? styles.mobileNavItemActive : ''}`}
                >
                    <Settings
                        size={24}
                        className={currentView === 'settings' ? styles.mobileNavIconActive : styles.mobileNavIcon}
                    />
                    <span className={styles.mobileNavLabel}>Configuración</span>
                </button>
            </nav>
        </>
    );
};
