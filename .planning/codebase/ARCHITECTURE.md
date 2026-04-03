# Architecture

**Analysis Date:** 2026-04-03

## Pattern Overview

**Overall:** Full-stack monorepo with separated client and server layers using tRPC for client-server communication, Express.js backend, and React frontend with Vite. The architecture follows a modular pattern with shared types across the boundary.

**Key Characteristics:**
- Client-Server separation with tRPC bridging both layers
- Procedural routing (tRPC routers) on backend, declarative routing (wouter) on frontend
- Database-first schema with Drizzle ORM
- Strong type safety through TypeScript with shared schema imports
- Context-based middleware for authentication and authorization
- OAuth-based authentication with session cookies
- Modular page/feature architecture with reusable CRUD components

## Layers

**Presentation Layer (Client):**
- Purpose: React UI components rendered in the browser, handles user interactions and displays data
- Location: `client/src/`
- Contains: Pages (`pages/`), components (`components/`), contexts (`contexts/`), hooks (`hooks/`), utilities (`lib/`)
- Depends on: tRPC client (`@trpc/react-query`), contexts (ThemeContext, DataContext), database schema for types
- Used by: Browser consumers; entry point is `client/src/App.tsx`

**API Layer (tRPC Routers):**
- Purpose: Defines all available RPC procedures with input validation and authorization checks
- Location: `server/routers.ts`, `server/_core/trpc.ts`
- Contains: Router definitions (public, protected, admin procedures), CRUD mutations and queries with Zod schema validation
- Depends on: Database layer (`server/db.ts`), TRPC primitives, context (user info)
- Used by: Client applications via tRPC client

**Application/Business Logic Layer:**
- Purpose: Core server functionality including authentication, data access, and external integrations
- Location: `server/_core/`
- Contains: SDK (authentication), context creation, environment config, external integrations (OAuth, LLM, image generation, voice, maps, notifications)
- Depends on: Database layer, external APIs/services
- Used by: Router layer, Express middleware

**Data Access Layer (Database):**
- Purpose: Abstraction over direct database operations using Drizzle ORM
- Location: `server/db.ts`
- Contains: CRUD functions for all entities (users, people, departments, websites, applications)
- Depends on: Drizzle ORM, schema definitions (`drizzle/schema.ts`)
- Used by: Router layer for all data mutations and queries

**Data Layer (Schema & Persistence):**
- Purpose: Database schema definition and actual MySQL persistence
- Location: `drizzle/schema.ts`, database (MySQL)
- Contains: Table definitions for users, people, departments, websites, applications with typed exports
- Depends on: MySQL database connection
- Used by: Drizzle ORM and all data access functions

**Shared Layer:**
- Purpose: Shared types, constants, and utilities across client and server
- Location: `shared/`
- Contains: Constants (`const.ts`), error definitions (`_core/errors.ts`), types (`types.ts`)
- Depends on: None
- Used by: Both client and server for type-safe communication

## Data Flow

**User Authentication Flow:**

1. User visits app in browser
2. `client/src/App.tsx` renders within `ErrorBoundary`, `ThemeProvider`, `DataProvider`
3. `Layout` component wraps routes with navigation sidebar
4. On first render, `App.tsx` implicitly loads context which checks authentication
5. tRPC client configured in `client/src/lib/trpc.ts` creates typed hooks
6. OAuth callback flow: Express middleware in `server/_core/index.ts` registers OAuth routes
7. OAuth handler exchanges code for token, creates session cookie
8. Subsequent requests include session cookie, `createContext` (at `server/_core/context.ts`) verifies user

**Data Read Flow (Example: Fetching People):**

1. Page component (`client/src/pages/People.tsx`) calls `trpc.people.list.useQuery()`
2. tRPC hook triggers query to `server/routers.ts` → `people.list` procedure
3. Procedure is `protectedProcedure` (requires authentication via middleware at `server/_core/trpc.ts`)
4. Procedure calls `db.getAllPeople()` from `server/db.ts`
5. `db.getAllPeople()` executes Drizzle query against MySQL using schema from `drizzle/schema.ts`
6. Results returned as typed Person objects, serialized with superjson, sent to client
7. Client component receives data, renders with UI components from `client/src/components/`

**Data Write Flow (Example: Creating Person):**

1. User submits form in `RecordDialog` component (`client/src/components/RecordDialog.tsx`)
2. Page handler calls `createPerson.mutate(data)` with form data
3. tRPC mutation routes to `server/routers.ts` → `people.create` procedure
4. Procedure validates input with Zod schema: name, lastName, departmentId, etc.
5. Valid data passed to `db.createPerson()` in `server/db.ts`
6. Function executes INSERT via Drizzle ORM
7. Returns ID of created record
8. Client mutation handler receives success, triggers toast notification (via Sonner), refetches list
9. UI updates automatically through React Query cache invalidation

**State Management:**

- **Server State:** MySQL database, source of truth; accessed via tRPC procedures
- **Client State:** React Query caches tRPC responses automatically; local UI state in components via `useState`
- **Context State:** 
  - `ThemeContext` (`client/src/contexts/ThemeContext.tsx`): theme preference (light/dark)
  - `DataContext` (`client/src/contexts/DataContext.tsx`): manages local copies of entities for UI consistency
- **Authentication State:** Stored in HTTP-only session cookie (server-managed), user object available via `trpc.auth.me` query

## Key Abstractions

**tRPC Router Structure:**

- Purpose: Centralized API definition with type-safe client/server boundary
- Examples: `server/routers.ts` defines `appRouter` with nested routers (auth, departments, people, websites, applications, system)
- Pattern: Each entity has list, getById, create, update, delete procedures with consistent naming and Zod validation

**Protected Procedures:**

- Purpose: Middleware-based authorization ensuring only authenticated users can access sensitive operations
- Examples: `server/_core/trpc.ts` exports `publicProcedure`, `protectedProcedure`, `adminProcedure`
- Pattern: Middleware checks `ctx.user` and throws `TRPCError` if unauthorized

**Reusable CRUD Component:**

- Purpose: Standardized dialog component for creating and editing any entity type
- Example: `client/src/components/RecordDialog.tsx`
- Pattern: Accepts title, form children, onSave, onDelete callbacks; used by People, Departments, Websites, Applications pages

**Database Wrapper Layer:**

- Purpose: Encapsulates Drizzle ORM operations, provides consistent error handling and null-database fallback
- Example: `server/db.ts` exports functions like `getAllPeople()`, `createDepartment()`, etc.
- Pattern: Lazy initialization with `getDb()` function; returns null if database unavailable (local development)

**tRPC Client Hook:**

- Purpose: Type-safe RPC client for React components
- Example: `client/src/lib/trpc.ts` exports `trpc` instance
- Pattern: Used as `trpc.people.list.useQuery()`, `trpc.people.create.useMutation()` for automatic loading/error states

**Entity Schema Types:**

- Purpose: Single source of truth for entity structure across database, API, and UI
- Examples: `Person`, `Department`, `Website`, `Application` types exported from `drizzle/schema.ts`
- Pattern: Drizzle exports both `Type` (select) and `InsertType` (insert) variants; client imports for form validation

**Context Providers:**

- Purpose: Establish boundaries for feature areas and state distribution
- Examples: `DataProvider` wraps application and provides CRUD methods and entity lists to all child components
- Pattern: React Context with custom hooks (`useDataContext()`) for accessing shared state

## Entry Points

**Server Entry Point:**

- Location: `server/_core/index.ts`
- Triggers: Node.js process starts (via `npm run dev` or `npm start`)
- Responsibilities: 
  - Create Express app and HTTP server
  - Register OAuth routes at `/api/oauth/callback`
  - Mount tRPC middleware at `/api/trpc`
  - Setup Vite for development or static file serving for production
  - Find available port and start listening

**Client Entry Point:**

- Location: `client/src/App.tsx` (via Vite root at `client/`)
- Triggers: Browser loads page, Vite/bundler executes client code
- Responsibilities:
  - Wrap application with error boundary
  - Setup theme provider and data provider contexts
  - Mount router with wouter, define all routes
  - Render Layout wrapper with navigation sidebar

**Database Initialization:**

- Location: `drizzle.config.ts` and migrations in `drizzle/`
- Triggers: `npm run db:push` command (manual developer action)
- Responsibilities: Generate SQL migrations from schema, apply to MySQL database

## Error Handling

**Strategy:** Layered error handling with tRPC error codes on API boundary, try-catch in data layer, error boundaries in UI

**Patterns:**

- **API Errors:** tRPC throws `TRPCError` with code (UNAUTHORIZED, FORBIDDEN, etc.) and message; client receives as error state in React Query
- **Database Errors:** `server/db.ts` functions wrap operations in try-catch, log errors, throw for caller to handle or re-throw
- **Client Errors:** Components use React Query's `error` state from query/mutation hooks; display via toast (Sonner) or fallback UI
- **UI Errors:** `ErrorBoundary` component (`client/src/components/ErrorBoundary.tsx`) catches React rendering errors, displays fallback UI
- **Validation Errors:** Zod schemas in routers validate input, tRPC returns validation errors to client for display near form fields

## Cross-Cutting Concerns

**Logging:** Console-based via `console.log`, `console.error`, `console.warn` in server code; no centralized logging service integrated yet

**Validation:** 
- Backend: Zod schemas in `server/routers.ts` validate all tRPC inputs
- Frontend: React Hook Form with custom validation; client-side checks before submission

**Authentication:** 
- Mechanism: OAuth via `server/_core/sdk.ts` and `server/_core/oauth.ts`
- Session: HTTP-only cookie (COOKIE_NAME from `shared/const.ts`) set on successful auth
- Verification: `createContext` middleware checks cookie on every request, extracts user info

**Type Safety:**
- Database types flow from Drizzle schema via TypeScript type inference
- tRPC maintains end-to-end types: input validation schema and return types defined in router
- Client imports types directly from server router (`AppRouter` type) for IDE autocompletion

---

*Architecture analysis: 2026-04-03*
