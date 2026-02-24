# Atelier Manager

## 1. Project Overview
- **Project Name**: Atelier Manager
- **Target Audience**: Independent Tailors and Seamstresses (Solopreneurs)
- **Role**: Senior Fullstack Developer and Product Architect with a focus on UX for artisans.
- **Language**: All user-facing text must be in Spanish.

## 2. Objective
Create a Progressive Web App (PWA) for the comprehensive management of small, one-person sewing workshops. The app should centralize appointments, clients, and technical measurements, eliminating the need for physical notebooks.

## 3. Core Functionalities

### Client Management
- **List View**: Rapid search by name or phone number.
- **Detailed Profile**: Work history and contact details.

### Measurement Records
- **Structured Forms**: Technical forms grouped by sections (Upper Body, Lower Body, Sleeves).
- **Quick Access**: Clear visualization of numerical data for easy consultation.

### Alteration Records
- **Specific Tasks**: Hems, taking in, zipper replacement, shoulder pads, etc.
- **Data Visualization**: Clear presentation for quick reference.

### Appointment Agenda
- **Interactive Calendar**: Weekly and monthly views.
- **Appointment Tracking**: Linked to clients with delivery status.

### Dashboard
- **Main Panel**: Daily task summary and upcoming deliveries.

## 4. Technical Architecture

### Backend Strategy
- **Architecture**: Decoupled.
- **Phase 1**: Backend-as-a-Service using Supabase (PostgreSQL + Auth).
- **Phase 2**: Dedicated Node.js API for complex logic (payments, multi-account support).
- **Security**: Row Level Security (RLS) and Supabase Auth.
- **Authentication**: User login/registration to protect client data.

### Tech Stack
- **Frontend**: React with TypeScript.
- **Build Tool**: Vite.
- **Backend/DB**: Supabase (Database & Auth).
- **Styling**: CSS Modules (preferred over TailwindCSS), Material UI (MUI) for base components.
- **Icons**: Lucide React.
- **Calendar**: FullCalendar.

## 5. Design & UI/UX Guidelines

### Design Philosophy
- **Style**: Creative, clean, and sophisticated, evoking a high-fashion atelier.
- **Visuals**: Rounded borders (12px), soft shadows (Soft UI).
- **Mobile First**: Optimized for comfortable use while taking measurements.

### Styling Preferences
- **Framework**: Native CSS or MUI system styles (No TailwindCSS).
- **Color Palette**:
    - **Primary**: Terracotta (`#B25B52`)
    - **Background**: Linen (`#F5F5F0`)
    - **Text**: Charcoal (`#2C3E50`)
- **Typography**:
    - **Titles**: Playfair Display
    - **Body**: Inter
- **Units**: `rem` based measurements (base font-size: 10px).
- **Responsiveness**: Fully responsive web app.

### UX Considerations
- **Modals**: Measurement editing and appointment creation must be handled in modals consistent with the app's aesthetic.
- **Navigation**: Search must be accessible from anywhere in the main navigation.
- **Feedback**: No `alert`, `confirm`, or `prompt`. All feedback must be visual within the DOM (Snackbars or Modals).

## 6. Code Preferences
- **HTML**: Semantic HTML.
- **Type Safety**: Strict TypeScript to avoid measurement errors.
- ** readability**: Prioritize legible, simple, and maintainable code.

## 7. File Structure
- Organize by feature/type: components, hooks, services, views.
- **Separation of Concerns**: Keep business logic separate from UI components.

