# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BackTrack is a React Native mobile app built with Expo for tracking lost and found items. Users can post items they've lost or found, match with similar posts, chat with other users, and manage items via QR codes. The app uses Firebase for authentication and storage, React Query for state management, and Socket.io for real-time chat.

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm start
# or for specific platforms:
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser

# Linting
npm run lint
```

### Environment Setup
Create `.env.local` in the root with these variables:
```
EXPO_PUBLIC_BASE_URL=<backend-api-url>
EXPO_PUBLIC_API_KEY=<firebase-api-key>
EXPO_PUBLIC_AUTH_DOMAIN=<firebase-auth-domain>
EXPO_PUBLIC_PROJECT_ID=<firebase-project-id>
EXPO_PUBLIC_STORAGE_BUCKET=<firebase-storage-bucket>
EXPO_PUBLIC_MESSAGING_SENDER_ID=<firebase-sender-id>
EXPO_PUBLIC_APP_ID=<firebase-app-id>
EXPO_PUBLIC_SOCKET_URL=<socket-io-server-url>
```

## Architecture

### Project Structure

```
src/
├── app/                    # Expo Router file-based routing
│   ├── (protected)/       # Authenticated routes (posts, chat, profile, QR)
│   ├── (public)/          # Unauthenticated routes (login, register)
│   └── _layout.tsx        # Root provider hierarchy
├── features/              # Feature modules (auth, chat, item, location, post)
│   └── [feature]/
│       ├── api/          # API calls for this feature
│       ├── components/   # Feature-specific components
│       ├── constants/    # Query keys, API endpoints
│       ├── hooks/        # React Query wrapped hooks
│       └── types/        # TypeScript types & DTOs
├── shared/               # Cross-cutting concerns
│   ├── components/      # Reusable UI (form fields, app utils)
│   ├── constants/       # Routes, Firebase, Socket config
│   ├── services/        # Firebase, Socket.io, Google Maps
│   ├── types/           # Global types (ApiResponse, PagedResponse)
│   └── utils/           # Error mapping, date formatting
└── api/                 # API client configuration
    └── common/          # Axios clients, interceptors, utilities
```

### Routing with Expo Router

The app uses **file-based routing** with Expo Router. Routes are organized into two groups:

**Protected Routes** (require authentication):
- Posts: `/(protected)/posts` (home), `/posts/create`, `/posts/[postId]`, `/posts/[postId]/matching/[otherPostId]`
- Search: `/posts/search`, `/posts/search/location`, `/posts/search/result`
- QR Management: `/(protected)/(qr)`, `/(qr)/[itemId]`, `/(qr)/activated-item/[publicCode]`
- Chat: `/chat/conversations`, `/chat/conversations/[conversationId]`
- Profile: `/profile`

**Public Routes** (redirect to home if authenticated):
- `/login`, `/register`, `/forgot-password`, `/check-email`

Layout guards in `(protected)/_layout.tsx` and `(public)/_layout.tsx` handle route protection by checking `isLoggedIn` from AuthContext.

Use the route constants from `src/shared/constants/route.constant.ts`:
```typescript
import { POST_ROUTE, CHAT_ROUTE, PROFILE_ROUTE } from "@/src/shared/constants";

// Navigate with type safety:
router.push(POST_ROUTE.details(postId));
router.push(CHAT_ROUTE.message(conversationId));
```

### Feature Modules

Each feature follows a **standardized structure**:
- `api/`: Feature-specific API calls (e.g., `filterPostsApi`, `createPost`)
- `components/`: UI components organized by type (cards/, forms/, screens/)
- `constants/`: Query keys and API endpoint definitions
- `hooks/`: Custom hooks that wrap React Query with normalized interfaces
- `types/`: TypeScript types (`.type.ts`), DTOs (`.dto.ts`), enums (`.enum.ts`)

**Example**: `features/post/`
- API endpoints defined in `constants/post.api.ts`
- Query keys in `constants/post.key.ts` (e.g., `POST_DETAIL_QUERY_KEY`)
- Hooks in `hooks/` (e.g., `usePosts`, `useCreatePost`, `useGetPostById`)

### State Management

**Server State**: React Query (`@tanstack/react-query`)
- All API interactions wrapped with `useQuery`, `useMutation`, or `useInfiniteQuery`
- Configured with 1 retry, refetch on reconnect, no refetch on window focus
- React Query DevTools enabled in development

**Global State**: React Context API
- **AuthContext**: Tracks `isAppReady` and `isLoggedIn` status (monitors Firebase auth state)
- **UserContext**: Manages current user data, syncs with backend, handles refresh

**Hook Pattern**: All custom hooks return normalized interfaces:
```typescript
const { data, isLoading, error, refetch } = useGetPostById(postId);
const { items, hasMore, loadMore, isLoading } = usePosts({ filters });
```

### API Layer

**Client Setup** (`src/api/common/client.tsx`):
- **privateClient**: Automatically injects Firebase ID token in `Authorization` header
- **publicClient**: No authentication (used for user sync endpoint)

**Request Interceptor** (privateClient):
- Gets fresh Firebase ID token on every request via `user.getIdToken()`
- Adds `Authorization: Bearer {idToken}` header

**Response Interceptor**:
- 401 errors trigger automatic token refresh and request retry (prevents infinite loops with `_retry` flag)

**Type Definitions** (`api/common/api.types.ts`):
```typescript
ApiResponse<T>: { success, data, error, correlationId }
PagedResponse<T>: { items, page, pageSize, totalCount }
CursorScrollResponse<T>: { items, nextCursor, hasMore }
```

**Utilities** (`api/common/utils.tsx`):
- `getQueryKey()`: Generate React Query keys with params
- `normalizePages()`: Flatten infinite query pages
- `getNextPageParam()`, `getPreviousPageParam()`: Pagination helpers

### Firebase Integration

**Setup** (`src/shared/lib/firebase.ts`):
- Firebase initialized with config from environment variables
- Exports `auth` and `firebaseStorage` instances

**Authentication Flow**:
1. User signs in via Firebase (`signInWithEmailAndPassword`)
2. `AuthProvider` monitors `onAuthStateChanged` (sets `isLoggedIn`)
3. `UserProvider` syncs authenticated user with backend using ID token
4. ID token automatically injected in all `privateClient` API requests

**Image Storage**:
- Use `uploadImageToFirebaseStorage()` from `src/shared/services/firebase.service.ts`
- Handles blob conversion, upload, and returns download URL
- Requests media permissions before access

### Real-Time Chat (Socket.io)

**Service** (`src/shared/services/socket.service.ts`):
- Singleton class managing Socket.io connection
- Methods: `connect()`, `disconnect()`, `joinConversation()`, `leaveConversation()`
- Event listeners: `onReceiveMessage()`, `onTyping()`, `onStopTyping()`
- Socket.io client configured with URL from `EXPO_PUBLIC_SOCKET_URL`

### Error Handling

**Centralized Mapping** (`src/shared/utils/error.utils.ts`):
- `mapErrorToMessage()`: Converts any error type to user-friendly message
- Handles Firebase auth errors, network errors, timeout errors, HTTP status codes
- Pattern matching for common error scenarios

**Usage in Hooks**:
```typescript
const mutation = useMutation({
  mutationFn: createPost,
  onError: (error) => {
    const message = mapErrorToMessage(error);
    // Display message to user
  }
});
```

## Key Conventions

### TypeScript Path Aliases
Use `@/*` to import from root:
```typescript
import { POST_ROUTE } from "@/src/shared/constants";
import { useAuth } from "@/src/features/auth/hooks";
```

### Styling with NativeWind
Use Tailwind classes via `className` prop:
```typescript
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold text-primary">Hello</Text>
</View>
```

Custom colors defined in `tailwind.config.js`:
- `primary`: #137fec
- `secondary`, `success`, `error`, `warning`, `info`
- `background-light`, `background-dark`

### React Native Paper
Use Paper components for Material Design:
```typescript
import { Button, Card, TextInput } from "react-native-paper";
```

### Form Handling
Use shared form fields from `src/shared/components/fields/`:
- `EmailField`, `PasswordField`, `ConfirmPasswordField`
- `DateTimePickerField`, `ImageField`, `LocationField`

Most forms use `react-hook-form` with `yup` validation.

### Query Keys Pattern
Define as constants with `as const`:
```typescript
export const POST_DETAIL_QUERY_KEY = ["post", "byId"] as const;
export const POSTS_QUERY_KEY = ["posts-query"] as const;
```

Use with params:
```typescript
queryKey: [...POST_DETAIL_QUERY_KEY, postId]
queryKey: [...POSTS_QUERY_KEY, filters]
```

### API Endpoint Definition
Define endpoints as object with methods:
```typescript
export const POST_API = {
  filter: "/posts/filter",
  create: "/posts",
  detail: (postId: string) => `/posts/${postId}`,
  matching: (postId: string) => `/posts/${postId}/matching`
};
```

## Important Notes

### Provider Hierarchy
The root `_layout.tsx` establishes this provider order (DO NOT change):
1. QueryClientProvider (React Query)
2. SafeAreaProvider (safe area insets)
3. AuthProvider (Firebase auth state)
4. UserProvider (user data sync)
5. PaperProvider (theming)

### New Architecture & React Compiler
- Expo's New Architecture is enabled (`newArchEnabled: true`)
- React Compiler is enabled (`reactCompiler: true`)
- Typed routes are enabled for type-safe navigation

### Image Permissions
- Image picker requires photo library and camera permissions
- Configured in `app.json` plugins section
- Use `requestMediaLibraryPermission()` before accessing media

### Google Services Configuration
- Android: `google-services.json` in root
- iOS: `GoogleService-Info.plist` in root
- Both referenced in `app.json` for Firebase integration

### Experimental Features
Typed routes are experimental - use with caution:
```typescript
import { router } from "expo-router";
// Type-safe navigation with route constants
router.push(POST_ROUTE.details(postId));
```
