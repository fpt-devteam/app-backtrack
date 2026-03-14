import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { SparkleIcon } from "phosphor-react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

import { QR_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";

type PremiumCTAButtonProps = {
  onPress: () => void;
};

export const PremiumCTAButton = ({ onPress }: PremiumCTAButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderGlowAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(borderGlowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(borderGlowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ]),
      ]),
    ).start();
  }, []);

  const borderColor = borderGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, "#FFDF00"],
  });

  return (
    <Animated.View
      style={{
        marginTop: "auto",
        width: "100%",
        borderRadius: 16,
        borderWidth: 2,
        borderColor: borderColor,
        backgroundColor: colors.primary,
        overflow: "hidden",
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Animated.View
          className="flex-row items-center justify-center py-4 px-6"
          style={{ transform: [{ scale: scaleAnim }] }}
        >
          <SparkleIcon size={20} color="#FFD700" weight="fill" />

          <Text className="text-white font-bold text-base ml-2">
            Upgrade to
          </Text>

          <View
            className="ml-2 bg-amber-400 px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: "#FFD700",
              transform: [{ skewX: "-10deg" }],
            }}
          >
            <Text className="text-[11px] font-extrabold text-primary uppercase italic">
              PRO
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};
