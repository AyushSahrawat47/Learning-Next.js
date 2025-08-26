import {z} from 'zod';

export const usernameValidation  = z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(100, "Username must be at most 100 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers, and underscores");

  
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({message:"Invalid email address"}),
    password:z.string().min(6, {message:"password must be atleast 6 characters long"})
})