import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string,
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log(token);

    if(!token) {
        return res.status(400).json({
            message: "Not authorised"
        })
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET!) as JwtPayload;
        (req as any).userId = decode.id;
    
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export default authMiddleware;