import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import rawQuestions from './questions.json';

type Question = {
  id: string;
  type: 'single' | 'multi' | 'text' | 'rating' | 'info';
  question: string;
  helpText?: string;
  required?: boolean;
  options?: { id: string; label: string }[];
  maxSelect?: number;
  weight?: number;
  preferred?: string;
};

const SAMPLE_QUESTIONS: Question[] = rawQuestions as Question[];

export default function InitialAssessmentScreen({ navigation }: any) {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const totalQuestions = SAMPLE_QUESTIONS.length;
  const currentQuestion = SAMPLE_QUESTIONS[questionIndex];

  const progress = useMemo(
    () => Math.round(((questionIndex + 1) / totalQuestions) * 100),
    [questionIndex, totalQuestions],
  );
  /** Set or update a response for a question */
  function setResponse(qId: string, value: any) {
    setResponses((prev) => ({ ...prev, [qId]: value }));
  }

  /** Toggle a multi-select option for a question */
  function toggleMultiSelect(qId: string, optionId: string) {
    setResponses((prev) => {
      const prevSelected: string[] = prev[qId] || [];
      if (prevSelected.includes(optionId))
        return { ...prev, [qId]: prevSelected.filter((p) => p !== optionId) };
      return { ...prev, [qId]: [...prevSelected, optionId] };
    });
  }

  /** Validate the current question if required */
  function validateCurrentQuestion() {
    if (currentQuestion.required) {
      const val = responses[currentQuestion.id];
      if (
        currentQuestion.type === 'text' &&
        (!val || (typeof val === 'string' && val.trim() === ''))
      )
        return false;
      if (
        (currentQuestion.type === 'single' ||
          currentQuestion.type === 'rating') &&
        (val === undefined || val === null || val === '')
      )
        return false;
      if (
        currentQuestion.type === 'multi' &&
        currentQuestion.required &&
        (!val || (Array.isArray(val) && val.length === 0))
      )
        return false;
    }
    return true;
  }

  /** Advance to the next question or submit at the end */
  function handleNext() {
    if (!validateCurrentQuestion()) {
      Alert.alert('Please answer the question before continuing.');
      return;
    }

    if (questionIndex < totalQuestions - 1) setQuestionIndex((i) => i + 1);
    else handleSubmit();
  }

  /** Go back to previous question or navigate back when at first */
  function handleBack() {
    if (questionIndex === 0) return navigation?.goBack?.();
    setQuestionIndex((i) => Math.max(0, i - 1));
  }

  /** Submit handler */
  async function handleSubmit() {
    console.log('Assessment responses:', responses);

    try {
      // Save assessment results to AsyncStorage for later submission with profile
      const assessmentResults = {
        responses,
        completedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        'assessment_results',
        JSON.stringify(assessmentResults),
      );

      // Save completion to AsyncStorage
      const stored = await AsyncStorage.getItem('onboarding_completed');
      const completed = stored ? JSON.parse(stored) : [];
      if (!completed.includes('a')) {
        completed.push('a');
        await AsyncStorage.setItem(
          'onboarding_completed',
          JSON.stringify(completed),
        );
      }

      Alert.alert('Submitted', 'Your assessment has been submitted.');

      // Navigate back to test screen
      router.back();
    } catch (err) {
      console.warn('Error saving completion:', err);
      Alert.alert('Submitted', 'Your assessment has been submitted.');
      router.back();
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Progress */}
      <View className="px-4 py-3">
        <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            style={{ width: `${progress}%` }}
            className="h-2 bg-[#1A78F2]"
          />
        </View>
        <Text className="text-sm text-gray-500 mt-2">
          {questionIndex + 1} of {totalQuestions}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white rounded-xl p-4 shadow-md">
          <Text className="text-base font-semibold mb-2">
            {currentQuestion.question}
          </Text>
          {currentQuestion.helpText ? (
            <Text className="text-sm text-gray-400 mb-2">
              {currentQuestion.helpText}
            </Text>
          ) : null}

          {/* Render question types */}
          {currentQuestion.type === 'single' &&
            currentQuestion.options?.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setResponse(currentQuestion.id, opt.id)}
                className={`flex-row items-center p-3 rounded-md mb-2 border ${responses[currentQuestion.id] === opt.id ? 'border-[#1A78F2]' : 'border-gray-200'}`}
              >
                <Text className="flex-1 text-gray-800">{opt.label}</Text>
                {responses[currentQuestion.id] === opt.id ? (
                  <Ionicons name="checkmark-circle" size={20} color="#1A78F2" />
                ) : (
                  <Ionicons name="ellipse-outline" size={20} color="#D1D5DB" />
                )}
              </TouchableOpacity>
            ))}

          {currentQuestion.type === 'multi' &&
            currentQuestion.options?.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => toggleMultiSelect(currentQuestion.id, opt.id)}
                className={`flex-row items-center p-3 rounded-md mb-2 border ${
                  (responses[currentQuestion.id] || []).includes(opt.id)
                    ? 'border-[#1A78F2]'
                    : 'border-gray-200'
                }`}
              >
                <Text className="flex-1 text-gray-800">{opt.label}</Text>
                {(responses[currentQuestion.id] || []).includes(opt.id) ? (
                  <Ionicons name="checkmark-circle" size={20} color="#1A78F2" />
                ) : (
                  <Ionicons name="square-outline" size={20} color="#D1D5DB" />
                )}
              </TouchableOpacity>
            ))}

          {currentQuestion.type === 'rating' && (
            <View className="flex-row items-center mt-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setResponse(currentQuestion.id, n)}
                  className="p-2"
                >
                  <Ionicons
                    name={
                      responses[currentQuestion.id] >= n
                        ? 'star'
                        : 'star-outline'
                    }
                    size={28}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentQuestion.type === 'text' && (
            <TextInput
              value={responses[currentQuestion.id] ?? ''}
              onChangeText={(t) => setResponse(currentQuestion.id, t)}
              placeholder="Type your answer"
              className="border border-gray-200 rounded-md p-3 mt-2"
            />
          )}

          {currentQuestion.type === 'info' &&
            (() => {
              return (
                <View className="mt-2">
                  <View className="mb-3">
                    <Text className="text-sm text-gray-600">
                      Review your answers and press Submit to finish.
                    </Text>
                  </View>

                  <View className="mt-3">
                    {Object.keys(responses).length === 0 ? (
                      <Text className="text-sm text-gray-400">
                        No answers yet.
                      </Text>
                    ) : (
                      Object.entries(responses).map(([k, v]) => (
                        <View
                          key={k}
                          className="flex-row justify-between py-2 border-b border-gray-100"
                        >
                          <Text className="text-sm text-gray-700">{k}</Text>
                          <Text className="text-sm text-gray-500">
                            {Array.isArray(v) ? v.join(', ') : String(v)}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                </View>
              );
            })()}
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View className="flex-row items-center justify-between mb-2 px-4 py-3 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleBack}
          className="px-4 py-3 rounded-xl border border-gray-200"
        >
          <Text>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="px-4 py-3 rounded-xl bg-[#1A78F2]"
        >
          <Text className="text-white">
            {questionIndex < totalQuestions - 1 ? 'Next' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
