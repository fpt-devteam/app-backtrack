import { PostDetailScreen } from "@/src/features/post/screens";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function Screen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  if (!postId) return null;
  return <PostDetailScreen postId={postId} />;
}
