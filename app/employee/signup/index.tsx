import Button from "@/components/Button";
import GenderPicker from "@/components/employee/signup/GenderPicker";
import InputWithLabel from "@/components/Input";
import { EmployeeSignUpFormSchema } from "@/schemas/employeeSignUpForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View } from 'react-native';
import { z } from "zod";

type FormValues = z.infer<typeof EmployeeSignUpFormSchema>;

export default function SignUpPage() {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(EmployeeSignUpFormSchema),
        mode: "onSubmit",
        defaultValues: {
            fullName: "",
            vnid: "",
            gender: "male",
            password: "",
            phoneNumber: ""
        },
    });

    const onSubmit = (data: FormValues) => {
        console.log(data);

        alert(data);
    };

    return (
        <View className="flex flex-col flex-1 justify-start items-center pt-5 px-7 bg-background">

            <Controller control={control} name={"fullName"}
                render={({ field: { onChange, value } }) => (
                    <InputWithLabel value={value} onChangeText={(value) => onChange(value)} placeholder={"John Doe"} label={"Full Name"} errorMessage={errors.fullName?.message}/>
                )}
            />

            <Controller control={control} name={"gender"}
                        render={({ field: { onChange, value } }) => (
                            <GenderPicker value={value} onChange={(value) => onChange(value)} label={"Gender"}/>
                        )}
            />

            <Controller control={control} name={"vnid"}
                        render={({ field: { onChange, value } }) => (
                            <InputWithLabel value={value} onChangeText={(value) => onChange(value)} placeholder={"XXXXXXXXXX"} label={"Social Security Number"} errorMessage={errors.vnid?.message}/>
                        )}
            />

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

            <Button
                onPress={handleSubmit(onSubmit)}
                className={"w-full"}
            >
                Register
            </Button>
        </View>
    );
}


