import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { itemVariants } from '@/constants/animations';
import styles from './StatCard.module.css';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    badge?: string;
    badgeType?: 'success' | 'warning' | 'error' | 'info';
    colorScheme?: 'blue' | 'orange' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon: Icon,
    badge,
    colorScheme = 'blue'
}) => {
    const getSchemeStyles = () => {
        switch (colorScheme) {
            case 'blue': return { bg: styles.bgBlue50, text: styles.textBlue600, badgeBg: styles.bgGreen100, badgeText: styles.textGreen700 };
            case 'orange': return { bg: styles.bgOrange50, text: styles.textOrange600, badgeBg: styles.bgOrange100, badgeText: styles.textOrange700 };
            case 'emerald': return { bg: styles.bgEmerald50, text: styles.textEmerald600, badgeBg: styles.bgRed100, badgeText: styles.textRed700 };
            default: return { bg: '', text: '', badgeBg: '', badgeText: '' };
        }
    };

    const colors = getSchemeStyles();

    return (
        <motion.div
            className={styles.statCard}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <div className={styles.statHeader}>
                <div className={`${styles.statIconWrapper} ${colors.bg} ${colors.text}`}>
                    <Icon size={20} />
                </div>
                {badge && (
                    <span className={`${styles.statBadge} ${colors.badgeBg} ${colors.badgeText}`}>
                        {badge}
                    </span>
                )}
            </div>
            <p className={styles.statLabel}>{label}</p>
            <h3 className={styles.statValue}>{value}</h3>
        </motion.div>
    );
};
