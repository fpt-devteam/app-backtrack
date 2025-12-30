import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Icon } from 'react-native-paper';
import { Post } from '../types';
import PostStatusBadge from './PostStatusBadge';

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
    <View
      className="-mt-6 mx-3 bg-white rounded-[18px] p-4 border border-slate-900/8"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
      }}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 text-xl font-extrabold text-slate-900 leading-6" numberOfLines={2}>
          {post.itemName}
        </Text>
        <PostStatusBadge status={post.postType} />
      </View>

      {/* Description */}
      <Text className="mt-2.5 text-xs leading-[18px] text-slate-600">{post.description}</Text>

      <View className="mt-3.5 gap-2.5">
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
        className="mt-3.5 h-[120px] rounded-[14px] bg-blue-50 border border-blue-600/15 overflow-hidden"
        showsUserLocation
        showsMyLocationButton
      >
        {post.location && <Marker coordinate={post.location} />}
        <TouchableOpacity
          className="absolute right-2.5 bottom-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-900/12"
          activeOpacity={0.9}
        >
          <Text className="text-xs font-bold text-blue-600">View Map</Text>
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
    <View className="flex-row gap-3 items-start">
      <View className="w-[34px] h-[34px] rounded-full bg-slate-100 items-center justify-center">
        <Icon source={icon} size={18} color="#2563EB" />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-[11px] text-slate-400 font-semibold">{label}</Text>
        <Text className="text-xs text-slate-900 font-bold">{value}</Text>
        {!!subValue && <Text className="text-xs text-slate-500">{subValue}</Text>}
      </View>
    </View>
  );
};

export default PostDetails
