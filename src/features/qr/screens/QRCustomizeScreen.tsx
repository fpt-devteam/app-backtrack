import {
  IS_QR_FEATURE_MOCK,
  MOCK_QR_CODE,
  MOCK_QR_CUSTOMIZE_DEFAULTS,
} from "@/src/features/qr/constants";
import { useGetMyQR } from "@/src/features/qr/hooks";
import { colors } from "@/src/shared/theme/colors";
import { router } from "expo-router";
import { CaretLeftIcon, CheckIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ──────────────────────────────────────────────────────────────────

type DecorId = "none" | "dog" | "heart" | "cat";
type BackgroundId = "clean" | "ocean" | "sunset" | "dots";
type FrameId = "square" | "rounded" | "soft" | "badge";

// ─── Option data ────────────────────────────────────────────────────────────

const DECORS: { id: DecorId; label: string; emoji: string | null }[] = [
  { id: "none", label: "None", emoji: null },
  { id: "dog", label: "Dog", emoji: "🐕" },
  { id: "heart", label: "Heart", emoji: "🩷" },
  { id: "cat", label: "Cat", emoji: "🐱" },
];

type BgStyle = {
  id: BackgroundId;
  label: string;
  colors: [string, string] | [string];
  dots?: boolean;
};

const BACKGROUNDS: BgStyle[] = [
  { id: "clean", label: "Clean", colors: ["#f8fafc"] },
  { id: "ocean", label: "Ocean", colors: ["#6dd5fa", "#2980b9"] },
  { id: "sunset", label: "Sunset", colors: ["#f97316", "#ef4444"] },
  { id: "dots", label: "Dots", colors: ["#e2e8f0"], dots: true },
];

const FRAMES: { id: FrameId; label: string; radius: number }[] = [
  { id: "square", label: "Square", radius: 4 },
  { id: "rounded", label: "Rounded", radius: 16 },
  { id: "soft", label: "Soft", radius: 32 },
  { id: "badge", label: "Badge", radius: 999 },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="text-base font-bold text-slate-900 mb-3">{title}</Text>
);

const DecorOption = ({
  item,
  selected,
  onPress,
}: {
  item: (typeof DECORS)[number];
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} className="items-center gap-1.5">
    <View
      className="w-16 h-16 rounded-full items-center justify-center"
      style={{
        backgroundColor: selected ? "#e0f2fe" : "#f1f5f9",
        borderWidth: 2,
        borderColor: selected ? colors.primary : "transparent",
      }}
    >
      {item.emoji ? (
        <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
      ) : (
        <View className="w-8 h-8 rounded-full bg-slate-300 items-center justify-center">
          <View className="w-1 h-5 bg-white rounded-full rotate-45 absolute" />
          <View className="w-5 h-1 bg-white rounded-full rotate-45 absolute" />
        </View>
      )}
    </View>
    <Text
      className="text-xs"
      style={{
        color: selected ? colors.primary : colors.slate[500],
        fontWeight: selected ? "600" : "400",
      }}
    >
      {item.label}
    </Text>
  </Pressable>
);

const BgOption = ({
  item,
  selected,
  onPress,
}: {
  item: BgStyle;
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} className="items-center gap-1.5">
    <View
      className="w-16 h-16 rounded-xl items-center justify-center overflow-hidden"
      style={{
        backgroundColor: item.colors[0],
        borderWidth: 2,
        borderColor: selected ? colors.primary : "transparent",
      }}
    >
      {/* Simple two-tone gradient simulation */}
      {item.colors.length === 2 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            backgroundColor: item.colors[1],
          }}
        />
      )}
      {item.dots && (
        <View className="flex-row flex-wrap gap-1 p-2">
          {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((k) => (
            <View key={k} className="w-2 h-2 rounded-full bg-slate-400" />
          ))}
        </View>
      )}
      {selected && (
        <View
          className="w-7 h-7 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <CheckIcon size={14} color="white" weight="bold" />
        </View>
      )}
    </View>
    <Text
      className="text-xs"
      style={{
        color: selected ? colors.primary : colors.slate[500],
        fontWeight: selected ? "600" : "400",
      }}
    >
      {item.label}
    </Text>
  </Pressable>
);

const FrameOption = ({
  item,
  selected,
  onPress,
}: {
  item: (typeof FRAMES)[number];
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} className="items-center gap-1.5">
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: Math.min(item.radius, 28),
        borderWidth: 2.5,
        borderColor: selected ? colors.primary : colors.slate[300],
        backgroundColor: selected ? "#e0f2fe" : "transparent",
      }}
    />
    <Text
      className="text-xs"
      style={{
        color: selected ? colors.primary : colors.slate[500],
        fontWeight: selected ? "600" : "400",
      }}
    >
      {item.label}
    </Text>
  </Pressable>
);

// ─── Screen ─────────────────────────────────────────────────────────────────

const QRCustomizeScreen = () => {
  const { data: qrCode } = useGetMyQR();

  const publicCode = useMemo(() => {
    if (IS_QR_FEATURE_MOCK) return MOCK_QR_CODE.publicCode;
    return qrCode?.publicCode ?? "";
  }, [qrCode?.publicCode]);

  const [selectedDecor, setSelectedDecor] = useState<DecorId>(
    MOCK_QR_CUSTOMIZE_DEFAULTS.decor,
  );
  const [selectedBg, setSelectedBg] = useState<BackgroundId>(
    MOCK_QR_CUSTOMIZE_DEFAULTS.background,
  );
  const [selectedFrame, setSelectedFrame] = useState<FrameId>(
    MOCK_QR_CUSTOMIZE_DEFAULTS.frame,
  );

  const activeBg =
    BACKGROUNDS.find((b) => b.id === selectedBg) ?? BACKGROUNDS[0];
  const activeFrame = FRAMES.find((f) => f.id === selectedFrame) ?? FRAMES[0];
  const activeDecor = DECORS.find((d) => d.id === selectedDecor) ?? DECORS[0];

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <CaretLeftIcon size={22} color={colors.black} weight="bold" />
        </Pressable>
        <Text className="flex-1 text-center text-base font-bold text-slate-900">
          My Backtrack QR
        </Text>
        <Pressable onPress={handleSave} hitSlop={10}>
          <Text
            className="text-base font-semibold"
            style={{ color: colors.primary }}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
          gap: 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* QR Preview */}
        <View
          className="w-full items-center justify-center rounded-3xl"
          style={{
            backgroundColor: activeBg.colors[0],
            minHeight: 220,
            paddingVertical: 28,
          }}
        >
          {activeBg.colors.length === 2 && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
                backgroundColor: activeBg.colors[1],
              }}
            />
          )}
          <View
            style={{
              borderRadius: Math.min(activeFrame.radius, 24),
              overflow: "hidden",
              backgroundColor: "white",
              padding: 12,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <QRCode
              value={publicCode || "BTK-PREVIEW"}
              size={160}
              quietZone={6}
            />
            {!!activeDecor.emoji && (
              <View
                className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text style={{ fontSize: 20 }}>{activeDecor.emoji}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Add Decor */}
        <View>
          <SectionTitle title="Add Decor" />
          <View className="flex-row justify-between px-2">
            {DECORS.map((d) => (
              <DecorOption
                key={d.id}
                item={d}
                selected={selectedDecor === d.id}
                onPress={() => setSelectedDecor(d.id)}
              />
            ))}
          </View>
        </View>

        {/* Background Style */}
        <View>
          <SectionTitle title="Background Style" />
          <View className="flex-row justify-between px-2">
            {BACKGROUNDS.map((b) => (
              <BgOption
                key={b.id}
                item={b}
                selected={selectedBg === b.id}
                onPress={() => setSelectedBg(b.id)}
              />
            ))}
          </View>
        </View>

        {/* Frame Styles */}
        <View>
          <SectionTitle title="Frame Styles" />
          <View className="flex-row justify-between px-2">
            {FRAMES.map((f) => (
              <FrameOption
                key={f.id}
                item={f}
                selected={selectedFrame === f.id}
                onPress={() => setSelectedFrame(f.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRCustomizeScreen;
