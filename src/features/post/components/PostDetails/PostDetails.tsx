import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Icon } from 'react-native-paper';
import { Post } from '../../types';
import { PostStatusBadge } from '../PostStatusBadge/PostStatusBadge';
import { styles } from './styles';

type PostDetailsProps = {
  post: Post;
};

const PostDetails = ({ post }: PostDetailsProps) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (post.location) {
      const region = {
        latitude: post.location.latitude,
        longitude: post.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current?.animateToRegion(region, 1000);
    }
  }, [post.location]);

  return (
    <View style={styles.sheet}>
      {/* Header */}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {post.itemName}
        </Text>
        <PostStatusBadge status={post.postType} />
      </View>

      {/* Description */}
      <Text style={styles.description}>{post.description}</Text>

      <View style={styles.infoGroup}>
        <InfoRow
          icon="shape-outline"
          label="Distinctive Marks"
          value={post.distinctiveMarks || "N/A"}
        />

        <InfoRow
          icon="calendar-blank-outline"
          label="Date & Time Lost"
          value={post.eventTime.toString()}
        />

        <InfoRow
          icon="map-marker-outline"
          label="Last Seen Location"
          value={post.displayAddress || "N/A"}
        />
      </View>

      <MapView
        ref={mapRef}
        style={styles.mapCard}
        showsUserLocation
        showsMyLocationButton
      >
        {post.location && <Marker coordinate={post.location} />}
        <TouchableOpacity
          style={styles.viewMapBtn}
          activeOpacity={0.9}
        >
          <Text style={styles.viewMapText}>View Map</Text>
        </TouchableOpacity>
      </MapView>
    </View>
  )
};

type InfoRowProps = {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
};

const InfoRow = ({ icon, label, value, subValue }: InfoRowProps) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconCircle}>
        <Icon source={icon} size={18} color="#2563EB" />
      </View>

      <View style={styles.infoTextCol}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
        {!!subValue && <Text style={styles.infoSubValue}>{subValue}</Text>}
      </View>
    </View>
  );
};

export default PostDetails
