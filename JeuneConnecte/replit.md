# Jeunesse Connectée – ACPE PHILADELPHIE

## Overview

Jeunesse Connectée is a church youth management application for ACPE PHILADELPHIE. This Progressive Web App (PWA) provides comprehensive tools for managing youth group members, tracking attendance, handling financial contributions, and organizing activities. The application is designed with a mobile-first approach, featuring Material Design principles for optimal data management and user experience.

**Key Features:**
- Member profile management with photos and roles
- Financial contribution tracking with monthly statistics (500 FCFA members, 1000 FCFA leaders)
- Service attendance monitoring across 4 service types (Méditation Mardi, Exhortation Jeudi, Louange Dimanche, Activités)
- Activity planning and participant management
- Dashboard with real-time statistics and insights
- Offline-capable PWA with service worker caching
- Fully responsive mobile-first design with bottom navigation

**Target Users:** Church youth group leaders and administrators managing the Jeune pour Christ ACPE PHILADELPHIE community.

## Current Status

**✅ Application Complete and Functional** (November 14, 2025)

All core features have been implemented and tested successfully:
- ✅ Beautiful French-language UI with church colors (bleu ciel #87CEEB, jaune #FFD700)
- ✅ Complete member management system with profile details, photos, and role tracking
- ✅ Treasury tracking with contribution stats, monthly charts, and payment history
- ✅ Attendance recording system supporting bulk entry across all 4 service types
- ✅ Activity management with upcoming/past filters and participant tracking
- ✅ Dashboard with real-time statistics (total members, monthly contributions, attendance rate, upcoming activities)
- ✅ PostgreSQL database with seed data (15 sample members, contributions, attendances, activities)
- ✅ PWA features: installable on mobile, service worker with offline caching
- ✅ Strongly typed throughout with TypeScript (no `any` types in storage layer)
- ✅ End-to-end testing validated all main user workflows

**Application is ready for deployment and real-world use.**

## Recent Changes

**November 14, 2025:**
1. Fixed all storage layer typing - replaced `any` with proper TypeScript interfaces
2. Implemented proper cache invalidation for attendance mutations
3. Enhanced service worker with network-first strategy for API calls and offline fallback
4. Fixed contribution stats to properly calculate `upToDate` members (distinct count of members who paid current month)
5. Connected attendance page to backend with bulk mutation support
6. Successfully tested all main workflows end-to-end with Playwright

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing:**
- React 18+ with TypeScript for type safety
- Wouter for lightweight client-side routing
- Vite as the build tool and development server

**UI Component System:**
- Shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Mobile-first responsive design with bottom navigation pattern
- Typography system using Inter (body) and Poppins (headers) from Google Fonts

**State Management:**
- TanStack Query (React Query) for server state management
- Query client configured with infinite stale time and disabled auto-refetching
- Custom hooks pattern for data mutations (useMembers, useContributions, useAttendances, useActivities)

**Design Philosophy:**
- Material Design principles for data-dense interfaces
- Consistent spacing using Tailwind units (2, 4, 6, 8, 12, 16)
- Custom elevation system with hover and active states
- Sky blue primary color (#87CEEB) with neutral base colors
- Comprehensive toast notification system for user feedback

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Custom middleware for request logging and JSON parsing
- Raw body capture for webhook verification support
- Environment-based configuration (NODE_ENV)

**API Design Pattern:**
- RESTful API endpoints organized by resource (/api/members, /api/contributions, /api/attendances, /api/activities)
- CRUD operations with standardized error handling
- Zod schema validation on all incoming data
- Consistent JSON response format
- Storage layer abstraction for database operations

**Database Layer:**
- Drizzle ORM for type-safe database queries
- Neon Serverless PostgreSQL with WebSocket support
- Schema-first approach with TypeScript types generated from database schema
- Relational data modeling with foreign key constraints and cascade deletes
- Database migrations managed via drizzle-kit

**Data Models:**
- **Members:** Profile information, church roles, external roles, leadership status
- **Contributions:** Monthly financial tracking with amounts (500 FCFA or 1000 FCFA)
- **Attendances:** Service participation tracking across multiple service types (Sunday worship, Bible study, prayer meetings, youth meetings, special events)
- **Activities:** Event planning with dates, descriptions, locations, and responsible leaders
- **Activity Participants:** Many-to-many relationship between activities and members

### Build & Deployment

**Development:**
- TSX for running TypeScript server in development
- Vite dev server with HMR (Hot Module Replacement)
- Replit-specific plugins for runtime error overlay and cartographer
- Separate client and server compilation

**Production Build:**
- Vite builds client-side React application to dist/public
- esbuild bundles Express server to dist with ESM format
- External package bundling for node_modules
- Static file serving of built client assets

### Progressive Web App (PWA)

**Service Worker Strategy:**
- Cache-first strategy for static assets
- Network-first with cache fallback for API requests
- Versioned cache management (jeunesse-connectee-v1)
- Automatic service worker updates with skipWaiting

**Manifest Configuration:**
- Standalone display mode for app-like experience
- Portrait orientation lock
- French language (fr-FR) as primary
- Custom theme color matching primary brand color
- Installable on mobile devices with custom icons

## External Dependencies

### Core Libraries

**UI & Styling:**
- @radix-ui/* - Comprehensive set of accessible, unstyled UI primitives
- tailwindcss - Utility-first CSS framework
- class-variance-authority - Type-safe variant styling
- clsx & tailwind-merge - Conditional className utilities
- lucide-react - Icon library

**Data Management:**
- @tanstack/react-query - Asynchronous state management
- react-hook-form - Form state management
- @hookform/resolvers - Form validation with Zod
- zod - Schema validation
- drizzle-zod - Zod schema generation from Drizzle schemas

**Database & ORM:**
- drizzle-orm - TypeScript ORM
- @neondatabase/serverless - Neon PostgreSQL serverless driver
- ws - WebSocket library for Neon database connections
- connect-pg-simple - PostgreSQL session store (ready for future auth integration)

**Charts & Visualization:**
- recharts - Composable charting library for financial data visualization

**Date & Time:**
- date-fns - Modern JavaScript date utility library

**Build Tools:**
- vite - Frontend build tool
- esbuild - JavaScript bundler for server
- tsx - TypeScript execution engine
- @vitejs/plugin-react - React plugin for Vite

**Development Tools:**
- @replit/vite-plugin-runtime-error-modal - Runtime error overlay
- @replit/vite-plugin-cartographer - Code exploration tool
- @replit/vite-plugin-dev-banner - Development banner

### Third-Party Services

**Database:**
- Neon Serverless PostgreSQL - Cloud-native PostgreSQL with automatic scaling and branching

**Fonts:**
- Google Fonts API - Inter and Poppins font families

**Future Integrations (Prepared but not implemented):**
- Session management infrastructure via connect-pg-simple
- Authentication system (schema ready, routes not implemented)
- Photo upload capabilities (schema includes photoUrl fields)