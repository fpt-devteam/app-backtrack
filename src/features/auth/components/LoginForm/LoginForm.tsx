import { useLogin } from "@/src/features/auth/hooks/useLogin";
import type { LoginRequest } from "@/src/features/auth/types/auth.type";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { styles } from "./styles";

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

  const { control: formControl, handleSubmit, formState: { errors } } = useForm<LoginFormSchema>({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(loginFormSchema),
    mode: "onSubmit",
  });

  const feedback = useMemo(
    () => {
      return localError ?? errors.email?.message ?? errors.password?.message ?? error ?? null
    },
    [localError, errors.email?.message, errors.password?.message, error]
  );

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    setLocalError(null);
    try {
      const req: LoginRequest = { email: data.email.trim(), password: data.password };
      await login(req);
    } catch (err: any) {
      if (err?.message) setLocalError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.hero}>
            <View style={styles.logoWrap}>
              <Image source={require("@/assets/icons/logo.png")} style={styles.logo} />
            </View>
            <Text style={styles.title}>BackTrack</Text>
            <Text style={styles.subtitle}>Find what matters. Please login to continue.</Text>
          </View>

          {/* Email Input */}
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Controller
                control={formControl}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
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
              <Ionicons name="mail-outline" size={20} color="#70819a" />
            </View>

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Controller
                control={formControl}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
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

            <View style={styles.linkRow}>
              <Link href="/forgot-password" style={styles.linkText}>
                Forgot Password?
              </Link>
            </View>

            {feedback ? <Text style={styles.errorText}>{feedback}</Text> : null}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Login</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} disabled={loading}>
                <MaterialIcons name="sms" size={18} color="#1f2d3d" />
                <Text style={styles.socialText}>SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} disabled={loading}>
                <Ionicons name="logo-google" size={18} color="#e5453b" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href="/register" style={styles.signUpText}>
            Sign Up
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
