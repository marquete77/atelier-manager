/**
 * Centralized theme constants for the application.
 * Use this file to manage all labels, colors, and visual mappings.
 */

export const APPOINTMENT_TYPES = {
    FITTING: 'fitting',
    DELIVERY: 'delivery',
    MEASUREMENT: 'measurement',
    CONSULTATION: 'consultation',
} as const;

export const APPOINTMENT_STATUS = {
    SCHEDULED: 'scheduled',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    REQUESTED: 'requested',
} as const;

export const PROJECT_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    DELIVERED: 'delivered',
} as const;

export const APP_LABELS = {
    appointmentTypes: {
        [APPOINTMENT_TYPES.FITTING]: 'PRUEBA',
        [APPOINTMENT_TYPES.DELIVERY]: 'ENTREGA',
        [APPOINTMENT_TYPES.MEASUREMENT]: 'MEDICIÓN',
        [APPOINTMENT_TYPES.CONSULTATION]: 'CONSULTA',
    },
    appointmentStatus: {
        [APPOINTMENT_STATUS.SCHEDULED]: 'PROGRAMADA',
        [APPOINTMENT_STATUS.CONFIRMED]: 'CONFIRMADA',
        [APPOINTMENT_STATUS.CANCELLED]: 'CANCELADA',
        [APPOINTMENT_STATUS.COMPLETED]: 'COMPLETADA',
        [APPOINTMENT_STATUS.REQUESTED]: 'SOLICITADA',
    },
    projectStatus: {
        [PROJECT_STATUS.PENDING]: 'PENDIENTE',
        [PROJECT_STATUS.IN_PROGRESS]: 'EN CURSO',
        [PROJECT_STATUS.COMPLETED]: 'COMPLETADO',
        [PROJECT_STATUS.DELIVERED]: 'ENTREGADO',
    }
};

/**
 * Color mapping for appointments.
 * These match the CSS variables defined in index.css
 */
export const THEME_COLORS = {
    appointments: {
        [APPOINTMENT_TYPES.FITTING]: {
            main: 'var(--color-fitting)',
            light: 'var(--color-fitting-light)',
        },
        [APPOINTMENT_TYPES.MEASUREMENT]: {
            main: 'var(--color-measurement)',
            light: 'var(--color-measurement-light)',
        },
        [APPOINTMENT_TYPES.DELIVERY]: {
            main: 'var(--color-delivery)',
            light: 'var(--color-delivery-light)',
        },
        [APPOINTMENT_TYPES.CONSULTATION]: {
            main: 'var(--color-consultation)',
            light: 'var(--color-consultation-light)',
        },
        default: {
            main: '#64748B',
            light: '#F1F5F9',
        }
    }
};
