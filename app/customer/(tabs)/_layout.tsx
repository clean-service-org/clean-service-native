import ActivityIcon from '@/components/icons/Activity';
import HomeIcon from '@/components/icons/Home';
import MessageIcon from '@/components/icons/Message';
import UserIcon from '@/components/icons/User';
import { Tabs } from 'expo-router';
import React from 'react';

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <HomeIcon stroke={focused ? '#007AFF' : '#8E8E93'} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <ActivityIcon
              width={24}
              height={24}
              fill={focused ? '#007AFF' : '#8E8E93'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: 'Messages',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MessageIcon stroke={focused ? '#007AFF' : '#8E8E93'} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <UserIcon stroke={focused ? '#007AFF' : '#8E8E93'} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
