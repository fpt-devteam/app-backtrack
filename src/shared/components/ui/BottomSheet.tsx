import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import BottomSheetPrimitive, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: string[];
  enableDynamicSizing?: boolean;
  maxDynamicContentSize?: number;
};

export const BottomSheet = ({
  isVisible,
  onClose,
  children,
  snapPoints: customSnapPoints,
  enableDynamicSizing = true,
  maxDynamicContentSize,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheetPrimitive>(null);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const snapPoints = useMemo(
    () => customSnapPoints || ["25%", "50%", "75%"],
    [customSnapPoints],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.2}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetPrimitive
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={enableDynamicSizing ? undefined : snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "white" }}
      handleIndicatorStyle={{
        backgroundColor: "#D1D5DB",
        width: 40,
        height: 6,
      }}
      maxDynamicContentSize={maxDynamicContentSize}
      animationConfigs={{ duration: 90 }}
    >
      <BottomSheetScrollView style={{ paddingBottom: 12 }}>
        {children}
      </BottomSheetScrollView>
    </BottomSheetPrimitive>
  );
};
