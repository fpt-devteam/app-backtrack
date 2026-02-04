import {
  NotificationChip,
  NotificationRow,
} from "@/src/features/notification/components";
import {
  useNotifications,
  useUpdateNotificationStatus,
} from "@/src/features/notification/hooks";
import {
  NOTIFICATION_STATUS,
  type UserNotification,
} from "@/src/features/notification/types";
import { AppLoader } from "@/src/shared/components";
import {
  AppHeader,
  HeaderTitle,
} from "@/src/shared/components/app-utils/AppHeader";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { SHARED_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { RelativePathString, router } from "expo-router";
import {
  ArchiveIcon,
  BellSimpleSlashIcon,
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
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "unread" | "archived";

const NotificationScreen = () => {
  const [mode, setMode] = useState<"normal" | "candidate">("normal");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>("all");

  const getFilterStatus = (filterType: FilterType) => {
    if (filterType === "all") return undefined;
    if (filterType === "unread") return NOTIFICATION_STATUS.Unread;
    return NOTIFICATION_STATUS.Archived;
  };

  const filterStatus = getFilterStatus(filter);

  const {
    items,
    isLoading,
    refresh,
    hasMore,
    loadMore,
    isLoadingNextPage,
    isRefreshing,
  } = useNotifications({ status: filterStatus });

  const allItems = items;

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
    return allItems.find((x) => x.id === firstId) ?? null;
  }, [allItems, selectedIdList, selectedCount]);

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

  const handleNormalPress = async (notification: UserNotification) => {
    try {
      await updateStatus({
        notificationIds: [notification.id],
        status: NOTIFICATION_STATUS.Read,
      });

      const screenPath = notification.data?.screenPath as RelativePathString;
      router.push(screenPath);
    } catch (error) {
      console.log("Error when update notification status: ", error);
      router.push(SHARED_ROUTE.notAvailable);
      return;
    }
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
      <EmptyList
        icon={
          <BellSimpleSlashIcon
            size={96}
            weight="light"
            color={colors.primary}
          />
        }
        title="You don't have any notifications yet."
        subtitle="Once you receive notifications, they will appear here."
        backButton={null}
      />
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {mode === "normal" && (
        <>
          <AppHeader left={<HeaderTitle title="Notifications" />} />
          <View className="px-4 py-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2"
            >
              <NotificationChip
                label="All"
                isActive={filter === "all"}
                onPress={() => setFilter("all")}
              />
              <NotificationChip
                label="Unread"
                isActive={filter === "unread"}
                onPress={() => setFilter("unread")}
              />
              <NotificationChip
                label="Archived"
                isActive={filter === "archived"}
                onPress={() => setFilter("archived")}
              />
            </ScrollView>
          </View>
        </>
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

      {isLoading && allItems.length === 0 ? (
        <AppLoader />
      ) : (
        <FlatList
          data={allItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor="#0ea5e9"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
