import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

const TAB_BAR_HEIGHT = 50;
const ANIMATION_DURATION = 200;

interface AppFooterProps extends BottomTabBarProps {
  isChromeVisible: boolean;
}

const AppFooter = (props: AppFooterProps) => {
  const { isChromeVisible, state, descriptors, navigation } = props;
  const tabBarAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(tabBarAnim, {
      toValue: isChromeVisible ? 1 : 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [isChromeVisible, tabBarAnim]);

  return (
    <Animated.View
      style={[
        styles.tabBarContainer,
        {
          opacity: tabBarAnim,
          transform: [
            {
              translateY: tabBarAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [TAB_BAR_HEIGHT, 0],
              }),
            },
          ],
        },
      ]}
      pointerEvents={isChromeVisible ? 'auto' : 'none'}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const color = isFocused ? '#007AFF' : '#8E8E93';

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
          >
            {options.tabBarIcon?.({
              focused: isFocused,
              color,
              size: 24
            })}
            <Text style={[styles.tabLabel, { color }]}>
              {label as string}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});

export default AppFooter;
