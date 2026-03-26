import {
  UserSettingSectionCard,
  UserSettingToggleRow,
} from "@/src/features/qr/components";
import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_PROFILE_SETTINGS,
} from "@/src/features/qr/constants";
import { TouchableIconButton } from "@/src/shared/components/ui/TouchableIconButton";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import {
  CaretLeftIcon,
  ChatTeardropTextIcon,
  EyeIcon,
} from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handleSave = () => {
    // Implement save logic when API is ready
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-slate-50">
        <TouchableIconButton
          onPress={handleBack}
          icon={<CaretLeftIcon size={22} color={colors.black} weight="bold" />}
        />

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
        <UserSettingSectionCard
          icon={<EyeIcon size={18} color={colors.primary} weight="fill" />}
          title="Contact Visibility"
        >
          <UserSettingToggleRow
            label="Show Full Name"
            subtitle="Visible to anyone who scans"
            value={showFullName}
            onValueChange={setShowFullName}
          />

          <View className="h-px bg-slate-100" />

          <UserSettingToggleRow
            label="Show Phone Number"
            subtitle="Allow direct calls"
            value={showPhoneNumber}
            onValueChange={setShowPhoneNumber}
          />

          <View className="h-px bg-slate-100" />

          <UserSettingToggleRow
            label="Show Email Address"
            value={showEmailAddress}
            onValueChange={setShowEmailAddress}
          />
        </UserSettingSectionCard>

        {/* Custom Message to Finders */}
        <UserSettingSectionCard
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
            textAlignVertical="top"
            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700"
          />
        </UserSettingSectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRProfileSettingScreen;
