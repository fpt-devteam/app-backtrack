import React, { useRef } from 'react'
import MapView from 'react-native-maps'

const LocationMapView = () => {
  const mapRef = useRef<MapView>(null)
  return (
    <MapView
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%'
      }}
      showsUserLocation
      showsMyLocationButton={false}
      mapType="standard"
    >
    </MapView>
  )
}

export default LocationMapView
