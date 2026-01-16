import { useAuth } from '@/src/features/auth/providers';
import { POST_ROUTE } from '@/src/shared/constants';
import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

function PublicLayout() {
  const { isAppReady, isLoggedIn } = useAuth();

  // Wait for auth to be ready
  if (!isAppReady) {
    return null;
  }

  // If already logged in, redirect to posts
  if (isLoggedIn) {
    return <Redirect href={POST_ROUTE.index} />;
  }

  return (
    <SafeAreaView className="flex-1 p-6">
      <Slot />
    </SafeAreaView>
  );
}
export default PublicLayout;
