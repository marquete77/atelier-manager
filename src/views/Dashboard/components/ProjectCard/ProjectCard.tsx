import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { getUrgencyLabel } from '@/utils/date';
import { itemVariants } from '@/constants/animations';
import { Badge } from '@/components/common/Badge/Badge';
import styles from './ProjectCard.module.css';

interface ProjectEntry {
    id: string;
    title: string;
    status: string;
    images: string[] | null;
    deliveryDate?: string;
    clients: {
        full_name: string;
    };
    client_id?: string;
}

interface ProjectCardProps {
    project: ProjectEntry;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const navigate = useNavigate();

    const urgency = getUrgencyLabel(project.deliveryDate);
    const firstImage = project.images && project.images.length > 0 ? project.images[0] : null;

    const phases = ['Diseño', 'Corte', 'Costura', 'Entrega'];
    const getPhaseIndex = (status: string) => {
        switch (status) {
            case 'pending': return 0;
            case 'in_progress': return 2;
            case 'completed': return 3;
            case 'delivered': return 4;
            default: return 0;
        }
    };

    const activePhase = getPhaseIndex(project.status || 'pending');

    return (
        <motion.div
            className={styles.projectCard}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            onClick={() => navigate(`/clients/${project.id ? (project as any).client_id || '' : ''}`)}
        >
            <div className={styles.projectImageContainer}>
                {firstImage ? (
                    <img src={firstImage} alt={project.title} className={styles.projectImage} />
                ) : (
                    <div className={styles.projectPlaceholder}>
                        <FileText size={24} className="text-gray-300" />
                    </div>
                )}
            </div>

            <div className={styles.projectInfo}>
                <div className={styles.projectHeader}>
                    <h4 className={styles.projectName}>{project.title}</h4>
                    {urgency && (
                        <Badge
                            type={urgency.type === 'today' ? 'error' : urgency.type === 'tomorrow' ? 'warning' : 'info'}
                            variant="filled"
                        >
                            {urgency.label}
                        </Badge>
                    )}
                </div>
                <p className={styles.projectClient}>Cliente: {project.clients?.full_name}</p>

                <div className={styles.stepperContainer}>
                    <div className={styles.stepperTrack}>
                        <div
                            className={styles.stepperProgress}
                            style={{ width: `${(Math.min(activePhase, 3) / 3) * 100}%` }}
                        />
                    </div>
                    <div className={styles.stepperPoints}>
                        {phases.map((phase, idx) => (
                            <div key={phase} className={styles.stepperStep}>
                                <div className={`${styles.stepPoint} ${idx <= activePhase ? styles.stepActive : ''}`} />
                                <span className={`${styles.stepLabel} ${idx === activePhase ? styles.labelActive : ''}`}>
                                    {phase}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
