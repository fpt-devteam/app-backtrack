import React from 'react';
import { Text, View } from 'react-native';

type AppBrandProps = {
  size?: 'small' | 'medium' | 'large';
  color?: string;
};

const AppBrand = ({ size = 'medium', color = '#0ea5e9' }: AppBrandProps) => {
  const sizeStyles = {
    small: {
      fontSize: 20,
      letterSpacing: -0.3,
    },
    medium: {
      fontSize: 26,
      letterSpacing: -0.5,
    },
    large: {
      fontSize: 32,
      letterSpacing: -0.7,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View>
      <Text
        className="font-bold"
        style={{
          fontSize: currentSize.fontSize,
          letterSpacing: currentSize.letterSpacing,
          color: color,
        }}
      >
        Backtrack
      </Text>
    </View>
  );
};

export default AppBrand;

