import { useGetMe } from '@/src/hooks/useGetMe';
import { UserProfile } from '@/src/types/auth.type';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const Home = () => {
  const { fetchProfile, loading } = useGetMe();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProfile();
      setProfile(data);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Hello {profile?.email}!</Text>
    </View>
  )
}

export default Home