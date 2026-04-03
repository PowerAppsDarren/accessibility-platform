# Codebase Structure

**Analysis Date:** 2026-04-03

## Directory Layout

```
accessibility-platform/
├── client/                    # React frontend application
│   ├── public/               # Static assets and Manus AI runtime
│   │   └── __manus__/       # Manus platform metadata
│   └── src/
│       ├── App.tsx          # Root component with routing and providers
│       ├── components/      # Reusable UI components
│       │   ├── ui/         # Shadcn/Radix UI primitives (60+ components)
│       │   ├── Layout.tsx   # Main navigation sidebar and layout wrapper
│       │   ├── RecordDialog.tsx  # Reusable CRUD dialog component
│       │   ├── DataTable.tsx     # Tabular data display
│       │   ├── DashboardLayout.tsx
│       │   ├── DataCard.tsx
│       │   ├── ErrorBoundary.tsx
│       │   ├── AIChatBox.tsx
│       │   ├── ManusDialog.tsx
│       │   └── Map.tsx
│       ├── contexts/        # React context providers
│       │   ├── DataContext.tsx    # Entity CRUD state and methods
│       │   └── ThemeContext.tsx   # Dark/light theme switching
│       ├── pages/           # Route-level page components
│       │   ├── Dashboard.tsx
│       │   ├── People.tsx
│       │   ├── Departments.tsx
│       │   ├── Websites.tsx
│       │   ├── Applications.tsx
│       │   ├── Settings.tsx
│       │   ├── NotFound.tsx
│       │   ├── Home.tsx
│       │   └── ComponentShowcase.tsx
│       ├── lib/             # Utilities and client setup
│       │   ├── trpc.ts      # tRPC React client initialization
│       │   ├── mockData.ts  # Mock data for development/fallback
│       │   └── utils.ts     # Tailwind className merge utility
│       ├── hooks/           # Custom React hooks
│       │   ├── useComposition.ts
│       │   ├── useMobile.tsx
│       │   └── usePersistFn.ts
│       ├── types/           # TypeScript type definitions
│       │   └── schema.ts    # Entity interfaces (Person, Department, Website, Application)
│       ├── _core/           # Core/internal utilities
│       │   └── hooks/
│       └── index.css        # Global styles and Tailwind imports
│
├── server/                   # Express backend application
│   ├── _core/               # Core server functionality
│   │   ├── index.ts         # Express app setup and server startup
│   │   ├── context.ts       # tRPC context creation (user extraction)
│   │   ├── trpc.ts          # tRPC setup with middleware (public/protected/admin)
│   │   ├── sdk.ts           # OAuth authentication service (Manus SDK)
│   │   ├── oauth.ts         # OAuth callback route registration
│   │   ├── cookies.ts       # Session cookie utilities
│   │   ├── vite.ts          # Vite dev server setup for development
│   │   ├── env.ts           # Environment variable validation
│   │   ├── systemRouter.ts  # System/internal endpoints
│   │   ├── llm.ts           # LLM integration (AI)
│   │   ├── imageGeneration.ts   # Image generation service
│   │   ├── voiceTranscription.ts # Speech-to-text service
│   │   ├── notification.ts  # Notification/alerting service
│   │   ├── map.ts           # Map/geolocation service
│   │   ├── dataApi.ts       # External data API wrapper
│   │   ├── storage.ts       # File storage abstraction (S3)
│   │   └── types/
│   │       ├── manusTypes.ts     # Manus OAuth types
│   │       └── cookie.d.ts       # Cookie type augmentation
│   ├── routers.ts           # tRPC router definitions for all entities
│   ├── db.ts                # Database query functions (Drizzle wrapper)
│   ├── index.ts             # Static file serving entry point
│   ├── storage.ts           # S3 integration for file uploads
│   └── auth.logout.test.ts  # Test for logout functionality
│
├── shared/                  # Shared code between client and server
│   ├── _core/               # Shared internal utilities
│   │   └── errors.ts        # Custom error classes
│   ├── const.ts             # Shared constants (COOKIE_NAME, error messages)
│   └── types.ts             # Shared TypeScript types
│
├── drizzle/                 # Database schema and migrations
│   ├── schema.ts            # Drizzle schema definitions (5 tables)
│   ├── relations.ts         # Drizzle relations (currently empty)
│   ├── migrations/          # Migration files directory
│   ├── meta/                # Drizzle metadata
│   ├── 0000_stormy_mindworm.sql  # Initial schema migration
│   └── 0001_melted_electro.sql   # Schema update migration
│
├── dist/                    # Production build output
│   └── public/              # Bundled client assets and server JS
│
├── .planning/               # GSD planning documents
│   └── codebase/           # Architecture documentation
│
├── .ai-chats/              # AI conversation history
├── patches/                 # pnpm patch files (wouter bug fix)
├── .vscode/                # VS Code workspace settings
├── vite.config.ts          # Vite bundler configuration
├── vitest.config.ts        # Vitest test runner configuration
├── tsconfig.json           # Root TypeScript configuration
├── tsconfig.node.json      # Node-specific TypeScript config
├── package.json            # Project dependencies and scripts
├── pnpm-lock.yaml          # Dependency lock file
├── drizzle.config.ts       # Drizzle ORM configuration
├── components.json         # Shadcn component library config
├── .prettierrc              # Code formatting rules
├── .prettierignore          # Prettier ignore patterns
├── .gitignore              # Git ignore rules
├── todo.md                 # Development notes
└── ideas.md                # Feature ideas and roadmap
```

## Directory Purposes

**`client/`:**
- Purpose: React frontend application bundled by Vite
- Contains: UI components, pages, contexts, hooks, utilities, styles
- Key files: `App.tsx` (root), `pages/` (route components), `lib/trpc.ts` (client setup)

**`client/src/components/`:**
- Purpose: Reusable React components organized by type
- Contains: UI primitives (60+ from Shadcn/Radix), feature components (Layout, RecordDialog, DataTable)
- Key files: `Layout.tsx` (navigation wrapper), `RecordDialog.tsx` (CRUD modal), `ErrorBoundary.tsx` (error catching)

**`client/src/components/ui/`:**
- Purpose: Unstyled Radix UI components with Tailwind styling
- Contains: Button, Input, Dialog, Table, Select, etc. (auto-generated from Shadcn)
- Pattern: Each component wraps Radix primitive with custom className bindings

**`client/src/contexts/`:**
- Purpose: React Context providers for global state
- Contains: DataContext (entity CRUD), ThemeContext (theme preference)
- Pattern: Each context exports Provider component and custom hook for consumption

**`client/src/pages/`:**
- Purpose: Full-page components mapped to routes
- Contains: Dashboard, People, Departments, Websites, Applications, Settings pages
- Pattern: Each page is its own data query + UI composition; imports components and hooks

**`client/src/lib/`:**
- Purpose: Setup and utilities for client-side concerns
- Contains: tRPC client initialization, mock data for development, utility functions
- Key files: `trpc.ts` (typed RPC client), `mockData.ts` (50+ records per entity)

**`client/src/hooks/`:**
- Purpose: Custom React hooks for reusable logic
- Contains: useComposition (managing component lifecycle), useMobile (responsive hooks), usePersistFn (function persistence)

**`client/src/types/`:**
- Purpose: TypeScript interface definitions for client entities
- Contains: Person, Department, Website, Application interfaces matching database schema
- Note: Imported from `drizzle/schema.ts` in newer code, but client copy exists for reference

**`server/`:**
- Purpose: Express.js backend API and server logic
- Contains: tRPC routers, database access layer, authentication, external service integrations
- Key files: `_core/index.ts` (server startup), `routers.ts` (API routes), `db.ts` (data access)

**`server/_core/`:**
- Purpose: Core backend functionality and utilities
- Contains: Express/tRPC setup, OAuth, database context, external integrations, config
- Key files: `index.ts` (startup), `trpc.ts` (procedure definitions), `sdk.ts` (auth), `context.ts` (middleware)

**`server/_core/index.ts`:**
- Purpose: Application bootstrap and HTTP server setup
- Responsibilities: Create Express app, register middleware, mount tRPC, setup Vite dev, find port, start listening
- Entry point for: `npm run dev` and `npm run start`

**`shared/`:**
- Purpose: Code and types shared between client and server
- Contains: Constants, error definitions, shared types
- Key files: `const.ts` (COOKIE_NAME, error messages), `_core/errors.ts` (error classes)

**`drizzle/`:**
- Purpose: Database schema definition and migration history
- Contains: Schema tables, migration SQL files, metadata
- Key files: `schema.ts` (5 tables: users, people, departments, websites, applications), migrations directory

**`drizzle/schema.ts`:**
- Purpose: Single source of truth for database structure
- Contains: Drizzle table definitions with columns, constraints, type exports
- Pattern: Each table exports both `Type` (SELECT result) and `InsertType` (INSERT input)

**`dist/`:**
- Purpose: Production build output directory
- Contains: Bundled client assets (`dist/public/`) and server JavaScript (`dist/index.js`)
- Generated by: `npm run build` command
- Committed: No, in `.gitignore`

**`.planning/codebase/`:**
- Purpose: GSD orchestrator documentation for architecture and structure analysis
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md (as needed)
- Used by: `/gsd:plan-phase` and `/gsd:execute-phase` commands

## Key File Locations

**Entry Points:**

- `server/_core/index.ts`: Express/Node.js entry point (startup)
- `client/src/App.tsx`: React root component and router setup
- `server/index.ts`: Static file serving in production
- `drizzle.config.ts`: Database configuration and migrations

**Configuration:**

- `tsconfig.json`: TypeScript compiler settings with path aliases (`@/`, `@shared/`)
- `vite.config.ts`: Frontend bundler configuration, dev server, build output
- `vitest.config.ts`: Test runner configuration
- `.prettierrc`: Code formatting rules (2-space indent)
- `components.json`: Shadcn UI config for auto-installing components
- `package.json`: Dependencies, scripts, package manager config

**Core Logic:**

- `server/routers.ts`: All tRPC API procedures (auth, CRUD for all entities)
- `server/db.ts`: Database wrapper functions using Drizzle ORM
- `server/_core/trpc.ts`: tRPC initialization with middleware (public/protected/admin procedures)
- `client/src/contexts/DataContext.tsx`: Client-side entity state management
- `drizzle/schema.ts`: Database schema with all table definitions

**Testing:**

- `server/auth.logout.test.ts`: Test for logout mutation
- `vitest.config.ts`: Test configuration
- Command: `npm run test`

**Styling:**

- `client/src/index.css`: Tailwind CSS imports and global styles
- `.prettierrc`: Code formatting (applies to TS/TSX/CSS)
- Tailwind classes applied via `className` props in React components

## Naming Conventions

**Files:**

- Components: `PascalCase.tsx` (e.g., `Layout.tsx`, `RecordDialog.tsx`)
- Utilities/Hooks: `camelCase.ts` (e.g., `trpc.ts`, `mockData.ts`)
- Directories: `lowercase` for grouping (e.g., `components/`, `pages/`, `_core/`)
- Schema/Types: Named exports (e.g., `export type Person = ...`)
- Migrations: `{sequenceNumber}_{name}.sql` (e.g., `0000_stormy_mindworm.sql`)

**Directories:**

- Prefixed with `_` for internal/core utilities: `_core/` (indicates not part of public API structure)
- Plural for collections: `components/`, `contexts/`, `pages/`, `hooks/`
- `ui/` for primitive UI components (Shadcn/Radix)

**TypeScript:**

- Types/Interfaces: `PascalCase` (e.g., `Person`, `Department`, `InsertUser`)
- Variables/Constants: `camelCase` for variables, `UPPER_SNAKE_CASE` for constants (e.g., `COOKIE_NAME`)
- Database columns: `camelCase` to match JavaScript conventions (e.g., `firstName`, `departmentId`, `lastSignedIn`)
- Functions: `camelCase` (e.g., `getAllPeople`, `createPerson`, `getDb`)

## Where to Add New Code

**New Feature (e.g., New Listing Page):**

1. **Database:**
   - Add table to `drizzle/schema.ts`
   - Add CRUD functions to `server/db.ts`
   - Run `npm run db:push` to migrate

2. **API:**
   - Add router to `server/routers.ts` following pattern: `list`, `getById`, `create`, `update`, `delete`
   - Use `protectedProcedure` and Zod validation
   - Route the queries/mutations to `server/db.ts` functions

3. **Frontend:**
   - Create page component in `client/src/pages/{Entity}.tsx`
   - Import and use `trpc.{entity}.list.useQuery()`, etc.
   - Import `RecordDialog` for create/edit modal
   - Add route to `client/src/App.tsx` Router component
   - Add navigation item to `Layout.tsx` navItems array

**New Component:**

- Reusable components: `client/src/components/{ComponentName}.tsx`
- UI primitives: Use existing components in `client/src/components/ui/` or install via Shadcn
- Context/State: If component needs shared state, add to `client/src/contexts/` and wrap App with provider

**Utilities/Helpers:**

- Server utilities: `server/_core/{concern}.ts` (e.g., `server/_core/validation.ts`)
- Client utilities: `client/src/lib/{concern}.ts` (e.g., `client/src/lib/formatting.ts`)
- Shared utilities: `shared/` (for code used by both client and server)

**Tests:**

- Unit/integration tests: `{dirname}/{filename}.test.ts` (co-located with source)
- Run: `npm run test`
- Framework: Vitest with standard assertion syntax

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD orchestrator documentation
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md
- Generated: Yes (created by `/gsd:map-codebase` command)
- Committed: Yes (part of project docs)

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (created by `pnpm install`)
- Committed: No (in .gitignore)

**`dist/`:**
- Purpose: Production build artifacts
- Contents: `dist/index.js` (server), `dist/public/` (bundled client)
- Generated: Yes (created by `npm run build`)
- Committed: No (in .gitignore)

**`drizzle/migrations/`:**
- Purpose: SQL migration files tracked in source control
- Contents: SQL files generated by `drizzle-kit` from schema changes
- Generated: Yes (by drizzle-kit generate)
- Committed: Yes (migrations must be version controlled)

**`.vscode/`:**
- Purpose: Workspace-specific VS Code settings
- Contents: Custom theme, extensions, formatting rules
- Generated: No (manually created/updated)
- Committed: Yes (shared team settings)

**`.ai-chats/`:**
- Purpose: AI conversation history and context
- Contents: Claude conversation logs and exchanges
- Generated: Yes (automatically by Claude Code)
- Committed: Yes (for continuity across sessions)

---

*Structure analysis: 2026-04-03*
