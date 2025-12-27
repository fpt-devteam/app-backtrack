import { useGetDetailCurrentLocation, useGetDetailLocation } from "@/src/shared/hooks";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import MapView, { Marker, MarkerDragStartEndEvent, Region } from "react-native-maps";
import { Icon, IconButton } from "react-native-paper";
import { ANIMATE_TO_DURATION, DEFAULT_REGION, QUERY_CONFIG } from "../../constants";
import { GoogleMapDetailLocation } from "../../types";
import { styles } from "./styles";

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
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchCol}>
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
              <View style={styles.searchLeftIcon}>
                <Icon source="map-marker" size={18} color="#94A3B8" />
              </View>
            )}
            styles={{
              container: { flex: 1 },
              textInputContainer: styles.searchInputContainer,
              textInput: styles.searchInput,
              listView: styles.searchListView,
              row: styles.searchRowItem,
              separator: styles.searchSeparator,
              description: styles.searchDesc,
            }}
          />
        </View>

        <IconButton
          style={styles.currentBtnIcon}
          icon={loading ? "loading" : "crosshairs-gps"}
          onPress={handleGetCurrentLocation}
          disabled={loading}
          mode="outlined"
        />
      </View>
      {/* Map View */}
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


      </View>
    </View>
  );
};

export default LocationField;
