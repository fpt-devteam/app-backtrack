import { useAppUser } from "@/src/features/auth/providers/user.provider";
import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_PROFILE,
} from "@/src/features/qr/constants";
import { AppUserAvatar } from "@/src/shared/components";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import {
  EnvelopeSimpleIcon,
  MapPinIcon,
  MegaphoneSimpleIcon,
  PhoneIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  XIcon,
} from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ViewStyle } from "react-native";

const CARD_SHADOW: ViewStyle = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
};

const SafetyBanner = ({ onDismiss }: { onDismiss: () => void }) => (
  <View className="flex-row items-start gap-3 bg-canvas border border-divider rounded-xl px-4 py-3 mb-md">
    <ShieldCheckIcon
      size={20}
      color={colors.primary}
      weight="thin"
      style={{ marginTop: 1 }}
    />
    <View className="flex-1">
      <Text className="text-sm font-bold text-textPrimary">Safety First</Text>
      <Text className="text-sm text-textSecondary leading-5 mt-0.5">
        Please meet in public places or use safe drop-off points when returning
        items.
      </Text>
    </View>
    <Pressable onPress={onDismiss} hitSlop={10}>
      <XIcon size={16} color={colors.hof[400]} weight="bold" />
    </Pressable>
  </View>
);

const QRProfileScreen = () => {
  const { user } = useAppUser();
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);

  const memberSince = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PROFILE.memberSince;
    return MOCK_QR_PROFILE.memberSince;
  }, []);

  const ownerNote = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PROFILE.ownerNote;
    return MOCK_QR_PROFILE.ownerNote;
  }, []);

  const dropOffLocation = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PROFILE.dropOffLocation;
    return MOCK_QR_PROFILE.dropOffLocation;
  }, []);

  const phone = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PROFILE.phone;
    return MOCK_QR_PROFILE.phone;
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center px-lg py-md">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <XIcon size={22} color={colors.hof[900]} weight="bold" />
        </Pressable>
        <Text className="flex-1 text-center text-base font-semibold text-textPrimary">
          Owner Profile
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-lg pb-xl"
        showsVerticalScrollIndicator={false}
      >
        {/* Safety Banner */}
        {showSafetyBanner && (
          <SafetyBanner onDismiss={() => setShowSafetyBanner(false)} />
        )}

        {/* Profile Hero Card — centered, matching ProfilePublicScreen */}
        <View
          className="bg-surface items-center gap-sm py-xl rounded-xl border border-divider"
          style={CARD_SHADOW}
        >
          {/* Avatar with verification badge */}
          {/* Note: AppUserAvatar has overflow:hidden — badge wrapper must be outside */}
          <View className="relative">
            <AppUserAvatar size={80} avatarUrl={user?.avatarUrl} />
            <View className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
              <SealCheckIcon size={18} color={colors.primary} weight="thin" />
            </View>
          </View>

          <Text className="text-lg font-semibold text-textPrimary">
            {user?.displayName ?? "Unknown"}
          </Text>

          <Text className="text-sm text-textSecondary">
            Member since {memberSince}
          </Text>

          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EA] mt-1">
            <SealCheckIcon
              size={12}
              color={colors.status.success}
              weight="thin"
            />
            <Text className="text-xs font-semibold text-[#008A05]">
              Verified Owner
            </Text>
          </View>
        </View>

        {/* Contact Info — matching ProfilePublicScreen InfoRow pattern */}
        <View
          className="bg-surface rounded-xl border border-divider mt-md"
          style={CARD_SHADOW}
        >
          <View className="flex-row items-center gap-md px-lg py-md">
            <EnvelopeSimpleIcon size={24} color={colors.black} weight="thin" />
            <Text className="flex-1 text-base font-thin text-textPrimary">
              {user?.email ?? "—"}
            </Text>
          </View>
          <View className="h-px bg-divider mx-lg" />
          <View className="flex-row items-center gap-md px-lg py-md">
            <PhoneIcon size={24} color={colors.black} weight="thin" />
            <Text className="flex-1 text-base font-thin text-textPrimary">
              {phone}
            </Text>
          </View>
        </View>

        {/* Owner's Note Card */}
        <View
          className="bg-surface rounded-xl border border-divider mt-md"
          style={CARD_SHADOW}
        >
          <View className="flex-row items-center gap-3 px-lg py-md">
            <MegaphoneSimpleIcon
              size={20}
              color={colors.hof[900]}
              weight="thin"
            />
            <Text className="text-base font-semibold text-textPrimary">
              Owner&apos;s Note
            </Text>
          </View>
          <View className="h-px bg-divider mx-lg" />
          <Text className="text-sm font-thin text-textSecondary leading-6 px-lg py-md">
            {ownerNote}
          </Text>
          <View className="h-px bg-divider mx-lg" />
          <View className="flex-row items-center gap-3 px-lg py-md">
            <MapPinIcon size={16} color={colors.hof[500]} weight="thin" />
            <Text className="text-sm font-thin text-textSecondary">
              {dropOffLocation}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRProfileScreen;
