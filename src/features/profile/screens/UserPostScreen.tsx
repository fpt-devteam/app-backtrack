import { MyPostCard } from "@/src/features/post/components";
import { useGetAllMyPost } from "@/src/features/post/hooks";
import { AppBackButton, AppLoader } from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { colors, metrics, typography } from "@/src/shared/theme";
import { Stack } from "expo-router";
import { PackageIcon } from "phosphor-react-native";
import React from "react";
import { FlatList, Pressable, Text, TextStyle, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UserPostScreen = () => {
  const inset = useSafeAreaInsets();
  const { data: posts, isLoading, error, refetch } = useGetAllMyPost();

  const renderBody = () => {
    if (isLoading) {
      return (
        <View className="flex-1 bg-surface items-center justify-center">
          <AppLoader />
        </View>
      );
    }

    if (error) {
      return (
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
      );
    }

    return (
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-surface"
        contentContainerStyle={{
          paddingHorizontal: metrics.spacing.md,
          paddingVertical: metrics.spacing.md,
          paddingBottom: inset.bottom,
        }}
        ItemSeparatorComponent={() => (
          <View className="my-md border-b border-border" />
        )}
        renderItem={({ item }) => <MyPostCard item={item} />}
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
          headerTitle: "What You've Posted",
          headerLeft: () => <AppBackButton />,
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />
      {renderBody()}
    </>
  );
};

export default UserPostScreen;
