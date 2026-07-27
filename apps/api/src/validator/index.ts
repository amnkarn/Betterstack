import { z } from "zod";

export const UserInputSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const CreateWebsiteInput = z.object({
    url: z.string(),
})