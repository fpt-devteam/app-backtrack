import type { RelativePathString } from "expo-router";
import { router } from "expo-router";
import {
  BarcodeIcon,
  QrCodeIcon,
  ShoppingCartIcon,
} from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MenuBottomSheet, type MenuOption } from "@/src/shared/components";
import { QR_ROUTE } from "@/src/shared/constants";
import * as BottomSheetUtil from "@/src/shared/utils";

export function QRMenuBottomSheet() {
  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => {
      router.back();
    }, BottomSheetUtil.CLOSE_TIME_MS);
  };

  const goTo = (href: RelativePathString) => {
    setVisible(false);
    setTimeout(() => {
      router.replace(href);
    }, BottomSheetUtil.CLOSE_TIME_MS);
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
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Backdrop */}
      <Pressable
        onPress={dismiss}
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(0,0,0,0.35)" },
        ]}
      />

      <MenuBottomSheet
        isVisible={visible}
        options={options}
        onClose={dismiss}
      />
    </View>
  );
}
