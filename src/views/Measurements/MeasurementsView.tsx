import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, FileText, Camera, Check, Scissors } from 'lucide-react';
import { InputMeasure } from "@/components/common/InputMeasure/InputMeasure.tsx";
import { Client } from "@/types.ts";
import styles from './MeasurementsView.module.css';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const MeasurementsView: React.FC = () => {
  const [activeClient] = useState<Partial<Client>>({ name: "Maria Gonzalez", id: "1" });

  // State for form fields
  const [measures, setMeasures] = useState({
    busto: '',
    espalda: '',
    talleDelantero: '',
    talleEspalda: '',
    alturaBusto: '',
    cintura: '',
    cadera: '',
    largoTiro: '',
    largoTotal: '',
    largoManga: '',
    anchoBrazo: '',
    puno: '',
    sisa: ''
  });

  const handleChange = (key: string, val: string) => {
    setMeasures(prev => ({ ...prev, [key]: val }));
  };

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.header className="view-header" variants={sectionVariants}>
        <div className="view-title-section">
          <div className="view-breadcrumb">
            <RulerIcon />
            <span>Nueva Ficha</span>
          </div>
          <h1 className="view-title">Ficha de Medidas</h1>
          <div className={styles.metaInfo}>
            <div className={styles.statusDot}></div>
            <span>Cliente: <strong className={styles.clientName}>{activeClient.name}</strong></span>
            <span className={styles.separator}>|</span>
            <span>Proyecto: Vestido de Gala</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.cancelButton}>
            Cancelar
          </button>
          <motion.button
            className={styles.saveButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={18} />
            Guardar Medidas
          </motion.button>
        </div>
      </motion.header>

      <div className={styles.mainGrid}>
        {/* Left Column: Form Blocks */}
        <div className={styles.leftColumn}>

          {/* Upper Body Section */}
          <motion.section
            className={styles.sectionCard}
            variants={sectionVariants}
            whileHover={{ y: -2 }}
            transition={{ type: "tween", duration: 0.2 }}
            layout
          >
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIconWrapper}>
                <User size={20} />
              </div>
              <h3 className={styles.sectionTitle}>Parte Superior</h3>
            </div>

            <div className={styles.inputsGrid}>
              <InputMeasure label="Contorno de Busto" value={measures.busto} onChange={(v) => handleChange('busto', v)} />
              <InputMeasure label="Ancho de Espalda" value={measures.espalda} onChange={(v) => handleChange('espalda', v)} />
              <InputMeasure label="Talle Delantero" value={measures.talleDelantero} onChange={(v) => handleChange('talleDelantero', v)} />
              <InputMeasure label="Talle Espalda" value={measures.talleEspalda} onChange={(v) => handleChange('talleEspalda', v)} />
              <div className={styles.fullWidth}>
                <InputMeasure label="Altura de Busto" value={measures.alturaBusto} onChange={(v) => handleChange('alturaBusto', v)} />
              </div>
            </div>
          </motion.section>

          <div className={styles.subGrid}>
            {/* Lower Body Section */}
            <motion.section
              className={`${styles.sectionCard} ${styles.heightFull}`}
              variants={sectionVariants}
              whileHover={{ y: -2 }}
              transition={{ type: "tween", duration: 0.2 }}
              layout
            >
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIconWrapper}>
                  <User size={20} className="transform rotate-180" />
                </div>
                <h3 className={styles.sectionTitle}>Parte Inferior</h3>
              </div>
              <div className={styles.inputSpace}>
                <InputMeasure label="Contorno de Cintura" value={measures.cintura} onChange={(v) => handleChange('cintura', v)} />
                <InputMeasure label="Contorno de Cadera" value={measures.cadera} onChange={(v) => handleChange('cadera', v)} />
                <InputMeasure label="Largo de Tiro" value={measures.largoTiro} onChange={(v) => handleChange('largoTiro', v)} />
                <InputMeasure label="Largo Total" value={measures.largoTotal} onChange={(v) => handleChange('largoTotal', v)} />
              </div>
            </motion.section>

            {/* Sleeves Section */}
            <motion.section
              className={`${styles.sectionCard} ${styles.heightFull}`}
              variants={sectionVariants}
              whileHover={{ y: -2 }}
              transition={{ type: "tween", duration: 0.2 }}
              layout
            >
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIconWrapper}>
                  <Scissors size={20} />
                </div>
                <h3 className={styles.sectionTitle}>Mangas</h3>
              </div>
              <div className={styles.inputSpace}>
                <InputMeasure label="Largo de Manga" value={measures.largoManga} onChange={(v) => handleChange('largoManga', v)} />
                <InputMeasure label="Ancho de Brazo" value={measures.anchoBrazo} onChange={(v) => handleChange('anchoBrazo', v)} />
                <InputMeasure label="Contorno de Puño" value={measures.puno} onChange={(v) => handleChange('puno', v)} />
                <InputMeasure label="Sisa" value={measures.sisa} onChange={(v) => handleChange('sisa', v)} />
              </div>
            </motion.section>
          </div>
        </div>

        {/* Right Column: Sidebar info */}
        <div className={styles.rightColumn}>

          {/* Notes Card */}
          <motion.section
            className={styles.sectionCard}
            variants={sectionVariants}
            whileHover={{ y: -2 }}
            transition={{ type: "tween", duration: 0.2 }}
            layout
          >
            <div className={`${styles.sectionHeader} mb-4 border-none pb-0`}>
              <div className={styles.sectionIconWrapper}>
                <FileText size={16} />
              </div>
              <h3 className={`${styles.sectionTitle} text-xl`}>Notas Técnicas</h3>
            </div>
            <textarea
              className={styles.notesTextarea}
              placeholder="Notas sobre postura, tipo de tela, preferencias del cliente..."
            ></textarea>
          </motion.section>

          {/* Reference Image Placeholder */}
          <motion.section
            className={styles.referenceCard}
            variants={sectionVariants}
            whileHover={{ y: -2 }}
            transition={{ type: "tween", duration: 0.2 }}
            layout
          >
            <div className={styles.blob}></div>
            <div className={styles.cameraIconWrapper}>
              <Camera size={32} className="text-terracotta" />
            </div>
            <h3 className={styles.referenceTitle}>Referencia Visual</h3>
            <p className={styles.referenceText}>Sube fotos del cliente o bocetos para referencia.</p>
            <button className={styles.attachButton}>
              Adjuntar Imagen
            </button>
            <div className={styles.backgroundPattern}></div>
          </motion.section>

          {/* Status Card */}
          <motion.section
            className={styles.sectionCard}
            variants={sectionVariants}
            whileHover={{ y: -2 }}
            transition={{ type: "tween", duration: 0.2 }}
            layout
          >
            <h3 className={styles.statusTitle}>Estado de la ficha</h3>
            <div className={styles.statusList}>
              <div className={`${styles.statusItem} ${styles.statusItemActive}`}>
                <div className={styles.statusContent}>
                  <Check size={16} className={styles.checkIcon} />
                  <span className={styles.statusLabel}>Creación</span>
                </div>
                <span className={styles.statusTime}>10:42 AM</span>
              </div>
              <div className={`${styles.statusItem} ${styles.statusItemInactive}`}>
                <div className={styles.statusContent}>
                  <div className={styles.inactiveDot}></div>
                  <span className={styles.statusLabelInactive}>Revisión</span>
                </div>
              </div>
              <div className={`${styles.statusItem} ${styles.statusItemInactive}`}>
                <div className={styles.statusContent}>
                  <div className={styles.inactiveDot}></div>
                  <span className={styles.statusLabelInactive}>Aprobado</span>
                </div>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </motion.div>
  );
};

const RulerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /><path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" /></svg>
);