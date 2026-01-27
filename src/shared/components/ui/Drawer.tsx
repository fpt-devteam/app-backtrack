import { colors } from "@/src/shared/theme/colors";
import { RelativePathString, router, usePathname } from "expo-router";
import { ListIcon, PaintBrushIcon, ShoppingBagIcon, XIcon, type IconProps } from "phosphor-react-native";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

export type DrawerTab = {
  name: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  route: string;
};

type DrawerContextType = {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  tabs: DrawerTab[];
};

const DrawerContext = createContext<DrawerContextType>({
  isOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  tabs: [],
});

export const useDrawer = () => useContext(DrawerContext);

type DrawerProviderProps = {
  children: React.ReactNode;
  tabs: DrawerTab[];
};

export const DrawerProvider = ({ children, tabs }: DrawerProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const [overlayAnim] = useState(new Animated.Value(0));

  const openDrawer = useCallback(() => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, overlayAnim]);

  const closeDrawer = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  }, [slideAnim, overlayAnim]);

  const pathname = usePathname();

  const handleTabPress = (route: string) => {
    closeDrawer();
    setTimeout(() => {
      router.push(route as RelativePathString);
    }, 200);
  };

  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, tabs }}>
      {children}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
        statusBarTranslucent
      >
        <View className="flex-1">
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: overlayAnim,
            }}
          >
            <Pressable className="flex-1" onPress={closeDrawer} />
          </Animated.View>

          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: DRAWER_WIDTH,
              backgroundColor: colors.background,
              transform: [{ translateX: slideAnim }],
            }}
          >
            <View className="flex-1 pt-16 px-4">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-2xl font-bold text-main">Menu</Text>
                <Pressable
                  onPress={closeDrawer}
                  className="w-10 h-10 items-center justify-center rounded-full"
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <XIcon size={24} color={colors.black} />
                </Pressable>
              </View>

              <View className="gap-2">
                {tabs.map((tab) => {
                  const isFocused = pathname === tab.route || pathname.startsWith(tab.route + "/");
                  const Icon = tab.icon;

                  return (
                    <Pressable
                      key={tab.name}
                      onPress={() => handleTabPress(tab.route)}
                      className="flex-row items-center p-4 rounded-2xl"
                      style={{
                        backgroundColor: isFocused ? colors.sky[50] : "transparent",
                      }}
                    >
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{
                          backgroundColor: isFocused ? colors.primary : colors.slate[100],
                        }}
                      >
                        <Icon
                          size={20}
                          color={isFocused ? colors.white : colors.slate[500]}
                          weight={isFocused ? "fill" : "regular"}
                        />
                      </View>
                      <Text
                        className="text-base font-medium"
                        style={{
                          color: isFocused ? colors.primary : colors.slate[700],
                        }}
                      >
                        {tab.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </DrawerContext.Provider>
  );
};

export const DrawerMenuButton = ({ onPress }: { onPress?: () => void }) => {
  const { openDrawer } = useDrawer();

  return (
    <Pressable
      onPress={onPress ?? openDrawer}
      className="w-10 h-10 items-center justify-center rounded-full"
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      hitSlop={10}
    >
      <ListIcon size={24} color={colors.black} weight="bold" />
    </Pressable>
  );
};

export const defaultQRDrawerTabs: DrawerTab[] = [
  {
    name: "items",
    label: "Items",
    icon: ListIcon,
    route: "/qr",
  },
  {
    name: "design-qr",
    label: "Design QR",
    icon: PaintBrushIcon,
    route: "/qr/design-qr",
  },
  {
    name: "shop",
    label: "Shop",
    icon: ShoppingBagIcon,
    route: "/qr/shop",
  },
];
