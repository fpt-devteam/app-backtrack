import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

type ImageCarouselProps = {
  data: string[];
  imageHeight?: number;
  autoScrollInterval?: number;
  showLoadingIndicator?: boolean;
};

export const ImageCarousel = ({
  data,
  imageHeight = 250,
  autoScrollInterval = 3000,
  showLoadingIndicator = true
}: ImageCarouselProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastScrollTimeRef = useRef<number>(Date.now());

  const infiniteData = data.length > 1 ? [data[data.length - 1], ...data, data[0]] : data;

  useEffect(() => {
    if (data.length > 1 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: screenWidth, animated: false });
      }, 100);
    }
  }, [data.length]);


  useEffect(() => {
    if (data.length <= 1) return;

    const startAutoScroll = () => {
      autoScrollTimerRef.current = setInterval(() => {
        const timeSinceLastScroll = Date.now() - lastScrollTimeRef.current;

        if (timeSinceLastScroll >= autoScrollInterval && scrollViewRef.current) {
          const nextIndex = currentIndex + 1;
          const targetX = (nextIndex + 1) * screenWidth;

          scrollViewRef.current.scrollTo({
            x: targetX,
            animated: true,
          });

          lastScrollTimeRef.current = Date.now();
        }
      }, 100);
    };

    startAutoScroll();

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [currentIndex, data.length, autoScrollInterval]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);

    if (data.length > 1) {
      if (pageNum === 0) {

        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: (data.length) * screenWidth,
            animated: false,
          });
        }, 50);
        setCurrentIndex(data.length - 1);
      } else if (pageNum === infiniteData.length - 1) {

        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: screenWidth,
            animated: false,
          });
        }, 50);
        setCurrentIndex(0);
      } else {

        setCurrentIndex(pageNum - 1);
      }
    } else {
      setCurrentIndex(pageNum);
    }
  };

  const handleScrollBegin = () => {

    lastScrollTimeRef.current = Date.now();
  };

  const handleScrollEnd = () => {

    lastScrollTimeRef.current = Date.now();
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  if (!data || data.length === 0) {
    return (
      <View className="bg-gray-100 justify-center items-center" style={{ height: imageHeight }}>
        <Text className="text-gray-500">No images available</Text>
      </View>
    );
  }

  return (
    <View className="relative">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollBegin={handleScrollBegin}
        className="w-full"
      >
        {infiniteData.map((imageUrl, index) => (
          <View key={index} style={{ width: screenWidth, height: imageHeight }}>
            {/* Placeholder/Loading indicator */}
            {!loadedImages.has(index) && showLoadingIndicator && (
              <View className="absolute inset-0 bg-gray-200 justify-center items-center z-10">
                <ActivityIndicator size="large" color="#0ea5e9" />
              </View>
            )}

            <Image
              source={{ uri: imageUrl }}
              className="w-full"
              style={{ height: imageHeight }}
              resizeMode="cover"
              onLoad={() => handleImageLoad(index)}
              progressiveRenderingEnabled={true}
              fadeDuration={300}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


