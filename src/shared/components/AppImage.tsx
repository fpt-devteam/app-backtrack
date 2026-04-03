import React, { useState } from "react";
import type { ImageProps } from "react-native";
import { Image, View } from "react-native";

type AppImageProps = ImageProps & {
  className?: string;
};

export const AppImage = ({ source, className, ...rest }: AppImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const hasSource = (() => {
    if (!source) return false;
    if (typeof source === "number") return true;
    if (Array.isArray(source)) return source.some((item) => Boolean(item?.uri));
    return Boolean(source.uri);
  })();

  return (
    <View className={`relative overflow-hidden bg-slate-50 ${className}`}>
      {hasSource && (
        <Image
          source={source}
          className="w-full h-full"
          onLoadEnd={() => {
            setIsLoading(false);
          }}
          {...rest}
        />
      )}

      {(isLoading || !hasSource) && (
        <View className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
    </View>
  );
};
