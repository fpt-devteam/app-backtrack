import { useLogin } from "@/src/features/auth/hooks/useLogin";
import { AppInlineError, EmailField, PasswordField } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants/route.constant";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowRightIcon, GoogleLogoIcon } from "phosphor-react-native";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as yup from "yup";
import type { LoginRequest } from "@/src/features/auth/types";
import { Link, router } from "expo-router";

const loginFormSchema = yup
  .object({
    email: yup.string().trim().email("Invalid email format!").required("Email is required!"),
    password: yup.string().trim().required("Password is required!"),
  })
  .required();

type LoginFormSchema = yup.InferType<typeof loginFormSchema>;

export const LoginForm = () => {
  const { login, loading, error, reset } = useLogin();

  const {
    control: formControl,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginFormSchema>({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(loginFormSchema),
    mode: "onSubmit",
  });

  const handleInputChange = (field: 'email' | 'password') => {
    if (errors[field]) {
      clearErrors(field);
    }
    if (error) {
      reset();
    }
  };

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    try {
      const req: LoginRequest = { email: data.email, password: data.password };
      await login(req);
      router.replace(POST_ROUTE.index);
    } catch {
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-between py-6">
        {/* Form - 40% */}
        <View className="w-full justify-center " style={{ flex: 0.4 }}>
          <View className="w-full max-w-[420px] self-center">
            {/* App Inline Error */}
            {error && <AppInlineError message={error} />}

            {/* Form fields */}
            <View className="gap-6 py-2">
              {/* Email */}
              <View>
                <Controller
                  control={formControl}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <EmailField
                      value={value}
                      onChange={onChange}
                      error={errors.email?.message}
                    />
                  )}
                />
              </View>

              {/* Password */}
              <View>
                <Controller
                  control={formControl}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <PasswordField
                      value={value}
                      onChange={(text) => {
                        handleInputChange('password');
                        onChange(text);
                      }}
                      error={errors.password?.message}
                    />
                  )}
                />
              </View>
            </View>

            {/* Forgot Password */}
            <View className="mb-4 items-end">
              <Link href="/forgot-password" className="text-sm text-primary font-medium">
                Forgot Password?
              </Link>
            </View>

            {/* Submit Button */}
            <View className="mt-2">
              <TouchableOpacity
                className={`flex-row items-center justify-center rounded-lg bg-primary px-4 py-3.5 ${loading ? "opacity-70" : ""}`}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text className="ml-2 font-medium text-base text-white">Signing in...</Text>
                  </View>
                ) : (
                  <>
                    <Text className="mr-2 font-medium text-base text-white">Sign In</Text>
                    <ArrowRightIcon size={18} color="#ffffff" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="mt-5 flex-row items-center">
              <View className="h-px flex-1 bg-slate-200" />
              <Text className="mx-3 text-xs text-slate-500 font-medium">or continue with</Text>
              <View className="h-px flex-1 bg-slate-200" />
            </View>

            {/* Social Login */}
            <View className="mt-4">
              <TouchableOpacity
                className="flex-row items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3"
                disabled={loading}
                activeOpacity={0.8}
              >
                <GoogleLogoIcon size={18} color="#e5453b" />
                <Text className="ml-2 text-slate-700 font-medium">Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
