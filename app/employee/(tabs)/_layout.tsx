import TaskIcon from '@/components/icons/Task';
import UserIcon from '@/components/icons/User';
import { Tabs } from 'expo-router';
import React from 'react';

const _layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Task',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TaskIcon stroke={focused ? '#007AFF' : '#8E8E93'} />
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
