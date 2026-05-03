import { usePostCreationStore } from "@/src/features/post/hooks";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
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
          <PostDetailForm subcategory={subCategory} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ItemDetailsStepScreen;
