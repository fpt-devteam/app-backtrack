import type { RelativePathString } from "expo-router";
import { router } from "expo-router";
import { BarcodeIcon, QrCodeIcon, ShoppingCartIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MenuBottomSheet, type MenuOption } from "@/src/shared/components";
import { QR_ROUTE } from "@/src/shared/constants";

const CLOSE_MS = 90; // nên gần với duration animationConfigs của BottomSheet (vd 120-180ms)

export default function QrMenuBottomSheet() {
  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    setVisible(false);
    // đóng sheet xong thì pop modal
    setTimeout(() => {
      router.back();
    }, CLOSE_MS);
  };

  const goTo = (href: RelativePathString) => {
    setVisible(false);
    // đóng sheet xong thì REPLACE modal route bằng route đích
    setTimeout(() => {
      router.replace(href);
    }, CLOSE_MS);
  };

  const options: MenuOption[] = useMemo(
    () => [
      {
        id: "generate-digital-qr",
        icon: QrCodeIcon,
        label: "Generate Digital QR",
        onPress: () => goTo(QR_ROUTE.generate as RelativePathString),
      },
      {
        id: "scan-qr-to-link",
        icon: BarcodeIcon,
        label: "Scan QR to Link",
        onPress: () => {
          // goTo("/qr/scan" as RelativePathString);
          dismiss();
        },
      },
      {
        id: "buy-physical-qr",
        icon: ShoppingCartIcon,
        label: "Buy Physical QR",
        onPress: () => {
          // goTo("/qr/buy" as RelativePathString);
          dismiss();
        },
      },
    ],
    []
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Backdrop */}
      <Pressable
        onPress={dismiss}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.35)" }]}
      />

      <MenuBottomSheet
        isVisible={visible}
        options={options}
        onClose={dismiss}
      />
    </View>
  );
}
