import { socketChatService } from "@/src/features/chat/services";
import { useUnregisterDeviceMutation } from "@/src/features/notification/hooks";
import { AppHeader, BackButton } from "@/src/shared/components";
import { PROFILE_ROUTE } from "@/src/shared/constants";
import { auth } from "@/src/shared/lib/firebase";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  BellIcon,
  CaretRightIcon,
  GlobeIcon,
  InfoIcon,
  LockKeyIcon,
  QuestionIcon,
  SignOutIcon,
  UserIcon,
} from "phosphor-react-native";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuRowProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly icon: React.ReactNode;
  readonly iconBg: string;
  readonly onPress: () => void;
  readonly isLast?: boolean;
};

const MenuRow = ({
  title,
  subtitle,
  icon,
  iconBg,
  onPress,
  isLast,
}: MenuRowProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <View>
      <Pressable
        onPress={handlePress}
        className="flex-row items-center gap-4 px-4 py-4 active:bg-slate-50"
      >
        <View
          className="w-9 h-9 rounded-lg items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </View>

        <View className="flex-1">
          <Text className="text-sm font-medium text-slate-800">{title}</Text>
          {Boolean(subtitle) && (
            <Text className="text-xs text-slate-500 mt-0.5">{subtitle}</Text>
          )}
        </View>

        <CaretRightIcon size={14} color={colors.slate[400]} weight="bold" />
      </Pressable>
      {!isLast && <View className="h-[0.5px] bg-slate-100 ml-16" />}
    </View>
  );
};

const ProfileSettingScreen = () => {
  const router = useRouter();
  const { mutateAsync: unregisterDevice } = useUnregisterDeviceMutation();

  const handleLogout = () => {
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
            } catch (error) {
              console.error("Logout failed", error);
            }
          })();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <AppHeader
        left={<BackButton />}
        center={
          <Text className="text-base font-bold text-slate-900">
            Settings & Privacy
          </Text>
        }
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-16">
          {/* Group 1: Account */}
          <Text className="mt-8 mb-2 ml-1 text-xs font-bold text-slate-400 uppercase tracking-[1px]">
            Account Settings
          </Text>
          <View className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <MenuRow
              title="Personal Information"
              subtitle="Update your name and contact info"
              icon={<UserIcon size={18} color={colors.white} weight="fill" />}
              iconBg={colors.blue[500]}
              onPress={() => router.push(PROFILE_ROUTE.edit)}
            />
            <MenuRow
              title="Password & Security"
              icon={
                <LockKeyIcon size={18} color={colors.white} weight="fill" />
              }
              iconBg={colors.status.success}
              isLast
              onPress={() => {}}
            />
          </View>

          {/* Group 2: Preferences */}
          <Text className="mt-8 mb-2 ml-1 text-xs font-bold text-slate-400 uppercase tracking-[1px]">
            Preferences
          </Text>
          <View className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <MenuRow
              title="Notifications"
              icon={<BellIcon size={18} color={colors.white} weight="fill" />}
              iconBg={colors.red[500]}
              onPress={() => {}}
            />
            <MenuRow
              title="App Language"
              icon={<GlobeIcon size={18} color={colors.white} weight="fill" />}
              iconBg={colors.sky[600]}
              isLast
              onPress={() => {}}
            />
          </View>

          {/* Group 3: Support */}
          <View className="mt-8 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <MenuRow
              title="Help & Support"
              icon={
                <QuestionIcon size={18} color={colors.white} weight="fill" />
              }
              iconBg={colors.status.warning}
              onPress={() => {}}
            />
            <MenuRow
              title="About"
              icon={<InfoIcon size={18} color={colors.white} weight="fill" />}
              iconBg={colors.slate[500]}
              isLast
              onPress={() => {}}
            />
          </View>

          {/* Log Out */}
          <Pressable
            onPress={handleLogout}
            className="mt-8 h-14 rounded-2xl border border-red-200 bg-red-50 flex-row items-center justify-center gap-2 active:opacity-85"
          >
            <SignOutIcon size={18} color={colors.red[600]} weight="bold" />
            <Text className="text-base " style={{ color: colors.red[600] }}>
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSettingScreen;
