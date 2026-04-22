import { useGetPostById } from "@/src/features/post/hooks";
import { PostDetailScreen } from "@/src/features/post/screens";
import { AppInlineError } from "@/src/shared/components";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function Screen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { isLoading, data: post } = useGetPostById({ postId });
  if (!postId) return <AppInlineError message="Something went wrong" />;

  if (isLoading || !post) return <AppInlineError message="Loading..." />;
  return <PostDetailScreen post={post} />;
}
