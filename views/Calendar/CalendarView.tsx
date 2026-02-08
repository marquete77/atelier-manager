import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, CheckCircle, Clock } from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_CLIENTS } from "@/constants.ts";
import styles from './CalendarView.module.css';
import { AppointmentModal } from '@/src/views/Calendar/AppointmentModal/AppointmentModal';
import { NewAppointmentModal } from '@/src/views/Calendar/NewAppointmentModal/NewAppointmentModal';

interface Appointment {
  id: string;
  clientName: string; // Keep for compatibility but prefer lookup
  clientId: string;
  type: string;
  date: string;
  time: string;
}

export const CalendarView: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<{ date: string, time: string } | undefined>(undefined);

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dates = [5, 6, 7, 8, 9, 10, 11]; // Mock week Oct 5-11
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm

  // Helper to determine card style based on type
  const getCardStyle = (type: string) => {
    if (type.includes('Prueba')) return styles.cardRed;
    if (type.includes('Consulta')) return styles.cardYellow;
    if (type.includes('Medida')) return styles.cardBlue;
    return styles.cardGreen;
  };

  const handleAppointmentClick = (e: React.MouseEvent, apt: any) => {
    e.stopPropagation();
    setSelectedAppointment(apt);
  };

  const handleSlotClick = (dayIdx: number, hour: number) => {
    const baseDate = 4;
    const dateNum = baseDate + dayIdx + 1;
    const dateStr = `2023-10-${dateNum < 10 ? '0' + dateNum : dateNum}`;
    const timeStr = `${hour < 10 ? '0' : ''}${hour}:00`;

    setNewSlot({ date: dateStr, time: timeStr });
    setIsNewModalOpen(true);
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <button
          className={styles.newAppointmentButton}
          onClick={() => { setNewSlot(undefined); setIsNewModalOpen(true); }}
        >
          <Plus size={24} />
          <span>Nueva Cita</span>
        </button>

        <div className={styles.sidebarCard}>
          <div className={styles.flexBetween}>
            <h3 className={styles.sidebarTitle}>Octubre 2023</h3>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                <ChevronLeft size={16} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className={styles.miniCalendarGrid}>
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
              <span key={d} className={styles.miniDayLabel}>{d}</span>
            ))}

            {/* Mock previous dates */}
            {[29, 30].map(d => <span key={`prev-${d}`} className={styles.miniDayCell}>{d}</span>)}

            {/* Current month dates */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <div
                key={d}
                className={`${styles.miniDayNumber} ${d === 5 ? styles.miniDayActive : ''}`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>Filtros de Categoría</h3>
          <div className={styles.filterList}>
            <label className={styles.filterItem}>
              <input type="checkbox" defaultChecked className={`${styles.checkbox} ${styles.checkboxRed}`} />
              <span className={styles.filterLabel}>Pruebas de Vestuario</span>
            </label>
            <label className={styles.filterItem}>
              <input type="checkbox" defaultChecked className={`${styles.checkbox} ${styles.checkboxGreen}`} />
              <span className={styles.filterLabel}>Entregas Finales</span>
            </label>
            <label className={styles.filterItem}>
              <input type="checkbox" defaultChecked className={`${styles.checkbox} ${styles.checkboxBlue}`} />
              <span className={styles.filterLabel}>Tomas de Medida</span>
            </label>
            <label className={styles.filterItem}>
              <input type="checkbox" defaultChecked className={`${styles.checkbox} ${styles.checkboxYellow}`} />
              <span className={styles.filterLabel}>Consultas Iniciales</span>
            </label>
          </div>
        </div>

        <div className={styles.daySummary}>
          <h4 className={styles.summaryTitle}>Resumen del Día</h4>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Citas programadas</span>
            <span className={styles.summaryValue}>5</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Pendientes</span>
            <span className={styles.summaryValue}>2</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Agenda</h1>
            <p className={styles.subtitle}>Semana del 5 al 11 de Octubre, 2023</p>
          </div>
          <div className={styles.viewControls}>
            <div className={styles.viewTabs}>
              <button className={`${styles.viewTab} ${styles.viewTabActive}`}>Semana</button>
              <button className={styles.viewTab}>Mes</button>
              <button className={styles.viewTab}>Día</button>
            </div>
            <div className={styles.navControls}>
              <button className={styles.navButton}>
                <ChevronLeft size={20} />
              </button>
              <button className={styles.navButton}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.calendarGrid}>
          <div className={styles.headerGrid}>
            <div className={styles.timeHeaderCell}></div>
            {days.map((day, idx) => (
              <div key={day} className={`${styles.dayHeaderCell} ${idx === 2 ? styles.activeDayHeader : ''}`}>
                <span className={styles.dayName}>{day}</span>
                <div className={`${styles.dayNumber} ${idx === 2 ? styles.activeDayNumber : ''}`}>
                  {dates[idx]}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.timeGrid}>
            {/* Background Grid */}
            <div className={styles.gridBackground}>
              <div className={styles.gridCol}></div> {/* Time Col */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`${styles.gridCol} ${i === 2 ? styles.activeGridCol : ''}`}></div>
              ))}
            </div>

            {/* Rows and Events */}
            <div className={styles.gridRows}>
              {hours.map((hour) => (
                <div key={hour} className={styles.timeRow}>
                  <div className={styles.timeLabel}>{hour}:00</div>
                  {/* Cells for click detection */}
                  {Array.from({ length: 7 }).map((_, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="h-full w-full relative"
                      onClick={() => handleSlotClick(dayIdx, hour)}
                    >
                      {/* Map appointments here */}
                      {MOCK_APPOINTMENTS.map(apt => {
                        const aptHour = parseInt(apt.time.split(':')[0]);
                        // Calculate day index based on date (2023-10-05 is index 0)
                        const aptDateNum = parseInt(apt.date.split('-')[2]);
                        const aptDayIdx = aptDateNum - 5; // 5 -> 0, 6 -> 1, ...

                        // Find client to display correct name
                        const client = MOCK_CLIENTS.find(c => c.id === apt.clientId);
                        const displayClientName = client ? client.name : apt.clientName;

                        if (aptDayIdx >= 0 && aptDayIdx < 7 && aptHour === hour && aptDayIdx === dayIdx) {
                          return (
                            <div
                              key={apt.id}
                              className={`${styles.appointmentContainer}`}
                              style={{
                                top: '0.2rem',
                                height: 'calc(100% - 0.4rem)',
                                width: 'calc(100% - 0.4rem)',
                                left: '0.2rem',
                                position: 'absolute',
                                zIndex: 10
                              }}
                              onClick={(e) => handleAppointmentClick(e, apt)}
                            >
                              <div className={`${styles.appointmentCard} ${getCardStyle(apt.type)}`}>
                                <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-1 dot"></div>
                                <div className={styles.cardContent}>
                                  <span className={styles.clientName}>{displayClientName}</span>
                                  <span className={styles.aptType}>{apt.type}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Current Time Indicator (Mocked at 18:42 like in design) */}
            <div className={styles.currentTimeLine} style={{ top: '85%' }}>
              <div className={styles.timeTag}>18:42</div>
              <div className={styles.timeDot}></div>
            </div>

          </div>
        </div>
      </div>

      {/* Modals */}
      <AppointmentModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />

      <NewAppointmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        initialDate={newSlot?.date}
        initialTime={newSlot?.time}
      />
    </div>
  );
};