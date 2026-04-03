import { useCheckEmailStatus } from "@/src/features/auth/hooks";
import { EMAIL_STATUS } from "@/src/features/auth/types";
import {
  AppButton,
  EmailField,
  TouchableIconButton,
} from "@/src/shared/components";
import { AppGoogleLogo } from "@/src/shared/components/AppGoogleLogo";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { colors, metrics } from "@/src/shared/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { PhoneIcon, XIcon } from "phosphor-react-native";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as yup from "yup";

const loginFormSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .required("Please enter a valid email address."),
  })
  .required();

type LoginFormSchema = yup.InferType<typeof loginFormSchema>;

const OnboardingScreen = () => {
  const { checkEmailStatus, loading } = useCheckEmailStatus();

  const {
    control: formControl,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    defaultValues: { email: "" },
    resolver: yupResolver(loginFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const emailValue = watch("email");
  const hasEmail = emailValue.trim().length > 0;

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    try {
      const emailStatusResponse = await checkEmailStatus({ email: data.email });
      const { status } = emailStatusResponse;

      if (status === EMAIL_STATUS.NOT_VERIFIED) {
        router.push({
          pathname: AUTH_ROUTE.verifyEmail,
          params: { email: data.email },
        });
        return;
      }

      if (status === EMAIL_STATUS.NOT_FOUND) {
        router.push({
          pathname: AUTH_ROUTE.register,
          params: { email: data.email },
        });
        return;
      }

      router.push({
        pathname: AUTH_ROUTE.login,
        params: { email: data.email },
      });
    } catch (err) {
      console.log("Check email status error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      className="w-full flex-1"
      style={{ backgroundColor: "transparent" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        className="flex-1 w-full bg-surface"
        style={{
          borderTopLeftRadius: metrics.borderRadius.lg,
          borderTopRightRadius: metrics.borderRadius.lg,
        }}
      >
        {/* ── Header ── */}
        <View
          className="relative w-full px-lg py-md flex-row items-center justify-center"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          }}
        >
          <Text className="text-center font-normal text-textPrimary text-base">
            Log in or sign upasdfasdf
          </Text>

          <View className="absolute right-lg top-0 bottom-0 justify-center">
            <TouchableIconButton
              icon={
                <XIcon size={18} color={colors.text.primary} weight="bold" />
              }
              onPress={() => router.back()}
            />
          </View>
        </View>

        {/* Body */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flexGrow: 1,
              paddingBottom: metrics.spacing.xl,
            }}
          >
            <View className="px-lg pt-xl">
              {/* ── Email field ─────────────────────────────── */}
              <Controller
                control={formControl}
                name="email"
                render={({ field: { onBlur, onChange, value } }) => (
                  <EmailField
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />

              {/* ── Continue button ─────────────────────────── */}
              <AppButton
                title="Continue"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={!hasEmail}
                className="mt-md"
              />

              {/* ── "or" divider ────────────────────────────── */}
              <View className="flex-row items-center my-xl gap-md2">
                <View className="flex-1 h-px bg-divider" />
                <Text className="text-xs text-textMuted font-medium">or</Text>
                <View className="flex-1 h-px bg-divider" />
              </View>

              {/* ── Social login buttons ─────────────────────── */}
              <View className="gap-md2 pb-xl">
                {/* Google */}
                <TouchableOpacity
                  className="relative h-control-lg rounded-sm border border-hof-900 items-center justify-center bg-surface"
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <View className="absolute left-md top-0 bottom-0 justify-center">
                    <AppGoogleLogo />
                  </View>
                  <Text className="text-sm font-normal text-textPrimary">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                {/* Phone */}
                <TouchableOpacity
                  className="relative h-control-lg rounded-sm border border-hof-900 items-center justify-center bg-surface"
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <View className="absolute left-md top-0 bottom-0 justify-center">
                    <PhoneIcon size={20} color={colors.text.primary} />
                  </View>
                  <Text className="text-sm font-normal text-textPrimary">
                    Continue with Phone
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OnboardingScreen;
