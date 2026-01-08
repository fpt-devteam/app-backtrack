import React from 'react'
import { View } from 'react-native'
import Modal from 'react-native-modal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  isVisible: boolean
  onClose: () => void
  children: React.ReactNode
}

const BottomSheet = ({ isVisible, onClose, children }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{
        margin: 0,
        justifyContent: 'flex-end'
      }}
      backdropOpacity={0.2}
      useNativeDriver
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      avoidKeyboard
    >
      <View
        className="bg-white rounded-3xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          paddingBottom: Math.max(insets.bottom, 12),
        }}
      >
        <View className="items-center mt-3">
          <View className="h-1.5 w-10 rounded-full bg-gray-300" />
        </View>

        {children}
      </View>
    </Modal>
  )
}

export default BottomSheet
