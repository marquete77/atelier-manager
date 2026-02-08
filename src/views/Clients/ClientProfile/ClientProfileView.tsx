import React, { useState } from 'react';
import {
    MessageCircle, Phone, Calendar, Plus, Mail, MapPin,
    Wallet, Ruler, RefreshCw, History, Check, Scissors
} from 'lucide-react';
import { ViewState } from '../../../../types';
import styles from './ClientProfileView.module.css';

interface ClientProfileViewProps {
    onChangeView?: (view: ViewState) => void;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({ onChangeView }) => {
    // Mock data based on the provided HTML reference
    const client = {
        name: "Maria Gonzalez",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuChHNWqN-6cXjarD2WhdeFGgMNcvyq64VAysRk2FrUIaMDqNwPzdEKiIrDbaQK8QeGYOSkchZ4fjsXEBZLm9tOk8eS6_wH16vRiBJWZE2apdpdfhKZGIWRcbSxG7U-3S4vIZvO1zz2x6yQhwtrGvgRQhxuvebous33ZNR0cyF-YExFpdPPwB3Mn8H6Ez40THudNU0f11k5DI1-cB5ZhoaMDcsZ5HCSKG6zl1zu-Us2y6c6UALtceNZQpmap5E4qQld6p_pAzV4c9QI",
        email: "m.gonzalez@email.com",
        address: "Calle de la Seda 12, apto 4B",
        balance: 25,
        notes: "Prefiere telas naturales como el lino y la seda. Tiene una postura ligeramente cargada hacia adelante en el hombro derecho.",
        measures: {
            busto: 92,
            cintura: 68,
            cadera: 98,
            talleDelantero: 44,
            espalda: 38,
            largoTotal: 105,
            sisa: 42,
            brazo: 30
        },
        projects: [
            {
                id: 1,
                title: "Vestido seda azul",
                status: "Entregado",
                date: "Terminado el 15 de Oct, 2023",
                price: 180.00,
                type: "confection"
            },
            {
                id: 2,
                title: "Blusa de Encaje",
                status: "En Proceso",
                date: "Segunda prueba: 20 de Nov",
                price: 95.00,
                type: "confection"
            },
            {
                id: 3,
                title: "Falda sastre gris",
                status: "Entregado",
                date: "Entregado el 5 de Sept, 2023",
                price: 120.00,
                type: "confection"
            }
        ]
    };

    const StatusIcon = ({ status }: { status: string }) => {
        if (status === 'Entregado') return <Check size={14} />;
        return <Scissors size={14} />;
    };

    return (
        <div className={styles.profileContainer}>

            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.profileInfo}>
                    <div className={styles.profileAvatarWrapper}>
                        <div className={styles.avatar}>
                            <img
                                src={client.avatarUrl}
                                alt={client.name}
                                className={styles.avatarImg}
                            />
                        </div>
                        <div className={styles.nameSection}>
                            <h1 className={styles.clientName}>{client.name}</h1>
                            <div className={styles.contactActions}>
                                <a href="#" className={`${styles.contactLink} ${styles.whatsappLink}`}>
                                    <MessageCircle size={18} /> WhatsApp
                                </a>
                                <a href="#" className={`${styles.contactLink} ${styles.callLink}`}>
                                    <Phone size={18} /> Llamar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.headerButtons}>
                    <button className={`${styles.actionButton} ${styles.secondaryButton}`}>
                        <Calendar size={20} />
                        Nueva Cita
                    </button>
                    <button
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                        onClick={() => onChangeView?.('new-project')}
                    >
                        <Plus size={20} />
                        Nuevo Proyecto
                    </button>
                </div>
            </div>

            <div className={styles.gridContainer}>

                {/* Sidebar: Contact & Notes */}
                <div className={styles.sidebar}>
                    <section className={styles.card}>
                        <h3 className={styles.cardTitle}>Información de Contacto</h3>
                        <div className={styles.contactList}>
                            <div className={styles.contactItem}>
                                <Mail size={20} className={styles.contactIcon} />
                                <div>
                                    <p className={styles.contactLabel}>Correo Electrónico</p>
                                    <p className={styles.contactValue}>{client.email}</p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <MapPin size={20} className={styles.contactIcon} />
                                <div>
                                    <p className={styles.contactLabel}>Dirección</p>
                                    <p className={styles.contactValue}>{client.address}</p>
                                </div>
                            </div>

                            <div className={styles.balanceCard}>
                                <div className={styles.balanceLabel}>
                                    <Wallet size={20} />
                                    <span>Saldo Pendiente:</span>
                                </div>
                                <span className={styles.balanceValue}>${client.balance}</span>
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardTitle}>
                            <span>Notas Generales</span>
                            <button className={styles.editLink}>Editar</button>
                        </div>
                        <p className={styles.notesText}>
                            "{client.notes}"
                        </p>
                    </section>
                </div>

                {/* Main Content: Measures & History */}
                <div className={styles.mainContent}>

                    {/* Measurements Section */}
                    <section className={styles.mainCard}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionTitleGroup}>
                                <div className={styles.sectionIconWrapper}>
                                    <Ruler size={24} />
                                </div>
                                <h2 className={styles.sectionMainTitle}>Medidas Base</h2>
                            </div>
                            <div className={styles.sectionActions}>
                                <span className={styles.lastUpdate}>Última actualización: hace 3 meses</span>
                                <button className={styles.refreshButton}>
                                    <RefreshCw size={18} />
                                    Actualizar Medidas
                                </button>
                            </div>
                        </div>

                        <div className={styles.measuresGrid}>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Busto</p>
                                <p className={styles.measureValue}>{client.measures.busto} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Cintura</p>
                                <p className={styles.measureValue}>{client.measures.cintura} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Cadera</p>
                                <p className={styles.measureValue}>{client.measures.cadera} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Talle Del.</p>
                                <p className={styles.measureValue}>{client.measures.talleDelantero} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Espalda</p>
                                <p className={styles.measureValue}>{client.measures.espalda} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Largo Total</p>
                                <p className={styles.measureValue}>{client.measures.largoTotal} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Sisa</p>
                                <p className={styles.measureValue}>{client.measures.sisa} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                            <div className={styles.measureItem}>
                                <p className={styles.measureLabel}>Brazo</p>
                                <p className={styles.measureValue}>{client.measures.brazo} <span className={styles.measureUnit}>cm</span></p>
                            </div>
                        </div>
                    </section>

                    {/* Project History */}
                    <section className={styles.timeline}>
                        <div className={styles.sectionTitleGroup}>
                            <div className={styles.historyIconWrapper}>
                                <History size={24} />
                            </div>
                            <h2 className={styles.sectionMainTitle}>Historial de Proyectos</h2>
                        </div>

                        {client.projects.map((project, index) => (
                            <div key={project.id} className={styles.timelineItem}>
                                <div className={`${styles.timelineIconWrapper} ${project.status === 'Entregado' ? styles.timelineIconActive : ''}`}>
                                    <span className={styles.timelineIcon}>
                                        <StatusIcon status={project.status} />
                                    </span>
                                </div>
                                <div className={styles.timelineCard}>
                                    <div className={styles.timelineHeader}>
                                        <div className={styles.timelineTitle}>{project.title}</div>
                                        <span className={`${styles.statusBadge} ${project.status === 'Entregado' ? styles.statusDelivered : styles.statusProcess}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className={styles.timelineDetails}>
                                        <p>{project.date}</p>
                                        <p className={styles.timelinePrice}>${project.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                </div>
            </div>
        </div>
    );
};
