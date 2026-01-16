import { useAuth } from '@/src/features/auth/providers';
import { POST_ROUTE } from '@/src/shared/constants';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAppReady, isLoggedIn } = useAuth();

  if (!isAppReady) {
    return null;
  }

  if (isLoggedIn) {
    return <Redirect href={POST_ROUTE.index} />;
  }

  return <Redirect href="/login" />;
}