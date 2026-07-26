import prismaClient from "@repo/db/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRouter: Router = Router();

userRouter.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({
            message: "Required fields are missing"
        })
    }

    try {
        const isAlreadyRegistered = await prismaClient.user.findFirst({
            where: {
                username,
                password
            }
        })

        if(isAlreadyRegistered) {
            res.status(400).json({
                message: "User already exists with this email",
                
            })
        }

        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prismaClient.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        return res.status(201).json({
            message: "User created",
            userId: user.id
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

userRouter.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({
            message: "Required fields are missing"
        })
    }

    try {
        const user = await prismaClient.user.findFirst({
            where: {
                username
            }
        })
        if(!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid) {
            return res.status(401).json({
                message: "Wrong password",
            })
        }

        const token = await jwt.sign({
            id: user.id
        }, process.env.SECRET!, {
            expiresIn: "1d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Loged in",
            token: token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

export default userRouter;