import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import dotenv from "dotenv";
dotenv.config({ path: "../../packages/db/.env" });

const DB_URL = process.env.DATABASE_URL;
if(!DB_URL) {
    throw new Error("DB_URL is missing");
}

const adapter = new PrismaPg({ connectionString: DB_URL });
const prismaClient = new PrismaClient({ adapter });

export default prismaClient;