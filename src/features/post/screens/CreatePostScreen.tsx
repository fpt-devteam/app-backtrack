import { PostForm } from "@/src/features/post/components";
import { PostType, type Post } from "@/src/features/post/types";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";

type Params = {
  mode?: string; // "create" | "edit"
  postType?: string; // "Lost" | "Found"
  initialData?: string; // JSON string
};

export const CreatePostScreen = () => {
  const { mode, postType, initialData } = useLocalSearchParams<Params>();

  const safeMode: "create" | "edit" = mode === "edit" ? "edit" : "create";
  const safePostType: PostType =
    postType === PostType.Found ? PostType.Found : PostType.Lost;

  const parsedData = useMemo<Post | null>(() => {
    if (!initialData) return null;
    try {
      return JSON.parse(initialData) as Post;
    } catch {
      return null;
    }
  }, [initialData]);

  return (
    <PostForm
      postType={safePostType}
      mode={safeMode}
      initialData={parsedData}
    />
  );
};