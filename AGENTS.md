# AGENTS.md

Agent guidance for `app-backtrack` (Expo + React Native + TypeScript).

## Project Snapshot

- Mobile app built with Expo Router (`src/app`) and feature modules (`src/features`).
- TypeScript strict mode. Package manager: npm.
- Expo 54, React Native 0.81 (New Architecture enabled), React 19, NativeWind, React Query, Zustand, Firebase.
- Typed routes enabled (`experiments.typedRoutes: true`).
- Reference docs: `CLAUDE.md` (architecture context, partially stale on routing), `GEMINI.md`, `DESIGN.md`.

## Commands

```bash
npm start              # Expo dev server
npm run android        # Android
npm run ios            # iOS
npm run lint           # ESLint (expo lint)
npm run ts             # TypeScript check (tsc --noEmit)
npm run check:all      # Typecheck THEN lint (fail-fast on types)
npx eslint "src/path"  # Lint a single file
```

- **No test runner configured.** No Jest/Vitest, no `test` script. Single-file typecheck not supported; use full `npm run ts`.
- **Husky + lint-staged exist** (`lint-staged.config.js` runs eslint --fix + tsc on staged .ts/.tsx) but the `.husky/pre-commit` hook file is currently **empty** — pre-commit checks do not run automatically.
- **EAS Build** configured: `development`, `preview`, `production` profiles in `eas.json`.

## Verification

- For code changes: run `npm run check:all`. Do not claim success without command evidence.
- For docs-only changes: verification may be skipped; state that explicitly.

## Path Aliases (Critical)

`@/` maps to the **repo root** (not `./src/`). Actual imports look like:

```ts
import { PostScreen } from "@/src/features/post/screens";
import { colors } from "@/src/shared/theme/colors";
```

- Parent-relative imports (`../`) across feature boundaries are **banned by ESLint**.
- Use `@/src/features/...` or `@/src/shared/...` for cross-module imports.

## Routing

File-based routing under `src/app/` with three route groups:

- `(auth)/` — login, register, password-reset, verify-email, onboarding.
- `(tabs)/` — bottom tab navigator (post, chat, map, profile, qr).
- `(shared)/` — cross-cutting screens (not-available).

Route files are thin re-exports: `export { XScreen as default } from "@/src/features/..."`.
Route constants: `src/shared/constants/route.constant.ts` — use these, not hardcoded strings.

## Feature Modules

`src/features/`: `auth`, `chat`, `map`, `notification`, `post`, `profile`, `qr` (7 features).
Each follows: `api/`, `components/`, `hooks/`, `screens/`, `types/`.

`src/shared/`: `api`, `components` (incl. `ui/`, `fields/`), `constants`, `hooks`, `lib`, `mocks`, `screens`, `services`, `store`, `theme`, `types`, `utils`.

## Banned Libraries

- `@expo/vector-icons` — use `phosphor-react-native`. Enforced by ESLint.
- `react-native-paper` — banned. Enforced by ESLint.
- Before creating new shared UI, check `src/shared/components/ui/` for existing primitives.

## TypeScript

- Strict mode (`"strict": true`).
- `@typescript-eslint/no-explicit-any` is `error`.
- Feature-specific types in `src/features/<feature>/types/`. Shared types in `src/shared/types`.

## Styling

- NativeWind (Tailwind classes). Theme tokens in `src/shared/theme/` (`colors.js`, `typography.js`, `metrics.js`).
- Use semantic token classes (`bg-primary`, `text-textPrimary`, `rounded-primary`, `gap-md`) over raw values.
- Tailwind config in `tailwind.config.js` consumes these tokens. Dark mode: class-based.

## Toolchain Quirks

- **SVG as components**: Metro uses `react-native-svg-transformer`. Import `.svg` files directly as React components. SVG is excluded from asset exts and added to source exts.
- **Reanimated plugin**: `react-native-reanimated/plugin` in `babel.config.js` **must remain the last plugin**.
- **NativeWind**: Configured via both `babel.config.js` (preset) and `metro.config.js` (`withNativeWind` wrapper with `global.css` input).
- **Firebase auth**: Custom path mapping `@firebase/auth` → RN-specific dist in `tsconfig.json`.

## API Layer

- Two Axios clients in `src/shared/api/client.tsx`: `publicClient` (unauthed), `privateClient` (injects Firebase ID token, retries once on 401 after token refresh).
- All API responses follow `ApiResponse<T> = { success: boolean; data: T; message?: string }` (see `src/shared/api/api.types.ts`).
- Feature APIs: `src/features/<feature>/api/<feature>.api.ts`. Return `response.data`.
- Real-time: Socket.io for chat (`src/features/chat/services/`) and notifications (`src/features/notification/services/`).

## State Management

- Server state: React Query hooks per feature.
- Global UI state: Zustand (`src/shared/store/ui.store.ts`).
- Scoped state: React Context providers (auth, app user, location selection).

## Forms

React Hook Form + Yup. Shared form fields in `src/shared/components/fields/`.

## Environment

- Firebase initialized in `src/shared/lib/firebase.ts`. Firebase services in `src/shared/services/firebase.service.ts`.
- API base URL: `EXPO_PUBLIC_API_URL` env var.
- Never commit `.env*` files or secrets. `.env.local` is gitignored.

## Naming Conventions

- Components/screens: PascalCase (`PostScreen`, `AppHeader`).
- Hooks: `useXxx` (`usePosts`, `useGetMyQR`).
- Utils: `<domain>.utils.ts`. Constants: `<domain>.constant.ts`. Query keys: `<domain>.key.ts`.
- API endpoint objects: uppercase (`POST_API`).

## Style

- Mixed quote style across files — follow file-local convention.
- Keep diffs minimal; do not reformat unrelated code.

## Git Hygiene

- Respect existing uncommitted changes; do not revert unrelated files.
- Run `npm run check:all` before commit for code changes.

## GitNexus Usage Requirements

- Before editing any function/class/method, run upstream impact analysis:
  - `gitnexus_impact({target: "symbolName", direction: "upstream"})`
- Before commit, run:
  - `gitnexus_detect_changes()`
- If impact is HIGH/CRITICAL, warn user before proceeding.
- For exploration, prefer:
  - `gitnexus_query({query: "concept"})`
  - `gitnexus_context({name: "symbolName"})`

## Completion Checklist

- [ ] Changes stay within feature/module boundaries.
- [ ] Imports use `@/src/...` aliases (no cross-boundary `../`).
- [ ] No banned libraries introduced.
- [ ] `npm run check:all` passes (or reason documented).
- [ ] GitNexus impact + detect_changes run when code symbols changed.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **app-backtrack** (1126 symbols, 2432 relationships, 62 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/app-backtrack/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/app-backtrack/context` | Codebase overview, check index freshness |
| `gitnexus://repo/app-backtrack/clusters` | All functional areas |
| `gitnexus://repo/app-backtrack/processes` | All execution flows |
| `gitnexus://repo/app-backtrack/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

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
