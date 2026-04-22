import { SimilarPostCard } from "@/src/features/post/components";
import { useMatchingPost } from "@/src/features/post/hooks";
import { MatchingErrorScreen } from "@/src/features/post/screens/MatchingErrorScreen";
import { AppBackButton } from "@/src/shared/components";
import { AppSplashScreen } from "@/src/shared/components/AppSplashScreen";
import { POST_ROUTE } from "@/src/shared/constants/route.constant";
import { colors } from "@/src/shared/theme/colors";
import { typography } from "@/src/shared/theme/typography";
import { getErrorMessage } from "@/src/shared/utils";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TextStyle, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MatchingNoResultScreen } from "./MatchingNoResultScreen";

export const MatchingScreen = () => {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [applyingInterval, setApplyingInterval] = useState<boolean>(false);
  const { isMatching, similarPosts, error } = useMatchingPost(postId);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    setApplyingInterval(true);
    const interval = setInterval(() => {
      setApplyingInterval(false);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (applyingInterval || isMatching)
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTransparent: true,
          }}
        />
        <AppSplashScreen />
      </>
    );

  const handleCancel = () => {
    const parent = navigation.getParent();
    if (parent) {
      console.log("parent", parent?.getId());
      parent.getParent()?.goBack();
    } else {
      router.back();
    }
  };

  if (error)
    return <MatchingErrorScreen errorMessage={getErrorMessage(error)} />;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Matching Posts",
          headerShadowVisible: true,
          headerTransparent: false,
          headerBackVisible: false,
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
            color: colors.text.primary,
          },
          headerRight: () => (
            <AppBackButton type="xIcon" onPress={handleCancel} />
          ),
        }}
      />

      <View className="flex-1 bg-surface">
        {/* Results */}
        <FlatList
          data={similarPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SimilarPostCard
              matchPost={item}
              onPress={() => {
                router.push(POST_ROUTE.detailMatching(postId, item.id));
              }}
            />
          )}
          className="px-md"
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={<MatchingNoResultScreen />}
        />
      </View>
    </>
  );
};
