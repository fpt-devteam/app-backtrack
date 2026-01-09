import { ANIMATE_TO_DURATION, DEFAULT_REGION, QUERY_CONFIG } from "@/src/shared/constants";
import { useGetDetailCurrentLocation, useGetDetailLocation } from "@/src/shared/hooks";
import type { GoogleMapDetailLocation } from "@/src/shared/types";
import { MagnifyingGlass } from "phosphor-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import type { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, type MarkerDragStartEndEvent, type Region } from "react-native-maps";

type LocationFieldProps = {
  value: GoogleMapDetailLocation | null;
  onChange: (location: GoogleMapDetailLocation | null) => void;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2a44',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  searchBarWrapper: {
    marginBottom: 16,
    zIndex: 1000,
    elevation: 1000,
  },
  searchBarContainer: {
    flex: 1,
  },
  leftIconContainer: {
    height: 44,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  searchInputContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  searchInput: {
    height: 44,
    backgroundColor: '#F1F5F9',
    borderRadius: 0,
    borderWidth: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingLeft: 0,
    paddingRight: 12,
    color: '#0F172A',
    fontSize: 14,
  },
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [listViewDisplayed, setListViewDisplayed] = useState<boolean | 'auto'>(false);

  const { loading, getDetailCurrentLocation } = useGetDetailCurrentLocation();
  const { formatLocation } = useGetDetailLocation();

  useEffect(() => {
    const placeStr = detailLocation?.displayAddress || "";
    const newRegion = getRegionFromLocation(detailLocation);

    placesRef.current?.setAddressText(placeStr);
    mapRef.current?.animateToRegion(newRegion, ANIMATE_TO_DURATION);
  }, [detailLocation]);

  const closeDropdown = useCallback(() => {
    setShowDropdown(false);
    setListViewDisplayed(false);
    Keyboard.dismiss();

    setTimeout(() => {
      placesRef.current?.blur();
    }, 100);
  }, []);

  const handleGetCurrentLocation = async () => {
    closeDropdown();
    const fetchedData = await getDetailCurrentLocation();
    onChange(fetchedData);
  };

  const handleMarkerDragEnd = async (e: MarkerDragStartEndEvent) => {
    if (isFormatting) return;

    setIsFormatting(true);
    const mapLocation: GoogleMapDetailLocation = {
      location: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
    };

    const coords = mapLocation.location;
    try {
      const fetchedData = await formatLocation(coords);
      onChange(fetchedData);
    } finally {
      setIsFormatting(false);
    }
  };

  const handlePickPlace = async (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    const lat = details?.geometry?.location?.lat;
    const lng = details?.geometry?.location?.lng;

    if (typeof lat !== "number" || typeof lng !== "number") return;


    setListViewDisplayed(false);
    setShowDropdown(false);
    Keyboard.dismiss();
    placesRef.current?.blur();

    setIsFormatting(true);
    const mapLocation: GoogleMapDetailLocation = {
      location: { latitude: lat, longitude: lng },
    };

    const coords = mapLocation.location;
    try {
      const formattedLocation: GoogleMapDetailLocation | null = await formatLocation(coords);
      onChange(formattedLocation);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleTextChange = (text: string) => {

    if (text.length > 0) {
      setShowDropdown(true);
      setListViewDisplayed('auto');
    } else {
      setShowDropdown(false);
      setListViewDisplayed(false);
    }
  };

  const handleFocus = () => {
    setShowDropdown(true);

    const currentText = placesRef.current?.getAddressText?.();
    if (currentText && currentText.length > 0) {
      setListViewDisplayed('auto');
    }
  };

  const handleBlur = () => {

    setTimeout(() => {
      setShowDropdown(false);
      setListViewDisplayed(false);
    }, 200);
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View>
        <Text style={styles.labelText}>Location</Text>
        <View style={styles.container}>
          {/* Search bar - with proper z-index layering */}
          <View style={styles.searchBarWrapper}>
            <GooglePlacesAutocomplete
              ref={placesRef}
              placeholder="Enter location (e.g. Central Park)"
              fetchDetails
              debounce={300}
              enablePoweredByContainer={false}
              query={QUERY_CONFIG}
              onPress={handlePickPlace}
              keyboardShouldPersistTaps="handled"
              keepResultsAfterBlur={false}
              listViewDisplayed={listViewDisplayed}
              suppressDefaultStyles={false}
              onFail={(error) => console.log('GooglePlacesAutocomplete Error:', error)}
              onTimeout={() => console.log('GooglePlacesAutocomplete Timeout')}
              textInputProps={{
                onChangeText: handleTextChange,
                onFocus: handleFocus,
                onBlur: handleBlur,
                editable: !isFormatting,
                returnKeyType: 'search',
              }}
              renderLeftButton={() => (
                <View style={styles.leftIconContainer}>
                  <MagnifyingGlass size={18} color="#94A3B8" />
                </View>
              )}
              styles={{
                container: {
                  flex: 1,
                  zIndex: 1000,
                  elevation: 1000,
                },
                textInputContainer: styles.searchInputContainer,
                textInput: styles.searchInput,
                listView: {
                  position: 'absolute',
                  top: 52,
                  left: 0,
                  right: 0,
                  marginTop: 0,
                  borderRadius: 12,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: 'rgba(15,23,42,0.08)',
                  overflow: 'hidden',
                  maxHeight: 250,
                  zIndex: 2000,
                  elevation: 2000,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                },
                row: {
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: '#FFFFFF',
                },
                separator: {
                  height: 0.5,
                  backgroundColor: 'rgba(15,23,42,0.08)',
                },
                description: {
                  color: '#0F172A',
                  fontSize: 14,
                },
                predefinedPlacesDescription: {
                  color: '#6B7280',
                },
              }}
            />
          </View>

          {/* Map View - with proper pointer events control */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={{ width: '100%', height: '100%' }}
              showsUserLocation
              showsMyLocationButton={false}
              initialRegion={getRegionFromLocation(detailLocation)}
              mapType="standard"
              scrollEnabled={!showDropdown}
              zoomEnabled={!showDropdown}
              pitchEnabled={!showDropdown}
              rotateEnabled={!showDropdown}
              pointerEvents={showDropdown ? 'none' : 'auto'}
            >
              {detailLocation && (
                <Marker
                  coordinate={detailLocation.location}
                  draggable={!isFormatting}
                  onDragEnd={handleMarkerDragEnd}
                  title="Selected Location"
                  description="Drag to adjust position"
                />
              )}
            </MapView>

            {/* Current Location Button - Bottom Right */}
            <Pressable
              onPress={handleGetCurrentLocation}
              disabled={loading || isFormatting}
              style={styles.currentLocationButton}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#6B7280" />
              ) : (
                <Text style={{ fontSize: 20 }}>📍</Text>
              )}
            </Pressable>

            {/* Loading overlay for map */}
            {isFormatting && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#3B82F6" />
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LocationField;
