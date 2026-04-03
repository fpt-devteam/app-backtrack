import { useForgotPassword } from "@/src/features/auth/hooks";
import type { ForgotPasswordRequest } from "@/src/features/auth/types";
import { AppButton, EmailField } from "@/src/shared/components";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as yup from "yup";

const forgotPasswordSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("Invalid email format!")
      .required("Email is required!"),
  })
  .required();

type PasswordResetFormSchema = yup.InferType<typeof forgotPasswordSchema>;

export default function PasswordResetScreen() {
  const {
    forgotPassword,
    loading,
    error: forgotPasswordError,
    reset,
  } = useForgotPassword();

  const {
    control: formControl,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormSchema>({
    defaultValues: { email: "" },
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<PasswordResetFormSchema> = async (data) => {
    try {
      const req: ForgotPasswordRequest = { email: data.email };
      await forgotPassword(req);
    } catch (error) {
      console.log("Err", error);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow bg-surface p-6 "
        showsVerticalScrollIndicator={false}
      >
        {/* Form */}
        <View className="w-full max-w-[420px] self-center">
          {/* Form fields */}
          <View className="pb-6 gap-sm">
            <Controller
              control={formControl}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <EmailField
                  value={value}
                  onChange={(text: string) => {
                    if (forgotPasswordError) {
                      reset();
                    }
                    onChange(text);
                  }}
                  onBlur={onBlur}
                  error={errors.email?.message || forgotPasswordError}
                />
              )}
            />

            <Text className="text-xs font-normal text-textMuted">
              Enter your email address and we&apos;ll send you instructions to
              reset your password if an account exists.
            </Text>
          </View>

          {/* Submit Button */}
          <View className="mb-6">
            <AppButton
              title="Send Password Reset Instructions"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
