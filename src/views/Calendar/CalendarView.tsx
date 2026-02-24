import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  LayoutGrid,
  LayoutList,
  Loader2,
  Settings,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";
import styles from './CalendarView.module.css';
import { AppointmentModal } from './AppointmentModal/AppointmentModal';
import { NewAppointmentModal } from './NewAppointmentModal/NewAppointmentModal';

interface Appointment {
  id: string;
  type: string;
  start_time: string;
  end_time: string;
  title: string;
  status: string;
  notes: string;
  client_id: string;
  clients?: {
    full_name: string;
  };
}

export const CalendarView: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<{ date: string, time: string } | undefined>(undefined);

  // Date Logic States
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [enabledCategories, setEnabledCategories] = useState<string[]>(['fitting', 'measurement', 'delivery']);

  const daysLabels = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  const miniDaysLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, currentDate]);

  useEffect(() => {
    // Refresh when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        fetchAppointments();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      setLoading(true);

      // Fetch for the current month range (plus some padding)
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), -7).toISOString();
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 7).toISOString();

      const { data, error } = await supabase
        .from('appointments')
        .select('*, clients(full_name)')
        .eq('user_id', user.id)
        .gte('start_time', firstDay)
        .lte('start_time', lastDay);

      console.log('📌 Citas recibidas del backend:', data);

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBg = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('fitting') || t.includes('prueba')) return '#FDE2E1'; // Soft Terracotta
    if (t.includes('measurement') || t.includes('medicion')) return '#E1F0FD'; // Soft Blue
    if (t.includes('delivery') || t.includes('entrega')) return '#E1F5E8'; // Soft Green
    return '#FEF5E1'; // Soft Yellow (Consultas)
  };

  const handleAppointmentClick = (e: React.MouseEvent, apt: Appointment) => {
    e.stopPropagation();
    setSelectedAppointment(apt);
  };

  // Helper functions for Calendar Matrix
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const daysInPrevMonth = prevMonthDate.getDate();

    const grid = [];

    // Padding previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      grid.push({
        day: daysInPrevMonth - i,
        month: currentDate.getMonth() - 1,
        year: currentDate.getFullYear(),
        isPadding: true
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        day: i,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isPadding: false
      });
    }

    // Padding next month
    const remainingSlots = 42 - grid.length;
    for (let i = 1; i <= remainingSlots; i++) {
      grid.push({
        day: i,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        isPadding: true
      });
    }

    return grid;
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const changeMonth = (offset: number) => {
    setDirection(offset);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 size={48} className="text-terracotta" />
        </motion.div>
        <p>Cargando agenda premium...</p>
      </div>
    );
  }

  return (
    <div className={styles.calendarContainer}>
      <aside className={styles.sidebar}>
        <motion.button
          className={styles.newAppointmentButton}
          onClick={() => { setNewSlot(undefined); setIsNewModalOpen(true); }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} strokeWidth={3} />
          <span>Nueva Cita</span>
        </motion.button>

        <section className={styles.sidebarSection}>
          <div className={styles.flexBetween} style={{ marginBottom: '1rem' }}>
            <h3 className={styles.sectionHeading}>
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <div className={styles.navArrows}>
              <ChevronLeft size={16} onClick={() => changeMonth(-1)} />
              <ChevronRight size={16} onClick={() => changeMonth(1)} />
            </div>
          </div>
          <div className={styles.miniCalendarGrid}>
            {miniDaysLabels.map((d, i) => <span key={i} className={styles.miniDayLabel}>{d}</span>)}
            {renderCalendarGrid().slice(0, 35).map((item, idx) => {
              const isSelected = selectedDate.getDate() === item.day &&
                selectedDate.getMonth() === item.month &&
                selectedDate.getFullYear() === item.year;
              return (
                <div
                  key={idx}
                  className={`${styles.miniDayNumber} 
                                      ${item.isPadding ? styles.miniDayPadding : ''} 
                                      ${isToday(item.day, item.month, item.year) ? styles.miniDayActive : ''}
                                  `}
                  onClick={() => setSelectedDate(new Date(item.year, item.month, item.day))}
                  style={{ position: 'relative' }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeDayCircle"
                      className={styles.activeDayCircle}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(178, 91, 82, 0.1)',
                        borderRadius: '50%',
                        zIndex: -1
                      }}
                      transition={{ type: "spring", stiffness: 150, damping: 25 }}
                    />
                  )}
                  {item.day}
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.sidebarSection}>
          <h3 className={styles.sectionHeading}>VISTAS</h3>
          <div className={styles.vistasList}>
            <div className={`${styles.vistaItem} ${styles.vistaActive}`}>
              <LayoutGrid size={18} />
              <span>Vista Mensual</span>
            </div>
            <div className={styles.vistaItem}>
              <LayoutList size={18} />
              <span>Vista Semanal</span>
            </div>
            <div className={styles.vistaItem}>
              <CalendarIcon size={18} />
              <span>Vista Diaria</span>
            </div>
          </div>
        </section>

        <section className={styles.sidebarSection}>
          <h3 className={styles.sectionHeading}>CATEGORÍAS</h3>
          <div className={styles.filterList}>
            <div className={styles.filterList}>
              {[
                { id: 'fitting', label: 'Pruebas', color: '#B25B52' },
                { id: 'measurement', label: 'Mediciones', color: '#60A5FA' },
                { id: 'delivery', label: 'Entregas', color: '#4CAF50' },
              ].map(cat => (
                <div
                  key={cat.id}
                  className={styles.filterItem}
                  onClick={() => {
                    setEnabledCategories(prev =>
                      prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id]
                    );
                  }}
                >
                  <div className={styles.customCheck} style={{ borderColor: cat.color }}>
                    <input type="checkbox" checked={enabledCategories.includes(cat.id)} readOnly />
                    <AnimatePresence>
                      {enabledCategories.includes(cat.id) && (
                        <motion.div
                          className={styles.checkInner}
                          style={{ backgroundColor: cat.color }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <span>{cat.label}</span>
                  <div className={styles.dot} style={{ backgroundColor: cat.color }}></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.mainHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.mainTitle}>Agenda de Trabajo</h1>
          </div>
          <div className={styles.headerCenter}>
            <div className={styles.monthNav}>
              <button className={styles.navCircle} onClick={() => changeMonth(-1)}>
                <ChevronLeft size={18} />
              </button>
              <span className={styles.monthYearLabel}>
                {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
              <button className={styles.navCircle} onClick={() => changeMonth(1)}>
                <ChevronRight size={18} />
              </button>
            </div>
            <button className={styles.todayBtn} onClick={() => setCurrentDate(new Date())}>Hoy</button>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userSection}>
              <Bell size={20} />
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user?.user_metadata?.full_name || 'Usuario'}</span>
                <span className={styles.userRole}>{user?.user_metadata?.role || 'Sastre Principal'}</span>
              </div>
              <div className={styles.mainAvatar} style={{
                backgroundColor: 'var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentArea}>
          <div className={styles.monthlyGridHeader}>
            {daysLabels.map(day => <span key={day}>{day}</span>)}
          </div>

          <div style={{ position: 'relative', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={currentDate.toISOString()}
                custom={direction}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? 50 : -50,
                    opacity: 0
                  }),
                  center: {
                    x: 0,
                    opacity: 1
                  },
                  exit: (direction: number) => ({
                    x: direction > 0 ? -50 : 50,
                    opacity: 0
                  })
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={styles.monthlyGrid}
              >
                {renderCalendarGrid().map((item, idx) => {
                  const dateStr = new Date(item.year, item.month, item.day).toDateString();
                  const dayAppointments = appointments.filter(apt =>
                    new Date(apt.start_time).toDateString() === dateStr
                  );
                  const isTodayCell = isToday(item.day, item.month, item.year);

                  return (
                    <div
                      key={idx}
                      className={`
                                            ${item.isPadding ? styles.dayCellPadding : styles.dayCell} 
                                            ${isTodayCell ? styles.dayCellToday : ''}
                                        `}
                      style={(!item.isPadding && new Date(item.year, item.month, item.day).getDay() !== 0) ? { backgroundColor: 'rgba(178, 91, 82, 0.05)' } : {}}
                    >
                      <span
                        className={styles.dayCellNumber}
                        style={(!item.isPadding && new Date(item.year, item.month, item.day).getDay() !== 0) ? { color: 'var(--color-terracotta)', fontWeight: '800' } : {}}
                      >
                        {item.day}
                      </span>
                      {isTodayCell && <span className={styles.todayIndicator}>HOY</span>}

                      <div className={styles.cellAppointments}>
                        <AnimatePresence>
                          {dayAppointments
                            .filter(apt => enabledCategories.includes(apt.type.toLowerCase()))
                            .map(apt => (
                              <motion.div
                                key={apt.id}
                                className={styles.desktopAptCard}
                                style={{ backgroundColor: getCategoryBg(apt.type) }}
                                onClick={(e) => handleAppointmentClick(e, apt)}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <span className={styles.desktopAptTime}>
                                  {new Date(apt.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                  {` ${apt.type === 'fitting' ? 'Prueba' : apt.type === 'measurement' ? 'Medición' : apt.type === 'delivery' ? 'Entrega' : 'Cita'}`}
                                </span>
                                <span className={styles.desktopAptClient}>{apt.clients?.full_name}</span>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <AppointmentModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
      <NewAppointmentModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          fetchAppointments();
        }}
        initialDate={newSlot?.date}
        initialTime={newSlot?.time}
      />
    </div>
  );
};