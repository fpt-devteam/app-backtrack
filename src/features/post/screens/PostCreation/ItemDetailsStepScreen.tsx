import { usePostCreationStore } from "@/src/features/post/hooks";
import React from "react";
import { View } from "react-native";
import PostDetailForm from "../CategoryForm/PostDetailForm";

const ItemDetailsStepScreen = () => {
  const subCategory = usePostCreationStore((state) => state.subCategoryCode);

  return (
    <View className="flex-1">
      <PostDetailForm subcategory={subCategory} />
    </View>
  );
};

export default ItemDetailsStepScreen;
