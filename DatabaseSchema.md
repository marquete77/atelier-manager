# Esquema de Base de Datos - Atelier Manager

Este documento define la estructura de la base de datos para la aplicación Atelier Manager, diseñada para Supabase (PostgreSQL).

## Principios de Diseño
- **Multi-tenancy**: Todas las tablas incluyen `user_id` para implementar Row Level Security (RLS) y aislar los datos de cada artesano.
- **Agnóstico del Frontend**: El esquema está diseñado para ser consumido por una API (Node.js) o directamente por el cliente (Supabase), permitiendo la transición a un backend dedicado sin cambios estructurales.
- **Flexibilidad**: Uso de `JSONB` para estructuras de datos variables como medidas y tareas de arreglos.
- **Auditoría**: Todas las tablas incluyen `created_at` y `updated_at`.

## Tablas

### 1. `clients` (Clientes)
Almacena la información de los clientes del taller.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key (default: `gen_random_uuid()`) |
| `user_id` | `uuid` | Foreign Key a `auth.users`. Obligatorio para RLS. |
| `full_name` | `text` | Nombre completo del cliente. |
| `phone` | `text` | Teléfono de contacto. |
| `email` | `text` | Email del cliente (opcional). |
| `address` | `text` | Dirección física. |
| `address_link` | `text` | Enlace de Google Maps / WhatsApp. |
| `notes` | `text` | Notas generales sobre el cliente. |
| `created_at` | `timestamptz` | Fecha de creación. |
| `updated_at` | `timestamptz` | Fecha de última actualización. |

### 2. `projects` (Proyectos)
Representa un trabajo específico, ya sea una confección a medida o un arreglo.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key. |
| `user_id` | `uuid` | Foreign Key a `auth.users`. |
| `client_id` | `uuid` | Foreign Key a `clients`. |
| `title` | `text` | Título del proyecto (ej. "Vestido de Novia"). |
| `description` | `text` | Descripción opcional. |
| `type` | `text` | Enum: `'confection'`, `'alteration'`. |
| `status` | `text` | Enum: `'pending'`, `'in_progress'`, `'completed'`, `'delivered'`. Default: `'pending'`. |
| `deadline` | `date` | Fecha de entrega comprometida. |
| `total_cost` | `numeric` | Costo total del proyecto. |
| `deposit` | `numeric` | Monto del anticipo/seña abonado. |
| `is_paid` | `boolean` | Indica si el proyecto está totalmente pagado. Default: `false`. |
| `images` | `text[]` | Array de URLs de imágenes de referencia. |
| `created_at` | `timestamptz` | Fecha de creación. |

### 3. `measurements` (Medidas)
Almacena las medidas corporales vinculadas a un proyecto o cliente.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key. |
| `user_id` | `uuid` | Foreign Key a `auth.users`. |
| `client_id` | `uuid` | Foreign Key a `clients`. |
| `project_id` | `uuid` | Foreign Key a `projects` (Opcional, si es específico de una prenda). |
| `values` | `jsonb` | Objeto con las medidas (ej. `{"busto": 90, "cintura": 60}`). |
| `notes` | `text` | Notas técnicas sobre las medidas o cuerpo. |
| `images` | `text[]` | Array de URLs de imágenes de referencia. |
| `created_at` | `timestamptz` | Fecha de creación. |

### 4. `alterations` (Detalles de Arreglos)
Detalles específicos para proyectos de tipo `alteration`.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key. |
| `user_id` | `uuid` | Foreign Key a `auth.users`. |
| `project_id` | `uuid` | Foreign Key a `projects`. |
| `garment_type`| `text` | Tipo de prenda (ej. 'pantalon', 'falda'). |
| `tasks` | `jsonb` | Lista de tareas (ej. `[{"name": "Basta", "price": 10}]`). |
| `notes` | `text` | Instrucciones específicas de costura. |
| `evidence_images`| `text[]` | Array de URLs de fotos del estado inicial ("antes"). |
| `created_at` | `timestamptz` | Fecha de creación. |

### 5. `appointments` (Citas/Agenda)
Gestiona el calendario del taller.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key. |
| `user_id` | `uuid` | Foreign Key a `auth.users`. |
| `client_id` | `uuid` | Foreign Key a `clients` (Opcional). |
| `project_id` | `uuid` | Foreign Key a `projects` (Opcional, para vincular a prueba/entrega). |
| `type` | `text` | Enum: `'fitting'`, `'delivery'`, `'consultation'`, `'measurement'`. |
| `status` | `text` | Enum: `'scheduled'`, `'confirmed'`, `'cancelled'`, `'completed'`. Default: `'scheduled'`. |
| `start_time` | `timestamptz` | Fecha y hora de inicio. |
| `end_time` | `timestamptz` | Fecha y hora de fin. |
| `title` | `text` | Título visible en el calendario. |
| `notes` | `text` | Notas internas de la cita. |
| `created_at` | `timestamptz` | Fecha de creación. |

## Relaciones Clave

- Un `User` tiene muchos `Clients`.
- Un `Client` tiene muchos `Projects`.
- Un `Project` tiene una o muchas `Measurements` (histórico) y `Alterations`.
- Un `Project` puede tener muchas `Appointments` (pruebas, entregas).

## Fase 2: Portal de Clientes (Propuesta)

Para habilitar la "Vista de Cliente" sin separar la base de datos, se proponen las siguientes extensiones. Esto confirma el enfoque monolítico ya que los clientes y artesanos comparten el mismo núcleo de datos.

### 1. Extensión `clients` (Vinculación de Usuarios)
Para que un cliente pueda loguearse y ver *solo* sus datos.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `portal_user_id` | `uuid` | Foreign Key a `auth.users`. Permite vincular un registro de cliente creado por el artesano con un usuario real registrado. Nullable. |
| `access_token` | `text` | Token único para acceso temporal o "magic link" sin registro completo inicial. |

### 2. Nueva Tabla `client_interactions` (Feedback y Fallos)
Centraliza toda la comunicación entrante del cliente (imágenes, reportes de fallos, notas).

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key. |
| `project_id` | `uuid` | Foreign Key a `projects`. |
| `client_id` | `uuid` | Foreign Key a `clients` (quien envía). |
| `type` | `text` | Enum: `'reference_image'`, `'issue_report'`, `'note'`. |
| `content` | `text` | Texto de la nota o descripción del problema. |
| `attachment_url` | `text` | URL de la imagen subida (si aplica). |
| `status` | `text` | Enum: `'new'`, `'reviewed'`, `'resolved'`. |
| `created_at` | `timestamptz` | Fecha de envío. |

### 3. Modificación `appointments` (Solicitud de Citas)
Permite que el cliente proponga citas.

- **Nuevo Campo**: `origin` (`text`): Enum `'artisan'` (creado por el taller) o `'client_request'` (solicitado por cliente).
- **Nuevo Estado**: `requested` en el campo `status` existente, para citas que requieren aprobación del artesano.

