import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {Icon && <Icon size={size === 'sm' ? 16 : 18} sx={{ marginRight: children ? '0.5rem' : '0' }} />}
            {children}
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader} />
                </div>
            )}
        </motion.button>
    );
};
