import {
  usePlaceAutocomplete,
  usePlaceDetails,
  useReverseGeocoding,
  useUserCoordinates,
} from "@/src/features/map/hooks";
import type { PlacePrediction } from "@/src/features/map/types";
import { usePostCreationStore } from "@/src/features/post/hooks";
import { AppSearchRow } from "@/src/shared/components";
import { AppLocation } from "@/src/shared/store";
import { colors } from "@/src/shared/theme";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import {
  GpsFixIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from "phosphor-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

const IncidentSceneStepScreen = () => {
  const mapRef = useRef<MapView>(null);
  const inputRef = useRef<TextInput>(null);

  const { getPlaceDetails } = usePlaceDetails();
  const { reverseGeocode } = useReverseGeocoding();
  const { getUserCoordinates, loading } = useUserCoordinates();

  const { coords, address } = usePostCreationStore((state) => state.location);
  const setLocation = usePostCreationStore((state) => state.setLocation);

  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(address ?? "");

  const { predictions, loading: isSearching } = usePlaceAutocomplete({
    searchQuery: query,
    // enabled: false,
  });

  const mapRegion = useMemo<Region>(
    () => ({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [coords],
  );

  useEffect(() => {
    if (!location || !mapRef.current) return;
    mapRef.current.animateToRegion(mapRegion, 300);
  }, [location, mapRegion]);

  const handleFocus = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  const onChangeQuery = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleSelectSuggestion = useCallback(
    async (prediction: PlacePrediction) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      try {
        const placeDetail = await getPlaceDetails({
          placeId: prediction.placeId,
        });

        const newAppLocation: AppLocation = {
          coords: placeDetail.location,
          address: placeDetail.formattedAddress,
          placeId: prediction.placeId,
        };

        setLocation(newAppLocation);
        setQuery(placeDetail.formattedAddress);
        handleBlur();
      } catch (error) {
        console.log("Error fetching place details:", error);
      }
    },
    [getPlaceDetails],
  );

  const handleToggleNearby = useCallback(async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (loading) return;

    try {
      const coordinates = await getUserCoordinates();
      if (!coordinates) return;

      const req = { location: coordinates };
      const result = await reverseGeocode(req);

      const newAppLocation: AppLocation = {
        coords: coordinates,
        address: result.formattedAddress,
        placeId: result.placeId,
      };

      setLocation(newAppLocation);
      setQuery(result.formattedAddress);
      handleBlur();
    } catch (error) {
      console.log("Error fetching user coordinates:", error);
    }
  }, [getUserCoordinates, loading]);

  const showSuggestions = isFocused && query.length > 0;

  return (
    <View className="flex-1 bg-surface">
      {/* Map Background */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={mapRegion}
        onPress={handleBlur}
      >
        {coords && <Marker coordinate={coords} />}
      </MapView>

      {/* Search panel */}
      <View className="absolute left-lg right-lg top-md">
        <View
          className="rounded-md bg-surface"
          style={{
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}
        >
          <View className="gap-xs">
            {/* Search Input */}
            <View
              className="flex-row items-center rounded-md"
              style={{
                borderWidth: isFocused ? 1 : 0,
                borderColor: isFocused ? colors.secondary : colors.muted,
              }}
            >
              <View className="p-md">
                <MagnifyingGlassIcon
                  size={16}
                  weight="bold"
                  color={colors.secondary}
                />
              </View>

              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={onChangeQuery}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search area or landmark"
                className="flex-1 font-thin text-textPrimary text-sm"
                returnKeyType="search"
                placeholderTextColor={colors.text.muted}
                cursorColor={colors.black}
                selectionColor={colors.black}
                numberOfLines={1}
              />

              {/* Nearby Button */}
              <View className="p-md">
                <Pressable
                  onPress={handleToggleNearby}
                  disabled={loading}
                  className="overflow-hidden rounded-sm bg-surface active:bg-slate-50"
                  style={{ opacity: loading ? 0.4 : 1 }}
                >
                  <GpsFixIcon
                    size={24}
                    color={colors.primary}
                    weight="duotone"
                  />
                </Pressable>
              </View>
            </View>

            {/* Suggestions */}
            {showSuggestions && (
              <MotiView
                from={{ opacity: 0, translateY: 4 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 300 }}
              >
                {predictions.length === 0 ? (
                  <View className="px-md pb-sm">
                    <Text className="text-sm text-textMuted">
                      No matches found.
                    </Text>
                  </View>
                ) : (
                  <View className="flex-col px-sm gap-sm mb-sm">
                    {predictions.map((item) => (
                      <AppSearchRow
                        key={`creation-location-suggestion-${item.placeId}`}
                        IconComponent={MapPinIcon}
                        text={item.formattedAddress}
                        onPress={() => void handleSelectSuggestion(item)}
                      />
                    ))}
                  </View>
                )}
              </MotiView>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default IncidentSceneStepScreen;
