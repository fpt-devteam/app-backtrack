import { PostFoundForm, PostLostForm } from "@/src/features/post/components";
import { PostType, type Post } from "@/src/features/post/types";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type Params = {
  mode?: string;        // "create" | "edit"
  postType?: string;  // "Lost" | "Found"
  initialData?: string; // JSON string
};

const CreatePostScreen = () => {
  const { mode, postType, initialData } = useLocalSearchParams<Params>();

  const safeMode: "create" | "edit" = mode === "edit" ? "edit" : "create";
  const safePostType: PostType = postType === PostType.Found ? PostType.Found : PostType.Lost;

  const parsedData = useMemo<Post | null>(() => {
    if (!initialData) return null;
    try {
      return JSON.parse(initialData) as Post;
    } catch {
      return null;
    }
  }, [initialData]);

  return (
    <View style={styles.container}>
      {safePostType === PostType.Found ? (
        <PostFoundForm mode={safeMode} initialData={parsedData} />
      ) : (
        <PostLostForm mode={safeMode} initialData={parsedData} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default CreatePostScreen;
