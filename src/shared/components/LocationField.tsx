import { useGetDetailCurrentLocation, useGetDetailLocation } from "@/src/shared/hooks";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import MapView, { Marker, MarkerDragStartEndEvent, Region } from "react-native-maps";
import { Icon, IconButton } from "react-native-paper";
import { ANIMATE_TO_DURATION, DEFAULT_REGION, QUERY_CONFIG } from "../constants";
import { GoogleMapDetailLocation } from "../types";

type LocationFieldProps = {
  value: GoogleMapDetailLocation | null;
  onChange: (location: GoogleMapDetailLocation | null) => void;
};

const getRegionFromLocation = (detailLocation: GoogleMapDetailLocation | null): Region => {
  if (!detailLocation) return DEFAULT_REGION;
  return {
    latitude: detailLocation.location.latitude,
    longitude: detailLocation.location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
};

const LocationField = (locationFieldProps: LocationFieldProps) => {
  const { value: detailLocation, onChange } = locationFieldProps;

  const mapRef = useRef<MapView>(null);
  const placesRef = useRef<GooglePlacesAutocompleteRef>(null);

  const { loading, getDetailCurrentLocation } = useGetDetailCurrentLocation();
  const { formatLocation } = useGetDetailLocation();

  useEffect(() => {
    const placeStr = detailLocation?.displayAddress || "";
    const newRegion = getRegionFromLocation(detailLocation);

    placesRef.current?.setAddressText(placeStr);
    mapRef.current?.animateToRegion(newRegion, ANIMATE_TO_DURATION);
  }, [detailLocation]);

  const handleGetCurrentLocation = async () => {
    const fetchedData = await getDetailCurrentLocation();
    onChange(fetchedData);
  };

  const handleMarkerDragEnd = async (e: MarkerDragStartEndEvent) => {
    const mapLocation: GoogleMapDetailLocation = {
      location: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
    };

    const coords = mapLocation.location;
    const fetchedData = await formatLocation(coords);
    onChange(fetchedData);
  };

  const handlePickPlace = async (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    const lat = details?.geometry?.location?.lat;
    const lng = details?.geometry?.location?.lng;

    if (typeof lat !== "number" || typeof lng !== "number") return;

    const mapLocation: GoogleMapDetailLocation = {
      location: { latitude: lat, longitude: lng },
    };

    const coords = mapLocation.location;
    const formattedLocation: GoogleMapDetailLocation | null = await formatLocation(coords);
    onChange(formattedLocation);
  };

  return (
    <View className="p-3">
      {/* Search bar */}
      <View className="flex-row items-center gap-3">
        <View className="flex-1 min-w-0">
          <GooglePlacesAutocomplete
            ref={placesRef}
            placeholder="Enter location (e.g. Central Park)"
            fetchDetails
            debounce={300}
            enablePoweredByContainer={false}
            query={QUERY_CONFIG}
            onPress={handlePickPlace}
            keyboardShouldPersistTaps="always"
            renderLeftButton={() => (
              <View className="h-11 w-9 justify-center items-center bg-slate-100 rounded-tl-xl rounded-bl-xl">
                <Icon source="map-marker" size={18} color="#94A3B8" />
              </View>
            )}
            styles={{
              container: { flex: 1 },
              textInputContainer: {
                flex: 1,
                paddingHorizontal: 0,
                paddingVertical: 0,
              },
              textInput: {
                height: 44,
                backgroundColor: '#F1F5F9',
                borderRadius: 0,
                borderWidth: 0,
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
                paddingLeft: 0,
                paddingRight: 12,
                color: '#0F172A',
              },
              listView: {
                marginTop: 8,
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: 'rgba(15,23,42,0.08)',
                overflow: 'hidden',
              },
              row: {
                paddingVertical: 12,
                paddingHorizontal: 12,
              },
              separator: {
                height: 0.5,
                backgroundColor: 'rgba(15,23,42,0.08)',
              },
              description: {
                color: '#0F172A',
              },
            }}
          />
        </View>

        <IconButton
          className="w-11 h-11 m-0 p-0 rounded-xl justify-center items-center"
          icon={loading ? "loading" : "crosshairs-gps"}
          onPress={handleGetCurrentLocation}
          disabled={loading}
          mode="outlined"
        />
      </View>

      {/* Map View */}
      <View className="h-[300px] mt-3 rounded-lg overflow-hidden relative">
        <MapView
          ref={mapRef}
          className="w-full h-[70%] rounded-xl"
          showsUserLocation
          showsMyLocationButton
          initialRegion={getRegionFromLocation(detailLocation)}
        >
          {detailLocation && (
            <Marker
              coordinate={detailLocation.location}
              draggable
              onDragEnd={handleMarkerDragEnd}
              title="Selected Location"
              description="Drag to adjust"
            />
          )}
        </MapView>
      </View>
    </View>
  );
};

export default LocationField;

