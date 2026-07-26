import { Router, type Request, type Response } from "express";
import authMiddleware from "../../middleware/authMiddleware";
import prismaClient from "@repo/db/client";


const websiteRouter: Router = Router();

websiteRouter.post("/", authMiddleware,async (req: Request, res: Response) => {
    const userId = req.userId!;
    const url = req.body.url;
    if(!url) {
        return res.status(400).json({
            message: "Url is missing"
        })
    }

    try {
        const website = await prismaClient.website.create({
            data: {
                url: url,
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