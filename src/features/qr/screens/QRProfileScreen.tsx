import { useAppUser } from "@/src/features/auth/providers/user.provider";
import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_PROFILE,
} from "@/src/features/qr/constants";
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
import { Image, Pressable, Text, View } from "react-native";
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
  <View className="flex-row items-start gap-3 bg-canvas border border-divider rounded-xl px-4 py-3">
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

      <View className="flex-1 px-lg pt-sm pb-lg gap-md">
        {/* Safety Banner */}
        {showSafetyBanner && (
          <SafetyBanner onDismiss={() => setShowSafetyBanner(false)} />
        )}

        {/* Profile Card — horizontal row */}
        <View
          className="bg-surface rounded-xl border border-divider flex-row items-center gap-md px-lg py-md"
          style={CARD_SHADOW}
        >
          <View>
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-canvas items-center justify-center">
                <Text className="text-2xl font-bold text-textSecondary">
                  {user?.displayName?.[0]?.toUpperCase() ?? "?"}
                </Text>
              </View>
            )}
            <View className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
              <SealCheckIcon size={20} color={colors.primary} weight="thin" />
            </View>
          </View>

          <View className="flex-1 gap-1">
            <Text className="text-base font-semibold text-textPrimary">
              {user?.displayName ?? "Unknown"}
            </Text>
            <Text className="text-xs text-textSecondary">
              Member since {memberSince}
            </Text>
            <View className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1 bg-[#E6F4EA] self-start mt-1">
              <SealCheckIcon size={12} color={colors.status.success} weight="thin" />
              <Text className="text-xs font-semibold text-[#008A05]">
                Verified Owner
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Info Card */}
        <View
          className="bg-surface rounded-xl border border-divider"
          style={CARD_SHADOW}
        >
          <View className="flex-row items-center gap-3 px-lg py-md">
            <View className="w-9 h-9 rounded-full bg-accent items-center justify-center">
              <EnvelopeSimpleIcon size={16} color={colors.primary} weight="thin" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-textSecondary mb-0.5">Email</Text>
              <Text className="text-sm font-medium text-textPrimary">
                {user?.email ?? "—"}
              </Text>
            </View>
          </View>
          <View className="h-px bg-divider mx-lg" />
          <View className="flex-row items-center gap-3 px-lg py-md">
            <View className="w-9 h-9 rounded-full bg-accent items-center justify-center">
              <PhoneIcon size={16} color={colors.primary} weight="thin" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-textSecondary mb-0.5">Phone</Text>
              <Text className="text-sm font-medium text-textPrimary">
                {phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Owner's Note Card */}
        <View
          className="bg-surface rounded-xl border border-divider"
          style={CARD_SHADOW}
        >
          <View className="flex-row items-center gap-3 px-lg py-md">
            <View className="w-9 h-9 rounded-full bg-accent items-center justify-center">
              <MegaphoneSimpleIcon size={16} color={colors.primary} weight="thin" />
            </View>
            <Text className="text-sm font-semibold text-textPrimary">
              Owner&apos;s Note
            </Text>
          </View>
          <View className="h-px bg-divider mx-lg" />
          <Text className="text-sm text-textSecondary leading-6 px-lg py-md">
            {ownerNote}
          </Text>
          <View className="h-px bg-divider mx-lg" />
          <View className="flex-row items-center gap-3 px-lg py-md">
            <MapPinIcon size={16} color={colors.hof[500]} weight="thin" />
            <Text className="text-sm text-textSecondary">{dropOffLocation}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QRProfileScreen;
