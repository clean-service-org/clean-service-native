import { z } from "zod";

export const EmployeeSignInFormSchema = z.object({
    password: z.string().min(6, "Min 6 characters"),
    phoneNumber: z.string().min(10, "Required"),
});

export type EmployeeSignInFormValues = z.infer<typeof EmployeeSignInFormSchema>;