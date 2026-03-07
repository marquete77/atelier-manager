import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { getUrgencyLabel } from '@/utils/date';
import { itemVariants } from '@/constants/animations';
import { Badge } from '@/components/common/Badge/Badge';
import { useProjectStatuses } from '@/hooks/useProjectStatuses';
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
    onClick?: (project: ProjectEntry) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    const navigate = useNavigate();
    const { statuses, STATUS_ORDER } = useProjectStatuses();

    const urgency = getUrgencyLabel(project.deliveryDate);
    const firstImage = project.images && project.images.length > 0 ? project.images[0] : null;

    const activePhase = STATUS_ORDER.indexOf(project.status || 'pending');

    return (
        <motion.div
            className={styles.projectCard}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            onClick={() => onClick?.(project)}
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
                        {statuses.map((status, idx) => (
                            <div key={status.id} className={styles.stepperStep}>
                                <div className={`${styles.stepPoint} ${idx <= activePhase ? styles.stepActive : ''}`} />
                                <span className={`${styles.stepLabel} ${idx === activePhase ? styles.labelActive : ''}`}>
                                    {status.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
