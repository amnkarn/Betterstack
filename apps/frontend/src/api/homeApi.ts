import axios from "axios";

const BASE_URL = "http://localhost:3000"


export async function fetchWebsites() {
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