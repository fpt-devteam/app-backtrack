import { MatchingErrorScreen, MatchingNoResultScreen, MatchingWaitingScreen, SimilarPostCard } from '@/src/features/post/components';
import { useGetPostById, useMatchingPost } from '@/src/features/post/hooks';
import { useLocalSearchParams } from 'expo-router';
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (applyingInterval || isMatching || !yourItem) return <MatchingWaitingScreen />;

  if (error) return <MatchingErrorScreen />;

  if (similarPosts.length === 0) return <MatchingNoResultScreen />;

  return (
    <View>
      {/* Header */}
      <View>
      </View>

      {/* Results */}
      <FlatList
        data={similarPosts}
        renderItem={({ item }) => <SimilarPostCard matchPost={item} postId={postId} />}
        keyExtractor={(item) => item.id}
      />

      {/* Footer */}
      <View>
      </View>
    </View>
  );
}

export default MatchingScreen;
