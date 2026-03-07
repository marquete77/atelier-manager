import React from 'react';
import { motion } from 'framer-motion';
import { THEME_COLORS, APP_LABELS, APPOINTMENT_TYPES } from "@/constants/appearance";
import { formatTime, getAmPm, getUrgencyLabel } from '@/utils/date';
import { itemVariants } from '@/constants/animations';
import { Badge } from '@/components/common/Badge/Badge';
import styles from './AppointmentItem.module.css';

interface AppointmentEntry {
    id: string;
    start_time: string;
    type: string;
    status: string;
    clients: {
        full_name: string;
    };
}

interface AppointmentItemProps {
    apt: AppointmentEntry;
}

export const AppointmentItem: React.FC<AppointmentItemProps> = ({ apt }) => {
    const colors = (THEME_COLORS.appointments as any)[apt.type] || THEME_COLORS.appointments.default;
    const urgency = getUrgencyLabel(apt.start_time);

    return (
        <motion.div
            className={styles.appointmentItem}
            variants={itemVariants}
            whileHover={{ x: 4, backgroundColor: "#F8FAFC" }}
        >
            <div className={styles.timeBox} style={{ backgroundColor: colors.light }}>
                <span className={styles.timeText} style={{ color: colors.main }}>
                    {formatTime(apt.start_time)}
                </span>
                <span style={{ fontSize: '0.6rem', color: colors.main, opacity: 0.8, fontWeight: 700 }}>
                    {getAmPm(apt.start_time)}
                </span>
            </div>
            <div className={styles.appointmentDetails}>
                <div className={styles.appointmentHeader}>
                    <h4 className={styles.clientName}>{apt.clients?.full_name}</h4>
                    <Badge
                        type={apt.type === APPOINTMENT_TYPES.DELIVERY ? 'success' : apt.type === APPOINTMENT_TYPES.FITTING ? 'info' : 'neutral'}
                        variant="outline"
                    >
                        {APP_LABELS.appointmentTypes[apt.type as keyof typeof APP_LABELS.appointmentTypes] || apt.type}
                    </Badge>
                </div>
                <p className={styles.appointmentStatus}>
                    <span style={{
                        fontWeight: 700,
                        color: urgency?.type === 'today' ? 'var(--color-terracotta)' : '#64748b',
                        marginRight: '0.5rem',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem'
                    }}>
                        {urgency?.label} •
                    </span>
                    {apt.type === APPOINTMENT_TYPES.DELIVERY ? 'Próxima entrega' : 'Cita programada'}
                </p>
            </div>
        </motion.div>
    );
};
