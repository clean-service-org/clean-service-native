import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const ServiceDetail = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Service Detail: {id}</Text>
    </View>
  );
};

export default ServiceDetail;
