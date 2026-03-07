import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MessageCircle, Phone, Calendar, Plus, Mail, MapPin,
    Wallet, Ruler, RefreshCw, History, Check, Scissors, Users, Edit, ExternalLink, ArrowLeft
} from 'lucide-react';
import { ViewState } from '../../../../types';
import { supabase } from '@/config/supabase';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import { containerVariants, itemVariants } from '@/constants/animations';
import { Badge } from '@/components/common/Badge/Badge';
import { EditClientModal } from '../../../components/forms/EditClientModal/EditClientModal';
import { useAuth } from '../../../hooks/useAuth';
import { useClientDetails } from '@/hooks/useClientDetails';
import { NewAppointmentModal } from '@/components/modals/NewAppointmentModal/NewAppointmentModal';
import styles from './ClientProfileView.module.css';

interface ClientProfileViewProps {
    onChangeView?: (view: ViewState) => void;
}


const statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En Proceso',
    completed: 'Completado',
    delivered: 'Entregado',
};


export const ClientProfileView: React.FC<ClientProfileViewProps> = ({ onChangeView }) => {
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        client: rawClient,
        projects: rawProjects,
        measurements: rawMeasurements,
        loading,
        refresh: loadData
    } = useClientDetails(clientId);

    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Process client data for view
    const client = {
        name: rawClient?.full_name || '',
        avatarUrl: '',
        email: rawClient?.email || '',
        phone: rawClient?.phone || '',
        address: rawClient?.address || '',
        addressLink: rawClient?.address_link || '',
        balance: 0,
        notes: rawClient?.notes || '',
        measures: (rawMeasurements?.values as Record<string, number>) || {},
        projects: (rawProjects || []).map((p: any) => {
            const deliveryApt = p.appointments?.find((a: any) => a.type === 'delivery');
            return {
                id: p.id,
                title: p.title,
                status: statusLabel[p.status] ?? p.status ?? '—',
                date: deliveryApt ? `Entrega: ${formatDate(deliveryApt.start_time)}` : formatDate(p.created_at),
                price: p.total_cost ?? 0,
                type: p.type ?? 'confection',
            };
        }),
    };

    const [activeMeasureTab, setActiveMeasureTab] = useState<'upper' | 'lower'>('upper');

    const hasMeasures = Object.keys(client.measures).length > 0;

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
                                <button
                                    onClick={() => navigate('/clients')}
                                >
                                    <ArrowLeft size={18} />
                                    <span>Volver</span>
                                </button>
                                <span className="breadcrumb-separator">/</span>
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
                        onClick={() => navigate(`/clients/${clientId}/projects/new`)}
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
                                <span className={styles.balanceValue}>{formatCurrency(client.balance)}</span>
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
                                    onClick={() => navigate(`/clients/${clientId}/measurements`)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {hasMeasures ? <RefreshCw size={18} /> : <Plus size={18} />}
                                    {hasMeasures ? 'Actualizar Medidas' : 'Agregar Medidas'}
                                </motion.button>
                            </div>
                        </div>

                        <div className={styles.measuresContent}>
                            <div className={styles.tabsContainer}>
                                <button
                                    className={`${styles.tabButton} ${activeMeasureTab === 'upper' ? styles.tabButtonActive : ''}`}
                                    onClick={() => setActiveMeasureTab('upper')}
                                >
                                    Parte Superior
                                </button>
                                <button
                                    className={`${styles.tabButton} ${activeMeasureTab === 'lower' ? styles.tabButtonActive : ''}`}
                                    onClick={() => setActiveMeasureTab('lower')}
                                >
                                    Parte Inferior
                                </button>
                            </div>

                            <div className={styles.measuresGrid}>
                                {activeMeasureTab === 'upper' ? (
                                    <>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Busto</p>
                                            <p className={styles.measureValue}>{client.measures.busto || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Espalda</p>
                                            <p className={styles.measureValue}>{client.measures.espalda || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Talle Del.</p>
                                            <p className={styles.measureValue}>{client.measures.talleDelantero || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Talle Esp.</p>
                                            <p className={styles.measureValue}>{client.measures.talleEspalda || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Alt. Busto</p>
                                            <p className={styles.measureValue}>{client.measures.alturaBusto || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Sisa</p>
                                            <p className={styles.measureValue}>{client.measures.sisa || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Largo Manga</p>
                                            <p className={styles.measureValue}>{client.measures.largoManga || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Cont. Brazo</p>
                                            <p className={styles.measureValue}>{client.measures.anchoBrazo || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Puño</p>
                                            <p className={styles.measureValue}>{client.measures.puno || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Cintura</p>
                                            <p className={styles.measureValue}>{client.measures.cintura || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Cadera</p>
                                            <p className={styles.measureValue}>{client.measures.cadera || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Largo Tiro</p>
                                            <p className={styles.measureValue}>{client.measures.largoTiro || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                        <div className={styles.measureItem}>
                                            <p className={styles.measureLabel}>Largo Total</p>
                                            <p className={styles.measureValue}>{client.measures.largoTotal || 0} <span className={styles.measureUnit}>cm</span></p>
                                        </div>
                                    </>
                                )}
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
                                        <Badge
                                            type={project.status === 'Entregado' ? 'success' : 'warning'}
                                            variant="filled"
                                        >
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <div className={styles.timelineDetails}>
                                        <p>{project.date}</p>
                                        <p className={styles.timelinePrice}>{formatCurrency(project.price)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.section>

                </div>
            </div>

            {/* ── Modal: Nueva Cita ── */}
            <NewAppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
                clientId={clientId || ''}
                clientName={client?.name || ''}
                onSuccess={loadData}
            />

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
