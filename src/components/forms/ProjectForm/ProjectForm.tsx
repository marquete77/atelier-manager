import React, { useState } from 'react';
import { Upload, X, Landmark, Scissors } from 'lucide-react';
import styles from './ProjectForm.module.css';

interface ProjectFormProps {
    projectType: 'confection' | 'alteration';
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ projectType }) => {
    const [totalCost, setTotalCost] = useState<number>(0);
    const [deposit, setDeposit] = useState<number>(0);

    const balanceLine = totalCost - deposit;

    return (
        <div className={styles.mainForm}>
            <div className={styles.formContent}>
                <h3 className={styles.formSectionTitle}>
                    {projectType === 'confection' ? 'Detalles de Confección' : 'Detalles de Arreglo'}
                </h3>

                <div className={styles.formGrid}>
                    <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Cliente</label>
                        <div className={styles.inputWrapper}>
                            <select className={styles.select}>
                                <option value="">Seleccionar cliente existente...</option>
                                <option value="1">Maria Gonzalez</option>
                                <option value="2">Ana Martinez</option>
                            </select>
                            <button className={styles.newClientBadge}>Nuevo</button>
                        </div>
                    </div>

                    <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Título del Proyecto</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={projectType === 'confection' ? "Ej: Vestido de Gala Rojo" : "Ej: Ajuste de talle pantalón"}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Fecha de Inicio</label>
                        <input type="date" className={styles.input} />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Fecha de Entrega</label>
                        <input type="date" className={styles.input} />
                    </div>
                </div>

                <div className={styles.uploadSection}>
                    <h3 className={styles.formSectionTitle}>Carga de Imágenes</h3>
                    <div className={styles.dropzone}>
                        <Upload size={40} strokeWidth={1.5} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 500, margin: 0 }}>Arrastra tus imágenes aquí</p>
                            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.7 }}>o haz clic para explorar archivos (JPG, PNG)</p>
                        </div>
                    </div>

                    <div className={styles.imagePreviewList}>
                        <div className={styles.imagePreview}>
                            <img src="https://picsum.photos/200/200?random=1" alt="Ref 1" />
                            <button className={styles.removeImage}><X size={12} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <aside className={styles.sidebar}>
                <div className={styles.budgetCard}>
                    <h3 className={styles.budgetHeader}>
                        <Landmark size={20} className={styles.budgetIcon} />
                        Presupuesto Estimado
                    </h3>

                    <div className={styles.budgetFields}>
                        <div className={styles.fieldGroup}>
                            <span className={styles.budgetLabel}>Costo Total</span>
                            <div className={styles.currencyInput}>
                                <span className={styles.currencySymbol}>$</span>
                                <input
                                    type="number"
                                    className={styles.budgetInput}
                                    value={totalCost}
                                    onChange={(e) => setTotalCost(Number(e.target.value))}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <span className={styles.budgetLabel}>Anticipo</span>
                            <div className={styles.currencyInput}>
                                <span className={styles.currencySymbol}>$</span>
                                <input
                                    type="number"
                                    className={styles.budgetInput}
                                    style={{ fontWeight: 500 }}
                                    value={deposit}
                                    onChange={(e) => setDeposit(Number(e.target.value))}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className={styles.balanceRow}>
                            <span className={styles.balanceLabel}>Saldo Pendiente</span>
                            <span className={styles.balanceValue}>$ {balanceLine.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Notas Rápidas</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Detalles importantes a recordar..."
                        rows={4}
                    ></textarea>
                </div>

            </aside>
        </div>
    );
};
