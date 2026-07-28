import { createClient } from "redis";

const REDIS_URI = "redis://localhost:6379";

const client = createClient({ url: REDIS_URI });
client.on("error", (err) => {
    console.log("Error in reddis client", err);
})

async function connetReddis() {
    try {
        await client.connect()
    } catch (error) {
        
    }
}

connetReddis();


type WebsiteEvent = {
    url: string,
    id: string
}

async function xAdd({url, id}: WebsiteEvent) {
    await client.xAdd(
        "betteruptim:website",
        "*",
        {
            url,
            id
        }
    )
}

export async function xAddBulk(websites: WebsiteEvent[]) {
    for(let i = 0; i < websites.length; i++) {
        await xAdd({
            url: (websites[i]?.url as string),
            id: (websites[i]?.id as string)
        })
    }
}

