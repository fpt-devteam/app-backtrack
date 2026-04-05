import { AUTH_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { router, useLocalSearchParams } from "expo-router";
import { EnvelopeIcon } from "phosphor-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const EmailVerifyScreen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { height } = useWindowDimensions();

  const handleResendVerificationEmail = () => {
    // TODO: Implement resend verification email functionality
  };

  const handleGoBackToLogin = () => {
    router.replace(AUTH_ROUTE.onboarding);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        className="flex-1 bg-surface px-10 gap-10"
        style={{
          paddingTop: height * 0.15,
          paddingBottom: height * 0.1,
        }}
      >
        <View className="flex-row justify-center">
          <EnvelopeIcon size={128} color={colors.primary} />
        </View>

        <View className="gap-y-2">
          <Text className="text-xl font-normal text-textPrimary text-center">
            Verify Your Email
          </Text>

          <Text className="text-base font-thin text-textSecondary text-center leading-6">
            We&apos;ve sent a verification link to your email address {email}.
          </Text>
        </View>

        <TouchableOpacity
          className="w-full py-5 rounded-sm bg-primary items-center justify-center"
          onPress={handleResendVerificationEmail}
          activeOpacity={0.8}
        >
          <Text className="text-base font-normal text-white text-center">
            Resend Verification Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full py-5 items-center justify-center"
          onPress={handleGoBackToLogin}
          activeOpacity={0.8}
        >
          <Text className="text-base font-normal text-secondary text-center underline">
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EmailVerifyScreen;
