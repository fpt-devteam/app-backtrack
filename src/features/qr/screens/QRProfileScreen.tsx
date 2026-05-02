import { useAppUser } from "@/src/features/auth/providers/user.provider";
import { useGetMyQR } from "@/src/features/qr/hooks";
import { AppUserAvatar } from "@/src/shared/components";
import { colors } from "@/src/shared/theme/colors";
import { MotiView } from "moti";
import {
  EnvelopeSimpleIcon,
  MegaphoneSimpleIcon,
  PhoneIcon,
  SealCheckIcon,
  ShieldCheckIcon,
} from "phosphor-react-native";
import React from "react";
import type { ViewStyle } from "react-native";
import { Text, View } from "react-native";

const CARD_SHADOW: ViewStyle = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
};

const SafetyBanner = () => (
  <MotiView
    from={{ opacity: 0, translateY: 16 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: "timing", duration: 260, delay: 180 }}
  >
    <View
      className="flex-row items-start rounded-md border p-md2"
      style={{
        borderColor: colors.info[300],
        backgroundColor: colors.info[50],
      }}
    >
      <ShieldCheckIcon
        size={16}
        weight="fill"
        color={colors.info[600]}
        style={{ marginTop: 1, marginRight: 8 }}
      />
      <Text
        className="flex-1 text-xs leading-relaxed"
        style={{ color: colors.info[600] }}
      >
        Please meet in public places or use safe drop-off points when returning
        items.
      </Text>
    </View>
  </MotiView>
);

const QRProfileScreen = () => {
  const { user } = useAppUser();
  const { data: qrData, isLoading } = useGetMyQR();
  if (!user || isLoading) return null;

  const ownerNote = qrData?.note;
  const phone = user?.phone;
  const showPhone = qrData?.showPhone;
  const showEmail = qrData?.showEmail;

  return (
    <View className="flex-1 bg-surface p-md gap-md">
      {/* Safety Banner */}
      <SafetyBanner />

      {/* Profile Hero Card */}
      <View
        className="bg-surface items-center gap-xs py-md rounded-xl border border-divider"
        style={CARD_SHADOW}
      >
        {/* Avatar with verification badge */}
        <View className="relative">
          <AppUserAvatar size={80} avatarUrl={user?.avatarUrl} />
          <View className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
            <SealCheckIcon size={18} color={colors.primary} weight="thin" />
          </View>
        </View>

        <Text className="text-lg font-normal text-textPrimary">
          {user?.displayName ?? "Unknown"}
        </Text>
      </View>

      {/* Contact Info */}
      <View
        className="bg-surface rounded-xl border border-divider"
        style={CARD_SHADOW}
      >
        {showEmail && (
          <View className="flex-row items-center gap-md px-lg py-md">
            <EnvelopeSimpleIcon
              size={20}
              color={colors.secondary}
              weight="thin"
            />
            <Text className="flex-1 text-md font-thin text-textPrimary">
              {user?.email ?? "—"}
            </Text>
          </View>
        )}
        <View className="h-px bg-divider mx-lg" />
        {showPhone && (
          <View className="flex-row items-center gap-md px-lg py-md">
            <PhoneIcon size={20} color={colors.secondary} weight="thin" />
            <Text className="flex-1 text-md font-thin text-textPrimary">
              {phone}
            </Text>
          </View>
        )}
      </View>

      {/* Owner's Note Card */}
      <View
        className="bg-surface rounded-xl border border-divider px-lg py-md gap-md2"
        style={CARD_SHADOW}
      >
        <View className="flex-row items-center gap-md">
          <MegaphoneSimpleIcon
            size={20}
            color={colors.hof[900]}
            weight="thin"
          />
          <Text className="text-base font-thin text-textPrimary">
            Owner&apos;s Note
          </Text>
        </View>

        <Text className="text-sm font-thin text-textSecondary leading-6">
          {ownerNote}
        </Text>
      </View>
    </View>
  );
};

export default QRProfileScreen;
