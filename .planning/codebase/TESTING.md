# Testing Patterns

**Analysis Date:** 2026-04-03

## Test Framework

**Runner:**
- Vitest 2.1.4
- Config: `vitest.config.ts`
- Environment: Node.js (for backend testing)

**Assertion Library:**
- Vitest built-in assertions (via `vitest` package)
- No additional assertion library detected

**Run Commands:**
```bash
npm run test              # Run all tests (vitest run)
npm run test -- --watch  # Watch mode (requires config update)
npm run check             # TypeScript type checking
```

## Test File Organization

**Location:**
- Tests co-located with source in `server/` directory
- Naming pattern: `*.test.ts` or `*.spec.ts`
- Example: `server/auth.logout.test.ts`

**Naming:**
- Format: `{feature}.{action}.test.ts` (e.g., `auth.logout.test.ts`)
- Descriptive names that indicate what's being tested

**Structure:**
```
server/
├── auth.logout.test.ts          # Test file
├── routers.ts                   # Source file being tested
└── db.ts
```

## Test Structure

**Suite Organization:**
Test file: `server/auth.logout.test.ts`

```typescript
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    // test implementation
  });
});
```

**Patterns:**
- **Suite declaration:** Use `describe(suiteName, () => { ... })`
- **Test cases:** Use `it(description, async () => { ... })`
- **Setup:** Create helper functions (e.g., `createAuthContext()`) for test data
- **Assertions:** Use `expect()` with Vitest matchers
- **Teardown:** No explicit teardown detected; tests are isolated

## Mocking

**Framework:** Manual mocking via helper functions

**Patterns:**
Test example from `server/auth.logout.test.ts`:

```typescript
// Mock context factory
function createAuthContext(): { 
  ctx: TrpcContext; 
  clearedCookies: CookieCall[] 
} {
  const clearedCookies: CookieCall[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}
```

**What to Mock:**
- External dependencies (database, HTTP requests, cookies)
- Side effects (file I/O, network calls)
- Third-party service interactions

**What NOT to Mock:**
- Core business logic
- tRPC routers (test via `appRouter.createCaller(ctx)`)
- Type definitions and interfaces

## Fixtures and Factories

**Test Data:**
Helper function pattern used to create realistic test contexts:

```typescript
// Factory function for test context
function createAuthContext(): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];
  const user: AuthenticatedUser = { /* real user data */ };
  const ctx: TrpcContext = { /* mock context */ };
  return { ctx, clearedCookies };
}

// Usage in test
it("clears the session cookie", async () => {
  const { ctx, clearedCookies } = createAuthContext();
  const caller = appRouter.createCaller(ctx);
  const result = await caller.auth.logout();
  expect(clearedCookies).toHaveLength(1);
});
```

**Location:**
- Inline in test files as helper functions
- Shared test utilities could be extracted to `server/_core/testHelpers.ts` (not currently present)

## Coverage

**Requirements:** No coverage requirements enforced

**View Coverage:**
```bash
npm run test -- --coverage  # If coverage is configured (not detected)
```

*Note: No coverage configuration found in `vitest.config.ts`. To enable coverage, add:*
```typescript
test: {
  coverage: {
    provider: "v8",
    reporter: ["text", "json", "html"]
  }
}
```

## Test Types

**Unit Tests:**
- Scope: Individual API endpoints/mutations (tRPC procedures)
- Approach: Test via `appRouter.createCaller(ctx)` to invoke procedures directly
- Example: `auth.logout` test validates cookie clearing and return value

**Integration Tests:**
- Status: Not currently detected in codebase
- Potential candidates: Database operations, OAuth flow, multi-step workflows

**E2E Tests:**
- Framework: Not used
- No end-to-end testing infrastructure detected
- Potential future: Playwright or Cypress for UI testing

## Common Patterns

**Async Testing:**
Test functions marked as `async` to handle async mutations/queries:

```typescript
it("clears the session cookie and reports success", async () => {
  const { ctx, clearedCookies } = createAuthContext();
  const caller = appRouter.createCaller(ctx);
  
  // Await async mutation
  const result = await caller.auth.logout();
  
  expect(result).toEqual({ success: true });
});
```

**Error Testing:**
Not explicitly shown in current tests, but pattern would be:

```typescript
it("throws error on invalid input", async () => {
  const { ctx } = createAuthContext();
  const caller = appRouter.createCaller(ctx);
  
  // Expect promise rejection
  await expect(
    caller.people.getById({ id: -1 })
  ).rejects.toThrow();
});
```

**tRPC Caller Pattern:**
The codebase uses tRPC's `createCaller()` to invoke procedures directly in tests, bypassing HTTP:

```typescript
const caller = appRouter.createCaller(ctx);
const result = await caller.auth.logout();
expect(result).toEqual({ success: true });
```

This pattern:
- Tests actual tRPC logic without HTTP overhead
- Allows full control over context (user, request, response)
- Enables injection of mock/spy implementations
- Makes assertions on side effects (e.g., `clearedCookies` array)

## Testing Gaps

**Current Coverage:**
- Only 1 test file detected: `server/auth.logout.test.ts`

**Not Tested:**
- Database CRUD operations (all functions in `server/db.ts`)
- tRPC routers for departments, people, websites, applications
- Client-side components and pages
- Integration with external services (OAuth, LLM, image generation)

**Recommendations:**
1. Add unit tests for database functions using mocked database
2. Test all tRPC CRUD procedures with `createCaller()` pattern
3. Consider E2E tests for critical user flows (create/edit/delete records)
4. Add client-side component tests (would require Vitest browser or React Testing Library setup)

## Test Configuration Details

**File:** `vitest.config.ts`

```typescript
export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "server/**/*.spec.ts"],
  },
});
```

**Key Details:**
- Environment: Node.js (for backend testing)
- Include pattern: `server/**/*.test.ts` and `server/**/*.spec.ts`
- Path aliases configured to match main `tsconfig.json`
- No coverage, snapshots, or globals configured

---

*Testing analysis: 2026-04-03*
