import axios from "axios";

const BASE_URL = "http://localhost:3000"

type Status = "Up" | "Down" | "Unknown"

interface Web {
    id: string; //
    url: string; //
    ticks: {
        status: Status; //
        response_time_ms: number; //
        createdAt: Date; //
        region: {
            name: string; //
        };
    }
};

export async function fetchWebsites(): Promise<Web[]> {
    const websites = await axios.get(`${BASE_URL}/api/v1/websites`, {
        withCredentials: true
    })
    //console.log(websites.data);

    return websites.data.websites;
}

export async function addWebsite(url: string) {
    const res = await axios.post(`${BASE_URL}/api/v1/website`, {
        url: url
    }, {
        withCredentials: true
    })

    console.log(res);
}