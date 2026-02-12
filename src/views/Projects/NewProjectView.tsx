import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle, Ruler, FileText, X, Camera,
    Calendar, Users, Info, Loader2, DollarSign
} from 'lucide-react';
import styles from './NewProjectView.module.css';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const budgetVariants = {
    hidden: { opacity: 0, x: 20 },
    show: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    }
};

export const NewProjectView: React.FC = () => {
    const [projectType, setProjectType] = useState<'confection' | 'alteration'>('confection');
    const [totalCost, setTotalCost] = useState<number>(0);
    const [advance, setAdvance] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [isBalanceAnimating, setIsBalanceAnimating] = useState(false);

    const balance = totalCost - advance;

    // Trigger animation when balance changes
    useEffect(() => {
        setIsBalanceAnimating(true);
        const timer = setTimeout(() => setIsBalanceAnimating(false), 300);
        return () => clearTimeout(timer);
    }, [balance]);

    const handleCreateProject = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <motion.div
            className={styles.newProjectContainer}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <header className="view-header">
                <motion.div className="view-title-section" variants={itemVariants}>
                    <div className="view-breadcrumb">
                        <PlusCircle size={18} />
                        <span>Inicio de Trabajo</span>
                    </div>
                    <h1 className="view-title">Nuevo Proyecto</h1>
                    <div className={styles.clientInfo}>
                        <div className={styles.clientDot}></div>
                        <span>Cliente: <span className={styles.clientName}>Maria Gonzalez</span></span>
                    </div>
                </motion.div>

                <motion.div className={styles.headerActions} variants={itemVariants}>
                    <button className={styles.cancelButton}>Cancelar</button>
                    <motion.button
                        className={styles.createButton}
                        onClick={handleCreateProject}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Creando...</span>
                            </>
                        ) : (
                            <>
                                <FileText size={18} />
                                <span>Crear Proyecto</span>
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </header>

            {/* Type Selector */}
            <motion.div className={styles.typeSelector} variants={itemVariants}>
                <motion.div
                    className={`${styles.typeCard} ${projectType === 'confection' ? styles.typeCardActive : styles.typeCardInactive}`}
                    onClick={() => setProjectType('confection')}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                >
                    {projectType === 'confection' && (
                        <motion.div
                            className={styles.checkIcon}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <PlusCircle size={20} fill="currentColor" color="white" />
                        </motion.div>
                    )}
                    <div className={`${styles.iconWrapper} ${projectType !== 'confection' ? styles.iconWrapperSecondary : ''}`}>
                        <Ruler size={24} />
                    </div>
                    <h3 className={styles.typeTitle}>Confección a Medida</h3>
                    <p className={styles.typeDescription}>Creación de prendas desde cero. Incluye toma de medidas completa y pruebas.</p>
                </motion.div>

                <motion.div
                    className={`${styles.typeCard} ${projectType === 'alteration' ? styles.typeCardActive : styles.typeCardInactive}`}
                    onClick={() => setProjectType('alteration')}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                >
                    {projectType === 'alteration' && (
                        <motion.div
                            className={styles.checkIcon}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <PlusCircle size={20} fill="currentColor" color="white" />
                        </motion.div>
                    )}
                    <div className={`${styles.iconWrapper} ${projectType !== 'alteration' ? styles.iconWrapperSecondary : ''}`}>
                        <PlusCircle size={24} />
                    </div>
                    <h3 className={styles.typeTitle}>Arreglo / Compostura</h3>
                    <p className={styles.typeDescription}>Modificaciones a prendas existentes. Ajustes de talla, ruedos y reparaciones.</p>
                </motion.div>
            </motion.div>

            {/* Main Bilateral Layout */}
            <div className={styles.mainLayout}>
                {/* Left Side: Form Details */}
                <motion.div className={styles.formColumn} variants={containerVariants}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={projectType}
                            className={styles.detailsCard}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className={styles.sectionTitle}>
                                <Info size={24} className="text-terracotta" />
                                Detalles de {projectType === 'confection' ? 'Confección' : 'Arreglo'}
                            </h2>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Título del Proyecto</label>
                                <input
                                    className={styles.input}
                                    placeholder="Ej: Vestido de Gala Azul"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Fecha de Entrega Estimada</label>
                                <div className="relative">
                                    <input type="date" className={styles.input} />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Notas y Especificaciones</label>
                                <textarea
                                    className={styles.textArea}
                                    placeholder="Detalles sobre telas, cortes o requerimientos especiales..."
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Referencias Visuales</label>
                                <div className={styles.imageUpload}>
                                    <Camera size={32} />
                                    <span>Subir o tomar foto</span>
                                    <p className="text-xs opacity-60">PNG, JPG hasta 10MB</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Right Side: Budget Summary */}
                <motion.div className={styles.budgetCard} variants={budgetVariants}>
                    <h3 className={styles.budgetTitle}>Presupuesto Estimado</h3>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Costo Total</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light">$</span>
                            <input
                                type="number"
                                className={`${styles.input} pl-8`}
                                value={totalCost || ''}
                                onChange={(e) => setTotalCost(Number(e.target.value))}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Anticipo / Pagado</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light">$</span>
                            <input
                                type="number"
                                className={`${styles.input} pl-8`}
                                value={advance || ''}
                                onChange={(e) => setAdvance(Number(e.target.value))}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className={styles.budgetRow}>
                        <span>Subtotal</span>
                        <span>${totalCost.toFixed(2)}</span>
                    </div>
                    <div className={styles.budgetRow}>
                        <span>Descuento</span>
                        <span>-$0.00</span>
                    </div>

                    <div className={`${styles.budgetRow} ${styles.total}`}>
                        <span>Total del Proyecto</span>
                        <span>${totalCost.toFixed(2)}</span>
                    </div>

                    <motion.div
                        className={styles.balanceHighlight}
                        animate={isBalanceAnimating ? { scale: 1.02, backgroundColor: "rgba(178, 91, 82, 0.1)" } : { scale: 1, backgroundColor: "rgba(178, 91, 82, 0.05)" }}
                    >
                        <span className={styles.balanceLabel}>Saldo Pendiente</span>
                        <motion.div
                            className={styles.balanceValue}
                            key={balance}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="text-xl mr-1">$</span>
                            {balance.toFixed(2)}
                        </motion.div>
                    </motion.div>

                    <p className="text-center text-xs text-charcoal-light mt-4">
                        * El saldo se actualizará automáticamente al crear el proyecto.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};
