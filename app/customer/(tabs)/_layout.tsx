import { Tabs } from 'expo-router';
import React from 'react';

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', headerShown: false }}
      />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity', headerShown: false }}
      />
      <Tabs.Screen
        name="message"
        options={{ title: 'Messages', headerShown: false }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Account', headerShown: false }}
      />
    </Tabs>
  );
};

export default _layout;
