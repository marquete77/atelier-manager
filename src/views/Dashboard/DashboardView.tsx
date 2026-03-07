import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  TrendingUp,
  Clock,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from '@/utils/currency';
import { containerVariants, itemVariants, listVariants } from '@/constants/animations';
import { useDashboardData } from '@/hooks/useDashboardData';
import styles from './DashboardView.module.css';

// Modular Components
import { AppointmentItem } from './components/AppointmentItem/AppointmentItem';
import { ProjectCard } from './components/ProjectCard/ProjectCard';
import { StatCard } from '@/components/common/StatCard/StatCard';

interface AppointmentEntry {
  id: string;
  start_time: string;
  type: string;
  status: string;
  clients: {
    full_name: string;
  };
}

interface ProjectEntry {
  id: string;
  title: string;
  status: string;
  images: string[] | null;
  deliveryDate?: string;
  clients: {
    full_name: string;
  };
}


export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { stats, recentAppointments, recentProjects, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-50">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>Cargando panel...</p>
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
      <motion.header className="view-header" variants={itemVariants}>
        <div className="view-title-section">
          <div className="view-breadcrumb">
            <TrendingUp size={18} />
            <span>Panel de Control</span>
          </div>
          <h1 className="view-title">Resumen del Día</h1>
          <p className="view-subtitle">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </motion.header>

      <motion.div className={styles.statsGrid} variants={listVariants}>
        <StatCard
          label="Citas para hoy"
          value={stats.appointmentsToday.toString()}
          icon={CalendarIcon}
          badge="Hoy"
          colorScheme="blue"
          onClick={() => navigate('/calendar')}
        />
        <StatCard
          label="Entregas Pendientes"
          value={stats.pendingDeliveries.toString()}
          icon={Clock}
          badge="Pendientes"
          colorScheme="orange"
          onClick={() => navigate('/projects')}
        />
        <StatCard
          label="Ingresos del Mes"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={TrendingUp}
          badge="Meta"
          colorScheme="emerald"
        />
      </motion.div>

      <div className={styles.mainGrid}>
        <motion.section className={styles.section} variants={itemVariants}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Citas Próximas</h2>
            <motion.button
              className={styles.viewAllLink}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/calendar')}
            >
              Ver agenda <ChevronRight size={16} />
            </motion.button>
          </div>
          <motion.div className={styles.cardContainer} variants={listVariants}>
            {recentAppointments.length > 0 ? recentAppointments.map((apt) => (
              <AppointmentItem key={apt.id} apt={apt} />
            )) : (
              <div className="p-8 text-center text-gray-400">No hay citas programadas</div>
            )}
          </motion.div>
        </motion.section>

        <motion.section className={styles.section} variants={itemVariants}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Proyectos Recientes</h2>
            <motion.button
              className={styles.viewAllLink}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/clients')}
            >
              Ver todos <ChevronRight size={16} />
            </motion.button>
          </div>
          <motion.div className={styles.projectsList} variants={listVariants}>
            {recentProjects.length > 0 ? recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            )) : (
              <div className="p-8 text-center text-gray-400">No hay proyectos activos</div>
            )}
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  );
};
