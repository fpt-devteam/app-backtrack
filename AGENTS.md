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

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **app-backtrack** (1067 symbols, 2321 relationships, 61 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

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
