import { useGetCurrentPosition } from '@/src/hooks/useGetCurrentLocation';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { LocationCoordinates } from '../../types/location.type';
import { styles } from './styles';

const LocationPicker = () => {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(false);
  const { loading: loadingGetCurrentPosition, error, getCurrentPosition } = useGetCurrentPosition();

  const handleShareLocation = async () => {
    setLoading(true);
    try {
      const currentPosition = await getCurrentPosition();
      if (!currentPosition) return;
      
      setLocation(currentPosition);
      const newRegion: Region = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerDragEnd = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    console.log('Updated location - Lat:', latitude, 'Lng:', longitude);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>
      <Button
        title={loading ? "Getting location..." : "Share My Location"}
        onPress={handleShareLocation}
        disabled={loading}
      />

      {location && (
        <Text style={styles.locationText}>
          📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
      )}

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region || undefined}
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

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        )}
      </View>
    </View>
  )
}

export default LocationPicker