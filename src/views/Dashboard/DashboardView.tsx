import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";
import styles from './DashboardView.module.css';

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
  deadline: string;
  clients: {
    full_name: string;
  };
}

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    pendingDeliveries: 0,
    monthlyRevenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<AppointmentEntry[]>([]);
  const [recentProjects, setRecentProjects] = useState<ProjectEntry[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // 1. Appointments Today
      const { count: aptCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('start_time', `${today}T00:00:00`)
        .lte('start_time', `${today}T23:59:59`);

      // 2. Pending Projects
      const { count: projCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['pending', 'in_progress']);

      // 3. Monthly Revenue
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: revenueData } = await supabase
        .from('projects')
        .select('total_cost')
        .eq('user_id', user.id)
        .gte('created_at', firstDayOfMonth);

      const totalRevenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0) || 0;

      setStats({
        appointmentsToday: aptCount || 0,
        pendingDeliveries: projCount || 0,
        monthlyRevenue: totalRevenue
      });

      // 4. Fetch Recent Appointments
      const { data: apts } = await supabase
        .from('appointments')
        .select('id, start_time, type, status, clients(full_name)')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true })
        .limit(4);

      setRecentAppointments(apts as any || []);

      // 5. Fetch Recent Projects
      const { data: projs } = await supabase
        .from('projects')
        .select('id, title, status, deadline, clients(full_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentProjects(projs as any || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-50">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className="view-header">
        <div className="view-title-section">
          <div className="view-breadcrumb">
            <CalendarIcon size={18} />
            <span>Dashboard</span>
          </div>
          <h1 className="view-title">Resumen del Día</h1>
          <p className="view-subtitle">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <StatCard
          label="Citas para hoy"
          value={stats.appointmentsToday.toString()}
          icon={CalendarIcon}
          type="appointments"
        />
        <StatCard
          label="Entregas Pendientes"
          value={stats.pendingDeliveries.toString()}
          icon={Clock}
          type="projects"
        />
        <StatCard
          label="Ingresos del Mes"
          value={`${stats.monthlyRevenue}€`}
          icon={TrendingUp}
          type="revenue"
        />
      </div>

      <div className={styles.mainGrid}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Citas Próximas</h2>
            <button className={styles.viewAllLink}>Ver agenda <ChevronRight size={16} /></button>
          </div>
          <div className={styles.cardContainer}>
            {recentAppointments.length > 0 ? recentAppointments.map((apt) => (
              <AppointmentItem key={apt.id} apt={apt} />
            )) : (
              <div className="p-8 text-center text-gray-400">No hay citas programadas</div>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Proyectos Recientes</h2>
            <button className={styles.viewAllLink}>Ver todos <ChevronRight size={16} /></button>
          </div>
          <div className={styles.projectsList}>
            {recentProjects.length > 0 ? recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            )) : (
              <div className="p-8 text-center text-gray-400">No hay proyectos activos</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, type }: any) => {
  const getColors = () => {
    switch (type) {
      case 'appointments': return { bg: styles.bgBlue50, icon: styles.textBlue600, badge: 'Hoy', badgeBg: styles.bgGreen100, badgeText: styles.textGreen700 };
      case 'projects': return { bg: styles.bgOrange50, icon: styles.textOrange600, badge: 'Pendientes', badgeBg: styles.bgOrange100, badgeText: styles.textOrange700 };
      case 'revenue': return { bg: styles.bgEmerald50, icon: styles.textEmerald600, badge: 'Meta', badgeBg: styles.bgRed100, badgeText: styles.textRed700 };
      default: return { bg: '', icon: '', badge: '', badgeBg: '', badgeText: '' };
    }
  };
  const colors = getColors();

  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={`${styles.statIconWrapper} ${colors.bg} ${colors.icon}`}>
          <Icon size={20} />
        </div>
        <span className={`${styles.statBadge} ${colors.badgeBg} ${colors.badgeText}`}>
          {colors.badge}
        </span>
      </div>
      <p className={styles.statLabel}>{label}</p>
      <h3 className={styles.statValue}>{value}</h3>
    </div>
  );
};

const AppointmentItem = ({ apt }: { apt: AppointmentEntry }) => (
  <div className={styles.appointmentItem}>
    <div className={styles.timeBoxInactive}>
      <span className={styles.timeText}>
        {new Date(apt.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
    <div className={styles.appointmentDetails}>
      <div className={styles.appointmentHeader}>
        <h4 className={styles.clientName}>{apt.clients?.full_name}</h4>
        <span className={styles.appointmentTypeBadge}>{apt.type}</span>
      </div>
      <p className={styles.appointmentStatus}>{apt.status}</p>
    </div>
  </div>
);

const ProjectCard = ({ project }: { project: ProjectEntry }) => (
  <div className={styles.projectCard}>
    <div className={styles.projectInfo}>
      <div className={styles.projectHeader}>
        <h4 className={styles.projectName}>{project.title}</h4>
        <span className={styles.projectStatusBadge}>
          {project.status}
        </span>
      </div>
      <p className={styles.projectClient}>Cliente: {project.clients?.full_name}</p>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: project.status === 'delivered' ? '100%' : '60%' }}
        ></div>
      </div>
    </div>
  </div>
);