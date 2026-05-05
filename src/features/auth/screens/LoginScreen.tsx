import { useCheckEmailStatus, useLogin } from "@/src/features/auth/hooks";
import { EMAIL_STATUS, type LoginRequest } from "@/src/features/auth/types";
import { PostFormField } from "@/src/features/post/components";
import { AppButton, AppInlineError } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
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
import { useAppUser, useAuth } from "../providers";

const loginFormSchema = yup
  .object({
    password: yup.string().trim().required("Please enter your password."),
  })
  .required();

type LoginFormSchema = yup.InferType<typeof loginFormSchema>;

const LoginScreen = () => {
  const { user } = useAppUser();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { login, loading, error: loginError, reset } = useLogin();
  const { checkEmailStatus } = useCheckEmailStatus();
  const { refresh } = useAuth();

  const email = Array.isArray(emailParam)
    ? (emailParam[0] ?? "")
    : (emailParam ?? "");

  const {
    control: formControl,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    defaultValues: { password: "" },
    resolver: yupResolver(loginFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const passwordValue = watch("password");
  const hasPassword = passwordValue.trim().length > 0;

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    try {
      const req: LoginRequest = {
        email,
        password: data.password,
      };

      await login(req);

      const emailStatusResponse = await checkEmailStatus({ email });
      const { status } = emailStatusResponse;

      if (status === EMAIL_STATUS.NOT_VERIFIED) {
        router.push({
          pathname: AUTH_ROUTE.verifyEmail,
          params: { email },
        });
        return;
      }

      await refresh();
      
      router.dismissAll();

      toast.success("Welcome back!");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const errorMessage = errors.password?.message || loginError;

  return (
    <KeyboardAvoidingView
      className="w-full flex-1"
      style={{ backgroundColor: "transparent" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-surface px-lg pt-xl">
          <Controller
            control={formControl}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="border rounded-md overflow-hidden">
                <PostFormField
                  value={value}
                  label="Password"
                  onChange={(text) => {
                    if (loginError) {
                      reset();
                    }
                    onChange(text);
                  }}
                  type="password"
                  onBlur={onBlur}
                />
              </View>
            )}
          />

          {/* Error */}
          {errorMessage && <AppInlineError message={errorMessage} />}

          {/* Continue button */}
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
