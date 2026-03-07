import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, Clock, User, Loader2 } from 'lucide-react';
import { AppointmentService } from '@/services/appointment.service';
import { useAuth } from '@/hooks/useAuth';
import { useAppointmentTypes } from '@/hooks/useAppointmentTypes';
import { useClientSearch } from '@/hooks/useClientSearch';
import { THEME_COLORS, APP_LABELS } from '@/constants/appearance';
import styles from './NewAppointmentModal.module.css';

interface NewAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId?: string;
    clientName?: string;
    initialDate?: string;
    initialTime?: string;
    initialType?: string;
    appointmentId?: string;
    onSuccess?: () => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
    isOpen,
    onClose,
    clientId,
    clientName,
    initialDate = '',
    initialTime = '',
    initialType = 'fitting',
    appointmentId,
    onSuccess
}) => {
    const { user } = useAuth();
    const { types: appointmentTypes, loading: loadingTypes } = useAppointmentTypes();

    // Client Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState<{ id: string, full_name: string } | null>(null);
    const { results, loading: searchingClients } = useClientSearch(searchQuery);
    const [showResults, setShowResults] = useState(false);

    const [appointmentForm, setAppointmentForm] = useState({
        type: initialType,
        date: initialDate,
        time: initialTime,
        notes: ''
    });

    const [isSavingAppointment, setIsSavingAppointment] = useState(false);
    const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAppointmentForm(prev => ({
                ...prev,
                type: initialType,
                date: initialDate,
                time: initialTime,
                notes: ''
            }));
            if (!clientId && !appointmentId) {
                setSearchQuery('');
                setSelectedClient(null);
            } else if (!clientId && appointmentId && clientName) {
                // If editing and no clientId is provided directly, but we have clientName
                setSearchQuery(clientName);
            }
        }
    }, [isOpen, initialDate, initialTime, initialType, clientId, appointmentId, clientName]);

    useEffect(() => {
        const fetchOccupiedSlots = async () => {
            if (!appointmentForm.date) return;
            setIsLoadingSlots(true);
            try {
                const { data, error } = await AppointmentService.getByDate(appointmentForm.date);
                if (!error && data) {
                    const slots = data.map(apt => {
                        const date = new Date(apt.start_time);
                        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                    });
                    setOccupiedSlots(slots);
                }
            } catch (err) {
                console.error('Error fetching slots:', err);
            } finally {
                setIsLoadingSlots(false);
            }
        };
        fetchOccupiedSlots();
    }, [appointmentForm.date]);

    const handleSelectClient = (client: { id: string, full_name: string }) => {
        setSelectedClient(client);
        setSearchQuery(client.full_name);
        setShowResults(false);
    };

    const handleSaveAppointment = async () => {
        console.log('handleSaveAppointment');
        const finalClientId = clientId || selectedClient?.id;
        const finalClientName = clientName || selectedClient?.full_name;

        if (!user || !finalClientId) return;
        setIsSavingAppointment(true);

        const startDateTime = new Date(`${appointmentForm.date}T${appointmentForm.time}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        try {
            const data = {
                user_id: user.id,
                client_id: finalClientId,
                type: appointmentForm.type,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                title: `${appointmentForm.type === 'fitting' ? 'Prueba' : appointmentForm.type === 'measurement' ? 'Medición' : appointmentForm.type === 'delivery' ? 'Entrega' : 'Cita'}: ${finalClientName}`,
                notes: appointmentForm.notes,
                status: 'scheduled'
            };

            const { error } = appointmentId
                ? await AppointmentService.update(appointmentId, data)
                : await AppointmentService.create(data as any);

            if (error) throw error;

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving appointment:', err);
            alert('Error al guardar la cita. Por favor, intenta de nuevo.');
        } finally {
            setIsSavingAppointment(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.modalOverlay}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={styles.modalContent}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.headerInfo}>
                                <div
                                    className={styles.iconWrapper}
                                    style={{
                                        backgroundColor: (THEME_COLORS.appointments as any)[appointmentForm.type]?.light || 'rgba(178, 91, 82, 0.1)',
                                        color: (THEME_COLORS.appointments as any)[appointmentForm.type]?.main || 'var(--color-terracotta)'
                                    }}
                                >
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h2 className={styles.title}>{appointmentId ? 'Reprogramar Cita' : 'Nueva Cita'}</h2>
                                    <p className={styles.subtitle}>{clientId || appointmentId ? clientName : 'Agendar cita para un cliente'}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className={styles.closeButton}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className={styles.form}>
                            {!clientId && !appointmentId && (
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Cliente</label>
                                    <div className={styles.searchContainer}>
                                        <div className={styles.timeWrapper}>
                                            <User size={16} className={styles.timeIcon} />
                                            <input
                                                type="text"
                                                placeholder="Buscar cliente..."
                                                className={`${styles.input} ${styles.selectWithIcon}`}
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setShowResults(true);
                                                    if (selectedClient && e.target.value !== selectedClient.full_name) {
                                                        setSelectedClient(null);
                                                    }
                                                }}
                                                onFocus={() => setShowResults(true)}
                                                required
                                            />
                                        </div>

                                        {showResults && searchQuery.length >= 3 && (
                                            <div className={styles.searchResults}>
                                                {searchingClients ? (
                                                    <div className={styles.searchLoading}>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        <span>Buscando...</span>
                                                    </div>
                                                ) : results.length > 0 ? (
                                                    results.map(client => (
                                                        <div
                                                            key={client.id}
                                                            className={styles.searchResultItem}
                                                            onClick={() => handleSelectClient(client)}
                                                        >
                                                            <User size={14} />
                                                            <span>{client.full_name}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className={styles.noResults}>No se encontraron clientes</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tipo de cita</label>
                                <select
                                    value={appointmentForm.type}
                                    onChange={(e) => setAppointmentForm({ ...appointmentForm, type: e.target.value })}
                                    className={styles.select}
                                    disabled={loadingTypes}
                                >
                                    {loadingTypes ? (
                                        <option>Cargando tipos...</option>
                                    ) : (
                                        appointmentTypes.map(type => (
                                            <option key={type.slug} value={type.slug}>
                                                {type.label}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className={styles.grid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Fecha</label>
                                    <input
                                        type="date"
                                        value={appointmentForm.date}
                                        onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Hora</label>
                                    <div className={styles.timeWrapper}>
                                        <Clock size={16} className={styles.timeIcon} />
                                        <select
                                            value={appointmentForm.time}
                                            onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                                            className={`${styles.select} ${styles.selectWithIcon}`}
                                            required
                                        >
                                            <option value="">{isLoadingSlots ? 'Cargando...' : 'Seleccionar hora'}</option>
                                            {Array.from({ length: 25 }).map((_, i) => {
                                                const hour = Math.floor(i / 2) + 8;
                                                const minutes = i % 2 === 0 ? '00' : '30';
                                                const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
                                                const isOccupied = occupiedSlots.includes(time);

                                                return (
                                                    <option key={time} value={time} disabled={isOccupied}>
                                                        {time} {isOccupied ? '(Ocupado)' : ''}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Notas</label>
                                <textarea
                                    rows={3}
                                    placeholder="Detalles de la cita..."
                                    value={appointmentForm.notes}
                                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                                    className={styles.textarea}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.actions}>
                            <button onClick={onClose} className={styles.cancelBtn}>
                                Cancelar
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSavingAppointment || !appointmentForm.date || !appointmentForm.time || (!clientId && !selectedClient && !appointmentId)}
                                className={styles.submitBtn}
                                onClick={handleSaveAppointment}
                            >
                                {isSavingAppointment ? 'Guardando...' : appointmentId ? 'Guardar Cambios' : 'Guardar Cita'}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
