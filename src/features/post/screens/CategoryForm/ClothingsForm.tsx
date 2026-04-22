import {
  PostFormField,
  PostFormTextArea,
} from "@/src/features/post/components";
import { usePostCreationStore } from "@/src/features/post/hooks";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const ClothingsForm = () => {
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
  const setPersonalBelongingSize = usePostCreationStore(
    (state) => state.setPersonalBelongingSize,
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
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 p-lg"
          contentContainerClassName="gap-lg pb-xl"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
              label="Size"
              value={personalBelongingDetail.size ?? ""}
              onChange={setPersonalBelongingSize}
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ClothingsForm;
