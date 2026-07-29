import prismaClient from "@repo/db/client";
import { xAddBulk } from "@repo/redis/client";

async function main() {
    try {
        let website = await prismaClient.website.findMany({
            select: {
                id: true,
                url: true,
            }
        });
        console.log(website.length);

        await xAddBulk(website.map(w => ({
            id: w.id,
            url: w.url
        })))
    } catch (error) {
        console.error("Error in pusher main:", error);
    }
}

setInterval(() => {
    main();
}, 3 * 60 * 1000);

main();