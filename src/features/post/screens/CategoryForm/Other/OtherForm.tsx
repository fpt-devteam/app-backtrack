import {
  PostFormField,
  PostFormTextArea,
} from "@/src/features/post/components";
import { usePostCreationStore } from "@/src/features/post/hooks";
import React from "react";
import { Text, View } from "react-native";

const OtherForm = () => {
  const otherDetail = usePostCreationStore((state) => state.otherDetail);

  const setOtherPrimaryColor = usePostCreationStore(
    (state) => state.setOtherPrimaryColor,
  );
  
  const setOtherAiDescription = usePostCreationStore(
    (state) => state.setOtherAiDescription,
  );

  const setOtherAdditionalDetails = usePostCreationStore(
    (state) => state.setOtherAdditionalDetails,
  );

  const setOtherItemName = usePostCreationStore(
    (state) => state.setOtherItemName,
  );

  return (
    <View className="flex-1 gap-md">
      <View>
        <Text className="text-textPrimary font-normal text-2xl pr-lg tracking-tight">
          What does it look like?
        </Text>
        <Text className="text-textSecondary font-thin text-base mt-xs">
          Share the clearest traits you remember so others can recognize it
          quickly.
        </Text>
      </View>

      <View className="border rounded-md overflow-hidden">
        <PostFormField
          label="Item Name"
          value={otherDetail.itemName}
          onChange={setOtherItemName}
        />

        <View className="border-t" />

        <PostFormField
          label="Primary Color"
          value={otherDetail.primaryColor ?? ""}
          onChange={setOtherPrimaryColor}
        />
      </View>

      <View className="gap-sm">
        <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
          AI description
        </Text>

        <PostFormTextArea
          value={otherDetail.aiDescription ?? ""}
          onChange={setOtherAiDescription}
        />
      </View>

      <View className="gap-sm">
        <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
          Additional details
        </Text>

        <PostFormTextArea
          value={otherDetail.additionalDetails ?? ""}
          onChange={setOtherAdditionalDetails}
        />
      </View>
    </View>
  );
};

export default OtherForm;
