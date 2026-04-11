import { CATEGORY_REGISTRY } from "@/src/features/post/constants";
import { usePostSearchStore } from "@/src/features/post/hooks/usePostSearchStore";
import { radiusSearchSchema } from "@/src/features/post/schemas";
import { type ItemCategory, PostType } from "@/src/features/post/types";
import {
  AppButton,
  AppLink,
  AppSegmentedControl,
} from "@/src/shared/components";
import { colors, metrics } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { MotiView } from "moti";
import {
  CubeFocusIcon,
  DotsThreeCircleIcon,
  FadersIcon,
  MapPinSimpleAreaIcon,
} from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PostTypeFilterValue = "all" | PostType;

const RADIUS_OPTION_VALUES = [1, 5, 10, 20] as const;
const RADIUS_OPTIONS = RADIUS_OPTION_VALUES.map((value) => ({
  label: `${value} km`,
  value: String(value),
}));

const POST_TYPE_OPTIONS = [
  { label: "Anytype", value: "all" },
  { label: "Missing", value: PostType.Lost },
  { label: "Discovered", value: PostType.Found },
];

type CategoryOptionProps = {
  category: ItemCategory;
  selected: boolean;
  onPress: (category: ItemCategory) => void;
};

const CategoryCard = ({ category, selected, onPress }: CategoryOptionProps) => {
  const info = CATEGORY_REGISTRY[category];
  const IconComponent = info?.icon ?? DotsThreeCircleIcon;
  const Label = info?.label ?? "Unknown";

  return (
    <Pressable
      onPress={() => onPress(category)}
      className="flex-row p-md2 items-center gap-sm justify-center rounded-full mb-sm mr-sm"
      style={{
        borderWidth: 1,
        borderColor: selected ? colors.border.strong : colors.border.DEFAULT,
      }}
    >
      <IconComponent size={24} />

      <Text className="text-md font-thin text-center text-textPrimary">
        {Label}
      </Text>
    </Pressable>
  );
};

const clampRadiusToOption = (value: number): string => {
  const match = RADIUS_OPTION_VALUES.find((item) => item === value);
  return String(match ?? radiusSearchSchema.getDefault());
};

const PostSearchFilterScreen = () => {
  const insets = useSafeAreaInsets();
  const store = usePostSearchStore();

  const [draftRadius, setDraftRadius] = useState(
    clampRadiusToOption(Math.round(store.location.radius)),
  );
  const [draftPostType, setDraftPostType] = useState<PostTypeFilterValue>(
    store.advanced.postType ?? "all",
  );
  const [draftCategories, setDraftCategories] = useState<ItemCategory[]>(
    store.advanced.categories,
  );

  const handleToggleCategory = useCallback((category: ItemCategory) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );

    setDraftCategories((prev) =>
      prev.includes(category)
        ? prev.filter((v) => v !== category)
        : [...prev, category],
    );
  }, []);

  const handleClearAll = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );

    setDraftRadius(String(radiusSearchSchema.getDefault()));
    setDraftPostType("all");
    setDraftCategories([]);
  }, []);

  const handleApply = useCallback(() => {
    void Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    ).catch(() => undefined);

    store.updateRadius(Number(draftRadius));

    store.updatePostType(
      draftPostType === "all" ? undefined : (draftPostType as PostType),
    );

    store.updateCategories(draftCategories);

    router.back();
  }, [draftCategories, draftPostType, draftRadius, store]);

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        className="flex-1 p-md"
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-lg">
          {/* Post Type */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, delay: 40 }}
          >
            <View className="gap-lg">
              <View className="flex-row items-center gap-sm">
                <CubeFocusIcon
                  size={32}
                  weight="regular"
                  color={colors.blue[500]}
                />
                <Text className="text-lg font-normal text-textPrimary">
                  Type of Post
                </Text>
              </View>
              <AppSegmentedControl
                value={draftPostType}
                onChange={(v) => setDraftPostType(v as PostTypeFilterValue)}
                options={POST_TYPE_OPTIONS}
              />
            </View>
          </MotiView>

          <View className="border-t border-muted" />

          {/* Search Radius */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 240 }}
          >
            <View className="gap-lg">
              <View className="flex-row items-center gap-sm">
                <MapPinSimpleAreaIcon
                  size={32}
                  weight="regular"
                  color={colors.red[600]}
                />
                <Text className="text-lg font-normal text-textPrimary">
                  Search Radius
                </Text>
              </View>
              <AppSegmentedControl
                value={draftRadius}
                onChange={setDraftRadius}
                options={RADIUS_OPTIONS}
              />
            </View>
          </MotiView>

          <View className="border-t border-muted" />

          {/* Category */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 280, delay: 80 }}
          >
            <View className="gap-lg">
              <View className="flex-row items-center gap-sm">
                <FadersIcon size={32} weight="regular" color={colors.primary} />
                <Text className="text-lg font-normal text-textPrimary">
                  Category
                </Text>
              </View>

              <View className="flex-row flex-wrap">
                {Object.keys(CATEGORY_REGISTRY).map((key) => (
                  <CategoryCard
                    key={key}
                    category={key as ItemCategory}
                    selected={draftCategories.includes(key as ItemCategory)}
                    onPress={handleToggleCategory}
                  />
                ))}
              </View>
            </View>
          </MotiView>
        </View>
      </ScrollView>

      {/* Actions */}
      <View
        className="absolute left-0 right-0 bottom-0 border-t border-muted bg-white/95 px-md pt-md2 flex-col gap-md items-center justify-between shadow-lg"
        style={{ paddingBottom: insets.bottom + metrics.spacing.sm }}
      >
        <AppButton
          title="Apply filters"
          variant="secondary"
          onPress={handleApply}
        />
        <AppLink title="Clear all" onPress={handleClearAll} size="sm" />
      </View>
    </View>
  );
};

export default PostSearchFilterScreen;
