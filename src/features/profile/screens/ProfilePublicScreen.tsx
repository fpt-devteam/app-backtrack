import { useGetPublicProfile } from "@/src/features/profile/hooks";
import { AppUserAvatar } from "@/src/shared/components";
import { colors, typography } from "@/src/shared/theme";
import { Stack } from "expo-router";
import { EnvelopeIcon, IconProps, PhoneIcon } from "phosphor-react-native";
import React, { ComponentType } from "react";
import { ScrollView, Text, TextStyle, View } from "react-native";

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

type ProfilePublicScreenProps = {
  userId: string;
};

const ProfilePublicScreen = ({ userId }: ProfilePublicScreenProps) => {
  const { profile } = useGetPublicProfile(userId);
  const displayName = profile?.displayName?.trim() || profile?.email || "User";

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Host Information",
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
          <AppUserAvatar size={80} avatarUrl={profile?.avatarUrl} />
          <Text className="text-lg font-semibold text-textPrimary">
            {displayName}
          </Text>
          {profile?.email ? (
            <Text className="text-sm text-textSecondary">{profile.email}</Text>
          ) : null}
        </View>

        {/* Info Rows */}
        <View className="mt-lg">
          <InfoRow
            icon={EnvelopeIcon}
            value={profile?.email ?? "Not provided"}
          />
          <InfoRow icon={PhoneIcon} value={profile?.phone ?? "Not provided"} />
        </View>
      </ScrollView>
    </>
  );
};

export default ProfilePublicScreen;
