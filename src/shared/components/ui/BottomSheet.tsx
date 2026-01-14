import type {
  BottomSheetBackdropProps
} from '@gorhom/bottom-sheet';
import BottomSheetPrimitive, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

type Props = {
  isVisible: boolean
  onClose: () => void
  children: React.ReactNode
  snapPoints?: string[]
  enableDynamicSizing?: boolean
  maxDynamicContentSize?: number
}

const BottomSheet = ({
  isVisible,
  onClose,
  children,
  snapPoints: customSnapPoints,
  enableDynamicSizing = true,
  maxDynamicContentSize,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheetPrimitive>(null)

  // Default snap points if not using dynamic sizing
  const snapPoints = useMemo(
    () => customSnapPoints || ['25%', '50%', '75%'],
    [customSnapPoints]
  )

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [isVisible])

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.2}
      />
    ),
    []
  )

  return (
    <BottomSheetPrimitive
      ref={bottomSheetRef}
      index={-1}
      snapPoints={enableDynamicSizing ? undefined : snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: 'white' }}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40, height: 6 }}
      maxDynamicContentSize={maxDynamicContentSize}
    >
      <BottomSheetView style={{ paddingBottom: 12 }}>
        {children}
      </BottomSheetView>
    </BottomSheetPrimitive>
  )
}

export default BottomSheet
