import { SimilarPostCard } from "@/src/features/post/components";
import { useGetPostById, useMatchingPost } from "@/src/features/post/hooks";
import { MatchingErrorScreen } from "@/src/features/post/screens/MatchingErrorScreen";
import {
  AppHeader,
  BackButton,
  HeaderTitle,
} from "@/src/shared/components/AppHeader";
import { AppSplashScreen } from "@/src/shared/components/AppSplashScreen";
import { getErrorMessage } from "@/src/shared/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const MatchingScreen = () => {
  const insets = useSafeAreaInsets();
  const [applyingInterval, setApplyingInterval] = useState<boolean>(false);
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const { isMatching, similarPosts, error } = useMatchingPost(postId);
  const { data: yourItem } = useGetPostById({ postId });

  useEffect(() => {
    setApplyingInterval(true);
    const interval = setInterval(() => {
      setApplyingInterval(false);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (applyingInterval || !yourItem || isMatching) {
    console.log("Matching Waiting Screen");
    return <AppSplashScreen />;
  }

  if (error) {
    console.log("Matching Error Screen");
    return <MatchingErrorScreen errorMessage={getErrorMessage(error)} />;
  }

  // if (similarPosts.length === 0) {
  //   console.log("Matching No Result Screen");
  //   return <MatchingNoResultScreen />;
  // }

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-surface"
    >
      <AppHeader
        left={<BackButton />}
        center={<HeaderTitle title="Matching result" />}
      />

      {/* Results */}
      <FlatList
        data={similarPosts}
        renderItem={({ item }) => (
          <SimilarPostCard matchPost={item} postId={postId} />
        )}
        keyExtractor={(item) => item.id}
        className="p-3"
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};
