import { useCheckEmailStatus } from "@/src/features/auth/hooks";
import { useLogin } from "@/src/features/auth/hooks/useLogin";
import { EMAIL_STATUS, type LoginRequest } from "@/src/features/auth/types";
import {
  AppInlineError,
  AppLogo,
  BottomSheet,
  EmailField,
  PasswordField,
} from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants/route.constant";
import { colors } from "@/src/shared/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, RelativePathString, router } from "expo-router";
import {
  ArrowRightIcon,
  EnvelopeSimpleIcon,
  GoogleLogoIcon,
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
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
      .email("Invalid email format!")
      .required("Email is required!"),
    password: yup.string().trim().required("Password is required!"),
  })
  .required();

type LoginFormSchema = yup.InferType<typeof loginFormSchema>;

const RESEND_COOLDOWN = 59;

const LoginScreen = () => {
  const { login, loading, error, reset } = useLogin();
  const { checkEmailStatus } = useCheckEmailStatus();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!sheetVisible) setCountdown(0);
  }, [sheetVisible]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((p) => p - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    setCountdown(RESEND_COOLDOWN);
    // TODO: Call resend verification email API
  };

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

  const handleInputChange = (field: "email" | "password") => {
    if (errors[field]) {
      clearErrors(field);
    }
    if (error) {
      reset();
    }
  };

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    try {
      const emailStatusResponse = await checkEmailStatus({ email: data.email });
      const { status } = emailStatusResponse;

      if (status === EMAIL_STATUS.NOT_VERIFIED) {
        setSheetVisible(true);
        return;
      }

      const req: LoginRequest = { email: data.email, password: data.password };
      await login(req);
    } catch (err) {
      console.log("Login error:", err);
    }
  };

  return (
    <>
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* App Logo */}
            <View className="items-center justify-center py-12 mt-10">
              <AppLogo width={400} height={60} />
            </View>

            {/* Login Form */}
            <View className="w-full px-4">
              <View className="flex-1 justify-between py-6">
                {/* Form - 40% */}
                <View className="w-full justify-center" style={{ flex: 0.4 }}>
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
                              onChange={(text) => {
                                handleInputChange("email");
                                onChange(text);
                              }}
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
                                handleInputChange("password");
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
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary font-medium"
                      >
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
                            <Text className="ml-2 font-medium text-base text-white">
                              Signing in...
                            </Text>
                          </View>
                        ) : (
                          <>
                            <Text className="mr-2 font-medium text-base text-white">
                              Sign In
                            </Text>
                            <ArrowRightIcon size={18} color="#ffffff" />
                          </>
                        )}
                      </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View className="mt-5 flex-row items-center">
                      <View className="h-px flex-1 bg-slate-200" />
                      <Text className="mx-3 text-xs text-slate-500 font-medium">
                        or continue with
                      </Text>
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
                        <Text className="ml-2 text-slate-700 font-medium">
                          Google
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-1" />

            {/* Sign Up Button */}
            <View className="flex-row gap-2 justify-center items-center py-8 mb-4">
              <Text className="text-normal text-base">
                Don&apos;t have an account?
              </Text>
              <Link
                href="/register"
                className="text-base font-display text-primary font-bold"
              >
                Sign Up
              </Link>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* BottomSheet overlay (topmost) */}
      <View
        style={{ position: "absolute", inset: 0, zIndex: 30 }}
        pointerEvents="box-none"
      >
        <BottomSheet
          isVisible={sheetVisible}
          onClose={() => setSheetVisible(false)}
        >
          <View className="items-center py-6 px-12 gap-5">
            {/* Icon */}
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#fef3c7",
              }}
            >
              <EnvelopeSimpleIcon
                weight="fill"
                size={30}
                color={colors.status.warning}
              />
            </View>

            {/* Text */}
            <View className="items-center gap-2">
              <Text
                className="text-xl font-bold text-center"
                style={{ color: colors.text.main }}
              >
                Account exists but not verified
              </Text>
              <Text
                className="text-sm text-center leading-5"
                style={{ color: colors.text.sub }}
              >
                Please verify your email to continue using Backtrack.
              </Text>
            </View>

            {/* Actions */}
            <View className="w-full gap-5">
              <TouchableOpacity
                onPress={handleResend}
                disabled={countdown > 0}
                className={`h-14 items-center justify-center rounded-full bg-primary ${
                  countdown > 0 ? "opacity-60" : ""
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primaryForeground }}
                >
                  Resend Verification Email
                </Text>
              </TouchableOpacity>

              {countdown > 0 && (
                <Text
                  className="text-sm text-center"
                  style={{ color: colors.text.sub }}
                >
                  {`Resend again in 0:${String(countdown).padStart(2, "0")}`}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => setSheetVisible(false)}
                className="h-12 items-center justify-center"
                activeOpacity={0.6}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.text.main }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      </View>
    </>
  );
};

export default LoginScreen;
