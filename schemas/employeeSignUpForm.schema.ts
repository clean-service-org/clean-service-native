import { z } from "zod";

export const EmployeeSignUpFormSchema = z.object({
    fullName: z.string().min(1, "Required"),
    vnid: z.string().min(10, "Required"),
    password: z.string().min(6, "Min 6 characters"),
    gender: z.enum(["male", "female"]),
    phoneNumber: z.string().min(10, "Required"),
});

export type EmployeeSignUpFormValues = z.infer<typeof EmployeeSignUpFormSchema>;
