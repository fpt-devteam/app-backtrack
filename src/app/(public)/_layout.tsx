import { useAuth } from '@/src/features/auth/providers';
import { POST_ROUTE } from '@/src/shared/constants';
import { Redirect, Slot } from 'expo-router';
import React from 'react';

function PublicLayout() {
  const { isAppReady, isLoggedIn } = useAuth();
  if (!isAppReady) return null;

  if (isLoggedIn) return <Redirect href={POST_ROUTE.index} />;
  return <Slot />;
}
export default PublicLayout;
