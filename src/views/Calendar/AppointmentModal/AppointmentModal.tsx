import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, User, Scissors, Ruler, Package, MessageCircle, Info } from 'lucide-react';
import { APP_LABELS, THEME_COLORS, APPOINTMENT_TYPES } from "@/constants/appearance";
import styles from './AppointmentModal.module.css';

interface Appointment {
    id: string;
    clientId?: string;
    clientName: string;
    type: string;
    date: string;
    time: string;
    notes?: string;
}

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onReschedule?: (appointment: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, appointment, onReschedule }) => {
    const navigate = useNavigate();

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

    const getTypeConfig = (type: string) => {
        const t = (type || '').toLowerCase();

        let Icon = Calendar;
        if (t === APPOINTMENT_TYPES.FITTING) Icon = Scissors;
        if (t === APPOINTMENT_TYPES.MEASUREMENT) Icon = Ruler;
        if (t === APPOINTMENT_TYPES.DELIVERY) Icon = Package;
        if (t === APPOINTMENT_TYPES.CONSULTATION) Icon = MessageCircle;

        return { Icon };
    };

    const config = getTypeConfig(appointment.type);

    // Parse date safely
    const dateObj = new Date(appointment.date);
    const formattedDate = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        })
        : 'Fecha no disponible';

    // Capitalize first letter and month for premium feel
    const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).replace(/\b(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/g, (m) => m.charAt(0).toUpperCase() + m.slice(1));

    return createPortal(
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerTitleRow}>
                        <div className={styles.typeIcon}>
                            <config.Icon size={22} />
                        </div>
                        <h2 className={styles.appointmentType}>
                            {APP_LABELS.appointmentTypes[appointment.type as keyof typeof APP_LABELS.appointmentTypes] || appointment.type}
                        </h2>
                    </div>
                    <div className={styles.closeButtonContainer}>
                        <button className={styles.closeButton} onClick={onClose}>
                            <X size={16} />
                        </button>
                    </div>
                </header>

                {/* Body Content */}
                <div className={styles.body}>
                    {/* Date Section */}
                    <div className={styles.dateContainer}>
                        <p className={styles.label}>Fecha</p>
                        <h3 className={styles.dateValue}>{displayDate}</h3>
                    </div>

                    {/* Hour Card */}
                    <div className={styles.hourCard}>
                        <p className={styles.label}>Hora</p>
                        <h1 className={styles.hourValue}>{appointment.time}</h1>
                    </div>

                    {/* Details Section */}
                    <div className={styles.detailsBox}>
                        <div className={styles.detailsHeader}>
                            <Info size={18} className={styles.typeIcon} />
                            <h3 className={styles.detailsTitle}>Detalles de la cita</h3>
                        </div>
                        <p className={styles.detailsText}>
                            {appointment.notes || `No hay notas adicionales para esta ${(APP_LABELS.appointmentTypes[appointment.type as keyof typeof APP_LABELS.appointmentTypes] || appointment.type).toLowerCase()}.`}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actions}>
                        <button className={styles.viewButton} onClick={() => {
                            if (appointment.clientId) {
                                navigate(`/clients/${appointment.clientId}`);
                            }
                            onClose();
                        }}>
                            Ver Ficha
                        </button>
                        <button className={styles.rescheduleButton} onClick={() => {
                            if (onReschedule) {
                                onReschedule(appointment);
                            }
                            onClose();
                        }}>
                            Reprogramar
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
