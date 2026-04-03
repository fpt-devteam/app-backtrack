import { useForgotPassword } from "@/src/features/auth/hooks";
import type { ForgotPasswordRequest } from "@/src/features/auth/types";
import { AppInlineError, EmailField } from "@/src/shared/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, router } from "expo-router";
import { EnvelopeSimple } from "phosphor-react-native";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
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
  const { forgotPassword, loading, error, reset } = useForgotPassword();

  const {
    control: formControl,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<PasswordResetFormSchema>({
    defaultValues: { email: "" },
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onSubmit",
  });

  const handleInputChange = () => {
    if (errors.email) {
      clearErrors("email");
    }
    if (error) {
      reset();
    }
  };

  const onSubmit: SubmitHandler<PasswordResetFormSchema> = async (data) => {
    try {
      const req: ForgotPasswordRequest = { email: data.email };
      await forgotPassword(req);

      // Navigate to check email screen
      router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="w-full px-6 pt-16 pb-8">
          <Text className="text-3xl font-bold text-slate-900 mb-3">
            Reset password
          </Text>
          <Text className="text-base text-slate-600 leading-6">
            Enter your email address and we&apos;ll send you instructions to
            reset your password if an account exists.
          </Text>
        </View>

        {/* Form */}
        <View className="flex-1 px-6">
          <View className="w-full max-w-[420px] self-center">
            {/* App Inline Error */}
            {error && <AppInlineError message={error} />}

            {/* Form fields */}
            <View className="mb-6">
              <Controller
                control={formControl}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <EmailField
                    value={value}
                    onChange={(text: string) => {
                      handleInputChange();
                      onChange(text);
                    }}
                    error={errors.email?.message}
                  />
                )}
              />
            </View>

            {/* Submit Button */}
            <View className="mb-6">
              <TouchableOpacity
                className={`flex-row items-center justify-center rounded-lg bg-primary px-4 py-3.5 ${loading ? "opacity-70" : ""}`}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text className="ml-2 font-medium text-base text-white">
                      Sending...
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text className="mr-2 font-medium text-base text-white">
                      Send reset link
                    </Text>
                    <EnvelopeSimple size={18} color="#ffffff" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Back to Login */}
            <View className="items-center">
              <Link href="/login" className="text-sm text-primary font-medium">
                Back to login
              </Link>
            </View>
          </View>
        </View>

        <View className="flex-1" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
