# PostCard UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `PostCard` to feel polished, tactile, and visually harmonious — matching the quality bar of modern consumer apps (Tokopedia, Grab, Airbnb).

**Architecture:** All changes are confined to `PostCard.tsx`. We migrate from inline `style` objects to NativeWind `className`, add Moti for press animation, improve the image section with a loading skeleton and fallback, and fix the typography/color hierarchy so the item name is visually dominant. The unused `type` prop is removed to avoid dead code.

**Tech Stack:** React Native, NativeWind (Tailwind classes), Moti (`moti/interactions` for press), Phosphor Icons (for image fallback icon), existing `colors` / `typography` design tokens.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/features/post/components/PostCard.tsx` | Modify | All UI/UX changes — animation, image, typography, styling |

No other files change.

---

## Current State — Quick Reference

```tsx
// src/features/post/components/PostCard.tsx (current, abbreviated)
export const PostCard = ({ item, type = "vertical" }: PostCardProps) => {
  // type prop never used — dead code
  // cardWidth = width * 0.47, cardHeight = height * 0.3 — fixed pixel sizing
  // all styling via inline style={} objects — not NativeWind
  // press feedback: opacity 0.88 only
  // no skeleton / no fallback for missing image
  // time row uses colors.primary (sky-500) — too visually loud
};
```

**Design tokens in use** (`src/shared/theme/colors.js`):
- `colors.primary` → `sky[500]` `#0ea5e9`
- `colors.foreground` → `slate[900]`
- `colors.text.sub` → `slate[500]`
- `colors.text.muted` → `gray[400]`
- `colors.card` → `white`
- `colors.slate[100]` → `#f1f5f9`
- `colors.border.DEFAULT` → `slate[200]`

---

## Task 1: Remove dead `type` prop and migrate base structure to NativeWind

**Files:**
- Modify: `src/features/post/components/PostCard.tsx`

**Why:** The `type: CardType` prop (`"horizontal"`) is declared but never used anywhere. Removing it simplifies the API. Migrating from inline `style` to NativeWind `className` brings consistency with the rest of the codebase (e.g., `PostSuggestionCard`, `PostStatusBadge`).

- [ ] **Step 1: Remove the `CardType` type and `type` prop**

Replace the top of the file (types + component signature):

```tsx
// REMOVE these two lines:
// type CardType = "vertical" | "horizontal";
// type PostCardProps = { item: Post; type?: CardType; };

// REPLACE with:
type PostCardProps = {
  item: Post;
};
```

Update the component signature:

```tsx
// Before:
export const PostCard = ({ item, type = "vertical" }: PostCardProps) => {

// After:
export const PostCard = ({ item }: PostCardProps) => {
```

- [ ] **Step 2: Replace `useWindowDimensions`-based sizing with NativeWind + fixed aspect ratio**

Remove `useWindowDimensions` import and the four `const card*` variables. Replace the outer `Pressable` `style` with NativeWind `className`. We use `w-[47%]` for the two-column grid width (matches previous `width * 0.47`).

```tsx
// Remove:
// import { ..., useWindowDimensions, ... } from "react-native";
// const { width, height } = useWindowDimensions();
// const cardWidth = width * 0.47;
// const cardHeight = height * 0.3;
// const imageHeight = cardHeight * 0.6;
// const infoHeight = cardHeight * 0.4;

// Add import:
import { Image, Pressable, Text, View } from "react-native";
```

- [ ] **Step 3: Verify TypeScript**

```bash
npm run ts
```

Expected: no errors related to `type` or `CardType`.

- [ ] **Step 4: Commit**

```bash
git add src/features/post/components/PostCard.tsx
git commit -m "refactor(PostCard): remove unused type prop, drop useWindowDimensions"
```

---

## Task 2: Add Moti press animation (spring scale + opacity)

**Files:**
- Modify: `src/features/post/components/PostCard.tsx`

**Why:** `Pressable` with only `opacity: 0.88` feels flat. `MotiPressable` from `moti/interactions` gives a spring-based scale-down on press, which is the tactile "squish" feel that makes cards feel alive. The app already uses Moti (listed in CLAUDE.md conventions).

- [ ] **Step 1: Add MotiPressable import**

```tsx
import { MotiPressable } from "moti/interactions";
```

Remove `Pressable` from the React Native import (no longer needed):

```tsx
// Before:
import { Image, Pressable, Text, View } from "react-native";

// After:
import { Image, Text, View } from "react-native";
```

- [ ] **Step 2: Replace `<Pressable>` with `<MotiPressable>` using spring animation**

```tsx
// Before:
<Pressable
  onPress={handleOpenDetail}
  style={({ pressed }) => ({
    width: cardWidth,
    height: cardHeight,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.card,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    opacity: pressed ? 0.88 : 1,
  })}
>

// After:
<MotiPressable
  onPress={handleOpenDetail}
  animate={({ pressed }) => {
    "worklet";
    return {
      scale: pressed ? 0.96 : 1,
      opacity: pressed ? 0.92 : 1,
    };
  }}
  transition={{ type: "spring", damping: 18, stiffness: 250 }}
  className="w-[47%] rounded-xl overflow-hidden bg-white"
  style={{
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  }}
>
```

Close tag: replace `</Pressable>` → `</MotiPressable>`.

- [ ] **Step 3: Verify TypeScript**

```bash
npm run ts
```

Expected: no errors. If `moti/interactions` types are missing, run `npm install moti` (it should already be installed).

- [ ] **Step 4: Commit**

```bash
git add src/features/post/components/PostCard.tsx
git commit -m "feat(PostCard): add Moti spring press animation"
```

---

## Task 3: Image section — skeleton + fallback icon

**Files:**
- Modify: `src/features/post/components/PostCard.tsx`

**Why:** Currently when `imageUrl` is undefined the image area is a blank grey rectangle with no visual cue. Users may think the card is broken. Adding an `ActivityIndicator` skeleton (shown while loading) and a `ImageIcon` fallback (shown when no URL) communicates state clearly.

- [ ] **Step 1: Add imports**

```tsx
import { ActivityIndicator, Image, Text, View } from "react-native";
import { ImageIcon } from "phosphor-react-native";
import { useState } from "react";
```

- [ ] **Step 2: Add `imageLoading` state**

Inside the component, before the return:

```tsx
const [imageLoading, setImageLoading] = useState(true);
```

- [ ] **Step 3: Replace the image `<View>` block**

```tsx
// Before:
<View
  style={{
    width: cardWidth,
    height: imageHeight,
    backgroundColor: colors.slate[100],
  }}
>
  {imageUrl && (
    <Image
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
      source={{ uri: imageUrl }}
    />
  )}
  <View style={{ position: "absolute", top: 6, left: 6 }}>
    <PostStatusBadge status={item.postType} size="sm" />
  </View>
</View>

// After:
<View className="w-full aspect-[4/3] bg-slate-100">
  {imageUrl ? (
    <>
      <Image
        resizeMode="cover"
        className="w-full h-full"
        source={{ uri: imageUrl }}
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
      />
      {imageLoading && (
        <View className="absolute inset-0 items-center justify-center bg-slate-100">
          <ActivityIndicator size="small" color={colors.slate[400]} />
        </View>
      )}
    </>
  ) : (
    <View className="flex-1 items-center justify-center gap-1">
      <ImageIcon size={28} color={colors.slate[300]} weight="thin" />
      <Text className="text-[10px] text-slate-400">No image</Text>
    </View>
  )}

  {/* Status badge — top-left, with subtle semi-transparent backdrop */}
  <View className="absolute top-2 left-2">
    <PostStatusBadge status={item.postType} size="sm" />
  </View>
</View>
```

- [ ] **Step 4: Verify TypeScript**

```bash
npm run ts
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/features/post/components/PostCard.tsx
git commit -m "feat(PostCard): add image skeleton loader and fallback empty state"
```

---

## Task 4: Fix typography & color hierarchy in the info strip

**Files:**
- Modify: `src/features/post/components/PostCard.tsx`

**Why:** The current hierarchy is broken — the time row (`13px / bold / sky-500`) visually dominates over the item name (`12px / 400 / slate-900`). In every well-designed card (Airbnb, Grab), the **title is the loudest element** and metadata rows are quieter. Fix: bump item name to `14px / 500`, drop time to `12px / 400 / slate-500`, keep location at `10px / muted`.

Also, replace the inline `style` object info strip `<View>` with NativeWind classes, and tighten spacing.

- [ ] **Step 1: Replace the entire info strip `<View>` block**

```tsx
// Before:
<View
  style={{
    width: cardWidth,
    height: infoHeight,
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: colors.card,
    justifyContent: "space-between",
  }}
>
  {/* Item name */}
  <Text
    numberOfLines={2}
    style={{
      fontSize: 12,
      fontWeight: "400",
      color: colors.foreground,
      lineHeight: 17,
    }}
  >
    {item.itemName}
  </Text>

  {/* Event time */}
  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
    <ClockIcon size={11} color={colors.primary} weight="fill" />
    <Text
      numberOfLines={1}
      style={{
        fontSize: 13,
        fontWeight: "700",
        color: colors.primary,
      }}
    >
      {eventTimeLabel}
    </Text>
  </View>

  {/* Location */}
  <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
    <MapPinIcon size={10} color={colors.slate[300]} weight="fill" />
    <Text
      numberOfLines={1}
      style={{ flex: 1, fontSize: 10, color: colors.text.muted }}
    >
      {locationLabel}
    </Text>
  </View>
</View>

// After:
<View className="px-2 pt-2 pb-2.5 bg-white gap-1.5">
  {/* Title — loudest element, reads first */}
  <Text
    numberOfLines={2}
    className="text-sm font-medium text-slate-900 leading-[18px]"
  >
    {item.itemName}
  </Text>

  {/* Event time — secondary, quieter than title */}
  <View className="flex-row items-center gap-1">
    <ClockIcon size={11} color={colors.slate[400]} weight="bold" />
    <Text numberOfLines={1} className="text-[11px] text-slate-500 flex-1">
      {eventTimeLabel}
    </Text>
  </View>

  {/* Location — most muted */}
  <View className="flex-row items-center gap-1">
    <MapPinIcon size={10} color={colors.slate[300]} weight="fill" />
    <Text numberOfLines={1} className="text-[10px] text-slate-400 flex-1">
      {locationLabel}
    </Text>
  </View>
</View>
```

- [ ] **Step 2: Verify TypeScript + lint**

```bash
npm run check:all
```

Expected: no errors or warnings.

- [ ] **Step 3: Commit**

```bash
git add src/features/post/components/PostCard.tsx
git commit -m "fix(PostCard): fix typography hierarchy — title dominant, metadata quieter"
```

---

## Task 5: Final cleanup — remove unused imports

**Files:**
- Modify: `src/features/post/components/PostCard.tsx`

**Why:** After previous tasks, `useWindowDimensions` and possibly `useCallback`/`useMemo` for removed logic may be stale. Clean up to keep the file lean.

- [ ] **Step 1: Review and trim imports**

The final import block should look like this (adjust if any item is still needed):

```tsx
import type { Post } from "@/src/features/post/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatShortEventTime } from "@/src/shared/utils/datetime.utils";
import { router } from "expo-router";
import { ImageIcon, ClockIcon, MapPinIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { MotiPressable } from "moti/interactions";
import { PostStatusBadge } from "./PostStatusBadge";
```

- [ ] **Step 2: Run full check**

```bash
npm run check:all
```

Expected: clean — zero lint errors, zero TypeScript errors.

- [ ] **Step 3: Final commit**

```bash
git add src/features/post/components/PostCard.tsx
git commit -m "chore(PostCard): clean up unused imports after UI redesign"
```

---

## Final State — Complete Redesigned Component

For reference, the complete file after all tasks:

```tsx
import type { Post } from "@/src/features/post/types";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { formatShortEventTime } from "@/src/shared/utils/datetime.utils";
import { router } from "expo-router";
import { ClockIcon, ImageIcon, MapPinIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { MotiPressable } from "moti/interactions";
import { PostStatusBadge } from "./PostStatusBadge";

type PostCardProps = {
  item: Post;
};

export const PostCard = ({ item }: PostCardProps) => {
  const imageUrl = item.images?.[0]?.url;
  const [imageLoading, setImageLoading] = useState(true);

  const eventTimeLabel = useMemo(
    () => formatShortEventTime(item.eventTime),
    [item.eventTime]
  );

  const locationLabel = useMemo(() => {
    if (item.displayAddress?.trim()) return item.displayAddress;
    if (item.location?.latitude != null && item.location?.longitude != null) {
      return `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`;
    }
    return "Unknown location";
  }, [item.displayAddress, item.location?.latitude, item.location?.longitude]);

  const handleOpenDetail = useCallback(() => {
    router.push(POST_ROUTE.details(item.id));
  }, [item.id]);

  return (
    <MotiPressable
      onPress={handleOpenDetail}
      animate={({ pressed }) => {
        "worklet";
        return {
          scale: pressed ? 0.96 : 1,
          opacity: pressed ? 0.92 : 1,
        };
      }}
      transition={{ type: "spring", damping: 18, stiffness: 250 }}
      className="w-[47%] rounded-xl overflow-hidden bg-white"
      style={{
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* IMAGE — 4:3 aspect ratio, always consistent height */}
      <View className="w-full aspect-[4/3] bg-slate-100">
        {imageUrl ? (
          <>
            <Image
              resizeMode="cover"
              className="w-full h-full"
              source={{ uri: imageUrl }}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
            {imageLoading && (
              <View className="absolute inset-0 items-center justify-center bg-slate-100">
                <ActivityIndicator size="small" color={colors.slate[400]} />
              </View>
            )}
          </>
        ) : (
          <View className="flex-1 items-center justify-center gap-1">
            <ImageIcon size={28} color={colors.slate[300]} weight="thin" />
            <Text className="text-[10px] text-slate-400">No image</Text>
          </View>
        )}

        <View className="absolute top-2 left-2">
          <PostStatusBadge status={item.postType} size="sm" />
        </View>
      </View>

      {/* INFO STRIP */}
      <View className="px-2 pt-2 pb-2.5 bg-white gap-1.5">
        <Text
          numberOfLines={2}
          className="text-sm font-medium text-slate-900 leading-[18px]"
        >
          {item.itemName}
        </Text>

        <View className="flex-row items-center gap-1">
          <ClockIcon size={11} color={colors.slate[400]} weight="bold" />
          <Text numberOfLines={1} className="text-[11px] text-slate-500 flex-1">
            {eventTimeLabel}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <MapPinIcon size={10} color={colors.slate[300]} weight="fill" />
          <Text numberOfLines={1} className="text-[10px] text-slate-400 flex-1">
            {locationLabel}
          </Text>
        </View>
      </View>
    </MotiPressable>
  );
};
```

---

## Self-Review Checklist

- [x] **Spec coverage**: press animation ✓, image skeleton ✓, image fallback ✓, typography hierarchy ✓, NativeWind migration ✓, dead prop removed ✓, shadow polish ✓
- [x] **No placeholders**: all steps contain complete code
- [x] **Type consistency**: `PostCardProps` simplified to `{ item: Post }` consistently across all tasks
- [x] **Import consistency**: `MotiPressable` imported from `moti/interactions` in all tasks that reference it
- [x] **NativeWind classes**: verified against Tailwind equivalents — `rounded-xl` = 12px, `aspect-[4/3]` = 4:3 ratio, `text-sm` = 14px
