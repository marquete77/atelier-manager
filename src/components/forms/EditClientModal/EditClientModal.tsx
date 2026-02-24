import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal/BaseModal';
import { ClientService } from '../../../services/client.service';
import styles from '../CreateClientModal/CreateClientModal.module.css';

interface EditClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    client: {
        id: string;
        name: string;
        phone: string;
        email: string;
        address: string;
        addressLink: string;
        notes: string;
    };
}

export const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, onSuccess, client }) => {
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

    // Precargar datos cuando se abre el modal o cambia el cliente
    useEffect(() => {
        if (isOpen && client) {
            setFormData({
                fullName: client.name || '',
                phone: client.phone || '',
                email: client.email || '',
                address: client.address || '',
                addressLink: client.addressLink || '',
                notes: client.notes || ''
            });
        }
    }, [isOpen, client]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error: supaError } = await ClientService.update(client.id, {
            full_name: formData.fullName,
            phone: formData.phone || null,
            email: formData.email || null,
            address: formData.address || null,
            address_link: formData.addressLink || null,
            notes: formData.notes || null
        });

        setIsLoading(false);

        if (supaError) {
            setError('Error al actualizar el cliente. Inténtalo de nuevo.');
            return;
        }

        onSuccess?.();
        onClose();
    };

    const formatPhone = (value: string): string => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
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
        <BaseModal isOpen={isOpen} onClose={onClose} title="Editar Cliente">
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                {/* Campo: Nombre Completo */}
                <div className={styles.formGroup}>
                    <label htmlFor="editFullName" className={styles.label}>Nombre Completo</label>
                    <input
                        id="editFullName"
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
                    <div className={styles.formGroup}>
                        <label htmlFor="editPhone" className={styles.label}>Teléfono</label>
                        <div className={styles.inputWrapper}>
                            <div className={styles.inputIcon}>
                                <Phone size={20} />
                            </div>
                            <input
                                id="editPhone"
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

                    <div className={styles.formGroup}>
                        <label htmlFor="editEmail" className={styles.label}>Email</label>
                        <div className={styles.inputWrapper}>
                            <div className={styles.inputIcon}>
                                <Mail size={20} />
                            </div>
                            <input
                                id="editEmail"
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
                    <label htmlFor="editAddress" className={styles.label}>Dirección (Texto)</label>
                    <div className={styles.inputWrapper}>
                        <div className={styles.inputIcon}>
                            <MapPin size={20} />
                        </div>
                        <input
                            id="editAddress"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`${styles.input} ${styles.inputWithIcon}`}
                            placeholder="Ej. Calle de la Seda 12, apto 4B"
                        />
                    </div>
                </div>

                {/* Campo: Enlace de Ubicación */}
                <div className={styles.formGroup}>
                    <label htmlFor="editAddressLink" className={styles.label}>Enlace de Ubicación (Google Maps)</label>
                    <div className={styles.inputWrapper}>
                        <div className={styles.inputIcon}>
                            <Globe size={20} />
                        </div>
                        <input
                            id="editAddressLink"
                            type="url"
                            name="addressLink"
                            value={formData.addressLink}
                            onChange={handleChange}
                            className={`${styles.input} ${styles.inputWithIcon}`}
                            placeholder="https://maps.google.com/..."
                        />
                    </div>
                </div>

                {/* Campo: Notas */}
                <div className={styles.formGroup}>
                    <label htmlFor="editNotes" className={styles.label}>Notas Generales</label>
                    <textarea
                        id="editNotes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className={styles.textarea}
                        placeholder="Detalles importantes sobre el cliente..."
                        rows={3}
                    />
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <div className={styles.actions}>
                    <button type="button" onClick={onClose} disabled={isLoading} className={styles.btnCancel}>
                        Cancelar
                    </button>
                    <button type="submit" disabled={isLoading} className={styles.btnSubmit}>
                        {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};
