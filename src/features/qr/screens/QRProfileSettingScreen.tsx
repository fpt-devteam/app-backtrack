import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_PROFILE_SETTINGS,
} from "@/src/features/qr/constants";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import {
  CaretLeftIcon,
  ChatTeardropTextIcon,
  EyeIcon,
  ListBulletsIcon,
} from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ToggleRowProps = {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
};

const ToggleRow = ({
  label,
  subtitle,
  value,
  onValueChange,
}: ToggleRowProps) => (
  <View className="flex-row items-center justify-between py-3">
    <View className="flex-1 pr-4">
      <Text className="text-sm font-medium text-slate-800">{label}</Text>
      {!!subtitle && (
        <Text className="text-xs text-slate-400 mt-0.5">{subtitle}</Text>
      )}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.slate[200], true: colors.primary }}
      thumbColor={colors.white}
    />
  </View>
);

const SectionCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <View className="bg-white rounded-2xl border border-slate-100 px-4 py-4 gap-1">
    <View className="flex-row items-center gap-2 mb-1">
      {icon}
      <Text className="text-sm font-bold text-slate-800">{title}</Text>
    </View>
    {children}
  </View>
);

const QRProfileSettingScreen = () => {
  const defaults = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_PROFILE_SETTINGS;
    return MOCK_QR_PROFILE_SETTINGS; // replace with real data when available
  }, []);

  const [showFullName, setShowFullName] = useState(defaults.showFullName);
  const [showPhoneNumber, setShowPhoneNumber] = useState(
    defaults.showPhoneNumber,
  );
  const [showEmailAddress, setShowEmailAddress] = useState(
    defaults.showEmailAddress,
  );
  const [customMessage, setCustomMessage] = useState(defaults.customMessage);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-slate-50">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <CaretLeftIcon size={22} color={colors.black} weight="bold" />
        </Pressable>
        <Text className="flex-1 text-center text-base font-bold text-slate-900">
          Public Profile Settings
        </Text>
        {/* Spacer to balance the back button */}
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Contact Visibility */}
        <SectionCard
          icon={<EyeIcon size={18} color={colors.primary} weight="fill" />}
          title="Contact Visibility"
        >
          <ToggleRow
            label="Show Full Name"
            subtitle="Visible to anyone who scans"
            value={showFullName}
            onValueChange={setShowFullName}
          />
          <View className="h-px bg-slate-100" />
          <ToggleRow
            label="Show Phone Number"
            subtitle="Allow direct calls"
            value={showPhoneNumber}
            onValueChange={setShowPhoneNumber}
          />
          <View className="h-px bg-slate-100" />
          <ToggleRow
            label="Show Email Address"
            value={showEmailAddress}
            onValueChange={setShowEmailAddress}
          />
        </SectionCard>

        {/* Custom Message to Finders */}
        <SectionCard
          icon={
            <ChatTeardropTextIcon
              size={18}
              color={colors.primary}
              weight="fill"
            />
          }
          title="Custom Message to Finders"
        >
          <Text className="text-xs text-slate-400 leading-4 mb-2">
            Display a note when your code is scanned (e.g. reward info).
          </Text>
          <TextInput
            value={customMessage}
            onChangeText={setCustomMessage}
            placeholder="Write a message for finders..."
            placeholderTextColor={colors.slate[400]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-700"
            style={{ minHeight: 80 }}
          />
        </SectionCard>

        {/* Select Active Posts to Show — header only */}
        <SectionCard
          icon={
            <ListBulletsIcon size={18} color={colors.primary} weight="fill" />
          }
          title="Select Active Posts to Show"
        >
          <Text className="text-xs text-slate-400 leading-4">
            Choose which lost item posts appear on your QR profile.
          </Text>
          {/* Posts list — not implemented yet */}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRProfileSettingScreen;
