import React from 'react';
import { Calendar, Package, DollarSign, ChevronRight } from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_PROJECTS } from '../constants';
import styles from './DashboardView.module.css';

export const DashboardView: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Resumen del Día</h1>
        <p className={styles.subtitle}>Martes, 24 de Octubre</p>
      </header>

      {/* Stats Row */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={Calendar}
          label="Citas Hoy"
          value="4"
          badge="+2 hoy"
          badgeColor={`${styles.bgGreen100} ${styles.textGreen700}`}
          iconColor={`${styles.textBlue600} ${styles.bgBlue50}`}
        />
        <StatCard
          icon={Package}
          label="Entregas Pendientes"
          value="2"
          badge="! Urgente"
          badgeColor={`${styles.bgOrange100} ${styles.textOrange700}`}
          iconColor={`${styles.textOrange600} ${styles.bgOrange50}`}
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos Mes"
          value="$1,250"
          badge="-5% vs. mes pasado"
          badgeColor={`${styles.bgRed100} ${styles.textRed700}`}
          iconColor={`${styles.textEmerald600} ${styles.bgEmerald50}`}
        />
      </div>

      <div className={styles.mainGrid}>
        {/* Appointments */}
        <div className={styles.column}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Citas de hoy</h3>
            <button className={styles.viewAllLink}>
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.cardContainer}>
            {MOCK_APPOINTMENTS.map((apt) => (
              <div key={apt.id} className={styles.appointmentItem}>
                <div className={`${styles.timeBox} ${apt.time === '12:30' ? styles.timeBoxActive : styles.timeBoxInactive}`}>
                  <span className={styles.timeText}>{apt.time}</span>
                </div>
                <div className={styles.appointmentDetails}>
                  <div className={styles.appointmentHeader}>
                    <h4 className={styles.clientName}>{apt.clientName}</h4>
                    <span className={styles.appointmentTypeBadge}>{apt.type}</span>
                  </div>
                  <p className={styles.appointmentStatus}>Proyecto en curso</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects/Deliveries */}
        <div className={styles.column}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Próximas Entregas</h3>
            <button className={`${styles.viewAllLink} ${styles.grayLink}`}>
              Ver calendario <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.projectsList}>
            {MOCK_PROJECTS.map((proj) => (
              <div key={proj.id} className={styles.projectCard}>
                <div className={styles.projectImageWrapper}>
                  <img src={proj.imageUrl} alt={proj.name} className={styles.projectImage} />
                </div>
                <div className={styles.projectInfo}>
                  <div className={styles.projectHeader}>
                    <h4 className={styles.projectName}>{proj.name}</h4>
                    <span className={`${styles.projectStatusBadge} ${proj.status === 'Prueba' ? styles.statusPrueba : styles.statusEntrega}`}>
                      {proj.status}
                    </span>
                  </div>
                  <p className={styles.projectClient}>Cliente: {proj.clientName}</p>
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBar}
                      style={{ width: proj.status === 'Prueba' ? '80%' : '40%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, badge, badgeColor, iconColor }: any) => (
  <div className={styles.statCard}>
    <div className={styles.statHeader}>
      <div className={`${styles.statIconWrapper} ${iconColor}`}>
        <Icon size={20} />
      </div>
      <span className={`${styles.statBadge} ${badgeColor}`}>
        {badge}
      </span>
    </div>
    <p className={styles.statLabel}>{label}</p>
    <h3 className={styles.statValue}>{value}</h3>
  </div>
);