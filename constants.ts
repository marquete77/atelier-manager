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
  {
    id: '4',
    name: 'Ana López',
    phone: '+34 611 223 344',
    email: 'ana.lopez@email.com',
    lastVisit: '2023-10-01',
    status: 'Activo',
    avatarUrl: 'https://picsum.photos/100/100?random=4'
  },
  {
    id: '5',
    name: 'Lucía Méndez',
    phone: '+34 622 334 455',
    email: 'lucia.m@email.com',
    lastVisit: '2023-08-15',
    status: 'VIP',
    avatarUrl: 'https://picsum.photos/100/100?random=5'
  }
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
  // Lunes 5
  {
    id: 'a1',
    clientId: '1',
    clientName: 'María González',
    date: '2023-10-05',
    time: '09:00',
    type: 'Toma de medidas'
  },
  // Martes 6
  {
    id: 'a2',
    clientId: '4',
    clientName: 'Ana López',
    date: '2023-10-06',
    time: '10:00',
    type: 'Primera prueba'
  },
  {
    id: 'a3',
    clientId: '5',
    clientName: 'Carmen R.',
    date: '2023-10-06',
    time: '14:00',
    type: 'Toma de medidas'
  },
  // Miércoles 7
  {
    id: 'a4',
    clientId: '3',
    clientName: 'Sofia Vargas',
    date: '2023-10-07',
    time: '13:00',
    type: 'Consulta'
  },
  {
    id: 'a5',
    clientId: '2',
    clientName: 'Laura Castillo',
    date: '2023-10-07',
    time: '10:00',
    type: 'Entrega final'
  },
  // Jueves 8
  {
    id: 'a6',
    clientId: '5',
    clientName: 'Lucía Méndez',
    date: '2023-10-08',
    time: '11:00',
    type: 'Segunda prueba'
  },
  {
    id: 'a7',
    clientId: '1',
    clientName: 'Marta S.',
    date: '2023-10-08',
    time: '16:00',
    type: 'Consulta'
  },
  // Viernes 9
  {
    id: 'a8',
    clientId: '4',
    clientName: 'Beatriz P.',
    date: '2023-10-09',
    time: '17:00',
    type: 'Entrega final'
  },
  {
    id: 'a9',
    clientId: '3',
    clientName: 'Sofia Vargas',
    date: '2023-10-09',
    time: '10:00',
    type: 'Prueba de vestido'
  },
  // Sábado 10
  {
    id: 'a10',
    clientId: '2',
    clientName: 'Laura Castillo',
    date: '2023-10-10',
    time: '11:00',
    type: 'Toma de medidas'
  }
];