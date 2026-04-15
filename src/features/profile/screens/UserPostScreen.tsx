import { PostStatusBadge } from "@/src/features/post/components";
import { useGetAllMyPost } from "@/src/features/post/hooks";
import type { Post } from "@/src/features/post/types";
import { AppBackButton, AppImage, AppLoader } from "@/src/shared/components";
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
  useWindowDimensions,
  View,
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
  const { data: posts, isLoading, error, refetch } = useGetAllMyPost();

  const itemSize = useMemo(() => {
    const totalGap = GRID_GAP * (GRID_COLUMNS - 1);
    const totalPadding = GRID_PADDING * 2;
    return Math.floor((width - totalPadding - totalGap) / GRID_COLUMNS);
  }, [width]);

  const renderBody = () => {
    if (isLoading) {
      return (
        <>
          <View className="flex-1 bg-surface items-center justify-center">
            <AppLoader />
          </View>
        </>
      );
    }

    if (error) {
      return (
        <>
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
        renderItem={({ item }) => <PostGridItem post={item} size={itemSize} />}
        ListEmptyComponent={
          <EmptyList
            icon={
              <PackageIcon size={128} weight="light" color={colors.secondary} />
            }
            title="No Posts Yet"
            subtitle="Your posts will appear here once you create them."
          />
        }
      />
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Your posts",
          headerLeft: () => <AppBackButton />,
        }}
      />
      {renderBody()}
    </>
  );
};

export default UserPostScreen;
