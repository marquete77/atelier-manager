import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, User, FileText, Camera, Check, Scissors, ArrowLeft, Loader2 } from 'lucide-react';
import { InputMeasure } from "@/components/common/InputMeasure/InputMeasure.tsx";
import { Client } from "@/types.ts";
import { useAuth } from '../../hooks/useAuth';
import { MeasurementService } from '../../services/measurement.service';
import { ClientService } from '../../services/client.service';
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
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeClient, setActiveClient] = useState<Partial<Client>>({ name: "Cargando...", id: clientId });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadClientAndMeasures = async () => {
      if (!clientId) return;

      // Load client info
      const { data: clientData } = await ClientService.getById(clientId);
      if (clientData) {
        setActiveClient({ name: clientData.full_name, id: clientData.id });
      }

      // Load latest measurements to pre-fill form
      const { data: measureData } = await MeasurementService.getLatestByClientId(clientId);
      if (measureData && typeof measureData.values === 'object') {
        const vals = measureData.values as any;
        setMeasures(prev => ({ ...prev, ...vals }));
        setNotes(measureData.notes || '');
      }
    };

    loadClientAndMeasures();
  }, [clientId]);

  const handleChange = (key: string, val: string) => {
    setMeasures(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    if (!user || !clientId) return;
    setIsSaving(true);

    try {
      const { error } = await MeasurementService.create({
        user_id: user.id,
        client_id: clientId,
        values: measures,
        notes: notes,
      });

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Optional: navigate back or show success message
    } catch (error) {
      console.error('Error saving measurements:', error);
      alert('Error al guardar las medidas');
    } finally {
      setIsSaving(false);
    }
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
            <button
              onClick={() => navigate(-1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', padding: 0 }}
            >
              <ArrowLeft size={18} />
              <span>Volver</span>
            </button>
            <span style={{ opacity: 0.5 }}>/</span>
            <RulerIcon />
            <span>Nueva Ficha</span>
          </div>
          <h1 className="view-title">Ficha de Medidas</h1>
          <div className={styles.metaInfo}>
            <div className={styles.statusDot}></div>
            <span>Cliente: <strong className={styles.clientName}>{activeClient.name}</strong></span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.cancelButton} onClick={() => navigate(-1)} disabled={isSaving}>
            Cancelar
          </button>
          <motion.button
            className={styles.saveButton}
            whileHover={{ scale: isSaving ? 1 : 1.02 }}
            whileTap={{ scale: isSaving ? 1 : 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            style={{
              backgroundColor: saveSuccess ? '#10B981' : 'var(--color-terracotta)',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
            {isSaving ? 'Guardando...' : saveSuccess ? '¡Guardado!' : 'Guardar Medidas'}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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