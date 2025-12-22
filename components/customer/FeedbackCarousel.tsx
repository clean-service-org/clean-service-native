import type { Feedback } from '@/types/feedback.types';
import React, { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

interface FeedbackCarouselProps {
  feedbacks: Feedback[];
  onFeedbackPress: (feedback: Feedback) => void;
}

const FeedbackCard = ({
  feedback,
  onPress,
}: {
  feedback: Feedback;
  onPress: () => void;
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Text key={i} className="text-blue-500 text-lg">
            ★
          </Text>,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Text key={i} className="text-blue-500 text-lg">
            ★
          </Text>,
        );
      } else {
        stars.push(
          <Text key={i} className="text-gray-300 text-lg">
            ★
          </Text>,
        );
      }
    }
    return stars;
  };

  return (
    <Pressable onPress={onPress}>
      <View
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        style={{ height: 260 }}
      >
        {/* Rating */}
        <View className="flex-row items-center mb-3">
          {renderStars(feedback.helperRating)}
          <Text className="text-blue-600 font-bold ml-2 text-base">
            {feedback.helperRating.toFixed(1)}
          </Text>
        </View>

        {/* Title */}
        <Text
          className="text-gray-900 font-bold text-base mb-2"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {feedback.title}
        </Text>

        {/* Description */}
        <Text
          className="text-gray-600 text-sm leading-5 flex-1"
          numberOfLines={6}
          ellipsizeMode="tail"
        >
          {feedback.description}
        </Text>

        {/* Customer Info */}
        <View
          className="flex-row items-center pt-3 mt-2 border-t border-gray-100"
          style={{ flexShrink: 0 }}
        >
          <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
            <Text className="text-blue-600 font-bold text-base">
              {feedback.customerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text className="text-gray-800 font-semibold text-sm">
              {feedback.customerName}
            </Text>
            {/* <Text className="text-gray-400 text-xs">Verified Customer</Text> */}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const FeedbackCarousel: React.FC<FeedbackCarouselProps> = ({
  feedbacks,
  onFeedbackPress,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!feedbacks || feedbacks.length === 0) {
    return null;
  }

  const displayFeedbacks = feedbacks.slice(0, 5);

  return (
    <View className="my-6">
      <View className="px-5 mb-4">
        <Text className="text-2xl font-bold text-gray-900 mb-1">
          Customer Reviews
        </Text>
        <Text className="text-gray-500 text-sm">
          What our customers say about us
        </Text>
      </View>

      <ImageBackground
        source={require('@/assets/images/feedback-banner.png')}
        style={{ width: '100%' }}
        resizeMode="stretch"
        imageStyle={{ width: '100%', height: '100%' }}
      >
        <Carousel
          loop
          width={width}
          height={290}
          autoPlay={true}
          autoPlayInterval={4000}
          data={displayFeedbacks}
          scrollAnimationDuration={800}
          onSnapToItem={(index) => setActiveIndex(index)}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ width: width * 0.92 }}>
                <FeedbackCard
                  feedback={item}
                  onPress={() => onFeedbackPress(item)}
                />
              </View>
            </View>
          )}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
        />

        {/* Indicator Dots */}
        <View className="flex-row justify-center pb-6">
          {displayFeedbacks.map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor:
                  index === activeIndex
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.5)',
              }}
            />
          ))}
        </View>
      </ImageBackground>
    </View>
  );
};

export default FeedbackCarousel;
