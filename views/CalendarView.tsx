import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';
import styles from './CalendarView.module.css';

export const CalendarView: React.FC = () => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dates = [23, 24, 25, 26, 27, 28, 29]; // Mock week
  const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9am to 5pm

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agenda</h1>
          <p className={styles.subtitle}>Octubre 2023</p>
        </div>
        <div className={styles.controls}>
          <button className={styles.navButton}>
            <ChevronLeft size={20} />
          </button>
          <span className={styles.weekLabel}>Semana 43</span>
          <button className={styles.navButton}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={styles.calendarGrid}>
        {/* Header Grid */}
        <div className={styles.headerGrid}>
          <div className={styles.timeHeaderCell}></div>
          {days.map((day, idx) => (
            <div key={day} className={`${styles.dayHeaderCell} ${idx === 1 ? styles.activeDayHeader : ''}`}>
              <span className={styles.dayName}>{day}</span>
              <span className={`${styles.dayNumber} ${idx === 1 ? styles.activeDayNumber : ''}`}>
                {dates[idx]}
              </span>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className={styles.timeGrid}>
          {hours.map((hour) => (
            <div key={hour} className={styles.timeRow}>
              <div className={styles.timeLabelCell}>
                {hour}:00
              </div>
              {/* Columns for days */}
              {Array.from({ length: 7 }).map((_, dayIdx) => (
                <div key={dayIdx} className={`${styles.dayCell} ${dayIdx === 1 ? styles.activeDayCell : ''}`}>
                  {/* Render appointment if matches logic (Mock logic) */}
                  {MOCK_APPOINTMENTS.map(apt => {
                    const aptHour = parseInt(apt.time.split(':')[0]);
                    const isToday = dayIdx === 1 && apt.date === '2023-10-24'; // Mock today logic
                    const isTomorrow = dayIdx === 2 && apt.date === '2023-10-25';

                    if (aptHour === hour && (isToday || isTomorrow)) {
                      return (
                        <div key={apt.id} className={styles.appointmentCard}>
                          <span className={styles.appointmentClient}>{apt.clientName}</span>
                          <span className={styles.appointmentType}>{apt.type}</span>
                        </div>
                      )
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          ))}

          {/* Current Time Line Mock */}
          <div className={styles.currentTimeLine}>
            <div className={styles.currentTimeDot}></div>
          </div>
        </div>
      </div>
    </div>
  );
};