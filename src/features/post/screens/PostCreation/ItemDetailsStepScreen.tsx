
import { usePostCreationStore } from "@/src/features/post/hooks";
import BackpackForm from "@/src/features/post/screens/CategoryForm/BackpackForm";
import BankCardForm from "@/src/features/post/screens/CategoryForm/BankCardForm";
import ChargerAdapterForm from "@/src/features/post/screens/CategoryForm/ChargerAdapterForm";
import ClothingsForm from "@/src/features/post/screens/CategoryForm/ClothingsForm";
import CompanyCardForm from "@/src/features/post/screens/CategoryForm/CompanyCardForm";
import DriverLicenseForm from "@/src/features/post/screens/CategoryForm/DriverLicenseForm";
import EarphoneForm from "@/src/features/post/screens/CategoryForm/EarphoneForm";
import HeadphoneForm from "@/src/features/post/screens/CategoryForm/HeadphoneForm";
import IdentificationCardForm from "@/src/features/post/screens/CategoryForm/IdentificationCardForm";
import JewelryForm from "@/src/features/post/screens/CategoryForm/JewelryForm";
import KeyboardForm from "@/src/features/post/screens/CategoryForm/KeyboardForm";
import KeysForm from "@/src/features/post/screens/CategoryForm/KeysForm";
import LaptopForm from "@/src/features/post/screens/CategoryForm/LaptopForm";
import MouseForm from "@/src/features/post/screens/CategoryForm/MouseForm";
import OtherForm from "@/src/features/post/screens/CategoryForm/OtherForm";
import PassportForm from "@/src/features/post/screens/CategoryForm/PassportForm";
import PersonalCardForm from "@/src/features/post/screens/CategoryForm/PersonalCardForm";
import PhoneForm from "@/src/features/post/screens/CategoryForm/PhoneForm";
import PowerbankForm from "@/src/features/post/screens/CategoryForm/PowerbankForm";
import PowerOutletForm from "@/src/features/post/screens/CategoryForm/PowerOutletForm";
import SmartwatchForm from "@/src/features/post/screens/CategoryForm/SmartwatchForm";
import StudentCardForm from "@/src/features/post/screens/CategoryForm/StudentCardForm";
import SuitcasesForm from "@/src/features/post/screens/CategoryForm/SuitcasesForm";
import WalletsForm from "@/src/features/post/screens/CategoryForm/WalletsForm";
import {
  CARD_SUBCATEGORY,
  ELECTRONICS_SUBCATEGORY,
  OTHER_SUBCATEGORY,
  PERSONAL_BELONGING_SUBCATEGORY,
} from "@/src/features/post/types";
import React from "react";
import { Text, View } from "react-native";

const ItemDetailsStepScreen = () => {
  const subCategory = usePostCreationStore((state) => state.subCategoryCode);

  const renderForm = () => {
    switch (subCategory) {
      case PERSONAL_BELONGING_SUBCATEGORY.WALLETS:
        return <WalletsForm />;
      case PERSONAL_BELONGING_SUBCATEGORY.KEYS:
        return <KeysForm />;
      case PERSONAL_BELONGING_SUBCATEGORY.SUITCASES:
        return <SuitcasesForm />;
      case PERSONAL_BELONGING_SUBCATEGORY.BACKPACK:
        return <BackpackForm />;
      case PERSONAL_BELONGING_SUBCATEGORY.CLOTHINGS:
        return <ClothingsForm />;
      case PERSONAL_BELONGING_SUBCATEGORY.JEWELRY:
        return <JewelryForm />;
      case CARD_SUBCATEGORY.IDENTIFICATION_CARD:
        return <IdentificationCardForm />;
      case CARD_SUBCATEGORY.PASSPORT:
        return <PassportForm />;
      case CARD_SUBCATEGORY.DRIVER_LICENSE:
        return <DriverLicenseForm />;
      case CARD_SUBCATEGORY.PERSONAL_CARD:
        return <PersonalCardForm />;
      case CARD_SUBCATEGORY.BANK_CARD:
        return <BankCardForm />;
      case CARD_SUBCATEGORY.STUDENT_CARD:
        return <StudentCardForm />;
      case CARD_SUBCATEGORY.COMPANY_CARD:
        return <CompanyCardForm />;
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
      case OTHER_SUBCATEGORY.OTHERS:
        return <OtherForm />;
      default:
        return <Text>No form available for this category.</Text>;
    }
  };

  return <View className="flex-1">{renderForm()}</View>;
};

export default ItemDetailsStepScreen;
