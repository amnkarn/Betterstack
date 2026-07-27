import axios from "axios";
import { describe, expect, it, test } from "bun:test";

const BASE_URL = "http://localhost:3000";

describe("Signup endpoint", () => {
    test("Isnt able to sign up if body is incorrect", async () => {
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
                username: "aman" + Math.random(),
                password: "password"
            })

            expect(res.status).toBe(403);
            expect(false, "Control should not reach here");
        } catch (error) { }
    })

    test("Is able to sign up if body is correct", async () => {
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
                username: "aman" + Math.random(),
                password: "password"
            })

            expect(res.status).toBe(201);
            expect(res.data.id).toBeDefined();
        } catch (error) {
            
        }
    })

    test('User is able to sign up only once', async () => {
        const username = "aman" + Math.random();
        const password = "123456";

        try {
            const response = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
                username,
                password,
            })

            expect(response.status).toBe(201);
            expect(response.data.id).toBeDefined();

            const updatedRequest = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
                username,
                password,
            })

            expect(updatedRequest.status).toBe(400)   
        } catch (error) {
            
        }
    })
})

describe("Signin endpoint", () => {
    test("Isn't able to sign in if body is incorrect", async () => {
        try {
            const username = "aman" + Math.random();
            
            const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
                username: username,
                password: "password"
            })

            await axios.post(`${BASE_URL}/user/signin`, {
                email: username,
                password: "password"
            })
            expect(false, "Control shouldnt reach here")
        
        } catch(e) {
        
        }
    })

    test("Signin succeeds if username and password are correct", async () => {
        const username = "aman" + Math.random();

        try {
            const res = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
                username: username,
                password: "password"
            })

            expect(res.status).toBe(201);
            expect(res.data.id).toBeDefined();

            const signin = await axios.post(`${BASE_URL}/api/v1/user/signin`, {
                username: username,
                password: "password"
            })

            expect(signin.status).toBe(200);
            expect

        } catch (error) { }
    })

   
})