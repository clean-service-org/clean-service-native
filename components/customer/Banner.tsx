import { Image } from 'expo-image';

import React, { useState } from 'react';

import { Dimensions, View } from 'react-native';

import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const banners = [
  {
    id: 1,
    source: require('@/assets/images/service-banners/standard-banner.jpg'),
  },
  {
    id: 2,
    source: require('@/assets/images/service-banners/deep-clean-banner.jpg'),
  },
  {
    id: 3,
    source: require('@/assets/images/service-banners/ac-cleaning-banner.jpg'),
  },
  {
    id: 4,
    source: require('@/assets/images/service-banners/post-party-banner.jpg'),
  },
];

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="mt-4">
      {/* Banner Carousel */}
      <Carousel
        loop
        width={width}
        height={180}
        autoPlay={true}
        autoPlayInterval={3500}
        data={banners}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={item.source}
              style={{
                width: width * 0.9,
                height: 180,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#E0E0E0',
              }}
              contentFit="cover"
            />
          </View>
        )}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      />

      {/* Indicator Dots */}

      <View className="flex-row justify-center mt-3">
        {banners.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,

              height: 8,

              borderRadius: 4,

              marginHorizontal: 4,

              backgroundColor: index === activeIndex ? '#1A78F2' : '#A5C7F9',
            }}
          />
        ))}
      </View>
    </View>
  );
}
