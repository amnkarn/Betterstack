import { Router, type Request, type Response } from "express";
import authMiddleware from "../../middleware/authMiddleware";
import prismaClient from "@repo/db/client";
import { CreateWebsiteInput } from "../../validator";


const websiteRouter: Router = Router();

websiteRouter.post("/", authMiddleware,async (req: Request, res: Response) => {
    const parsedData = CreateWebsiteInput.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Url is missing"
        })
    }
    const userId = req.userId!;
    
    try {
        const website = await prismaClient.website.create({
            data: {
                url: parsedData.data.url,
                user_id: userId,
                time_added: new Date(),
            }
        })

        return res.status(200).json({
            id: website.id
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

export default websiteRouter;