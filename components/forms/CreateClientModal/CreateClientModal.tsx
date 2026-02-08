import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal/BaseModal';
import styles from './CreateClientModal.module.css';

interface CreateClientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating client:', formData);
        onClose();
        setFormData({ fullName: '', phone: '', email: '', notes: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Nuevo Cliente">
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                {/* Campo: Nombre Completo */}
                <div className={styles.formGroup}>
                    <label htmlFor="fullName" className={styles.label}>Nombre Completo</label>
                    <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Ej. Valentina Morales"
                    />
                </div>

                {/* Grid para Teléfono y Email */}
                <div className={styles.gridCols2}>
                    {/* Campo: Teléfono */}
                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>Teléfono</label>
                        <div className={styles.inputWrapper}>
                            <div className={styles.inputIcon}>
                                <Phone size={20} />
                            </div>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.inputWithIcon}`}
                                placeholder="+34 000 000 000"
                            />
                        </div>
                    </div>

                    {/* Campo: Email */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <div className={styles.inputWrapper}>
                            <div className={styles.inputIcon}>
                                <Mail size={20} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.inputWithIcon}`}
                                placeholder="cliente@ejemplo.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Campo: Notas */}
                <div className={styles.formGroup}>
                    <label htmlFor="notes" className={styles.label}>Notas Iniciales</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className={styles.textarea}
                        placeholder="Preferencias de estilo, medidas preliminares o detalles del proyecto..."
                        rows={4}
                    />
                </div>

                {/* Botones de Acción */}
                <div className={styles.actions}>
                    <button type="button" onClick={onClose} className={styles.btnCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className={styles.btnSubmit}>
                        Guardar Cliente
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};
