# Estructura del Proyecto: Atelier Manager

Este documento sirve como referencia para la arquitectura de "Monorepo Lógico" adoptada. Mantenemos una separación estricta entre Frontend y Backend dentro del mismo repositorio.

## Árbol de Directorios

```text
/atelier-manager
├── .env                 # Variables de entorno (API Keys, URLs)
├── package.json         # Dependencias del Frontend y scripts globales
├── tsconfig.json        # Configuración de TypeScript
├── AGENTS.md            # Documentación maestra del proyecto
├── DatabaseSchema.md    # Documentación viva de la Base de Datos

├── /supabase            # [[ EL PROYECTO BACKEND ]]
│   ├── config.toml      # Configuración de Supabase local (si usas CLI)
│   ├── /migrations      # Historial de cambios en la BD (SQL puro)
│   │   ├── 001_initial_schema.sql
│   │   └── 002_client_portal.sql
│   └── /functions       # Edge Functions (Futuro: Lógica Node.js/Deno)
│       └── send-email   # Ejemplo: Función para enviar correos

├── /src                 # [[ EL PROYECTO FRONTEND - REACT ]]
│   ├── main.tsx         # Punto de entrada de React
│   ├── App.tsx          # Router principal
│   │
│   ├── /config          # Configuración del cliente
│   │   └── supabase.ts  # Cliente único de Supabase (puente Front-Back)
│   │
│   ├── /types           # Tipos compartidos (Contrato de Datos)
│   │   └── database.ts  # Interfaces de TypeScript generadas desde SQL (npm run update-types)
│   │
│   ├── /hooks           # Lógica reutilizable (React Hooks: useAuth, useClients)
│   ├── /utils           # Funciones puras (formateo moneda, fechas)
│   │
│   ├── /services        # Capa de API (Aquí se piden los datos)
│   │   ├── client.service.ts  # "Dame todos los clientes"
│   │   └── project.service.ts # "Crea un nuevo proyecto"
│   │
│   ├── /views           # Páginas (Vistas)
│   │   ├── Dashboard/
│   │   ├── Clients/
│   │   └── Calendar/
│   │
│   └── /components      # Componentes UI reutilizables
│       ├── UI/          # Botones, Inputs, Modales genéricos
│       └── Domain/      # Cards de Proyecto, Fichas de Cliente
```

## Notas Clave

1.  **Backend (`/supabase`)**:
    *   Aquí reside la **verdad**. Si cambia la estructura de datos, empieza cambiando el SQL en `/migrations`.
    *   Usa `npm run update-types` para propagar estos cambios al Frontend.

2.  **Frontend (`/src`)**:
    *   **Tipos**: `src/types/database.ts` es intocable manualmente; se genera automáticamente.
    *   **Servicios**: La lógica de "pedir datos" vive en `/services`, no en los componentes visuales.
