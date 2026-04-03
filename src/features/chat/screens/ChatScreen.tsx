import { useAuth } from "@/src/features/auth/providers";
import {
  ConversationCard,
  ConversationCardSkeleton,
} from "@/src/features/chat/components/ConversationCard";
import { useConversations } from "@/src/features/chat/hooks";
import { AppInlineError } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import { ChatCenteredTextIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useRef } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export const ChatScreen = () => {
  const { isAppReady, isLoggedIn } = useAuth();
  const isAuthReady = isAppReady && isLoggedIn;
  const { height } = useWindowDimensions();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
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

  const refreshing = useMemo(() => {
    return isFetching && !isFetchingNextPage;
  }, [isFetching, isFetchingNextPage]);

  if (!isAuthReady) {
    return (
      <View
        className="flex-1 bg-surface px-10 gap-10 pt-20"
        style={{ paddingTop: height * 0.15 }}
      >
        <View className="flex-row justify-center">
          <ChatCenteredTextIcon size={128} color={colors.primary} />
        </View>

        <View className="gap-y-2">
          <Text className="text-xl font-normal text-textPrimary text-center">
            Log in to see messages
          </Text>

          <Text className="text-base font-thin text-textSecondary text-center leading-6">
            Once you log in, you will find all your conversations here.
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

  if (isLoading) {
    return (
      <View className="px-4 flex-1 pt-4">
        {Array.from({ length: 6 }, (_, i) => `skeleton-item-${i}`).map((id) => (
          <ConversationCardSkeleton key={id} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <AppInlineError message="Failed to load conversations. Please try again." />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.conversationId}
      renderItem={({ item }) => <ConversationCard conversation={item} />}
      contentContainerClassName="px-4"
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.35}
      // ItemSeparatorComponent={AppDivider}
      ListEmptyComponent={
        <EmptyList
          icon={<ChatCenteredTextIcon size={128} color={colors.primary} />}
          title="You don't have any conversations yet."
          subtitle="Once you receive messages, they will appear here."
          backButton={null}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => refetch()}
          tintColor={colors.primary}
        />
      }
    />
  );
};
