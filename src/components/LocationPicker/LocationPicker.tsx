import { useGetCurrentPosition } from '@/src/hooks/useGetCurrentLocation';
import useGetFormattedLocation from '@/src/hooks/useGetFormattedLocation';
import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Button } from 'react-native-paper';
import { GoogleMapFormattedLocation, LocationCoordinates } from '../../types/location.type';
import { styles } from './styles';

type LocationPickerProps = {
  location: GoogleMapFormattedLocation | null;
  changeLocation: (location: GoogleMapFormattedLocation | null) => void;
}

const LocationPicker = ({ location, changeLocation }: LocationPickerProps) => {
  const mapRef = useRef<MapView>(null);

  const { loading, getCurrentPosition } = useGetCurrentPosition();
  const { formatLocation } = useGetFormattedLocation();

  const handleShareLocation = async () => {
    const currentPosition: GoogleMapFormattedLocation | null = await getCurrentPosition();
    if (!currentPosition) return;

    changeLocation(currentPosition);

    const newRegion: Region = {
      latitude: currentPosition.latitude,
      longitude: currentPosition.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const handleMarkerDragEnd = async (e: any) => {
    const coordinates: LocationCoordinates = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };

    const formattedLocation: GoogleMapFormattedLocation | null = await formatLocation(coordinates);
    changeLocation(formattedLocation);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Seen Location</Text>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {location && (
            <Marker
              coordinate={location}
              draggable
              onDragEnd={handleMarkerDragEnd}
              title="Selected Location"
              description="Drag to adjust"
            />
          )}
        </MapView>

        <Button
          style={styles.button}
          onPress={handleShareLocation}
          disabled={loading}
          mode="outlined"
          icon={loading ? "loading" : "crosshairs-gps"}
        >
          {loading ? "Getting location..." : "Use Current Location"}
        </Button>
      </View>
    </View >
  )
}

export default LocationPicker