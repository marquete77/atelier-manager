import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, ChevronRight, MoreVertical, Loader2 } from 'lucide-react';
import { supabase } from "@/config/supabase";
import { useAuth } from "@/hooks/useAuth";
import { CreateClientModal } from "@/components/forms/CreateClientModal/CreateClientModal.tsx";
import { ViewState } from "@/types.ts";
import styles from './ClientsView.module.css';

interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url?: string;
  status?: string;
}

interface ClientsViewProps {
  onChangeView?: (view: ViewState) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ onChangeView }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('full_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <header className="view-header">
        <div className="view-title-section">
          <div className="view-breadcrumb">
            <Search size={18} />
            <span>Directorio de Clientes</span>
          </div>
          <h1 className="view-title">Gestión de Clientes</h1>
          <p className="view-subtitle">Administra tus contactos y proyectos.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.newClientButton}
        >
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchIcon}>
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o email..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p>Cargando clientes...</p>
        </div>
      ) : filteredClients.length > 0 ? (
        <div className={styles.clientsGrid}>
          {filteredClients.map((client) => (
            <div key={client.id} className={styles.clientCard}>
              <div className={styles.activeStrip}></div>

              <div className={styles.cardHeader}>
                <div className={styles.userInfo}>
                  <div className={styles.avatarPlaceholder}>
                    {client.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={styles.userName}>{client.full_name}</h3>
                    <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                      Activo
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
                  <span>{client.phone || 'Sin teléfono'}</span>
                </div>
                <div className={styles.contactRow}>
                  <Mail size={16} />
                  <span className="truncate">{client.email || 'Sin email'}</span>
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
      ) : (
        <div className="text-center py-20 opacity-50">
          <p>No se encontraron clientes.</p>
        </div>
      )}

      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchClients(); // Refresh list after adding
        }}
      />
    </div>
  );
};