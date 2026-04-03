import { colors } from "@/src/shared/theme/colors";
import { cn } from "@/src/shared/utils/cn";
import { router } from "expo-router";
import {
  CaretLeftIcon,
  DotsThreeIcon,
  IconProps,
  XIcon,
} from "phosphor-react-native";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from "react-native";

type AppHeaderProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

export const AppHeader = ({
  left,
  center,
  right,
  className,
}: AppHeaderProps) => {
  return (
    <View className={cn("flex-row h-16 overflow-hidden px-4", className)}>
      <View className="flex-row flex-1 items-center justify-start">{left}</View>

      <View className="flex-row items-center justify-center shrink-0">
        {center}
      </View>

      <View className="flex-row flex-1 items-center justify-end gap-2">
        {right}
      </View>
    </View>
  );
};

// Icon Buttons
interface IconButtonProps extends PressableProps {
  icon: React.ComponentType<IconProps>;
}

const IconButton = ({ icon: Icon, ...props }: IconButtonProps) => {
  return (
    <Pressable {...props}>
      <Icon size={24} color={colors.black} weight="bold" />
    </Pressable>
  );
};

export const BackButton = (props: PressableProps) => (
  <IconButton icon={CaretLeftIcon} onPress={() => router.back()} {...props} />
);

export const CloseButton = (props: PressableProps) => (
  <IconButton icon={XIcon} onPress={() => router.back()} {...props} />
);

export const DotsThreeButton = (props: PressableProps) => (
  <IconButton icon={DotsThreeIcon} {...props} />
);

// Text Button
interface TextButtonProps extends PressableProps {
  label: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
}
export const TextButton = ({
  label,
  isSubmitting,
  disabled,
  className,
  ...props
}: TextButtonProps) => (
  <Pressable
    disabled={disabled}
    style={({ pressed }) => ({
      opacity: pressed ? 0.5 : 1,
    })}
    {...props}
    className={cn("items-center justify-center min-w-20", className)}
  >
    {isSubmitting ? (
      <ActivityIndicator />
    ) : (
      <Text
        className={cn(
          "text-base font-semibold",
          disabled ? "text-muted" : "text-main",
        )}
      >
        {label}
      </Text>
    )}
  </Pressable>
);

// Header Title
export const HeaderTitle = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => (
  <View className={cn("min-w-80 items-start", className)}>
    <Text className="text-2xl font-semibold text-main">{title}</Text>
  </View>
);
