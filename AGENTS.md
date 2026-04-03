# AGENTS.md

Agent guidance for `app-backtrack` (Expo + React Native + TypeScript).

## Project Snapshot

- App type: mobile app built with Expo Router (`src/app`) and feature modules (`src/features`).
- Language: TypeScript (strict mode enabled).
- Package manager: npm (`package-lock.json` is present).
- Runtime stack: Expo 54, React Native 0.81, React 19, NativeWind, React Query, Zustand, Firebase.

## Source of Truth and Rule Files

- Primary architecture/context doc: `CLAUDE.md`.
- ESLint config: `eslint.config.js`.
- TypeScript config: `tsconfig.json`.
- Pre-commit staged checks: `lint-staged.config.js`.
- Existing Cursor rules: none found (`.cursor/rules/` and `.cursorrules` absent).
- Existing Copilot instructions: none found (`.github/copilot-instructions.md` absent).

## Install and Run

- Install deps: `npm install`
- Start dev server: `npm start`
- Run Android: `npm run android`
- Run iOS: `npm run ios`
- Run web: `npm run web`

## Build / Lint / Typecheck / Test Commands

- Lint entire repo: `npm run lint`
- Typecheck entire repo: `npm run ts`
- Combined checks: `npm run check:all`
- Staged-file checks (used by commit hooks): `npm run check:changed`

Notes on tests:

- There is currently no configured unit/integration test runner (no Jest/Vitest config, no `test` script).
- "Run a single test" is not available in this repo yet.
- If asked to run "one test", explain this limitation and offer nearest equivalents:
  - single file lint: `npx eslint "src/path/to/file.tsx"`
  - single file typecheck is not directly supported by repo scripts; use full `npm run ts`.

## Practical Verification Workflow for Agents

- For code changes, run: `npm run check:all`.
- For docs-only changes, verification command may be skipped; state that explicitly.
- Do not claim success without command evidence (exit code + key output summary).

## Routing and Module Layout

- Routing uses Expo Router with file-based routes under `src/app`.
- Route groups include `(auth)`, `(tabs)`, `(shared)`.
- Feature code is organized under `src/features/<feature>/` with common folders:
  - `api/`, `components/`, `hooks/`, `screens/`, `types/`.
- Shared cross-feature code lives in `src/shared/` (`api`, `components`, `constants`, `hooks`, `store`, `theme`, `types`, `utils`).

## Import Rules (Important)

- Use path aliases (`@/`) for project imports.
- Do not use parent-relative imports (`../`) across feature boundaries.
- The lint config enforces restricted patterns for `../*`.
- Prefer feature-local imports and shared modules over ad-hoc deep relative paths.

## Disallowed Libraries and UI Stack Constraints

- Do not use `@expo/vector-icons`; use `phosphor-react-native`.
- Do not use `react-native-paper` (Material stack is intentionally excluded).
- Before creating new shared UI, check `src/shared/components/ui/` for an existing primitive.

## TypeScript and Types

- TS is strict (`"strict": true` in `tsconfig.json`).
- Avoid `any` (`@typescript-eslint/no-explicit-any` is error).
- Use explicit DTO/types from each feature's `types/` folder.
- Use shared aliases/types from `src/shared/types` when applicable.
- Prefer `type` imports where appropriate for clarity and tree-shaking friendliness.

## Formatting and Style Conventions

- Follow existing file-local style (the repo currently contains both single-quote and double-quote files).
- Keep diffs minimal; do not reformat unrelated code.
- Use descriptive names and keep functions focused.
- Avoid adding comments unless logic is non-obvious.
- Keep components/hooks cohesive and colocated by feature.

## Naming Conventions (Observed)

- React screens/components: PascalCase (`PostScreen`, `AppHeader`).
- Hooks: `useXxx` (`usePosts`, `useGetMyQR`).
- Utility modules: lowercase domain names with suffix (`datetime.utils.ts`, `error.utils.ts`).
- Constants: uppercase object names (`POST_API`) and route constants in `route.constant.ts`.
- Query keys/constants are centralized by feature (for example `*.key.ts`).

## API and Data Access Patterns

- Axios clients are centralized in `src/shared/api/client.tsx`:
  - `publicClient` for unauthenticated calls.
  - `privateClient` injects Firebase ID token and retries once on 401 after refresh.
- Keep endpoint constants grouped (example: `POST_API`).
- Return `response.data` from API helpers; keep transport concerns in API layer.

## State Management Patterns

- Server/async state: React Query hooks in feature modules.
- Lightweight global UI state: Zustand stores in `src/shared/store` (and feature stores where needed).
- Scoped app state and lifecycle: React Context providers (auth/app user/location selection, etc.).

## Error Handling Guidelines

- Prefer mapping user-facing errors through `src/shared/utils/error.utils.ts` helpers.
- Surface clear, actionable messages for auth/network/validation failures.
- Do not swallow exceptions silently.
- In hooks/services, preserve useful context when rethrowing or returning error state.

## UI / Styling Rules

- Styling uses NativeWind (Tailwind classes in RN components).
- Theme tokens are defined in `src/shared/theme/` (`colors.js`, `typography.js`, `metrics.js`).
- Prefer semantic tokens (`colors.primary`, `colors.text.primary`, spacing/radius tokens) over raw values.
- Keep touch targets accessible (token system targets minimums via metrics).

## Forms and Validation

- Use React Hook Form + Yup for form flows.
- Keep validation schema close to the form/screen.
- Use shared form fields from `src/shared/components/fields` when possible.

## Firebase / Environment

- Use initialized Firebase exports from `src/shared/lib/firebase.ts`.
- API base URL comes from `EXPO_PUBLIC_API_URL`.
- Never commit secrets or local env contents.

## Git and Change Hygiene for Agents

- Respect existing uncommitted user changes; do not revert unrelated files.
- Keep commits scoped and atomic when asked to commit.
- Run `npm run check:all` before commit when code changes affect runtime behavior.

## GitNexus Usage Requirements

- Before editing any function/class/method, run upstream impact analysis:
  - `gitnexus_impact({target: "symbolName", direction: "upstream"})`
- Before commit, run:
  - `gitnexus_detect_changes()`
- If impact is HIGH/CRITICAL, warn user before proceeding.
- For exploration, prefer:
  - `gitnexus_query({query: "concept"})`
  - `gitnexus_context({name: "symbolName"})`

## Completion Checklist for Agents

- Changes align with feature/module boundaries.
- Imports follow alias/lint restrictions.
- No forbidden libraries introduced.
- `npm run check:all` executed (or explicit reason if skipped).
- GitNexus impact and change-detection steps performed when code symbols changed.
