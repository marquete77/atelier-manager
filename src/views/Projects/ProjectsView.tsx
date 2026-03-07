import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Search,
    Filter,
    Clock,
    User,
    Scissors,
    CheckCircle2,
    Truck,
    Loader2,
    Calendar,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { ProjectService } from '@/services/project.service';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { containerVariants, itemVariants } from '@/constants/animations';
import styles from './ProjectsView.module.css';

type ProjectStatus = 'pending' | 'in_progress' | 'completed' | 'delivered';

const statusLabels: Record<ProjectStatus, { label: string, color: string, icon: any }> = {
    pending: { label: 'Pendiente', color: '#f59e0b', icon: Clock },
    in_progress: { label: 'En Proceso', color: '#3b82f6', icon: Scissors },
    completed: { label: 'Completado', color: '#10b981', icon: CheckCircle2 },
    delivered: { label: 'Entregado', color: '#6366f1', icon: Truck },
};

export const ProjectsView: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await ProjectService.getAll();
            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
        try {
            const { error } = await ProjectService.update(projectId, { status: newStatus });
            if (error) throw error;

            // Update local state
            setProjects(prev => prev.map(p =>
                p.id === projectId ? { ...p, status: newStatus } : p
            ));
        } catch (error) {
            console.error('Error updating project status:', error);
            alert('No se pudo actualizar el estado del proyecto.');
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesStatus = filter === 'all' || project.status === filter;
        const matchesSearch = (project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.clients?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    if (loading && projects.length === 0) {
        return (
            <div className={styles.loadingWrapper}>
                <Loader2 size={40} className={styles.animateSpin} />
                <p>Cargando todos tus hermosos proyectos...</p>
            </div>
        );
    }

    return (
        <motion.div
            className={styles.container}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <header className={styles.header}>
                <motion.div className="view-title-section" variants={itemVariants}>
                    <div className="view-breadcrumb">
                        <FileText size={18} />
                        <span>Gestión de Trabajos</span>
                    </div>
                    <h1 className="view-title">Proyectos / Entregas</h1>
                    <p className="view-subtitle">Administra los estados de tus confecciones y arreglos.</p>
                </motion.div>

                <div className={styles.filtersWrapper}>
                    <div className={styles.filters}>
                        <button
                            className={`${styles.filterButton} ${filter === 'all' ? styles.filterActive : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            Todos
                        </button>
                        {(Object.keys(statusLabels) as ProjectStatus[]).map((s) => (
                            <button
                                key={s}
                                className={`${styles.filterButton} ${filter === s ? styles.filterActive : ''}`}
                                onClick={() => setFilter(s)}
                            >
                                {statusLabels[s].label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.searchBar}>
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por proyecto o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {filteredProjects.length > 0 ? (
                    <motion.div
                        key="projects-grid"
                        className={styles.projectsGrid}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {filteredProjects.map((project) => {
                            const status = project.status as ProjectStatus;
                            const StatusIcon = statusLabels[status]?.icon || Clock;

                            return (
                                <motion.div
                                    key={project.id}
                                    className={styles.projectCard}
                                    variants={itemVariants}
                                    layout
                                >
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.projectTitle}>{project.title}</h3>
                                        <span className={styles.typeBadge}>
                                            {project.type === 'confection' ? 'Confección' : 'Arreglo'}
                                        </span>
                                    </div>

                                    <div className={styles.clientInfo}>
                                        <User size={16} />
                                        <span className={styles.clientName}>{project.clients?.full_name}</span>
                                    </div>

                                    <div className={styles.details}>
                                        <div className={styles.detailItem}>
                                            <Calendar size={14} />
                                            <span>Creado: {formatDate(project.created_at)}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <FileText size={14} />
                                            <span>Presupuesto: {formatCurrency(project.total_cost || 0)}</span>
                                        </div>
                                        {project.deposit > 0 && (
                                            <div className={styles.detailItem}>
                                                <CheckCircle2 size={14} />
                                                <span>Pagado: {formatCurrency(project.deposit)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.statusSection}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <StatusIcon size={16} color={statusLabels[status]?.color} />
                                            <span className={styles.statusLabel}>{statusLabels[status]?.label}</span>
                                        </div>

                                        <select
                                            className={styles.statusSelect}
                                            value={project.status}
                                            onChange={(e) => handleStatusChange(project.id, e.target.value as ProjectStatus)}
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="in_progress">En Proceso</option>
                                            <option value="completed">Completado</option>
                                            <option value="delivered">Entregado</option>
                                        </select>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty-state"
                        className={styles.emptyState}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <p>No se encontraron proyectos con esos criterios.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
