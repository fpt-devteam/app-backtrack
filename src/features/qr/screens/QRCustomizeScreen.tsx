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
import { AppInlineError } from "@/src/shared/components";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import { CaretLeftIcon, FloppyDiskIcon } from "phosphor-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

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

const SectionCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <View className="bg-surface rounded-2xl border border-divider px-4 py-4">
    <Text className="text-sm font-bold text-textPrimary">{title}</Text>
    {!!subtitle && (
      <Text className="text-xs text-slate-400 mt-1 mb-3">{subtitle}</Text>
    )}
    {children}
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
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="flex-row items-center px-4 py-3 bg-canvas">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <CaretLeftIcon size={22} color={colors.black} weight="bold" />
        </Pressable>
        <Text className="flex-1 text-center text-base font-bold text-textPrimary">
          Customize QR
        </Text>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={isUpdatingDesign || isDesignLoading}
          hitSlop={10}
          className="flex-row items-center gap-1"
        >
          <FloppyDiskIcon size={16} color={colors.primary} weight="fill" />
          <Text
            className="text-base font-semibold"
            style={{ color: colors.primary }}
          >
            {isUpdatingDesign ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {!!designError && <AppInlineError message={designError.message} />}
        {!!updateError && <AppInlineError message={updateError.message} />}

        <View className="rounded-3xl overflow-hidden border border-divider">
          <View className="items-center py-8">
            <View
              style={{
                borderRadius: clamp(preview.logoBorderRadius, 0, 24),
                overflow: "hidden",
                backgroundColor: colors.white,
                padding: 12,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
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
        </View>

        <SectionCard
          title="QR Colors"
          subtitle="Choose module and background colors"
        >
          <Text className="text-sm font-bold text-textPrimary">QR Color</Text>
          <ColorSwatches
            selectedColor={form.color ?? ""}
            onSelectColor={(color) =>
              setForm((prev) => ({
                ...prev,
                color,
              }))
            }
          />

          <Text className="text-sm font-bold text-textPrimary">
            Background Color
          </Text>
          <ColorSwatches
            selectedColor={form.backgroundColor ?? ""}
            onSelectColor={(color) =>
              setForm((prev) => ({
                ...prev,
                backgroundColor: color,
              }))
            }
          />
        </SectionCard>

        <SectionCard
          title="Error Correction"
          subtitle="Higher level improves readability when QR is damaged"
        >
          <View className="flex-row gap-2">
            {ECL_OPTIONS.map((ecl) => {
              const selected = (form.ecl ?? "H") === ecl;
              return (
                <Pressable
                  key={ecl}
                  onPress={() => setForm((prev) => ({ ...prev, ecl }))}
                  className="px-3 py-2 rounded-xl border"
                  style={{
                    borderColor: selected ? colors.primary : colors.slate[200],
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
        </SectionCard>

        <SectionCard
          title="Logo"
          subtitle="Adjust logo appearance sent in update request"
        >
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
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRCustomizeScreen;
