import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, View } from 'react-native';

type Props = {
  isAnonymous?: boolean
  avatarUrl?: string
  size?: number
  showBorder?: boolean
  borderColor?: string
  borderWidth?: number
}

const AppAvatarIcon = ({
  isAnonymous = false,
  avatarUrl,
  size = 40,
  showBorder = true,
  borderColor = '#e5e7eb',
  borderWidth = 2,
}: Props) => {
  const [imageError, setImageError] = useState(false);
  const shouldShowImage = avatarUrl && !isAnonymous && !imageError;

  // Fallback icon view
  if (!shouldShowImage) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#f3f4f6',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: showBorder ? borderWidth : 0,
          borderColor: borderColor,
        }}
      >
        <Ionicons
          name="person"
          size={size * 0.5}
          color="#9ca3af"
        />
      </View>
    );
  }

  // Avatar image with border and shadow
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: showBorder ? borderWidth : 0,
        borderColor: borderColor,
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: avatarUrl }}
        style={{
          width: '100%',
          height: '100%',
        }}
        onError={() => setImageError(true)}
        resizeMode="cover"
      />
    </View>
  );
}

export default AppAvatarIcon
