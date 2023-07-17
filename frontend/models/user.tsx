import { z } from 'zod';
import get from "@/apis/client/get";
import { userDto } from '@/dto/userDto';

const MAX_FILE_SIZE = 2500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const signInSchema = z.object({
    name: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(10, { message: "Username must be at most 10 characters long." })
    .refine(async (name) =>  {
        const isUser = await get(`/users/isUser/${name}`);
        return !isUser;
    }
    , "Name already exists."),
    image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 2.5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
});

export const userSchema = signInSchema.extend({
    fact2Auth: z
    .boolean(),
    level: z
    .number(),
    XP: z
    .number(),
});
