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
} from "@/src/features/handover/components";
import {
  useActivateC2CReturnReport,
  useGetC2CReturnReportById,
  useOwnerCloseC2CReturnReport,
  useOwnerConfirmC2CReturnReport,
  useOwnerRejectC2CReturnReport,
} from "@/src/features/handover/hooks";
import type { Handover, HandoverStatus } from "@/src/features/handover/types";
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
import { formatDate } from "@/src/shared/utils";
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

type StepDef = {
  label: string;
  sublabel: string;
  state: StepState;
};

type StepDisplay = StepDef & {
  content: string;
};

type ProgressStepContent = {
  coordinate: string;
  deliver: string;
  confirm: string;
};

function deriveSteps(
  status: HandoverStatus,
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

function buildProgressStepContent(report: Handover): ProgressStepContent {
  const isInProgressStatus =
    report.status === "Ongoing" || report.status === "Delivered";

  const coordinate = isInProgressStatus
    ? `Expires ${formatDate(report.expiresAt)}`
    : formatDate(report.createdAt);

  const deliver = report.activatedByRole
    ? `${report.activatedByRole} marked delivered`
    : report.status === "Closed"
      ? "Items did not match"
      : report.status === "Rejected"
        ? "Request was declined"
        : "Item handed over";

  const confirm = report.confirmedAt
    ? formatDate(report.confirmedAt)
    : report.status === "Rejected"
      ? "Request was declined"
      : report.status === "Closed"
        ? "Items did not match"
        : "Receipt acknowledged";

  return {
    coordinate,
    deliver,
    confirm,
  };
}

const StepDot = ({ state }: { state: StepState }) => {
  if (state === "done") {
    return (
      <View
        className="w-8 aspect-square rounded-full border items-center justify-center"
        style={{ backgroundColor: colors.babu[400] }}
      >
        <CheckCircleIcon size={18} color={colors.white} weight="fill" />
      </View>
    );
  }

  if (state === "active") {
    return (
      <View
        className="w-8 aspect-square rounded-full border items-center justify-center"
        style={{
          backgroundColor: colors.primary,
          borderColor: colors.rausch[100],
        }}
      >
        <View className="w-2.5 h-2.5 rounded-full bg-white" />
      </View>
    );
  }
  return (
    <View
      className="w-8 aspect-square rounded-full border items-center justify-center"
      style={{
        backgroundColor: colors.hof[100],
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
  stepContent,
}: {
  status: HandoverStatus;
  isFinder: boolean;
  hasMarkedDelivery: boolean;
  viewerRole: "Finder" | "Owner" | "Unknown";
  stepContent: {
    coordinate: string;
    deliver: string;
    confirm: string;
  };
}) => {
  const steps = deriveSteps(status, isFinder, hasMarkedDelivery);

  const stepsWithViewerCopy = useMemo<StepDisplay[]>(() => {
    const normalizedSteps =
      viewerRole !== "Unknown"
        ? steps
        : steps.map((step) => {
            if (step.label === "You Deliver") {
              return { ...step, label: "Finder Delivers" };
            }

            if (step.label === "You Confirm") {
              return { ...step, label: "Owner Confirms" };
            }

            return step;
          });

    return normalizedSteps.map((step, index) => ({
      ...step,
      content:
        index === 0
          ? stepContent.coordinate
          : index === 1
            ? stepContent.deliver
            : stepContent.confirm,
    }));
  }, [stepContent.confirm, stepContent.coordinate, stepContent.deliver, steps, viewerRole]);

  return (
    <View className="flex-row items-start justify-between">
      {stepsWithViewerCopy.map((step, i) => (
        <React.Fragment key={step.label}>
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
    () => (report ? getHandoverViewerRole(report, currentUser?.id) : "Unknown"),
    [report, currentUser?.id],
  );

  const title = useMemo(
    () => (report ? getHandoverTitle(report) : "Handover"),
    [report],
  );

  const hasMarkedDelivery = !!report?.activatedByRole;

  const detailGuidance = useMemo(() => {
    if (!report) return "";
    return getHandoverDetailGuidance(report, currentUser?.id);
  }, [report, currentUser?.id]);

  const progressStepContent = useMemo(() => {
    if (!report) {
      return {
        coordinate: "Chat & agree on meetup",
        deliver: "Item handed over",
        confirm: "Receipt acknowledged",
      };
    }
    return buildProgressStepContent(report);
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

          <ProgressStepper
            status={report.status}
            isFinder={isFinder}
            hasMarkedDelivery={hasMarkedDelivery}
            viewerRole={viewerRole}
            stepContent={progressStepContent}
          />
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
