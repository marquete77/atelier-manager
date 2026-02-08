import { Client, Project, Appointment } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'María González',
    phone: '+34 612 345 678',
    email: 'maria.gonzalez@email.com',
    lastVisit: '2023-10-15',
    status: 'Activo',
    avatarUrl: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: '2',
    name: 'Laura Castillo',
    phone: '+34 699 888 777',
    email: 'laura.c@email.com',
    lastVisit: '2023-09-20',
    status: 'VIP',
    avatarUrl: 'https://picsum.photos/100/100?random=2'
  },
  {
    id: '3',
    name: 'Sofia Vargas',
    phone: '+34 655 444 333',
    email: 'sofia.v@email.com',
    lastVisit: '2023-10-22',
    status: 'Activo',
    avatarUrl: 'https://picsum.photos/100/100?random=3'
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '101',
    clientId: '1',
    clientName: 'María González',
    name: 'Vestido de Gala',
    status: 'Medidas',
    dueDate: '2023-11-15',
    imageUrl: 'https://picsum.photos/400/300?random=10'
  },
  {
    id: '102',
    clientId: '3',
    clientName: 'Sofia Vargas',
    name: 'Traje Sastre',
    status: 'Prueba',
    dueDate: '2023-11-01',
    imageUrl: 'https://picsum.photos/400/300?random=11'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    clientId: '1',
    clientName: 'María González',
    date: '2023-10-24',
    time: '10:00',
    type: 'Toma de medidas'
  },
  {
    id: 'a2',
    clientId: '2',
    clientName: 'Laura Castillo',
    date: '2023-10-24',
    time: '12:30',
    type: 'Entrega final'
  },
  {
    id: 'a3',
    clientId: '3',
    clientName: 'Sofia Vargas',
    date: '2023-10-25',
    time: '16:00',
    type: 'Primera prueba'
  }
];