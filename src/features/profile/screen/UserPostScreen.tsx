import { IS_POST_MOCK, POST_MOCK } from "@/src/features/post/constants/post.mock";
import { useGetAllMyPost } from "@/src/features/post/hooks";
import type { Post } from "@/src/features/post/types";
import { PostStatusBadge } from "@/src/features/post/components";
import { AppImage, AppLoader, AppBackButton } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import { PackageIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const GRID_COLUMNS = 3;
const GRID_GAP = 2;
const GRID_PADDING = 8;

const GridSeparator = () => <View style={{ height: GRID_GAP }} />;

const PostGridItem = ({ post, size }: { post: Post; size: number }) => {
  const imageUrl = post.imageUrls?.[0];

  const handleOpenPost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(POST_ROUTE.details(post.id));
  };

  return (
    <TouchableOpacity
      onPress={handleOpenPost}
      style={{ width: size, height: size }}
      className="aspect-square"
    >
      <AppImage
        source={{ uri: imageUrl }}
        style={{ width: size, height: size }}
        resizeMode="cover"
      />

      <View className="absolute top-0 right-0 p-1">
        <PostStatusBadge status={post.postType} size="sm" />
      </View>
    </TouchableOpacity>
  );
};

const UserPostScreen = () => {
  const { width } = useWindowDimensions();
  const { data, isLoading, error, refetch } = useGetAllMyPost();

  const itemSize = useMemo(() => {
    const totalGap = GRID_GAP * (GRID_COLUMNS - 1);
    const totalPadding = GRID_PADDING * 2;
    return Math.floor((width - totalPadding - totalGap) / GRID_COLUMNS);
  }, [width]);

  // Use mock data as fallback when API returns empty and mocks are enabled
  const posts = useMemo(() => {
    const apiPosts = data || [];
    if (apiPosts.length > 0) return apiPosts;
    return IS_POST_MOCK ? POST_MOCK : apiPosts;
  }, [data]);

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Your posts",
            headerLeft: () => <AppBackButton />,
          }}
        />
        <View className="flex-1 bg-surface items-center justify-center">
          <AppLoader />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Your posts",
            headerLeft: () => <AppBackButton />,
          }}
        />
        <View className="flex-1 bg-surface items-center justify-center px-lg">
          <Text className="text-textSecondary text-center">
            Unable to load posts
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-md px-lg py-sm bg-secondary rounded-full"
          >
            <Text className="text-white font-semibold">Try again</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Your posts",
          headerLeft: () => <AppBackButton />,
        }}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={GRID_COLUMNS}
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-surface"
        contentContainerStyle={{
          paddingHorizontal: GRID_PADDING,
          paddingVertical: GRID_PADDING,
        }}
        columnWrapperStyle={{ gap: GRID_GAP }}
        ItemSeparatorComponent={GridSeparator}
        renderItem={({ item }) => (
          <PostGridItem post={item} size={itemSize} />
        )}
        ListEmptyComponent={
          <EmptyList
            icon={
              <PackageIcon size={96} weight="light" color={colors.primary} />
            }
            title="No Posts Yet"
            subtitle="Your posts will appear here once you create them."
          />
        }
      />
    </>
  );
};

export default UserPostScreen;
