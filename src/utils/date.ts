/**
 * Formatea una fecha en formato legible para humanos (es-ES).
 * Maneja tanto strings ISO como fechas YYYY-MM-DD para evitar desfases.
 */
export const formatDate = (d: string | null): string => {
    if (!d) return '—';
    if (d.includes('-') && d.length === 10) {
        const [year, month, day] = d.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * Formatea la hora de una fecha (HH:mm).
 */
export const formatTime = (d: string): string => {
    const date = new Date(d);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Obtiene el indicador AM/PM de una fecha.
 */
export const getAmPm = (d: string): string => {
    return new Date(d).getHours() >= 12 ? 'PM' : 'AM';
};

/**
 * Calcula una etiqueta de urgencia relativa (Hoy, Mañana, Lunes, etc.).
 */
export interface UrgencyInfo {
    label: string;
    type: 'today' | 'tomorrow' | 'this-week' | 'future';
}

export const getUrgencyLabel = (dateString?: string): UrgencyInfo | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { label: 'Hoy', type: 'today' };
    if (diffDays === 1) return { label: 'Mañana', type: 'tomorrow' };
    if (diffDays > 1 && diffDays < 7) {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return { label: days[target.getDay()], type: 'this-week' };
    }
    return { label: 'Próx. Semana', type: 'future' };
};
