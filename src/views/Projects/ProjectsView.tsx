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
    ArrowLeft,
    HelpCircle
} from 'lucide-react';
import { ProjectService } from '@/services/project.service';
import { useAuth } from '@/hooks/useAuth';
import { useProjectStatuses } from '@/hooks/useProjectStatuses';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { containerVariants, itemVariants } from '@/constants/animations';
import styles from './ProjectsView.module.css';

type ProjectStatus = string;

export const ProjectsView: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const { statuses, getStatusIcon, getStatusInfo, STATUS_ORDER, loading: statusesLoading } = useProjectStatuses();

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
            console.log('--- DATA DESDE LA API (Proyectos) ---');
            console.log(data);
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
        const matchesStatus = filter === 'all' || String(project.status) === String(filter);
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm ||
            (project.title?.toLowerCase().includes(searchLower) ||
                (project.clients?.full_name && String(project.clients.full_name).toLowerCase().includes(searchLower)));
        return matchesStatus && matchesSearch;
    });

    // Logging whenever the filter changes
    useEffect(() => {
        console.log('--- ESTADO DE FILTRADO LOCAL ---');
        console.log('Filtro actual:', filter);
        console.log('Proyectos totales:', projects.length);
        console.log('Proyectos filtrados:', filteredProjects.length);
        if (filteredProjects.length === 0 && projects.length > 0) {
            console.log('Estados disponibles en los proyectos actuales:', [...new Set(projects.map(p => p.status))]);
        }
    }, [filter, projects, filteredProjects.length]);

    if ((loading || statusesLoading) && projects.length === 0) {
        return (
            <div className={styles.loadingWrapper}>
                <Loader2 size={40} className={styles.animateSpin} />
                <p>Cargando tus hermosos proyectos...</p>
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
                        {statuses.map((s) => (
                            <button
                                key={s.id}
                                className={`${styles.filterButton} ${filter === s.id ? styles.filterActive : ''}`}
                                onClick={() => setFilter(s.id)}
                            >
                                {s.label}
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

            <div className={styles.gridContainer}>
                <AnimatePresence mode="popLayout">
                    {filteredProjects.length > 0 ? (
                        <motion.div
                            key={filter} // Forces remount and animation when filter changes
                            className={styles.projectsGrid}
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                        >
                            {filteredProjects.map((project) => {
                                const status = project.status as ProjectStatus;
                                const statusInfo = getStatusInfo(status);
                                const StatusIcon = getStatusIcon(status);

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
                                                <StatusIcon size={16} color={statusInfo?.color || '#94a3b8'} />
                                                <span className={styles.statusLabel}>{statusInfo?.label || 'Sin estado'}</span>
                                            </div>

                                            <select
                                                className={styles.statusSelect}
                                                value={project.status}
                                                onChange={(e) => handleStatusChange(project.id, e.target.value)}
                                            >
                                                {statuses.map((s) => {
                                                    const currentIndex = STATUS_ORDER.indexOf(project.status as ProjectStatus);
                                                    const optionIndex = STATUS_ORDER.indexOf(s.id);
                                                    return (
                                                        <option
                                                            key={s.id}
                                                            value={s.id}
                                                            disabled={optionIndex < currentIndex}
                                                        >
                                                            {s.label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`empty-${filter}`}
                            className={styles.emptyState}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <p>No se encontraron proyectos con esos criterios.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
