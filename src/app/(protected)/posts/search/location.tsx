import {
  LocationActionButtons,
  LocationScreenHeader,
  LocationSearchPanel,
} from "@/src/features/location/components";
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
import { MapPin, XCircle } from "phosphor-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
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

  // Search state
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

  // Animation refs
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

  // Handle suggestion data
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
      <LocationScreenHeader
        onBack={() => router.back()}
        onConfirm={handleConfirm}
      />

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
            <LocationSearchPanel
              showPanel={showPanel}
              displayType={displayType}
              displayData={displayData}
              loadingSuggestions={loadingSuggestions}
              recent={recent}
              fade={fade}
              slide={slide}
              onSelectSuggestion={handleSelectSuggestion}
              onSelectRecent={handleSelectRecent}
              onRemoveRecent={handleRemoveRecent}
              onClearRecent={handleClearRecent}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>

      {/* Floating Action Buttons */}
      <LocationActionButtons
        radius={radius}
        loadingLocation={loadingLocation}
        onGetCurrentPosition={handleGetCurrentPosition}
        onRadiusChange={handleRadiusChange}
      />
    </View>
  );
}
