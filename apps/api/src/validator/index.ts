import { z } from "zod";

export const UserInputSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(3),
})

export const CreateWebsiteInput = z.object({
    url: z.string().min(5),
})

export const DeleteWebParams = z.object({
    websiteId: z.string().uuid({ message: "Invalid website ID format. Must be a valid UUID." })
})