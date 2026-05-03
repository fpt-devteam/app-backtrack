import {
  PostFormField,
  PostFormTextArea,
} from "@/src/features/post/components";
import { usePostCreationStore } from "@/src/features/post/hooks";
import React from "react";
import { Text, View } from "react-native";

const PowerOutletForm = () => {
  const electronicDetail = usePostCreationStore(
    (state) => state.electronicDetail,
  );
  const setElectronicBrand = usePostCreationStore(
    (state) => state.setElectronicBrand,
  );
  const setElectronicModel = usePostCreationStore(
    (state) => state.setElectronicModel,
  );
  const setElectronicColor = usePostCreationStore(
    (state) => state.setElectronicColor,
  );
  const setElectronicDistinguishingFeatures = usePostCreationStore(
    (state) => state.setElectronicDistinguishingFeatures,
  );
  const postTitle = usePostCreationStore((state) => state.postTitle);
  const updatePostTitle = usePostCreationStore(
    (state) => state.updatePostTitle,
  );

  return (
    <View className="flex-1 gap-md">
      <View>
        <Text className="text-textPrimary font-normal text-2xl pr-lg tracking-tight">
          What does it look like?
        </Text>
        <Text className="text-textSecondary font-thin text-base mt-xs">
          The more unique traits you provide, the faster our AI can track it
          down.
        </Text>
      </View>

      <View className="border rounded-md overflow-hidden">
        <PostFormField
          label="Post Title"
          value={postTitle}
          onChange={updatePostTitle}
        />

        <View className="border-t" />

        <PostFormField
          label="Brand"
          value={electronicDetail.brand ?? ""}
          onChange={setElectronicBrand}
        />

        <View className="border-t" />

        <PostFormField
          label="Model Name"
          value={electronicDetail.model ?? ""}
          onChange={setElectronicModel}
        />

        <View className="border-t" />

        <PostFormField
          label="Primary Color"
          value={electronicDetail.color ?? ""}
          onChange={setElectronicColor}
        />
      </View>

      <View className="gap-sm">
        <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
          Unique marks & traits
        </Text>

        <PostFormTextArea
          value={electronicDetail.distinguishingFeatures ?? ""}
          onChange={setElectronicDistinguishingFeatures}
        />
      </View>
    </View>
  );
};

export default PowerOutletForm;
