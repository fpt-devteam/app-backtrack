import { View } from '@/src/shared/components/ui/bna/View';
import { colors } from '@/src/shared/theme';
import type { PropsWithChildren, ReactElement } from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

type Props = PropsWithChildren<{
  headerHeight?: number;
  headerImage: ReactElement;
}>;

export function ParallaxScrollView({
  children,
  headerHeight = 250,
  headerImage,
}: Props) {
  const backgroundColor = colors.background;
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            {
              backgroundColor,
              overflow: 'hidden',
              height: headerHeight,
            },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
        </Animated.View>
        <View
          style={{
            flex: 1,
            padding: 32,
            gap: 16,
            overflow: 'hidden',
            backgroundColor,
          }}
        >
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
