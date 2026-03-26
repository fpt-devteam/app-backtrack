# Backtrack - Project Overview

Backtrack is a mobile application built with **React Native** and **Expo**, designed for tracking locations or potentially finding lost items. It leverages modern React Native ecosystems for styling, state management, and real-time communication.

## Core Technologies

- **Framework:** Expo (SDK 54) with Expo Router (File-based routing).
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native).
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) for global state.
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest) (React Query) for server state.
- **Backend/Services:** 
  - **Firebase:** Auth, Storage, and potentially Firestore/Realtime Database.
  - **Socket.io:** Real-time communication (Chat, Notifications).
- **Animations:** [Moti](https://moti.fyi/) (Reanimated 3 based).
- **Forms:** React Hook Form with Yup/Zod validation.
- **UI Components:** Bottom Sheet (@gorhom/bottom-sheet), Phosphor Icons, Expo Image.

## Architecture & Structure

The project follows a **feature-based architecture** to ensure scalability and maintainability.

- `src/app/`: Expo Router application entry and routing logic.
  - `(protected)/`: Routes requiring authentication.
  - `(public)/`: Publicly accessible routes (Login, Register, etc.).
  - `shared/`: Shared layout components.
- `src/features/`: Functional modules (Auth, Chat, Map, Notification, Post, Profile, QR).
  - Each feature typically contains its own `api`, `components`, `hooks`, `screens`, and `types`.
- `src/shared/`: Cross-cutting concerns and shared resources.
  - `api/`: Global API client configuration.
  - `components/`: Generic UI components (UI kit, fields).
  - `constants/`: Global constants.
  - `hooks/`: Reusable hooks.
  - `lib/`: Third-party library initializations (Firebase, etc.).
  - `theme/`: Styling tokens (colors, metrics, typography) used by NativeWind.
  - `utils/`: Helper functions.
- `assets/`: Static assets (fonts, icons, images).

## Building and Running

Ensure you have the environment variables set up (check `.env` or `app.json`).

| Command | Description |
| :--- | :--- |
| `npm start` | Starts the Expo development server. |
| `npm run android` | Starts the app on an Android emulator or device. |
| `npm run ios` | Starts the app on an iOS simulator or device. |
| `npm run web` | Starts the app in a web browser. |
| `npm run lint` | Runs ESLint for code quality checks. |
| `npm run ts` | Runs TypeScript compiler for type checking (`noEmit`). |
| `npm run check:all` | Runs both linting and type checking. |

## Development Conventions

1.  **Styling:** Always use **NativeWind** (Tailwind classes) for styling components. Refer to `src/shared/theme/` for project-specific design tokens.
2.  **API Calls:** Use **TanStack Query** hooks for data fetching and mutations. Place feature-specific API logic in `src/features/[feature-name]/api/`.
3.  **State Management:** Prefer **Zustand** for complex global UI state. Use local `useState` or `useReducer` for component-level state.
4.  **Routing:** Utilize **Expo Router's** file-based routing. Keep layouts clean and delegate logic to feature screens.
5.  **Firebase:** Use the initialized instances from `src/shared/lib/firebase.ts`.
6.  **Components:** Check `src/shared/components/ui/` before building new generic UI elements to maintain consistency.
7.  **Naming:** Follow standard React/TypeScript naming conventions (PascalCase for components, camelCase for functions/variables).
