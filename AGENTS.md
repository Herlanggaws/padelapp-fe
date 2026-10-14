<!-- BEGIN:nextjs-agent-rules -->

## Next.js Page Rules

- **Never add `"use client"` to page files** (`src/app/**/page.tsx`). Pages should remain Server Components.
- If a page requires client-side interactivity (e.g., `useState`, `useEffect`, event handlers), extract that logic into a dedicated component inside `src/components/` and mark **that component** with `"use client"` instead.
- Import and render the client component from the page file, keeping the page itself free of `"use client"`.

## Service Layer Rules

All API calls must be placed in `src/services/` — never inline fetch calls inside components or pages.

### Conventions

- **One file per domain** — group related endpoints in a single file (e.g., `src/services/authService.ts` for all auth-related calls).
- **Export typed interfaces** for every request payload and response shape (both success and error). Example:
  ```ts
  export interface RegisterPayload { ... }
  export interface RegisterSuccessResponse { ... }
  export interface RegisterErrorResponse { ... }
  ```
- **Base URL from env** — always read the API base URL from `process.env.NEXT_PUBLIC_API_BASE_URL` (defined in `.env.local`). Never hardcode the base URL inside a service file.
- **Throw on error** — if the HTTP response is not OK, parse the JSON body and `throw` it as the typed error response so callers can catch and handle it:
  ```ts
  if (!response.ok) {
    throw data as MyErrorResponse;
  }
  return data as MySuccessResponse;
  ```
- **No side effects** — service functions must be pure async functions. They must not call `localStorage`, `sessionStorage`, `router.push`, or any React hook. Those concerns belong in the component that calls the service.
- **Naming** — service functions should be named with a verb + noun pattern (e.g., `registerUser`, `loginUser`, `fetchClubs`).

## Form Submission Rules

- **Loading state** — every form must track a boolean `isSubmitting` state (via `useState`). Set it to `true` before the async call and back to `false` in a `finally` block.
- **Disable on submit** — the submit button must have `disabled={isSubmitting}` to prevent duplicate submissions. Apply `disabled:opacity-50 disabled:cursor-not-allowed` classes for visual feedback.

## Type Declaration Rules

All TypeScript `interface` and `type` declarations must live in `src/types/` — never inline them inside service files or components.

### Conventions

- **One file per module** — group related types in a single file named after the domain (e.g., `src/types/auth.ts`, `src/types/storage.ts`).
- **Import types from `@/types/`** — service files and components must import their types from the corresponding `src/types/` file, not declare them locally.
  ```ts
  // service file
  import type { LoginPayload, LoginSuccessResponse } from "@/types/auth";

  // component file
  import type { LoginErrorResponse } from "@/types/auth";
  ```
- **Re-export from service when needed** — if consumers currently import a type via the service path, the service may re-export it from `@/types/` for backwards compatibility, but the source of truth is always `src/types/`.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
