import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Camera } from 'lucide-react';
import styles from '../../../views/Projects/NewProjectView.module.css';

interface ConfectionFormProps {
    onDataChange: (data: { title: string; deadline: string; description: string; images: string[] }) => void;
}

export const ConfectionForm: React.FC<ConfectionFormProps> = ({ onDataChange }) => {
    const [formData, setFormData] = useState({
        title: '',
        deadline: '',
        description: '',
        images: [] as string[]
    });

    const handleChange = (field: string, value: any) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        onDataChange(newData);
    };

    return (
        <motion.div
            className={styles.detailsCard}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className={styles.sectionTitle}>
                <Info size={24} className={styles.textTerracotta} />
                Detalles de confección
            </h2>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Título del Proyecto</label>
                <input
                    className={styles.input}
                    placeholder="Ej: Vestido de Gala Azul"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Fecha de Entrega Estimada</label>
                <div className={styles.relative}>
                    <input
                        type="date"
                        className={styles.input}
                        value={formData.deadline}
                        onChange={(e) => handleChange('deadline', e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Notas y Especificaciones</label>
                <textarea
                    className={styles.textArea}
                    placeholder="Detalles sobre telas, cortes o requerimientos especiales..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Referencias Visuales</label>
                <div className={styles.imageUpload}>
                    <Camera size={32} />
                    <span>Subir o tomar foto</span>
                    <p className={`${styles.textXs} ${styles.opacity60}`}>PNG, JPG hasta 10MB</p>
                </div>
            </div>
        </motion.div>
    );
};
