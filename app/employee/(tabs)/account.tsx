import Logo from '@/assets/images/Logo.svg';
import Button from '@/components/Button';

import { useAuth } from '@/contexts/AuthContext';

import { API_ENDPOINTS, apiCall } from '@/config/api';

import { useRouter } from 'expo-router';

import React, { useEffect, useState } from 'react';

import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import type { UserProfile } from '@/types/user.types';

const Account = () => {
    const router = useRouter();

    const { userData, isAuthenticated, logout } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && userData?.accessToken) {
            fetchUserProfile();
        } else {
            setProfile(null);
        }
    }, [isAuthenticated, userData?.accessToken]);

    const fetchUserProfile = async () => {
        if (!userData?.accessToken) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await apiCall(API_ENDPOINTS.auth.me, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });

            if (result?.statusCode === 200 && result?.data) {
                setProfile(result.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();

            router.replace('/employee/signin');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="px-5 pt-2 pb-4 border-b border-gray-200 bg-white">
                    <Text className="text-2xl font-bold text-[#1A78F2]">Account</Text>

                    <Text className="text-gray-500 mt-1 text-sm">
                        Login to manage your account
                    </Text>
                </View>

                <View className="flex-1 px-5 mt-5 justify-start items-center">
                    <View className="flex-col justify-center items-center mb-8 gap-2">
                        <Logo width={113.65} height={45} />
                        <Text className="text-[#303030] text-[12px] italic font-light leading-normal tracking-[0.036px]">
                            For Employee
                        </Text>
                    </View>

                    <Text className="text-gray-600 text-center mb-8 text-base">
                        Please login to view your account information
                    </Text>

                    <Button
                        className="mb-3 rounded-xl w-full"
                        onPress={() => router.push('/employee/signin')}
                    >
                        Login
                    </Button>

                    <Button
                        className="rounded-xl bg-gray-200 w-full"
                        textClassName="text-[#1A78F1]"
                        onPress={() => router.push('/employee/signup')}
                    >
                        Join Us
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-5 pt-2 pb-4 border-b border-gray-200 bg-white">
                <Text className="text-2xl font-bold text-[#1A78F2]">Account</Text>

                <Text className="text-gray-500 mt-1 text-sm">
                    Manage your personal information and settings
                </Text>
            </View>

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#1A78F2" />
                </View>
            ) : (
                <ScrollView className="flex-1 px-5 pt-4">
                    {!profile ? (
                        <View className="mb-6 p-4 rounded-2xl border border-gray-200 bg-white items-center">
                            <Text className="text-gray-500 text-center">
                                Unable to load profile information
                            </Text>
                        </View>
                    ) : (
                        <View className="mb-6 p-4 rounded-2xl border border-gray-200 bg-white">
                            {profile?.fullName && (
                                <>
                                    <Text className="text-gray-500 text-xs mb-1">Name</Text>

                                    <Text className="font-semibold mb-3 text-gray-900">
                                        {profile.fullName}
                                    </Text>
                                </>
                            )}

                            {profile?.phoneNumber && (
                                <>
                                    <Text className="text-gray-500 text-xs mb-1">Phone</Text>

                                    <Text className="font-semibold mb-3 text-gray-900">
                                        {profile.phoneNumber}
                                    </Text>
                                </>
                            )}

                            {profile?.email && (
                                <>
                                    <Text className="text-gray-500 text-xs mb-1">Email</Text>

                                    <Text className="font-semibold mb-3 text-gray-900">
                                        {profile.email}
                                    </Text>
                                </>
                            )}

                            {profile?.address && (
                                <>
                                    <Text className="text-gray-500 text-xs mb-1">Address</Text>

                                    <Text className="font-semibold mb-3 text-gray-900">
                                        {profile.address}
                                    </Text>
                                </>
                            )}

                            {profile?.userType && (
                                <>
                                    <Text className="text-gray-500 text-xs mb-1">
                                        Account Type
                                    </Text>
                                    <Text className="font-semibold text-gray-900">
                                        {profile.userType}
                                    </Text>
                                </>
                            )}
                        </View>
                    )}

                    <Button className="rounded-xl bg-red-500 mb-6" onPress={handleLogout}>
                        Logout
                    </Button>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default Account;
