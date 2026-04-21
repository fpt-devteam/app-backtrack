# Timeline Full Rail Redesign

**Date:** 2026-04-21  
**File:** `src/features/handover/screens/HandoverDetailScreen.tsx`  
**Scope:** Single file — `VerticalTimelineEvent` component + usage site

---

## Problem

The current timeline renders each event as a list item separated by `<Separator />` (a full-width horizontal divider). The vertical connector inside `VerticalTimelineEvent` is hardcoded to 16 px and not connected to adjacent items. `isFirst`/`isLast` props are not passed from the usage site, so all items get zero vertical padding. The result looks like a plain list, not a timeline.

---

## Goal

A continuous vertical rail that flows through all timeline events, with dots that visually float on the rail using a colored outer-ring style. Completed rail segments turn green; pending/future segments remain gray.

---

## Component Redesign — `VerticalTimelineEvent`

### Layout

Switch from the current "row + fixed-height connector below" to a **two-column, `alignItems: flex-start` layout**:

```
<View row, alignItems: flex-start>
  ├── Left column  (width: DOT_OUTER, alignItems: center)
  │   ├── Dot (outer ring view + inner white view + icon)
  │   └── Connector (width: 2, flex: 1)   ← omitted on last item
  └── Right column (flex: 1, paddingLeft: md, paddingBottom: sm)
      ├── Label   (text-xs text-textMuted)
      └── Value   (text-sm font-semibold text-textPrimary)
```

`flex: 1` on the connector means it naturally fills the height of the right-column text, creating a seamless rail with no hardcoded heights or `onLayout` measurement.

`paddingBottom: sm` on the right column provides breathing room between items. The last item uses `paddingBottom: 0` (controlled by `isLast`).

### Dot — Outer Ring Style

Two nested views simulate the colored halo:

```
Outer view: DOT_OUTER × DOT_OUTER, borderRadius DOT_OUTER/2
  bg = lightRingColor (state-based)
  Inner view: DOT_INNER × DOT_INNER, borderRadius DOT_INNER/2
    bg = colors.surface (white)
    alignItems/justifyContent: center
      {icon}
```

Sizes: `DOT_OUTER = 44`, `DOT_INNER = 34`.

State color mapping:

| State     | Outer bg (ring)       | Inner border           |
|-----------|-----------------------|------------------------|
| `done`    | `colors.babu[100]`    | `colors.babu[300]`     |
| `active`  | `colors.rausch[100]`  | `colors.rausch[500]`   |
| `pending` | `colors.hof[100]`     | `colors.hof[200]`      |

The inner view uses a 1 px border of the same border color to add definition.

### Connector (rail segment)

```
width: 2
flex: 1
backgroundColor: connectorDone ? colors.babu[300] : colors.divider
```

Not rendered when `isLast === true`.

### Props (unchanged interface)

```ts
{
  icon: React.ReactNode
  label: string
  value?: string
  state: "done" | "active" | "pending"
  isFirst?: boolean   // controls paddingTop on first item
  isLast?: boolean    // hides connector + removes paddingBottom
  connectorDone?: boolean  // colors this item's outgoing connector green
}
```

`isFirst` adds `paddingTop: sm` to the right column on the first item only.

---

## Usage Site Fix

Location: `HandoverDetailScreen.tsx` ~line 1141.

Changes:
1. Remove `<Separator />` between events.
2. Pass `isFirst`, `isLast`, and `connectorDone` on each `VerticalTimelineEvent`:

```tsx
{timelineEvents.map((event, i) => (
  <VerticalTimelineEvent
    key={event.key}
    icon={event.icon}
    label={event.label}
    value={event.value}
    state={event.state}
    isFirst={i === 0}
    isLast={i === timelineEvents.length - 1}
    connectorDone={event.state === "done"}
  />
))}
```

---

## What Does Not Change

- `TimelineEventData` type — unchanged.
- `timelineEvents` memo logic — unchanged.
- `SectionCard` — unchanged.
- State color semantics (`done`/`active`/`pending`) — unchanged.
- No new files, no new components, no new dependencies.
