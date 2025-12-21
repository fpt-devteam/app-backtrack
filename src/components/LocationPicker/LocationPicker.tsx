import { useGetCurrentPosition } from "@/src/hooks/useGetCurrentLocation";
import useGetFormattedLocation from "@/src/hooks/useGetFormattedLocation";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import MapView, { Marker, MarkerDragStartEndEvent, Region } from "react-native-maps";
import { Button } from "react-native-paper";

import { GoogleMapDetailLocation } from "../../types/location.type";
import { styles } from "./styles";

type LocationPickerProps = {
  location: GoogleMapDetailLocation | null;
  changeLocation: (location: GoogleMapDetailLocation | null) => void;
};

const DEFAULT_REGION: Region = {
  latitude: 10.762622,
  longitude: 106.660172,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

const ANIMATE_TO_DURATION = 600;

const queryConfig = {
  key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY as string,
  language: "vi",
  components: "country:vn",
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

const LocationPicker = ({ location: detailLocation, changeLocation: changeDetailLocation }: LocationPickerProps) => {
  const mapRef = useRef<MapView>(null);
  const placesRef = useRef<GooglePlacesAutocompleteRef>(null);

  const { loading, getCurrentPosition, error: currentPositionError } = useGetCurrentPosition();
  const { formatLocation } = useGetFormattedLocation();

  useEffect(() => {
    const placeStr: string = detailLocation?.displayAddress || "";
    const newRegion: Region = getRegionFromLocation(detailLocation);

    placesRef.current?.setAddressText(placeStr);
    mapRef.current?.animateToRegion(newRegion, ANIMATE_TO_DURATION);
  }, [detailLocation]);

  const handleGetCurrentLocation = async () => {
    const fetchedDetailLocation: GoogleMapDetailLocation | null = await getCurrentPosition();

    if (!fetchedDetailLocation) {
      console.error("Error getting current position:", currentPositionError);
      return;
    };

    changeDetailLocation(fetchedDetailLocation);
  };

  const handleMarkerDragEnd = async (e: MarkerDragStartEndEvent) => {
    const mapLocation: GoogleMapDetailLocation = {
      location: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
    };

    const coords = mapLocation.location;
    const fetchedDetailLocation: GoogleMapDetailLocation | null = await formatLocation(coords);
    changeDetailLocation(fetchedDetailLocation);
  };

  const handlePickPlace = async (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    const lat = details?.geometry?.location?.lat;
    const lng = details?.geometry?.location?.lng;

    if (typeof lat !== "number" || typeof lng !== "number") return;

    const mapLocation: GoogleMapDetailLocation = {
      location: {
        latitude: lat,
        longitude: lng,
      },
    };

    const coords = mapLocation.location;
    const formattedLocation: GoogleMapDetailLocation | null = await formatLocation(coords);
    changeDetailLocation(formattedLocation);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Seen Location</Text>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          ref={placesRef}
          placeholder="Search location..."
          fetchDetails
          debounce={300}
          enablePoweredByContainer={false}
          query={queryConfig}
          onPress={handlePickPlace}
          keyboardShouldPersistTaps="always"
          styles={{
            container: { flex: 0 },
            textInput: styles.searchInput,
            listView: styles.searchListView,
          }}
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
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

        <Button
          style={styles.button}
          onPress={handleGetCurrentLocation}
          disabled={loading}
          mode="outlined"
          icon={loading ? "loading" : "crosshairs-gps"}
        >
          {loading ? "Getting location..." : "Use Current Location"}
        </Button>
      </View>
    </View>
  );
};

export default LocationPicker;
