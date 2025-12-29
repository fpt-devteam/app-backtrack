import { PostMatchCard } from '@/src/features/post/components';
import useGetPostById from '@/src/features/post/hooks/useGetPostById';
import useMatchingPost from '@/src/features/post/hooks/useMatchingPost';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const MatchingScreen = () => {
  const [applyingInterval, setApplyingInterval] = useState<boolean>(false);
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const { isMatching, similarPosts, error } = useMatchingPost(postId);
  const { data: yourItem } = useGetPostById({ postId });

  useEffect(() => {
    setApplyingInterval(true);
    const interval = setInterval(() => {
      setApplyingInterval(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (applyingInterval || isMatching || !yourItem) return <MatchingLoadingScreen />;

  if (error) return <MatchingErrorScreen />;

  if (similarPosts.length === 0) return <MatchingNoResultsScreen />;

  return (
    <FlatList
      data={similarPosts}
      renderItem={({ item }) => <PostMatchCard yourItem={yourItem} matchedItem={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

const MatchingLoadingScreen = () => {
  return (
    <View>
      <Text>Matching in progress...</Text>
    </View>
  );
}

const MatchingErrorScreen = () => {
  return (
    <View>
      <Text>Error occurred while matching posts.</Text>
    </View>
  );
}

const MatchingNoResultsScreen = () => {
  return (
    <View>
      <Text>No similar posts found.</Text>
    </View>
  );
}

export default MatchingScreen;
