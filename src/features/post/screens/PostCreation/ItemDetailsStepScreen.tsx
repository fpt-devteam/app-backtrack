import { usePostCreationStore } from "@/src/features/post/hooks";
import { ELECTRONICS_SUBCATEGORY } from "@/src/features/post/types";
import React from "react";
import { Text, View } from "react-native";
import ChargerAdapterForm from "../CategoryForm/ChargerAdapterForm";
import EarphoneForm from "../CategoryForm/EarphoneForm";
import HeadphoneForm from "../CategoryForm/HeadphoneForm";
import KeyboardForm from "../CategoryForm/KeyboardForm";
import LaptopForm from "../CategoryForm/LaptopForm";
import MouseForm from "../CategoryForm/MouseForm";
import PhoneForm from "../CategoryForm/PhoneForm";
import PowerbankForm from "../CategoryForm/PowerbankForm";
import PowerOutletForm from "../CategoryForm/PowerOutletForm";
import SmartwatchForm from "../CategoryForm/SmartwatchForm";

const ItemDetailsStepScreen = () => {
  const subCategory = usePostCreationStore((state) => state.subCategory);

  const renderForm = () => {
    switch (subCategory) {
      case ELECTRONICS_SUBCATEGORY.LAPTOP:
        return <LaptopForm />;
      case ELECTRONICS_SUBCATEGORY.SMARTWATCH:
        return <SmartwatchForm />;
      case ELECTRONICS_SUBCATEGORY.CHARGER_ADAPTER:
        return <ChargerAdapterForm />;
      case ELECTRONICS_SUBCATEGORY.MOUSE:
        return <MouseForm />;
      case ELECTRONICS_SUBCATEGORY.KEYBOARD:
        return <KeyboardForm />;
      case ELECTRONICS_SUBCATEGORY.POWERBANK:
        return <PowerbankForm />;
      case ELECTRONICS_SUBCATEGORY.POWER_OUTLET:
        return <PowerOutletForm />;
      case ELECTRONICS_SUBCATEGORY.HEADPHONE:
        return <HeadphoneForm />;
      case ELECTRONICS_SUBCATEGORY.EARPHONE:
        return <EarphoneForm />;
      case ELECTRONICS_SUBCATEGORY.PHONE:
        return <PhoneForm />;
      default:
        return <Text>No form available for this category.</Text>;
    }
  };

  return <View className="flex-1">{renderForm()}</View>;
};

export default ItemDetailsStepScreen;
