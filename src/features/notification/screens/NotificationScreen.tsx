import { NotificationRow } from "@/src/features/notification/components";
import {
  useNotifications,
  useUpdateNotificationStatus,
} from "@/src/features/notification/hooks";
import {
  NOTIFICATION_STATUS,
  type UserNotification,
} from "@/src/features/notification/types";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { SHARED_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { RelativePathString, router } from "expo-router";
import { BellSimpleSlashIcon } from "phosphor-react-native";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

const NotificationScreen = () => {
  const { items, isLoading, hasMore, loadMore, isLoadingNextPage } =
    useNotifications();
  const { updateStatus } = useUpdateNotificationStatus();

  const handlePress = async (notification: UserNotification) => {
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
    <NotificationRow notification={item} onPress={handlePress} />
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
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

export default NotificationScreen;
