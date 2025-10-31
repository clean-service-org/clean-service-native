import { View } from 'react-native';
import InputWithLabel from "@/components/Input";
import Button from "@/components/Button";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GenderPicker from "@/components/employee/signup/GenderPicker";
import { EmployeeSignUpFormSchema } from "@/schemas/employeeSignUpForm.schema";

type FormValues = z.infer<typeof EmployeeSignUpFormSchema>;

export default function SignUpPage() {
    const {
        control,
        handleSubmit,
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
                    <InputWithLabel value={value} onChangeText={(value) => onChange(value)} placeholder={"John Doe"} label={"Full Name"}/>
                )}
            />

            <Controller control={control} name={"gender"}
                        render={({ field: { onChange, value } }) => (
                            <GenderPicker value={value} onChange={(value) => onChange(value)} label={"Gender"}/>
                        )}
            />

            <Controller control={control} name={"vnid"}
                        render={({ field: { onChange, value } }) => (
                            <InputWithLabel value={value} onChangeText={(value) => onChange(value)} placeholder={"XXXXXXXXXX"} label={"Social Security Number"}/>
                        )}
            />

            <Controller control={control} name={"phoneNumber"}
                        render={({ field: { onChange, value } }) => (
                            <InputWithLabel value={value} onChangeText={(value) => onChange(value)} placeholder={"+84XXXXXXXXX"} label={"Phone Number"}/>
                        )}
            />

            <Controller control={control} name={"password"}
                        render={({ field: { onChange, value } }) => (
                            <InputWithLabel value={value} onChangeText={(value) => onChange(value)} placeholder={"At least 6 letters"} label={"Password"}/>
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


