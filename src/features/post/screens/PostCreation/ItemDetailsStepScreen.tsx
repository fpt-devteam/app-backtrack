import { usePostCreationStore } from "@/src/features/post/hooks";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import PostDetailForm from "../CategoryForm/PostDetailForm";

const ItemDetailsStepScreen = () => {
  const subCategory = usePostCreationStore((state) => state.subCategoryCode);

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
          
          <PostDetailForm subcategory={subCategory} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ItemDetailsStepScreen;
