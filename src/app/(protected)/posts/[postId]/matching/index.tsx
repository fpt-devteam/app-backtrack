import { SimilarPostCard } from '@/src/features/post/components/cards';
import { useGetPostById, useMatchingPost } from '@/src/features/post/hooks';
import { MatchingErrorScreen, MatchingNoResultScreen, MatchingWaitingScreen } from '@/src/features/post/screens';
import { AppHeader } from '@/src/shared/components';
import { POST_ROUTE } from '@/src/shared/constants';
import { getErrorMessage2 } from '@/src/shared/utils';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

const MatchingScreen = () => {
  const [applyingInterval, setApplyingInterval] = useState<boolean>(false);
  const { postId } = useLocalSearchParams<{ postId: string }>();

  console.log("PostId for matching:", postId);

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

  if (error) return <MatchingErrorScreen errorMessage={getErrorMessage2(error)} />;

  if (similarPosts.length === 0) return <MatchingNoResultScreen />;

  return (
    <View>
      <AppHeader title="Matching result" onBackPress={() => router.replace(POST_ROUTE.index)} />

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

export default MatchingScreen;
