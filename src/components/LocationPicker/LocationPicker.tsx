import { useGetCurrentPosition } from '@/src/hooks/useGetCurrentLocation';
import React, { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { GoogleMapFormattedLocation, LocationCoordinates } from '../../types/location.type';
import { styles } from './styles';

import useGetFormattedLocation from '@/src/hooks/useGetFormattedLocation';
import { Button } from 'react-native-paper';
import SearchLocationField from '../SearchLocationField/SearchLocationField';

const LocationPicker = () => {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<GoogleMapFormattedLocation | null>(null);

  const { loading, getCurrentPosition } = useGetCurrentPosition();
  const { formatLocation } = useGetFormattedLocation();

  const handleShareLocation = async () => {
    const currentPosition = await getCurrentPosition();
    if (!currentPosition) return;
    setLocation(currentPosition);

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
    const formattedLocation = await formatLocation(coordinates);
    setLocation(formattedLocation);
    console.log('Updated location:', formattedLocation);
  };

  const handleSelectedPlace = () => {

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Seen Location</Text>
      <SearchLocationField />

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