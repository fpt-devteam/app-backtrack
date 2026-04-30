import { LogoSelector } from "@/src/features/qr/components";
import ColorSwatches from "@/src/features/qr/components/ColorSelector";
import { IS_QR_FEATURE_MOCK, MOCK_QR_CODE } from "@/src/features/qr/constants";
import {
  useGetMyQR,
  useGetMyQRDesign,
  useUpdateMyQRDesign,
} from "@/src/features/qr/hooks";
import {
  QrErrorCorrectionLevel,
  QrErrorCorrectionLevelType,
  UpdateMyQrDesignRequest,
  UserQrDesign,
} from "@/src/features/qr/types";
import {
  AppBackButton,
  AppInlineError,
  TouchableIconButton,
} from "@/src/shared/components";
import { metrics } from "@/src/shared/theme";
import { colors } from "@/src/shared/theme/colors";
import { typography } from "@/src/shared/theme/typography";
import { Stack } from "expo-router";
import { FloppyDiskIcon } from "phosphor-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextStyle, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const DEFAULT_DESIGN: UpdateMyQrDesignRequest = {
  color: "#000000",
  backgroundColor: "#FFFFFF",
  ecl: "H",
  logo: {
    url: "",
    size: 50,
    margin: 2,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
};

const ECL_OPTIONS: QrErrorCorrectionLevelType[] = [
  QrErrorCorrectionLevel.L,
  QrErrorCorrectionLevel.M,
  QrErrorCorrectionLevel.Q,
  QrErrorCorrectionLevel.H,
];

const toHexOrFallback = (value: string, fallback: string): string => {
  const normalized = value.trim();
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(normalized)
    ? normalized
    : fallback;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const toForm = (design?: UserQrDesign | null): UpdateMyQrDesignRequest => {
  if (!design) return DEFAULT_DESIGN;

  return {
    color: design.color,
    backgroundColor: design.backgroundColor,
    ecl: design.ecl,
    logo: {
      url: design.logo?.url ?? "",
      size: design.logo?.size ?? 50,
      margin: design.logo?.margin ?? 2,
      borderRadius: design.logo?.borderRadius ?? 0,
      backgroundColor: design.logo?.backgroundColor ?? "transparent",
    },
  };
};

const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <View className="">
    <Text className="text-sm font-normal text-textPrimary">{title}</Text>
    <Text className="text-xs font-thin text-textSecondary">{subtitle}</Text>
  </View>
);

const QRCustomizeScreen = () => {
  const { data: qrCode } = useGetMyQR();
  const {
    data: qrDesign,
    isLoading: isDesignLoading,
    error: designError,
  } = useGetMyQRDesign();
  const {
    updateDesign,
    isUpdatingDesign,
    error: updateError,
  } = useUpdateMyQRDesign();

  const [form, setForm] = useState<UpdateMyQrDesignRequest>(DEFAULT_DESIGN);
  const [initializedFromApi, setInitializedFromApi] = useState(false);

  useEffect(() => {
    if (!initializedFromApi && !IS_QR_FEATURE_MOCK && qrDesign) {
      setForm(toForm(qrDesign));
      setInitializedFromApi(true);
    }
  }, [initializedFromApi, qrDesign]);

  const publicCode = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_CODE.publicCode;
    return qrCode?.publicCode ?? "";
  }, [qrCode?.publicCode]);

  const preview = useMemo(() => {
    const normalizedColor = toHexOrFallback(form.color ?? "", "#000000");
    const normalizedBackground = toHexOrFallback(
      form.backgroundColor ?? "",
      "#FFFFFF",
    );

    return {
      color: normalizedColor,
      backgroundColor: normalizedBackground,
      ecl: form.ecl ?? "H",
      logoSize: clamp(form.logo?.size ?? 50, 0, 1000),
      logoMargin: clamp(form.logo?.margin ?? 2, 0, 100),
      logoBorderRadius: clamp(form.logo?.borderRadius ?? 0, 0, 500),
    };
  }, [form]);

  const handleSave = async () => {
    const payload: UpdateMyQrDesignRequest = {
      color: preview.color,
      backgroundColor: preview.backgroundColor,
      ecl: preview.ecl,
      logo: {
        url: form.logo?.url?.trim() ?? "",
        size: preview.logoSize,
        margin: preview.logoMargin,
        borderRadius: preview.logoBorderRadius,
        backgroundColor: form.logo?.backgroundColor?.trim() || "transparent",
      },
    };

    // try {
    //   await updateDesign(payload);
    //   router.back();
    // } catch {}
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen
        options={{
          headerTitle: "QR Customize",
          headerLeft: () => <AppBackButton />,
          headerRight: () => (
            <TouchableIconButton
              icon={<FloppyDiskIcon size={24} color={colors.black} />}
              onPress={handleSave}
              disabled={isUpdatingDesign || isDesignLoading}
            />
          ),

          headerTitleStyle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.normal as TextStyle["fontWeight"],
          },
        }}
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: metrics.spacing.md,
          paddingVertical: metrics.spacing.lg,
          gap: metrics.spacing.md,
        }}
      >
        {!!designError && <AppInlineError message={designError.message} />}

        {!!updateError && <AppInlineError message={updateError.message} />}

        <View className="rounded-3xl overflow-hidden border border-divider">
          <View className="items-center py-md">
            <QRCode
              value={publicCode || "BTK-PREVIEW"}
              size={180}
              color={preview.color}
              backgroundColor={preview.backgroundColor}
              quietZone={8}
              ecl={preview.ecl}
              logo={form.logo?.url ?? ""}
              logoBorderRadius={99999}
              logoSize={60}
            />
          </View>
        </View>

        {/* QR Colors */}
        <View className="bg-surface rounded-3xl border border-divider p-md gap-md">
          <SectionTitle
            title="QR Colors"
            subtitle="Choose module and background colors"
          />

          <ColorSwatches
            selectedColor={form.color ?? ""}
            onSelectColor={(color) =>
              setForm((prev) => ({
                ...prev,
                color,
              }))
            }
          />
        </View>

        {/* Background Color */}
        <View className="bg-surface rounded-3xl border border-divider p-md gap-md">
          <SectionTitle
            title="Background Color"
            subtitle="Choose the background color for the QR code"
          />

          <ColorSwatches
            selectedColor={form.backgroundColor ?? ""}
            onSelectColor={(color) =>
              setForm((prev) => ({
                ...prev,
                backgroundColor: color,
              }))
            }
          />
        </View>

        {/* Error Correction */}
        <View className="bg-surface rounded-3xl border border-divider p-md gap-md">
          <SectionTitle
            title="Error Correction"
            subtitle="Higher level improves readability when QR is damaged"
          />
          <View className="flex-row gap-sm">
            {ECL_OPTIONS.map((ecl) => {
              const selected = (form.ecl ?? "H") === ecl;
              return (
                <Pressable
                  key={ecl}
                  onPress={() => setForm((prev) => ({ ...prev, ecl }))}
                  className="p-sm rounded-xl border"
                  style={{
                    borderColor: selected
                      ? colors.primary
                      : colors.border.DEFAULT,
                    backgroundColor: selected ? colors.sky[100] : colors.white,
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: selected ? colors.primary : colors.slate[600],
                    }}
                  >
                    {ecl}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Logo */}
        <View className="bg-surface rounded-3xl border border-divider p-md gap-md">
          <SectionTitle
            title="Logo"
            subtitle="Adjust logo appearance sent in update request"
          />
          <LogoSelector
            value={form.logo?.url ?? ""}
            onChange={(url: string) =>
              setForm((prev) => ({
                ...prev,
                logo: {
                  ...(prev.logo ?? DEFAULT_DESIGN.logo),
                  url,
                },
              }))
            }
            disabled={isUpdatingDesign}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default QRCustomizeScreen;
