import { usePostCreationStore } from "@/src/features/post/hooks";
import { AppButton, AppLoader } from "@/src/shared/components";
import {
  CARD_SUB_CATEGORY_ICONS,
  ELECTRONICS_SUB_CATEGORY_ICONS,
  PERSONAL_BELONGING_SUB_CATEGORY_ICONS,
} from "@/src/shared/constants";
import { POST_ROUTE } from "@/src/shared/constants/route.constant";
import { Asset } from "expo-asset";
import { RelativePathString, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { PostType } from "../../types";

const ICON_SIZE = 128;
const ICON_GAP = 12;
const ITEM_WIDTH = ICON_SIZE + ICON_GAP;
const ANIMATION_DURATION_MS = 18000;

type ConveyorRowProps = {
  icons: ImageSourcePropType[];
  direction: "left" | "right";
};

const ConveyorRow = ({ icons, direction }: ConveyorRowProps) => {
  const doubled = [...icons, ...icons];
  const singleWidth = icons.length * ITEM_WIDTH;

  const offset = useSharedValue(direction === "left" ? 0 : -singleWidth);

  useEffect(() => {
    const startValue = direction === "left" ? 0 : -singleWidth;
    const endValue = direction === "left" ? -singleWidth : 0;
    offset.value = startValue;
    offset.value = withRepeat(
      withTiming(endValue, {
        duration: ANIMATION_DURATION_MS,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(offset);
    };
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View className="overflow-hidden">
      <Animated.View style={[{ flexDirection: "row" }, animStyle]}>
        {doubled.map((src, i) => (
          <View
            key={i}
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: 14,
              marginRight: ICON_GAP,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              source={src}
              style={{ width: ICON_SIZE - 16, height: ICON_SIZE - 16 }}
              resizeMode="contain"
            />
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const ReportIntentStepScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const [icons, setIcons] = useState<ImageSourcePropType[]>([]);

  const { selectPostType } = usePostCreationStore();

  useEffect(() => {
    async function preloadImages() {
      try {
        const images = [
          ...Object.values(CARD_SUB_CATEGORY_ICONS),
          ...Object.values(ELECTRONICS_SUB_CATEGORY_ICONS),
          ...Object.values(PERSONAL_BELONGING_SUB_CATEGORY_ICONS),
        ];

        const cacheImages = images.map((image) =>
          Asset.fromModule(image).downloadAsync(),
        );

        await Promise.all(cacheImages);
        setIcons(images);
      } catch (e) {
        console.warn("Preload failed", e);
      } finally {
        setIsReady(true);
      }
    }

    preloadImages();
  }, []);

  const handleNavigate = (postType: PostType) => {
    selectPostType(postType);
    router.push(POST_ROUTE.stepper as RelativePathString);
  };

  const renderContent = () => {
    if (!isReady)
      return (
        <View className="flex-1 items-center justify-center">
          <AppLoader />
        </View>
      );

    return (
      <>
        {/* Header */}
        <View className=" items-center justify-center py-xl px-2xl gap-md2">
          <Text className="text-5xl font-normal text-textPrimary text-center">
            Start a Report
          </Text>
          <Text className="text-base font-thin text-textSecondary text-center">
            Every recovery starts with a report. Are you looking for something
            or have you found a clue?
          </Text>
        </View>

        {/* Conveyor belt */}
        <View className="flex-1 gap-sm py-md ">
          <View className="">
            <ConveyorRow icons={icons.slice(0, 12)} direction="left" />
          </View>
          <View className="">
            <ConveyorRow icons={icons.slice(12)} direction="right" />
          </View>
        </View>

        {/* CTA buttons */}
        <View className="px-xl gap-y-4">
          <AppButton
            title="Find My Item"
            onPress={() => {
              handleNavigate(PostType.Lost);
            }}
            variant="secondary"
          />
          <AppButton
            title="Return a Found Item"
            variant="outline"
            onPress={() => {
              handleNavigate(PostType.Found);
            }}
          />
        </View>
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">{renderContent()}</SafeAreaView>
  );
};

export default ReportIntentStepScreen;
