import { z } from "zod";

export const UserInputSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3).max(50),
})

export const CreateWebsiteInput = z.object({
    url: z.string().min(5),
})