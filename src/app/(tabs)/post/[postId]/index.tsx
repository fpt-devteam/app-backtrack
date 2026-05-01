import { PostDetailScreen } from "@/src/features/post/screens";
import { SHARED_ROUTE } from "@/src/shared/constants";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";

export default function Screen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  if (!postId) {
    router.push(SHARED_ROUTE.notAvailable);
    return null;
  }

  return <PostDetailScreen postId={postId} />;
}
