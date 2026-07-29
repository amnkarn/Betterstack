import { xAckBulk, xReadGroup } from "@repo/redis/client";
import axios from "axios";
import prismaClient from "@repo/db/client";

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if(!REGION_ID || !WORKER_ID) {
    throw new Error("REGION_ID or WORKER_ID is missing");
}

async function main() {
    while(1) {
        const res = await xReadGroup(REGION_ID, WORKER_ID);
        if(!res) {
            continue;
        }
        
        let promises = res.map(({message}) => fetchWebsite(message.url, message.id));
        await Promise.all(promises);
        console.log(promises.length);

        xAckBulk(REGION_ID!, res.map(({id}) => id));
    }
}

async function fetchWebsite(url: string, websiteId: string) {
    return new Promise<void>((resolve, reject) => {
        const startTime = Date.now();

        axios.get(url)
            .then(async () => {
                const endTime = Date.now();
                await prismaClient.website_tick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Up",
                        region_id: (REGION_ID as string),
                        website_id: websiteId,
                    }
                })
                resolve();
            })
            .catch(async () => {
                const endTime = Date.now();
                await prismaClient.website_tick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Down",
                        region_id: (REGION_ID as string),
                        website_id: websiteId
                    }
                })
                resolve();
            })
    })
}

main();