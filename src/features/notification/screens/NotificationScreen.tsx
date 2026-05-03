import { useAuth } from "@/src/features/auth/providers";
import { NotificationRow } from "@/src/features/notification/components";
import {
  useNotifications,
  useUpdateNotificationStatus,
} from "@/src/features/notification/hooks";
import {
  NOTIFICATION_STATUS,
  type UserNotification,
} from "@/src/features/notification/types";
import { AppButton, AppLoader } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { RelativePathString, router } from "expo-router";
import { BellRingingIcon, BellSimpleSlashIcon } from "phosphor-react-native";
import React from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const GuestView = () => {
  const layout = useWindowDimensions();

  return (
    <View
      className="flex-1 bg-surface px-lg gap-lg"
      style={{ paddingTop: layout.height * 0.15 }}
    >
      <View className="flex-row justify-center">
        <BellRingingIcon size={128} color={colors.secondary} weight="thin" />
      </View>

      <View className="gap-y-2">
        <Text className="text-xl font-normal text-textPrimary text-center">
          Log in to view your notifications
        </Text>

        <Text className="text-base font-thin text-textSecondary text-center leading-6">
          Once you log in, you will find all your notifications here.
        </Text>
      </View>

      <AppButton
        onPress={() => router.push(AUTH_ROUTE.onboarding)}
        title="Login or Sign up"
        variant="secondary"
      />
    </View>
  );
};

const NotificationScreen = () => {
  const { isAppReady, isLoggedIn } = useAuth();
  const isAuthReady = isAppReady && isLoggedIn;

  const {
    items: fetchedItems,
    isLoading,
    hasMore,
    loadMore,
    isLoadingNextPage,
    isRefetching,
    refetch,
  } = useNotifications({ enabled: isAuthReady });

  const items: UserNotification[] = fetchedItems;

  const { updateStatus } = useUpdateNotificationStatus();

  if (!isAuthReady) return <GuestView />;

  const handlePress = async (notification: UserNotification) => {
    const screenPath = notification.data?.screenPath as RelativePathString;

    try {
      await updateStatus({
        notificationIds: [notification.id],
        status: NOTIFICATION_STATUS.Read,
        userId: notification.userId,
      });

      if (screenPath) {
        router.push(screenPath);
      } else {
        console.warn(`Invalid notification screen path: ${screenPath}`);
      }
    } catch (error) {
      console.error("Error when handling notification press: ", error);
    }
  };

  const handleEndReached = () => {
    if (hasMore && !isLoadingNextPage) loadMore();
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
        title="You don't have any notifications."
        subtitle="When you receive a new notification, it will appear here."
      />
    );
  };

  const renderFooter = () => {
    if (!isLoadingNextPage) return null;
    return <AppLoader />;
  };

  return (
    <View className="flex-1 bg-surface">
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingBottom: metrics.tabBar.height + metrics.spacing.lg,
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

export default NotificationScreen;
