import { useCheckEmailStatus, useSync } from "@/src/features/auth/hooks";
import { useAuth } from "@/src/features/auth/providers";
import { EMAIL_STATUS } from "@/src/features/auth/types";
import {
  AppButton,
  AppLogo,
  BaseInputField,
  TouchableIconButton,
} from "@/src/shared/components";
import { AppGoogleLogo } from "@/src/shared/components/AppGoogleLogo";
import { toast } from "@/src/shared/components/ui/toast";
import { AUTH_ROUTE } from "@/src/shared/constants";
import { auth } from "@/src/shared/lib";
import { getErrorMessage } from "@/src/shared/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from "firebase/auth";
import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as yup from "yup";

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

type GoogleSigninModule = typeof import("@react-native-google-signin/google-signin");

let googleSigninModule: GoogleSigninModule | null = null;

try {
  // Expo Go does not include the native Google Sign-In module.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  googleSigninModule = require("@react-native-google-signin/google-signin") as GoogleSigninModule;

  if (GOOGLE_WEB_CLIENT_ID) {
    googleSigninModule.GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }
} catch {
  googleSigninModule = null;
}

const loginFormSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .required("Please enter a valid email address."),
  })
  .required();

type LoginFormSchema = yup.InferType<typeof loginFormSchema>;

const OnboardingScreen = () => {
  const { checkEmailStatus, loading } = useCheckEmailStatus();
  const { checkEmailStatus: checkGoogleEmailStatus } = useCheckEmailStatus();
  const { syncUser } = useSync();
  const { refresh } = useAuth();
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);

  const {
    control: formControl,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    defaultValues: { email: "" },
    resolver: yupResolver(loginFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const emailValue = watch("email");
  const hasEmail = emailValue.trim().length > 0;

  const handleLoginGoogle = async () => {
    if (!googleSigninModule) {
      toast.error(
        "Not available in Expo Go",
        "Google Sign-In requires a development build.",
      );
      return;
    }

    if (!GOOGLE_WEB_CLIENT_ID) {
      toast.error(
        "Google login unavailable",
        "Google Sign-In is not configured for this build.",
      );
      return;
    }

    const {
      GoogleSignin,
      isCancelledResponse,
      isErrorWithCode,
      isSuccessResponse,
      statusCodes,
    } = googleSigninModule;

    setIsGoogleLoginLoading(true);
    let shouldCleanupSession = false;

    try {
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      const googleResponse = await GoogleSignin.signIn();

      if (isCancelledResponse(googleResponse)) {
        return;
      }

      if (!isSuccessResponse(googleResponse) || !googleResponse.data.idToken) {
        throw new Error("Google Sign-In did not return a valid identity token.");
      }

      const googleCredential = GoogleAuthProvider.credential(
        googleResponse.data.idToken,
      );
      const userCredential = await signInWithCredential(auth, googleCredential);
      shouldCleanupSession = true;

      const email =
        userCredential.user.email?.trim() ??
        googleResponse.data.user.email?.trim() ??
        "";

      if (!email) {
        throw new Error("Google account did not provide an email address.");
      }

      let emailStatusResponse = await checkGoogleEmailStatus({ email });

      if (emailStatusResponse.status !== EMAIL_STATUS.VERIFIED) {
        const idToken = await userCredential.user.getIdToken(true);

        if (!idToken) {
          throw new Error("Failed to generate authentication token.");
        }

        await syncUser({ idToken });
        emailStatusResponse = await checkGoogleEmailStatus({ email });
      }

      if (emailStatusResponse.status !== EMAIL_STATUS.VERIFIED) {
        throw new Error(
          "Google sign-in could not finish account setup. Please try again.",
        );
      }

      await refresh();
      toast.success("Welcome to Backtrack");
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === statusCodes.SIGN_IN_CANCELLED
      ) {
        return;
      }

      if (shouldCleanupSession) {
        await Promise.allSettled([
          firebaseSignOut(auth),
          GoogleSignin.signOut(),
        ]);
      }

      toast.error("Google login failed", getErrorMessage(error));
    } finally {
      setIsGoogleLoginLoading(false);
    }
  };

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    try {
      const emailStatusResponse = await checkEmailStatus({ email: data.email });
      const { status } = emailStatusResponse;

      if (status === EMAIL_STATUS.NOT_FOUND) {
        router.push({
          pathname: AUTH_ROUTE.register,
          params: { email: data.email },
        });
        return;
      }

      router.push({
        pathname: AUTH_ROUTE.login,
        params: { email: data.email },
      });
    } catch (err) {
      console.log("Check email status error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 bg-surface px-lg items-center justify-center">
            {/* Group Header (Logo) */}
            <View className="items-center gap-6 mb-10">
              <AppLogo height={40} />

              <Text className="text-2xl text-textPrimary font-normal text-center">
                Login or sign up
              </Text>
            </View>

            {/* Group Content (Form + Social) */}
            <View className="w-full">
              {/* Email Form */}
              <View className="w-full">
                <Controller
                  control={formControl}
                  name="email"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <BaseInputField
                      label="Email"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />

                <AppButton
                  title="Continue"
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  disabled={!hasEmail}
                  className="mt-md"
                />
              </View>

              {/* Divider */}
              <View className="flex-row items-center my-lg gap-md2">
                <View className="flex-1 h-px bg-divider" />
                <Text className="text-xs text-textMuted font-medium">or</Text>
                <View className="flex-1 h-px bg-divider" />
              </View>

              {/* Social Buttons */}
              <View className="gap-md2 flex-row justify-center">
                  <TouchableIconButton
                    icon={
                      <View className="p-md items-center justify-center rounded-sm bg-surface border border-border">
                        <AppGoogleLogo />
                      </View>
                    }
                    onPress={handleLoginGoogle}
                    disabled={loading}
                    loading={isGoogleLoginLoading}
                  />
                </View>
              </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OnboardingScreen;
