import { PostHomeScreenHeader } from '@/src/features/post/components';
import { metrics } from "@/src/shared/theme";
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const PostScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingBottom: metrics.tabBar.height + 2 * insets.bottom }}>
      <PostHomeScreenHeader />
      {/* <PostHomeScreen /> */}
    </View>
  );
}