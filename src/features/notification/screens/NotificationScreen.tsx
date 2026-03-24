import { NotificationRow } from "@/src/features/notification/components";
import {
  useNotifications,
  useUpdateNotificationStatus,
} from "@/src/features/notification/hooks";
import {
  NOTIFICATION_STATUS,
  type UserNotification,
} from "@/src/features/notification/types";
import {
  AppLoader,
  ChipsRow,
  TouchableIconButton,
} from "@/src/shared/components";
import EmptyList from "@/src/shared/components/ui/EmptyList";
import { SHARED_ROUTE } from "@/src/shared/constants";
import { colors } from "@/src/shared/theme";
import { RelativePathString, router } from "expo-router";
import {
  ArchiveIcon,
  BellSimpleSlashIcon,
  CaretLeftIcon,
  EnvelopeSimpleIcon,
  EnvelopeSimpleOpenIcon,
} from "phosphor-react-native";
import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "unread" | "archived";

const NotificationScreen = () => {
  const [mode, setMode] = useState<"normal" | "candidate">("normal");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>("all");

  const filterRef = useRef<FilterType>("all");

  const handleChangeFilter = (newFilter: FilterType) => {
    setFilter(newFilter);
    filterRef.current = newFilter;
  };

  const getFilterStatus = (filterType: FilterType) => {
    if (filterType === "all") return undefined;
    if (filterType === "unread") return NOTIFICATION_STATUS.Unread;
    return NOTIFICATION_STATUS.Archived;
  };

  const filterStatus = getFilterStatus(filterRef.current);

  const { items, isLoading, hasMore, loadMore, isLoadingNextPage } =
    useNotifications({ status: filterStatus });

  const allItems = items;

  const { updateStatus, isUpdatingStatus } = useUpdateNotificationStatus();

  const selectedIdList = Array.from(selectedIds);
  const selectedCount = selectedIdList.length;

  const firstSelected = React.useMemo(() => {
    if (selectedCount === 0) return null;
    const firstId = selectedIdList[0];
    return allItems.find((x) => x.id === firstId) ?? null;
  }, [allItems, selectedIdList, selectedCount]);

  const isFirstSelectedRead =
    firstSelected?.status === NOTIFICATION_STATUS.Read;
  const markNextValue = isFirstSelectedRead
    ? NOTIFICATION_STATUS.Unread
    : NOTIFICATION_STATUS.Read;

  const onExitCandidate = () => {
    setMode("normal");
    setSelectedIds(new Set());
  };

  const onBulkMark = async () => {
    if (selectedCount === 0) return;
    try {
      await updateStatus({
        notificationIds: selectedIdList,
        status: markNextValue,
      });
      onExitCandidate();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const onBulkArchive = async () => {
    if (selectedCount === 0) return;
    try {
      await updateStatus({
        notificationIds: selectedIdList,
        status: NOTIFICATION_STATUS.Archived,
      });
      onExitCandidate();
    } catch (error) {
      console.error("Failed to archive:", error);
    }
  };

  const handleLongPress = (notification: UserNotification) => {
    setMode("candidate");
    setSelectedIds(new Set([notification.id]));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNormalPress = async (notification: UserNotification) => {
    try {
      await updateStatus({
        notificationIds: [notification.id],
        status: NOTIFICATION_STATUS.Read,
      });

      const screenPath = notification.data?.screenPath as RelativePathString;

      if (screenPath) {
        router.push(screenPath);
      } else {
        router.push(SHARED_ROUTE.notAvailable);
      }
    } catch (error) {
      console.log("Error when update notification status: ", error);
      router.push(SHARED_ROUTE.notAvailable);
      return;
    }
  };

  const handleEndReached = () => {
    if (hasMore && !isLoadingNextPage) {
      loadMore();
    }
  };

  const renderItem = ({ item }: { item: UserNotification }) => (
    <NotificationRow
      mode={mode}
      notification={item}
      isSelected={selectedIds.has(item.id)}
      onLongPress={handleLongPress}
      onPress={handleNormalPress}
      onToggleSelect={handleToggleSelect}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <EmptyList
        icon={
          <BellSimpleSlashIcon
            size={96}
            weight="light"
            color={colors.primary}
          />
        }
        title="You don't have any notifications yet."
        subtitle="Once you receive notifications, they will appear here."
        backButton={null}
      />
    );
  };

  const renderFooter = () => {
    if (!isLoadingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0ea5e9" />
      </View>
    );
  };

  const colorIcon = useMemo(() => {
    return selectedCount === 0 || isUpdatingStatus
      ? colors.slate[400]
      : colors.primary;
  }, [selectedCount, isUpdatingStatus]);

  return (
    <SafeAreaView className="flex-1 bg-white pb-[56px] px-4">
      {/* Screen Header  */}
      <View className="flex-row items-center gap-2 h-16 pr-4">
        <TouchableIconButton
          icon={<CaretLeftIcon size={28} weight="bold" />}
          onPress={() => {
            router.back();
          }}
        />
        <View className="flex-1 items-start ">
          <Text className="text-xl font-semibold text-main">Notifications</Text>
        </View>

        {mode === "candidate" && (
          <View className="bg-white flex-row items-center justify-between gap-4">
            {/* Mark as Read/Unread Button */}
            <TouchableIconButton
              onPress={onBulkMark}
              disabled={selectedCount === 0 || isUpdatingStatus}
              icon={
                isFirstSelectedRead ? (
                  <EnvelopeSimpleIcon
                    size={24}
                    color={colorIcon}
                    weight="regular"
                  />
                ) : (
                  <EnvelopeSimpleOpenIcon
                    size={24}
                    color={colorIcon}
                    weight="regular"
                  />
                )
              }
            />

            {/* Archive Button */}
            <TouchableIconButton
              onPress={onBulkArchive}
              disabled={selectedCount === 0 || isUpdatingStatus}
              icon={
                <ArchiveIcon size={24} color={colorIcon} weight="regular" />
              }
            />
          </View>
        )}
      </View>

      {/* Filter Chips */}
      <View className="py-4 pt-0">
        <ChipsRow
          chips={[
            {
              label: "All",
              selected: filter === "all",
              onPress: () => handleChangeFilter("all"),
              disabled: mode === "candidate",
            },
            {
              label: "Unread",
              selected: filter === "unread",
              onPress: () => handleChangeFilter("unread"),
              disabled: mode === "candidate",
            },
            {
              label: "Archived",
              selected: filter === "archived",
              onPress: () => handleChangeFilter("archived"),
              disabled: mode === "candidate",
            },
          ]}
        />
      </View>

      {isLoading && allItems.length === 0 ? (
        <AppLoader />
      ) : (
        <FlatList
          data={allItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
