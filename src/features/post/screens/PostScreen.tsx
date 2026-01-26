import { PostHomeScreenHeader, PostList } from "@/src/features/post/components";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export const PostScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <PostHomeScreenHeader />
      <PostList />
    </SafeAreaView >
  );
};
