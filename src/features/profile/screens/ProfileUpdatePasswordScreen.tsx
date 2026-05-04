import { PostFormField } from "@/src/features/post/components";
import {
  AppBackButton,
  AppButton,
  AppInlineError,
  AppLoader,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { auth } from "@/src/shared/lib/firebase";
import { colors, metrics, typography } from "@/src/shared/theme";
import { getErrorMessage } from "@/src/shared/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, Stack } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { CheckCircleIcon, CircleIcon, LockIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextStyle,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";

const passwordSchema = yup
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters!")
  .matches(/\d/, "Password must contain at least 1 number!")
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least 1 special character!",
  )
  .required("Password is required!");

const updatePasswordFormSchema = yup
  .object({
    currentPassword: yup
      .string()
      .trim()
      .required("Current password is required."),
    newPassword: passwordSchema.test(
      "different-from-current",
      "New password must be different from your current password.",
      function validateNewPassword(value) {
        if (!value) return true;
        return value !== this.parent.currentPassword;
      },
    ),
  })
  .required();

type UpdatePasswordFormSchema = yup.InferType<typeof updatePasswordFormSchema>;

const passwordChecklist = [
  {
    id: "minLength",
    label: "Minimum 8 characters",
    test: (v: string) => v.length >= 8,
  },
  {
    id: "hasNumber",
    label: "At least one number",
    test: (v: string) => /\d/.test(v),
  },
  {
    id: "hasSpecial",
    label: "At least one special character",
    test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
  },
];

const ProfileUpdatePasswordScreen = () => {
  const insets = useSafeAreaInsets();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormSchema>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    resolver: yupResolver(updatePasswordFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const currentPasswordValue = watch("currentPassword");
  const newPasswordValue = watch("newPassword");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormReady = useMemo(() => {
    return (
      currentPasswordValue.trim().length > 0 &&
      newPasswordValue.trim().length > 0 &&
      !isSubmitting
    );
  }, [currentPasswordValue, isSubmitting, newPasswordValue]);

  const onSubmit: SubmitHandler<UpdatePasswordFormSchema> = async (data) => {
    const user = auth.currentUser;

    if (!user || !user.email) {
      toast.error(
        "Unable to update password",
        "Please log in again and try once more.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword,
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.newPassword);

      reset();
      toast.success("Password updated", "Your new password has been saved.");

      setTimeout(() => {
        router.back();
      }, 400);
    } catch (error) {
      const message = getErrorMessage(error);
      setSubmitError(message);
      toast.error("Failed to update password", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!auth.currentUser) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Update Password",
            headerLeft: () => (
              <AppBackButton type="arrowLeftIcon" showBackground={false} />
            ),
            headerTitleStyle: {
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight
                .normal as TextStyle["fontWeight"],
            },
          }}
        />
        <View className="flex-1 bg-surface items-center justify-center">
          <AppLoader />
        </View>
      </>
    );
  }

  const errorMessage =
    errors.currentPassword?.message ||
    errors.newPassword?.message ||
    submitError;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Update Password",
          headerLeft: () => (
            <AppBackButton type="arrowLeftIcon" showBackground={false} />
          ),
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <KeyboardAvoidingView
        className="flex-1 bg-surface"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={metrics.tabBar.height}
      >
        <ScrollView
          className="flex-1 bg-surface"
          contentContainerClassName="p-lg gap-lg"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View className="gap-xs">
            <Text className="text-xl font-normal text-textPrimary">
              Change your password
            </Text>
            <Text className="text-sm font-thin text-textSecondary leading-5">
              Enter your current password, then choose a new one that meets the
              security requirements below.
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-xs">
            <View className="gap-xs border rounded-md overflow-hidden">
              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PostFormField
                    value={value}
                    label="Password"
                    onChange={(text) => {
                      if (submitError) setSubmitError(null);
                      onChange(text);
                    }}
                    type="password"
                    onBlur={onBlur}
                  />
                )}
              />

              <View className="border-t" />

              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PostFormField
                    value={value}
                    label="New Password"
                    onChange={(text) => {
                      if (submitError) setSubmitError(null);
                      onChange(text);
                    }}
                    type="password"
                    onBlur={onBlur}
                  />
                )}
              />
            </View>

            {/* Error */}
            {errorMessage && <AppInlineError message={errorMessage} />}
          </View>

          {/* Password Requirements */}
          <View className="gap-sm">
            {passwordChecklist.map((check) => {
              const met = check.test(newPasswordValue || "");

              return (
                <View key={check.id} className="flex-row items-center gap-xs">
                  {met ? (
                    <CheckCircleIcon
                      weight="fill"
                      size={18}
                      color={colors.status.success}
                    />
                  ) : (
                    <CircleIcon size={18} color={colors.hof[300]} />
                  )}
                  <Text
                    style={{
                      color: met
                        ? colors.status.success
                        : colors.text.secondary,
                      fontSize: typography.fontSize.sm,
                      lineHeight: typography.lineHeight.sm,
                      fontWeight: "400",
                    }}
                  >
                    {check.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Info */}
          <View className="flex-row gap-xs">
            <LockIcon size={12} weight="fill" color={colors.text.muted} />
            <Text className="font-thin text-xs text-textSecondary">
              Your credentials are verified with Firebase before the password is
              updated.
            </Text>
          </View>
        </ScrollView>

        <View
          className="border-t border-divider bg-surface px-lg pt-md"
          style={{ paddingBottom: insets.bottom + metrics.spacing.sm }}
        >
          <AppButton
            title="Update Password"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={!isFormReady}
            variant="secondary"
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default ProfileUpdatePasswordScreen;
