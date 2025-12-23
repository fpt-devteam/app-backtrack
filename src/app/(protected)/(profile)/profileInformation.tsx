import { useGetMe } from '@/src/features/auth/hooks/useGetMe';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

const ProfileInformation = () => {
  const isFocused = useIsFocused();
  const { fetchProfile, data, loading, error } = useGetMe();
  const [count, setCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchProfile().catch(() => {
        console.log("Error fetching profile!");
      });
      if (isFocused) setCount((p) => p + 1);
    }, [fetchProfile, isFocused])
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <MaterialIcons name="error-outline" size={64} color="#ef4444" />
        <Text className="mt-4 text-xl font-semibold text-gray-800">Error Loading Profile</Text>
        <Text className="mt-2 text-center text-gray-600">{error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-4">
            <Text className="text-white text-4xl font-bold">
              {count}
            </Text>
            <Text className="text-white text-4xl font-bold">
              {data?.displayName?.charAt(0).toUpperCase() || data?.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">
            {data?.displayName || 'User'}
          </Text>
        </View>

        {/* Profile Information Card */}
        <View className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Profile Information</Text>

          {/* User ID */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="fingerprint" size={20} color="#6b7280" />
              <Text className="ml-2 text-sm font-medium text-gray-500">User ID</Text>
            </View>
            <Text className="ml-7 text-base text-gray-800">{data?.id || 'N/A'}</Text>
          </View>

          {/* Display Name */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="person" size={20} color="#6b7280" />
              <Text className="ml-2 text-sm font-medium text-gray-500">Display Name</Text>
            </View>
            <Text className="ml-7 text-base text-gray-800">{data?.displayName || 'Not set'}</Text>
          </View>

          {/* Email */}
          <View>
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="email" size={20} color="#6b7280" />
              <Text className="ml-2 text-sm font-medium text-gray-500">Email</Text>
            </View>
            <Text className="ml-7 text-base text-gray-800">{data?.email || 'N/A'}</Text>
          </View>
        </View>

        {/* Account Status Card */}
        <View className="bg-white rounded-xl shadow-sm p-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Account Status</Text>

          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <Text className="text-base text-gray-700">Active</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProfileInformation