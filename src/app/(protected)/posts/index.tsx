
import { PostFiltersComponent, PostInfinityScrollView } from '@/src/features/post/components';
import { PostFilters } from '@/src/features/post/types/post.type';
import React, { useState } from 'react';
import {
  View
} from 'react-native';
const PostScreen = () => {
  const [filters, setFilters] = useState<PostFilters>({});

  return (
    <View>
      {/* Filters */}
      <PostFiltersComponent
        filters={filters}
        onFilterChange={setFilters}
      />

      <PostInfinityScrollView filters={filters} />
    </View>
  );
};

export default PostScreen;
