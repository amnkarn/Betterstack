import axios2 from "axios";
import { describe, expect, it, test } from "bun:test";

const BASE_URL = "http://localhost:3000";

const axios = axios2.create({ //to accept all status code
    validateStatus: () => true,
})

describe("Signup endpoint", () => {
    test("Isn't able to sign up if body is incorrect", async () => {
        const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            email: "aman" + Math.random(),
            password: "password"
        })

        expect(res.status).toBe(403);
        expect(false, "Control should not reach here");
    })

    test("Is able to sign up if body is correct", async () => {
        const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            username: "aman" + Math.floor(Math.random() * 1000),
            password: "password"
        })
        console.log(res.data.message);
        expect(res.status).toBe(201);
        expect(res.data.userId).toBeDefined();
    })

    test('User is able to sign up only once', async () => {
        const username = "aman" + Math.floor(Math.random() * 1000);
        const password = "123456";

        const response = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            username,
            password,
        })

        expect(response.status).toBe(201);
        expect(response.data.userId).toBeDefined();

        const updatedRequest = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            username,
            password,
        })

        expect(updatedRequest.status).toBe(400)
    })
})

describe("Signin endpoint", () => {
    test("Isn't able to sign in if body is incorrect", async () => {
        const username = "aman" + Math.random();

        const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            username: username,
            password: "password"
        })

        expect(res.status).toBe(201);
        expect(res.data.userId).toBeDefined();

        const signup = await axios.post(`${BASE_URL}/api/v1/user/signin`, {
            email: username,
            password: "password"
        })

        expect(signup.status).toBe(403);
    })

    test("Signin succeeds if username and password are correct", async () => {
        const username = "aman" + Math.random();

        const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
            username: username,
            password: "password"
        })

        expect(res.status).toBe(201);
        expect(res.data.userId).toBeDefined();

        const signin = await axios.post(`${BASE_URL}/api/v1/user/signin`, {
            username: username,
            password: "password"
        })

        expect(signin.status).toBe(200);
        expect(signin.data.token).toBeDefined();
    })
})