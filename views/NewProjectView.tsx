import React, { useState } from 'react';
import { PlusCircle, Ruler, FileText, X } from 'lucide-react';
import styles from './NewProjectView.module.css';
import { ProjectForm } from '../components/ProjectForm';
import { AlterationsView } from './AlterationsView';

export const NewProjectView: React.FC = () => {
    const [projectType, setProjectType] = useState<'confection' | 'alteration'>('confection');

    return (
        <div className={styles.newProjectContainer}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.breadcrumb}>
                        <PlusCircle size={18} />
                        <span>Inicio de Trabajo</span>
                    </div>
                    <h1 className={styles.title}>Nuevo Proyecto</h1>
                    <div className={styles.clientInfo}>
                        <div className={styles.clientDot}></div>
                        <span>Cliente: <span className={styles.clientName}>Maria Gonzalez</span></span>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    <button className={styles.cancelButton}>Cancelar</button>
                    <button className={styles.createButton}>
                        <FileText size={18} />
                        Crear Proyecto
                    </button>
                </div>
            </header>

            <div className={styles.typeSelector}>
                <div
                    className={`${styles.typeCard} ${projectType === 'confection' ? styles.typeCardActive : styles.typeCardInactive}`}
                    onClick={() => setProjectType('confection')}
                >
                    {projectType === 'confection' && <div className={styles.checkIcon}><PlusCircle size={20} fill="currentColor" color="white" /></div>}
                    <div className={`${styles.iconWrapper} ${projectType !== 'confection' ? styles.iconWrapperSecondary : ''}`}>
                        <Ruler size={24} />
                    </div>
                    <h3 className={styles.typeTitle}>Confección a Medida</h3>
                    <p className={styles.typeDescription}>Creación de prendas desde cero. Incluye toma de medidas completa y pruebas.</p>
                </div>

                <div
                    className={`${styles.typeCard} ${projectType === 'alteration' ? styles.typeCardActive : styles.typeCardInactive}`}
                    onClick={() => setProjectType('alteration')}
                >
                    {projectType === 'alteration' && <div className={styles.checkIcon}><PlusCircle size={20} fill="currentColor" color="white" /></div>}
                    <div className={`${styles.iconWrapper} ${projectType !== 'alteration' ? styles.iconWrapperSecondary : ''}`}>
                        <PlusCircle size={24} />
                    </div>
                    <h3 className={styles.typeTitle}>Arreglo / Compostura</h3>
                    <p className={styles.typeDescription}>Modificaciones a prendas existentes. Ajustes de talla, ruedos y reparaciones.</p>
                </div>
            </div>

            {projectType === 'confection' ? (
                <ProjectForm projectType={projectType} />
            ) : (
                <AlterationsView />
            )}
        </div>
    );
};
