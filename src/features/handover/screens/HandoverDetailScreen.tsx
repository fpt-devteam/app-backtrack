import { useAppUser } from "@/src/features/auth/providers/user.provider";
import type { AppUser } from "@/src/features/auth/types";
import {
  createDirectConversationApi,
  getConversationByPartnerApi,
} from "@/src/features/chat/api";
import {
  getHandoverCounterpart,
  getHandoverDetailGuidance,
  getHandoverTitle,
  getHandoverViewerRole,
  HandoverStatusBadge,
  QnAAccordion,
} from "@/src/features/handover/components";
import {
  useActivateC2CReturnReport,
  useGetC2CReturnReportById,
  useOwnerCloseC2CReturnReport,
  useOwnerConfirmC2CReturnReport,
  useOwnerRejectC2CReturnReport,
} from "@/src/features/handover/hooks";
import type { Handover } from "@/src/features/handover/types";
import { PostCard } from "@/src/features/post/components";
import {
  AppBackButton,
  AppButton,
  AppImage,
  AppInlineError,
  AppLoader,
  AppTipCard,
  AppUserAvatar,
  TouchableIconButton,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { CHAT_ROUTE, HANDOVER_ROUTE } from "@/src/shared/constants";
import { colors, metrics, typography } from "@/src/shared/theme";
import { formatDateTime } from "@/src/shared/utils";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import {
  ChatCenteredTextIcon,
  CheckCircleIcon,
  InfoIcon,
  PhoneIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  LayoutChangeEvent,
  ScrollView,
  Text,
  TextStyle,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type StepState = "done" | "active" | "pending";

type ViewerRole = "Finder" | "Owner" | "Unknown";

type HandoverProgressStepKey =
  | "ongoing"
  | "delivered"
  | "confirmed"
  | "rejected"
  | "closed"
  | "expire";

type HandoverProgressPath =
  | "happy"
  | "rejected"
  | "closed"
  | "expiredAfterDelivery"
  | "expiredOngoing";

type StepDotDisplay = {
  key: HandoverProgressStepKey;
  label: string;
  content: string;
  state: StepState;
};

const HANDOVER_PROGRESS_STEP_LABELS: Record<
  ViewerRole,
  Record<HandoverProgressStepKey, string>
> = {
  Finder: {
    ongoing: "Ongoing",
    delivered: "You Deliver",
    confirmed: "Owner Confirms",
    rejected: "Rejected",
    closed: "Closed",
    expire: "Expires",
  },
  Owner: {
    ongoing: "Ongoing",
    delivered: "Finder Delivers",
    confirmed: "You Confirm",
    rejected: "Rejected",
    closed: "Closed",
    expire: "Expires",
  },
  Unknown: {
    ongoing: "Ongoing",
    delivered: "Delivered",
    confirmed: "Confirmed",
    rejected: "Rejected",
    closed: "Closed",
    expire: "Expires",
  },
};

const getHandoverProgressPath = (report: Handover): HandoverProgressPath => {
  const isExpired = Date.now() > new Date(report.expiresAt).getTime();

  if (report.status === "Closed") {
    return "closed";
  }

  if (report.status === "Rejected") {
    return "rejected";
  }

  if (report.status === "Delivered" && isExpired) {
    return "expiredAfterDelivery";
  }

  if (report.status === "Ongoing" && isExpired) {
    return "expiredOngoing";
  }

  return "happy";
};

const StepDot = ({ state }: { state: StepState }) => {
  if (state === "done") {
    return (
      <View
        className="w-xl aspect-square rounded-full border items-center justify-center"
        style={{
          backgroundColor: colors.babu[100],
          borderColor: colors.babu[500],
        }}
      >
        <CheckCircleIcon size={16} color={colors.babu[600]} weight="fill" />
      </View>
    );
  }

  if (state === "active") {
    return (
      <View
        className="w-xl aspect-square rounded-full border items-center justify-center"
        style={{
          backgroundColor: colors.primary,
          borderColor: colors.rausch[100],
        }}
      >
        <View className="w-sm h-sm rounded-full bg-white" />
      </View>
    );
  }
  return (
    <View
      className="w-xl aspect-square rounded-full border items-center justify-center"
      style={{
        backgroundColor: colors.hof[100],
        borderColor: colors.hof[300],
      }}
    >
      <View
        className="w-sm h-sm rounded-full"
        style={{ backgroundColor: colors.hof[300] }}
      />
    </View>
  );
};

type ProgressStepperProps = {
  stepDots: StepDotDisplay[];
};

const ProgressStepper = ({ stepDots }: ProgressStepperProps) => {
  return (
    <View className="flex-row items-start">
      {stepDots.map((step, i) => (
        <React.Fragment key={step.key}>
          <View className="items-center flex-1">
            <StepDot state={step.state} />

            <Text
              className="text-xs font-normal mt-1.5 text-center"
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
              className="text-xs font-thin mt-0.5 text-center"
              style={{ color: colors.hof[400] }}
            >
              {step.content}
            </Text>
          </View>

          {i < stepDots.length - 1 && (
            <View
              className="h-0.5 mt-4"
              style={{
                flex: 0.4,
                backgroundColor:
                  stepDots[i + 1].state === "pending"
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

const EmptyPostCard = ({ label }: { label: string }) => (
  <View
    className="flex-1 rounded-2xl border border-divider items-center justify-center bg-canvas"
    style={{ aspectRatio: 0.75 }}
  >
    <Text className="text-xs text-textMuted">{label}</Text>
    <Text className="text-xs text-textMuted mt-1">Not linked yet</Text>
  </View>
);

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
    <View className="flex-row items-center gap-md">
      {user && <AppUserAvatar avatarUrl={user.avatarUrl} size={36} />}

      <View className="flex-1 gap-xs">
        <View className="flex-row items-center gap-xs">
          <Text className="text-md font-normal">
            {user?.displayName ?? "Not assigned"}
          </Text>

          {isCurrentUser && (
            <Text className="text-xs font-thin text-textMuted">(You)</Text>
          )}
        </View>

        {user?.phone && (
          <View className="flex-row items-center gap-xs">
            <PhoneIcon size={12} color={colors.primary} />
            <Text className="text-xs font-thin text-textMuted">
              {user.phone}
            </Text>
          </View>
        )}
      </View>

      <View
        className="px-md2 py-xs rounded-full"
        style={{ backgroundColor: roleBg }}
      >
        <Text className="text-xs font-semibold" style={{ color: roleColor }}>
          {role}
        </Text>
      </View>
    </View>
  );
};

type ActionPanelProps = {
  report: Handover;
  isFinder: boolean;
  isOwner: boolean;
  onActivate: () => void;
  onConfirm: () => void;
  onReject: () => void;
  onClose: () => void;
  isActivating: boolean;
  isConfirming: boolean;
  isRejecting: boolean;
  isClosing: boolean;
};

const ACTION_PANEL_MIN_HEIGHT = 120;

const ActionPanel = ({
  report,
  isFinder,
  isOwner,
  onActivate,
  onConfirm,
  onReject,
  onClose,
  isActivating,
  isConfirming,
  isRejecting,
  isClosing,
}: ActionPanelProps) => {
  const { status } = report;

  const isCloseDisabled = isActivating || isConfirming || isRejecting;
  const isDeliveryDisabled = isConfirming || isRejecting || isClosing;
  const isConfirmingDisabled = isActivating || isRejecting || isClosing;
  const isRejectingDisabled = isActivating || isConfirming || isClosing;

  if (status === "Confirmed") {
    return (
      <View className="px-lg pt-md border-t border-divider bg-surface">
        <AppTipCard
          title="Handover Complete"
          description="The item has been successfully returned."
          type="success"
        />
      </View>
    );
  }

  if (status === "Closed" || status === "Rejected") {
    const label =
      status === "Closed"
        ? "This handover was closed due to a mismatch."
        : "This handover was rejected.";
    return (
      <View className="px-lg pt-md border-t border-divider bg-surface">
        <AppTipCard
          title={`Handover ${status === "Closed" ? "Closed" : "Rejected"}`}
          description={label}
          type="warning"
        />
      </View>
    );
  }

  if (status === "Ongoing" && isFinder) {
    return (
      <View className="px-lg pt-md border-t border-divider bg-surface">
        <View className="flex-row gap-md">
          {/* Close Handover Button */}
          <View className="flex-1">
            <AppButton
              title="Close Handover"
              onPress={onClose}
              loading={isClosing}
              disabled={isCloseDisabled}
              variant="outline"
            />
          </View>

          {/* Deliver Handover Button */}
          <View className="flex-1">
            <AppButton
              title="Mark Delivered"
              onPress={onActivate}
              loading={isActivating}
              disabled={isDeliveryDisabled}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    );
  }

  if (status === "Ongoing" && isOwner) {
    return (
      <View className="px-lg pt-md border-t border-divider bg-surface">
        <AppTipCard
          title="Waiting for delivery"
          description="The finder will mark this handover as delivered after the item is handed back."
          type="waiting"
        />
      </View>
    );
  }

  if (status === "Delivered" && isFinder) {
    return (
      <View className="px-lg pt-md border-t border-divider bg-surface">
        <AppTipCard
          title="Waiting for confirmation"
          description="You marked the item as delivered. The owner can confirm receipt to complete the handover."
          type="waiting"
        />
      </View>
    );
  }

  if (status === "Delivered" && isOwner) {
    return (
      <View className="px-lg pt-md border-t border-divider bg-surface gap-md2">
        <View className="flex-row gap-md">
          {/* Reject Handover Button */}
          <View className="flex-1">
            <AppButton
              title="Reject"
              onPress={onReject}
              loading={isRejecting}
              disabled={isRejectingDisabled}
              variant="outline"
            />
          </View>

          {/* Confirm Receipt Button */}
          <View className="flex-1">
            <AppButton
              title="I've Received"
              onPress={onConfirm}
              loading={isConfirming}
              disabled={isConfirmingDisabled}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    );
  }

  return null;
};

const HandoverDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const { handoverId } = useLocalSearchParams<{ handoverId: string }>();
  const { user: currentUser } = useAppUser();

  const {
    data: report,
    isLoading,
    error,
  } = useGetC2CReturnReportById(handoverId ?? "");

  const { isActivating } = useActivateC2CReturnReport();
  const { ownerConfirm, isConfirming } = useOwnerConfirmC2CReturnReport();
  const { ownerReject, isRejecting } = useOwnerRejectC2CReturnReport();
  const { ownerClose, isClosing } = useOwnerCloseC2CReturnReport();

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
    (): ViewerRole =>
      report ? getHandoverViewerRole(report, currentUser?.id) : "Unknown",
    [report, currentUser?.id],
  );

  const title = useMemo(
    () => (report ? getHandoverTitle(report) : "Handover"),
    [report],
  );

  const detailGuidance = useMemo(() => {
    if (!report) return "";
    return getHandoverDetailGuidance(report, currentUser?.id);
  }, [report, currentUser?.id]);

  const qnAs = useMemo(() => report?.finderPost?.qnAs ?? [], [report?.finderPost?.qnAs]);

  const stepDots = useMemo<StepDotDisplay[]>(() => {
    if (!report) return [];

    const labels = HANDOVER_PROGRESS_STEP_LABELS[viewerRole];
    const isExpired = Date.now() > new Date(report.expiresAt).getTime();
    const path = getHandoverProgressPath(report);
    const deliveredFallbackContent = report.activatedByRole
      ? `${report.activatedByRole} marked delivered`
      : "Item handed over";
    const deliveredContent = report.deliveredAt
      ? formatDateTime(report.deliveredAt)
      : deliveredFallbackContent;
    const confirmedLabel =
      report.status === "Confirmed" ? "Confirmed" : labels.confirmed;
    const confirmedState: StepState =
      report.status === "Confirmed"
        ? "done"
        : report.status === "Delivered"
          ? "active"
          : "pending";
    const shouldShowExpireStep = report.status !== "Confirmed";

    if (path === "rejected") {
      return [
        {
          key: "ongoing",
          label: labels.ongoing,
          content: formatDateTime(report.createdAt),
          state: "done",
        },
        {
          key: "delivered",
          label: labels.delivered,
          content: deliveredContent,
          state: "done",
        },
        {
          key: "rejected",
          label: labels.rejected,
          content: "Request was declined",
          state: "done",
        },
      ];
    }

    if (path === "closed") {
      return [
        {
          key: "ongoing",
          label: labels.ongoing,
          content: formatDateTime(report.createdAt),
          state: "done",
        },
        {
          key: "closed",
          label: labels.closed,
          content: "Items did not match",
          state: "done",
        },
      ];
    }

    if (path === "expiredAfterDelivery") {
      return [
        {
          key: "ongoing",
          label: labels.ongoing,
          content: formatDateTime(report.createdAt),
          state: "done",
        },
        {
          key: "delivered",
          label: labels.delivered,
          content: deliveredContent,
          state: "done",
        },
        {
          key: "expire",
          label: labels.expire,
          content: formatDateTime(report.expiresAt),
          state: "done",
        },
      ];
    }

    if (path === "expiredOngoing") {
      return [
        {
          key: "ongoing",
          label: labels.ongoing,
          content: formatDateTime(report.createdAt),
          state: "done",
        },
        {
          key: "expire",
          label: labels.expire,
          content: formatDateTime(report.expiresAt),
          state: "done",
        },
      ];
    }

    return [
      {
        key: "ongoing",
        label: labels.ongoing,
        content: formatDateTime(report.createdAt),
        state: report.status === "Ongoing" ? "active" : "done",
      },
      {
        key: "delivered",
        label: labels.delivered,
        content: deliveredContent,
        state: report.status === "Ongoing" ? "pending" : "done",
      },
      {
        key: "confirmed",
        label: confirmedLabel,
        content: report.confirmedAt
          ? formatDateTime(report.confirmedAt)
          : "Receipt acknowledged",
        state: confirmedState,
      },
      ...(shouldShowExpireStep
        ? [
            {
              key: "expire" as const,
              label: labels.expire,
              content: formatDateTime(report.expiresAt),
              state: (isExpired ? "done" : "pending") as StepState,
            } satisfies StepDotDisplay,
          ]
        : []),
    ];
  }, [report, viewerRole]);

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
        router.navigate(CHAT_ROUTE.message(conversationId));
      } else {
        toast.error(
          "Chat not found",
          "No conversation exists with this person yet.",
        );
      }
    } catch {
      toast.error("Error", "Could not open the chat. Please try again.");
    } finally {
      setIsOpeningChat(false);
    }
  }, [counterpartId]);

  const handleActivate = useCallback(() => {
    if (!report) return;

    Alert.alert(
      "Photo Proof Required",
      "To ensure a secure handover, please take a photo of the item being returned. This will be saved as proof of delivery.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take Photo",
          style: "default",
          onPress: async () => {
            router.push(HANDOVER_ROUTE.evidenceUpload(report.id));
          },
        },
      ],
    );
  }, [report]);

  const handleClose = useCallback(() => {
    if (!report) return;

    Alert.alert(
      "Confirm Close Handover",
      " Are you sure you want to close this handover? This action cannot be undone and should only be used if the item exchange cannot be completed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Close Handover",
          style: "default",
          onPress: async () => {
            try {
              await ownerClose(report.id);

              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );

              toast.success("Success", "Item closed securely.");
            } catch {
              toast.error(
                "Error",
                "Could not close handover. Please try again.",
              );
            }
          },
        },
      ],
    );
  }, [ownerClose, report]);

  const handleConfirm = useCallback(() => {
    if (!report) return;
    Alert.alert(
      "Item Received?",
      "By confirming, you agree that the item has been safely returned to you. This action will finalize the process and cannot be undone.",
      [
        { text: "Not Yet", style: "cancel" },
        {
          text: "I Got It",
          style: "default",
          onPress: async () => {
            try {
              await ownerConfirm(report.id);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            } catch {
              toast.error(
                "Confirmation Failed",
                "We couldn't finalize the handover. Please check your connection and try again.",
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
              toast.error(
                "Error",
                "Could not reject the handover. Please try again.",
              );
            }
          },
        },
      ],
    );
  }, [report, ownerReject]);

  const isInProgressHandover =
    report && (report.status === "Ongoing" || report.status === "Delivered");

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 bg-surface items-center justify-center">
          <AppLoader />
        </View>
      );
    }

    if (error || !report) {
      return (
        <View className="flex-1 bg-surface items-center justify-center">
          <AppInlineError message={error?.message ?? "Handover not found."} />
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: metrics.spacing.lg,
          paddingBottom: actionPanelHeight,
          gap: metrics.spacing.xl,
        }}
      >
        {/* Title and Status */}
        <View className="flex-1 gap-xs">
          <Text
            className="text-2xl font-normal text-textPrimary"
            numberOfLines={2}
          >
            {title}
          </Text>

          <View className="flex-row items-center gap-sm">
            <HandoverStatusBadge status={report.status} />
            <Text className="text-sm font-thin text-textSecondary">
              {counterpart?.displayName
                ? `With ${counterpart.displayName}`
                : "Counterpart"}
              {viewerRole === "Finder"
                ? " · Owner"
                : viewerRole === "Owner"
                  ? " · Finder"
                  : ""}
            </Text>
          </View>
        </View>

        {/* Next Step Tooltip */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 260, delay: 180 }}
        >
          <View
            className="flex-row items-start rounded-md border p-md2"
            style={{
              borderColor: colors.info[300],
              backgroundColor: colors.info[50],
            }}
          >
            <InfoIcon
              size={16}
              weight="fill"
              color={colors.info[600]}
              style={{ marginTop: 1, marginRight: 8 }}
            />
            <Text
              className="flex-1 text-xs leading-relaxed"
              style={{ color: colors.info[600] }}
            >
              {detailGuidance}
            </Text>
          </View>
        </MotiView>

        {/* Progress */}
        <View className="gap-md2">
          <Text className="text-lg font-normal text-textPrimary">Progress</Text>

          <ProgressStepper stepDots={stepDots} />
        </View>

        {/* Items involved  */}
        <View className="gap-md2">
          <Text className="text-lg font-normal text-textPrimary mb-sm">
            Items Involved
          </Text>

          <View className="flex-row gap-3">
            {report.finderPost ? (
              <PostCard item={report.finderPost} />
            ) : (
              <EmptyPostCard label="Finder's Post" />
            )}
            {report.ownerPost ? (
              <PostCard item={report.ownerPost} />
            ) : (
              <EmptyPostCard label="Owner's Post" />
            )}
          </View>
        </View>

        {/* Parties  */}
        <View className="gap-md2">
          <Text className="text-lg font-normal text-textPrimary mb-sm">
            People involved
          </Text>

          <View>
            <PartyRow
              user={report.finder}
              role="Finder"
              isCurrentUser={isFinder}
            />
            <View className="h-px bg-divider my-md" />
            <PartyRow
              user={report.owner}
              role="Owner"
              isCurrentUser={isOwner}
            />
          </View>
        </View>

        {/* Evidence Images */}
        {report.evidenceImageUrls && report.evidenceImageUrls.length > 0 && (
          <View className="gap-md2">
            <Text className="text-lg font-normal text-textPrimary mb-sm">
              Evidence Images
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: metrics.spacing.md,
              }}
            >
              {report.evidenceImageUrls.map((url, index) => (
                <AppImage
                  key={index}
                  source={{ uri: url }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: metrics.borderRadius.md,
                  }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* QnA Section */}
        {qnAs.length > 0 && (
          <View className="gap-md2">
            <Text className="text-lg font-normal text-textPrimary mb-sm">
              Questions & Answers
            </Text>

            <View className="gap-md2">
              {qnAs.map((qna) => (
                <QnAAccordion key={qna.id} qna={qna} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          headerTitle: "Handover Details",
          headerLeft: () => (
            <AppBackButton type="arrowLeftIcon" showBackground={false} />
          ),
          headerRight: () =>
            isInProgressHandover && (
              <TouchableIconButton
                icon={<ChatCenteredTextIcon size={24} />}
                onPress={handleOpenChat}
                disabled={!counterpartId || isOpeningChat}
                loading={isOpeningChat}
              />
            ),
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <View className="flex-1 bg-surface py-md">{renderContent()}</View>

      {report && (
        <View
          className="absolute left-0 right-0 bottom-0 bg-surface"
          onLayout={handleActionPanelLayout}
          style={{
            ...metrics.shadows.level2.ios,
            paddingBottom: insets.bottom,
          }}
        >
          <ActionPanel
            report={report}
            isFinder={isFinder}
            isOwner={isOwner}
            onActivate={handleActivate}
            onConfirm={handleConfirm}
            onReject={handleReject}
            onClose={handleClose}
            isClosing={isClosing}
            isActivating={isActivating}
            isConfirming={isConfirming}
            isRejecting={isRejecting}
          />
        </View>
      )}
    </View>
  );
};

export default HandoverDetailScreen;
