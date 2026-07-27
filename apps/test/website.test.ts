import axios2 from "axios";
import { beforeAll, describe, expect, it, test } from "bun:test";

const BASE_URL = "http://localhost:3000";

const axios = axios2.create({ //to accept all status code
    validateStatus: () => true,
    withCredentials: true,
})


describe("Website endpoint", () => {
    let jwt: string;

    beforeAll( async () => {
        const username = "aman" + Math.random();

        await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            username: username,
            password: "password"
        })

        const login = await axios.post(`${BASE_URL}/api/v1/user/signin`, {
            username: username,
            password: "password"
        })

        jwt = login.data.token;
    })
    
    test("Website not created, if user is not logged in", async () => {
        const website = await axios.post(`${BASE_URL}/api/v1/website`, {
            url: "asdf" + Math.random() + "com",
        });

        console.log(website.data)
        expect(website.status).toBe(400);
    })

    test("Website not created, if url is not present", async () => {
        const website = await axios.post(`${BASE_URL}/api/v1/website`, {}, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });

        //console.log(jwt);
        //console.log(website.data)
        expect(website.status).toBe(403);
    })

    test("Website should create, if all fields are correct", async () => {
        const website = await axios.post(`${BASE_URL}/api/v1/website`, {
            url: "asdf" + Math.random() + "com",
        }, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        })

        expect(website.status).toBe(201);
        expect(website.data.id).toBeDefined();
    })
})

describe("Website status endpoiont", () => {
    let jwt: string;
    let userId: string;
    let websiteId: string;
    let websiteUrl: string = "asdf" + Math.random() + "com";

    beforeAll( async () => {
        const username = "aman" + Math.random();

        const user = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            username: username,
            password: "password"
        })
        userId = user.data.userId;

        const login = await axios.post(`${BASE_URL}/api/v1/user/signin`, {
            username: username,
            password: "password"
        })

        jwt = login.data.token;

        //create the website
        const website = await axios.post(`${BASE_URL}/api/v1/website`, {
            url: websiteUrl,
        }, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        })

        websiteId = website.data.id;
    })

    test("Status should not show, if user is not logged in", async () => {
        const website = await axios.get(`${BASE_URL}/api/v1/status/${websiteId}`);

        expect(website.status).toBe(400);
    })

    test("Status should not show, if website id is wrong", async () => {
        const website = await axios.get(`${BASE_URL}/api/v1/status/asdf453`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });

        expect(website.status).toBe(400);
        expect(website.data.message).toBe("website not found")
    })

    test("Status should show if website id and jwt token avilabel", async () => {
        const website = await axios.get(`${BASE_URL}/api/v1/status/${websiteId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        expect(website.status).toBe(200);
        expect(website.data.user_id).toBe(userId);
        expect(website.data.url).toBe(websiteUrl)
    })
})