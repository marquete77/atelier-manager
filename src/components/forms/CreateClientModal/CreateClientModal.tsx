import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal/BaseModal';
import { ClientService } from '../../../services/client.service';
import { useAuth } from '../../../hooks/useAuth';
import styles from './CreateClientModal.module.css';

interface CreateClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        addressLink: '',
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => setFormData({ fullName: '', phone: '', email: '', address: '', addressLink: '', notes: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        setError(null);
        const { error: supaError } = await ClientService.create({
            full_name: formData.fullName,
            phone: formData.phone || null,
            email: formData.email || null,
            address: formData.address || null,
            address_link: formData.addressLink || null,
            notes: formData.notes || null,
            user_id: user.id,
        });
        setIsLoading(false);
        if (supaError) {
            setError('Error al guardar el cliente. Inténtalo de nuevo.');
            return;
        }
        resetForm();
        onSuccess?.();
        onClose();
    };

    const formatPhone = (value: string): string => {
        // Solo dígitos, máximo 11
        const digits = value.replace(/\D/g, '').slice(0, 11);
        // Aplicar máscara: XXXX-XXX-XX-XX
        let formatted = digits;
        if (digits.length > 4) formatted = digits.slice(0, 4) + '-' + digits.slice(4);
        if (digits.length > 7) formatted = formatted.slice(0, 8) + '-' + formatted.slice(8);
        if (digits.length > 9) formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
        return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setFormData(prev => ({ ...prev, phone: formatted }));
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
                                onChange={handlePhoneChange}
                                className={`${styles.input} ${styles.inputWithIcon}`}
                                placeholder="0000-000-00-00"
                                maxLength={14}
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

                {/* Campo: Dirección */}
                <div className={styles.formGroup}>
                    <label htmlFor="address" className={styles.label}>Dirección (Texto)</label>
                    <input
                        id="address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Ej. Calle de la Seda 12, apto 4B"
                    />
                </div>

                {/* Campo: Enlace de Ubicación */}
                <div className={styles.formGroup}>
                    <label htmlFor="addressLink" className={styles.label}>Enlace de Google Maps / WhatsApp</label>
                    <input
                        id="addressLink"
                        type="url"
                        name="addressLink"
                        value={formData.addressLink}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="https://maps.google.com/..."
                    />
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
                {error && (
                    <p className={styles.errorMessage}>{error}</p>
                )}
                <div className={styles.actions}>
                    <button type="button" onClick={onClose} disabled={isLoading} className={styles.btnCancel}>
                        Cancelar
                    </button>
                    <button type="submit" disabled={isLoading} className={styles.btnSubmit}>
                        {isLoading ? 'Guardando...' : 'Guardar Cliente'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};
