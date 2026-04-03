# Roadmap — Milestone 1: Database Migration Complete

## Goal
Wire all frontend pages to the tRPC backend API, remove the mock DataContext layer, and verify full CRUD functionality.

## Phases

### Phase 1: tRPC Page Migrations
**Goal**: Migrate Departments, Websites, Applications, and Dashboard pages from DataContext to tRPC hooks.
**Status**: NOT STARTED
**Dependencies**: None (tRPC routers already exist)
**Files**:
- `client/src/pages/Departments.tsx`
- `client/src/pages/Websites.tsx`
- `client/src/pages/Applications.tsx`
- `client/src/pages/Dashboard.tsx`

### Phase 2: DataContext Cleanup
**Goal**: Remove the mock data layer now that all pages use tRPC.
**Status**: NOT STARTED
**Dependencies**: Phase 1 complete
**Files**:
- `client/src/App.tsx` — Remove DataProvider wrapper
- `client/src/contexts/DataContext.tsx` — DELETE
- `client/src/lib/mockData.ts` — DELETE
- `client/src/types/schema.ts` — DELETE (replaced by drizzle/schema.ts types)

### Phase 3: Verification & Testing
**Goal**: Type-check, build, and verify all CRUD operations work.
**Status**: NOT STARTED
**Dependencies**: Phase 2 complete
**Tasks**:
- Run `tsc --noEmit` — zero errors
- Run `vite build` — successful build
- Update `todo.md` — mark all tasks complete
- Final checkpoint commit

## Success Criteria
- All 4 pages use tRPC for data fetching and mutations
- No references to DataContext, useData, or mockData remain
- TypeScript compiles with zero errors
- Build succeeds
