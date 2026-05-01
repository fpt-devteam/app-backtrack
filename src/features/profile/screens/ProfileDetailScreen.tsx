import { useAppUser } from "@/src/features/auth/providers";
import { AppBackButton, AppUserAvatar } from "@/src/shared/components";
import { PROFILE_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme/colors";
import { typography } from "@/src/shared/theme/typography";
import { router, Stack } from "expo-router";
import { EnvelopeIcon, IconProps, PhoneIcon } from "phosphor-react-native";
import React, { ComponentType, useCallback } from "react";
import { Pressable, ScrollView, Text, TextStyle, View } from "react-native";

type Props = {
  icon: ComponentType<IconProps>;
  value: string;
};

const InfoRow = ({ icon: Icon, value }: Props) => (
  <View className="flex-row items-center gap-md py-md">
    <Icon size={24} color={colors.black} />
    <Text className="flex-1 text-base font-thin text-textPrimary">{value}</Text>
  </View>
);

const ProfileDetailScreen = () => {
  const { user, refetch } = useAppUser();

  const displayName = user?.displayName?.trim() || user?.email || "User";

  const handleEditProfile = useCallback(() => {
    router.push(PROFILE_ROUTE.edit);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Profile Details",
          headerLeft: () => (
            <AppBackButton type={"arrowLeftIcon"} showBackground={false} />
          ),
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              className="bg-canvas rounded-full px-md py-sm"
              onPress={handleEditProfile}
            >
              <Text className="text-sm font-normal py-xs">Edit</Text>
            </Pressable>
          ),
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />
      <ScrollView
        className="flex-1 bg-surface"
        contentContainerClassName="px-lg pt-xl pb-xl"
      >
        {/* Profile Card */}
        <View
          className="bg-surface items-center gap-sm py-xl rounded-xl border border-divider"
          style={{
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
        >
          <AppUserAvatar size={80} avatarUrl={user?.avatarUrl} />
          <Text className="text-lg font-semibold text-textPrimary">
            {displayName}
          </Text>
          {user?.email ? (
            <Text className="text-sm text-textSecondary">{user.email}</Text>
          ) : null}
        </View>

        {/* Info Rows */}
        <View className="mt-lg">
          <InfoRow icon={EnvelopeIcon} value={user?.email ?? "Not provided"} />
          <InfoRow icon={PhoneIcon} value={user?.phone ?? "Not provided"} />
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileDetailScreen;
