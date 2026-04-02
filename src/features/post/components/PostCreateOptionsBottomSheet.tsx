import type { RelativePathString } from "expo-router";
import { router } from "expo-router";
import { BarcodeIcon, BinocularsIcon } from "phosphor-react-native";
import React, { useMemo } from "react";

import {
  MenuBottomSheet,
  type MenuOption,
} from "@/src/shared/components/ui/MenuBottomSheet";
import { POST_ROUTE } from "@/src/shared/constants";

type PostCreateOptionsBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

const PostCreateOptionsBottomSheet = ({
  isVisible,
  onClose,
}: PostCreateOptionsBottomSheetProps) => {
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
