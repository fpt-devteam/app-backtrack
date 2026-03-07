import type { RelativePathString } from "expo-router";
import { router } from "expo-router";
import { BarcodeIcon, BinocularsIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MenuBottomSheet, type MenuOption } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";

import * as BottomSheetUtil from "@/src/shared/utils/bottom-sheet.utils";

export const AUTH_MENU_BOTTOM_SHEET = {
  ACCOUNT_EXIST: "AccountExist",
  ACCOUNT_NOT_VERIFY: "AccountNotVerify",
  EMAIL_VERIFICATION_RESEND: "EmailVerificationResend",
};

export type AuthMenuBottomSheetMode =
  (typeof AUTH_MENU_BOTTOM_SHEET)[keyof typeof AUTH_MENU_BOTTOM_SHEET];

type AuthMenuBottomSheetProps = {
  mode: AuthMenuBottomSheetMode;
};

export function AuthMenuBottomSheet({ mode }: AuthMenuBottomSheetProps) {
  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => {
      router.back();
    }, BottomSheetUtil.CLOSE_TIME_MS);
  };

  const handlePress = (href: RelativePathString) => {
    console.log("Navigating to:", href);
  };

  const options: MenuOption[] = useMemo(
    () => [
      {
        id: "add-lost-post",
        icon: BinocularsIcon,
        label: "Add Lost Item",
        onPress: () =>
          handlePress(
            `${POST_ROUTE.create}?postType=Lost` as RelativePathString,
          ),
      },
      {
        id: "add-found-post",
        icon: BarcodeIcon,
        label: "Add Found Item",
        onPress: () =>
          handlePress(
            `${POST_ROUTE.create}?postType=Found` as RelativePathString,
          ),
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
