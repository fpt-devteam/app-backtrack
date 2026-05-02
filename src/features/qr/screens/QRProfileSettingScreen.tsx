import { LogoSelector } from "@/src/features/qr/components";
import { IS_QR_FEATURE_MOCK, MOCK_QR_CODE } from "@/src/features/qr/constants";
import { useGetMyQR, usePatchMyQR } from "@/src/features/qr/hooks";
import {
  AppBackButton,
  TouchableIconButton,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { metrics } from "@/src/shared/theme";
import { colors } from "@/src/shared/theme/colors";
import { typography } from "@/src/shared/theme/typography";
import { getErrorMessage } from "@/src/shared/utils";
import { Stack } from "expo-router";
import {
  ChatTeardropTextIcon,
  CheckIcon,
  EyeIcon,
} from "phosphor-react-native";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Keyboard,
  ScrollView,
  Switch,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Haptics from "expo-haptics";
import { PostFormTextArea } from "@/src/features/post/components";

type SettingsForm = {
  showPhone: boolean;
  showEmail: boolean;
  customMessage: string;
  logoUrl: string;
};

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
  const handleOnSwitch = (v: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(v);
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

const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <View>
    <Text className="text-sm font-normal text-textPrimary">{title}</Text>
    <Text className="text-xs font-thin text-textSecondary">{subtitle}</Text>
  </View>
);

const QRProfileSettingScreen = () => {
  const { data: qrData } = useGetMyQR();
  const { patchMyQR, isPatchingQR } = usePatchMyQR();

  const [form, setForm] = useState<SettingsForm>({
    showPhone: false,
    showEmail: false,
    customMessage: "",
    logoUrl: "",
  });
  const [initialForm, setInitialForm] = useState<SettingsForm>({
    showPhone: false,
    showEmail: false,
    customMessage: "",
    logoUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (qrData) {
      const next: SettingsForm = {
        showPhone: qrData.showPhone,
        showEmail: qrData.showEmail,
        customMessage: qrData.note ?? "",
        logoUrl: qrData.logoUrl ?? "",
      };
      setForm(next);
      setInitialForm(next);
    }
  }, [qrData]);

  const publicCode = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_CODE.publicCode;
    return qrData?.publicCode ?? "";
  }, [qrData?.publicCode]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await patchMyQR({
        note: form.customMessage,
        logoUrl: form.logoUrl,
        showEmail: form.showEmail,
        showPhone: form.showPhone,
      });
      toast.success("Settings saved");
    } catch (err) {
      toast.error("Failed to save", getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }, [form, patchMyQR]);

  const hasChanges = useMemo(
    () =>
      form.showPhone !== initialForm.showPhone ||
      form.showEmail !== initialForm.showEmail ||
      form.customMessage !== initialForm.customMessage ||
      form.logoUrl !== initialForm.logoUrl,
    [form, initialForm],
  );

  const isBusy = isSaving || isPatchingQR;

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          headerTitle: "QR Profile Settings",
          headerLeft: () => <AppBackButton />,
          headerRight: () => (
            <TouchableIconButton
              icon={<CheckIcon size={24} color={colors.primary} weight="bold" />}
              onPress={handleSave}
              disabled={!hasChanges || isBusy}
            />
          ),
          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: metrics.spacing.md,
            paddingVertical: metrics.spacing.lg,
            gap: metrics.spacing.md,
          }}
        >
          {/* QR Preview */}
          <View className="rounded-3xl overflow-hidden border border-divider">
            <View className="items-center py-md">
              <QRCode
                value={publicCode || "BTK-PREVIEW"}
                size={180}
                color="#000000"
                backgroundColor="#FFFFFF"
                quietZone={8}
                ecl="H"
                logo={form.logoUrl}
                logoBorderRadius={99999}
                logoSize={60}
              />
            </View>
          </View>

          {/* Logo */}
          <View className="bg-surface rounded-3xl border border-divider p-md gap-md">
            <SectionTitle
              title="Logo"
              subtitle="Add a logo to your QR code"
            />
            <LogoSelector
              value={form.logoUrl}
              onChange={(url: string) =>
                setForm((prev) => ({ ...prev, logoUrl: url }))
              }
              disabled={isBusy}
            />
          </View>

          {/* Contact Visibility */}
          <UserSettingSectionCard
            icon={<EyeIcon size={24} color={colors.primary} weight="fill" />}
            title="Contact Visibility"
            subtitle="Control what information finders can see when they scan your QR code."
          >
            <View className="w-full gap-md">
              <UserSettingToggleRow
                label="Show Phone Number"
                subtitle="Allow direct calls"
                value={form.showPhone}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, showPhone: v }))
                }
              />
              <UserSettingToggleRow
                label="Show Email Address"
                subtitle="Allow email contact"
                value={form.showEmail}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, showEmail: v }))
                }
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
              value={form.customMessage}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, customMessage: v }))
              }
              placeholder="Write a message for finders..."
            />
          </UserSettingSectionCard>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default QRProfileSettingScreen;
