import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Moon,
  Calendar,
  LayoutGrid,
  LayoutList,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_CLIENTS } from '../../constants';
import styles from './CalendarView.module.css';
import { AppointmentModal } from './AppointmentModal/AppointmentModal';
import { NewAppointmentModal } from './NewAppointmentModal/NewAppointmentModal';

interface Appointment {
  id: string;
  clientName: string;
  clientId: string;
  type: string;
  date: string;
  time: string;
}

export const CalendarView: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<{ date: string, time: string } | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState(7); // Día seleccionado
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState('mensual');

  const daysLabels = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  const mobileDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const mobileDates = [5, 6, 7, 8, 9, 10, 11];

  // Helper for card labels/colors in Desktop Month View
  const getCategoryColor = (type: string) => {
    if (type.includes('Prueba')) return '#B25B52';
    if (type.includes('Medida') || type.includes('Medición')) return '#60A5FA';
    if (type.includes('Entrega')) return '#4CAF50';
    return '#FACC15'; // Consultas
  };

  const getCategoryBg = (type: string) => {
    if (type.includes('Prueba')) return '#FDE2E1';
    if (type.includes('Medida') || type.includes('Medición')) return '#E1F0FD';
    if (type.includes('Entrega')) return '#E1F5E8';
    return '#FEF5E1'; // Consultas
  };

  // Mobile Helpers
  const getCardBorderClass = (type: string) => {
    if (type.includes('Prueba')) return styles.typeRed;
    if (type.includes('Medida') || type.includes('Medición')) return styles.typeBlue;
    if (type.includes('Entrega')) return styles.typeGreen;
    return styles.typeYellow;
  }

  const handleAppointmentClick = (e: React.MouseEvent, apt: any) => {
    e.stopPropagation();
    setSelectedAppointment(apt);
  };

  // Month Grid Data (Mock October 2023)
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const prevMonthPadding = [25, 26, 27, 28, 29, 30]; // September padding
  const nextMonthPadding = [1]; // November padding

  return (
    <div className={styles.calendarContainer}>

      {/* ========================================== */}
      {/* SIDEBAR (Desktop Only)                   */}
      {/* ========================================== */}
      <aside className={styles.sidebar}>

        <button
          className={styles.newAppointmentButton}
          onClick={() => { setNewSlot(undefined); setIsNewModalOpen(true); }}
        >
          <Plus size={20} strokeWidth={3} />
          <span>Nueva Cita</span>
        </button>

        <section className={styles.sidebarSection}>
          <div className={styles.flexBetween} style={{ marginBottom: '1rem' }}>
            <h3 className={styles.sectionHeading}>Octubre 2023</h3>
            <div className={styles.navArrows}>
              <ChevronLeft size={16} />
              <ChevronRight size={16} />
            </div>
          </div>
          <div className={styles.miniCalendarGrid}>
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => <span key={d} className={styles.miniDayLabel}>{d}</span>)}
            {[24, 25, 26, 27, 28, 29, 30].map(d => <span key={`p-${d}`} className={styles.miniDayPadding}>{d}</span>)}
            {monthDays.map(d => (
              <div key={d} className={`${styles.miniDayNumber} ${d === selectedDay ? styles.miniDayActive : ''}`} onClick={() => setSelectedDay(d)}>
                {d}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sidebarSection}>
          <h3 className={styles.sectionHeading}>VISTAS</h3>
          <div className={styles.vistasList}>
            <div className={`${styles.vistaItem} ${currentView === 'mensual' ? styles.vistaActive : ''}`} onClick={() => setCurrentView('mensual')}>
              <LayoutGrid size={18} />
              <span>Vista Mensual</span>
            </div>
            <div className={styles.vistaItem}>
              <LayoutList size={18} />
              <span>Vista Semanal</span>
            </div>
            <div className={styles.vistaItem}>
              <Calendar size={18} />
              <span>Vista Diaria</span>
            </div>
          </div>
        </section>

        <section className={styles.sidebarSection}>
          <h3 className={styles.sectionHeading}>CATEGORÍAS</h3>
          <div className={styles.filterList}>
            <label className={styles.filterItem}>
              <div className={styles.customCheck} style={{ borderColor: '#B25B52' }}>
                <input type="checkbox" defaultChecked />
                <div className={styles.checkInner} style={{ backgroundColor: '#B25B52' }} />
              </div>
              <span>Pruebas</span>
              <span className={styles.dot} style={{ backgroundColor: '#B25B52' }} />
            </label>
            <label className={styles.filterItem}>
              <div className={styles.customCheck} style={{ borderColor: '#60A5FA' }}>
                <input type="checkbox" defaultChecked />
                <div className={styles.checkInner} style={{ backgroundColor: '#60A5FA' }} />
              </div>
              <span>Mediciones</span>
              <span className={styles.dot} style={{ backgroundColor: '#60A5FA' }} />
            </label>
            <label className={styles.filterItem}>
              <div className={styles.customCheck} style={{ borderColor: '#4CAF50' }}>
                <input type="checkbox" defaultChecked />
                <div className={styles.checkInner} style={{ backgroundColor: '#4CAF50' }} />
              </div>
              <span>Entregas</span>
              <span className={styles.dot} style={{ backgroundColor: '#4CAF50' }} />
            </label>
          </div>
        </section>
      </aside>

      {/* ========================================== */}
      {/* MAIN CONTENT (Desktop)                   */}
      {/* ========================================== */}
      <main className={styles.mainContent}>
        <header className={styles.mainHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.mainTitle}>Agenda</h1>
          </div>

          <div className={styles.headerCenter}>
            <div className={styles.monthNav}>
              <button className={styles.navCircle}><ChevronLeft size={18} /></button>
              <span className={styles.monthYearLabel}>Octubre 2023</span>
              <button className={styles.navCircle}><ChevronRight size={18} /></button>
            </div>
            <button className={styles.todayBtn}>Hoy</button>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.userSection}>
              <Bell size={20} />
              <div className={styles.userDetails}>
                <span className={styles.userName}>Alejandro M.</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentArea}>
          <div className={styles.monthlyGridHeader}>
            {daysLabels.map(day => <span key={day}>{day}</span>)}
          </div>

          <div className={styles.monthlyGrid}>
            {prevMonthPadding.map(d => (
              <div key={`prev-${d}`} className={styles.dayCellPadding}>
                <span className={styles.dayCellNumber}>{d}</span>
              </div>
            ))}
            {monthDays.map(d => (
              <div key={d} className={`${styles.dayCell} ${d === 5 ? styles.dayCellToday : ''} ${d === selectedDay ? styles.dayCellActive : ''}`} onClick={() => setSelectedDay(d)}>
                <span className={styles.dayCellNumber}>{d}</span>
                {d === 5 && <span className={styles.todayIndicator}>HOY</span>}

                <div className={styles.cellAppointments}>
                  {MOCK_APPOINTMENTS
                    .filter(apt => parseInt(apt.date.split('-')[2]) === d)
                    .slice(0, 3)
                    .map(apt => (
                      <div
                        key={apt.id}
                        className={styles.desktopAptCard}
                        style={{ backgroundColor: getCategoryBg(apt.type) }}
                        onClick={(e) => handleAppointmentClick(e, apt)}
                      >
                        <span className={styles.desktopAptTime}>{apt.time} {apt.type}</span>
                        <span className={styles.desktopAptClient}>{MOCK_CLIENTS.find(c => c.id === apt.clientId)?.name || apt.clientName}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
            {nextMonthPadding.map(d => (
              <div key={`next-${d}`} className={styles.dayCellPadding}>
                <span className={styles.dayCellNumber}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ========================================== */}
      {/* VISTA MÓVIL (Lista diario + Drawer)      */}
      {/* ========================================== */}
      <div className={styles.mobileViewWrapper}>
        <header className={styles.mobileHeader}>
          <h1 className={styles.mobileTitle}>Agenda</h1>
          <div className={styles.headerActions}>
            <button className={styles.iconIconButton} onClick={() => setIsFilterDrawerOpen(true)}>
              <Filter size={20} />
            </button>
            <button className={styles.iconIconButton}>
              <Moon size={20} />
            </button>
          </div>
        </header>

        <div className={styles.dateStrip}>
          {mobileDays.map((day, idx) => (
            <div
              key={idx}
              className={`${styles.dateItem} ${mobileDates[idx] === selectedDay ? styles.dateItemActive : ''}`}
              onClick={() => setSelectedDay(mobileDates[idx])}
            >
              <span className={styles.dateItemDay}>{day}</span>
              <span className={styles.dateItemNumber}>{mobileDates[idx]}</span>
            </div>
          ))}
        </div>

        <p className={styles.currentDateLabel}>
          {selectedDay === 7 ? 'Miércoles, 7 de Octubre 2023' : `Día ${selectedDay} de Octubre 2023`}
        </p>

        <div className={styles.appointmentList}>
          {MOCK_APPOINTMENTS
            .filter(apt => parseInt(apt.date.split('-')[2]) === selectedDay)
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(apt => (
              <div key={apt.id} className={styles.appointmentRow} onClick={(e) => handleAppointmentClick(e, apt)}>
                <div className={styles.appointmentTime}>{apt.time}</div>
                <div className={`${styles.mobileAppointmentCard} ${getCardBorderClass(apt.type)}`}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.clientNameText}>
                        {MOCK_CLIENTS.find(c => c.id === apt.clientId)?.name || apt.clientName}
                      </h3>
                      <p className={styles.aptTypeText}>{apt.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {MOCK_APPOINTMENTS.filter(apt => parseInt(apt.date.split('-')[2]) === selectedDay).length === 0 && (
            <div className="py-20 text-center opacity-40">Sin citas para este día</div>
          )}
        </div>

        {/* FAB Móvil */}
        <button className={styles.fab} onClick={() => { setNewSlot(undefined); setIsNewModalOpen(true); }}>
          <Plus size={32} />
        </button>

        {/* Drawer Móvil */}
        <div className={`${styles.drawerOverlay} ${isFilterDrawerOpen ? styles.drawerOverlayActive : ''}`} onClick={() => setIsFilterDrawerOpen(false)} />
        <div className={`${styles.bottomDrawer} ${isFilterDrawerOpen ? styles.bottomDrawerActive : ''}`}>
          <div className={styles.drawerHandle} />
          <section style={{ marginBottom: '2rem' }}>
            <h4 className={styles.drawerSectionTitle}>CALENDARIO MENSUAL</h4>
            <div className={styles.drawerMonthCard}>
              <div className={styles.flexBetween} style={{ marginBottom: '1rem' }}>
                <span style={{ fontWeight: 700 }}>Octubre 2023</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ChevronLeft size={18} style={{ color: '#94A3B8' }} />
                  <ChevronRight size={18} style={{ color: '#94A3B8' }} />
                </div>
              </div>
              <div className={styles.miniCalendarGrid}>
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => <span key={d} className={styles.miniDayLabel}>{d}</span>)}
                {[24, 25, 26, 27, 28, 29, 30].map(d => <span key={`p-${d}`} className={styles.miniDayPadding}>{d}</span>)}
                {monthDays.map(d => (
                  <div key={d} className={`${styles.miniDayNumber} ${d === selectedDay ? styles.miniDayActive : ''}`} onClick={() => { setSelectedDay(d); setIsFilterDrawerOpen(false); }}>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section>
            <h4 className={styles.drawerSectionTitle}>FILTROS DE CATEGORÍA</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Pruebas', 'Entregas', 'Medidas', 'Consultas'].map((f, i) => (
                <label key={f} className={styles.drawerFilterLabel} style={{ backgroundColor: i === 0 ? '#FDE2E1' : i === 1 ? '#E1F5E8' : i === 2 ? '#E1F0FD' : '#FEF5E1' }}>
                  <input type="checkbox" defaultChecked />
                  <span>{f}</span>
                </label>
              ))}
            </div>
            <button className={styles.applyBtn} onClick={() => setIsFilterDrawerOpen(false)}>Aplicar Filtros</button>
          </section>
        </div>
      </div>

      <AppointmentModal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} appointment={selectedAppointment} />
      <NewAppointmentModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} initialDate={newSlot?.date} initialTime={newSlot?.time} />
    </div>
  );
};