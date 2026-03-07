import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
    children: React.ReactNode;
    type?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    variant?: 'filled' | 'outline' | 'ghost';
    className?: string;
    style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    type = 'neutral',
    variant = 'filled',
    className = '',
    style
}) => {
    return (
        <span
            className={`${styles.badge} ${styles[type]} ${styles[variant]} ${className}`}
            style={style}
        >
            {children}
        </span>
    );
};
