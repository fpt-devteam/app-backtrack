import { useAppUser, useAuth } from "@/src/features/auth/providers";
import { socketChatService } from "@/src/features/chat/services";
import { useUnregisterDeviceMutation } from "@/src/features/notification/hooks";
import { AppUserAvatar } from "@/src/shared/components";
import { AUTH_ROUTE, PROFILE_ROUTE, QR_ROUTE } from "@/src/shared/constants";
import { auth } from "@/src/shared/lib/firebase";
import { colors } from "@/src/shared/theme";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import {
  CaretRightIcon,
  HandIcon,
  LockIcon,
  PackageIcon,
  QrCodeIcon,
  QuestionIcon,
  SignOutIcon,
  UserCircleIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import type { IconProps } from "phosphor-react-native";
import type { ComponentType } from "react";
import type { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Shared Styles ───────────────────────────────────────────────

const CARD_SHADOW: ViewStyle = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
};

// ─── Sub-components ──────────────────────────────────────────────

type MenuRowProps = {
  icon: ComponentType<IconProps>;
  label: string;
  onPress: () => void;
};

const MenuRow = ({ icon: Icon, label, onPress }: MenuRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.5}
    className="flex-row items-center gap-md py-md"
  >
    <Icon size={24} color={colors.black} />
    <Text className="flex-1 text-base font-thin text-textPrimary">{label}</Text>
    <CaretRightIcon size={16} color={colors.slate[400]} weight="bold" />
  </TouchableOpacity>
);

type FeatureCardProps = {
  icon: ComponentType<IconProps>;
  label: string;
  onPress: () => void;
};

const FeatureCard = ({ icon: Icon, label, onPress }: FeatureCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-1 bg-surface items-center gap-sm p-md rounded-xl border border-divider justify-between"
    style={CARD_SHADOW}
  >
    <Icon size={80} color={colors.secondary} weight="thin" />
    <Text className="text-normal font-normal text-textPrimary">{label}</Text>
  </TouchableOpacity>
);

const GuestView = () => {
  const layout = useWindowDimensions();

  return (
    <View
      className="flex-1 bg-surface px-10 gap-10 pt-20"
      style={{ paddingTop: layout.height * 0.15 }}
    >
      <View className="flex-row justify-center">
        <UserCircleIcon size={128} color={colors.primary} />
      </View>

      <View className="gap-y-2">
        <Text className="text-xl font-normal text-textPrimary text-center">
          Log in to view your profile
        </Text>

        <Text className="text-base font-thin text-textSecondary text-center leading-6">
          Once you log in, you will find all your conversations here.
        </Text>
      </View>

      <TouchableOpacity
        className="w-full py-5 rounded-sm bg-primary items-center justify-center"
        onPress={() => router.push(AUTH_ROUTE.onboarding)}
        activeOpacity={0.8}
      >
        <Text className="text-base font-normal text-white text-center">
          Log in or Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export function ProfileScreen() {
  const layout = useWindowDimensions();
  const { user } = useAppUser();
  const { isAppReady, isLoggedIn } = useAuth();
  const { mutateAsync: unregisterDevice } = useUnregisterDeviceMutation();

  const isAuthReady = isAppReady && isLoggedIn;

  const displayName = useMemo(
    () => user?.displayName?.trim() || user?.email || "User",
    [user?.displayName, user?.email],
  );

  const handleShowProfile = useCallback(() => {
    router.push(PROFILE_ROUTE.detail);
  }, []);

  const handleUserPosts = useCallback(() => {
    router.push(PROFILE_ROUTE.userPosts);
  }, []);

  const handleUserQR = useCallback(() => {
    router.push(QR_ROUTE.index);
    // TODO: Navigate to user QR screen
  }, []);

  const handleGetHelp = useCallback(() => {
    // TODO: Navigate to help / support screen
  }, []);

  const handlePrivacy = useCallback(() => {
    // TODO: Navigate to privacy screen
  }, []);

  const handleUpdatePassword = useCallback(() => {
    router.push(PROFILE_ROUTE.password);
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          void (async () => {
            try {
              await socketChatService.disconnect();
              await unregisterDevice();
              await signOut(auth);
              router.push(AUTH_ROUTE.onboarding);
            } catch (error) {
              console.error("Logout failed", error);
            }
          })();
        },
      },
    ]);
  }, [unregisterDevice]);

  if (!isAuthReady) return <GuestView />;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1 bg-surface"
        contentContainerClassName="px-lg pt-md pb-xl"
        contentContainerStyle={{ paddingBottom: layout.height * 0.1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="pt-lg pb-lg">
          <Text className="text-3xl font-normal text-textPrimary">Profile</Text>
        </View>

        {/* Profile Card */}
        <TouchableOpacity
          onPress={handleShowProfile}
          className="bg-surface items-center gap-sm py-xl rounded-xl border border-divider"
          style={CARD_SHADOW}
        >
          <AppUserAvatar size={80} avatarUrl={user?.avatarUrl} />
          <Text className="text-lg font-semibold text-textPrimary">
            {displayName}
          </Text>
          {user?.email ? (
            <Text className="text-sm text-textSecondary">{user.email}</Text>
          ) : null}
        </TouchableOpacity>

        {/* Feature Cards */}
        <View className="flex-row gap-md mt-xl">
          <FeatureCard
            icon={PackageIcon}
            label="Your Posts"
            onPress={handleUserPosts}
          />
          <FeatureCard
            icon={QrCodeIcon}
            label="Your QR"
            onPress={handleUserQR}
          />
        </View>

        {/* Menu Actions */}
        <View className="mt-xl">
          <MenuRow
            icon={LockIcon}
            label="Change Password"
            onPress={handleUpdatePassword}
          />

          <MenuRow icon={HandIcon} label="Privacy" onPress={handlePrivacy} />

          <MenuRow
            icon={QuestionIcon}
            label=" Help & Support"
            onPress={handleGetHelp}
          />
        </View>

        {/* Log Out */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.5}
          className="flex-row items-center gap-md mt-md"
        >
          <SignOutIcon size={24} color={colors.red[600]} />
          <Text
            className="text-base font-thin"
            style={{ color: colors.red[600] }}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
