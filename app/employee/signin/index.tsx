import Logo from '@/assets/images/Logo.svg';
import Button from "@/components/Button";
import InputWithLabel from "@/components/Input";
import { EmployeeSignInFormSchema } from "@/schemas/employeeSignInForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from 'react-native';
import { z } from "zod";
type FormValues = z.infer<typeof EmployeeSignInFormSchema>;

export default function SignInPage() {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(EmployeeSignInFormSchema),
        mode: "onSubmit",
        defaultValues: {
            password: "",
            phoneNumber: ""
        },
    });

    const onSubmit = (data: FormValues) => {
        console.log(data);

        alert(data);
    };

    return (
        <View className="flex flex-col flex-1 justify-start items-center pt-20 px-7 bg-background">

            <View className={"flex-col justify-center items-center mb-10 gap-2"}>
                <Logo width={113.65} height={45} />
                <Text className="text-[#303030] text-right text-[12px] italic font-light leading-normal tracking-[0.036px]">For Cleaner</Text>
            </View>

            <Controller control={control} name={"phoneNumber"}
                        render={({ field: { onChange, value } }) => (
                            <InputWithLabel value={value} onChangeText={(value) => onChange(value)} placeholder={"+84XXXXXXXXX"} label={"Phone Number"} errorMessage={errors.phoneNumber?.message}/>
                        )}
            />

            <Controller control={control} name={"password"}
                        render={({ field: { onChange, value } }) => (
                            <InputWithLabel value={value} onChangeText={(value) => onChange(value)} placeholder={"At least 6 letters"} label={"Password"} errorMessage={errors.password?.message}/>
                        )}
            />

            <View className={"mb-4 w-full flex-row justify-end"}>
                <Link href={"/employee/forgot-password"}>
                    <Text className="text-blue-500">Forgot Password?</Text>
                </Link>
            </View>

            <Button
                onPress={handleSubmit(onSubmit)}
                className={"w-full"}
            >
                Login
            </Button>

            <View className={"flex-row justify-center items-center gap-1 mt-4 "}>
                <Text className={"font-light"}>Don't have an account?</Text>
                <Link href={"/employee/signup"}>
                    <Text className="text-blue-500">Register</Text>
                </Link>
            </View>
        </View>
    );
}


