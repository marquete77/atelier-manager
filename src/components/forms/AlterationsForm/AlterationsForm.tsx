import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shirt, Scissors, Tag, Plus, Camera, Calendar as CalendarIcon } from 'lucide-react';
import { Client } from '../../../types';
import styles from './AlterationsForm.module.css';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

interface AlterationsDetailsProps {
    onDataChange: (data: { total: number; count: number; garment: string; tasks: any[]; notes: string }) => void;
}

export const AlterationsDetails: React.FC<AlterationsDetailsProps> = ({ onDataChange }) => {
    const [selectedGarment, setSelectedGarment] = useState<string>('pantalon');
    const [notes, setNotes] = useState<string>('');
    const [tasks, setTasks] = useState([
        { id: 'ruedo', label: 'Ruedo / Basta', price: 15.00, selected: false },
        { id: 'cintura', label: 'Ajuste Cintura', price: 25.00, selected: false },
        { id: 'cierre', label: 'Cambio de Cierre', price: 20.00, selected: false },
        { id: 'parches', label: 'Zurcido / Parches', price: 10.00, selected: false },
        { id: 'mangas', label: 'Acortar Mangas', price: 18.00, selected: false },
        { id: 'botones', label: 'Reponer Botones', price: 5.00, selected: false },
    ]);

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
    };

    const updatePrice = (id: string, newPrice: string) => {
        const price = parseFloat(newPrice) || 0;
        setTasks(prev => prev.map(t => t.id === id ? { ...t, price } : t));
    };

    const calculateTotal = () => {
        return tasks.filter(t => t.selected).reduce((acc, curr) => acc + curr.price, 0);
    };

    useEffect(() => {
        const total = calculateTotal();
        const count = tasks.filter(t => t.selected).length;
        onDataChange({ total, count, garment: selectedGarment, tasks, notes });
    }, [tasks, selectedGarment, notes]);

    const garmentTypes = [
        { id: 'pantalon', label: 'Pantalón', icon: Scissors },
        { id: 'vestido', label: 'Vestido', icon: Shirt },
        { id: 'camisa', label: 'Camisa/Blusa', icon: Tag },
        { id: 'chaqueta', label: 'Chaqueta', icon: Shirt },
    ];

    return (
        <motion.div
            className={styles.detailsContainer}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Garment Selection */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Tipo de Prenda</h3>
                <div className={styles.garmentGrid}>
                    {garmentTypes.map((garment) => (
                        <button
                            key={garment.id}
                            onClick={() => setSelectedGarment(garment.id)}
                            className={`${styles.garmentButton} ${selectedGarment === garment.id
                                ? styles.garmentButtonActive
                                : ''
                                }`}
                        >
                            <garment.icon size={28} className={styles.garmentIcon} strokeWidth={1.5} />
                            <span className={styles.garmentLabel}>{garment.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Tasks List */}
            <section className={styles.section}>
                <div className={styles.tasksHeader}>
                    <h3 className={styles.sectionTitle}>Tareas a realizar</h3>
                    <button className={styles.customTaskButton}>
                        <Plus size={14} /> Tarea Personalizada
                    </button>
                </div>

                <div className={styles.tasksList}>
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`${styles.taskItem} ${task.selected ? styles.taskItemActive : ''}`}
                            onClick={() => toggleTask(task.id)}
                        >
                            <div className={styles.checkboxWrapper}>
                                <input
                                    type="checkbox"
                                    checked={task.selected}
                                    onChange={() => { }} // Controlled via parent div click
                                    className={styles.checkbox}
                                />
                            </div>

                            <div className={styles.taskLabelFlex}>
                                <span className={`${styles.taskLabel} ${task.selected ? styles.taskLabelActive : ''}`}>
                                    {task.label}
                                </span>
                            </div>

                            <div className={styles.priceContainer} onClick={(e) => e.stopPropagation()}>
                                <span className={styles.currencySymbol}>$</span>
                                <input
                                    type="number"
                                    value={task.price}
                                    onChange={(e) => updatePrice(task.id, e.target.value)}
                                    disabled={!task.selected}
                                    className={`${styles.priceInput} ${task.selected ? styles.priceInputActive : ''}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Specific Notes */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Notas Específicas</h3>
                <textarea
                    className={styles.notesTextarea}
                    placeholder="Detalles sobre el arreglo (e.g., 'Subir 2cm pero dejar 3cm de tela')..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
            </section>
        </motion.div>
    );
};

interface AlterationsSummaryProps {
    selectedGarment: string;
    tasksCount: number;
    totalCost: number;
    deadline?: string;
    onDeadlineChange?: (date: string) => void;
}

export const AlterationsSummary: React.FC<AlterationsSummaryProps> = ({
    selectedGarment,
    tasksCount,
    totalCost,
    deadline,
    onDeadlineChange
}) => {
    return (
        <motion.div
            className={styles.summaryContainer}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Summary Card */}
            <div className={styles.summaryCard}>
                <h3 className={styles.summaryHeader}>Resumen de Orden</h3>

                <div className={styles.summaryDetails}>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Prenda</span>
                        <span className={styles.summaryValue}>{selectedGarment}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Tareas seleccionadas</span>
                        <span className={styles.summaryValueCount}>{tasksCount}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={`${styles.summaryLabel} ${styles.dateLabel}`}><CalendarIcon size={14} /> Fecha de entrega</span>
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={deadline || ''}
                            onChange={(e) => onDeadlineChange?.(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.totalBox}>
                    <span className={styles.totalLabel}>Total Estimado</span>
                    <span className={styles.totalAmount}>${totalCost.toFixed(2)}</span>
                </div>

                <button className={styles.generateButton}>
                    Generar Ticket
                </button>
            </div>

            {/* Photo Reference */}
            <div className={styles.referenceCard}>
                <div className={styles.referenceIconWrapper}>
                    <Camera size={28} className={styles.cameraIcon} />
                </div>
                <h3 className={styles.referenceTitle}>Evidencia / Estado</h3>
                <p className={styles.referenceText}>Toma fotos de la prenda al recibirla.</p>
                <button className={styles.openCameraButton}>
                    Abrir Cámara
                </button>
                <div className={styles.referenceBg}></div>
            </div>
        </motion.div>
    );
};

// Main Export for Backward Compatibility if needed, but we'll use modules in NewProjectView
export const AlterationsForm: React.FC = () => {
    const [data, setData] = useState({ total: 0, count: 0, garment: 'pantalon' });

    return (
        <div className={styles.mainGrid}>
            <div className={styles.leftColumn}>
                <AlterationsDetails onDataChange={(total, count, garment) => setData({ total, count, garment })} />
            </div>
            <div className={styles.rightColumn}>
                <AlterationsSummary selectedGarment={data.garment} tasksCount={data.count} totalCost={data.total} />
            </div>
        </div>
    );
};
