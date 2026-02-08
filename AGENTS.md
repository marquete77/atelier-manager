## AGENTS.md

Proyecto: Atelier Manager

Rol del agente: Desarrollador Senior Fullstack y Arquitecto de Producto con enfoque en UX para artesanos.

Objetivo: Crear una aplicación web (PWA) para la gestión integral de pequeños talleres de costura unipersonales. La app debe centralizar citas, clientes y medidas técnicas, eliminando la necesidad de cuadernos físicos.

Datos importantes: 
 - Nombre del proyecto: Atelier Manager 
 - Público objetivo: Sastres y costureras independientes (Solopreneurs) 
 - Idioma: Todos los textos visibles en la aplicación deben estar en español

Funcionalidades de la aplicación:
 - Gestión de Clientes: 
  - Listado de clientes con buscador rápido por nombre o teléfono 
  - Ficha detallada con historial de trabajos y datos de contacto 
 - Registro de Medidas: 
  - Formulario técnico estructurado por bloques (Superior, Inferior, Mangas) 
  - Capacidad de consulta rápida y visualización clara de datos numéricos
 - Registro de Arreglos: 
  - Registro de tareas específicas: bastas, entalles, cambio de cierres, hombreras, etc.
  - Capacidad de consulta rápida y visualización clara de datos numéricos
 - Agenda de Citas: 
  - Calendario interactivo con vista semanal y mensual 
  - Registro de citas vinculado a clientes con estado de entrega 
 - Dashboard: 
  - Panel principal con resumen de tareas del día y próximas entregas

Backend:
 - Base de datos y autenticación en Supabase
 - Login y registro de usuario para proteger los datos de los clientes

Consideraciones: 
 - La edición de medidas y creación de citas debe poder gestionarse en ventanas modales
 - El diseño de las modales debe ser coherente con la estética general de la aplicación 
 - El buscador debe ser accesible desde cualquier parte de la navegación principal

Stack tecnológico: 
 - React con TypeScript 
 - Vite para el entorno de desarrollo 
 - Supabase (DB & Auth)
 - CSS Modules para estilos (CSS nativo en la medida de lo posible)
 - MUI (Material UI) para componentes base 
 - Lucide React para iconografía 
 - FullCalendar para la gestión de la agenda

Preferencias de diseño: 
 - Estilo creativo, limpio y sofisticado que evoque un taller de alta costura 
 - Uso de bordes redondeados (12px) y sombras suaves (Soft UI)
 - Diseño Mobile First para uso cómodo mientras se toman medidas

Preferencias de estilos: 
 - Eliminar TailwindCSS y usar CSS nativo o los estilos de sistema de MUI 
 - Colores: Primario Terracotta (#B25B52), Fondo Linen (#F5F5F0), Texto Charcoal (#2C3E50) 
 - Uso de medidas con rem, con un font-size base de 10px 
 - Tipografía: Playfair Display para títulos y Inter para cuerpo de texto 
 - Que la webapp sea responsive

Preferencias de código:
 - HTML debe ser semántico
 - No uses alert, confirm o prompt; todo el feedback debe ser visual en el DOM (Snackbars o Modales) 
 - Tipado estricto con TypeScript para evitar errores en las medidas 
 - Prioriza código legible, sencillo y fácil de mantener

Estructura de archivos: 
 - Organizar por carpetas de componentes, hooks, servicios y vistas 
 - Mantener la lógica de negocio separada de la interfaz visual

