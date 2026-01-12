# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Expo Router routes (route groups like `(public)`/`(protected)`, dynamic routes like `[postId].tsx`, shared layouts in `_layout.tsx`).
- `src/features/<feature>/`: Feature modules (`api/`, `components/`, `constants/`, `hooks/`, `types/`).
- `src/shared/`: Cross-cutting UI, services, constants, types, utils, and design tokens in `src/shared/theme/`.
- `assets/`: App images/icons; `global.css` + `tailwind.config.js` power NativeWind styling.

## Build, Test, and Development Commands
- `npm ci` (or `npm install`): Install dependencies (lockfile: `package-lock.json`).
- `npm start`: Start the Expo dev server.
- `npm run android` / `npm run ios` / `npm run web`: Launch for a specific platform.
- `npm run lint`: Run ESLint via `expo lint`.
- `npm run reset-project`: Reset to Expo starter scaffolding (destructive; rarely needed).

## Coding Style & Naming Conventions
- TypeScript is strict (`tsconfig.json`); don’t use `any` (lint error) and prefer type-only imports.
- Prefer path aliases for internal imports, e.g. `@/src/shared/constants`.
- Components use `PascalCase.tsx`; hooks use `useXxx.ts`; constants use `*.constant.ts`; API endpoints use `*.api.ts`; React Query keys use `*.key.ts`.

## Testing Guidelines
- No dedicated test runner is configured. Validate changes by running the app and exercising affected flows (navigation, auth, posting, chat).

## Commit & Pull Request Guidelines
- Follow Conventional Commits used in history: `feat:`, `fix:`, `chore:`, `refactor:` (optional scope: `feat(post): ...`).
- PRs include a short description, screenshots/GIFs for UI changes, and a note of tested platforms (Android/iOS/Web).

## Security & Configuration Tips
- Use `.env.local` (gitignored) for `EXPO_PUBLIC_*` variables (API base URL, Firebase config, Socket URL).
- Don’t commit secrets or platform config files like `google-services.json` and `GoogleService-Info.plist` (gitignored).
- Icons: use `phosphor-react-native`; do not add `@expo/vector-icons` or `react-native-paper` (lint error).
