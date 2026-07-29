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

//---------------------------------------------
const STREAM_NAME = "betteruptime:website"

type WebsiteEvent = {
    url: string,
    id: string
}

type MessageType = {
    id: string,
    message: {
        url: string,
        id: string
    }
}

async function xAdd({url, id}: WebsiteEvent) {
    await client.xAdd(
        STREAM_NAME,
        "*",
        {
            url,
            id
        }
    )
}

export async function xAddBulk(websites: WebsiteEvent[]) {
    //loop on all website and push into queue
    for(let i = 0; i < websites.length; i++) {
        await xAdd({
            url: (websites[i]?.url as string),
            id: (websites[i]?.id as string)
        })
    }
}

// read 5 data at a time from the group
export async function xReadGroup(consumerGroup: string, workerId: string): Promise<MessageType[] | undefined> {
    const res = await client.xReadGroup(
        consumerGroup,
        workerId,
        {
            key: STREAM_NAME,
            id: ">"
        }, {
            COUNT: 5
        }
    )
    //console.log(res);
    
    //@ts-ignore
    let messages: MessageType[] | undefined = res?.[0]?.messages;
    return messages;
}

export async function xAck(consumerGroup: string, eventId: string) {
    const res = await client.xAck(STREAM_NAME, consumerGroup, eventId);
}

// after completing all jobs(worker) it removes from pending list
export async function xAckBulk(consumerGroup: string, evenrsId: string[]) {
    evenrsId.map(eventId => xAck(consumerGroup, eventId));
}