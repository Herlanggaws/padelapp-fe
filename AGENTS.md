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
