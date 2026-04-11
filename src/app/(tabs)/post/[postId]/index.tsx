import { PostDetailScreen } from "@/src/features/post/screens";
import { AppInlineError } from "@/src/shared/components";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function Screen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  if (!postId) return <AppInlineError message="Something went wrong" />;

  return <PostDetailScreen postId={postId} />;
}
