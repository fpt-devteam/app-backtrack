import { useLogin } from "@/src/features/auth/hooks/useLogin";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";
import { LoginRequest } from "../types";

const loginFormSchema = yup
  .object({
    email: yup.string().trim().email("Invalid email format!").required("Email is required!"),
    password: yup.string().trim().required("Password is required!"),
  })
  .required();

type LoginFormSchema = yup.InferType<typeof loginFormSchema>;

export default function LoginForm() {
  const { login, loading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    control: formControl,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(loginFormSchema),
    mode: "onSubmit",
  });

  const feedback = useMemo(() => {
    return localError ?? errors.email?.message ?? errors.password?.message ?? error?.message ?? null;
  }, [localError, errors.email?.message, errors.password?.message, error?.message]);

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    setLocalError(null);
    try {
      const req: LoginRequest = { email: data.email, password: data.password };
      await login(req);
    } catch (err: any) {
      if (err?.message) setLocalError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="h-full px-2"
      >
        {/* Center wrapper */}
        <View className="flex-1">
          {/* Header */}
          <View className="w-full mt-12 mb-12">
            <View className="items-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white border border-slate-100">
                <Image
                  source={require("@/assets/icons/logo.png")}
                  className="h-10 w-10"
                  resizeMode="contain"
                />
              </View>

              <Text className="mt-2 font-display text-4xl text-slate-900">
                Backtrack
              </Text>
              <Text className="mt-0.5 text-center text-slate-500">
                Find what matters. Log in to continue.
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className="mb-12 w-full max-w-[420px] rounded-xl">
            {/* Email */}
            <Text className="mb-2 text-sm text-slate-700">Email</Text>
            <View className="flex-row items-center rounded-lg border border-slate-200 bg-white px-3 py-3">
              <Ionicons name="mail-outline" size={18} color="#70819a" />
              <View className="w-2" />
              <Controller
                control={formControl}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-slate-900"
                    placeholder="user@example.com"
                    placeholderTextColor="#a0a9b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* Password */}
            <Text className="mb-2 mt-4 text-sm text-slate-700">Password</Text>
            <View className="flex-row items-center rounded-lg border border-slate-200 bg-white px-3 py-3">
              <Ionicons name="lock-closed-outline" size={18} color="#70819a" />
              <View className="w-2" />

              <Controller
                control={formControl}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-slate-900"
                    placeholder="***********"
                    placeholderTextColor="#a0a9b8"
                    secureTextEntry={!showPassword}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />

              <TouchableOpacity onPress={() => setShowPassword((p) => !p)} hitSlop={12}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#70819a"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot */}
            <View className="mt-3 items-end">
              <Link href="/forgot-password" className="text-sm text-primary">
                Forgot Password?
              </Link>
            </View>

            {/* Error */}
            {feedback ? (
              <View className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                <Text className="text-sm text-red-600">{feedback}</Text>
              </View>
            ) : null}

            {/* Submit */}
            <TouchableOpacity
              className={`mt-5 flex-row items-center justify-center rounded-lg bg-primary px-4 py-3 ${loading ? "opacity-70" : ""
                }`}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text className="mr-2 font-display text-base text-white">Login</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="mt-6 flex-row items-center">
              <View className="h-px flex-1 bg-slate-200" />
              <Text className="mx-3 text-xs text-slate-500">or continue with</Text>
              <View className="h-px flex-1 bg-slate-200" />
            </View>

            {/* Social */}
            <View className="mt-4">
              <TouchableOpacity
                className="flex-row items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3"
                disabled={loading}
                activeOpacity={0.9}
              >
                <Ionicons name="logo-google" size={18} color="#e5453b" />
                <Text className="ml-2 text-slate-700">Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-6 flex-row justify-center items-center">
            <Text className="text-slate-600">Don&apos;t have an account?</Text>
            <Link href="/register" className="ml-2 font-display text-primary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
