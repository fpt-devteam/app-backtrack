import { useLogin } from "@/src/features/auth/hooks";
import type { LoginRequest } from "@/src/features/auth/types";
import { AppButton, PasswordField } from "@/src/shared/components";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
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
    password: yup.string().trim().required("Please enter your password."),
  })
  .required();

type LoginFormSchema = yup.InferType<typeof loginFormSchema>;

const LoginScreen = () => {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { login, loading, error: loginError } = useLogin();

  const email = Array.isArray(emailParam)
    ? (emailParam[0] ?? "")
    : (emailParam ?? "");

  const {
    control: formControl,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm<LoginFormSchema>({
    defaultValues: { password: "" },
    resolver: yupResolver(loginFormSchema),
    mode: "onSubmit",
  });

  const passwordValue = watch("password");
  const hasPassword = passwordValue.trim().length > 0;

  const handleInputChange = (field: "password") => {
    if (errors[field]) clearErrors(field);
  };

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    try {
      const req: LoginRequest = {
        email,
        password: data.password,
      };

      await login(req);
      router.dismissAll();
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      className="w-full flex-1"
      style={{ backgroundColor: "transparent" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-surface px-lg pt-xl">
          {/* ── Password field ─────────────────────────────── */}
          <Controller
            control={formControl}
            name="password"
            render={({ field: { onBlur, onChange, value } }) => (
              <PasswordField
                value={value}
                onChange={(text) => {
                  handleInputChange("password");
                  onChange(text);
                }}
                onBlur={() => {
                  onBlur();
                  void trigger("password");
                }}
                error={errors.password?.message || loginError}
              />
            )}
          />

          {/* ── Continue button ─────────────────────────── */}
          <AppButton
            title="Continue"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={!hasPassword}
            className="mt-md"
          />

          {/* Forgot password? */}
          <TouchableOpacity
            className="mt-lg"
            onPress={() => router.push(AUTH_ROUTE.passwordReset)}
          >
            <Text className="text-sm font-medium text-secondary text-center underline">
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
