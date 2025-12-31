import { useLogin } from "@/src/features/auth/hooks/useLogin";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import React, { useState } from "react";
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
  const { login, loading, error, reset } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

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
    } catch {
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
      >
        <View className="flex-1 justify-between py-6">
          {/* Header - 40% */}
          <View className="justify-end items-center " style={{ flex: 0.4 }}>
            <View className="items-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white border border-slate-100">
                <Image
                  source={require("@/assets/icons/logo.png")}
                  className="h-10 w-10"
                  resizeMode="contain"
                />
              </View>

              <Text className="mt-4 font-display text-4xl text-slate-900">
                Backtrack
              </Text>
              <Text className="mt-2 text-center text-slate-500 text-base">
                Find what matters. Log in to continue.
              </Text>
            </View>
          </View>

          {/* Form - 40% */}
          <View className="w-full justify-center " style={{ flex: 0.4 }}>
            <View className="w-full max-w-[420px] self-center">
              {/* Global Error Banner */}
              {error ? (
                <View className="mb-4 rounded-lg bg-red-50 px-4 py-3 flex-row items-start">
                  <Ionicons name="alert-circle" size={20} color="#dc2626" style={{ marginTop: 1 }} />
                  <View className="flex-1 ml-3">
                    <Text className="text-sm font-medium text-red-900">Authentication Error</Text>
                    <Text className="text-sm text-red-700 mt-0.5">{error}</Text>
                  </View>
                </View>
              ) : null}

              {/* Email */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-slate-700">Email</Text>
                <View
                  className={`flex-row items-center rounded-lg border bg-white px-3 py-3 ${
                    errors.email ? "border-red-300 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={errors.email ? "#dc2626" : "#70819a"}
                  />
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
                        onChangeText={(text) => {
                          handleInputChange('email');
                          onChange(text);
                        }}
                      />
                    )}
                  />
                  {errors.email && (
                    <Ionicons name="close-circle" size={18} color="#dc2626" />
                  )}
                </View>
                {errors.email && (
                  <View className="flex-row items-center mt-1.5 px-1">
                    <Text className="text-xs text-red-600">{errors.email.message}</Text>
                  </View>
                )}
              </View>

              {/* Password */}
              <View className="mb-3">
                <Text className="mb-2 text-sm font-medium text-slate-700">Password</Text>
                <View
                  className={`flex-row items-center rounded-lg border bg-white px-3 py-3 ${
                    errors.password ? "border-red-300 bg-red-50" : "border-slate-200"
                  }`}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={errors.password ? "#dc2626" : "#70819a"}
                  />
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
                        onChangeText={(text) => {
                          handleInputChange('password');
                          onChange(text);
                        }}
                      />
                    )}
                  />

                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)} hitSlop={12}>
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={errors.password ? "#dc2626" : "#70819a"}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <View className="flex-row items-center mt-1.5 px-1">
                    <Text className="text-xs text-red-600">{errors.password.message}</Text>
                  </View>
                )}
              </View>

              {/* Forgot */}
              <View className="mb-4 items-end">
                <Link href="/forgot-password" className="text-sm text-primary font-medium">
                  Forgot Password?
                </Link>
              </View>

              {/* Submit */}
              <TouchableOpacity
                className={`flex-row items-center justify-center rounded-lg bg-primary px-4 py-3.5 ${
                  loading ? "opacity-70" : ""
                }`}
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
                    <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="mt-5 flex-row items-center">
                <View className="h-px flex-1 bg-slate-200" />
                <Text className="mx-3 text-xs text-slate-500 font-medium">or continue with</Text>
                <View className="h-px flex-1 bg-slate-200" />
              </View>

              {/* Social */}
              <View className="mt-4">
                <TouchableOpacity
                  className="flex-row items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3"
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-google" size={18} color="#e5453b" />
                  <Text className="ml-2 text-slate-700 font-medium">Google</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer - 20% */}
          <View className="justify-center items-center" style={{ flex: 0.2 }}>
            <View className="flex-row justify-center items-center">
              <Text className="text-slate-600">Don&apos;t have an account?</Text>
              <Link href="/register" className="ml-2 font-display text-primary">
                Sign Up
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
