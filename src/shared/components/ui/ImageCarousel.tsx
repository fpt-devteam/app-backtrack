import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Text, View } from "react-native";

type Props = {
  data: string[];
  height?: number;
  initialIndex?: number;
};

export const ImageCarousel = ({ data, height = 480, initialIndex = 0 }: Props) => {
  const width = Dimensions.get("window").width;
  const listRef = useRef<FlatList<string>>(null);

  const images = useMemo(() => data?.filter(Boolean) ?? [], [data]);
  const total = images.length;

  const safeInitial = Math.min(Math.max(initialIndex, 0), Math.max(total - 1, 0));
  const [index, setIndex] = useState(safeInitial);

  const onScrollToIndexFailed = useCallback(() => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: safeInitial, animated: false });
    }, 50);
  }, [safeInitial]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      setIndex(Math.round(x / width));
    },
    [width]
  );

  if (total === 0) return null;

  return (
    <View style={{ width: "100%", height }}>
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={(uri, i) => `${uri}-${i}`}
        horizontal
        pagingEnabled
        scrollEnabled={true}                // ✅ cho swipe
        onMomentumScrollEnd={onMomentumScrollEnd} // ✅ cập nhật index
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={safeInitial}
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })} // ✅ giảm lỗi scrollToIndex
        renderItem={({ item }) => (
          <View style={{ width, height, justifyContent: "center" }}>
            <Image
              source={{ uri: item }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {total > 1 && (
        <>
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>
              {index + 1}/{total}
            </Text>
          </View>

          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 12,
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {images.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor:
                    i === index ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                }}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
};
