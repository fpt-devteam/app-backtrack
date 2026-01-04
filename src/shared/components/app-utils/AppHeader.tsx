import { useAppUser } from '@/src/features/auth/providers/user.provider';
import { PostType } from '@/src/features/post/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  findNodeHandle,
} from 'react-native';
import { Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { POST_ROUTE, PROFILE_ROUTE } from '../../constants/route.constant';
import AppAvatarIcon from './AppAvatarIcon';
import AppBrand from './AppBrand';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AppHeader = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAppUser();

  return (
    <View
      className="bg-white"
      style={{
        paddingTop: insets.top,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Logo/Brand Name */}
        <View className="flex-1">
          <AppBrand size="medium" />
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center" style={{ gap: 12 }}>
          {/* Add Button with Dropdown */}
          <CreateMenuDropdown />

          {/* User Avatar */}
          <TouchableOpacity
            onPress={() => router.push(PROFILE_ROUTE.index)}
            activeOpacity={0.7}
          >
            <AppAvatarIcon
              size={40}
              avatarUrl={user?.avatar || undefined}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View className="h-[0.5px] bg-gray-200" />
    </View>
  )
}

type DropdownAction = {
  icon: string;
  label: string;
  onPress: () => void;
};

type CustomDropdownProps = {
  visible: boolean;
  onDismiss: () => void;
  anchorPosition: { x: number; y: number; width: number; height: number } | null;
  actions: DropdownAction[];
};

const CustomDropdown = ({ visible, onDismiss, anchorPosition, actions }: CustomDropdownProps) => {
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(0.8)).current;
  const animatedTranslateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    if (visible) {

      Animated.parallel([
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(animatedScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(animatedTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animatedScale, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animatedTranslateY, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, animatedOpacity, animatedScale, animatedTranslateY]);

  if (!visible || !anchorPosition) return null;

  const DROPDOWN_WIDTH = 220;
  const ARROW_SIZE = 8;
  const SPACING = 8;

  const dropdownTop = anchorPosition.y + anchorPosition.height + SPACING + ARROW_SIZE;

  let dropdownLeft = anchorPosition.x + anchorPosition.width / 2 - DROPDOWN_WIDTH / 2;
  dropdownLeft = Math.max(16, Math.min(dropdownLeft, SCREEN_WIDTH - DROPDOWN_WIDTH - 16));

  return (
    <Portal>
      <Modal
        transparent
        visible={visible}
        onRequestClose={onDismiss}
        animationType="none"
        statusBarTranslucent
      >
        {/* Overlay - click outside to dismiss */}
        <Pressable style={styles.overlay} onPress={onDismiss}>
          <View style={styles.dropdownContainer} pointerEvents="box-none">
            {/* Dropdown content */}
            <Animated.View
              style={[
                styles.dropdown,
                {
                  top: dropdownTop,
                  left: dropdownLeft,
                  width: DROPDOWN_WIDTH,
                  opacity: animatedOpacity,
                  transform: [
                    { scale: animatedScale },
                    { translateY: animatedTranslateY },
                  ],
                },
              ]}
            >
              {/* Prevent clicks from bubbling to overlay */}
              <Pressable onPress={(e) => e.stopPropagation()}>
                {actions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownItem,
                      index < actions.length - 1 && styles.dropdownItemBorder,
                    ]}
                    activeOpacity={0.7}
                    onPress={action.onPress}
                  >
                    <View style={styles.dropdownItemIcon}>
                      <Ionicons name={action.icon as any} size={20} color="#374151" />
                    </View>
                    <Text style={styles.dropdownItemText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </Pressable>
            </Animated.View>
          </View>
        </Pressable>
      </Modal>
    </Portal>
  );
};

const CreateMenuDropdown = () => {
  const [visible, setVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const buttonRef = useRef<View>(null);

  const measureButton = useCallback(() => {
    if (buttonRef.current) {
      const handle = findNodeHandle(buttonRef.current);
      if (handle) {

        (buttonRef.current as any).measureInWindow(
          (x: number, y: number, width: number, height: number) => {
            setAnchorPosition({ x, y, width, height });
          }
        );
      }
    }
  }, []);

  const openMenu = useCallback(() => {
    measureButton();

    requestAnimationFrame(() => {
      setVisible(true);
    });
  }, [measureButton]);

  const closeMenu = useCallback(() => {
    setVisible(false);
  }, []);

  const handleAction = useCallback((postType: PostType) => {

    setVisible(false);


    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        router.push({
          pathname: POST_ROUTE.create,
          params: {
            postType,
            mode: 'create',
          },
        });
      });
    });
  }, []);

  const actions: DropdownAction[] = [
    {
      icon: 'alert-circle-outline',
      label: 'Post Lost Item',
      onPress: () => handleAction(PostType.Lost),
    },
    {
      icon: 'checkmark-circle-outline',
      label: 'Post Found Item',
      onPress: () => handleAction(PostType.Found),
    },
  ];

  return (
    <>
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity
          onPress={openMenu}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          activeOpacity={0.6}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
          }}
        >
          <Ionicons name="add" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <CustomDropdown
        visible={visible}
        onDismiss={closeMenu}
        anchorPosition={anchorPosition}
        actions={actions}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  dropdownContainer: {
    flex: 1,
  },
  arrowContainer: {
    position: 'absolute',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  dropdownItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  dropdownItemIcon: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
});

export default AppHeader;
