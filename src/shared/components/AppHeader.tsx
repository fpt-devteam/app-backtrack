import { PostType } from '@/src/features/post/types';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { POST_ROUTE, PROFILE_ROUTE } from '../constants/route.constant';
import AvatarIcon from './AvatarIcon';
const FABGroup = FAB.Group;

type AppHeaderProps = {
  onPressAdd?: () => void
  onPressBell?: () => void
}

const AppHeader = ({ onPressAdd, onPressBell }: AppHeaderProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View className="bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-6 py-3">
        <Text className="text-3xl font-normal text-slate-900">Backtrack</Text>

        {/* Add Button */}
        <CreateFabDropdown />

        {/* Profile */}
        <TouchableOpacity
          onPress={() => router.push(PROFILE_ROUTE.index)}
          className="h-12 w-12 items-center justify-center rounded-full "
        >
          <AvatarIcon size={42} />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-slate-200/70" />
    </View>
  )
}

const CreateFabDropdown = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Portal>
      <FABGroup
        open={open}
        visible
        icon={open ? "close" : "plus"}
        onStateChange={({ open }) => setOpen(open)}
        actions={[
          {
            icon: "alert-circle-outline",
            label: "Post Lost",
            onPress: () => router.push({
              pathname: POST_ROUTE.create,
              params: {
                postType: PostType.Lost,
                mode: 'create',
              }
            }),
          },
          {
            icon: "check-circle-outline",
            label: "Post Found",
            onPress: () => router.push({
              pathname: POST_ROUTE.create,
              params: {
                postType: PostType.Found,
                mode: 'create',
              }
            }),
          },
        ]}
      />
    </Portal>
  );
}

export default AppHeader;
