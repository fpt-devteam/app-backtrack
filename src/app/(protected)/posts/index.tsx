import { PostHomeScreen, PostHomeScreenHeader } from '@/src/features/post/components';
import React from 'react';
import { View } from 'react-native';

const HomeScreen = () => {
  return (
    <View>
      <PostHomeScreenHeader />
      <PostHomeScreen />
    </View>
  );
};

export default HomeScreen;
