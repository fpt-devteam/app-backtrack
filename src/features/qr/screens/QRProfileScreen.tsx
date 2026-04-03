import { useAppUser } from "@/src/features/auth/providers/user.provider";
import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_PROFILE,
} from "@/src/features/qr/constants";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import {
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  MegaphoneSimpleIcon,
  PhoneIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  XIcon,
} from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SafetyBanner = ({ onDismiss }: { onDismiss: () => void }) => (
  <View className="flex-row items-start gap-3 bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3">
    <ShieldCheckIcon
      size={20}
      color={colors.primary}
      weight="fill"
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
      <XIcon size={16} color={colors.slate[400]} weight="bold" />
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
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <XIcon size={22} color={colors.black} weight="bold" />
        </Pressable>
        <Text className="flex-1 text-center text-base font-bold text-textPrimary">
          Owner Profile
        </Text>
        {/* Spacer to balance the close button */}
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Safety Banner */}
        {showSafetyBanner && (
          <SafetyBanner onDismiss={() => setShowSafetyBanner(false)} />
        )}

        {/* Profile Section */}
        <View className="items-center gap-2 mt-2">
          {/* Avatar with verification badge */}
          <View>
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-slate-200 items-center justify-center">
                <Text className="text-3xl font-bold text-slate-400">
                  {user?.displayName?.[0]?.toUpperCase() ?? "?"}
                </Text>
              </View>
            )}
            <View className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
              <SealCheckIcon size={24} color={colors.primary} weight="fill" />
            </View>
          </View>

          {/* Name & member since */}
          <View className="items-center gap-1 mt-2">
            <Text className="text-xl font-bold text-textPrimary">
              {user?.displayName ?? "Unknown"}
            </Text>
            <Text className="text-sm text-slate-400">
              Member since {memberSince}
            </Text>
          </View>

          {/* Verified Owner pill */}
          <View className="flex-row items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 mt-1">
            <CheckCircleIcon
              size={14}
              color={colors.status.success}
              weight="fill"
            />
            <Text className="text-xs font-semibold text-emerald-600">
              Verified Owner
            </Text>
          </View>

          {/* Contact info */}
          <View className="w-full mt-2 bg-canvas rounded-2xl border border-divider overflow-hidden">
            <View className="flex-row items-center gap-3 px-4 py-3">
              <View className="w-8 h-8 rounded-full bg-sky-100 items-center justify-center">
                <EnvelopeSimpleIcon
                  size={15}
                  color={colors.primary}
                  weight="fill"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 mb-0.5">Email</Text>
                <Text className="text-sm font-medium text-slate-700">
                  {user?.email ?? "—"}
                </Text>
              </View>
            </View>
            <View className="h-px bg-slate-100 mx-4" />
            <View className="flex-row items-center gap-3 px-4 py-3">
              <View className="w-8 h-8 rounded-full bg-sky-100 items-center justify-center">
                <PhoneIcon size={15} color={colors.primary} weight="fill" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 mb-0.5">Phone</Text>
                <Text className="text-sm font-medium text-slate-700">
                  {phone}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Owner's Note Card */}
        <View className="bg-surface rounded-2xl border border-divider flex-row overflow-hidden">
          {/* Left accent bar */}
          <View className="w-1 bg-primary" />
          <View className="flex-1 px-4 py-4 gap-3">
            {/* Title */}
            <View className="flex-row items-center gap-2">
              <MegaphoneSimpleIcon
                size={18}
                color={colors.primary}
                weight="fill"
              />
              <Text className="text-sm font-bold text-textPrimary">
                Owner&apos;s Note
              </Text>
            </View>
            {/* Note text */}
            <Text className="text-sm text-textSecondary leading-6">
              {ownerNote}
            </Text>
            {/* Drop-off location chip */}
            <View className="self-start flex-row items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5">
              <MapPinIcon size={13} color={colors.slate[500]} weight="fill" />
              <Text className="text-xs font-medium text-textSecondary">
                {dropOffLocation}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRProfileScreen;
