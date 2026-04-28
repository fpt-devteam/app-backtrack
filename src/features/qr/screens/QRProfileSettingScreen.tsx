import { useAppUser } from "@/src/features/auth/providers";
import { usePatchProfile } from "@/src/features/profile/hooks";
import {
  UserSettingSectionCard,
  UserSettingToggleRow,
} from "@/src/features/qr/components";
import { useGetMyQR, useUpdateQRNote } from "@/src/features/qr/hooks";
import { AppLoader } from "@/src/shared/components";
import { TouchableIconButton } from "@/src/shared/components/ui/TouchableIconButton";
import { toast } from "@/src/shared/components/ui/toast";
import { colors } from "@/src/shared/theme/colors";
import { getErrorMessage } from "@/src/shared/utils";
import { router } from "expo-router";
import {
  CaretLeftIcon,
  ChatTeardropTextIcon,
  EyeIcon,
} from "phosphor-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QRProfileSettingScreen = () => {
  const { patchProfile } = usePatchProfile();
  const { user: profile, refetch } = useAppUser();
  const { data: qrData, isLoading } = useGetMyQR();
  const { updateNote, isUpdatingNote } = useUpdateQRNote();

  const showLoading = isLoading || isUpdatingNote;

  const [showPhoneNumber, setShowPhoneNumber] = useState(
    profile?.showPhone ?? false,
  );
  const [showEmailAddress, setShowEmailAddress] = useState(
    profile?.showEmail ?? false,
  );

  const [customMessage, setCustomMessage] = useState(qrData?.note ?? "");

  // const handleUpdateNote = useCallback(
  //   async (value: string) => {
  //     setShowPhoneNumber(value);
  //     try {
  //       await patchProfile({ showPhone: value });
  //       toast.success("Settings updated");
  //     } catch (err) {
  //       setShowPhoneNumber(!value);
  //       toast.error("Failed to update", getErrorMessage(err));
  //     } finally {
  //       refetch();
  //     }
  //   },
  //   [patchProfile],
  // );

  useEffect(() => {
    if (profile) {
      setShowPhoneNumber(profile.showPhone);
      setShowEmailAddress(profile.showEmail);
    }
  }, [profile]);

  const handleTogglePhone = useCallback(
    async (value: boolean) => {
      setShowPhoneNumber(value);
      try {
        await patchProfile({ showPhone: value });
        toast.success("Settings updated");
      } catch (err) {
        setShowPhoneNumber(!value);
        toast.error("Failed to update", getErrorMessage(err));
      } finally {
        refetch();
      }
    },
    [patchProfile],
  );

  const handleToggleEmail = useCallback(
    async (value: boolean) => {
      setShowEmailAddress(value);
      try {
        await patchProfile({ showEmail: value });
        toast.success("Settings updated");
      } catch (err) {
        setShowEmailAddress(!value);
        toast.error("Failed to update", getErrorMessage(err));
      } finally {
        refetch();
      }
    },
    [patchProfile],
  );

  const handleBack = () => {
    router.back();
  };

  const renderContent = () => {
    if (showLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <AppLoader />
        </View>
      );
    }

    return (
      <>
        <UserSettingSectionCard
          icon={<EyeIcon size={18} color={colors.primary} weight="fill" />}
          title="Contact Visibility"
        >
          <View className="h-px bg-slate-100" />

          <UserSettingToggleRow
            label="Show Phone Number"
            subtitle="Allow direct calls"
            value={showPhoneNumber}
            onValueChange={handleTogglePhone}
          />

          <View className="h-px bg-slate-100" />

          <UserSettingToggleRow
            label="Show Email Address"
            value={showEmailAddress}
            onValueChange={handleToggleEmail}
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
            className="bg-canvas border border-divider rounded-xl p-3 text-sm text-slate-700"
          />
        </UserSettingSectionCard>
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-canvas">
        <TouchableIconButton
          onPress={handleBack}
          icon={<CaretLeftIcon size={22} color={colors.black} weight="bold" />}
        />

        <Text className="flex-1 text-center text-base font-bold text-textPrimary">
          Public Profile Settings
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRProfileSettingScreen;
