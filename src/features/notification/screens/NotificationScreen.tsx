import { useAuth } from "@/src/features/auth/providers";
import { NotificationRow } from "@/src/features/notification/components";
import {
  useNotifications,
  useUpdateNotificationStatus,
} from "@/src/features/notification/hooks";
import {
  IS_NOTIFICATIONS_MOCK,
  MOCK_NOTIFICATIONS,
} from "@/src/features/notification/screens/mock";
import {
  NOTIFICATION_STATUS,
  type UserNotification,
} from "@/src/features/notification/types";
import { AppLoader } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { AUTH_ROUTE, SHARED_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { RelativePathString, router } from "expo-router";
import { BellRingingIcon, BellSimpleSlashIcon } from "phosphor-react-native";
import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const NotificationScreen = () => {
  const { isAppReady, isLoggedIn } = useAuth();
  const isAuthReady = isAppReady && isLoggedIn;
  const { height } = useWindowDimensions();

  const {
    items: fetchedItems,
    isLoading,
    hasMore,
    loadMore,
    isLoadingNextPage,
  } = useNotifications({ enabled: isAuthReady });

  const items: UserNotification[] = IS_NOTIFICATIONS_MOCK
    ? MOCK_NOTIFICATIONS
    : fetchedItems;

  const { updateStatus } = useUpdateNotificationStatus();

  if (!isAuthReady) {
    return (
      <View
        className="flex-1 bg-surface px-10 gap-10 pt-20"
        style={{ paddingTop: height * 0.15 }}
      >
        <View className="flex-row justify-center">
          <BellRingingIcon size={128} color={colors.primary} />
        </View>

        <View className="gap-y-2">
          <Text className="text-xl font-normal text-textPrimary text-center">
            Log in to see notifications
          </Text>

          <Text className="text-base font-thin text-textSecondary text-center leading-6">
            Once you log in, you will find all your notifications here.
          </Text>
        </View>

        <TouchableOpacity
          className="w-full py-5 rounded-sm bg-primary items-center justify-center"
          onPress={() => router.push(AUTH_ROUTE.onboarding)}
          activeOpacity={0.8}
        >
          <Text className="text-base font-normal text-white text-center">
            Log in or Sign up
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        backButton={null}
      />
    );
  };

  const renderFooter = () => {
    if (!isLoadingNextPage) return null;
    return <AppLoader />;
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
