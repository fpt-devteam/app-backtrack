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
import { AppHeader, AppLoader, HeaderTitle } from "@/src/shared/components";
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
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "unread" | "archived";

const NotificationScreen = () => {
  const [mode, setMode] = useState<"normal" | "candidate">("normal");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>("all");

  const filterRef = useRef<FilterType>("all");

  const handleChangeFilter = (newFilter: FilterType) => {
    setFilter(newFilter);
    filterRef.current = newFilter;
  };

  const getFilterStatus = (filterType: FilterType) => {
    if (filterType === "all") return undefined;
    if (filterType === "unread") return NOTIFICATION_STATUS.Unread;
    return NOTIFICATION_STATUS.Archived;
  };

  const filterStatus = getFilterStatus(filterRef.current);

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

  const handleLongPress = (notification: UserNotification) => {
    setMode("candidate");
    setSelectedIds(new Set([notification.id]));
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

      if (screenPath) {
        router.push(screenPath);
      } else {
        router.push(SHARED_ROUTE.notAvailable);
      }
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
    <SafeAreaView className="flex-1 bg-white pb-[56px]">
      {/* Screen Header  */}
      <>
        {mode === "candidate" ? (
          <View className="bg-white h-16 px-4 py-4">
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
        ) : (
          <AppHeader left={<HeaderTitle title="Notifications" />} />
        )}
      </>

      <View className="p-4 pt-0">
        <View className="flex-row gap-2">
          <NotificationChip
            label="All"
            isActive={filter === "all"}
            onPress={() => handleChangeFilter("all")}
            disabled={mode === "candidate"}
          />

          <NotificationChip
            label="Unread"
            isActive={filter === "unread"}
            onPress={() => handleChangeFilter("unread")}
            disabled={mode === "candidate"}
          />

          <NotificationChip
            label="Archived"
            isActive={filter === "archived"}
            onPress={() => handleChangeFilter("archived")}
            disabled={mode === "candidate"}
          />
        </View>
      </View>
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
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
