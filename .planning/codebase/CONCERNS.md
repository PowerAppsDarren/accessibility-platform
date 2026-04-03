# Codebase Concerns

**Analysis Date:** 2026-04-03

## Tech Debt

**DataContext Not Yet Deprecated:**
- Issue: DataContext exists but is no longer used; todo.md indicates it should be removed
- Files: `client/src/contexts/DataContext.tsx`, `client/src/App.tsx`
- Impact: Increases bundle size and cognitive load; mock data is still loaded unnecessarily
- Fix approach: Complete migration of all pages to tRPC (Departments, Websites, Applications pages still using DataContext), then remove the context entirely

**Incomplete tRPC Migration:**
- Issue: People page (line 19) uses tRPC correctly, but Departments, Websites, and Applications pages still rely on DataContext
- Files: `client/src/pages/Departments.tsx`, `client/src/pages/Websites.tsx`, `client/src/pages/Applications.tsx`
- Impact: Inconsistent data fetching patterns; increases difficulty maintaining CRUD operations
- Fix approach: Refactor remaining pages to use tRPC endpoints instead of context mutations; update Dashboard accordingly

**Type Assertions in UI Components:**
- Issue: Multiple `as any` assertions in composition detection (dialog, input, textarea components)
- Files: `client/src/components/ui/dialog.tsx`, `client/src/components/ui/input.tsx`, `client/src/components/ui/textarea.tsx`
- Impact: Loss of type safety for composition state handling; potential runtime issues with IME (Input Method Editor)
- Fix approach: Create proper typed interfaces for `isComposing` events rather than using `as any`

**Large Monolithic ComponentShowcase Page:**
- Issue: ComponentShowcase.tsx contains 1437 lines with component demo code
- Files: `client/src/pages/ComponentShowcase.tsx`
- Impact: Long file reduces maintainability; component playground should be separate from application pages
- Fix approach: Extract showcase into a separate documentation site or storybook-style structure

**Dual Server Entry Points:**
- Issue: Both `server/index.ts` and `server/_core/index.ts` define startServer() function and port logic
- Files: `server/index.ts`, `server/_core/index.ts`
- Impact: Confusing which entry point is actually used; potential for maintenance errors
- Fix approach: Consolidate to single entry point; remove duplicate port detection logic

## Known Bugs

**Port Collision Fallback Only Logs Warning:**
- Symptoms: When preferred port is busy, app silently falls back to next available port (logs only)
- Files: `server/_core/index.ts` (line 57)
- Trigger: Running multiple instances on same machine
- Workaround: None built-in; users must check console to verify which port was used

**OAuth Callback Error Response Inconsistent:**
- Symptoms: OAuth callback endpoint returns generic "OAuth callback failed" without detail to user
- Files: `server/_core/oauth.ts` (line 50)
- Trigger: Any OAuth validation error (missing openId, token exchange failure)
- Impact: Users cannot diagnose authentication issues; error details only in server logs

## Security Considerations

**Admin User Detection via ENV Variable:**
- Risk: Admin role is determined by matching `openId` against `ENV.ownerOpenId`
- Files: `server/db.ts` (line 58), `server/_core/env.ts`
- Current mitigation: Relies on secure environment variable deployment
- Recommendations: Add audit logging for role assignment; consider implementing role provisioning through admin panel instead of environment variable

**Missing Input Validation on URL Fields:**
- Risk: Website.url and Application.url fields accept any string up to 500 chars without validation
- Files: `drizzle/schema.ts` (line 75, line 99)
- Current mitigation: None; values stored as-is
- Recommendations: Add URL format validation in routers.ts; sanitize URLs before storage to prevent injection attacks

**Unvalidated Database Connection String:**
- Risk: DATABASE_URL from environment used without validation; connection could expose credentials
- Files: `server/db.ts` (line 12)
- Current mitigation: Lazy connection with fallback to null
- Recommendations: Add validation for DATABASE_URL format; implement secrets rotation strategy

**Optional Authentication for All Routes:**
- Risk: Authentication is optional in context creation; public procedures allow unauthenticated access
- Files: `server/_core/context.ts` (line 17-20), `server/routers.ts` (line 12)
- Current mitigation: Most data queries use `protectedProcedure` but auth.me is public
- Recommendations: Audit all public procedures; add explicit route-level access control; document which endpoints are intentionally public

**Session Token Generation Without Rate Limiting:**
- Risk: OAuth callback creates session tokens without rate limiting
- Files: `server/_core/oauth.ts` (line 39)
- Current mitigation: None
- Recommendations: Implement rate limiting on OAuth callback endpoint; add bot detection

## Performance Bottlenecks

**Dashboard Loads All Data at Query Time:**
- Problem: Dashboard queries all people, departments, websites, applications simultaneously
- Files: `client/src/pages/Dashboard.tsx`
- Cause: No pagination; all entities fetched regardless of dashboard need
- Improvement path: Implement aggregation queries on backend; use pagination for list views; add caching strategy

**No Query Result Caching Strategy:**
- Problem: React Query configured with default settings; no stale time or cache validation
- Files: `client/src/main.tsx` (QueryClient setup uses defaults)
- Cause: Each refetch triggers full re-query
- Improvement path: Set appropriate `staleTime` and `cacheTime` per entity type; implement background refetch strategy

**Large UI Component Bundle:**
- Problem: All Radix UI components imported into ComponentShowcase even if unused
- Files: `client/src/pages/ComponentShowcase.tsx`
- Cause: Showcase page imports 50+ component variants
- Improvement path: Tree-shake unused components; move showcase to separate bundle; lazy-load component docs

## Fragile Areas

**People-Department Foreign Key Relationship Unvalidated:**
- Files: `client/src/pages/People.tsx` (line 40), `server/routers.ts` (line 34)
- Why fragile: departmentId can be null or reference non-existent department; no FK constraint enforced
- Safe modification: Add NOT NULL constraint in schema after data cleanup; implement referential integrity checks in routers
- Test coverage: No tests for FK relationship validation

**Date String Conversion Manual Transformation:**
- Files: Multiple pages convert between ISO date strings and JS Date objects manually
- Why fragile: `new Date(person.lastContactDate).toISOString().split('T')[0]` pattern repeated (People.tsx line 52, etc.)
- Safe modification: Create utility function `formatDateForInput()` and `parseDateFromInput()`; unit test date handling
- Test coverage: No tests for date conversion

**RecordDialog Component Lacks PropTypes Validation:**
- Files: `client/src/components/RecordDialog.tsx`
- Why fragile: Accepts `children` and callbacks without runtime validation
- Safe modification: Add TypeScript strict mode validation; consider prop validation library; add JSDoc comments
- Test coverage: Component has no tests; manual testing only

**Error Handling Swallows Details:**
- Files: `client/src/main.tsx` (line 36), People.tsx (line 94)
- Why fragile: Catch blocks log errors but display generic toast messages to users
- Safe modification: Create error formatter utility that maps error types to user-friendly messages
- Test coverage: No tests for error handling paths

**Database Null Handling Inconsistent:**
- Files: `server/db.ts` returns empty arrays on db unavailability (line 95) but throws on mutations
- Why fragile: List operations silently fail; mutations crash the server
- Safe modification: Implement consistent error response strategy; document expected behavior
- Test coverage: No tests for database unavailability scenarios

## Scaling Limits

**In-Memory State Without Synchronization:**
- Current capacity: Works for <500 records per entity
- Limit: No pagination; all data loaded into browser memory
- Scaling path: Implement cursor-based pagination; add server-side filtering/sorting; implement virtual scrolling for DataTable

**Single Database Connection Pool:**
- Current capacity: Default drizzle pool settings (likely 5-10 connections)
- Limit: Concurrent requests > pool size will queue
- Scaling path: Configure explicit pool size; implement connection pooling strategy; monitor connection usage

**No Caching Layer:**
- Current capacity: Each request queries database directly
- Limit: Database load increases linearly with users
- Scaling path: Add Redis or similar; implement cache invalidation on mutations; cache aggregation queries

## Dependencies at Risk

**jose@6.1.0 with Pinned Version:**
- Risk: Direct version pin without caret prevents security updates
- Impact: Potential JWT vulnerability if issues discovered; manual updates required
- Migration plan: Change to `^6.1.0` to allow patch updates; set up dependabot for security alerts

**drizzle-orm@0.44.5 Rapid Development:**
- Risk: Drizzle is actively developed with breaking changes between versions
- Impact: Migrations might fail; schema generation could change
- Migration plan: Pin major version; test migrations thoroughly before upgrading; maintain migration rollback strategy

**vite-plugin-manus-runtime@0.0.57 (Pre-release):**
- Risk: Pre-release plugin version; not stable
- Impact: Plugin might break; documentation sparse
- Migration plan: Monitor for 1.0 release; test thoroughly on upgrade; maintain fallback UI if plugin fails

## Missing Critical Features

**No Audit Logging:**
- Problem: CRUD operations not logged; cannot track who modified what or when beyond database timestamps
- Blocks: Compliance requirements; debugging user-reported issues; security investigations
- Recommendation: Implement audit trail in tRPC middleware; log mutations with user context

**No Bulk Operations:**
- Problem: Every CRUD operation is single-record; no bulk create/update/delete
- Blocks: Efficient data imports; mass editing; performance for large datasets
- Recommendation: Add bulk endpoints to tRPC routers; implement batch processing

**No Search or Advanced Filtering:**
- Problem: Client-side search only; cannot query by arbitrary fields
- Blocks: Accessibility review workflow (finding sites by review status); department analysis
- Recommendation: Add full-text search; implement filter builder; add saved searches

**No Role-Based Access Control (RBAC):**
- Problem: Only "user" and "admin" roles; no granular permissions
- Blocks: Department-level access control; field-level visibility; audit scope control
- Recommendation: Implement RBAC middleware; define permission matrix; add role provisioning UI

**No Notification System:**
- Problem: Users have no way to receive alerts for important events (new site submitted, review due, etc.)
- Blocks: Workflow automation; accessibility review process management
- Recommendation: Implement event-driven notifications; add preferences UI; integrate email delivery

## Test Coverage Gaps

**No Tests for CRUD Operations:**
- What's not tested: Happy path and error cases for create/read/update/delete across all entities
- Files: `server/routers.ts`, `server/db.ts`
- Risk: Breaking changes to mutation logic go undetected; data corruption possible
- Priority: High

**No Integration Tests for tRPC Endpoints:**
- What's not tested: tRPC middleware, context creation, error handling across full stack
- Files: `server/_core/trpc.ts`, `server/_core/context.ts`
- Risk: Authentication bypasses; type mismatches between client and server
- Priority: High

**No Tests for Data Transformation:**
- What's not tested: Date conversion, type casting, null handling in data layer
- Files: `client/src/pages/*.tsx`, `server/db.ts`
- Risk: Silent data loss or corruption during transformation
- Priority: Medium

**OAuth Flow Not Tested:**
- What's not tested: Token exchange, user creation, session cookie validation
- Files: `server/_core/oauth.ts`
- Risk: Authentication failures in production; undetected vulnerabilities
- Priority: Critical

**Error Handling Paths Untested:**
- What's not tested: Database errors, network failures, invalid input handling
- Files: `client/src/pages/*.tsx`, `server/routers.ts`
- Risk: Users see cryptic errors; silent failures possible
- Priority: High

**No E2E Tests:**
- What's not tested: Full user workflows (login -> add person -> update -> delete)
- Files: All integration between client and server
- Risk: Regression in critical user flows; breaking changes to UI not caught
- Priority: Medium

---

*Concerns audit: 2026-04-03*
