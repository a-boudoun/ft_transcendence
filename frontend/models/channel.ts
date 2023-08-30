import { z } from 'zod';

const MAX_FILE_SIZE = 2500000; 

export const channelSchema = z.object({
    name: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(10, { message: "Username must be at most 10 characters long." }),
    image: z
    .any()
    .refine((file) => {
        if (file?.size === undefined)
        {
            return true;
        }
        else
            return file?.size <= MAX_FILE_SIZE
    }, `Max image size is 2.5MB.`)
    .optional(),
    type: z
    .any()
    .optional(),
    members: z
    .any(),
    password: z
    .string()
    .trim(),
    id: z
    .number()
    .int()
    .positive()
    .optional(),
    owner: z
    .any()
    .optional(),

});