import {
  ActionButton,
  FilterChip,
  ItemSeparator,
  NotificationRow,
} from "@/src/features/notification/components";
import { notificationKeys } from "@/src/features/notification/constants";
import {
  useInfiniteNotifications,
  useUpdateNotificationArchiveStatus,
  useUpdateNotificationReadStatus,
} from "@/src/features/notification/hooks";
import type { NotificationItem } from "@/src/features/notification/types";
import { AppEndOfFeed, AppHeader } from "@/src/shared/components";
import { BottomSheet } from "@/src/shared/components/ui/BottomSheet";
import { colors } from "@/src/shared/theme";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import {
  ArchiveIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  XIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

type FilterType = "all" | "unread" | "archived";

type ActionSheetState = {
  visible: boolean;
  notification: NotificationItem | null;
};

export default function NotificationScreen() {
  const queryClient = useQueryClient();
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [actionSheet, setActionSheet] = useState<ActionSheetState>({
    visible: false,
    notification: null,
  });
  const flatListRef = useRef<FlatList>(null);

  // Build filter params based on current filter
  const filterParams = useMemo(() => {
    switch (currentFilter) {
      case "unread":
        return { isRead: false, isArchived: false };
      case "archived":
        return { isArchived: true };
      case "all":
      default:
        return { isArchived: false };
    }
  }, [currentFilter]);

  const { items, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteNotifications({
      filters: filterParams,
      limit: 20,
    });

  const { mutate: updateReadStatus } = useUpdateNotificationReadStatus();
  const { mutate: updateArchiveStatus } = useUpdateNotificationArchiveStatus();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFilterChange = useCallback((filter: FilterType) => {
    setCurrentFilter(filter);
    // Scroll to top when filter changes
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [queryClient]);

  const handleNotificationPress = useCallback(
    (notification: NotificationItem) => {
      // Mark as read if unread
      if (notification.isRead) {
        Haptics.selectionAsync();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        updateReadStatus(
          {
            notificationIds: [notification._id],
            isRead: true,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: notificationKeys.lists(),
              });
            },
          },
        );
      }
    },
    [updateReadStatus, queryClient],
  );

  const handleNotificationLongPress = useCallback(
    (notification: NotificationItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setActionSheet({ visible: true, notification });
    },
    [],
  );

  const closeActionSheet = useCallback(() => {
    setActionSheet({ visible: false, notification: null });
  }, []);

  const handleMarkAsRead = useCallback(() => {
    if (!actionSheet.notification) return;
    updateReadStatus(
      {
        notificationIds: [actionSheet.notification._id],
        isRead: true,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
          closeActionSheet();
        },
      },
    );
  }, [
    actionSheet.notification,
    updateReadStatus,
    queryClient,
    closeActionSheet,
  ]);

  const handleMarkAsUnread = useCallback(() => {
    if (!actionSheet.notification) return;
    updateReadStatus(
      {
        notificationIds: [actionSheet.notification._id],
        isRead: false,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
          closeActionSheet();
        },
      },
    );
  }, [
    actionSheet.notification,
    updateReadStatus,
    queryClient,
    closeActionSheet,
  ]);

  const handleArchive = useCallback(() => {
    if (!actionSheet.notification) return;
    updateArchiveStatus(
      {
        notificationIds: [actionSheet.notification._id],
        isArchived: true,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
          closeActionSheet();
        },
      },
    );
  }, [
    actionSheet.notification,
    updateArchiveStatus,
    queryClient,
    closeActionSheet,
  ]);

  const handleRestore = useCallback(() => {
    if (!actionSheet.notification) return;
    updateArchiveStatus(
      {
        notificationIds: [actionSheet.notification._id],
        isArchived: false,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
          closeActionSheet();
        },
      },
    );
  }, [
    actionSheet.notification,
    updateArchiveStatus,
    queryClient,
    closeActionSheet,
  ]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <NotificationRow
        notification={item}
        onPress={handleNotificationPress}
        onLongPress={handleNotificationLongPress}
      />
    ),
    [handleNotificationPress, handleNotificationLongPress],
  );

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    if (!hasNextPage && items.length > 0) {
      return <AppEndOfFeed hint="No more notifications" />;
    }
    return null;
  }, [isFetchingNextPage, hasNextPage, items.length]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    const emptyMessages = {
      all: "No notifications yet",
      unread: "No unread notifications",
      archived: "No archived notifications",
    };

    return (
      <View className="flex-1 items-center justify-center py-20 px-6">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: colors.slate[100] }}
        >
          <CircleDashedIcon
            size={32}
            color={colors.slate[400]}
            weight="regular"
          />
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-1">
          {emptyMessages[currentFilter]}
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          {currentFilter === "all"
            ? "You're all caught up!"
            : "Nothing to show here"}
        </Text>
      </View>
    );
  }, [isLoading, currentFilter]);

  return (
    <View className="flex-1 bg-white">
      <AppHeader title="Notifications" showBackButton={false} />

      {/* Filter Row */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row gap-2">
          <FilterChip
            label="All"
            isSelected={currentFilter === "all"}
            onPress={() => handleFilterChange("all")}
          />
          <FilterChip
            label="Unread"
            isSelected={currentFilter === "unread"}
            onPress={() => handleFilterChange("unread")}
          />
          <FilterChip
            label="Archived"
            isSelected={currentFilter === "archived"}
            onPress={() => handleFilterChange("archived")}
          />
        </View>
      </View>

      {/* Notification List */}
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={items.length === 0 ? { flex: 1 } : undefined}
      />

      {/* Action Sheet */}
      <BottomSheet
        isVisible={actionSheet.visible}
        onClose={closeActionSheet}
        enableDynamicSizing
      >
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </Text>

          <View className="gap-2">
            {actionSheet.notification && (
              <>
                {actionSheet.notification.isRead ? (
                  <ActionButton
                    label="Mark as Unread"
                    icon={CircleDashedIcon}
                    onPress={handleMarkAsUnread}
                  />
                ) : (
                  <ActionButton
                    label="Mark as Read"
                    icon={CheckCircleIcon}
                    onPress={handleMarkAsRead}
                  />
                )}

                {actionSheet.notification.isArchived ? (
                  <ActionButton
                    label="Restore"
                    icon={ArchiveIcon}
                    onPress={handleRestore}
                  />
                ) : (
                  <ActionButton
                    label="Archive"
                    icon={ArchiveIcon}
                    onPress={handleArchive}
                  />
                )}
              </>
            )}

            <ActionButton
              label="Cancel"
              icon={XIcon}
              onPress={closeActionSheet}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
