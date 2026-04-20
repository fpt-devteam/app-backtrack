import { usePostCreationStore } from "@/src/features/post/hooks";
import { ELECTRONICS_SUBCATEGORY } from "@/src/features/post/types";
import React from "react";
import { Text, View } from "react-native";
import PhoneForm from "../CategoryForm/PhoneForm";

const ItemDetailsStepScreen = () => {
  const subCategory = usePostCreationStore((state) => state.subCategory);

  const renderForm = () => {
    switch (subCategory) {
      case ELECTRONICS_SUBCATEGORY.PHONE:
        return <PhoneForm />;
      default:
        return <Text>No form available for this category.</Text>;
    }
  };

  return <View className="flex-1">{renderForm()}</View>;
};

export default ItemDetailsStepScreen;
