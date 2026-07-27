import axios from "axios";
import { describe, expect, it, test } from "bun:test";

const BASE_URL = "http://localhost:3000";

describe("User auth endpoint", () => {
    test("User should not singup without username", async () => {
        const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            password: `amnkarn-${Math.random() * 100}`,
        })

        expect(res.status).toBe(400);
    })

    test("User should not signup without password", async () => {
        const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            username: `amnkarn-${Math.random() * 100}`,
        })

        expect(res.status).toBe(400);
    })
})

//describe("website get's created", () => {

//})