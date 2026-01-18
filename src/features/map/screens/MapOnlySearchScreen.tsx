import {
  UserPlaceButton,
  UserPlaceMarker,
} from "@/src/features/map/components";
import { DEFAULT_RADIUS_KM } from "@/src/features/map/constants";
import { useReverseGeocoding, useUserLocation } from "@/src/features/map/hooks";
import { useLocationSelectionStore } from "@/src/features/map/store";
import { AppHeader } from "@/src/shared/components";
import { MAP_ROUTE } from "@/src/shared/constants";
import colors from "@/src/shared/theme/colors";
import { router } from "expo-router";
import { MagnifyingGlassIcon } from "phosphor-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { LatLng, Region } from "react-native-maps";
import MapView from "react-native-maps";

const placeholder = "Search for a location";

export const MapOnlySearchScreen = () => {
  const mapRef = useRef<MapView>(null);
  const { getUserLocation } = useUserLocation();

  const { selection, onChangeSelection, onConfirmSelection } =
    useLocationSelectionStore();
  const { reverseGeocode } = useReverseGeocoding();

  const searchDisplayText = useMemo(() => {
    if (!selection) return placeholder;

    const displayText = selection ? selection.displayAddress : placeholder;
    return displayText;
  }, [selection]);

  useEffect(() => {
    (async () => {
      const data = await getUserLocation();
      if (!data?.location) return;

      const initSelection = {
        ...data,
        radiusKm: DEFAULT_RADIUS_KM,
      };

      onChangeSelection(initSelection);
    })();
  }, []);

  useEffect(() => {
    const coords = selection?.location;
    if (!coords) return;
    handleMoveMarker(coords);
  }, [selection]);

  const onCoordinateChange = async (coord: LatLng) => {
    const geocodeResult = await reverseGeocode({ location: coord });

    const nextSelection = {
      ...selection,
      location: geocodeResult.location,
      displayAddress: geocodeResult?.formattedAddress ?? placeholder,
      externalPlaceId: geocodeResult?.placeId ?? selection?.externalPlaceId,
    };

    onChangeSelection(nextSelection);
  };

  const handleConfirmLocation = () => {
    if (!selection) return;
    onConfirmSelection(selection);
    router.back();
  };

  const handleMoveMarker = (coord: LatLng, duration: number = 2000) => {
    if (!mapRef.current) return;

    const newRegion: Region = {
      latitude: coord.latitude,
      longitude: coord.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    mapRef.current.animateToRegion(newRegion, duration);
  };

  return (
    <View className="flex-1">
      <AppHeader
        title="Select Location"
        onBackPress={() => router.back()}
        rightActionButton={
          <TouchableOpacity
            onPress={() => router.push(MAP_ROUTE.search)}
            activeOpacity={0.9}
          >
            <MagnifyingGlassIcon size={18} color={colors.slate[600]} />
          </TouchableOpacity>
        }
      />

      <View className="flex-1" style={{}}>
        {/* Map (base) */}
        <View style={{ flex: 1, zIndex: 0 }}>
          <MapView ref={mapRef} style={{ flex: 1 }}>
            {selection?.location && (
              <UserPlaceMarker
                coordinate={selection.location}
                disabled={false}
                showRadius={false}
              />
            )}
          </MapView>
        </View>

        {/* FAB overlay */}
        <View
          style={{
            position: "absolute",
            right: 16,
            bottom: 128,
            zIndex: 20,
          }}
          pointerEvents="box-none"
        >
          <UserPlaceButton disabled={false} onPress={onCoordinateChange} />
        </View>
      </View>

      {/* Footer */}
      <View className="p-4 pb-0">
        <TouchableOpacity
          className="h-11 items-center justify-center rounded-sm bg-primary"
          onPress={handleConfirmLocation}
        >
          <Text className="text-base font-semibold text-white">
            Select location
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
