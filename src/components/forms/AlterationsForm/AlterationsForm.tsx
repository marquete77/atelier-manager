import React, { useState } from 'react';
import { Shirt, Scissors, Tag, Calendar as CalendarIcon, Camera, Plus } from 'lucide-react';
import { Client } from '../../../types';
import styles from './AlterationsForm.module.css';

export const AlterationsForm: React.FC = () => {
    const [activeClient] = useState<Partial<Client>>({ name: "Laura Castillo", id: "2" });
    const [selectedGarment, setSelectedGarment] = useState<string>('pantalon');

    // Tasks state structure
    const [tasks, setTasks] = useState([
        { id: 'ruedo', label: 'Ruedo / Basta', price: 15.00, selected: false },
        { id: 'cintura', label: 'Ajuste Cintura', price: 25.00, selected: false },
        { id: 'cierre', label: 'Cambio de Cierre', price: 20.00, selected: false },
        { id: 'parches', label: 'Zurcido / Parches', price: 10.00, selected: false },
        { id: 'mangas', label: 'Acortar Mangas', price: 18.00, selected: false },
        { id: 'botones', label: 'Reponer Botones', price: 5.00, selected: false },
    ]);

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
    };

    const updatePrice = (id: string, newPrice: string) => {
        const price = parseFloat(newPrice) || 0;
        setTasks(tasks.map(t => t.id === id ? { ...t, price } : t));
    };

    const calculateTotal = () => {
        return tasks.filter(t => t.selected).reduce((acc, curr) => acc + curr.price, 0);
    };

    const garmentTypes = [
        { id: 'pantalon', label: 'Pantalón', icon: Scissors },
        { id: 'vestido', label: 'Vestido', icon: Shirt },
        { id: 'camisa', label: 'Camisa/Blusa', icon: Tag },
        { id: 'chaqueta', label: 'Chaqueta', icon: Shirt },
    ];

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <div>
                </div>

            </header>

            <div className={styles.mainGrid}>

                {/* Left Column: Work Details */}
                <div className={styles.leftColumn}>

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
                                >
                                    <div className={styles.checkboxWrapper}>
                                        <input
                                            type="checkbox"
                                            checked={task.selected}
                                            onChange={() => toggleTask(task.id)}
                                            className={styles.checkbox}
                                        />
                                    </div>

                                    <div className={styles.taskLabelFlex}>
                                        <span className={`${styles.taskLabel} ${task.selected ? styles.taskLabelActive : ''}`}>
                                            {task.label}
                                        </span>
                                    </div>

                                    <div className={styles.priceContainer}>
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
                            placeholder="Detalles sobre el arreglo (e.g., 'Subir 2cm pero dejar 3cm de tela', 'Usar hilo invisible')..."
                        ></textarea>
                    </section>
                </div>

                {/* Right Column: Summary & Reference */}
                <div className={styles.rightColumn}>

                    {/* Summary Card */}
                    <section className={styles.summaryCard}>
                        <h3 className={styles.summaryHeader}>Resumen de Orden</h3>

                        <div className={styles.summaryDetails}>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Prenda</span>
                                <span className={styles.summaryValue}>{selectedGarment}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Tareas seleccionadas</span>
                                <span className={styles.summaryValueCount}>{tasks.filter(t => t.selected).length}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={`${styles.summaryLabel} ${styles.dateLabel}`}><CalendarIcon size={14} /> Fecha de entrega</span>
                                <input type="date" className={styles.dateInput} />
                            </div>
                        </div>

                        <div className={styles.totalBox}>
                            <span className={styles.totalLabel}>Total Estimado</span>
                            <span className={styles.totalAmount}>${calculateTotal().toFixed(2)}</span>
                        </div>

                        <button className={styles.generateButton}>
                            Generar Ticket
                        </button>
                    </section>

                    {/* Photo Reference */}
                    <section className={styles.referenceCard}>
                        <div className={styles.referenceIconWrapper}>
                            <Camera size={28} className={styles.cameraIcon} />
                        </div>
                        <h3 className={styles.referenceTitle}>Evidencia / Estado</h3>
                        <p className={styles.referenceText}>Toma fotos de la prenda antes de iniciar para registrar el estado inicial.</p>
                        <button className={styles.openCameraButton}>
                            Abrir Cámara
                        </button>
                        <div className={styles.referenceBg}></div>
                    </section>

                </div>
            </div>
        </div>
    );
};
