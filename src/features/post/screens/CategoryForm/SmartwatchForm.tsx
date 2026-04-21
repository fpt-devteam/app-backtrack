import {
  PostFormField,
  PostFormTextArea,
} from "@/src/features/post/components";
import { usePostCreationStore } from "@/src/features/post/hooks";
import { colors } from "@/src/shared/theme";
import { MotiView } from "moti";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const SmartwatchForm = () => {
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

  const hasCase = electronicDetail.hasCase ?? false;

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
              label="Watch Brand"
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
              label="Screen condition"
              value={electronicDetail.screenCondition ?? ""}
              onChange={setElectronicScreenCondition}
            />

            <View className="border-t" />

            <PostFormField
              label="Watch face / background"
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
                  label="Bumper, case color or cover details"
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SmartwatchForm;
