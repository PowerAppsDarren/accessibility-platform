# Coding Conventions

**Analysis Date:** 2026-04-03

## Naming Patterns

**Files:**
- **React Components:** PascalCase (e.g., `People.tsx`, `DataTable.tsx`, `RecordDialog.tsx`)
- **Utilities/Helpers:** camelCase (e.g., `utils.ts`, `trpc.ts`, `mockData.ts`)
- **Pages:** PascalCase (e.g., `/pages/People.tsx`, `/pages/Dashboard.tsx`)
- **Contexts:** PascalCase with Context suffix (e.g., `ThemeContext.tsx`, `DataContext.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Server routers:** descriptive, lowercase (e.g., `routers.ts`, `systemRouter.ts`)
- **UI components:** PascalCase in `/components/ui/` directory (e.g., `button.tsx`, `dialog.tsx`)

**Functions:**
- **React components:** PascalCase (capitalized)
- **Helper functions:** camelCase
- **Factory functions:** camelCase with descriptive names (e.g., `createAuthContext`, `createTRPCReact`)
- **Async functions:** camelCase, no special prefix, but clear intent (e.g., `getAllDepartments`, `upsertUser`)
- **Handler functions:** camelCase with `handle` prefix (e.g., `handleSave`, `handleEdit`, `handleDelete`)

**Variables:**
- **State variables:** camelCase (e.g., `people`, `isDialogOpen`, `currentPerson`)
- **Constants:** UPPER_SNAKE_CASE for module-level constants (e.g., `COOKIE_NAME`, `ONE_YEAR_MS`, `UNAUTHED_ERR_MSG`)
- **Type discriminators:** camelCase (e.g., `isEditing`, `isLoading`)

**Types:**
- **Interfaces:** PascalCase with descriptive names, often suffixed with context (e.g., `DataTableProps<T>`, `RecordDialogProps`, `Column<T>`, `AIChatBoxProps`)
- **Type aliases:** PascalCase (e.g., `TrpcContext`, `AuthenticatedUser`, `PersonForm`)
- **Union types:** Clear and semantic (e.g., `z.enum(["No", "In Progress", "Yes"])`)

## Code Style

**Formatting:**
- **Tool:** Prettier 3.6.2
- **Settings (from `.prettierrc`):**
  - Print width: 80
  - Tab width: 2 spaces
  - No tabs (spaces only)
  - Semicolons: yes
  - Trailing commas: ES5 (objects/arrays only)
  - Single quotes: no (use double quotes)
  - Bracket spacing: yes
  - Bracket same line: no
  - Arrow function parens: avoid (omit parens for single params)
  - End of line: LF
  - JSX quotes: double quotes
  - Prose wrap: preserve

**Linting:**
- **No ESLint config detected** — Project relies on Prettier for formatting only
- **TypeScript:** Strict mode enabled (`strict: true`)
- **Type checking:** Run `npm run check` to verify with `tsc --noEmit`

## Import Organization

**Order:**
1. React and framework imports (e.g., `import React from 'react'`)
2. Third-party library imports (e.g., `@radix-ui`, `@trpc`, `zod`)
3. Relative imports from project (e.g., `@/components`, `@/lib`)
4. Alias imports always used over relative paths

**Path Aliases:**
- `@/*` → `./client/src/*` (frontend)
- `@shared/*` → `./shared/*` (shared types/constants)
- `@assets/*` → `./attached_assets/*` (assets)

**Examples from codebase:**
```typescript
// Good
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";

// Bad (relative paths not used)
// import Something from "../../../../components/Something"
```

## Error Handling

**Patterns:**
- **Custom errors:** Extend `HttpError` class (`/shared/_core/errors.ts`) with status codes
  - `BadRequestError(msg)` → 400
  - `UnauthorizedError(msg)` → 401
  - `ForbiddenError(msg)` → 403
  - `NotFoundError(msg)` → 404
- **Mutations:** Catch errors with try/catch, show user-friendly toast messages using `sonner`
- **Queries:** Let tRPC handle errors, subscribed via QueryClient in `main.tsx`
- **Server-side:** Log errors with context prefix (e.g., `console.warn("[Database]...")`, `console.error("[Database]...")`)
- **Client-side:** Use console only for debugging; toast for user feedback
  - Error pattern: `console.error("[Source]", error)`

**Examples from codebase:**
```typescript
// Server (db.ts)
try {
  await db.insert(users).values(values)...
} catch (error) {
  console.error("[Database] Failed to upsert user:", error);
  throw error;
}

// Client (People.tsx)
try {
  await updatePersonMutation.mutateAsync({...});
  toast.success('Person updated successfully');
} catch (error) {
  toast.error('Failed to save person');
  console.error(error);
}
```

## Logging

**Framework:** `console` (no logging library)

**Patterns:**
- **Server-side:** Log with context prefix in brackets (e.g., `[Database]`, `[API Query Error]`)
- **Client-side:** Reserved for errors and debugging only
- **Toast messages:** Use `sonner` for user-facing success/error feedback
- **Log levels:** `console.log()` for info, `console.warn()` for warnings, `console.error()` for errors

**Examples:**
```typescript
console.warn("[Database] Failed to connect:", error);
console.error("[API Query Error]", error);
console.error("[Database] Cannot upsert user: database not available");
console.log("Dialog submitted with value:", dialogInput);
```

## Comments

**When to Comment:**
- Complex logic that isn't self-documenting
- JSDoc for public functions and exported types
- Inline comments for non-obvious intent or workarounds
- Avoid redundant comments that restate code

**JSDoc/TSDoc:**
- Used sparingly; code is generally self-documenting via types
- Example from codebase:
  ```typescript
  /**
   * Unified type exports
   * Import shared types from this single entry point.
   */
  export type * from "../drizzle/schema";
  ```

## Function Design

**Size:** Keep functions focused and under 50 lines where practical. Complex pages (like `People.tsx`) can exceed this when containing UI and business logic together.

**Parameters:**
- Prefer object parameters for functions with 2+ parameters
- Use destructuring in function signatures
- Type all parameters explicitly

**Return Values:**
- Always specify return types explicitly
- Use `void` for functions with no return
- Use union types (`| null`, `| undefined`) when appropriate

**Examples from codebase:**
```typescript
// Good: Clear return type and destructuring
export async function getDepartmentById(id: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(departments);
}

// Good: Handler with clear intent
const handleSave = async () => {
  if (!currentPerson.firstName || !currentPerson.lastName) {
    toast.error('Please fill in all required fields');
    return;
  }
  try {
    // logic
  } catch (error) {
    toast.error('Failed to save person');
  }
};

// Good: React component with props interface
const RecordDialog: React.FC<RecordDialogProps> = ({
  isOpen,
  onClose,
  title,
  // ...
}) => {
  // component logic
};
```

## Module Design

**Exports:**
- Named exports for utilities and contexts
- Default exports for React components (pages, layouts)
- Barrel file pattern used for UI components (exports from `components/ui/`)

**Barrel Files:**
- Used in `components/ui/` for shadcn components
- Not used for feature modules; import directly from source

**Organization:**
- Server modules group related functionality (e.g., `_core/` directory contains bootstrap, context, trpc setup)
- Client pages folder (`pages/`) contains full-page components
- Client components folder (`components/`) contains reusable UI components
- Contexts in `contexts/` folder

## Type Safety

**TypeScript Strictness:**
- Strict mode enabled: all variables must be explicitly typed
- Generic types used extensively: `DataTable<T>`, `Column<T>`
- Type imports: `type` keyword used when importing types only
- No `any` types; use `unknown` and narrow via type guards

**Zod Schemas:**
- Used for tRPC input validation (server-side)
- Schemas define both types and runtime validation
- Example pattern:
  ```typescript
  z.object({
    id: z.number(),
    name: z.string().optional(),
    champion: z.enum(["No", "In Progress", "Yes"]).optional(),
  })
  ```

---

*Convention analysis: 2026-04-03*
