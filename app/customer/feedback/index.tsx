import Button from '@/components/Button';
import InputWithLabel from '@/components/Input';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const STARS = [1, 2, 3, 4, 5];

const FeedbackScreen = () => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!comment.trim()) {
      alert('Please enter your feedback');
      return;
    }
    // TODO: gửi feedback lên server
    alert('Thanks for your feedback!');
  };

  return (
    <View className="flex-1 bg-white px-5 pt-6">
      <Text className="text-xl font-bold mb-4">Feedback</Text>

      <Text className="text-base font-semibold mb-2">Rating</Text>
      <View className="flex-row mb-4">
        {STARS.map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            className="mr-2"
          >
            <Text
              className={
                star <= rating ? 'text-yellow-400 text-2xl' : 'text-gray-300 text-2xl'
              }
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <InputWithLabel
        label="Comment"
        placeholder="Tell us about your experience"
        value={comment}
        onChangeText={setComment}
      />

      <View className="mt-4">
        <Button className="rounded-xl" onPress={handleSubmit}>
          Submit feedback
        </Button>
      </View>
    </View>
  );
};

export default FeedbackScreen;


