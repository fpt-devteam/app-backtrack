import { Link, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon, EnvelopeSimpleIcon } from "phosphor-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

const EmailVerifyScreen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow justify-center"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <View className="w-full max-w-[420px] self-center text-center">
            {/* Icon */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                <EnvelopeSimpleIcon size={40} color="#137fec" />
              </View>
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold text-slate-900 mb-4 text-center">
              Check your email
            </Text>

            {/* Message */}
            <Text className="text-base text-slate-600 leading-6 text-center mb-2">
              If an account exists for{" "}
              <Text className="font-medium text-slate-900">{email}</Text>,
              you&apos;ll receive a reset link shortly.
            </Text>

            <Text className="text-sm text-slate-500 text-center mb-8">
              Be sure to check your spam folder if you don&apos;t see it in your
              inbox.
            </Text>

            {/* Back to Login Button */}
            <View className="items-center">
              <Link
                href="/login"
                className="flex-row items-center justify-center rounded-lg bg-primary px-6 py-3.5"
              >
                <ArrowLeftIcon size={18} color="#ffffff" />
                <Text className="ml-2 font-medium text-base text-white">
                  Back to login
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmailVerifyScreen;
