import { useAppUser } from "@/src/features/auth/providers";
import { AvatarFormField, FormField } from "@/src/features/profile/components";
import { usePatchProfile } from "@/src/features/profile/hooks";
import type { UpdateProfileRequest } from "@/src/features/profile/types";
import {
  AppHeader,
  AppLoader,
  BackButton,
  TextButton,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { colors } from "@/src/shared/theme";
import { getErrorMessage } from "@/src/shared/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { IdentificationBadgeIcon, PhoneIcon } from "phosphor-react-native";
import React, { useEffect, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

type ProfileEditSchema = {
  displayName: string;
  phone: string;
};

const profileEditSchema = yup
  .object({
    displayName: yup
      .string()
      .trim()
      .min(2, "Display name must contain at least 2 characters.")
      .required("Display name is required."),
    phone: yup
      .string()
      .trim()
      .matches(/^[0-9+()\-\s]{7,20}$/, {
        message: "Phone format is invalid.",
        excludeEmptyString: true,
      })
      .required(),
  })
  .required();

const ProfileEditScreen = () => {
  const { user: profile } = useAppUser();
  const { patchProfile, isPatchingProfile } = usePatchProfile();

  const initialValues = useMemo(
    () => ({
      displayName: profile?.displayName?.trim() ?? "",
      phone: profile?.phone?.trim() ?? "",
      avatar: null,
    }),
    [profile],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<ProfileEditSchema>({
    defaultValues: initialValues,
    resolver: yupResolver(profileEditSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const isSaveDisabled = !isDirty || isPatchingProfile;

  const onSubmit: SubmitHandler<ProfileEditSchema> = async (data) => {
    const payload: UpdateProfileRequest = {};
    if (dirtyFields.displayName) payload.displayName = data.displayName.trim();
    if (dirtyFields.phone) payload.phone = data.phone.trim();
    if (Object.keys(payload).length === 0) return;

    try {
      await patchProfile(payload);
      toast.success("Profile updated", "Your changes were saved.");
      router.back();
    } catch (err) {
      toast.error("Failed to update profile", getErrorMessage(err));
    }
  };

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center">
          <AppLoader size={30} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppHeader
        left={<BackButton />}
        center={
          <Text className="text-lg font-bold text-slate-900">Edit profile</Text>
        }
        right={
          <TextButton
            label="Save"
            onPress={handleSubmit(onSubmit)}
            disabled={isSaveDisabled}
            isSubmitting={isPatchingProfile}
          />
        }
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AvatarFormField />

          <View className="rounded-3xl border border-slate-200 bg-white p-4 gap-4 mx-4 mb-4">
            <Text className="text-sm font-semibold text-slate-800">
              Personal Details
            </Text>

            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, value } }) => (
                <FormField
                  label="Display name"
                  icon={
                    <IdentificationBadgeIcon
                      size={16}
                      color={colors.primary}
                      weight="fill"
                    />
                  }
                  value={value}
                  onChange={onChange}
                  placeholder="Your display name"
                  error={errors.displayName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <FormField
                  label="Phone number"
                  icon={
                    <PhoneIcon size={16} color={colors.primary} weight="fill" />
                  }
                  value={value}
                  onChange={onChange}
                  placeholder="Your phone number"
                  error={errors.phone?.message}
                />
              )}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;
