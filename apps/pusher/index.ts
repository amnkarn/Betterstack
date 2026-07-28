import prismaClient from "@repo/db/client";
import { xAddBulk } from "@repo/redis/client";

async function main() {
    while(true) {
        try {
            let website = await prismaClient.website.findMany({
                select: {
                    id: true,
                    url: true,
                }
            });
    
            await xAddBulk(website.map(w => ({
                id: w.id,
                url: w.url
            })))
        } catch (error) {
            console.error("Error in pusher main:", error);
        }
    }

}

setInterval(() => {
    main();
}, 3 * 1000);