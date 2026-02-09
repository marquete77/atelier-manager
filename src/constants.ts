export const MOCK_CLIENTS = [
    { id: '1', name: 'Ana García', email: 'ana@example.com', phone: '555-0101' },
    { id: '2', name: 'Carlos Ruiz', email: 'carlos@example.com', phone: '555-0102' },
    { id: '3', name: 'Maria Lopez', email: 'maria@example.com', phone: '555-0103' },
    { id: '4', name: 'Lucia Fernandez', email: 'lucia@example.com', phone: '555-0104' },
    { id: '5', name: 'Sofia Martin', email: 'sofia@example.com', phone: '555-0105' },
];

export const MOCK_PROJECTS = [
    {
        id: '1',
        name: 'Vestido de Novia - Ana G.',
        clientName: 'Ana García',
        clientId: '1',
        status: 'Prueba',
        deadline: '2023-11-15',
        imageUrl: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=200',
        progress: 80,
    },
    {
        id: '2',
        name: 'Traje de Gala - Carlos R.',
        clientName: 'Carlos Ruiz',
        clientId: '2',
        status: 'Entrega',
        deadline: '2023-10-30',
        imageUrl: 'https://images.unsplash.com/photo-1593030761757-71bd90d39528?auto=format&fit=crop&q=80&w=200',
        progress: 40,
    },
    {
        id: '3',
        name: 'Ajuste Pantalón - Maria L.',
        clientName: 'Maria Lopez',
        clientId: '3',
        status: 'En Proceso',
        deadline: '2023-10-25',
        imageUrl: 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?auto=format&fit=crop&q=80&w=200',
        progress: 20,
    }
];

export const MOCK_APPOINTMENTS = [
    {
        id: '1',
        clientName: 'Ana García',
        clientId: '1',
        type: 'Prueba de Vestido',
        date: '2023-10-24', // Today for dashboard
        time: '10:00',
        notes: 'Primera prueba de ajuste',
    },
    {
        id: '2',
        clientName: 'Carlos Ruiz',
        clientId: '2',
        type: 'Toma de Medidas',
        date: '2023-10-24',
        time: '12:30',
        notes: 'Traje completo',
    },
    {
        id: '3',
        clientName: 'Maria Lopez',
        clientId: '3',
        type: 'Consulta Inicial',
        date: '2023-10-24',
        time: '16:00',
        notes: 'Consulta para vestido de fiesta',
    },
    {
        id: '4',
        clientName: 'Lucia Fernandez',
        clientId: '4',
        type: 'Entrega',
        date: '2023-10-24',
        time: '18:00',
        notes: 'Entrega final',
    },
    // Calendar specific dates (mock week Oct 5-11 2023 matches CalendarView hardcoded logic)
    {
        id: '5',
        clientName: 'Sofia Martin',
        clientId: '5',
        type: 'Prueba',
        date: '2023-10-07', // Saturday
        time: '11:00',
        notes: 'Ajuste de mangas',
    }
];
