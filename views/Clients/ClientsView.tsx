import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, ChevronRight, MoreVertical } from 'lucide-react';
import { MOCK_CLIENTS } from "@/constants.ts";
import { CreateClientModal } from "@/components/forms/CreateClientModal/CreateClientModal.tsx";
import { ViewState } from "@/types.ts";
import styles from './ClientsView.module.css';

interface ClientsViewProps {
  onChangeView?: (view: ViewState) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ onChangeView }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Clientes</h1>
          <p className={styles.subtitle}>Administra tus contactos y proyectos.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.newClientButton}
        >
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchIcon}>
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o email..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.clientsGrid}>
        {MOCK_CLIENTS.map((client) => (
          <div key={client.id} className={styles.clientCard}>
            <div className={styles.activeStrip}></div>

            <div className={styles.cardHeader}>
              <div className={styles.userInfo}>
                <img src={client.avatarUrl} alt={client.name} className={styles.avatar} />
                <div>
                  <h3 className={styles.userName}>{client.name}</h3>
                  <span className={`${styles.statusBadge} ${client.status === 'VIP' ? styles.statusVIP : styles.statusActive}`}>
                    {client.status}
                  </span>
                </div>
              </div>
              <button className={styles.moreButton}>
                <MoreVertical size={20} />
              </button>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.contactRow}>
                <Phone size={16} />
                <span>{client.phone}</span>
              </div>
              <div className={styles.contactRow}>
                <Mail size={16} />
                <span className="truncate">{client.email}</span>
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.viewProfileLink}
                  onClick={() => onChangeView?.('client-profile')}
                >
                  Ver Perfil <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};