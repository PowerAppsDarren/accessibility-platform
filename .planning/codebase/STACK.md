# Technology Stack

**Analysis Date:** 2026-04-03

## Languages

**Primary:**
- TypeScript 5.9.3 - Full codebase (client, server, shared)

**Secondary:**
- JavaScript - JSX used in React components

## Runtime

**Environment:**
- Node.js (version unspecified, inferred from package.json)

**Package Manager:**
- pnpm 10.15.1 (declared in packageManager field)
- Lockfile: pnpm-lock.yaml (inferred from pnpm usage)

## Frameworks

**Core:**
- React 19.2.1 - Frontend UI framework
- Express 4.21.2 - HTTP server and API routing

**Routing:**
- Wouter 3.3.5 - Lightweight client-side router (with patched version in patches/wouter@3.7.1.patch)

**Form & Validation:**
- React Hook Form 7.64.0 - Form state management
- Zod 4.1.12 - Schema validation and type inference
- @hookform/resolvers 5.2.2 - Integration between React Hook Form and Zod

**API Communication:**
- tRPC 11.6.0 - Type-safe RPC framework
  - @trpc/server 11.6.0
  - @trpc/client 11.6.0
  - @trpc/react-query 11.6.0

**Database & ORM:**
- Drizzle ORM 0.44.5 - Type-safe SQL query builder
- drizzle-kit 0.31.4 - Schema migration and database tooling
- mysql2 3.15.0 - MySQL client driver

**UI Components:**
- Radix UI (comprehensive primitive components)
- shadcn/ui inspired patterns (Accordion, Alert, Avatar, Badge, Button, Checkbox, Dialog, Dropdown, Form, etc.)

**State Management:**
- React Query (TanStack Query) 5.90.2 - Server state management
- next-themes 0.4.6 - Theme persistence

**Styling:**
- Tailwind CSS 4.1.14 - Utility-first CSS framework
- @tailwindcss/vite 4.1.3 - Vite plugin for Tailwind
- @tailwindcss/typography 0.5.15 - Prose plugin
- PostCSS 8.4.47 - CSS processing
- Autoprefixer 10.4.20 - Browser compatibility

**Build/Dev:**
- Vite 7.1.7 - Frontend build tool and dev server
- @vitejs/plugin-react 5.0.4 - React plugin for Vite
- esbuild 0.25.0 - JavaScript bundler and minifier
- tsx 4.19.1 - TypeScript executor for Node.js

**Testing:**
- Vitest 2.1.4 - Test runner
- vitest/config.ts configuration present in repo root

**Build Plugins:**
- @builder.io/vite-plugin-jsx-loc 0.1.1 - JSX location tracking
- vite-plugin-manus-runtime 0.0.57 - Custom Manus platform plugin

## Key Dependencies

**Critical:**
- jose 6.1.0 - JWT encoding/decoding for session tokens
- axios 1.12.0 - HTTP client for OAuth flows and external API calls
- dotenv 17.2.2 - Environment variable loading

**UI & Interaction:**
- Framer Motion 12.23.22 - Animation library
- Embla Carousel 8.6.0 - Carousel component
- React Resizable Panels 3.0.6 - Resizable UI panels
- Vaul 1.1.2 - Drawer component
- input-otp 1.4.2 - OTP input component
- cmdk 1.1.1 - Command menu component
- sonner 2.0.7 - Toast notifications
- Lucide React 0.453.0 - Icon library

**Data & Utilities:**
- date-fns 4.1.0 - Date manipulation
- nanoid 5.1.5 - Unique ID generation
- streamdown 1.4.0 - Stream processing
- superjson 1.13.3 - JSON serialization with special types (Date, Map, Set, BigInt)
- cookie 1.0.2 - Cookie parsing and serialization
- clsx 2.1.1 - Conditional className builder
- tailwind-merge 3.3.1 - Smart Tailwind class merging
- class-variance-authority 0.7.1 - Variant management for components

**Date & Calendar:**
- react-day-picker 9.11.1 - Accessible day picker component

**Charts:**
- recharts 2.15.2 - Composable chart library

## Configuration

**Environment:**
- Configuration via environment variables with defaults in `.planning/codebase/STACK.md`
- Location: `server/_core/env.ts` centralizes all env vars with fallbacks

**Key Variables Required:**
- `DATABASE_URL` - MySQL connection string (required for drizzle migrations)
- `JWT_SECRET` - Secret for session cookie signing
- `OAUTH_SERVER_URL` - OAuth provider endpoint
- `VITE_APP_ID` - Application ID from OAuth provider
- `OWNER_OPEN_ID` - OpenID of admin user
- `NODE_ENV` - "development" or "production"
- `PORT` - Server port (defaults to 3000, auto-falls back if unavailable)
- `BUILT_IN_FORGE_API_URL` - Manus Forge API endpoint (image generation, storage)
- `BUILT_IN_FORGE_API_KEY` - Manus Forge API authentication key

**Build:**
- `tsconfig.json` - TypeScript configuration with ESNext module, strict mode, path aliases
- `vite.config.ts` - Vite configuration with React, Tailwind, JSX location, and Manus plugins
- `drizzle.config.ts` - Drizzle configuration pointing to `drizzle/schema.ts`
- `vitest.config.ts` - Test configuration with Node environment

**Formatting & Linting:**
- `.prettierrc` - Prettier configuration (80-char line width, 2-space tabs, double quotes, semicolons, trailing commas, arrow parens avoided)

## Platform Requirements

**Development:**
- Node.js (version not pinned, check .nvmrc if present)
- pnpm 10.15.1+
- TypeScript 5.9.3

**Production:**
- Node.js runtime
- MySQL 5.7+ database
- Manus platform for OAuth and Forge API (image generation, storage)

## Project Structure

**Client/Frontend:**
- Location: `client/src/`
- Root component: `client/src/App.tsx`
- Entry point: `client/src/main.tsx`
- Components: `client/src/components/`
- Pages: `client/src/pages/`
- UI primitives: `client/src/components/ui/`
- Contexts: `client/src/contexts/`
- Hooks: `client/src/hooks/` and `client/src/_core/hooks/`
- Utilities: `client/src/lib/`
- Types: `client/src/types/`

**Server/Backend:**
- Location: `server/`
- Entry point: `server/_core/index.ts` (Express app initialization)
- Routes: `server/routers.ts` (tRPC router definitions)
- Database: `server/db.ts` (database queries and mutations)
- OAuth: `server/_core/oauth.ts` (OAuth callback handling)
- Storage: `server/storage.ts` (Forge API file upload/download)
- Core services: `server/_core/` (environment, cookies, authentication, SDKs)

**Shared:**
- Location: `shared/`
- Constants: `@shared/const` (COOKIE_NAME, ONE_YEAR_MS, AXIOS_TIMEOUT_MS, UNAUTHED_ERR_MSG)
- Error types: `@shared/_core/errors` (ForbiddenError)

**Database:**
- Location: `drizzle/`
- Schema: `drizzle/schema.ts` (Drizzle table definitions)
- Migrations: `drizzle/migrations/` (auto-generated SQL files)

---

*Stack analysis: 2026-04-03*
