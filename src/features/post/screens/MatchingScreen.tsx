import { SimilarPostCard } from '@/src/features/post/components';
import { useGetPostById, useMatchingPost } from '@/src/features/post/hooks';
import { MatchingErrorScreen } from '@/src/features/post/screens/MatchingErrorScreen';
import { MatchingNoResultScreen } from '@/src/features/post/screens/MatchingNoResultScreen';
import { MatchingWaitingScreen } from '@/src/features/post/screens/MatchingWaitingScreen';
import { AppHeader, BackButton, HeaderTitle } from '@/src/shared/components/app-utils/AppHeader';
import { getErrorMessage } from '@/src/shared/utils';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

export const MatchingScreen = () => {
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

  if (applyingInterval || isMatching || !yourItem) return <MatchingWaitingScreen />;

  if (error) return <MatchingErrorScreen errorMessage={getErrorMessage(error)} />;

  if (similarPosts.length === 0) return <MatchingNoResultScreen />;

  return (
    <View>
      <AppHeader left={<BackButton />} center={<HeaderTitle title="Matching result" />} />

      {/* Results */}
      <FlatList
        data={similarPosts}
        renderItem={({ item }) => <SimilarPostCard matchPost={item} postId={postId} />}
        keyExtractor={(item) => item.id}
        className='p-3'
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}