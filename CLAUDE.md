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
