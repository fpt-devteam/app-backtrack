// src/features/handover/screens/HandoverDetailScreen.tsx

import { useAppUser } from "@/src/features/auth/providers/user.provider";
import type { AppUser } from "@/src/features/auth/types";
import {
  createDirectConversationApi,
  getConversationByPartnerApi,
} from "@/src/features/chat/api";
import {
  getHandoverCounterpart,
  getHandoverDetailGuidance,
  getHandoverNextStep,
  getHandoverStatusLabel,
  getHandoverTitle,
  getHandoverViewerRole,
} from "@/src/features/handover/components";
import {
  useActivateC2CReturnReport,
  useGetC2CReturnReportById,
  useOwnerConfirmC2CReturnReport,
  useOwnerRejectC2CReturnReport,
} from "@/src/features/handover/hooks";
import type {
  Handover,
  HandoverPost,
  ReturnReportStatus,
} from "@/src/features/handover/types";
import { PostTypeIconBadge } from "@/src/features/post/components";
import {
  AppImage,
  AppInlineError,
  AppUserAvatar,
} from "@/src/shared/components";
import { CHAT_ROUTE, POST_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { formatDate, formatShortEventTime } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftIcon,
  CalendarBlankIcon,
  CalendarCheckIcon,
  ChatCenteredTextIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  HandshakeIcon,
  HourglassIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  InteractionManager,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Status badge ─────────────────────────────────────────────────────────────

type StatusTheme = { color: string; bgColor: string };

const STATUS_THEME: Record<ReturnReportStatus, StatusTheme> = {
  Ongoing: { color: colors.kazan[500], bgColor: colors.kazan[100] },
  Delivered: { color: colors.info[500], bgColor: colors.info[50] },
  Confirmed: { color: colors.babu[500], bgColor: colors.babu[100] },
  Rejected: { color: colors.error[500], bgColor: colors.error[100] },
  Closed: { color: colors.hof[400], bgColor: colors.hof[100] },
};

const HandoverStatusBadge = ({ status }: { status: ReturnReportStatus }) => {
  const { color, bgColor } = STATUS_THEME[status];
  const label = getHandoverStatusLabel(status);
  return (
    <View
      className="self-start px-3 py-1 rounded-full"
      style={{ backgroundColor: bgColor, borderWidth: 1, borderColor: color }}
    >
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
};

// ─── Progress stepper ─────────────────────────────────────────────────────────

type StepState = "done" | "active" | "pending";

type StepDef = {
  label: string;
  sublabel: string;
  state: StepState;
};

function deriveSteps(
  status: ReturnReportStatus,
  isFinder: boolean,
  hasMarkedDelivery: boolean,
): StepDef[] {
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
  ];

  if (status === "Ongoing") {
    steps[0].state = "active";
  } else if (status === "Delivered") {
    steps[0].state = "done";
    steps[1].state = "done";
    steps[2].state = "active";
  } else if (status === "Confirmed") {
    steps[0].state = "done";
    steps[1].state = "done";
    steps[2].state = "done";
  } else if (status === "Closed" || status === "Rejected") {
    if (hasMarkedDelivery) {
      steps[0].state = "done";
      steps[1].state = "done";
    }
  }
  return steps;
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
    );
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
    );
  }
  return (
    <View
      className="w-8 h-8 rounded-full items-center justify-center"
      style={{
        backgroundColor: colors.hof[100],
        borderWidth: 1.5,
        borderColor: colors.hof[300],
      }}
    >
      <View
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: colors.hof[300] }}
      />
    </View>
  );
};

const ProgressStepper = ({
  status,
  isFinder,
  hasMarkedDelivery,
  viewerRole,
}: {
  status: ReturnReportStatus;
  isFinder: boolean;
  hasMarkedDelivery: boolean;
  viewerRole: "Finder" | "Owner" | "Unknown";
}) => {
  const steps = deriveSteps(status, isFinder, hasMarkedDelivery);

  const stepsWithViewerCopy = useMemo(() => {
    if (viewerRole !== "Unknown") return steps;

    return steps.map((step) => {
      if (step.label === "You Deliver") {
        return { ...step, label: "Finder Delivers" };
      }

      if (step.label === "You Confirm") {
        return { ...step, label: "Owner Confirms" };
      }

      return step;
    });
  }, [steps, viewerRole]);

  return (
    <View className="flex-row items-start justify-between px-2 py-4">
      {stepsWithViewerCopy.map((step, i) => (
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
            >
              {step.label}
            </Text>
            <Text
              className="text-xs mt-0.5 text-center"
              style={{ color: colors.hof[400] }}
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
                  stepsWithViewerCopy[i + 1].state === "pending"
                    ? colors.hof[200]
                    : colors.babu[200],
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

// ─── Post card ────────────────────────────────────────────────────────────────

const PostCard = ({ post, label }: { post: HandoverPost; label: string }) => {
  const imageUrl = post.imageUrls?.[0];

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(POST_ROUTE.details(post.id));
  }, [post.id]);

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
          <PostTypeIconBadge status={post.postType} size="sm" />
        </View>
      </View>
      <View className="px-3 py-2.5 gap-1 bg-surface">
        <Text className="text-xs font-semibold text-textMuted uppercase tracking-wide">
          {label}
        </Text>
        <Text className="text-sm font-bold text-textPrimary" numberOfLines={2}>
          {post.postTitle}
        </Text>
        <View className="flex-row items-center gap-1">
          <MapPinIcon size={11} color={colors.text.muted} weight="fill" />
          <Text className="flex-1 text-xs text-textMuted" numberOfLines={1}>
            {post.displayAddress ?? "—"}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <CalendarBlankIcon
            size={11}
            color={colors.text.muted}
            weight="regular"
          />
          <Text className="flex-1 text-xs text-textMuted" numberOfLines={1}>
            {formatShortEventTime(post.eventTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmptyPostCard = ({ label }: { label: string }) => (
  <View
    className="flex-1 rounded-2xl border border-divider items-center justify-center bg-canvas"
    style={{ aspectRatio: 0.75 }}
  >
    <Text className="text-xs text-textMuted">{label}</Text>
    <Text className="text-xs text-textMuted mt-1">Not linked yet</Text>
  </View>
);

// ─── Party row ────────────────────────────────────────────────────────────────

const PartyRow = ({
  user,
  role,
  isCurrentUser,
}: {
  user: AppUser | null;
  role: "Finder" | "Owner";
  isCurrentUser: boolean;
}) => {
  const roleColor = role === "Finder" ? colors.babu[500] : colors.rausch[500];
  const roleBg = role === "Finder" ? colors.babu[100] : colors.rausch[100];

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
          <Text className="text-sm font-semibold">
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
      <View
        className="px-2.5 py-1 rounded-full"
        style={{ backgroundColor: roleBg }}
      >
        <Text className="text-xs font-semibold" style={{ color: roleColor }}>
          {role}
        </Text>
      </View>
    </View>
  );
};

// ─── Timeline ─────────────────────────────────────────────────────────────────

type TimelineEventData = {
  key: string;
  icon: React.ReactNode;
  label: string;
  value?: string;
  state: "done" | "active" | "pending";
};

const VerticalTimelineEvent = ({
  icon,
  label,
  value,
  state,
  isFirst = false,
  isLast = false,
  connectorDone = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  state: "done" | "active" | "pending";
  isFirst?: boolean;
  isLast?: boolean;
  connectorDone?: boolean;
}) => {
  const DOT_OUTER = 44;
  const DOT_INNER = 34;
  const PAD_H = metrics.spacing.md;
  const PAD_V = metrics.spacing.sm;

  const ringBg =
    state === "done"
      ? colors.babu[100]
      : state === "active"
        ? colors.rausch[100]
        : colors.hof[100];

  const innerBorder =
    state === "done"
      ? colors.babu[300]
      : state === "active"
        ? colors.rausch[500]
        : colors.divider;

  const lineColor = connectorDone ? colors.babu[300] : colors.divider;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "stretch",
        paddingHorizontal: PAD_H,
        paddingTop: isFirst ? PAD_V : 0,
        paddingBottom: isLast ? PAD_V : 0,
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
          paddingBottom: !isLast ? metrics.spacing.lg : 0,
        }}
      >
        {value ? (
          <>
            <Text className="text-xs text-textMuted">{label}</Text>
            <Text className="text-sm font-semibold text-textPrimary">
              {value}
            </Text>
          </>
        ) : (
          <Text className="text-sm font-semibold text-textPrimary">
            {label}
          </Text>
        )}
      </View>
    </View>
  );
};

// ─── Section card ─────────────────────────────────────────────────────────────

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
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
);

const Separator = () => <View className="h-px bg-divider mx-md" />;

// ─── Action panel ─────────────────────────────────────────────────────────────

type ActionPanelProps = {
  report: Handover;
  isFinder: boolean;
  isOwner: boolean;
  onActivate: () => void;
  onConfirm: () => void;
  onReject: () => void;
  isActivating: boolean;
  isConfirming: boolean;
  isRejecting: boolean;
};

const ACTION_PANEL_MIN_HEIGHT = 120;

const ActionPanel = ({
  report,
  isFinder,
  isOwner,
  onActivate,
  onConfirm,
  onReject,
  isActivating,
  isConfirming,
  isRejecting,
}: ActionPanelProps) => {
  const { status } = report;
  const hasMarkedDelivery = !!report.activatedByRole;

  // ── Confirmed ──
  if (status === "Confirmed") {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ minHeight: ACTION_PANEL_MIN_HEIGHT }}
      >
        <View
          className="flex-1 flex-row items-center justify-center gap-sm rounded-2xl"
          style={{ backgroundColor: colors.babu[100] }}
        >
          <CheckCircleIcon size={22} color={colors.babu[500]} weight="fill" />
          <View>
            <Text
              className="text-sm font-bold"
              style={{ color: colors.babu[500] }}
            >
              Handover Complete
            </Text>
            <Text className="text-xs" style={{ color: colors.babu[400] }}>
              The item has been successfully returned.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Closed / Rejected ──
  if (status === "Closed" || status === "Rejected") {
    const label =
      status === "Closed"
        ? "This handover was closed due to a mismatch."
        : "This handover was rejected.";
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ minHeight: ACTION_PANEL_MIN_HEIGHT }}
      >
        <View
          className="flex-1 flex-row items-center justify-center gap-sm rounded-2xl"
          style={{ backgroundColor: colors.error[100] }}
        >
          <WarningCircleIcon
            size={22}
            color={colors.error[500]}
            weight="fill"
          />
          <Text
            className="text-sm font-medium"
            style={{ color: colors.error[500] }}
          >
            {label}
          </Text>
        </View>
      </View>
    );
  }

  // ── Ongoing — Finder: can mark delivery ──
  if (status === "Ongoing" && isFinder) {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ minHeight: ACTION_PANEL_MIN_HEIGHT }}
      >
        <Text className="text-xs text-textMuted mb-2">
          Once you hand the item back, mark it here so the owner can confirm
          receipt.
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
    );
  }

  // ── Ongoing — Owner: waiting for finder to deliver ──
  if (status === "Ongoing" && isOwner) {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ minHeight: ACTION_PANEL_MIN_HEIGHT }}
      >
        <View
          className="flex-1 flex-row items-center gap-sm px-md rounded-2xl"
          style={{ backgroundColor: colors.hof[50] }}
        >
          <HourglassIcon size={22} color={colors.hof[400]} weight="fill" />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-textPrimary">
              Waiting for delivery
            </Text>
            <Text className="text-xs text-textMuted mt-0.5">
              The finder will mark this handover as delivered after the item is
              handed back.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Delivered — Finder: waiting for owner ──
  if (status === "Delivered" && isFinder) {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ minHeight: ACTION_PANEL_MIN_HEIGHT }}
      >
        <View
          className="flex-1 flex-row items-center gap-sm px-md rounded-2xl"
          style={{ backgroundColor: colors.kazan[100] }}
        >
          <HourglassIcon size={22} color={colors.kazan[500]} weight="fill" />
          <View className="flex-1">
            <Text
              className="text-sm font-semibold"
              style={{ color: colors.kazan[600] }}
            >
              Waiting for confirmation
            </Text>
            <Text
              className="text-xs mt-0.5"
              style={{ color: colors.kazan[600] }}
            >
              You marked the item as delivered. The owner can confirm receipt to
              complete the handover.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Delivered — Owner: confirm receipt or reject ──
  if (status === "Delivered" && isOwner) {
    return (
      <View
        className="px-lg py-md2 border-t border-divider bg-surface"
        style={{ minHeight: ACTION_PANEL_MIN_HEIGHT }}
      >
        <Text className="text-xs text-textMuted mb-2">
          The finder marked this handover as delivered. Confirm once you have
          the item in hand.
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isConfirming || isRejecting}
          onPress={onConfirm}
          className="flex-row items-center justify-center gap-sm rounded-xl mb-2"
          style={{
            height: metrics.layout.controlHeight.xl,
            backgroundColor:
              isConfirming || isRejecting ? colors.hof[300] : colors.babu[400],
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
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isConfirming || isRejecting}
          onPress={onReject}
          className="flex-row items-center justify-center gap-sm rounded-xl border border-error"
          style={{
            height: metrics.layout.controlHeight.xl,
            backgroundColor: isRejecting ? colors.error[100] : colors.surface,
          }}
        >
          {isRejecting ? (
            <ActivityIndicator size="small" color={colors.error[500]} />
          ) : (
            <>
              <XCircleIcon size={18} color={colors.error[500]} weight="bold" />
              <Text
                className="text-base font-semibold"
                style={{ color: colors.error[500] }}
              >
                Reject Handover
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

// ─── Main screen ──────────────────────────────────────────────────────────────

const HandoverDetailScreen = () => {
  const { handoverId } = useLocalSearchParams<{ handoverId: string }>();
  const { user: currentUser } = useAppUser();

  const {
    data: report,
    isLoading,
    error,
  } = useGetC2CReturnReportById(handoverId ?? "");

  const { activate, isActivating } = useActivateC2CReturnReport();
  const { ownerConfirm, isConfirming } = useOwnerConfirmC2CReturnReport();
  const { ownerReject, isRejecting } = useOwnerRejectC2CReturnReport();

  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [actionPanelHeight, setActionPanelHeight] = useState(
    ACTION_PANEL_MIN_HEIGHT,
  );

  const isFinder = useMemo(
    () => !!currentUser && report?.finder?.id === currentUser.id,
    [currentUser, report],
  );
  const isOwner = useMemo(
    () => !!currentUser && report?.owner?.id === currentUser.id,
    [currentUser, report],
  );

  // ID of the other party (used for chat navigation)
  const counterpartId = useMemo(() => {
    if (isFinder) return report?.owner?.id;
    if (isOwner) return report?.finder?.id;
    return undefined;
  }, [isFinder, isOwner, report]);

  const counterpart = useMemo(
    () => (report ? getHandoverCounterpart(report, currentUser?.id) : null),
    [report, currentUser?.id],
  );
  const viewerRole = useMemo(
    () => (report ? getHandoverViewerRole(report, currentUser?.id) : "Unknown"),
    [report, currentUser?.id],
  );
  const title = useMemo(
    () => (report ? getHandoverTitle(report) : "Handover"),
    [report],
  );
  const statusLabel = useMemo(
    () => (report ? getHandoverStatusLabel(report.status) : "Handover"),
    [report],
  );
  const hasMarkedDelivery = !!report?.activatedByRole;
  const nextStep = useMemo(() => {
    if (!report) return "Review handover details";
    return getHandoverNextStep(report, currentUser?.id);
  }, [report, currentUser?.id]);
  const detailGuidance = useMemo(() => {
    if (!report) return "";
    return getHandoverDetailGuidance(report, currentUser?.id);
  }, [report, currentUser?.id]);

  const timelineEvents = useMemo((): TimelineEventData[] => {
    if (!report) return [];
    const events: TimelineEventData[] = [
      {
        key: "created",
        icon: <HandshakeIcon size={18} color={colors.hof[500]} weight="fill" />,
        label: "Created",
        value: formatDate(report.createdAt),
        state: "done",
      },
    ];
    if (report.status === "Ongoing" || report.status === "Delivered") {
      events.push({
        key: "expires",
        icon: (
          <ClockCountdownIcon
            size={18}
            color={colors.kazan[500]}
            weight="fill"
          />
        ),
        label: "Expires",
        value: formatDate(report.expiresAt),
        state: "active",
      });
    }
    if (report.activatedByRole) {
      events.push({
        key: "activated",
        icon: <PackageIcon size={18} color={colors.primary} weight="fill" />,
        label: `${report.activatedByRole} marked delivered`,
        state: "done",
      });
    }
    if (report.confirmedAt) {
      events.push({
        key: "confirmed",
        icon: (
          <CalendarCheckIcon size={18} color={colors.babu[500]} weight="fill" />
        ),
        label: "Confirmed",
        value: formatDate(report.confirmedAt),
        state: "done",
      });
    }
    if (report.status === "Rejected") {
      events.push({
        key: "rejected",
        icon: (
          <WarningCircleIcon
            size={18}
            color={colors.error[500]}
            weight="fill"
          />
        ),
        label: "Rejected",
        value: "Request was declined",
        state: "done",
      });
    }
    if (report.status === "Closed") {
      events.push({
        key: "closed",
        icon: (
          <WarningCircleIcon size={18} color={colors.hof[500]} weight="fill" />
        ),
        label: "Closed",
        value: "Items did not match",
        state: "done",
      });
    }
    return events;
  }, [report]);

  const handleActionPanelLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const measuredHeight = event.nativeEvent.layout.height;

      if (measuredHeight > 0 && measuredHeight !== actionPanelHeight) {
        setActionPanelHeight(measuredHeight);
      }
    },
    [actionPanelHeight],
  );

  const handleOpenChat = useCallback(async () => {
    if (!counterpartId) return;
    setIsOpeningChat(true);
    try {
      const res = await getConversationByPartnerApi(counterpartId);
      let conversationId = res.data?.conversation?.conversationId;

      if (!conversationId) {
        const created = await createDirectConversationApi({
          memberId: counterpartId,
        });
        conversationId = created.data?.conversation?.conversationId;
      }

      if (conversationId) {
        // Two-step navigation to avoid the jarring combined "tab switch + screen
        // push" animation. First switch to the chat tab (tab animation only),
        // then push the specific conversation once that transition settles.
        router.navigate(CHAT_ROUTE.index);
        InteractionManager.runAfterInteractions(() => {
          router.navigate(CHAT_ROUTE.message(conversationId));
        });
      } else {
        Alert.alert(
          "Chat not found",
          "No conversation exists with this person yet.",
        );
      }
    } catch {
      Alert.alert("Error", "Could not open the chat. Please try again.");
    } finally {
      setIsOpeningChat(false);
    }
  }, [counterpartId]);

  const handleActivate = useCallback(() => {
    if (!report) return;
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
              await activate(report.id);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            } catch {
              Alert.alert(
                "Error",
                "Could not mark as delivered. Please try again.",
              );
            }
          },
        },
      ],
    );
  }, [report, activate]);

  const handleConfirm = useCallback(() => {
    if (!report) return;
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
              await ownerConfirm(report.id);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            } catch {
              Alert.alert(
                "Error",
                "Could not confirm receipt. Please try again.",
              );
            }
          },
        },
      ],
    );
  }, [report, ownerConfirm]);

  const handleReject = useCallback(() => {
    if (!report) return;
    Alert.alert(
      "Reject Handover?",
      "Are you sure you want to reject this handover? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              await ownerReject(report.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } catch {
              Alert.alert(
                "Error",
                "Could not reject the handover. Please try again.",
              );
            }
          },
        },
      ],
    );
  }, [report, ownerReject]);

  // ── Loading ──
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View
          className="flex-row items-center px-lg pt-sm pb-sm bg-surface border-b border-divider"
          style={
            Platform.OS === "ios"
              ? { ...metrics.shadows.tabBar.ios }
              : metrics.shadows.tabBar.android
          }
        >
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="items-center justify-center rounded-full"
            style={{ width: 44, height: 44, backgroundColor: colors.hof[100] }}
          >
            <ArrowLeftIcon size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <Text className="flex-1 text-base font-semibold text-textPrimary text-center">
            Handover
          </Text>
          <View style={{ width: 44, height: 44 }} />
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Error / Not found ──
  if (error || !report) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View
          className="flex-row items-center px-lg pt-sm pb-sm bg-surface border-b border-divider"
          style={
            Platform.OS === "ios"
              ? { ...metrics.shadows.tabBar.ios }
              : metrics.shadows.tabBar.android
          }
        >
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="items-center justify-center rounded-full"
            style={{ width: 44, height: 44, backgroundColor: colors.hof[100] }}
          >
            <ArrowLeftIcon size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <Text className="flex-1 text-base font-semibold text-textPrimary text-center">
            Handover
          </Text>
          <View style={{ width: 44, height: 44 }} />
        </View>
        <AppInlineError message={error?.message ?? "Handover not found."} />
      </SafeAreaView>
    );
  }

  const hasActionPanel =
    report.status === "Confirmed" ||
    report.status === "Closed" ||
    report.status === "Rejected" ||
    ((report.status === "Ongoing" || report.status === "Delivered") &&
      (isFinder || isOwner));

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
      <View
        className="flex-row items-center px-lg pt-sm pb-sm border-b border-divider"
        style={
          Platform.OS === "ios"
            ? { ...metrics.shadows.tabBar.ios }
            : metrics.shadows.tabBar.android
        }
      >
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="items-center justify-center rounded-full"
          style={{ width: 44, height: 44 }}
        >
          <ArrowLeftIcon size={20} color={colors.text.primary} />
        </TouchableOpacity>

        <Text
          className="flex-1 text-base font-semibold text-textPrimary text-center"
          numberOfLines={1}
        >
          Handover
        </Text>

        {counterpartId ? (
          <TouchableOpacity
            onPress={handleOpenChat}
            disabled={isOpeningChat}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="items-center justify-center rounded-full"
            style={{ width: 44, height: 44 }}
          >
            {isOpeningChat ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <ChatCenteredTextIcon
                size={20}
                color={colors.primary}
                weight="duotone"
              />
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44, height: 44 }} />
        )}
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: hasActionPanel ? actionPanelHeight + 16 : 32,
        }}
      >
        <View
          className="mb-4 rounded-2xl border border-divider bg-surface px-lg py-lg"
          style={
            Platform.OS === "ios"
              ? metrics.shadows.level1.ios
              : metrics.shadows.level1.android
          }
        >
          <View className="flex-row items-start justify-between gap-sm">
            <View className="flex-1 gap-xs">
              <Text
                className="text-2xl font-semibold text-textPrimary"
                numberOfLines={2}
              >
                {title}
              </Text>

              <View className="flex-row items-center gap-sm flex-wrap">
                <HandoverStatusBadge status={report.status} />
              </View>
            </View>

            {counterpart ? (
              <AppUserAvatar avatarUrl={counterpart.avatarUrl} size={44} />
            ) : null}
          </View>

          <View className="mt-md gap-xs">
            <Text className="text-sm font-medium text-textPrimary">
              {counterpart?.displayName
                ? `With ${counterpart.displayName}`
                : "Counterpart"}
              {viewerRole === "Finder"
                ? " · Owner"
                : viewerRole === "Owner"
                  ? " · Finder"
                  : ""}
            </Text>
            <Text className="text-sm text-textSecondary leading-5">
              {detailGuidance}
            </Text>
          </View>
        </View>

        <View className="mb-4 rounded-2xl border border-divider bg-canvas px-lg py-md2">
          <Text className="text-sm font-semibold text-textPrimary mb-xs">
            What happens next
          </Text>
          <Text className="text-sm text-textSecondary leading-5">
            {nextStep}
          </Text>
        </View>

        <View className="mb-2 px-1">
          <Text className="text-xs font-bold text-textMuted uppercase tracking-wide">
            Progress
          </Text>
        </View>

        <View
          className="bg-surface rounded-2xl border border-divider mb-4 px-2"
          style={
            Platform.OS === "ios"
              ? metrics.shadows.level1.ios
              : metrics.shadows.level1.android
          }
        >
          <ProgressStepper
            status={report.status}
            isFinder={isFinder}
            hasMarkedDelivery={hasMarkedDelivery}
            viewerRole={viewerRole}
          />
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
        <SectionCard title="People involved">
          <PartyRow
            user={report.finder}
            role="Finder"
            isCurrentUser={isFinder}
          />
          <Separator />
          <PartyRow user={report.owner} role="Owner" isCurrentUser={isOwner} />
        </SectionCard>

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
      </ScrollView>

      {/* ── Action panel (fixed at bottom) ── */}
      {hasActionPanel && (
        <View
          className="absolute left-0 right-0 bottom-0 bg-surface"
          onLayout={handleActionPanelLayout}
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
            onReject={handleReject}
            isActivating={isActivating}
            isConfirming={isConfirming}
            isRejecting={isRejecting}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HandoverDetailScreen;
