import { PostHomeScreenHeader } from '@/src/features/post/components';
import React from 'react';
import { View } from 'react-native';
import { PostHomeScreen } from './PostHomeScreen';

export const PostScreen = () => {
  return (
    <View >
      <PostHomeScreenHeader />
      <PostHomeScreen />
    </View>
  );
}