import React, { useState } from 'react';
import {
    Settings,
    Store,
    Tag,
    User,
    Save,
    Plus,
    Edit,
    Trash2,
    Upload,
    Clock,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SettingsView.module.css';

type TabId = 'general' | 'taller' | 'servicios' | 'perfil';

export const SettingsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulación de guardado
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }, 800);
    };

    const sectionVariants = {
        initial: { opacity: 0, x: 10 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -10 },
    };

    const containerVariants = {
        animate: {
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <motion.section
                        key="general"
                        variants={sectionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className={styles.sectionCard}
                    >
                        <h2 className={styles.sectionTitle}>
                            <Settings className={styles.sectionIcon} size={24} />
                            Apariencia General
                        </h2>
                        <div className={styles.themeGrid}>
                            <motion.label
                                className={styles.themeOption}
                                whileTap={{ scale: 0.98 }}
                            >
                                <input
                                    type="radio"
                                    name="theme"
                                    value="light"
                                    className={styles.themeInput}
                                    checked={theme === 'light'}
                                    onChange={() => setTheme('light')}
                                />
                                <div className={styles.themeCard}>
                                    <div className={`${styles.themePreview} ${styles.previewLight}`}>Aa</div>
                                    <div className={styles.themeLabel}>
                                        <span>Modo Claro</span>
                                        <div className={styles.radioCircle}>
                                            <AnimatePresence>
                                                {theme === 'light' && (
                                                    <motion.div
                                                        className={styles.radioInner}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.label>
                            <motion.label
                                className={styles.themeOption}
                                whileTap={{ scale: 0.98 }}
                            >
                                <input
                                    type="radio"
                                    name="theme"
                                    value="dark"
                                    className={styles.themeInput}
                                    checked={theme === 'dark'}
                                    onChange={() => setTheme('dark')}
                                />
                                <div className={styles.themeCard}>
                                    <div className={`${styles.themePreview} ${styles.previewDark}`}>Aa</div>
                                    <div className={styles.themeLabel}>
                                        <span>Modo Oscuro</span>
                                        <div className={styles.radioCircle}>
                                            <AnimatePresence>
                                                {theme === 'dark' && (
                                                    <motion.div
                                                        className={styles.radioInner}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.label>
                        </div>
                    </motion.section>
                );
            case 'taller':
                return (
                    <motion.section
                        key="taller"
                        variants={sectionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className={styles.sectionCard}
                    >
                        <h2 className={styles.sectionTitle}>
                            <Store className={styles.sectionIcon} size={24} />
                            Horarios de Atención
                        </h2>
                        <motion.div
                            className={styles.scheduleList}
                            variants={containerVariants}
                            initial="initial"
                            animate="animate"
                        >
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                                <motion.div
                                    key={day}
                                    className={styles.scheduleItem}
                                    variants={itemVariants}
                                >
                                    <div className={styles.dayInfo}>
                                        <label className={styles.toggleSwitch}>
                                            <input type="checkbox" className={styles.toggleInput} defaultChecked={day !== 'Domingo'} />
                                            <motion.span
                                                className={styles.toggleSlider}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <motion.div
                                                    className={styles.toggleHandle}
                                                    layout
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            </motion.span>
                                        </label>
                                        <span className={styles.dayName}>{day}</span>
                                    </div>
                                    <div className={styles.timeInputs}>
                                        <input type="time" className={styles.timeInput} defaultValue="09:00" />
                                        <span className={styles.timeSeparator}>-</span>
                                        <input type="time" className={styles.timeInput} defaultValue="18:00" />
                                        <Clock size={16} className={styles.timeSeparator} />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.section>
                );
            case 'servicios':
                return (
                    <motion.section
                        key="servicios"
                        variants={sectionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className={styles.sectionCard}
                    >
                        <div className={styles.servicesHeader}>
                            <h2 className={styles.sectionTitle}>
                                <Tag className={styles.sectionIcon} size={24} />
                                Catálogo de Servicios
                            </h2>
                            <button className={styles.addButton}>
                                <Plus size={18} /> Agregar
                            </button>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Servicio</th>
                                        <th>Categoría</th>
                                        <th style={{ textAlign: 'right' }}>Precio Base</th>
                                        <th style={{ textAlign: 'right' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="popLayout">
                                        {[
                                            { name: 'Basta Simple', cat: 'Ajustes', price: '$8.00' },
                                            { name: 'Ajuste de Cintura', cat: 'Pantalones', price: '$15.00' },
                                            { name: 'Cambio de Cierre', cat: 'Reparaciones', price: '$12.00' },
                                            { name: 'Confección Camisa', cat: 'A Medida', price: '$65.00' },
                                        ].map((s, i) => (
                                            <motion.tr
                                                key={s.name}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <td className={styles.serviceName}>{s.name}</td>
                                                <td>{s.cat}</td>
                                                <td className={styles.priceBase}>{s.price}</td>
                                                <td className={styles.actionsCell}>
                                                    <div className={styles.actionButtons}>
                                                        <motion.button
                                                            className={styles.iconActionButton}
                                                            title="Editar"
                                                            whileHover={{ scale: 1.2, color: 'var(--color-terracotta)' }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Edit size={16} />
                                                        </motion.button>
                                                        <motion.button
                                                            className={`${styles.iconActionButton} ${styles.deleteButton}`}
                                                            title="Eliminar"
                                                            whileHover={{ scale: 1.2, color: '#ef4444' }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </motion.section>
                );
            case 'perfil':
                return (
                    <motion.section
                        key="perfil"
                        variants={sectionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className={styles.sectionCard}
                    >
                        <h2 className={styles.sectionTitle}>
                            <User className={styles.sectionIcon} size={24} />
                            Perfil del Atelier
                        </h2>
                        {/* ... Resto del perfil ... */}
                        <div className={styles.profileLayout}>
                            <motion.div
                                className={styles.logoUpload}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className={styles.logoCircle}>
                                    <Upload size={32} />
                                    <span className={styles.logoLabel}>Logo</span>
                                </div>
                                <span className={styles.logoHint}>Recomendado: 500x500px PNG o JPG</span>
                            </motion.div>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Nombre del Negocio</label>
                                    <input type="text" className={styles.input} defaultValue="Sastrería Elegance" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Propietario</label>
                                    <input type="text" className={styles.input} defaultValue="Elena Sastre" />
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Descripción Corta</label>
                                    <textarea className={styles.textarea} rows={3} defaultValue="Especialistas en arreglos de alta costura y confección a medida desde 2010."></textarea>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Teléfono</label>
                                    <input type="tel" className={styles.input} defaultValue="+34 600 123 456" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Correo de Contacto</label>
                                    <input type="email" className={styles.input} defaultValue="contacto@sastrerianew.com" />
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Dirección Física</label>
                                    <input type="text" className={styles.input} defaultValue="Av. de la Libertad 45, Local 2" />
                                </div>
                            </div>
                        </div>
                    </motion.section>
                );
        }
    };

    return (
        <div className={styles.container}>
            <header className="view-header">
                <div className="view-title-section">
                    <div className="view-breadcrumb">
                        <Settings size={18} />
                        <span>Configuración</span>
                    </div>
                    <h1 className="view-title">Configuración del Atelier</h1>
                    <p className="view-subtitle">Personaliza cada detalle de tu negocio artesanal.</p>
                </div>
                <motion.button
                    className={`${styles.saveButton} ${showSuccess ? styles.saveButtonSuccess : ''}`}
                    onClick={handleSave}
                    disabled={isSaving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <AnimatePresence mode="wait">
                        {showSuccess ? (
                            <motion.div
                                key="check"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Check size={18} /> Guardado
                            </motion.div>
                        ) : (
                            <motion.div
                                key="save"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {isSaving ? (
                                    <div className={styles.loaderSmall} />
                                ) : (
                                    <Save size={18} />
                                )}
                                Guardar Cambios
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </header>

            <div className={styles.grid}>
                <aside className={styles.sidebarNav}>
                    {[
                        { id: 'general', label: 'General', icon: Settings },
                        { id: 'taller', label: 'Taller', icon: Store },
                        { id: 'servicios', label: 'Servicios', icon: Tag },
                        { id: 'perfil', label: 'Perfil', icon: User },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
                            onClick={() => setActiveTab(tab.id as TabId)}
                            style={{ position: 'relative' }}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabBackground"
                                    className={styles.activeTabBackground}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <tab.icon size={20} style={{ position: 'relative', zIndex: 1 }} />
                            <span style={{ position: 'relative', zIndex: 1 }}>{tab.label}</span>
                        </button>
                    ))}
                </aside>

                <main className={styles.sectionsContainer}>
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};
