import { Router } from "express";
import userRouter from "./user.route";
import websiteRouter from "./website.route";
import prismaClient from "@repo/db/client";
import authMiddleware from "../../middleware/authMiddleware";

const v1Route = Router();

v1Route.use("/user", userRouter);

v1Route.use("/website", websiteRouter)

v1Route.get("/websites", authMiddleware, async (req, res) => {
    try {
        const websites = await prismaClient.website.findMany({
            where: {
                user_id: (req as any).userId,
            },
            include: {
                ticks: {
                    include: {
                        region: true
                    },
                    orderBy: [{
                        createdAt: "desc"
                    }],
                    take: 1
                }
            }
        })
        
        res.status(200).json({
            message: "All websites fetched successfully",
            websites
        });

    } catch (error) {
        console.log("Error in fetch all website routes", error);
        res.status(500).json({
            message: "something went wrong",
        })
    }
})

v1Route.get("/status/:websiteId", authMiddleware, async (req, res) => {
    const { websiteId } = req.params;
    if(!websiteId) {
        return res.status(400).json({ message: "website id is missing" });
    }

    const userId = (req as any).userId!;

    try {
        const website = await prismaClient.website.findFirst({
            where: {
                id: (websiteId as string),
                user_id: userId,
            },
            include: {
                ticks: {
                    orderBy: [{
                        createdAt: "desc"
                    }],
                    take: 10, //3 min interval
                }
            }
        })
    
        if(!website) {
            return res.status(400).json({
                message: "website not found"
            })
        }
    
        res.status(200).json({
            url: website.url,
            id: website.id,
            user_id: website.user_id
        })
    } catch (error) {
        console.log("Error in fetching website status", error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

export default v1Route;