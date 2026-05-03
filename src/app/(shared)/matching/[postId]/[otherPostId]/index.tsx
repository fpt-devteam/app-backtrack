import { ComparePostsScreen } from "@/src/features/post/screens";
import { AppBackButton, AppInlineError } from "@/src/shared/components";
import { typography } from "@/src/shared/theme/typography";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { TextStyle } from "react-native";

const DetailCompareRoute = () => {
  const { postId, otherPostId } = useLocalSearchParams<{
    postId: string;
    otherPostId: string;
  }>();

  const handleBack = () => {
    router.back();
  };

  if (!postId || !otherPostId) {
    return <AppInlineError message="Invalid comparison parameters" />;
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Compare Posts",
          headerBackVisible: false,
          headerLeft: () => (
            <AppBackButton showBackground={false} onPress={handleBack} />
          ),
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />
      <ComparePostsScreen postId={postId} otherPostId={otherPostId} />
    </>
  );
};

export default DetailCompareRoute;
