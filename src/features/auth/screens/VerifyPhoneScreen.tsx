import { AppBackButton } from "@/src/shared/components";
import { AppLink } from "@/src/shared/components/AppLink";
import { AppButton } from "@/src/shared/components/ui/AppButton";
import { toast } from "@/src/shared/components/ui/toast";
import { colors, typography } from "@/src/shared/theme";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

const VerifyPhoneScreen = () => {
  const { phone: phoneParam } = useLocalSearchParams<{ phone?: string }>();
  const inputRef = useRef<TextInput>(null);

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const navigation = useNavigation();

  const phone = useMemo(() => {
    if (Array.isArray(phoneParam)) return phoneParam[0]?.trim() ?? "";
    return phoneParam?.trim() ?? "";
  }, [phoneParam]);

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const instruction = `Enter the code we sent to ${phone}:`;

  const handleChangeOtp = (value: string) => {
    setOtp(value.replace(/\D/g, "").slice(0, OTP_LENGTH));
  };

  const handleConfirm = async () => {
    if (otp.length !== OTP_LENGTH || isConfirming) return;

    Keyboard.dismiss();
    setIsConfirming(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success("Phone verified successfully!");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;

    setOtp("");
    setCountdown(RESEND_COOLDOWN_SECONDS);
    inputRef.current?.focus();
    toast.success("OTP resent successfully!");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Confirm your number",
          headerBackVisible: false,
          headerLeft: () => <AppBackButton />,
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
            color: colors.text.primary,
          },
          headerRight: () => (
            <AppBackButton
              type="xIcon"
              onPress={() => {
                const parent = navigation.getParent();
                if (parent) {
                  parent.goBack();
                } else {
                  router.back();
                }
              }}
            />
          ),
        }}
      />

      <SafeAreaView className="flex-1 bg-surface px-md">
        <View className="flex-1 gap-xl py-xl">
          <View className="gap-md2">
            <Text className="text-base font-thin text-textPrimary leading-6">
              {instruction}
            </Text>

            <Pressable
              onPress={() => inputRef.current?.focus()}
              className="gap-md"
            >
              <View className="flex-row justify-between gap-sm">
                {Array.from({ length: OTP_LENGTH }, (_, index) => {
                  const digit = otp[index] ?? "";
                  const isFilled = digit.length > 0;
                  const isActive =
                    index === otp.length && otp.length < OTP_LENGTH;

                  return (
                    <View
                      key={index}
                      className="h-14 flex-1 items-center justify-center rounded-lg border bg-surface"
                      style={{
                        borderColor:
                          isFilled || isActive
                            ? colors.secondary
                            : colors.divider,
                      }}
                    >
                      <Text className="text-xl font-thin text-textPrimary">
                        {digit || " "}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={handleChangeOtp}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                maxLength={OTP_LENGTH}
                caretHidden
                className="absolute h-0 w-0 opacity-0"
              />
            </Pressable>
          </View>

          <View className="gap-md pb-lg">
            <AppButton
              title="Confirm"
              onPress={handleConfirm}
              loading={isConfirming}
              disabled={otp.length !== OTP_LENGTH}
              variant="secondary"
            />

            <AppLink
              title={countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
              onPress={handleResendOtp}
              disabled={countdown > 0}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default VerifyPhoneScreen;
