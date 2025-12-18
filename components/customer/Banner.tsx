import { Image } from 'expo-image';

import React, { useRef, useState } from 'react';

import { Dimensions, FlatList, View } from 'react-native';

const { width } = Dimensions.get('window');

const banners = [
  {
    id: 1,

    uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop',
  },

  {
    id: 2,

    uri: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=400&fit=crop',
  },

  {
    id: 3,

    uri: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=400&fit=crop',
  },

  {
    id: 4,

    uri: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=400&fit=crop',
  },
];

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef(null);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);

    if (slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  return (
    <View className="mt-4">
      {/* Banner List */}

      <FlatList
        data={banners}
        ref={flatListRef}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <Image
            source={item.uri}
            style={{
              width: width * 0.9,

              height: 180,

              borderRadius: 16,

              marginHorizontal: width * 0.1 * 0.5,

              borderWidth: 1,

              borderColor: '#E0E0E0',
            }}
            contentFit="cover"
          />
        )}
        style={{ flexGrow: 0 }}
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
