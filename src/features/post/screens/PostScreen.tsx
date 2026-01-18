import { PostHomeScreenHeader } from "@/src/features/post/components";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PostHomeScreen } from "./PostHomeScreen";

export const PostScreen = () => {
  return (
    <SafeAreaView>
      <PostHomeScreenHeader />
      <PostHomeScreen />
    </SafeAreaView>
  );
};
