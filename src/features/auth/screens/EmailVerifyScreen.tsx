import { AppBackButton, AppButton, AppLink } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { resendVerificationEmail } from "@/src/shared/services";
import { colors, typography } from "@/src/shared/theme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { EnvelopeOpenIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Text, TextStyle, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COOLDOWN_TIME_SECOND = 60;
const EmailVerifyScreen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { height } = useWindowDimensions();

  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendVerificationEmail = async () => {
    if (countdown > 0) return;
    setIsLoading(true);

    try {
      await resendVerificationEmail();
      setCountdown(COOLDOWN_TIME_SECOND);
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToOnboarding = () => {
    router.dismissTo(AUTH_ROUTE.onboarding);
  };

  return (
    <>
      {/* Header */}
      <Stack.Screen
        options={{
          headerTitle: "Verify Your Email",
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
            color: colors.text.primary,
          },
          headerLeft: () => <AppBackButton />,
        }}
      />

      {/* Content */}
      <SafeAreaView
        className="flex-1 px-md bg-surface gap-md"
        style={{ paddingVertical: height * 0.1 }}
      >
        <View className="flex-row justify-center">
          <EnvelopeOpenIcon size={128} color={colors.primary} />
        </View>

        <View className="gap-y-2">
          <Text className="text-xl font-normal text-textPrimary text-center">
            Check your email
          </Text>

          <Text className="text-base font-thin text-textSecondary text-center leading-6">
            We&apos;ve sent a verification link to your email address {email}.
          </Text>
        </View>

        <AppButton
          title={
            countdown > 0 ? `Resend Email in ${countdown}s` : "Resend Email"
          }
          onPress={handleResendVerificationEmail}
          disabled={countdown > 0}
          loading={isLoading}
        />

        <AppLink onPress={handleBackToOnboarding} title="Back to login" />
      </SafeAreaView>
    </>
  );
};

export default EmailVerifyScreen;
