import { Stack } from 'expo-router';
import React from 'react';

const MessageStackLayout = () => {
  return (
    <Stack >
      <Stack.Screen
        name="conversations/index"
        options={{
          headerShown: true,
          title: 'Conversations'
        }}
      />
    </Stack>
  )
}

export default MessageStackLayout;
