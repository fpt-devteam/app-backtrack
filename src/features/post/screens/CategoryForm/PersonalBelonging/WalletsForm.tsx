import {
  PostFormField,
  PostFormTextArea,
} from "@/src/features/post/components";
import { usePostCreationStore } from "@/src/features/post/hooks";
import React from "react";
import { Text, View } from "react-native";

const WalletsForm = () => {
  const personalBelongingDetail = usePostCreationStore(
    (state) => state.personalBelongingDetail,
  );
  const setPersonalBelongingColor = usePostCreationStore(
    (state) => state.setPersonalBelongingColor,
  );
  const setPersonalBelongingBrand = usePostCreationStore(
    (state) => state.setPersonalBelongingBrand,
  );
  const setPersonalBelongingMaterial = usePostCreationStore(
    (state) => state.setPersonalBelongingMaterial,
  );
  const setPersonalBelongingCondition = usePostCreationStore(
    (state) => state.setPersonalBelongingCondition,
  );
  const setPersonalBelongingDistinctiveMarks = usePostCreationStore(
    (state) => state.setPersonalBelongingDistinctiveMarks,
  );
  const setPersonalBelongingAdditionalDetails = usePostCreationStore(
    (state) => state.setPersonalBelongingAdditionalDetails,
  );
  const postTitle = usePostCreationStore((state) => state.postTitle);
  const updatePostTitle = usePostCreationStore(
    (state) => state.updatePostTitle,
  );

  return (
    <View className="flex-1 gap-md">
      <View className="border rounded-md overflow-hidden">
        <PostFormField
          label="Post Title"
          value={postTitle}
          onChange={updatePostTitle}
        />

        <View className="border-t" />

        <PostFormField
          label="Color"
          value={personalBelongingDetail.color ?? ""}
          onChange={setPersonalBelongingColor}
        />

        <View className="border-t" />

        <PostFormField
          label="Brand"
          value={personalBelongingDetail.brand ?? ""}
          onChange={setPersonalBelongingBrand}
        />

        <View className="border-t" />

        <PostFormField
          label="Material"
          value={personalBelongingDetail.material ?? ""}
          onChange={setPersonalBelongingMaterial}
        />

        <View className="border-t" />

        <PostFormField
          label="Condition"
          value={personalBelongingDetail.condition ?? ""}
          onChange={setPersonalBelongingCondition}
        />
      </View>

      <View className="gap-sm">
        <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
          Unique marks & traits
        </Text>

        <PostFormTextArea
          value={personalBelongingDetail.distinctiveMarks ?? ""}
          onChange={setPersonalBelongingDistinctiveMarks}
        />
      </View>

      <View className="gap-sm">
        <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
          Additional details
        </Text>

        <PostFormTextArea
          value={personalBelongingDetail.additionalDetails ?? ""}
          onChange={setPersonalBelongingAdditionalDetails}
        />
      </View>
    </View>
  );
};

export default WalletsForm;
