import { PostFoundForm, PostLostForm } from "@/src/features/post/components";
import { PostType, type Post } from "@/src/features/post/types";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Params = {
  mode?: string;        // "create" | "edit"
  postType?: string;  // "Lost" | "Found"
  initialData?: string; // JSON string
};

const CreatePostScreen = () => {
  const { mode, postType, initialData } = useLocalSearchParams<Params>();

  const safeMode: "create" | "edit" = mode === "edit" ? "edit" : "create";
  const safePostType: PostType = postType === PostType.Found ? PostType.Found : PostType.Lost;
  const insets = useSafeAreaInsets();

  const parsedData = useMemo<Post | null>(() => {
    if (!initialData) return null;
    try {
      return JSON.parse(initialData) as Post;
    } catch {
      return null;
    }
  }, [initialData]);

  return (
    <View style={{ paddingBottom: insets.bottom * 0.5, flex: 1 }}>
      {safePostType === PostType.Found ? (
        <PostFoundForm mode={safeMode} initialData={parsedData} />
      ) : (
        <PostLostForm mode={safeMode} initialData={parsedData} />
      )}
    </View>
  );
};

export default CreatePostScreen;
