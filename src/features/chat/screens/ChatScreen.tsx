import { useAuth } from "@/src/features/auth/providers";
import { ConversationCard } from "@/src/features/chat/components";
import { useConversations } from "@/src/features/chat/hooks";
import { AppButton, AppLoader } from "@/src/shared/components";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { metrics } from "@/src/shared/theme";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import { ChatCenteredTextIcon, WarningCircleIcon } from "phosphor-react-native";
import React, { useCallback, useRef } from "react";
import { FlatList, Text, useWindowDimensions, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

const GuestView = () => {
  const layout = useWindowDimensions();

  return (
    <View
      className="flex-1 bg-surface px-lg gap-lg"
      style={{ paddingTop: layout.height * 0.15 }}
    >
      <View className="flex-row justify-center">
        <ChatCenteredTextIcon
          size={128}
          color={colors.secondary}
          weight="thin"
        />
      </View>

      <View className="gap-y-2">
        <Text className="text-xl font-normal text-textPrimary text-center">
          Log in to view your conversations
        </Text>

        <Text className="text-base font-thin text-textSecondary text-center leading-6">
          Once you log in, you will find all your conversations here.
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

export const ChatScreen = () => {
  const { isAppReady, isLoggedIn } = useAuth();
  const isAuthReady = isAppReady && isLoggedIn;

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useConversations({ enabled: isAuthReady });

  const endReachedLockRef = useRef(false);

  const onLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || endReachedLockRef.current) {
      return;
    }

    endReachedLockRef.current = true;

    fetchNextPage()
      .catch(() => {
        console.log("Error fetching more conversations");
      })
      .finally(() => {
        endReachedLockRef.current = false;
      });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, []);

  const renderBody = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <AppLoader />
        </View>
      );
    }

    if (!isAuthReady) return <GuestView />;

    if (isError) {
      return (
        <View
          className="flex-1 px-md"
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: metrics.spacing.md,
            marginBottom: metrics.tabBar.height,
          }}
        >
          <View className="bg-red-50 p-md rounded-full">
            <WarningCircleIcon
              size={200}
              weight="duotone"
              color={colors.status.error}
            />
          </View>

          <View className="gap-y-xs">
            <Text className="text-xl font-semibold text-textPrimary text-center">
              Oops! Something went wrong
            </Text>
            <Text className="text-base font-light text-textSecondary text-center leading-6">
              We're having trouble loading your conversations. Please check your
              connection and try again.
            </Text>
          </View>

          <View className="w-full">
            <AppButton
              title="Try Again"
              onPress={handleRefetch}
              variant="secondary"
            />
          </View>
        </View>
      );
    }

    return (
      <View className="flex-1">
        <FlatList
          data={data}
          keyExtractor={(item) => item.conversationId}
          renderItem={({ item }) => <ConversationCard conversation={item} />}
          contentContainerClassName="px-md pt-md"
          contentContainerStyle={{
            paddingBottom: metrics.tabBar.height + metrics.spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.35}
          className="flex-1"
          ItemSeparatorComponent={() => <View className="h-lg" />}
          ListEmptyComponent={
            <View
              className="flex-1"
              style={{
                justifyContent: "center",
                gap: metrics.spacing.md,
              }}
            >
              <View className="flex-row justify-center">
                <ChatCenteredTextIcon
                  size={200}
                  weight="thin"
                  color={colors.primary}
                />
              </View>

              <View className="gap-y-xs">
                <Text className="text-xl font-normal text-textPrimary text-center">
                  You don't have any conversations yet.
                </Text>

                <Text className="text-base font-thin text-textSecondary text-center leading-6">
                  Once you receive messages, they will appear here.
                </Text>
              </View>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefetch}
              tintColor={colors.primary}
            />
          }
        />
      </View>
    );
  };

  return <View className="flex-1">{renderBody()}</View>;
};
