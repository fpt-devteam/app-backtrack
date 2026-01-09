import SuggestRow from "@/src/shared/components/ui/SuggestRow";
import {
  ANIMATE_TO_DURATION,
  DEFAULT_REGION,
} from "@/src/shared/constants/location.constant";
import { useGetDetailCurrentLocation, useLocationSearch } from "@/src/shared/hooks";
import {
  GooglePlacesService,
  RecentLocationService,
  type RecentLocationSearch,
} from "@/src/shared/services";
import { colors } from "@/src/shared/theme";
import type { LocationFilterValue } from "@/src/shared/types";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Check,
  Clock,
  Crosshair,
  MapPin,
  Target,
  XCircle,
} from "phosphor-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Circle, type Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

type DisplayType = "recent" | "suggest";

export default function SearchLocationScreen() {
  const params = useLocalSearchParams<{
    lat?: string;
    lng?: string;
    radius?: string;
    label?: string;
    placeId?: string;
  }>();

  const mapRef = useRef<MapView>(null);
  const inputRef = useRef<TextInput>(null);

  // Initial values from params
  const initialLat = params.lat ? Number.parseFloat(params.lat) : DEFAULT_REGION.latitude;
  const initialLng = params.lng ? Number.parseFloat(params.lng) : DEFAULT_REGION.longitude;
  const initialRadius = params.radius ? Number.parseFloat(params.radius) : 5;

  // Map center & selection state
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    label?: string;
    placeId?: string;
  }>({
    lat: initialLat,
    lng: initialLng,
    label: params.label,
    placeId: params.placeId,
  });

  const [radius, setRadius] = useState(initialRadius);

  // Search state (following SearchPostScreen pattern)
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [displayType, setDisplayType] = useState<DisplayType>("recent");
  const [displayData, setDisplayData] = useState<readonly RecentLocationSearch[]>([]);
  const [recent, setRecent] = useState<readonly RecentLocationSearch[]>([]);

  // Location permission hook
  const { loading: loadingLocation, getDetailCurrentLocation } =
    useGetDetailCurrentLocation();

  // TanStack Query for suggestions
  const {
    data: suggestions = [],
    isLoading: loadingSuggestions,
  } = useLocationSearch(query, isFocused);

  // Animation refs (following SearchPostScreen pattern)
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  // Circle animation refs
  const animatedRadius = useRef(new Animated.Value(initialRadius * 1000)).current;
  const circlePulse = useRef(new Animated.Value(0.22)).current;

  const runSwapAnimation = useCallback(() => {
    fade.setValue(0);
    slide.setValue(8);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  const runCirclePulse = useCallback(() => {
    circlePulse.setValue(0.22);
    Animated.sequence([
      Animated.timing(circlePulse, {
        toValue: 0.32,
        duration: 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(circlePulse, {
        toValue: 0.22,
        duration: 160,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, [circlePulse]);

  const animateRadiusChange = useCallback((newRadius: number) => {
    Animated.timing(animatedRadius, {
      toValue: newRadius * 1000,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      runCirclePulse();
    });
  }, [animatedRadius, runCirclePulse]);

  const handleGetCurrentPosition = useCallback(async () => {
    const result = await getDetailCurrentLocation();
    if (!result) return;

    const newLat = result.location.latitude;
    const newLng = result.location.longitude;

    setSelectedLocation({
      lat: newLat,
      lng: newLng,
      label: result.displayAddress ?? undefined,
      placeId: result.externalPlaceId ?? undefined,
    });

    mapRef.current?.animateToRegion(
      {
        latitude: newLat,
        longitude: newLng,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      ANIMATE_TO_DURATION
    );

    setTimeout(runCirclePulse, ANIMATE_TO_DURATION);
  }, [getDetailCurrentLocation, runCirclePulse]);

  const handleRadiusChange = useCallback((newRadius: number) => {
    setRadius(newRadius);
    animateRadiusChange(newRadius);
  }, [animateRadiusChange]);

  const handleRegionChangeComplete = useCallback((region: Region) => {
    setSelectedLocation((prev) => ({
      ...prev,
      lat: region.latitude,
      lng: region.longitude,
    }));
    runCirclePulse();
  }, [runCirclePulse]);

  const handleSelectSuggestion = useCallback(async (item: RecentLocationSearch) => {
    Keyboard.dismiss();
    setIsFocused(false);

    const details = await GooglePlacesService.getPlaceDetails(item.placeId);
    if (!details) return;

    const newLat = details.location.latitude;
    const newLng = details.location.longitude;

    setSelectedLocation({
      lat: newLat,
      lng: newLng,
      label: details.formattedAddress,
      placeId: details.placeId,
    });

    mapRef.current?.animateToRegion(
      {
        latitude: newLat,
        longitude: newLng,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      ANIMATE_TO_DURATION
    );

    setTimeout(runCirclePulse, ANIMATE_TO_DURATION);

    // Save to recent
    const updated = await RecentLocationService.add({
      placeId: details.placeId,
      label: details.formattedAddress,
      location: details.location,
    });
    setRecent(updated);

    setQuery("");
  }, [runCirclePulse]);

  const handleSelectRecent = useCallback(async (item: RecentLocationSearch) => {
    Keyboard.dismiss();
    setIsFocused(false);

    setSelectedLocation({
      lat: item.lat,
      lng: item.lng,
      label: item.label,
      placeId: item.placeId,
    });

    mapRef.current?.animateToRegion(
      {
        latitude: item.lat,
        longitude: item.lng,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      ANIMATE_TO_DURATION
    );

    setTimeout(runCirclePulse, ANIMATE_TO_DURATION);

    setQuery("");
  }, [runCirclePulse]);

  const handleRemoveRecent = useCallback(async (placeId: string) => {
    const updated = await RecentLocationService.remove(placeId);
    setRecent(updated);
  }, []);

  const handleClearRecent = useCallback(async () => {
    await RecentLocationService.clear();
    setRecent([]);
  }, []);

  const handleConfirm = useCallback(() => {
    const result: LocationFilterValue = {
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      radius,
      label: selectedLocation.label,
      placeId: selectedLocation.placeId,
    };

    router.back();
    console.log("Location filter confirmed:", result);
  }, [selectedLocation, radius]);

  const handlePressOutside = useCallback(() => {
    Keyboard.dismiss();
    setIsFocused(false);
  }, []);

  // Load recent searches on mount
  useEffect(() => {
    (async () => {
      const r = await RecentLocationService.load();
      setRecent(r);
      setDisplayType("recent");
      setDisplayData(r);
    })();
  }, []);

  // Update display data when recent changes (if in recent mode)
  useEffect(() => {
    if (displayType === "recent") {
      setDisplayData(recent);
    }
  }, [recent, displayType]);

  // Handle suggestion data (following SearchPostScreen pattern)
  useEffect(() => {
    const q = query.trim();

    if (!isFocused || q.length === 0) {
      if (displayType !== "recent") {
        setDisplayType("recent");
        setDisplayData(recent);
        runSwapAnimation();
      }
      return;
    }

    // When we have suggestions data, switch to suggest mode
    if (suggestions.length > 0) {
      if (displayType !== "suggest") {
        setDisplayType("suggest");
      }
      setDisplayData(
        suggestions.map((s) => ({
          placeId: s.placeId,
          label: s.description,
          lat: 0,
          lng: 0,
          updatedAt: Date.now(),
        }))
      );
      runSwapAnimation();
    }
  }, [suggestions, query, isFocused, displayType, recent, runSwapAnimation]);

  // Animate to user location on mount (if no params)
  useEffect(() => {
    if (!params.lat && !params.lng) {
      handleGetCurrentPosition();
    }
  }, [params.lat, params.lng, handleGetCurrentPosition]);

  const title = displayType === "suggest" ? "Suggestions" : "Recent";
  const showPanel = isFocused && (displayData.length > 0 || loadingSuggestions);

  return (
    <View className="flex-1">
      {/* Map View */}
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: initialLat,
          longitude: initialLng,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        mapType="standard"
      >
        <Circle
          center={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
          radius={radius * 1000}
          fillColor="rgba(59, 130, 246, 0.22)"
          strokeColor="rgba(59, 130, 246, 0.5)"
          strokeWidth={2}
        />
      </MapView>

      {/* Center Marker Overlay */}
      <View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -20,
          marginTop: -40,
        }}
        pointerEvents="none"
      >
        <MapPin size={40} color={colors.blue[600]} weight="fill" />
      </View>

      {/* Header */}
      <SafeAreaView
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        pointerEvents="box-none"
      >
        <View className="flex-row items-center p-4" pointerEvents="box-none">
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="mr-2 h-12 w-12 items-center justify-center rounded-2xl bg-white"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
          >
            <ArrowLeft size={20} color={colors.slate[700]} />
          </Pressable>

          <View className="flex-1" />

          <Pressable
            onPress={handleConfirm}
            hitSlop={10}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-600"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
          >
            <Check size={20} color="#fff" weight="bold" />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Search Panel */}
      <TouchableWithoutFeedback accessible={false} onPress={handlePressOutside}>
        <SafeAreaView
          style={{ position: "absolute", top: 80, left: 0, right: 0 }}
          pointerEvents="box-none"
        >
          <View className="px-4" pointerEvents="box-none">
            {/* Search Bar */}
            <View
              className="flex-row items-center bg-white rounded-2xl px-3 h-12"
              style={{
                borderWidth: 2,
                borderColor: isFocused ? colors.blue[500] : colors.slate[200],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <MapPin size={20} color={colors.slate[500]} />

              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                placeholder="Search location..."
                returnKeyType="search"
                onFocus={() => setIsFocused(true)}
                className="flex-1 ml-2 p-0 text-base"
                placeholderTextColor={colors.slate[400]}
              />

              {query.length > 0 ? (
                <Pressable
                  onPress={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  hitSlop={10}
                >
                  <XCircle size={20} color={colors.slate[400]} />
                </Pressable>
              ) : null}
            </View>

            {/* Suggestion Panel */}
            {showPanel ? (
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
                      <Pressable onPress={handleClearRecent} hitSlop={10}>
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
                                onPress={() => handleSelectSuggestion(item)}
                              />
                            );
                          }

                          return (
                            <SuggestRow
                              IconComponent={Clock}
                              text={item.label}
                              onPress={() => handleSelectRecent(item)}
                              onRemove={() => handleRemoveRecent(item.placeId)}
                            />
                          );
                        }}
                      />
                    )}
                  </Animated.View>
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>

      {/* Floating Action Buttons */}
      <SafeAreaView
        style={{ position: "absolute", bottom: 20, right: 20 }}
        pointerEvents="box-none"
      >
        <View className="gap-3">
          {/* My Location */}
          <Pressable
            onPress={handleGetCurrentPosition}
            disabled={loadingLocation}
            className="h-14 w-14 bg-white rounded-2xl items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color={colors.blue[600]} />
            ) : (
              <Crosshair size={24} color={colors.slate[700]} weight="bold" />
            )}
          </Pressable>

          {/* Radius Control */}
          <RadiusControl radius={radius} onChange={handleRadiusChange} />
        </View>
      </SafeAreaView>
    </View>
  );
}

type RadiusControlProps = {
  readonly radius: number;
  readonly onChange: (radius: number) => void;
};

function RadiusControl({ radius, onChange }: RadiusControlProps) {
  const [open, setOpen] = useState(false);
  const [localRadius, setLocalRadius] = useState(radius);

  useEffect(() => {
    setLocalRadius(radius);
  }, [radius]);

  const handleApply = () => {
    setOpen(false);
    onChange(localRadius);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-14 w-14 bg-white rounded-2xl items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Target size={24} color={colors.slate[700]} weight="bold" />
      </Pressable>

      {open ? (
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View
            style={{
              position: "absolute",
              bottom: 70,
              right: 0,
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              minWidth: 250,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <TouchableWithoutFeedback>
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-base font-semibold text-gray-900">
                    Search radius
                  </Text>

                  <View className="px-3 py-1 rounded-full bg-gray-100">
                    <Text className="text-sm font-semibold text-gray-900">
                      {localRadius} km
                    </Text>
                  </View>
                </View>

                {/* Quick picks */}
                <View className="flex-row gap-2 mb-3">
                  {[1, 3, 5, 10].map((v) => {
                    const active = localRadius === v;
                    return (
                      <Pressable
                        key={v}
                        onPress={() => setLocalRadius(v)}
                        className={[
                          "px-3 py-2 rounded-xl flex-1 items-center",
                          active ? "bg-gray-900" : "bg-white border border-gray-200",
                        ].join(" ")}
                      >
                        <Text
                          className={
                            active
                              ? "text-white text-xs font-semibold"
                              : "text-gray-900 text-xs font-semibold"
                          }
                        >
                          {v} km
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Actions */}
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100"
                  >
                    <Text className="text-gray-900 font-semibold text-center">
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleApply}
                    className="flex-1 px-4 py-3 rounded-xl bg-blue-600"
                  >
                    <Text className="text-white font-semibold text-center">
                      Apply
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </>
  );
}
