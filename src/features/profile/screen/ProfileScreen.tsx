import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type {
  TabBarProps as RNTabBarProps,
  Route,
} from "react-native-tab-view";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import { useAppUser } from "@/src/features/auth/providers";
import type { Post } from "@/src/features/post/types";
import {
  AppHeader,
  AppUserAvatar,
  TouchableIconButton,
} from "@/src/shared/components";
import { POST_ROUTE, PROFILE_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";

import { useGetAllMyPost } from "@/src/features/post/hooks";
import {
  GearIcon,
  IconProps,
  ListIcon,
  PackageIcon,
  PencilSimpleIcon,
  QrCodeIcon,
} from "phosphor-react-native";

type RouteProps = {
  key: Route["key"];
  title: string;
  tabIcon: React.ElementType<IconProps>;
};

const GRID_COLUMNS = 3;
const GRID_GAP = 2;
const GRID_PADDING = 8;

const GridSeparator = () => <View style={{ height: GRID_GAP }} />;

const ProfilePostGridItem = ({ post, size }: { post: Post; size: number }) => {
  const imageUrl = post.images?.[0]?.url;

  const handleOpenPost = () => {
    router.push(POST_ROUTE.details(post.id));
  };

  return (
    <Pressable
      onPress={handleOpenPost}
      style={{ width: size, height: size }}
      className="bg-slate-200"
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-slate-100">
          <PackageIcon size={24} color={colors.slate[400]} weight="light" />
        </View>
      )}
    </Pressable>
  );
};

const PostScene = () => {
  const { width } = useWindowDimensions();
  const { data, isLoading, error, refetch } = useGetAllMyPost();

  const itemSize = useMemo(() => {
    const totalGap = GRID_GAP * (GRID_COLUMNS - 1);
    const totalPadding = GRID_PADDING * 2;
    return Math.floor((width - totalPadding - totalGap) / GRID_COLUMNS);
  }, [width]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator color={colors.black} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-8">
        <Text className="text-slate-500 text-center">Unable to load posts</Text>
        <Pressable
          onPress={() => refetch()}
          className="mt-3 px-4 py-2 bg-black rounded-full"
        >
          <Text className="text-white font-semibold">Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(item) => item.id}
      numColumns={GRID_COLUMNS}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: GRID_PADDING,
        paddingVertical: GRID_PADDING,
      }}
      columnWrapperStyle={{ gap: GRID_GAP }}
      ItemSeparatorComponent={GridSeparator}
      renderItem={({ item }) => (
        <ProfilePostGridItem post={item} size={itemSize} />
      )}
      ListEmptyComponent={
        <View className="flex-1 bg-slate-50 items-center justify-center py-24">
          <PackageIcon size={48} color={colors.slate[300]} weight="light" />
          <Text className="text-slate-400 mt-4 text-center font-medium">
            No posts yet
          </Text>
        </View>
      }
    />
  );
};

const QRScene = () => (
  <View className="flex-1 bg-slate-50 items-center justify-center p-10">
    <QrCodeIcon size={48} color={colors.slate[300]} weight="light" />
    <Text className="text-slate-400 mt-4 text-center font-medium">
      No QR codes yet
    </Text>
  </View>
);

const renderScene = SceneMap({
  posts: PostScene,
  qr: QRScene,
});

const renderTabIcon = ({
  route,
  focused,
  color: _color,
  size: _size,
}: {
  route: RouteProps;
  focused: boolean;
  color: string;
  size: number;
}) => (
  <route.tabIcon
    weight="fill"
    size={24}
    color={focused ? colors.black : colors.gray[400]}
  />
);

const CustomTabBar = (props: RNTabBarProps<RouteProps>) => {
  const layout = useWindowDimensions();

  const TAB_COUNT = props.navigationState.routes.length;
  const TAB_WIDTH = layout.width / TAB_COUNT;
  const INDICATOR_WIDTH = 24;
  const INDICATOR_MARGIN = (TAB_WIDTH - INDICATOR_WIDTH) / 2;

  return (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.black,
        width: INDICATOR_WIDTH,
        marginLeft: INDICATOR_MARGIN,
      }}
      indicatorContainerStyle={{
        borderBottomWidth: 0.5,
        borderBottomColor: colors.slate[100],
      }}
      style={{ backgroundColor: "transparent" }}
    />
  );
};

export function ProfileScreen() {
  const layout = useWindowDimensions();
  const { user } = useAppUser();
  const [index, setIndex] = useState(0);

  const [routes] = useState<RouteProps[]>([
    { key: "posts", title: "Post", tabIcon: PackageIcon },
    { key: "qr", title: "QR Code", tabIcon: QrCodeIcon },
  ]);

  const displayName = useMemo(
    () => user?.displayName?.trim() || user?.email || "User",
    [user?.displayName, user?.email],
  );

  const avatarSource = useMemo(() => {
    return user?.avatarUrl;
  }, [user?.avatarUrl]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ProfileScreenHeader />

      <View className="flex-1">
        {/* Info Header */}
        <View className="items-center py-8 px-4 bg-white">
          <View className="flex-col items-center gap-4">
            <AppUserAvatar size={128} avatarUrl={avatarSource} />
            <Text className="text-lg font-extrabold text-slate-900">
              {displayName}
            </Text>
          </View>
        </View>

        {/* TabView Area */}
        <TabView<RouteProps>
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={CustomTabBar}
          swipeEnabled={true}
          commonOptions={{
            icon: renderTabIcon,
            label: () => null,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const ProfileScreenHeader = () => {
  const handleNavigateSettingScreen = () => {
    router.push(PROFILE_ROUTE.setting);
  };

  const handleNavigateEditProfileScreen = () => {
    router.push(PROFILE_ROUTE.edit);
  };

  const handleNavigateMenuTabScreen = () => {
    router.push(PROFILE_ROUTE.menuTab);
  };

  return (
    <AppHeader
      left={
        <TouchableIconButton
          onPress={handleNavigateMenuTabScreen}
          icon={<ListIcon size={28} color={colors.black} />}
        />
      }
      center={
        <Text className="text-lg font-extrabold text-slate-900">Profile</Text>
      }
      right={
        <View className="flex-row gap-4">
          <TouchableIconButton
            onPress={handleNavigateEditProfileScreen}
            icon={<PencilSimpleIcon size={28} color={colors.black} />}
          />

          <TouchableIconButton
            onPress={handleNavigateSettingScreen}
            icon={<GearIcon size={28} color={colors.black} />}
          />
        </View>
      }
    />
  );
};