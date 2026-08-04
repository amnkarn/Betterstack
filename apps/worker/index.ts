import { xAckBulk, xReadGroup } from "@repo/redis/client";
import axios from "axios";
import prismaClient from "@repo/db/client";

const REGION_ID = process.env.REGION_ID || "3d9b2acf-f03f-4895-97c3-ce03fb2d3cb3";
const WORKER_ID = process.env.WORKER_ID || "1";


if(!REGION_ID || !WORKER_ID) {
    throw new Error("REGION_ID or WORKER_ID is missing");
}

async function main() {
    while(1) { // run infinite loop
        //read 5 latest data at a time from group
        const res = await xReadGroup(REGION_ID, WORKER_ID);
        if(!res) {
            continue;
        }
        
        //fetch all the website and create entry in db
        let promises = res.map(({message}) => fetchWebsite(message.url, message.id));
        await Promise.all(promises); //wait till fullfill the work
        console.log(promises.length);

        xAckBulk(REGION_ID!, res.map(({id}) => id)); //clear from the queue
    }
}

async function fetchWebsite(url: string, websiteId: string) {
    return new Promise<void>((resolve, reject) => {
        const startTime = Date.now();

        axios.get(url)
            //if website is fetched easily, then status is 'Up'
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
            //if website fetch failed, then status is 'Down'
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