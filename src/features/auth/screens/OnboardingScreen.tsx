import { useCheckEmailStatus } from "@/src/features/auth/hooks";
import { EMAIL_STATUS } from "@/src/features/auth/types";
import {
  AppButton,
  AppLogo,
  BaseInputField,
  TouchableIconButton,
} from "@/src/shared/components";
import { AppGoogleLogo } from "@/src/shared/components/AppGoogleLogo";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { PhoneIcon } from "phosphor-react-native";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
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
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 16,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 bg-surface px-lg items-center justify-center">
            {/* Group Header (Logo) */}
            <View className="items-center gap-6 mb-10">
              <AppLogo height={40} />

              <Text className="text-2xl text-textPrimary font-normal text-center">
                Login or sign up
              </Text>
            </View>

            {/* Group Content (Form + Social) */}
            <View className="w-full">
              {/* Email Form */}
              <View className="w-full">
                <Controller
                  control={formControl}
                  name="email"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <BaseInputField
                      label="Email"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />

                <AppButton
                  title="Continue"
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  disabled={!hasEmail}
                  className="mt-md"
                />
              </View>

              {/* Divider */}
              <View className="flex-row items-center my-10 gap-md2">
                <View
                  className="flex-1 h-px "
                  style={{
                    backgroundColor: colors.divider,
                  }}
                />
                <Text className="text-xs text-textMuted font-medium">or</Text>
                <View
                  className="flex-1 h-px "
                  style={{
                    backgroundColor: colors.divider,
                  }}
                />
              </View>

              {/* Social Buttons */}
              <View className="gap-md2 flex-row justify-center">
                <TouchableIconButton
                  icon={
                    <View
                      className="p-md items-center justify-center rounded-sm bg-surface"
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border.DEFAULT,
                      }}
                    >
                      <AppGoogleLogo />
                    </View>
                  }
                  onPress={() => {}}
                  disabled={loading}
                />

                <TouchableIconButton
                  icon={
                    <View
                      className="p-md items-center justify-center rounded-sm bg-surface"
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border.DEFAULT,
                      }}
                    >
                      <PhoneIcon
                        size={20}
                        color={colors.text.primary}
                        weight="fill"
                      />
                    </View>
                  }
                  onPress={() => {}}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OnboardingScreen;
