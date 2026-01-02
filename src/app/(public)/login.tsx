import { LoginForm } from "@/src/features/auth/components";
import { BrandHeader } from "@/src/shared/components";
import { Link } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

export default function LoginScreen() {
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
        {/* Brand */}
        <View className="w-full p-8">
          <BrandHeader />
        </View>

        {/* Form Card */}
        <View className="w-full">
          <LoginForm />
        </View>

        <View className="flex-1" />

        {/* Footer */}
        <View className="flex-row gap-2 justify-center items-center">
          <Text className="text-normal text-base">Don&apos;t have an account?</Text>
          <Link href="/register" className="text-base font-display text-primary">
            Sign Up
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
