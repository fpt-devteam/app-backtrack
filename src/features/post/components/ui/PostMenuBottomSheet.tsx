import type { RelativePathString } from "expo-router";
import { router } from "expo-router";
import { BarcodeIcon, BinocularsIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MenuBottomSheet, type MenuOption } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";

import * as BottomSheetUtil from "@/src/shared/utils/bottom-sheet.utils";

export function PostMenuBottomSheet() {
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
        id: "add-lost-post",
        icon: BinocularsIcon,
        label: "Add Lost Item",
        onPress: () =>
          goTo(`${POST_ROUTE.create}?postType=Lost` as RelativePathString),
      },
      {
        id: "add-found-post",
        icon: BarcodeIcon,
        label: "Add Found Item",
        onPress: () =>
          goTo(`${POST_ROUTE.create}?postType=Found` as RelativePathString),
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
