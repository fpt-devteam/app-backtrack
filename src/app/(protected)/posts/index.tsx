import { PostFiltersComponent, PostInfinityScrollView } from '@/src/features/post/components';
import { PostFilters } from '@/src/features/post/types/post.type';
import React, { useCallback, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { useChromeVisibility } from '../_layout';

const SCROLL_THRESHOLD = 50; // Minimum scroll distance to trigger hide/show
const TOP_OFFSET_THRESHOLD = 10; // When near top, always show chrome

const PostScreen = () => {
  const [filters, setFilters] = useState<PostFilters>({});
  const { setChromeVisible } = useChromeVisibility();

  const lastScrollY = useRef(0);
  const lastToggleY = useRef(0);
  const isScrollingDown = useRef(false);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;

      // Force show chrome when at the top
      if (currentScrollY <= TOP_OFFSET_THRESHOLD) {
        setChromeVisible(true);
        lastScrollY.current = currentScrollY;
        lastToggleY.current = currentScrollY;
        return;
      }

      const scrollDiff = currentScrollY - lastScrollY.current;
      const scrollDistanceSinceLastToggle = Math.abs(currentScrollY - lastToggleY.current);

      // Determine scroll direction
      if (scrollDiff > 0) {
        // Scrolling down
        if (!isScrollingDown.current && scrollDistanceSinceLastToggle > SCROLL_THRESHOLD) {
          isScrollingDown.current = true;
          setChromeVisible(false);
          lastToggleY.current = currentScrollY;
        }
      } else if (scrollDiff < 0) {
        // Scrolling up
        if (isScrollingDown.current && scrollDistanceSinceLastToggle > SCROLL_THRESHOLD) {
          isScrollingDown.current = false;
          setChromeVisible(true);
          lastToggleY.current = currentScrollY;
        }
      }

      lastScrollY.current = currentScrollY;
    },
    [setChromeVisible]
  );

  const renderListHeader = useCallback(() => {
    return (
      <PostFiltersComponent
        filters={filters}
        onFilterChange={setFilters}
      />
    );
  }, [filters]);

  return (
    <View style={{ flex: 1 }}>
      <PostInfinityScrollView
        filters={filters}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={renderListHeader}
      />
    </View>
  );
};

export default PostScreen;
