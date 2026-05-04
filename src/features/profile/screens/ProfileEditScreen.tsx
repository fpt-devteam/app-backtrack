import { useAppUser } from "@/src/features/auth/providers";
import { AvatarFormField } from "@/src/features/profile/components";
import { usePatchProfile } from "@/src/features/profile/hooks";
import type { UpdateProfileRequest } from "@/src/features/profile/types";
import { AppBackButton, AppButton, AppLoader } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { metrics, typography } from "@/src/shared/theme";
import { getErrorMessage } from "@/src/shared/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, Stack } from "expo-router";
import React, { useEffect, useMemo } from "react";
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
import { PostFormField } from "../../post/components";

type ProfileEditSchema = {
  displayName: string;
  phone: string;
  showEmail: boolean;
  showPhone: boolean;
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
    showEmail: yup.boolean().required(),
    showPhone: yup.boolean().required(),
  })
  .required();

const ProfileEditScreen = () => {
  const { user: profile, refetch } = useAppUser();
  const { patchProfile, isPatchingProfile } = usePatchProfile();
  const insets = useSafeAreaInsets();
  const initialValues = useMemo(
    () => ({
      displayName: profile?.displayName?.trim() ?? "",
      phone: profile?.phone?.trim() ?? "",
      showEmail: profile?.showEmail ?? false,
      showPhone: profile?.showPhone ?? false,
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
    if (dirtyFields.showEmail) payload.showEmail = data.showEmail;
    if (dirtyFields.showPhone) payload.showPhone = data.showPhone;

    if (Object.keys(payload).length === 0) return;

    try {
      await patchProfile(payload);
      toast.success("Profile updated", "Your changes were saved.");
      refetch();

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      toast.error("Failed to update profile", getErrorMessage(err));
    }
  };

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () => <AppBackButton />,
          }}
        />
        <View className="flex-1 bg-surface items-center justify-center">
          <AppLoader />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Profile",

          headerRight: () => (
            <AppBackButton type="xIcon" showBackground={true} />
          ),
          headerLeft: () => null,
          headerShadowVisible: true,
          headerTitleStyle: {
            fontSize: typography.fontSize.base,
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
          className="flex-1"
          contentContainerClassName="px-md"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <AvatarFormField />

          <View className="px-sm mb-lg gap-xs mt-md">
            <Text className="text-xl font-normal text-textPrimary">
              Personal Information
            </Text>
            <Text className="text-sm font-thin text-textSecondary leading-5">
              These details will be shared with others when you connect over a
              lost or found item. Make sure they are accurate.
            </Text>
          </View>

          <View className="border rounded-md overflow-hidden">
            {/* Display Name Field */}
            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, value } }) => (
                <PostFormField
                  label="Display name"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <View className="border-t" />

            {/* Phone Field */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <PostFormField
                  label="Phone number"
                  value={value}
                  onChange={onChange}
                  type="phone-pad"
                />
              )}
            />
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View
          className="border-t border-divider bg-surface px-md pt-md"
          style={{ paddingBottom: insets.bottom }}
        >
          <AppButton
            title="Save Changes"
            variant="secondary"
            onPress={handleSubmit(onSubmit)}
            loading={isPatchingProfile}
            disabled={isSaveDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default ProfileEditScreen;
