import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Phone, Calendar, Plus, Mail, MapPin,
    Wallet, Ruler, RefreshCw, History, Check, Scissors, Users, Loader2, X, Clock, Edit, ExternalLink
} from 'lucide-react';
import { ViewState } from '../../../../types';
import { supabase } from '@/config/supabase';
import { EditClientModal } from '../../../components/forms/EditClientModal/EditClientModal';
import { AppointmentService } from '../../../services/appointment.service';
import { useAuth } from '../../../hooks/useAuth';
import styles from './ClientProfileView.module.css';

interface ClientProfileViewProps {
    onChangeView?: (view: ViewState) => void;
}

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En Proceso',
    completed: 'Completado',
    delivered: 'Entregado',
};

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({ onChangeView }) => {
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [client, setClient] = useState({
        name: '',
        avatarUrl: '',
        email: '',
        phone: '',
        address: '',
        addressLink: '',
        balance: 0,
        notes: '',
        measures: {} as Record<string, number>,
        projects: [] as { id: string; title: string; status: string; date: string; price: number; type: string }[],
    });

    const [appointmentForm, setAppointmentForm] = useState({
        type: 'fitting',
        date: '',
        time: '',
        notes: ''
    });

    const [isSavingAppointment, setIsSavingAppointment] = useState(false);
    const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const loadData = async () => {
        if (!clientId) return;
        setLoading(true);
        const [{ data: c }, { data: projs }, { data: meas }] = await Promise.all([
            supabase.from('clients').select('*').eq('id', clientId).single(),
            supabase.from('projects').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
            supabase.from('measurements').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(1),
        ]);

        if (c) {
            setClient({
                name: c.full_name,
                avatarUrl: '',
                email: c.email ?? '',
                phone: c.phone ?? '',
                address: c.address ?? '',
                addressLink: c.address_link ?? '',
                balance: 0,
                notes: c.notes ?? '',
                measures: (meas?.[0]?.values as Record<string, number>) ?? {},
                projects: (projs ?? []).map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    status: statusLabel[p.status] ?? p.status ?? '—',
                    date: p.deadline ? `Entrega: ${formatDate(p.deadline)}` : formatDate(p.created_at),
                    price: p.total_cost ?? 0,
                    type: p.type ?? 'confection',
                })),
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [clientId]);

    const hasMeasures = Object.keys(client.measures).length > 0;

    const handleSaveAppointment = async () => {
        if (!user || !clientId) return;
        setIsSavingAppointment(true);

        const startDateTime = new Date(`${appointmentForm.date}T${appointmentForm.time}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration default

        const { error } = await AppointmentService.create({
            user_id: user.id,
            client_id: clientId,
            type: appointmentForm.type,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            title: `${appointmentForm.type === 'fitting' ? 'Prueba' : appointmentForm.type === 'measurement' ? 'Medición' : appointmentForm.type === 'delivery' ? 'Entrega' : 'Cita'}: ${client.name}`,
            notes: appointmentForm.notes,
            status: 'scheduled'
        });

        setIsSavingAppointment(false);

        if (error) {
            alert('Error al guardar la cita. Por favor, intenta de nuevo.');
            return;
        }

        setIsAppointmentModalOpen(false);
        setAppointmentForm({ type: 'fitting', date: '', time: '', notes: '' });
        setOccupiedSlots([]);
    };

    useEffect(() => {
        const fetchOccupiedSlots = async () => {
            if (!appointmentForm.date) return;
            setIsLoadingSlots(true);
            const { data, error } = await AppointmentService.getByDate(appointmentForm.date);
            if (!error && data) {
                // Extract HH:mm from ISO strings
                const slots = data.map(apt => {
                    const date = new Date(apt.start_time);
                    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                });
                setOccupiedSlots(slots);
            }
            setIsLoadingSlots(false);
        };
        fetchOccupiedSlots();
    }, [appointmentForm.date]);

    const StatusIcon = ({ status }: { status: string }) => {
        if (status === 'Entregado') return <Check size={14} />;
        return <Scissors size={14} />;
    };

    return (
        <motion.div
            className={styles.profileContainer}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >

            {/* Header Section */}
            <motion.div className="view-header" variants={itemVariants}>
                <div className={styles.profileInfo}>
                    <div className={styles.profileAvatarWrapper}>
                        <div className={styles.avatar}>
                            <img
                                src={client.avatarUrl}
                                alt={client.name}
                                className={styles.avatarImg}
                            />
                        </div>
                        <div className="view-title-section">
                            <div className="view-breadcrumb">
                                <Users size={18} />
                                <span>Perfil de Cliente</span>
                            </div>
                            <h1 className="view-title">{client.name}</h1>
                            <div className={styles.contactActions}>
                                {client.phone && (
                                    <>
                                        <a
                                            href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`${styles.contactLink} ${styles.whatsappLink}`}
                                        >
                                            <MessageCircle size={18} /> WhatsApp
                                        </a>
                                        <a
                                            href={`tel:+${client.phone.replace(/\D/g, '')}`}
                                            className={`${styles.contactLink} ${styles.callLink}`}
                                        >
                                            <Phone size={18} /> Llamar
                                        </a>
                                    </>
                                )}
                                <button
                                    className={`${styles.contactLink}`}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    <Edit size={18} /> Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.headerButtons}>
                    <motion.button
                        className={`${styles.actionButton} ${styles.secondaryButton}`}
                        onClick={() => setIsAppointmentModalOpen(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Calendar size={20} />
                        Nueva Cita
                    </motion.button>
                    <motion.button
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                        onClick={() => navigate('/projects')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={20} />
                        Nuevo Proyecto
                    </motion.button>
                </div>
            </motion.div>

            <div className={styles.gridContainer}>

                {/* Sidebar: Contact & Notes */}
                <div className={styles.sidebar}>
                    <motion.section
                        className={styles.card}
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                        transition={{ type: "tween", duration: 0.2 }}
                    >
                        <h3 className={styles.cardTitle}>Información de Contacto</h3>
                        <div className={styles.contactList}>
                            <div className={styles.contactItem}>
                                <Mail size={20} className={styles.contactIcon} />
                                <div>
                                    <p className={styles.contactLabel}>Correo Electrónico</p>
                                    <p className={styles.contactValue}>{client.email}</p>
                                </div>
                            </div>
                            {client.phone && (
                                <div className={styles.contactItem}>
                                    <Phone size={20} className={styles.contactIcon} />
                                    <div>
                                        <p className={styles.contactLabel}>Teléfono</p>
                                        <p className={styles.contactValue}>{client.phone}</p>
                                    </div>
                                </div>
                            )}
                            <div className={styles.contactItem}>
                                <MapPin size={20} className={styles.contactIcon} />
                                <div>
                                    <p className={styles.contactLabel}>Dirección</p>
                                    <p className={styles.contactValue}>{client.address || "No especificada"}</p>
                                </div>
                            </div>
                            {client.addressLink && (
                                <div className={styles.contactItem}>
                                    <ExternalLink size={20} className={styles.contactIcon} />
                                    <div>
                                        <p className={styles.contactLabel}>Ubicación</p>
                                        <a
                                            href={client.addressLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={styles.contactValue}
                                            style={{ color: 'var(--color-terracotta)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            Abrir en Google Maps
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className={styles.balanceCard}>
                                <div className={styles.balanceLabel}>
                                    <Wallet size={20} />
                                    <span>Saldo Pendiente:</span>
                                </div>
                                <span className={styles.balanceValue}>${client.balance}</span>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        className={styles.card}
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                        transition={{ type: "tween", duration: 0.2 }}
                    >
                        <div className={styles.cardTitle}>
                            <span>Notas Generales</span>
                            <button className={styles.editLink}>Editar</button>
                        </div>
                        <p className={styles.notesText}>
                            "{client.notes}"
                        </p>
                    </motion.section>
                </div>

                {/* Main Content: Measures & History */}
                <div className={styles.mainContent}>

                    {/* Measurements Section */}
                    <motion.section
                        className={styles.mainCard}
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionTitleGroup}>
                                <div className={styles.sectionIconWrapper}>
                                    <Ruler size={24} />
                                </div>
                                <h2 className={styles.sectionMainTitle}>Medidas Base</h2>
                            </div>
                            <div className={styles.sectionActions}>
                                <motion.button
                                    className={styles.refreshButton}
                                    onClick={() => navigate('/measurements')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {hasMeasures ? <RefreshCw size={18} /> : <Plus size={18} />}
                                    {hasMeasures ? 'Actualizar Medidas' : 'Agregar Medidas'}
                                </motion.button>
                            </div>
                        </div>

                        <div className={styles.measuresGrid}>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Busto</p>
                                <p className={styles.measureValue}>{client.measures.busto} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Cintura</p>
                                <p className={styles.measureValue}>{client.measures.cintura} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Cadera</p>
                                <p className={styles.measureValue}>{client.measures.cadera} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Talle Del.</p>
                                <p className={styles.measureValue}>{client.measures.talleDelantero} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Espalda</p>
                                <p className={styles.measureValue}>{client.measures.espalda} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Largo Total</p>
                                <p className={styles.measureValue}>{client.measures.largoTotal} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Sisa</p>
                                <p className={styles.measureValue}>{client.measures.sisa} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Brazo</p>
                                <p className={styles.measureValue}>{client.measures.brazo} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Project History */}
                    <motion.section className={styles.timeline} variants={itemVariants}>
                        <div className={styles.sectionTitleGroup}>
                            <div className={styles.historyIconWrapper}>
                                <History size={24} />
                            </div>
                            <h2 className={styles.sectionMainTitle}>Historial de Proyectos</h2>
                        </div>

                        {client.projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className={styles.timelineItem}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <div className={`${styles.timelineIconWrapper} ${project.status === 'Entregado' ? styles.timelineIconActive : ''}`}>
                                    <span className={styles.timelineIcon}>
                                        <StatusIcon status={project.status} />
                                    </span>
                                </div>
                                <div className={styles.timelineCard}>
                                    <div className={styles.timelineHeader}>
                                        <div className={styles.timelineTitle}>{project.title}</div>
                                        <span className={`${styles.statusBadge} ${project.status === 'Entregado' ? styles.statusDelivered : styles.statusProcess}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className={styles.timelineDetails}>
                                        <p>{project.date}</p>
                                        <p className={styles.timelinePrice}>${project.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.section>

                </div>
            </div>

            {/* ── Modal: Nueva Cita ── */}
            <AnimatePresence>
                {isAppointmentModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 1000, padding: '1rem',
                        }}
                        onClick={() => setIsAppointmentModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.97 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            style={{
                                background: 'white', borderRadius: '1.25rem', padding: '2rem',
                                width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                                position: 'relative',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ background: 'rgba(178,91,82,0.1)', borderRadius: '50%', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-terracotta)' }}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-charcoal)' }}>Nueva Cita</h2>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>{client.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAppointmentModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '0.25rem' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo de cita</label>
                                    <select
                                        value={appointmentForm.type}
                                        onChange={(e) => setAppointmentForm({ ...appointmentForm, type: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: 'var(--color-charcoal)', background: 'white', outline: 'none' }}
                                    >
                                        <option value="fitting">Prueba de vestido</option>
                                        <option value="measurement">Toma de medidas</option>
                                        <option value="delivery">Entrega de prenda</option>
                                        <option value="consultation">Consulta</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha</label>
                                        <input
                                            type="date"
                                            value={appointmentForm.date}
                                            onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                                            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: 'var(--color-charcoal)', boxSizing: 'border-box', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hora</label>
                                        <div style={{ position: 'relative' }}>
                                            <Clock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none', zIndex: 1 }} />
                                            <select
                                                value={appointmentForm.time}
                                                onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                                                style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.2rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: 'var(--color-charcoal)', boxSizing: 'border-box', outline: 'none', background: 'white' }}
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
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notas</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Detalles de la cita..."
                                        value={appointmentForm.notes}
                                        onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: 'var(--color-charcoal)', resize: 'none', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button onClick={() => setIsAppointmentModalOpen(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', background: 'white', color: '#64748B', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                                    Cancelar
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSavingAppointment || !appointmentForm.date || !appointmentForm.time}
                                    style={{
                                        flex: 1, padding: '0.75rem', border: 'none', borderRadius: '0.75rem',
                                        background: isSavingAppointment ? '#CBD5E1' : 'var(--color-terracotta)',
                                        color: 'white', fontWeight: 700, cursor: (isSavingAppointment || !appointmentForm.date || !appointmentForm.time) ? 'not-allowed' : 'pointer', fontSize: '0.875rem'
                                    }}
                                    onClick={handleSaveAppointment}
                                >
                                    {isSavingAppointment ? 'Guardando...' : 'Guardar Cita'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Modal: Editar Cliente ── */}
            <EditClientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={loadData}
                client={{
                    id: clientId || '',
                    name: client.name,
                    phone: client.phone,
                    email: client.email,
                    address: client.address,
                    addressLink: client.addressLink,
                    notes: client.notes
                }}
            />
        </motion.div>
    );
};
