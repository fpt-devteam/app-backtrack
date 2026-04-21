# Timeline Full Rail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `VerticalTimelineEvent` in `HandoverDetailScreen.tsx` to render a continuous vertical rail with outer-ring dots and progressive green coloring.

**Architecture:** Two-column flex layout (`alignItems: "stretch"`) where the left column holds the 44px ring-dot and a `flex: 1` connector that naturally fills the gap to the next dot. The right column (text) determines row height. Rail segments turn green when the preceding event's state is `"done"`.

**Tech Stack:** React Native, NativeWind, existing theme tokens (`colors`, `metrics`).

---

## Files

- Modify: `src/features/handover/screens/HandoverDetailScreen.tsx`
  - Rewrite `VerticalTimelineEvent` (lines 378–470)
  - Fix usage site (lines 1141–1153)

---

### Task 1: Impact analysis

- [ ] **Run GitNexus impact on `VerticalTimelineEvent`**

```bash
# In the OpenCode session, run:
# gitnexus_impact({ target: "VerticalTimelineEvent", direction: "upstream" })
```

Expected: LOW risk — component is only used in the one `SectionCard` block inside `HandoverDetailScreen`. Confirm no other callers before proceeding.

---

### Task 2: Rewrite `VerticalTimelineEvent`

**File:** `src/features/handover/screens/HandoverDetailScreen.tsx`

- [ ] **Replace the component body (lines 378–470)**

Replace the entire `VerticalTimelineEvent` const (from `const VerticalTimelineEvent` through its closing `}`) with:

```tsx
const VerticalTimelineEvent = ({
  icon,
  label,
  value,
  state,
  isFirst = false,
  isLast = false,
  connectorDone = false,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  state: "done" | "active" | "pending"
  isFirst?: boolean
  isLast?: boolean
  connectorDone?: boolean
}) => {
  const DOT_OUTER = 44
  const DOT_INNER = 34
  const PAD_H = metrics.spacing.md
  const PAD_V = metrics.spacing.sm

  const ringBg =
    state === "done"
      ? colors.babu[100]
      : state === "active"
        ? colors.rausch[100]
        : colors.hof[100]

  const innerBorder =
    state === "done"
      ? colors.babu[300]
      : state === "active"
        ? colors.rausch[500]
        : colors.hof[200]

  const lineColor = connectorDone ? colors.babu[300] : colors.divider

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "stretch",
        paddingHorizontal: PAD_H,
      }}
    >
      {/* Left column: ring dot + connector rail */}
      <View style={{ width: DOT_OUTER, alignItems: "center" }}>
        {/* Outer colored ring */}
        <View
          style={{
            width: DOT_OUTER,
            height: DOT_OUTER,
            borderRadius: DOT_OUTER / 2,
            backgroundColor: ringBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Inner white dot */}
          <View
            style={{
              width: DOT_INNER,
              height: DOT_INNER,
              borderRadius: DOT_INNER / 2,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: innerBorder,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </View>
        </View>

        {/* Connector: fills remaining row height, hidden on last item */}
        {!isLast && (
          <View
            style={{
              width: 2,
              flex: 1,
              minHeight: 8,
              backgroundColor: lineColor,
            }}
          />
        )}
      </View>

      {/* Right column: label + value */}
      <View
        style={{
          flex: 1,
          paddingLeft: PAD_H,
          paddingTop: PAD_V,
          paddingBottom: PAD_V,
        }}
      >
        {value ? (
          <>
            <Text className="text-xs text-textMuted">{label}</Text>
            <Text className="text-sm font-semibold text-textPrimary">{value}</Text>
          </>
        ) : (
          <Text className="text-sm font-semibold text-textPrimary">{label}</Text>
        )}
      </View>
    </View>
  )
}
```

---

### Task 3: Fix the usage site

**File:** `src/features/handover/screens/HandoverDetailScreen.tsx` (~line 1141)

- [ ] **Replace the timeline JSX block**

Find this block:

```tsx
{/* ── Timeline ── */}
<SectionCard title="Timeline">
  {timelineEvents.map((event, i) => (
    <React.Fragment key={event.key}>
      <VerticalTimelineEvent
        icon={event.icon}
        label={event.label}
        value={event.value}
        state={event.state}
      />
      {i < timelineEvents.length - 1 && <Separator />}
    </React.Fragment>
  ))}
</SectionCard>
```

Replace with:

```tsx
{/* ── Timeline ── */}
<SectionCard title="Timeline">
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
</SectionCard>
```

Changes made:
- Removed `<React.Fragment>` wrapper (key moves to `VerticalTimelineEvent` directly)
- Removed `{i < timelineEvents.length - 1 && <Separator />}`
- Added `isFirst`, `isLast`, `connectorDone` props

---

### Task 4: Verify types and lint

- [ ] **Run full check**

```bash
npm run check:all
```

Expected: no TypeScript errors, no lint errors.

If `colors.hof[200]` or any other token causes a TS error, replace it with `colors.divider` (which equals `palette.hof[200]`):

```tsx
// fallback if hof[200] isn't typed as an index:
const innerBorder =
  state === "done"
    ? colors.babu[300]
    : state === "active"
      ? colors.rausch[500]
      : colors.divider
```

---

### Task 5: Pre-commit scope check + commit

- [ ] **Run GitNexus detect changes**

```bash
# In OpenCode session:
# gitnexus_detect_changes({ scope: "all" })
```

Expected: only `HandoverDetailScreen.tsx` modified.

- [ ] **Commit**

```bash
git add src/features/handover/screens/HandoverDetailScreen.tsx
git commit -m "feat(handover): redesign timeline with full rail and outer-ring dots"
```
