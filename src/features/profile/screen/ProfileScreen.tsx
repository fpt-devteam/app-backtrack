import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import type {
  TabBarProps as RNTabBarProps,
  Route,
} from "react-native-tab-view";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import { useAppUser, useAuth } from "@/src/features/auth/providers";
import type { Post } from "@/src/features/post/types";
import { AppImage, AppUserAvatar } from "@/src/shared/components";
import { AUTH_ROUTE, POST_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";

import { useGetAllMyPost } from "@/src/features/post/hooks";
import * as Haptics from "expo-haptics";

import { PostStatusBadge } from "@/src/features/post/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import {
  IconProps,
  PackageIcon,
  QrCodeIcon,
  UserCircleIcon,
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
  const imageUrl = post.imageUrls?.[0]?.url;

  const handleOpenPost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(POST_ROUTE.details(post.id));
  };

  return (
    <TouchableOpacity
      onPress={handleOpenPost}
      style={{ width: size, height: size }}
      className="aspect-square"
    >
      <AppImage
        source={{ uri: imageUrl }}
        style={{ width: size, height: size }}
        resizeMode="cover"
      />

      {/* Post Status Badge "Lost/Found" */}
      <View className="absolute top-0 right-0 p-1">
        <PostStatusBadge status={post.postType} size="sm" />
      </View>
    </TouchableOpacity>
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
      <View className="flex-1 bg-canvas items-center justify-center">
        <ActivityIndicator color={colors.black} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-canvas items-center justify-center px-8">
        <Text className="text-textSecondary text-center">
          Unable to load posts
        </Text>
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
      data={data || []}
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
        <EmptyList
          icon={<PackageIcon size={96} weight="light" color={colors.primary} />}
          title="No Posts Yet"
          subtitle="Your posts will appear here once you create them."
        />
      }
    />
  );
};

const QRScene = () => {
  return (
    <EmptyList
      icon={<QrCodeIcon size={96} weight="light" color={colors.primary} />}
      title="No QR Codes Yet"
      subtitle="Your QR codes will appear here once you create them."
    />
  );
};

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

  const { isAppReady, isLoggedIn } = useAuth();
  const isAuthReady = isAppReady && isLoggedIn;

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

  if (!isAuthReady) {
    return (
      <View
        className="flex-1 bg-surface px-10 gap-10 pt-20"
        style={{ paddingTop: layout.height * 0.15 }}
      >
        <View className="flex-row justify-center">
          <UserCircleIcon size={128} color={colors.primary} />
        </View>

        <View className="gap-y-2">
          <Text className="text-xl font-normal text-textPrimary text-center">
            Log in to view your profile
          </Text>

          <Text className="text-base font-thin text-textSecondary text-center leading-6">
            Once you log in, you will find all your conversations here.
          </Text>
        </View>

        <TouchableOpacity
          className="w-full py-5 rounded-sm bg-primary items-center justify-center"
          onPress={() => router.push(AUTH_ROUTE.onboarding)}
          activeOpacity={0.8}
        >
          <Text className="text-base font-normal text-white text-center">
            Log in or Sign up
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* Info Header */}
      <View className="items-center py-8 px-4 bg-surface">
        <View className="flex-col items-center gap-4">
          <AppUserAvatar size={128} avatarUrl={avatarSource} />
          <Text className="text-lg font-extrabold text-textPrimary">
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
  );
}
