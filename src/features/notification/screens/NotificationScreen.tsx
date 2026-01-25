import { NotificationRow } from "@/src/features/notification/components/NotificationRow";
import {
  useNotifications,
  useUpdateNotificationStatus,
} from "@/src/features/notification/hooks";
import {
  NOTIFICATION_STATUS,
  type UserNotification,
} from "@/src/features/notification/types";
import {
  AppHeader,
  HeaderTitle,
} from "@/src/shared/components/app-utils/AppHeader";
import { RelativePathString, router } from "expo-router";
import {
  ArchiveIcon,
  EnvelopeSimpleIcon,
  EnvelopeSimpleOpenIcon,
  XIcon,
} from "phosphor-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationScreen = () => {
  const [mode, setMode] = useState<"normal" | "candidate">("normal");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { items, isLoading, refresh, hasMore, loadMore, isLoadingNextPage } =
    useNotifications();

  const { updateStatus, isUpdatingStatus } = useUpdateNotificationStatus();

  const handleLongPress = (notification: UserNotification) => {
    setMode("candidate");
    setSelectedIds(new Set([notification.id]));
  };

  const selectedIdList = Array.from(selectedIds);
  const selectedCount = selectedIdList.length;

  const firstSelected = React.useMemo(() => {
    if (selectedCount === 0) return null;
    const firstId = selectedIdList[0];
    return items.find((x) => x.id === firstId) ?? null;
  }, [items, selectedIdList, selectedCount]);

  const isFirstSelectedRead =
    firstSelected?.status === NOTIFICATION_STATUS.Read;
  const markNextValue = isFirstSelectedRead
    ? NOTIFICATION_STATUS.Unread
    : NOTIFICATION_STATUS.Read;

  const onExitCandidate = () => {
    setMode("normal");
    setSelectedIds(new Set());
  };

  const onBulkMark = async () => {
    if (selectedCount === 0) return;
    try {
      await updateStatus({
        notificationIds: selectedIdList,
        status: markNextValue,
      });
      onExitCandidate();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const onBulkArchive = async () => {
    if (selectedCount === 0) return;
    try {
      await updateStatus({
        notificationIds: selectedIdList,
        status: NOTIFICATION_STATUS.Archived,
      });
      onExitCandidate();
    } catch (error) {
      console.error("Failed to archive:", error);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNormalPress = (notification: UserNotification) => {
    const screenPath = notification.data?.screenPath as RelativePathString;
    if (!screenPath) return;

    console.log("Navigate to:", screenPath);
    router.push(screenPath);
  };

  const handleEndReached = () => {
    if (hasMore && !isLoadingNextPage) {
      loadMore();
    }
  };

  const renderItem = ({ item }: { item: UserNotification }) => (
    <NotificationRow
      mode={mode}
      notification={item}
      isSelected={selectedIds.has(item.id)}
      onLongPress={handleLongPress}
      onPress={handleNormalPress}
      onToggleSelect={handleToggleSelect}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-slate-500 text-base">No notifications</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0ea5e9" />
      </View>
    );
  };

  const renderSkeleton = () => (
    <View className="flex-1 bg-slate-50">
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className="flex-row items-start gap-3 px-4 py-3 bg-white border-b border-slate-100"
        >
          <View className="w-8 h-8 rounded-full bg-slate-200" />
          <View className="flex-1 gap-2">
            <View className="h-4 bg-slate-200 rounded w-3/4" />
            <View className="h-3 bg-slate-200 rounded w-full" />
          </View>
          <View className="h-3 bg-slate-200 rounded w-8" />
        </View>
      ))}
    </View>
  );

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        {renderSkeleton()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {mode === "normal" && (
        <AppHeader left={<HeaderTitle title="Notifications" />} />
      )}

      {mode === "candidate" && (
        <View className="bg-white border-b border-slate-200 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Pressable onPress={onExitCandidate} hitSlop={8}>
                <XIcon size={24} color="#0ea5e9" weight="bold" />
              </Pressable>
              <Text className="text-2xl font-bold text-slate-900">
                {selectedCount} selected
              </Text>
            </View>
            <View className="flex-row gap-4">
              <Pressable
                onPress={onBulkMark}
                disabled={selectedCount === 0 || isUpdatingStatus}
                hitSlop={8}
              >
                {isFirstSelectedRead ? (
                  <EnvelopeSimpleIcon
                    size={24}
                    color={
                      selectedCount === 0 || isUpdatingStatus
                        ? "#cbd5e1"
                        : "#0ea5e9"
                    }
                    weight="regular"
                  />
                ) : (
                  <EnvelopeSimpleOpenIcon
                    size={24}
                    color={
                      selectedCount === 0 || isUpdatingStatus
                        ? "#cbd5e1"
                        : "#0ea5e9"
                    }
                    weight="regular"
                  />
                )}
              </Pressable>
              <Pressable
                onPress={onBulkArchive}
                disabled={selectedCount === 0 || isUpdatingStatus}
                hitSlop={8}
              >
                <ArchiveIcon
                  size={24}
                  color={
                    selectedCount === 0 || isUpdatingStatus
                      ? "#cbd5e1"
                      : "#0ea5e9"
                  }
                  weight="regular"
                />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            tintColor="#0ea5e9"
          />
        }
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;
