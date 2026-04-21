import { usePostCreationStore } from "@/src/features/post/hooks";
import {
  CARD_SUBCATEGORY,
  ELECTRONICS_SUBCATEGORY,
  PERSONAL_BELONGING_SUBCATEGORY,
} from "@/src/features/post/types";
import React from "react";
import { Text, View } from "react-native";
import BankCardForm from "../CategoryForm/BankCardForm";
import BackpackForm from "../CategoryForm/BackpackForm";
import ChargerAdapterForm from "../CategoryForm/ChargerAdapterForm";
import ClothingsForm from "../CategoryForm/ClothingsForm";
import CompanyCardForm from "../CategoryForm/CompanyCardForm";
import DriverLicenseForm from "../CategoryForm/DriverLicenseForm";
import EarphoneForm from "../CategoryForm/EarphoneForm";
import HeadphoneForm from "../CategoryForm/HeadphoneForm";
import IdentificationCardForm from "../CategoryForm/IdentificationCardForm";
import JewelryForm from "../CategoryForm/JewelryForm";
import KeyboardForm from "../CategoryForm/KeyboardForm";
import KeysForm from "../CategoryForm/KeysForm";
import LaptopForm from "../CategoryForm/LaptopForm";
import MouseForm from "../CategoryForm/MouseForm";
import PassportForm from "../CategoryForm/PassportForm";
import PersonalCardForm from "../CategoryForm/PersonalCardForm";
import PhoneForm from "../CategoryForm/PhoneForm";
import PowerbankForm from "../CategoryForm/PowerbankForm";
import PowerOutletForm from "../CategoryForm/PowerOutletForm";
import SmartwatchForm from "../CategoryForm/SmartwatchForm";
import StudentCardForm from "../CategoryForm/StudentCardForm";
import SuitcasesForm from "../CategoryForm/SuitcasesForm";
import WalletsForm from "../CategoryForm/WalletsForm";

const ItemDetailsStepScreen = () => {
  const subCategory = usePostCreationStore((state) => state.subCategory);

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
      default:
        return <Text>No form available for this category.</Text>;
    }
  };

  return <View className="flex-1">{renderForm()}</View>;
};

export default ItemDetailsStepScreen;
