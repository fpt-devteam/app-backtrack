import React, { useEffect, useRef, useState } from 'react'
import type MapView from 'react-native-maps'
import type { Camera, LatLng, MarkerDragEvent, MarkerDragStartEndEvent } from 'react-native-maps'
import { Marker } from 'react-native-maps'

type Props = {
  mapRef: React.RefObject<MapView | null>
  location: LatLng
  onLocationChange: (location: LatLng) => void
}

const LocationMarker = ({ mapRef, location, onLocationChange }: Props) => {
  const [dragCoord, setDragCoord] = useState<LatLng>(location)
  const isDraggingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)
  const cameraBaseRef = useRef<Camera | null>(null)
  const cameraCurrentCenterRef = useRef<LatLng | null>(null)
  const cameraTargetCenterRef = useRef<LatLng | null>(null)

  useEffect(() => {
    if (!isDraggingRef.current) {
      setDragCoord(location)
    }
  }, [location])

  const startCameraFollowLoop = () => {
    if (rafIdRef.current != null) return

    const tick = () => {
      if (!isDraggingRef.current) {
        rafIdRef.current = null
        return
      }

      const base = cameraBaseRef.current
      const current = cameraCurrentCenterRef.current
      const target = cameraTargetCenterRef.current

      if (base && current && target && mapRef.current) {
        const alpha = 0.05
        const next: LatLng = {
          latitude: current.latitude + (target.latitude - current.latitude) * alpha,
          longitude: current.longitude + (target.longitude - current.longitude) * alpha,
        }
        cameraCurrentCenterRef.current = next
        mapRef.current.setCamera({ ...base, center: next })
      }

      rafIdRef.current = requestAnimationFrame(tick) as unknown as number
    }

    rafIdRef.current = requestAnimationFrame(tick) as unknown as number
  }

  const stopCameraFollowLoop = () => {
    isDraggingRef.current = false
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }

  useEffect(() => () => stopCameraFollowLoop(), [])

  const handleDragStart = () => {
    isDraggingRef.current = true
      ; (async () => {
        const cam = await mapRef.current?.getCamera()

        const fallbackCenter = { latitude: dragCoord.latitude, longitude: dragCoord.longitude }
        const fallbackCamera: Camera = { center: fallbackCenter, pitch: 0, heading: 0, zoom: 16 }

        const baseCamera = cam ?? fallbackCamera
        cameraBaseRef.current = baseCamera
        cameraCurrentCenterRef.current = baseCamera.center
        cameraTargetCenterRef.current = baseCamera.center
        startCameraFollowLoop()
      })()
  }

  const handleDragging = (event: MarkerDragEvent) => {
    if (!isDraggingRef.current) return
    const coord = event.nativeEvent.coordinate
    cameraTargetCenterRef.current = coord
    setDragCoord(coord)
  }

  const handleDragEnd = (event: MarkerDragStartEndEvent) => {
    const finalCoord = event.nativeEvent.coordinate
    cameraTargetCenterRef.current = finalCoord

    setTimeout(() => stopCameraFollowLoop(), 120)

    setDragCoord(finalCoord)
    onLocationChange(finalCoord)
  }

  return (
    <Marker
      coordinate={dragCoord}
      title="Selected location"
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDragging}
      onDragEnd={handleDragEnd}
    />
  )
}

export default LocationMarker
