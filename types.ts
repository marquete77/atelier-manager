export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  status: 'Activo' | 'Inactivo' | 'VIP';
  avatarUrl?: string;
}

export interface MeasurementData {
  [key: string]: number | string;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  status: 'Boceto' | 'Medidas' | 'Patronaje' | 'Corte' | 'Confección' | 'Prueba' | 'Finalizado';
  dueDate: string;
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  type: 'Toma de medidas' | 'Primera prueba' | 'Segunda prueba' | 'Entrega final' | 'Consulta';
}

export type ViewState = 'dashboard' | 'clients' | 'measurements' | 'calendar' | 'projects' | 'new-project' | 'client-profile' | 'settings';