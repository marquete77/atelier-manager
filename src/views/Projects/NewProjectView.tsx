import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle, Ruler, FileText, X, Camera,
    Calendar, Users, Info, Loader2, DollarSign
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ClientService } from '../../services/client.service';
import { ProjectService } from '../../services/project.service';
import { AlterationService } from '../../services/alteration.service';
import { AppointmentService } from '../../services/appointment.service';
import { Client } from '../../types';
import { ConfectionForm } from '../../components/forms/ConfectionForm/ConfectionForm';
import { AlterationsDetails, AlterationsSummary } from '../../components/forms/AlterationsForm/AlterationsForm';
import styles from './NewProjectView.module.css';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const budgetVariants = {
    hidden: { opacity: 0, x: 20 },
    show: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    }
};

interface BudgetCardProps {
    totalCost: number;
    setTotalCost: (val: number) => void;
    advance: number;
    setAdvance: (val: number) => void;
    balance: number;
    isBalanceAnimating: boolean;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
    totalCost,
    setTotalCost,
    advance,
    setAdvance,
    balance,
    isBalanceAnimating
}) => {
    return (
        <div className={styles.budgetCardContent}>
            <h3 className={styles.budgetTitle}>Presupuesto Estimado</h3>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Costo Total</label>
                <div className={styles.relative}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                        type="number"
                        className={`${styles.input} ${styles.inputWithIcon}`}
                        value={totalCost || ''}
                        onChange={(e) => setTotalCost(Number(e.target.value))}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Anticipo / Pagado</label>
                <div className={styles.relative}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                        type="number"
                        className={`${styles.input} ${styles.inputWithIcon}`}
                        value={advance || ''}
                        onChange={(e) => setAdvance(Number(e.target.value))}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className={styles.budgetRow}>
                <span>Subtotal</span>
                <span>${totalCost.toFixed(2)}</span>
            </div>
            <div className={styles.budgetRow}>
                <span>Descuento</span>
                <span>-$0.00</span>
            </div>

            <div className={`${styles.budgetRow} ${styles.total}`}>
                <span>Total del Proyecto</span>
                <span>${totalCost.toFixed(2)}</span>
            </div>

            <motion.div
                className={styles.balanceHighlight}
                animate={isBalanceAnimating ? { scale: 1.02, backgroundColor: "rgba(178, 91, 82, 0.1)" } : { scale: 1, backgroundColor: "rgba(178, 91, 82, 0.05)" }}
            >
                <span className={styles.balanceLabel}>Saldo Pendiente</span>
                <motion.div
                    className={styles.balanceValue}
                    key={balance}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className={`${styles.textXl} ${styles.mr1}`}>$</span>
                    {balance.toFixed(2)}
                </motion.div>
            </motion.div>

            <p className={styles.disclaimer}>
                * El saldo se actualizará automáticamente al crear el proyecto.
            </p>
        </div>
    );
};

export const NewProjectView: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [client, setClient] = useState<Client | null>(null);
    const [projectType, setProjectType] = useState<'confection' | 'alteration'>('confection');
    const [totalCost, setTotalCost] = useState<number>(0);
    const [advance, setAdvance] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [isBalanceAnimating, setIsBalanceAnimating] = useState(false);

    // Detailed form data
    const [confectionData, setConfectionData] = useState({ title: '', deadline: '', description: '', images: [] as string[] });
    const [alterationData, setAlterationData] = useState({ count: 0, garment: 'pantalon', tasks: [] as any[], notes: '', deadline: '' });

    const balance = totalCost - advance;

    // Load dynamic client
    useEffect(() => {
        if (clientId) {
            ClientService.getById(clientId).then(({ data }) => {
                if (data) setClient(data as Client);
            });
        }
    }, [clientId]);

    // Trigger animation when balance changes
    useEffect(() => {
        setIsBalanceAnimating(true);
        const timer = setTimeout(() => setIsBalanceAnimating(false), 300);
        return () => clearTimeout(timer);
    }, [balance]);

    const handleCreateProject = async () => {
        if (!clientId || !user) {
            alert('No se pudo identificar el cliente o el usuario autenticado.');
            return;
        }
        setLoading(true);

        try {
            const projectTitle = projectType === 'confection'
                ? (confectionData.title || `Confección - ${client?.full_name}`)
                : `Arreglo ${alterationData.garment} - ${client?.full_name}`;

            const deadline = projectType === 'confection' ? confectionData.deadline : alterationData.deadline;

            const projectInsertData = {
                client_id: clientId,
                user_id: user.id,
                title: projectTitle,
                description: projectType === 'confection' ? confectionData.description : alterationData.notes,
                status: 'pending',
                total_cost: totalCost,
                deposit: advance,
                type: projectType,
                images: projectType === 'confection' ? confectionData.images : [],
                is_paid: false
            };

            console.log('🚀 Iniciando creación de proyecto:', projectInsertData);

            const { data: project, error: projectError } = await ProjectService.create(projectInsertData as any);

            if (projectError) {
                console.error('Supabase Project Error:', projectError);
                throw projectError;
            }

            console.log('✅ Proyecto creado exitosamente:', project);

            // 1. If it's an alteration, save specific details
            if (projectType === 'alteration') {
                const { error: altError } = await AlterationService.create({
                    project_id: project.id,
                    user_id: user.id,
                    garment_type: alterationData.garment,
                    tasks: alterationData.tasks,
                    notes: alterationData.notes
                });
                if (altError) {
                    console.error('Supabase Alteration Error:', altError);
                    throw altError;
                }
            }

            // 2. Automagically create a Delivery Appointment in the Agenda
            if (deadline) {
                // Set delivery at 9:00 AM of the deadline date
                const startTime = `${deadline}T09:00:00Z`;
                const endTime = `${deadline}T10:00:00Z`;

                const appointmentData = {
                    user_id: user.id,
                    client_id: clientId,
                    project_id: project.id,
                    title: `Entrega: ${projectTitle}`,
                    type: 'delivery',
                    start_time: startTime,
                    end_time: endTime,
                    status: 'scheduled',
                    notes: `Entrega programada automáticamente al crear el proyecto.`
                };

                console.log('📅 Intentando crear cita automática:', appointmentData);

                const { error: aptError } = await AppointmentService.create(appointmentData);

                if (aptError) {
                    console.error('❌ Error de Supabase al crear cita:', aptError);
                    alert(`El proyecto se creó, pero la cita automática falló: ${aptError.message}`);
                } else {
                    console.log('✅ Cita automática creada correctamente');
                }
            } else {
                console.log('⚠️ No se creó cita: no hay fecha de entrega (deadline)');
            }

            // Redirect back to client profile
            navigate(`/clients/${clientId}`);
        } catch (error: any) {
            console.error('Error creating project:', error);
            alert(`Error al crear el proyecto: ${error.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className={styles.newProjectContainer}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <header className={styles.viewHeader}>
                <motion.div className={styles.viewTitleSection} variants={itemVariants}>
                    <div className={styles.viewBreadcrumb}>
                        <PlusCircle size={18} />
                        <span>Inicio de Trabajo</span>
                    </div>
                    <h1 className={styles.viewTitle}>Nuevo Proyecto</h1>
                    <div className={styles.clientInfo}>
                        <div className={styles.clientDot}></div>
                        <span>Cliente: <span className={styles.clientName}>{client?.full_name || 'Cargando...'}</span></span>
                    </div>
                </motion.div>

                <motion.div className={styles.headerActions} variants={itemVariants}>
                    <button className={styles.cancelButton}>Cancelar</button>
                    <motion.button
                        className={styles.createButton}
                        onClick={handleCreateProject}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className={styles.animateSpin} />
                                <span>Creando...</span>
                            </>
                        ) : (
                            <>
                                <FileText size={18} />
                                <span>Crear Proyecto</span>
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </header>

            {/* Type Selector */}
            <motion.div className={styles.typeSelector} variants={itemVariants}>
                <motion.div
                    className={`${styles.typeCard} ${projectType === 'confection' ? styles.typeCardActive : styles.typeCardInactive}`}
                    onClick={() => setProjectType('confection')}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                >
                    {projectType === 'confection' && (
                        <motion.div
                            className={styles.checkIcon}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <PlusCircle size={20} fill="currentColor" color="white" />
                        </motion.div>
                    )}
                    <div className={`${styles.iconWrapper} ${projectType !== 'confection' ? styles.iconWrapperSecondary : ''}`}>
                        <Ruler size={24} />
                    </div>
                    <h3 className={styles.typeTitle}>Confección a Medida</h3>
                    <p className={styles.typeDescription}>Creación de prendas desde cero. Incluye toma de medidas completa y pruebas.</p>
                </motion.div>

                <motion.div
                    className={`${styles.typeCard} ${projectType === 'alteration' ? styles.typeCardActive : styles.typeCardInactive}`}
                    onClick={() => setProjectType('alteration')}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                >
                    {projectType === 'alteration' && (
                        <motion.div
                            className={styles.checkIcon}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <PlusCircle size={20} fill="currentColor" color="white" />
                        </motion.div>
                    )}
                    <div className={`${styles.iconWrapper} ${projectType !== 'alteration' ? styles.iconWrapperSecondary : ''}`}>
                        <PlusCircle size={24} />
                    </div>
                    <h3 className={styles.typeTitle}>Arreglo / Compostura</h3>
                    <p className={styles.typeDescription}>Modificaciones a prendas existentes. Ajustes de talla, ruedos y reparaciones.</p>
                </motion.div>
            </motion.div>

            {/* Main Bilateral Layout */}
            <div className={styles.mainLayout}>
                <AnimatePresence mode="wait">
                    {projectType === 'confection' ? (
                        <React.Fragment key="confection">
                            {/* Left Side: Form Details */}
                            <motion.div
                                className={styles.formColumn}
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <ConfectionForm onDataChange={(data) => {
                                    setConfectionData(data);
                                }} />
                            </motion.div>

                            {/* Right Side: Budget Summary */}
                            <motion.div
                                className={styles.budgetCard}
                                variants={budgetVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <BudgetCard
                                    totalCost={totalCost}
                                    setTotalCost={setTotalCost}
                                    advance={advance}
                                    setAdvance={setAdvance}
                                    balance={balance}
                                    isBalanceAnimating={isBalanceAnimating}
                                />
                            </motion.div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment key="alteration">
                            {/* Left Side: Alteration Details */}
                            <motion.div
                                className={styles.formColumn}
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <AlterationsDetails
                                    onDataChange={(data) => {
                                        setTotalCost(data.total);
                                        setAlterationData(prev => ({
                                            ...prev,
                                            count: data.count,
                                            garment: data.garment,
                                            tasks: data.tasks,
                                            notes: data.notes
                                        }));
                                    }}
                                />
                            </motion.div>

                            {/* Right Side: Alteration Summary */}
                            <motion.div
                                className={styles.formColumn} // Use same column class for consistency
                                variants={budgetVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <AlterationsSummary
                                    selectedGarment={alterationData.garment}
                                    tasksCount={alterationData.count}
                                    totalCost={totalCost}
                                    deadline={alterationData.deadline}
                                    onDeadlineChange={(date) => setAlterationData(prev => ({ ...prev, deadline: date }))}
                                />
                            </motion.div>
                        </React.Fragment>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
