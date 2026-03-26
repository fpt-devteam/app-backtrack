import type { RelativePathString } from "expo-router";
import { router } from "expo-router";
import { BarcodeIcon, BinocularsIcon } from "phosphor-react-native";
import React, { useMemo } from "react";

import { MenuBottomSheet, type MenuOption } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";

import * as BottomSheetUtil from "@/src/shared/utils/bottom-sheet.utils";

type PostCreateOptionsBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

const PostCreateOptionsBottomSheet = ({
  isVisible,
  onClose,
}: PostCreateOptionsBottomSheetProps) => {
  const goTo = (href: RelativePathString) => {
    onClose();
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
          router.push(
            `${POST_ROUTE.create}?postType=Lost` as RelativePathString,
          ),
      },
      {
        id: "add-found-post",
        icon: BarcodeIcon,
        label: "Add Found Item",
        onPress: () =>
          router.push(
            `${POST_ROUTE.create}?postType=Found` as RelativePathString,
          ),
      },
    ],
    [onClose],
  );

  return (
    <MenuBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      options={options}
    />
  );
};

export default PostCreateOptionsBottomSheet;
