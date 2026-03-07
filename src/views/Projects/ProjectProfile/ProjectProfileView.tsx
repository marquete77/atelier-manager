import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    Image as ImageIcon,
    MessageCircle,
    Phone,
    Ruler,
    User,
    CheckCircle2,
    AlertCircle,
    Scissors,
    Edit
} from 'lucide-react';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { useProjectStatuses } from '@/hooks/useProjectStatuses';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { containerVariants, itemVariants } from '@/constants/animations';
import { Badge } from '@/components/common/Badge/Badge';
import styles from './ProjectProfileView.module.css';

export const ProjectProfileView: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { project, client, measurements, appointments, loading, error } = useProjectDetails(projectId);
    const { getStatusInfo, getStatusIcon } = useProjectStatuses();

    if (loading) {
        return (
            <div className={styles.loaderWrapper}>
                <div className={styles.loader}></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className={styles.errorWrapper}>
                <AlertCircle size={48} className={styles.errorIcon} />
                <h2 className={styles.errorTitle}>Error al cargar el proyecto</h2>
                <button onClick={() => navigate('/projects')} className={styles.backButton}>
                    Volver a Proyectos
                </button>
            </div>
        );
    }

    const statusInfo = getStatusInfo(project.status);
    const StatusIcon = getStatusIcon(project.status);
    const unpaidAmount = (project.total_cost || 0) - (project.deposit || 0);

    return (
        <motion.div
            className={styles.container}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.profileAvatarWrapper}>
                    <div className={styles.avatar}>
                        {project.images?.[0] ? (
                            <img src={project.images[0]} alt="" className={styles.avatarImg} />
                        ) : (
                            <div className={styles.avatarFallback}>
                                {project.title?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="view-title-section">
                        <div className="view-breadcrumb">
                            <button onClick={() => navigate(-1)} className={styles.backButton}>
                                <ArrowLeft size={18} />
                                <span>Volver</span>
                            </button>
                            <span className="breadcrumb-separator">/</span>
                            <FileText size={18} />
                            <span>Perfil de Proyecto</span>
                        </div>

                        <h1 className="view-title">{project.title}</h1>

                        <div className={styles.contactActions}>
                            {client?.phone && (
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
                                        href={`tel:${client.phone}`}
                                        className={`${styles.contactLink} ${styles.callLink}`}
                                    >
                                        <Phone size={18} /> Llamar
                                    </a>
                                </>
                            )}
                            <button className={`${styles.contactLink} ${styles.editLink}`}>
                                <Edit size={18} /> Editar
                            </button>
                            <div className={styles.contactLink}>
                                <Badge
                                    type={project.type === 'confection' ? 'info' : 'warning'}
                                    variant="filled"
                                >
                                    {project.type === 'confection' ? 'Confección' : 'Arreglo'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="ml-auto hidden md:block">
                        <div
                            className={styles.statusWrapper}
                            style={{ backgroundColor: `${statusInfo?.color}15`, color: statusInfo?.color }}
                        >
                            <StatusIcon size={24} color={statusInfo?.color} />
                            <div className={styles.statusInfo}>
                                <div className={styles.statusLabel}>Estado</div>
                                <div className={styles.statusValue}>{statusInfo?.label}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.mainGrid}>
                {/* Left Column: Details & Media */}
                <div className={styles.column}>
                    {/* Measurements */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                                <Ruler size={16} className={styles.titleIcon} /> Medidas del Cliente
                            </h3>
                            <button
                                onClick={() => navigate(`/clients/${client?.id}/measurements`)}
                                className="text-xs font-bold text-terracotta hover:underline"
                            >
                                Ver todas
                            </button>
                        </div>
                        {measurements?.values ? (
                            <div className={styles.measurementsMainGrid}>
                                {Object.entries(measurements.values).map(([key, value]: [string, any]) => (
                                    <div key={key} className={styles.measureItemMain}>
                                        <span className={styles.measureLabel}>{key}</span>
                                        <div className={styles.measureValueLine}></div>
                                        <span className={styles.measureValue}>{value} cm</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-slate-400 text-sm">
                                No hay medidas registradas.
                            </div>
                        )}
                    </div>

                    {/* Gallery */}
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>
                            <ImageIcon size={16} className={styles.titleIcon} /> Galería de Referencia
                        </h3>
                        {project.images && project.images.length > 0 ? (
                            <div className={styles.imageGrid}>
                                {project.images.map((img: string, i: number) => (
                                    <img key={i} src={img} alt="" className={styles.projectImage} />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <ImageIcon size={32} />
                                <p className="mt-2">No hay imágenes adjuntas</p>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>
                            <FileText size={16} className={styles.titleIcon} /> Especificaciones Técnicas
                        </h3>
                        <div className={styles.notesWrapper}>
                            <p className={styles.notesText}>
                                {project.description || 'No hay notas técnicas registradas para este proyecto.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Client & Schedule */}
                <div className={styles.column}>
                    {/* Financial Summary (Sidebar) */}
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>
                            <DollarSign size={16} className={styles.titleIcon} /> Resumen de Pago
                        </h3>
                        <div className={styles.financeSidebarGrid}>
                            <div className={styles.financeSidebarItem}>
                                <span className={styles.priceSidebarTitle}>Total</span>
                                <span className={styles.priceSidebarValue}>{formatCurrency(project.total_cost || 0)}</span>
                            </div>
                            <div className={styles.financeSidebarItem}>
                                <span className={styles.priceSidebarTitle}>Pagado</span>
                                <span className={styles.priceSidebarValue}>{formatCurrency(project.deposit || 0)}</span>
                            </div>
                            <div className={`${styles.financeSidebarItem} ${styles.financeSidebarBalance}`}>
                                <span className={styles.priceSidebarTitle}>Saldo Pendiente</span>
                                <span className={styles.priceSidebarValue}>{formatCurrency(unpaidAmount)}</span>
                            </div>
                        </div>
                        {unpaidAmount <= 0 && (
                            <div className={styles.paidBadge}>
                                <CheckCircle2 size={14} color="#10b981" /> Pagado
                            </div>
                        )}
                    </div>

                    {/* Client Info (Cleaned up) */}
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>
                            <User size={16} className={styles.titleIcon} /> Información del Cliente
                        </h3>
                        <div className={styles.clientBrief}>
                            <div className={styles.clientAvatarSmall}>
                                <User size={24} color="#94a3b8" />
                            </div>
                            <div>
                                <h4 className={styles.clientNameBrief}>{client?.full_name}</h4>
                                <p className={styles.clientSubtitleBrief}>Cliente Asociado</p>
                            </div>
                        </div>

                        <div className={styles.clientDetailsList}>
                            <div className={styles.clientDetailItem}>
                                <span className={styles.clientDetailLabel}>Teléfono</span>
                                <span className={styles.clientDetailValue}>{client?.phone || 'No registrado'}</span>
                            </div>
                            <div className={styles.clientDetailItem}>
                                <span className={styles.clientDetailLabel}>Email</span>
                                <span className={`${styles.clientDetailValue} ${styles.emailValue}`}>
                                    {client?.email || 'No registrado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>
                            <Calendar size={16} className={styles.titleIcon} /> Fechas y Citas
                        </h3>
                        <div className="space-y-3">
                            {appointments.length > 0 ? appointments.map((apt) => (
                                <div key={apt.id} className={styles.appointmentCard}>
                                    <div className={styles.appointmentIcon}>
                                        {apt.type === 'fitting' ? (
                                            <Scissors size={20} className={styles.fittingIcon} />
                                        ) : (
                                            <Calendar size={20} className={styles.deliveryIcon} />
                                        )}
                                    </div>
                                    <div className={styles.appointmentInfo}>
                                        <h4>{apt.type === 'fitting' ? 'Cita de Prueba' : 'Entrega Final'}</h4>
                                        <p>{formatDate(apt.start_time)}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-4 text-center text-slate-400 text-sm">
                                    No hay citas programadas para este proyecto.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
