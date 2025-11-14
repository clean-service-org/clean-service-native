import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

interface OnboardingItem {
    id: string;
    source: any;
}

const {width} = Dimensions.get('window');
const data = [
    {id: '1', source: require('@/assets/images/onboarding-carousel/onboarding-carousel-1.png')},
    {id: '2', source: require('@/assets/images/onboarding-carousel/onboarding-carousel-2.png')},
    {id: '3', source: require('@/assets/images/onboarding-carousel/onboarding-carousel-3.png')},
] as OnboardingItem[];

export default function EmployeeOnboardingPage() {
    const [index, setIndex] = useState<Number>(0);

    const router = useRouter()

    return (
        <View className="flex flex-col flex-1 justify-start items-center pt-12 px-7 bg-background">
            <Carousel
                width={width}
                height={width}
                data={data}
                loop
                onSnapToItem={setIndex}
                autoPlay
                renderItem={({ item }: { item:OnboardingItem }) => (
                    <Image source={item.source} style={{width: '100%', height: '100%'}}/>
                )}
            />

            <View className="flex-row gap-2 self-center mt-1">
                {data.map((_, i) => (
                    <View
                        key={i}
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: 6,
                            backgroundColor: i === index ? '#1A78F2' : '#9ca3af',
                            opacity: i === index ? 1 : 0.5,
                        }}
                    />
                ))}
            </View>

            <View className="h-px w-full bg-gray-300/50 mt-5" />

            <View className={"flex-col justify-center items-center mt-5 gap-4 w-full"}>
                <Button
                    onPress={() => {
                        router.push("/employee/signup")
                    }}
                    className={"w-full"}
                >
                    Register
                </Button>

                <Text className={"font-light"}>
                    Already have an account?
                </Text>

                <Button
                    onPress={() => {
                        router.push("/employee/signin")
                    }}
                    className={"w-full bg-white border-[#1A78F2] border-2"}
                >
                    <Text className={"text-[#1A78F2]"}>
                        Login
                    </Text>
                </Button>
            </View>
        </View>
    );
}