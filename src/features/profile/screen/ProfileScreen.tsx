import { useAppUser } from "@/src/features/auth/providers";
import { useGetAllMyPost } from "@/src/features/post/hooks";
import {
  AppHeader,
  AppUserAvatar,
  TouchableIconButton,
} from "@/src/shared/components";
import { PROFILE_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import {
  GearIcon,
  ListIcon,
  PackageIcon,
  PencilSimpleIcon,
  QrCodeIcon,
} from "phosphor-react-native";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAppUser();
  const { data } = useGetAllMyPost();

  const displayName = useMemo(
    () => user?.displayName?.trim() || user?.email || "User",
    [user?.displayName, user?.email],
  );

  const avatarSource = useMemo(() => {
    return user?.avatarUrl;
  }, [user?.avatarUrl]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ProfileScreenHeader />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingBottom: 2 * insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-3">
          <View className="flex-col items-center gap-4">
            <AppUserAvatar size={128} avatarUrl={avatarSource} />

            <View className="flex-1 gap-2">
              <Text className="text-[30px] leading-[34px] font-extrabold text-slate-900">
                {displayName}
              </Text>
            </View>
          </View>

          <View className="mt-5 flex-row items-center justify-around border-b border-slate-200 pb-3">
            <PackageIcon size={28} />
            <QrCodeIcon size={28} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ProfileScreenHeader = () => {
  const handleNavigateSettingScreen = () => {
    router.push(PROFILE_ROUTE.setting);
  };

  const handleNavigateEditProfileScreen = () => {
    router.push(PROFILE_ROUTE.edit);
  };

  const handleNavigateMenuTabScreen = () => {
    router.push(PROFILE_ROUTE.menuTab);
  };

  return (
    <AppHeader
      left={
        <TouchableIconButton
          onPress={handleNavigateMenuTabScreen}
          icon={<ListIcon size={28} color={colors.black} />}
        />
      }
      center={
        <Text className="text-lg font-extrabold text-slate-900">Profile</Text>
      }
      right={
        <View className="flex-row gap-4">
          <TouchableIconButton
            onPress={handleNavigateEditProfileScreen}
            icon={<PencilSimpleIcon size={28} color={colors.black} />}
          />

          <TouchableIconButton
            onPress={handleNavigateSettingScreen}
            icon={<GearIcon size={28} color={colors.black} />}
          />
        </View>
      }
    />
  );
};
