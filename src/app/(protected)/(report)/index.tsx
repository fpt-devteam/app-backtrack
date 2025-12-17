import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

const ReportScreen = () => {
  const router = useRouter();

  return (
    <View>
      <Text>This is ReportScreen will show list of reports</Text>
      <Button title="Create Report" onPress={() => router.push('/(protected)/(report)/create')} />
    </View>
  )
}

export default ReportScreen