import { z } from 'zod';
import get from "@/apis/client/get";

const MAX_FILE_SIZE = 2500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const signInSchema = z.object({
    username: z
    .string()
    .optional(),
    name: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(10, { message: "Username must be at most 10 characters long." })
    .refine(async (name) =>  {
        const isUser = await get(`/users/isUserExist/${name}`);
        return !isUser;
    }
    , "Name already exists.")
    .optional(),
    image: z
    .any()
    .refine((file) => {
        if (file?.size === undefined)
            return true;
        else {
            return ACCEPTED_IMAGE_TYPES.includes(file?.type);
        }
    }, `Only .jpg, .jpeg, .png and .webp formats are supported.`)
    .refine((file) => {
        if (file?.size === undefined)
            return true;
        else
            return (file?.size <= MAX_FILE_SIZE );
    }, `File size must be less than 2.5MB.`) 
    .optional()
});

export const userSchema = signInSchema.extend({
    baner: z
    .any()
    .optional(),
    fact2Auth: z
    .boolean()
    .optional(),
    level: z
    .number()
    .optional(),
    XP: z
    .number()
    .optional(),
});
