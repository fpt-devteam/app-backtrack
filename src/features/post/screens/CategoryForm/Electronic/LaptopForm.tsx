import {
  PostFormField,
  PostFormTextArea,
} from "@/src/features/post/components";
import { usePostCreationStore } from "@/src/features/post/hooks";
import { colors } from "@/src/shared/theme";
import { MotiView } from "moti";
import React from "react";
import { Switch, Text, View } from "react-native";

const LaptopForm = () => {
  const electronicDetail = usePostCreationStore(
    (state) => state.electronicDetail,
  );
  const setElectronicBrand = usePostCreationStore(
    (state) => state.setElectronicBrand,
  );
  const setElectronicModel = usePostCreationStore(
    (state) => state.setElectronicModel,
  );
  const setElectronicColor = usePostCreationStore(
    (state) => state.setElectronicColor,
  );
  const setElectronicScreenCondition = usePostCreationStore(
    (state) => state.setElectronicScreenCondition,
  );
  const setElectronicLockScreenDescription = usePostCreationStore(
    (state) => state.setElectronicLockScreenDescription,
  );
  const setElectronicHasCase = usePostCreationStore(
    (state) => state.setElectronicHasCase,
  );
  const setElectronicCaseDescription = usePostCreationStore(
    (state) => state.setElectronicCaseDescription,
  );
  const setElectronicDistinguishingFeatures = usePostCreationStore(
    (state) => state.setElectronicDistinguishingFeatures,
  );
  const setElectronicItemName = usePostCreationStore(
    (state) => state.setElectronicItemName,
  );

  const hasCase = electronicDetail.hasCase ?? false;

  return (
    <View className="flex-1 gap-md">
      <View className="border rounded-md overflow-hidden">
        <PostFormField
          label="Item Name"
          value={electronicDetail.itemName}
          onChange={setElectronicItemName}
        />

        <View className="border-t" />

        <PostFormField
          label="Device Brand"
          value={electronicDetail.brand ?? ""}
          onChange={setElectronicBrand}
        />

        <View className="border-t" />

        <PostFormField
          label="Model Name"
          value={electronicDetail.model ?? ""}
          onChange={setElectronicModel}
        />

        <View className="border-t" />

        <PostFormField
          label="Primary Color"
          value={electronicDetail.color ?? ""}
          onChange={setElectronicColor}
        />

        <View className="border-t" />

        <PostFormField
          label="Screen & Glass condition"
          value={electronicDetail.screenCondition ?? ""}
          onChange={setElectronicScreenCondition}
        />

        <View className="border-t" />

        <PostFormField
          label="Wallpaper / Lock screen"
          value={electronicDetail.lockScreenDescription ?? ""}
          onChange={setElectronicLockScreenDescription}
        />
      </View>

      <View>
        <View className="flex-row items-center justify-between mb-sm">
          <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
            Is it in a case?
          </Text>
          <Switch
            value={hasCase}
            onValueChange={setElectronicHasCase}
            trackColor={{ false: colors.white, true: colors.secondary }}
          />
        </View>

        <MotiView
          from={{ opacity: 0, height: 0 }}
          animate={{
            height: hasCase ? 50 : 0,
            opacity: hasCase ? 1 : 0,
          }}
        >
          <View className="border-t-[0.5px] border-divider" />

          <View className="border rounded-sm overflow-hidden">
            <PostFormField
              label="Case colors, materials or stickers"
              value={electronicDetail.caseDescription ?? ""}
              onChange={setElectronicCaseDescription}
            />
          </View>
        </MotiView>
      </View>

      <View className="gap-sm">
        <Text className="text-textPrimary font-normal text-lg pr-lg tracking-tight">
          Unique marks & traits
        </Text>

        <PostFormTextArea
          value={electronicDetail.distinguishingFeatures ?? ""}
          onChange={setElectronicDistinguishingFeatures}
        />
      </View>
    </View>
  );
};

export default LaptopForm;
