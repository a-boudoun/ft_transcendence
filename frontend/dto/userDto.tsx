import {z } from 'zod';
import { signInSchema, userSchema} from "@/models/user";

type userDto = z.infer<typeof userSchema>

type signInDto = z.infer<typeof signInSchema>

export type {userDto, signInDto};
