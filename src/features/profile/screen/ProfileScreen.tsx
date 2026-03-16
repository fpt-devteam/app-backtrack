import { useAppUser } from "@/src/features/auth/providers";
import { socketChatService } from "@/src/features/chat/services";
import { useUnregisterDeviceMutation } from "@/src/features/notification/hooks";
import { UserSubscriptionPlanDetailCard } from "@/src/features/qr/components";
import { auth } from "@/src/shared/lib/firebase";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { signOut } from "firebase/auth";
import {
  CaretRightIcon,
  QuestionIcon,
  ShieldCheckIcon,
  SignOutIcon,
  UserIcon,
} from "phosphor-react-native";
import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type MenuRowProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly icon: React.ReactNode;
  readonly onPress: () => void;
};

function MenuRow({ title, subtitle, icon, onPress }: MenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3 active:opacity-80"
    >
      <View className="w-10 h-10 rounded-full items-center justify-center bg-white">
        {icon}
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-slate-800">{title}</Text>
        <Text className="text-xs text-slate-500 mt-0.5">{subtitle}</Text>
      </View>

      <CaretRightIcon size={18} color="#94a3b8" weight="bold" />
    </Pressable>
  );
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAppUser();
  const { mutateAsync: unregisterDevice } = useUnregisterDeviceMutation();

  const displayName = useMemo(
    () => user?.displayName?.trim() || user?.email || "User",
    [user?.displayName, user?.email],
  );

  const avatarSource = useMemo(() => {
    const url = user?.avatar?.trim();
    return url ? { uri: url } : undefined;
  }, [user?.avatar]);

  const avatarFallback = useMemo(
    () => displayName?.[0]?.toUpperCase() || "U",
    [displayName],
  );

  const handleMenuPress = async () => {
    await Haptics.selectionAsync();
  };

  const handleLogout = async () => {
    await socketChatService.disconnect();
    await unregisterDevice();
    await signOut(auth);
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingBottom: 2 * insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-3">
          <View className="relative">
            {avatarSource ? (
              <Image
                source={avatarSource}
                className="w-24 h-24 rounded-full bg-slate-200"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-[#e6d8c2] items-center justify-center">
                <Text className="text-3xl font-bold text-slate-700">
                  {avatarFallback}
                </Text>
              </View>
            )}
          </View>

          <Text className="mt-3 text-sm font-bold text-slate-900 text-center">
            {displayName}
          </Text>
          <Text className="mt-1 text-sm text-slate-500 text-center">
            {user?.email || "No email"}
          </Text>
        </View>

        <View className="mt-5">
          <UserSubscriptionPlanDetailCard />
        </View>

        <Text className="mt-8 mb-2 px-1 text-xs font-semibold tracking-[1.6px] text-slate-400 uppercase">
          Settings
        </Text>
        <View className="rounded-2xl border border-slate-200 bg-[#eef2f7] overflow-hidden">
          <MenuRow
            title="Personal Details"
            subtitle="Name, phone number"
            icon={<UserIcon size={18} color="#3b82f6" weight="fill" />}
            onPress={handleMenuPress}
          />

          <View className="h-px bg-slate-200 mx-4" />

          <MenuRow
            title="Privacy & Security"
            subtitle="Password, 2FA"
            icon={<ShieldCheckIcon size={18} color="#10b981" weight="fill" />}
            onPress={handleMenuPress}
          />
        </View>

        <Text className="mt-8 mb-2 px-1 text-xs font-semibold tracking-[1.6px] text-slate-400 uppercase">
          Support
        </Text>
        <View className="rounded-2xl border border-slate-200 bg-[#eef2f7] overflow-hidden">
          <MenuRow
            title="Help Center"
            subtitle="FAQ, contact support"
            icon={<QuestionIcon size={18} color="#f59e0b" weight="fill" />}
            onPress={handleMenuPress}
          />
        </View>

        {/* Log Out */}
        <Pressable
          onPress={handleLogout}
          className="mt-8 h-14 rounded-2xl border border-[#f5c8cf] bg-[#fdecef] flex-row items-center justify-center gap-2 active:opacity-85"
        >
          <SignOutIcon size={18} color="red" weight="bold" />
          <Text className="text-base " style={{ color: colors.red[600] }}>
            Log Out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
