# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About the App

Backtrack is a React Native/Expo mobile app for tracking and finding lost items. Users can create posts for lost/found items, match with similar posts via AI image analysis, chat in real-time, and share profiles via QR code.

## Commands

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator/device
npm run lint       # ESLint check
npm run ts         # TypeScript check (noEmit)
npm run check:all  # Run both lint and TypeScript checks
```

No test runner is configured. Pre-commit validation runs via Husky + lint-staged (`npm run check:changed`).

## Architecture

### Routing (Expo Router, file-based)

```
src/app/
  _layout.tsx             # Root providers: Auth → AppUser → BottomSheet → QueryClient → Toast
  (public)/               # Unauthenticated: login, register, forgot-password, check-email
  (protected)/
    _layout.tsx           # Auth guard: checks isAppReady + isLoggedIn, redirects to /login
    (tabs)/               # Bottom tab navigator with custom BottomTabBar
    posts/, chat/, map/, profile/, qr/, notification/
```

Route constants are defined in `src/shared/constants/route.constant.ts` — use these instead of hardcoded strings.

### Feature Modules (`src/features/`)

Each feature follows the same internal structure: `api/`, `components/`, `hooks/`, `screens/`, `types/`. Features: `auth`, `chat`, `map`, `notification`, `post`, `profile`, `qr`, `report`.

### State Management

- **React Query (TanStack Query)** — all server/async state; custom hooks per feature
- **Zustand** — lightweight global UI state (e.g., `UIStore` for tab bar visibility in `src/shared/store/`)
- **React Context** — hierarchical/scoped state (e.g., `AuthProvider`, `AppUserProvider`, `LocationSelectionProvider`)

### API Layer (`src/shared/api/`)

Two Axios clients:

- `publicClient` — unauthenticated requests
- `privateClient` — injects Firebase ID token via request interceptor; handles 401 with token refresh retry

Feature APIs live in `src/features/[feature]/api/[feature].api.ts`. All responses follow `ApiResponse<T> = { success: boolean; data: T; message?: string }`.

### Auth Flow

1. `AuthProvider` listens to Firebase auth state → sets `isLoggedIn` / `isAppReady`
2. `AppUserProvider` fetches/syncs user data after auth, registers device push token
3. Protected layout redirects unauthenticated users to `/login`

### Real-time

- **Chat**: Socket.io (`src/features/chat/services/`)
- **Notifications**: Socket.io with polling fallback (`src/features/notification/services/`)

## Key Conventions

- **Styling**: NativeWind (Tailwind classes) only. Design tokens in `src/shared/theme/`.
- **Icons**: Use Phosphor Icons. `@expo/vector-icons` is banned by ESLint.
- **UI components**: Check `src/shared/components/ui/` before creating new ones.
- **Imports**: Path aliases required (`@/` → repo root). Relative imports across features are banned by ESLint.
- **Firebase**: Use initialized instances from `src/shared/lib/firebase.ts`.
- **Forms**: React Hook Form + Yup validation.
- **Animations**: Moti (Reanimated-based).

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **app-backtrack** (3410 symbols, 5343 relationships, 101 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/app-backtrack/context` | Codebase overview, check index freshness |
| `gitnexus://repo/app-backtrack/clusters` | All functional areas |
| `gitnexus://repo/app-backtrack/processes` | All execution flows |
| `gitnexus://repo/app-backtrack/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
