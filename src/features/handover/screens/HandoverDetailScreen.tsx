// src/features/handover/screens/HandoverDetailScreen.tsx

import { useAppUser } from "@/src/features/auth/providers/user.provider"
import type { AppUser } from "@/src/features/auth/types"
import { getConversationByPartnerApi } from "@/src/features/chat/api"
import {
  useActivateC2CReturnReport,
  useGetC2CReturnReportById,
  useOwnerConfirmC2CReturnReport,
} from "@/src/features/handover/hooks"
import type { Handover, ReturnReportStatus } from "@/src/features/handover/types"
import { PostStatusBadge } from "@/src/features/post/components"
import type { Post } from "@/src/features/post/types"
import {
  AppImage,
  AppInlineError,
  AppUserAvatar,
} from "@/src/shared/components"
import { CHAT_ROUTE, POST_ROUTE } from "@/src/shared/constants"
import { colors, metrics } from "@/src/shared/theme"
import { formatDate, formatShortEventTime } from "@/src/shared/utils"
import * as Haptics from "expo-haptics"
import { router, Stack, useLocalSearchParams } from "expo-router"
import {
  ArrowLeftIcon,
  CalendarBlankIcon,
  CalendarCheckIcon,
  CalendarXIcon,
  ChatCenteredTextIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  HandshakeIcon,
  HourglassIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
  WarningCircleIcon,
} from "phosphor-react-native"
import React, { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// ─── Status badge ─────────────────────────────────────────────────────────────

type StatusTheme = { label: string; color: string; bgColor: string }

const STATUS_THEME: Record<ReturnReportStatus, StatusTheme> = {
  Draft: { label: "Setting Up", color: colors.hof[500], bgColor: colors.hof[100] },
  Active: { label: "In Progress", color: colors.kazan[500], bgColor: colors.kazan[100] },
  Confirmed: { label: "Completed", color: colors.babu[500], bgColor: colors.babu[100] },
  Rejected: { label: "Rejected", color: colors.error[500], bgColor: colors.error[100] },
  Expired: { label: "Expired", color: colors.hof[400], bgColor: colors.hof[100] },
}

const HandoverStatusBadge = ({ status }: { status: ReturnReportStatus }) => {
  const { label, color, bgColor } = STATUS_THEME[status]
  return (
    <View
      className="self-start px-3 py-1 rounded-full"
      style={{ backgroundColor: bgColor, borderWidth: 1, borderColor: color }}
    >
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  )
}

// ─── Progress stepper ─────────────────────────────────────────────────────────

type StepState = "done" | "active" | "pending"

type StepDef = {
  label: string
  sublabel: string
  state: StepState
}

function deriveSteps(status: ReturnReportStatus, isFinder: boolean): StepDef[] {
  const steps: StepDef[] = [
    {
      label: "Coordinate",
      sublabel: "Chat & agree on meetup",
      state: "pending",
    },
    {
      label: isFinder ? "You Deliver" : "Finder Delivers",
      sublabel: "Item handed over",
      state: "pending",
    },
    {
      label: isFinder ? "Owner Confirms" : "You Confirm",
      sublabel: "Receipt acknowledged",
      state: "pending",
    },
  ]

  if (status === "Draft") {
    steps[0].state = "active"
  } else if (status === "Active") {
    // Finder has already marked delivery — step 1 and 2 done; step 3 is what we're waiting on
    steps[0].state = "done"
    steps[1].state = "done"
    steps[2].state = "active"
  } else if (status === "Confirmed") {
    steps[0].state = "done"
    steps[1].state = "done"
    steps[2].state = "done"
  }
  return steps
}

const StepDot = ({ state }: { state: StepState }) => {
  if (state === "done") {
    return (
      <View
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: colors.babu[400] }}
      >
        <CheckCircleIcon size={18} color={colors.white} weight="fill" />
      </View>
    )
  }
  if (state === "active") {
    return (
      <View
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{
          backgroundColor: colors.primary,
          borderWidth: 2,
          borderColor: colors.rausch[100],
        }}
      >
        <View className="w-2.5 h-2.5 rounded-full bg-white" />
      </View>
    )
  }
  return (
    <View
      className="w-8 h-8 rounded-full items-center justify-center"
      style={{ backgroundColor: colors.hof[100], borderWidth: 1.5, borderColor: colors.hof[300] }}
    >
      <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.hof[300] }} />
    </View>
  )
}

const ProgressStepper = ({
  status,
  isFinder,
}: {
  status: ReturnReportStatus
  isFinder: boolean
}) => {
  const steps = deriveSteps(status, isFinder)

  return (
    <View className="flex-row items-start justify-between px-2 py-4">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          {/* Step */}
          <View className="items-center flex-1">
            <StepDot state={step.state} />
            <Text
              className="text-xs font-semibold mt-1.5 text-center"
              style={{
                color:
                  step.state === "done"
                    ? colors.babu[400]
                    : step.state === "active"
                      ? colors.primary
                      : colors.hof[400],
              }}
              numberOfLines={1}
            >
              {step.label}
            </Text>
            <Text
              className="text-xs mt-0.5 text-center"
              style={{ color: colors.hof[400] }}
              numberOfLines={1}
            >
              {step.sublabel}
            </Text>
          </View>

          {/* Connector */}
          {i < steps.length - 1 && (
            <View
              className="h-0.5 mt-4"
              style={{
                flex: 0.4,
                backgroundColor:
                  steps[i + 1].state === "pending" ? colors.hof[200] : colors.babu[200],
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  )
}

// ─── Post card ────────────────────────────────────────────────────────────────

const PostCard = ({ post, label }: { post: Post; label: string }) => {
  const imageUrl = post.imageUrls?.[0]

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push(POST_ROUTE.details(post.id))
  }, [post.id])

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="flex-1 overflow-hidden rounded-2xl border border-divider"
      style={
        Platform.OS === "ios"
          ? metrics.shadows.level1.ios
          : metrics.shadows.level1.android
      }
    >
      <View style={{ aspectRatio: 1 }}>
        <AppImage
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View className="absolute top-2 left-2">
          <PostStatusBadge status={post.postType} size="sm" />
        </View>
      </View>
      <View className="px-3 py-2.5 gap-1 bg-surface">
        <Text className="text-xs font-semibold text-textMuted uppercase tracking-wide">
          {label}
        </Text>
        <Text className="text-sm font-bold text-textPrimary" numberOfLines={2}>
          {post.item.itemName}
        </Text>
        <View className="flex-row items-center gap-1">
          <MapPinIcon size={11} color={colors.text.muted} weight="fill" />
          <Text className="flex-1 text-xs text-textMuted" numberOfLines={1}>
            {post.displayAddress ?? "—"}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <CalendarBlankIcon size={11} color={colors.text.muted} weight="regular" />
          <Text className="flex-1 text-xs text-textMuted" numberOfLines={1}>
            {formatShortEventTime(post.eventTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const EmptyPostCard = ({ label }: { label: string }) => (
  <View
    className="flex-1 rounded-2xl border border-divider items-center justify-center bg-canvas"
    style={{ aspectRatio: 0.75 }}
  >
    <Text className="text-xs text-textMuted">{label}</Text>
    <Text className="text-xs text-textMuted mt-1">Not linked yet</Text>
  </View>
)

// ─── Party row ────────────────────────────────────────────────────────────────

const PartyRow = ({
  user,
  role,
  isCurrentUser,
}: {
  user: AppUser | null
  role: "Finder" | "Owner"
  isCurrentUser: boolean
}) => {
  const roleColor = role === "Finder" ? colors.info[500] : colors.kazan[500]
  const roleBg = role === "Finder" ? colors.info[50] : colors.kazan[100]

  return (
    <View className="flex-row items-center gap-md py-sm px-md">
      {user ? (
        <AppUserAvatar avatarUrl={user.avatarUrl} size={44} />
      ) : (
        <View
          className="rounded-full items-center justify-center"
          style={{ width: 44, height: 44, backgroundColor: colors.hof[100] }}
        >
          <UserIcon size={22} color={colors.hof[400]} />
        </View>
      )}
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-sm font-semibold text-textPrimary">
            {user?.displayName ?? "Not assigned"}
          </Text>
          {isCurrentUser && (
            <Text className="text-xs text-textMuted">(You)</Text>
          )}
        </View>
        {user?.phone && (
          <Text className="text-xs text-textMuted">{user.phone}</Text>
        )}
      </View>
      <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: roleBg }}>
        <Text className="text-xs font-semibold" style={{ color: roleColor }}>
          {role}
        </Text>
      </View>
    </View>
  )
}

// ─── Timeline row ─────────────────────────────────────────────────────────────

const TimelineRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <View className="flex-row items-center gap-md py-sm px-md">
    <View
      className="w-9 h-9 rounded-full items-center justify-center bg-canvas"
      style={{ borderWidth: 1, borderColor: colors.divider }}
    >
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-xs text-textMuted">{label}</Text>
      <Text className="text-sm font-semibold text-textPrimary">{value}</Text>
    </View>
  </View>
)

// ─── Section card ─────────────────────────────────────────────────────────────

const SectionCard = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <View className="mb-4">
    <Text className="text-xs font-bold text-textMuted uppercase tracking-wide mb-2 px-1">
      {title}
    </Text>
    <View
      className="bg-surface rounded-2xl overflow-hidden border border-divider"
      style={
        Platform.OS === "ios"
          ? metrics.shadows.level1.ios
          : metrics.shadows.level1.android
      }
    >
      {children}
    </View>
  </View>
)

const Separator = () => <View className="h-px bg-divider mx-md" />

// ─── Action panel ─────────────────────────────────────────────────────────────

type ActionPanelProps = {
  report: Handover
  isFinder: boolean
  isOwner: boolean
  onActivate: () => void
  onConfirm: () => void
  isActivating: boolean
  isConfirming: boolean
}

const ACTION_PANEL_HEIGHT = 120

const ActionPanel = ({
  report,
  isFinder,
  isOwner,
  onActivate,
  onConfirm,
  isActivating,
  isConfirming,
}: ActionPanelProps) => {
  const { status } = report

  // ── Confirmed ──
  if (status === "Confirmed") {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ height: ACTION_PANEL_HEIGHT }}
      >
        <View
          className="flex-1 flex-row items-center justify-center gap-sm rounded-2xl"
          style={{ backgroundColor: colors.babu[100] }}
        >
          <CheckCircleIcon size={22} color={colors.babu[500]} weight="fill" />
          <View>
            <Text className="text-sm font-bold" style={{ color: colors.babu[500] }}>
              Handover Complete
            </Text>
            <Text className="text-xs" style={{ color: colors.babu[400] }}>
              The item has been successfully returned.
            </Text>
          </View>
        </View>
      </View>
    )
  }

  // ── Expired / Rejected ──
  if (status === "Expired" || status === "Rejected") {
    const label =
      status === "Expired"
        ? "This handover has expired."
        : "This handover was rejected."
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ height: ACTION_PANEL_HEIGHT }}
      >
        <View
          className="flex-1 flex-row items-center justify-center gap-sm rounded-2xl"
          style={{ backgroundColor: colors.error[100] }}
        >
          <WarningCircleIcon size={22} color={colors.error[500]} weight="fill" />
          <Text className="text-sm font-medium" style={{ color: colors.error[500] }}>
            {label}
          </Text>
        </View>
      </View>
    )
  }

  // ── Draft — Finder: can mark delivery ──
  if (status === "Draft" && isFinder) {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ height: ACTION_PANEL_HEIGHT }}
      >
        <Text className="text-xs text-textMuted mb-2">
          Once you hand the item back, tap below so the owner can confirm receipt.
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isActivating}
          onPress={onActivate}
          className="flex-row items-center justify-center gap-sm rounded-xl"
          style={{
            height: metrics.layout.controlHeight.xl,
            backgroundColor: isActivating ? colors.hof[300] : colors.primary,
          }}
        >
          {isActivating ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <PackageIcon size={18} color={colors.white} weight="bold" />
              <Text className="text-base font-semibold text-white">
                I&apos;ve Delivered the Item
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  // ── Draft — Owner: waiting for finder to deliver ──
  if (status === "Draft" && isOwner) {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ height: ACTION_PANEL_HEIGHT }}
      >
        <View
          className="flex-1 flex-row items-center gap-sm px-md rounded-2xl"
          style={{ backgroundColor: colors.hof[50] }}
        >
          <HourglassIcon size={22} color={colors.hof[400]} weight="fill" />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-textPrimary">
              Waiting for Finder
            </Text>
            <Text className="text-xs text-textMuted mt-0.5">
              The finder will tap &quot;Delivered&quot; when they hand over the item.
            </Text>
          </View>
        </View>
      </View>
    )
  }

  // ── Active — Finder already delivered, waiting for owner ──
  if (status === "Active" && isFinder) {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ height: ACTION_PANEL_HEIGHT }}
      >
        <View
          className="flex-1 flex-row items-center gap-sm px-md rounded-2xl"
          style={{ backgroundColor: colors.kazan[100] }}
        >
          <HourglassIcon size={22} color={colors.kazan[500]} weight="fill" />
          <View className="flex-1">
            <Text className="text-sm font-semibold" style={{ color: colors.kazan[600] }}>
              Delivery Marked
            </Text>
            <Text className="text-xs mt-0.5" style={{ color: colors.kazan[600] }}>
              Waiting for the owner to confirm they received the item.
            </Text>
          </View>
        </View>
      </View>
    )
  }

  // ── Active — Owner: confirm receipt ──
  if (status === "Active" && isOwner) {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ height: ACTION_PANEL_HEIGHT }}
      >
        <Text className="text-xs text-textMuted mb-2">
          The finder says they&apos;ve returned the item. Confirm if you received it.
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isConfirming}
          onPress={onConfirm}
          className="flex-row items-center justify-center gap-sm rounded-xl"
          style={{
            height: metrics.layout.controlHeight.xl,
            backgroundColor: isConfirming ? colors.hof[300] : colors.babu[400],
          }}
        >
          {isConfirming ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <CheckCircleIcon size={18} color={colors.white} weight="bold" />
              <Text className="text-base font-semibold text-white">
                I&apos;ve Received the Item
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  return null
}

// ─── Title derivation ─────────────────────────────────────────────────────────

function deriveTitle(report: Handover): string {
  const finderName = report.finderPost?.item.itemName
  const ownerName = report.ownerPost?.item.itemName
  if (finderName && ownerName) return `${finderName} \u2194 ${ownerName}`
  if (finderName) return `Found: ${finderName}`
  if (ownerName) return `Lost: ${ownerName}`
  return "Return Report"
}

// ─── Main screen ──────────────────────────────────────────────────────────────

const HandoverDetailScreen = () => {
  const { handoverId } = useLocalSearchParams<{ handoverId: string }>()
  const { user: currentUser } = useAppUser()

  const {
    data: report,
    isLoading,
    error,
  } = useGetC2CReturnReportById(handoverId ?? "")

  const { activate, isActivating } = useActivateC2CReturnReport()
  const { ownerConfirm, isConfirming } = useOwnerConfirmC2CReturnReport()

  const [isOpeningChat, setIsOpeningChat] = useState(false)

  const isFinder = useMemo(
    () => !!currentUser && report?.finder?.id === currentUser.id,
    [currentUser, report],
  )
  const isOwner = useMemo(
    () => !!currentUser && report?.owner?.id === currentUser.id,
    [currentUser, report],
  )

  // ID of the other party (used for chat navigation)
  const counterpartId = useMemo(() => {
    if (isFinder) return report?.owner?.id
    if (isOwner) return report?.finder?.id
    return undefined
  }, [isFinder, isOwner, report])

  const handleOpenChat = useCallback(async () => {
    if (!counterpartId) return
    setIsOpeningChat(true)
    try {
      const res = await getConversationByPartnerApi(counterpartId)
      const conversationId = res.data?.conversation?.conversationId
      if (conversationId) {
        router.push(CHAT_ROUTE.message(conversationId))
      } else {
        Alert.alert("Chat not found", "No conversation exists with this person yet.")
      }
    } catch {
      Alert.alert("Error", "Could not open the chat. Please try again.")
    } finally {
      setIsOpeningChat(false)
    }
  }, [counterpartId])

  const handleActivate = useCallback(() => {
    if (!report) return
    Alert.alert(
      "Mark as Delivered?",
      "This tells the owner you have handed over the item. They will then confirm receipt to complete the handover.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Delivery",
          style: "default",
          onPress: async () => {
            try {
              await activate(report.id)
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            } catch {
              Alert.alert("Error", "Could not mark as delivered. Please try again.")
            }
          },
        },
      ],
    )
  }, [report, activate])

  const handleConfirm = useCallback(() => {
    if (!report) return
    Alert.alert(
      "Confirm Receipt?",
      "Confirm that you have received the item. This will complete the handover and award the finder their points.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            try {
              await ownerConfirm(report.id)
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            } catch {
              Alert.alert("Error", "Could not confirm receipt. Please try again.")
            }
          },
        },
      ],
    )
  }, [report, ownerConfirm])

  // ── Loading ──
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-row items-center px-lg pt-sm pb-sm gap-sm border-b border-divider bg-surface">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeftIcon size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text className="flex-1 text-base font-semibold text-textPrimary">
            Handover Details
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  // ── Error / Not found ──
  if (error || !report) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-row items-center px-lg pt-sm pb-sm gap-sm border-b border-divider bg-surface">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeftIcon size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text className="flex-1 text-base font-semibold text-textPrimary">
            Handover Details
          </Text>
        </View>
        <AppInlineError message={error?.message ?? "Handover not found."} />
      </SafeAreaView>
    )
  }

  const hasActionPanel = report.status !== undefined

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
      <View
        className="flex-row items-center px-lg pt-sm pb-sm bg-surface border-b border-divider gap-sm"
        style={
          Platform.OS === "ios"
            ? { ...metrics.shadows.tabBar.ios }
            : metrics.shadows.tabBar.android
        }
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeftIcon size={24} color={colors.text.primary} />
        </TouchableOpacity>

        {/* Title — item names derived from the report */}
        <Text className="flex-1 text-base font-semibold text-textPrimary" numberOfLines={1}>
          {deriveTitle(report)}
        </Text>

        {/* Chat button — only when a counterpart exists */}
        {counterpartId && (
          <TouchableOpacity
            onPress={handleOpenChat}
            disabled={isOpeningChat}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          >
            {isOpeningChat ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <ChatCenteredTextIcon size={24} color={colors.primary} weight="duotone" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: hasActionPanel ? ACTION_PANEL_HEIGHT + 16 : 32,
        }}
      >
        {/* ── Title ── */}
        <View className="mb-4">
          <Text className="text-xl font-bold text-textPrimary" numberOfLines={2}>
            {deriveTitle(report)}
          </Text>
          <View className="flex-row items-center gap-sm mt-2">
            <HandoverStatusBadge status={report.status} />
            <View className="flex-row items-center gap-xs">
              <CalendarBlankIcon size={12} color={colors.text.muted} />
              <Text className="text-sm text-textMuted">
                {formatDate(report.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Progress stepper ── */}
        <View
          className="bg-surface rounded-2xl border border-divider mb-4 px-2"
          style={
            Platform.OS === "ios"
              ? metrics.shadows.level1.ios
              : metrics.shadows.level1.android
          }
        >
          <ProgressStepper status={report.status} isFinder={isFinder} />
        </View>

        {/* ── Items involved ── */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-textMuted uppercase tracking-wide mb-2 px-1">
            Items Involved
          </Text>
          <View className="flex-row gap-3">
            {report.finderPost ? (
              <PostCard post={report.finderPost} label="Found by finder" />
            ) : (
              <EmptyPostCard label="Finder's Post" />
            )}
            {report.ownerPost ? (
              <PostCard post={report.ownerPost} label="Lost by owner" />
            ) : (
              <EmptyPostCard label="Owner's Post" />
            )}
          </View>
        </View>

        {/* ── Parties ── */}
        <SectionCard title="Parties">
          <PartyRow
            user={report.finder}
            role="Finder"
            isCurrentUser={isFinder}
          />
          <Separator />
          <PartyRow
            user={report.owner}
            role="Owner"
            isCurrentUser={isOwner}
          />
        </SectionCard>

        {/* ── Timeline ── */}
        <SectionCard title="Timeline">
          <TimelineRow
            icon={<HandshakeIcon size={18} color={colors.hof[500]} weight="fill" />}
            label="Created"
            value={formatDate(report.createdAt)}
          />
          <Separator />
          <TimelineRow
            icon={
              <ClockCountdownIcon size={18} color={colors.kazan[500]} weight="fill" />
            }
            label="Expires"
            value={formatDate(report.expiresAt)}
          />
          {(report.status === "Active" || report.status === "Confirmed") && (
            <>
              <Separator />
              <TimelineRow
                icon={
                  <PackageIcon size={18} color={colors.primary} weight="fill" />
                }
                label="Delivery Marked"
                value={report.activatedByRole ? `By ${report.activatedByRole}` : "\u2014"}
              />
            </>
          )}
          {report.confirmedAt && (
            <>
              <Separator />
              <TimelineRow
                icon={
                  <CalendarCheckIcon size={18} color={colors.babu[500]} weight="fill" />
                }
                label="Confirmed"
                value={formatDate(report.confirmedAt)}
              />
            </>
          )}
          {report.status === "Rejected" && (
            <>
              <Separator />
              <TimelineRow
                icon={
                  <CalendarXIcon size={18} color={colors.error[500]} weight="fill" />
                }
                label="Rejected"
                value={formatDate(report.expiresAt)}
              />
            </>
          )}
        </SectionCard>
      </ScrollView>

      {/* ── Action panel (fixed at bottom) ── */}
      {hasActionPanel && (
        <View
          className="absolute left-0 right-0 bottom-0 bg-surface"
          style={
            Platform.OS === "ios"
              ? metrics.shadows.level2.ios
              : metrics.shadows.level2.android
          }
        >
          <ActionPanel
            report={report}
            isFinder={isFinder}
            isOwner={isOwner}
            onActivate={handleActivate}
            onConfirm={handleConfirm}
            isActivating={isActivating}
            isConfirming={isConfirming}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default HandoverDetailScreen
