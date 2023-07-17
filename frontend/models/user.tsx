import { z } from 'zod';
import get from "@/apis/client/get";

const MAX_FILE_SIZE = 2500000;

export const signInSchema = z.object({
    name: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(10, { message: "Username must be at most 10 characters long." })
    .refine(async (name) =>  {
        const isUser = await get(`/users/isUserExist/${name}`);
        return !isUser;
    }
    , "Name already exists."),
    image: z
    .any()
    .refine((file) => {
        if (typeof file === "string")
            return true;
        else
            return file.size <= MAX_FILE_SIZE
    }, `Max image size is 2.5MB.`)
});

export const userSchema = signInSchema.extend({
    fact2Auth: z
    .boolean(),
    level: z
    .number(),
    XP: z
    .number(),
});
