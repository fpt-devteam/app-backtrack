import SuggestRow from "@/src/shared/components/ui/SuggestRow";
import type { RecentLocationSearch } from "@/src/shared/services";
import { colors } from "@/src/shared/theme";
import { Clock, MapPin } from "phosphor-react-native";
import type { Animated as AnimatedType } from "react-native";
import { ActivityIndicator, Animated, FlatList, Pressable, Text, TouchableWithoutFeedback, View } from "react-native";

type DisplayType = "recent" | "suggest";

type LocationSearchPanelProps = {
  readonly showPanel: boolean;
  readonly displayType: DisplayType;
  readonly displayData: readonly RecentLocationSearch[];
  readonly loadingSuggestions: boolean;
  readonly recent: readonly RecentLocationSearch[];
  readonly fade: AnimatedType.Value;
  readonly slide: AnimatedType.Value;
  readonly onSelectSuggestion: (item: RecentLocationSearch) => void;
  readonly onSelectRecent: (item: RecentLocationSearch) => void;
  readonly onRemoveRecent: (placeId: string) => void;
  readonly onClearRecent: () => void;
};

export default function LocationSearchPanel({
  showPanel,
  displayType,
  displayData,
  loadingSuggestions,
  recent,
  fade,
  slide,
  onSelectSuggestion,
  onSelectRecent,
  onRemoveRecent,
  onClearRecent,
}: LocationSearchPanelProps) {
  if (!showPanel) return null;

  const title = displayType === "suggest" ? "Suggestions" : "Recent";

  return (
    <TouchableWithoutFeedback>
      <View
        className="mt-2 bg-white rounded-2xl p-3"
        style={{
          maxHeight: 300,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-semibold">{title}</Text>

          {displayType === "recent" && recent.length > 0 ? (
            <Pressable onPress={onClearRecent} hitSlop={10}>
              <Text className="text-blue-600 font-semibold">Clear</Text>
            </Pressable>
          ) : null}
        </View>

        <Animated.View
          style={{ opacity: fade, transform: [{ translateY: slide }] }}
        >
          {loadingSuggestions && displayType === "suggest" ? (
            <View className="p-3 items-center">
              <ActivityIndicator size="small" color={colors.blue[600]} />
            </View>
          ) : (
            <FlatList
              data={displayData}
              keyExtractor={(item) => item.placeId}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                if (displayType === "suggest") {
                  return (
                    <SuggestRow
                      IconComponent={MapPin}
                      text={item.label}
                      onPress={() => onSelectSuggestion(item)}
                    />
                  );
                }

                return (
                  <SuggestRow
                    IconComponent={Clock}
                    text={item.label}
                    onPress={() => onSelectRecent(item)}
                    onRemove={() => onRemoveRecent(item.placeId)}
                  />
                );
              }}
            />
          )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}
