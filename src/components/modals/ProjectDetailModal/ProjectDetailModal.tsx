import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    MessageCircle,
    ExternalLink,
    DollarSign,
    FileText,
    Image as ImageIcon,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { useProjectStatuses } from '@/hooks/useProjectStatuses';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { Badge } from '@/components/common/Badge/Badge';
import styles from './ProjectDetailModal.module.css';

interface ProjectDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
    isOpen,
    onClose,
    project
}) => {
    const navigate = useNavigate();
    const { getStatusInfo, getStatusIcon } = useProjectStatuses();

    if (!project) return null;

    const statusInfo = getStatusInfo(project.status);
    const StatusIcon = getStatusIcon(project.status);
    const progress = project.total_cost ? (project.deposit / project.total_cost) * 100 : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay} onClick={onClose}>
                    <motion.div
                        className={styles.modalContent}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <button className={styles.closeButton} onClick={onClose}>
                                <X size={20} />
                            </button>

                            <div className={styles.titleGroup}>
                                <Badge
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    {project.type === 'confection' ? 'Confección' : 'Arreglo'}
                                </Badge>
                                <h2 className={styles.title}>{project.title}</h2>
                                <p className={styles.subtitle}>Cliente: {project.clients?.full_name}</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className={styles.body}>
                            {/* Status Section */}
                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <StatusIcon size={14} /> Estado Actual
                                </div>
                                <div
                                    className={styles.statItem}
                                    style={{ borderLeft: `4px solid ${statusInfo?.color}` }}
                                >
                                    <div className={styles.statValue}>{statusInfo?.label}</div>
                                </div>
                            </section>

                            {/* Finance Section */}
                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <DollarSign size={14} /> Resumen Financiero
                                </div>
                                <div className={styles.financeGrid}>
                                    <div className={styles.statItem}>
                                        <div className={styles.statLabel}>Total Presupuesto</div>
                                        <div className={styles.statValue}>{formatCurrency(project.total_cost || 0)}</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statLabel}>Pagado / Adelanto</div>
                                        <div className={styles.statValue}>{formatCurrency(project.deposit || 0)}</div>
                                    </div>
                                </div>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={styles.progressBar}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className={styles.statLabel}>
                                    {progress === 100 ? 'Totalmente pagado' : `${Math.round(progress)}% del total abonado`}
                                </div>
                            </section>

                            {/* Gallery Section */}
                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <ImageIcon size={14} /> Galería de Imágenes
                                </div>
                                {project.images && project.images.length > 0 ? (
                                    <div className={styles.imageGrid}>
                                        {project.images.map((img: string, i: number) => (
                                            <img key={i} src={img} alt="" className={styles.projectImage} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyGallery}>
                                        <ImageIcon size={32} />
                                        <p>No hay imágenes adjuntas a este proyecto</p>
                                    </div>
                                )}
                            </section>

                            {/* Notes Section */}
                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <FileText size={14} /> Notas y Especificaciones
                                </div>
                                <div className={styles.notesArea}>
                                    {project.description || 'No hay notas técnicas registradas.'}
                                </div>
                            </section>
                        </div>

                        {/* Footer / Actions */}
                        <div className={styles.footer}>
                            <button
                                className={`${styles.actionButton} ${styles.whatsappBtn}`}
                                onClick={() => {
                                    const phone = project.clients?.phone;
                                    if (phone) window.open(`https://wa.me/${phone.replace(/\+/g, '')}`, '_blank');
                                }}
                            >
                                <MessageCircle size={20} /> Contactar Cliente
                            </button>
                            <button
                                className={`${styles.actionButton} ${styles.manageBtn}`}
                                onClick={() => {
                                    navigate('/projects');
                                    onClose();
                                }}
                            >
                                Ir a Gestión <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
