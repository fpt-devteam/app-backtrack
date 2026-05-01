import { PostFormField } from "@/src/features/post/components";
import { AppBackButton } from "@/src/shared/components";
import { AppButton } from "@/src/shared/components/ui/AppButton";
import { SHARED_ROUTE } from "@/src/shared/constants";
import { colors, typography } from "@/src/shared/theme";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyPhoneInputScreen = () => {
  const [phone, setPhone] = useState("");

  const handleVerify = async () => {
    if (!phone.trim()) return;

    Keyboard.dismiss();

    router.push({
      pathname: SHARED_ROUTE.verifyPhone,
      params: { phone },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Verify your phone",
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
            color: colors.text.primary,
          },
          headerRight: () => <AppBackButton type="xIcon" />,
        }}
      />

      <SafeAreaView className="flex-1 bg-surface px-md py-lg">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-surface">
            {/* Description */}
            <Text className="text-normal font-thin text-textPrimary leading-5 mb-xl">
              Your contact information is safe with us. We just need to verify
              your phone number. You can choose to hide it on your profile
              later.
            </Text>

            {/* Phone Input */}
            <View className="gap-sm">
              <View className="border rounded-md overflow-hidden">
                <PostFormField
                  label="Phone number"
                  value={phone}
                  onChange={setPhone}
                  type="phone-pad"
                />
              </View>

              <Text className="text-xs font-thin text-textPrimary leading-5">
                We will send you a code to verify your phone number. Standard
                message and data rates may apply.
              </Text>
            </View>

            {/* Verify Button */}
            <View className="mt-lg">
              <AppButton
                title="Verify"
                onPress={handleVerify}
                disabled={!phone.trim()}
                variant="secondary"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
};

export default VerifyPhoneInputScreen;
