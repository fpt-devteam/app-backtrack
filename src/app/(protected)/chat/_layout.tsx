import { Stack } from 'expo-router';
import React from 'react';

const MessageStackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="Conversations" />
      <Stack.Screen name="Messages" />
    </Stack>
  )
}

export default MessageStackLayout;
