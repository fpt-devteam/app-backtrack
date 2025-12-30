import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { Image } from 'react-native';

type Props = {
  isAnonymous?: boolean
  avatarUrl?: string
  size?: number
}

const AvatarIcon = ({
  isAnonymous = false,
  avatarUrl,
  size = 40,
}: Props) => {

  if (!avatarUrl || isAnonymous) return (<FontAwesome5 name="user-circle" size={size} color="black" />)

  return (<Image source={{ uri: avatarUrl }} style={{ width: size, height: size, borderRadius: size / 2 }} />)
}

export default AvatarIcon
