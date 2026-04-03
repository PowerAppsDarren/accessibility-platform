# External Integrations

**Analysis Date:** 2026-04-03

## APIs & External Services

**OAuth/Authentication:**
- Manus OAuth Server - User authentication and identity
  - SDK/Client: Custom axios-based client in `server/_core/sdk.ts`
  - Auth: `OAUTH_SERVER_URL` (env var), `VITE_APP_ID` (env var)
  - Flow: OAuth 2.0 with code exchange, JWT session tokens
  - Endpoints:
    - `POST /webdev.v1.WebDevAuthPublicService/ExchangeToken` - Exchange authorization code for tokens
    - `POST /webdev.v1.WebDevAuthPublicService/GetUserInfo` - Get user profile
    - `POST /webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt` - Get user info using JWT

**Manus Forge API:**
- Image Generation & Storage service
  - Base URL: `BUILT_IN_FORGE_API_URL` (env var, typically Manus platform URL)
  - Auth: Bearer token (`BUILT_IN_FORGE_API_KEY` env var)
  - Implementation files: `server/_core/imageGeneration.ts`, `server/storage.ts`
  - Endpoints:
    - `POST /images.v1.ImageService/GenerateImage` - AI image generation with prompt and original image support
    - `POST /v1/storage/upload` - Upload files (supports 50MB limit)
    - `GET /v1/storage/downloadUrl` - Get presigned download URLs

**Maps/Geolocation:**
- Google Maps API
  - Type definitions: `@types/google.maps` ^3.58.1
  - Usage: Imported in components for location/mapping features (not actively used in current pages)
  - Location: `client/src/components/Map.tsx` (component exists but not currently routed)

## Data Storage

**Databases:**
- MySQL (5.7+)
  - Connection: `DATABASE_URL` (env var, mysql2:// connection string)
  - Client: mysql2 3.15.0
  - ORM: Drizzle ORM 0.44.5
  - Schema: `drizzle/schema.ts`
  - Tables:
    - `users` - User accounts with OAuth openId
    - `people` - Personnel records with accessibility champion tracking
    - `departments` - Organizational units
    - `websites` - Web properties with accessibility review status
    - `applications` - Software applications with VPAT/ACR tracking

**File Storage:**
- Manus Forge Storage API (cloud-based via proxy)
  - No local filesystem storage configured
  - All uploads go through `storagePut()` function in `server/storage.ts`
  - Downloads use presigned URLs from `storageGet()`

**Caching:**
- React Query (TanStack Query) - Client-side query caching
  - No explicit Redis or server-side caching configured
  - Session cache via HTTP cookies

## Authentication & Identity

**Auth Provider:**
- Manus OAuth Server (custom platform implementation)

**Implementation:**
- Location: `server/_core/oauth.ts`, `server/_core/sdk.ts`
- OAuth 2.0 authorization code flow
- Session management via httpOnly cookies (signed with `JWT_SECRET`)
- Cookie name: `COOKIE_NAME` (from shared constants)
- Session duration: 1 year (`ONE_YEAR_MS`)
- User roles: "user" and "admin" (role determined by `OWNER_OPEN_ID` env var)
- Database: User records stored in `users` table with openId as unique identifier

**Protected Routes:**
- All tRPC procedures marked with `protectedProcedure` check for authenticated user
- Location: `server/routers.ts` - All CRUD operations (people, departments, websites, applications)
- Public procedures: `auth.me` (returns current user), `auth.logout`

## Monitoring & Observability

**Error Tracking:**
- Not detected - No Sentry, Rollbar, or similar integration

**Logs:**
- Console logging approach:
  - `console.log()` for informational messages (OAuth init, server startup, port selection)
  - `console.error()` for error conditions (database failures, OAuth errors)
  - `console.warn()` for warnings (database connection issues)
  - Location: `server/_core/index.ts`, `server/_core/oauth.ts`, `server/db.ts`
- Client-side: Query/mutation errors logged to console via `console.error()` in `client/src/main.tsx`

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured in codebase
- Deployment-ready structure with production vs. development modes
- Node.js deployment expected

**Build & Deployment Commands:**
```bash
npm run build       # Build client with Vite, bundle server with esbuild
npm start          # Run production build (from dist/)
npm run dev        # Development mode with tsx watch and Vite HMR
```

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or similar configuration

## Environment Configuration

**Required Environment Variables:**

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| `DATABASE_URL` | MySQL connection | `mysql://user:pass@host:3306/dbname` | Yes |
| `JWT_SECRET` | Cookie signing secret | (32+ char random string) | Yes |
| `OAUTH_SERVER_URL` | OAuth provider endpoint | `https://oauth.example.com` | Yes |
| `VITE_APP_ID` | OAuth application ID | (from OAuth provider) | Yes |
| `OWNER_OPEN_ID` | Admin user OpenID | (user's OAuth openId) | Yes |
| `NODE_ENV` | Environment mode | `development` or `production` | No (default: development) |
| `PORT` | Server port | `3000` | No (default: 3000) |
| `BUILT_IN_FORGE_API_URL` | Forge API base URL | `https://forge.example.com/` | Yes (for image generation) |
| `BUILT_IN_FORGE_API_KEY` | Forge API key | `sk-...` | Yes (for image generation) |

**Secrets Location:**
- Env file: `.env` (not tracked in git, use `.env.example` for documentation)
- All secrets loaded via `process.env` in `server/_core/env.ts`
- Secrets must be set in deployment environment (Manus platform, Docker, cloud provider, etc.)

## Webhooks & Callbacks

**Incoming:**
- OAuth callback: `GET /api/oauth/callback?code={code}&state={state}`
  - Handler: `server/_core/oauth.ts` - `registerOAuthRoutes()`
  - Validates code/state, exchanges for token, creates session cookie
  - Redirects to `/` on success

**Outgoing:**
- Not detected - No webhooks sent to external services

## CORS & Security

**CORS:**
- Not explicitly configured (Express default)
- tRPC uses httpBatchLink with fetch (credentials: "include" for cookies)

**Host Whitelist:**
- Vite server allows hosts:
  - `.manuspre.computer`
  - `.manus.computer`
  - `.manus-asia.computer`
  - `.manuscomputer.ai`
  - `.manusvm.computer`
  - `localhost`
  - `127.0.0.1`

**Headers:**
- Forge API requests use: `Authorization: Bearer {API_KEY}`, `Content-Type: application/json`
- Image generation uses: `connect-protocol-version: 1` (Connect RPC protocol)

---

*Integration audit: 2026-04-03*
