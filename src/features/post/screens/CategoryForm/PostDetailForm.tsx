import React from "react";
import { Text, View } from "react-native";

import BackpackForm from "@/src/features/post/screens/CategoryForm/PersonalBelonging/BackpackForm";
import BankCardForm from "@/src/features/post/screens/CategoryForm/Card/BankCardForm";
import ChargerAdapterForm from "@/src/features/post/screens/CategoryForm/Electronic/ChargerAdapterForm";
import ClothingsForm from "@/src/features/post/screens/CategoryForm/PersonalBelonging/ClothingsForm";
import CompanyCardForm from "@/src/features/post/screens/CategoryForm/Card/CompanyCardForm";
import DriverLicenseForm from "@/src/features/post/screens/CategoryForm/Card/DriverLicenseForm";
import EarphoneForm from "@/src/features/post/screens/CategoryForm/Electronic/EarphoneForm";
import HeadphoneForm from "@/src/features/post/screens/CategoryForm/Electronic/HeadphoneForm";
import IdentificationCardForm from "@/src/features/post/screens/CategoryForm/Card/IdentificationCardForm";
import JewelryForm from "@/src/features/post/screens/CategoryForm/PersonalBelonging/JewelryForm";
import KeyboardForm from "@/src/features/post/screens/CategoryForm/Electronic/KeyboardForm";
import KeysForm from "@/src/features/post/screens/CategoryForm/PersonalBelonging/KeysForm";
import LaptopForm from "@/src/features/post/screens/CategoryForm/Electronic/LaptopForm";
import MouseForm from "@/src/features/post/screens/CategoryForm/Electronic/MouseForm";
import OtherForm from "@/src/features/post/screens/CategoryForm/Other/OtherForm";
import PassportForm from "@/src/features/post/screens/CategoryForm/Card/PassportForm";
import PersonalCardForm from "@/src/features/post/screens/CategoryForm/Card/PersonalCardForm";
import PhoneForm from "@/src/features/post/screens/CategoryForm/Electronic/PhoneForm";
import PowerbankForm from "@/src/features/post/screens/CategoryForm/Electronic/PowerbankForm";
import PowerOutletForm from "@/src/features/post/screens/CategoryForm/Electronic/PowerOutletForm";
import SmartwatchForm from "@/src/features/post/screens/CategoryForm/Electronic/SmartwatchForm";
import StudentCardForm from "@/src/features/post/screens/CategoryForm/Card/StudentCardForm";
import SuitcasesForm from "@/src/features/post/screens/CategoryForm/PersonalBelonging/SuitcasesForm";
import WalletsForm from "@/src/features/post/screens/CategoryForm/PersonalBelonging/WalletsForm";
import {
  CARD_SUBCATEGORY,
  ELECTRONICS_SUBCATEGORY,
  OTHER_SUBCATEGORY,
  PERSONAL_BELONGING_SUBCATEGORY,
  PostSubcategoryCode,
} from "@/src/features/post/types";

type PostDetailFormProps = {
  subcategory: PostSubcategoryCode;
};

const PostDetailForm = ({ subcategory }: PostDetailFormProps) => {
  const renderForm = () => {
    switch (subcategory) {
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

export default PostDetailForm;
