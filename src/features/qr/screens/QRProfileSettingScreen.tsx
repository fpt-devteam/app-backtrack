import { useAppUser } from "@/src/features/auth/providers";
import { usePatchProfile } from "@/src/features/profile/hooks";
import { useGetMyQR, useUpdateQRNote } from "@/src/features/qr/hooks";
import { AppBackButton, AppLoader } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { colors } from "@/src/shared/theme/colors";
import { typography } from "@/src/shared/theme/typography";
import { getErrorMessage } from "@/src/shared/utils";
import { Stack } from "expo-router";
import { ChatTeardropTextIcon, EyeIcon } from "phosphor-react-native";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  Switch,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import * as Haptics from "expo-haptics";
import { PostFormTextArea } from "../../post/components";

type UserSettingSectionCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
};

const UserSettingSectionCard = ({
  icon,
  title,
  subtitle,
  children,
}: UserSettingSectionCardProps) => (
  <View className="bg-surfaces p-sm gap-md">
    <View className="flex-col gap-xs">
      <View className="flex-row items-center gap-xs">
        {icon}
        <Text className="text-base font-normal text-textPrimary">{title}</Text>
      </View>

      <Text className="text-xs font-thin text-textMuted">{subtitle}</Text>
    </View>

    {children}
  </View>
);

type UserSettingToggleRowProps = {
  label: string;
  subtitle: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
};

export const UserSettingToggleRow = ({
  label,
  subtitle,
  value,
  onValueChange,
}: UserSettingToggleRowProps) => {
  const handleOnSwitch = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(value);
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 gap-xs">
        <Text className="text-sm font-normal text-textPrimary">{label}</Text>
        <Text className="text-xs font-thin text-textMuted">{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={handleOnSwitch}
        trackColor={{ false: colors.slate[200], true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
};

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
          icon={<EyeIcon size={24} color={colors.primary} weight="fill" />}
          title="Contact Visibility"
          subtitle="Control what information finders can see when they scan your QR code."
        >
          <View className="w-full gap-md">
            <UserSettingToggleRow
              label="Show Phone Number"
              subtitle="Allow direct calls"
              value={showPhoneNumber}
              onValueChange={handleTogglePhone}
            />

            <UserSettingToggleRow
              label="Show Email Address"
              subtitle="Allow email contact"
              value={showEmailAddress}
              onValueChange={handleToggleEmail}
            />
          </View>
        </UserSettingSectionCard>

        {/* Custom Message to Finders */}
        <UserSettingSectionCard
          icon={
            <ChatTeardropTextIcon
              size={24}
              color={colors.primary}
              weight="fill"
            />
          }
          title="Custom Message to Finders"
          subtitle="Let finders know what to do when they scan your QR code."
        >
          <PostFormTextArea
            value={customMessage}
            onChange={setCustomMessage}
            placeholder="Write a message for finders..."
          />
        </UserSettingSectionCard>
      </>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          headerTitle: "QR Profile Settings",
          headerLeft: () => <AppBackButton />,
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 p-md gap-md">{renderContent()}</View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default QRProfileSettingScreen;
