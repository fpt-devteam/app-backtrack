import { LoginForm } from "@/src/features/auth/components";
import { AppLogo } from "@/src/shared/components";
import { Link } from "expo-router";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-center py-12 mt-10">
            <AppLogo width={400} height={60} />
          </View>

          <View className="w-full px-4">
            <LoginForm />
          </View>

          <View className="flex-1" />

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
  );
}