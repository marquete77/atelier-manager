import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, User } from 'lucide-react';
import styles from './AppointmentModal.module.css';

interface Appointment {
    id: string;
    clientName: string;
    type: string;
    date: string;
    time: string;
}

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, appointment }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !appointment) return null;

    // TODO: Format date properly based on locale
    const formattedDate = new Date(appointment.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'short'
    });

    // Capitalize first letter logic for date
    const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return createPortal(
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                    <h2 className={styles.clientName}>{appointment.clientName}</h2>
                    <p className={styles.appointmentType}>{appointment.type}</p>
                </header>

                <div className={styles.content}>
                    <div className={styles.infoRow}>
                        <div className={styles.iconWrapper}>
                            <Calendar size={18} />
                        </div>
                        <div className={styles.infoDetails}>
                            <div className={styles.infoLabel}>{displayDate}</div>
                            <div className={styles.infoSubtext}>{appointment.time} - 10:30 AM</div>
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <div className={styles.iconWrapper}>
                            <User size={18} />
                        </div>
                        <div className={styles.infoDetails}>
                            <div className={styles.infoLabel}>Vestido de Noche</div>
                            <div className={styles.infoSubtext}>
                                <span className={styles.statusDot}></span>
                                En Costura
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.viewButton}>Ver Ficha</button>
                        <button className={styles.rescheduleButton}>Reprogramar</button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
