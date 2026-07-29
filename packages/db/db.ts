import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import { Pool } from "pg"
import dotenv from "dotenv";
dotenv.config({ path: "../../packages/db/.env" });

const DB_URL = process.env.DATABASE_URL;
if(!DB_URL) {
    throw new Error("DB_URL is missing");
}

const pool = new Pool({ connectionString: DB_URL })
const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({ adapter });

export default prismaClient;